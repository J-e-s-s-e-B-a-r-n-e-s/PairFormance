// SquatForm.js

// @input bool isHost = false
// @input SceneObject hip
// @input SceneObject knee
// @input SceneObject ankle
// @input Component.AudioComponent goodCueAudio
// @input Component.AudioComponent lowCueAudio
// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint

if (script.isHost) {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = true;
    if (script.RepText) script.RepText.enabled = false;
    if (script.TimerText) script.TimerText.enabled = false;

    var repCount = 0;
    var totalReps = 12;

    // Squat detection and timer state
    var baselineHipY = null;
    var minHipY = null;
    var inSquat = false;
    var ascendingTriggered = false;
    var squatWasLowEnough = false;
    var goLowerPlayed = false;
    var trackedFrames = 0;
    var trackingLost = false;
    var frameCount = 0;
    var baselinePendingReset = false;
    var baselineResetFrames = 0;
    var lastHipY = null;
    var MAX_HIP_JUMP = 15.0;
    var KNEEANGLETHRESHOLD = 150;
    var KNEEANGLE_STANDING = 150;
    var MINMOVE = 5.0;
    var STANDEPSILON = 10.0;
    var MIN_SQUAT_DEPTH = -14.0;
    var BASELINE_STANDING_FRAMES = 5;
    var TRACKED_FRAMES_REQUIRED = 5;

    // Timer/Stage State
    var squatStage = "idle";
    var goDownCounter = 3;
    var goDownProgress = 0;
    var liftUpCounter = 1;
    var squatInterrupted = false;
    var squatAtBottomFrame = null;

    function get2DPosition(obj) {
        var pos = obj.getTransform().getWorldPosition();
        return { x: pos.x, y: pos.y };
    }

    function getKneeAngle(hip, knee, ankle) {
        var a = get2DPosition(hip), b = get2DPosition(knee), c = get2DPosition(ankle);
        var BA = { x: a.x - b.x, y: a.y - b.y }, BC = { x: c.x - b.x, y: c.y - b.y };
        var dot = BA.x * BC.x + BA.y * BC.y;
        var lenBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y), lenBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
        var angle = Math.acos(dot / (lenBA * lenBC)) * 180 / Math.PI;
        return angle;
    }

    function isTracked(obj) {
        var t = obj.getTransform();
        return typeof t.isTracked !== "undefined" ? t.isTracked : true;
    }

    function jointsAreTracked() {
        return isTracked(script.hip) && isTracked(script.knee) && isTracked(script.ankle);
    }

    function resetSquatState() {
        baselineHipY = null;
        minHipY = null;
        inSquat = false;
        ascendingTriggered = false;
        squatWasLowEnough = false;
        goLowerPlayed = false;
        trackedFrames = 0;
        trackingLost = true;
        baselinePendingReset = false;
        baselineResetFrames = 0;
        lastHipY = null;
        squatStage = "idle";
        goDownCounter = 3;
        goDownProgress = 0;
        liftUpCounter = 1;
        squatInterrupted = false;
        squatAtBottomFrame = null;
    }

    function isStanding(hipY, kneeAngle, baselineHipY) {
        return (Math.abs(hipY - baselineHipY) < STANDEPSILON) && (kneeAngle > KNEEANGLE_STANDING);
    }

    function sendSquatState() {
        var req = RemoteServiceHttpRequest.create();
        req.url = script.apiEndpoint + "/squat";
        req.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
        req.headers = { "Content-Type": "application/json" };
        req.body = JSON.stringify({
            repCount: repCount,
            totalReps: totalReps,
            squatStage: squatStage,
            goDownCounter: goDownCounter,
            liftUpCounter: liftUpCounter,
            squatInterrupted: squatInterrupted,
            lastUpdate: (new Date()).toISOString()
        });
        script.serviceModule.performHttpRequest(req, function(response) {
            print("[SquatForm.js] Status: " + response.statusCode + " Body: " + response.body);
        });
    }

    function sendSquatUpdate() {
        repCount++;
        squatStage = "completed";
        sendSquatState();
        var req = RemoteServiceHttpRequest.create();
        req.url = script.apiEndpoint + "/squat";
        req.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
        req.headers = { "Content-Type": "application/json" };
        req.body = JSON.stringify({
            repCount: repCount,
            totalReps: totalReps,
            squatStage: squatStage,
            goDownCounter: 3,
            liftUpCounter: 1,
            squatInterrupted: false,
            lastUpdate: (new Date()).toISOString()
        });
        script.serviceModule.performHttpRequest(req, function(response) {
            print("[SquatForm.js] Status: " + response.statusCode + " Body: " + response.body);
        });
    }

    function update() {
        frameCount++;
        if (!jointsAreTracked()) { resetSquatState(); sendSquatState(); return; }
        var hipY = get2DPosition(script.hip).y;
        var kneeAngle = getKneeAngle(script.hip, script.knee, script.ankle);

        if (lastHipY !== null && Math.abs(hipY - lastHipY) > MAX_HIP_JUMP) {
            resetSquatState();
            lastHipY = hipY;
            sendSquatState();
            return;
        }
        lastHipY = hipY;

        if (trackedFrames < TRACKED_FRAMES_REQUIRED) {
            trackedFrames++;
            if (trackedFrames === TRACKED_FRAMES_REQUIRED) {
                baselineHipY = hipY;
                trackingLost = false;
            }
            return;
        }

        if (trackingLost) {
            baselineHipY = hipY;
            trackingLost = false;
        }

        var standingNow = isStanding(hipY, kneeAngle, baselineHipY);

        if (baselinePendingReset) {
            if (standingNow) {
                baselineResetFrames++;
                if (baselineResetFrames >= BASELINE_STANDING_FRAMES) {
                    baselineHipY = hipY;
                    baselinePendingReset = false;
                    baselineResetFrames = 0;
                }
            } else {
                baselineResetFrames = 0;
            }
        }

        // Start descent
        if (!inSquat && Math.abs(hipY - baselineHipY) > MINMOVE && kneeAngle < KNEEANGLETHRESHOLD) {
            inSquat = true;
            minHipY = hipY;
            squatWasLowEnough = false;
            goLowerPlayed = false;
            goDownCounter = 3;
            goDownProgress = 0;
            liftUpCounter = 1;
            squatStage = "descending";
            squatInterrupted = false;
            squatAtBottomFrame = null;
        }

        if (inSquat) {
            if (hipY < minHipY || minHipY === null) minHipY = hipY;

            var squatDepth = hipY - baselineHipY;

            // Down phase timer: decrement as user goes deeper in descent (simulate for each -MIN_SQUAT_DEPTH/3 progressed)
            if (!squatWasLowEnough) {
                if (Math.abs(squatDepth) >= ((-MIN_SQUAT_DEPTH) / 3) * (goDownProgress + 1) && goDownCounter > 1) {
                    goDownProgress++;
                    goDownCounter--;
                }
                squatStage = "descending";
            }
            sendSquatState();

            // At bottom/hold
            if (!squatWasLowEnough && squatDepth <= MIN_SQUAT_DEPTH) {
                squatWasLowEnough = true;
                squatStage = "bottom";
                liftUpCounter = 1;
                squatAtBottomFrame = frameCount;
            }
            if (squatWasLowEnough && frameCount - squatAtBottomFrame === 5) {
                squatStage = "bottom";
                liftUpCounter = 1;
                sendSquatState();
            }

            // Begin ascent
            if (!ascendingTriggered && kneeAngle > KNEEANGLETHRESHOLD && hipY > minHipY + STANDEPSILON) {
                ascendingTriggered = true;
                if (!squatWasLowEnough && !goLowerPlayed) {
                    goLowerPlayed = true;
                    if (script.lowCueAudio) script.lowCueAudio.play(1);
                    squatStage = "interrupted";
                    squatInterrupted = true;
                    sendSquatState();
                }
            }

            // Ascent
            if (ascendingTriggered && !standingNow && squatWasLowEnough) {
                squatStage = "ascending";
                liftUpCounter++;
                sendSquatState();
            }

            // Finished standing, count rep if squat was deep enough
            if (ascendingTriggered && standingNow && squatWasLowEnough) {
                if (script.goodCueAudio) script.goodCueAudio.play(1);
                squatStage = "completed";
                squatInterrupted = false;
                sendSquatUpdate();
                inSquat = false;
                ascendingTriggered = false;
                squatWasLowEnough = false;
                minHipY = null;
                goLowerPlayed = false;
                baselinePendingReset = true;
                baselineResetFrames = 0;
                goDownCounter = 3;
                goDownProgress = 0;
                liftUpCounter = 1;
                squatAtBottomFrame = null;
            }

            // Interrupted rep (didn't go low enough)
            if (ascendingTriggered && standingNow && !squatWasLowEnough) {
                squatStage = "interrupted";
                squatInterrupted = true;
                sendSquatState();
                inSquat = false;
                ascendingTriggered = false;
                squatWasLowEnough = false;
                minHipY = null;
                goLowerPlayed = false;
                baselinePendingReset = true;
                baselineResetFrames = 0;
                goDownCounter = 3;
                goDownProgress = 0;
                liftUpCounter = 1;
                squatAtBottomFrame = null;
            }
        } else {
            ascendingTriggered = false;
            minHipY = null;
            squatWasLowEnough = false;
            goLowerPlayed = false;
        }
    }

    var updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(update);
} else {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = false;
    if (script.RepText) script.RepText.enabled = true;
    if (script.TimerText) script.TimerText.enabled = true;
}
