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
// @input Component.Text progressText 
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint
// @input Component.Text SetCompleteText 

if (script.isHost) {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = true;
    if (script.RepText) script.RepText.enabled = false;
    if (script.TimerText) script.TimerText.enabled = false;

    var repCount = 0;
    var totalReps = 5;

    // State tracking and constants 
    var baselineHipY = null;
    var minHipY = null;
    var inSquat = false;
    var ascendingTriggered = false;
    var squatWasLowEnough = false;
    var goLowerPlayed = false;
    var TRACKED_FRAMES_REQUIRED = 5;
    var trackedFrames = 0;
    var trackingLost = false;
    var baselinePendingReset = false;
    var baselineResetFrames = 0;
    var BASELINE_STANDING_FRAMES = 5;
    var lastHipY = null;
    var MAX_HIP_JUMP = 15.0;
    var KNEEANGLETHRESHOLD = 150;
    var KNEEANGLE_STANDING = 150;
    var MINMOVE = 5.0;
    var STANDEPSILON = 10.0;
    var MIN_SQUAT_DEPTH = -35.0;

    var currentSquatStage = "goDown";
    var lastSquatStageSent = "";
    var sentRepCount = 0;

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
        currentSquatStage = "goDown";
    }

    function isStanding(hipY, kneeAngle, baselineHipY) {
        return (Math.abs(hipY - baselineHipY) < STANDEPSILON) && (kneeAngle > KNEEANGLE_STANDING);
    }

    function sendSquatUpdate() {
        var body = {
            repCount: repCount,
            totalReps: totalReps,
            squatStage: currentSquatStage,
            lastUpdate: (new Date()).toISOString()
        };
        var req = RemoteServiceHttpRequest.create();
        req.url = script.apiEndpoint + "/squat";
        req.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
        req.headers = { "Content-Type": "application/json" };
        req.body = JSON.stringify(body);

        script.serviceModule.performHttpRequest(req, function(response) {
            print("[SquatForm.js] Status: " + response.statusCode + " Body: " + response.body);
        });
        lastSquatStageSent = currentSquatStage;
        sentRepCount = repCount;
    }

    function updateProgressBar() {
        if (!script.progressText) return;

        // Check if finished
        var complete = (repCount >= totalReps);

        if (complete) {
            // Hide all UI except "Set Complete!"
            if (script.progressText) script.progressText.enabled = false;
            if (script.RepText) script.RepText.enabled = false;
            if (script.TimerText) script.TimerText.enabled = false;
            if (script.SetCompleteText) {
                script.SetCompleteText.enabled = true;
            }
        } else {

            var filled = Math.floor((repCount / totalReps) * 10);
            var bar = "";
            for (var i = 0; i < 10; i++) {
                bar += (i < filled) ? "█" : "░";
            }
            script.progressText.text = bar + " " + repCount + "/" + totalReps;
            // Show all UI except "Set Complete"
            if (script.progressText) script.progressText.enabled = true;
            if (script.RepText) script.RepText.enabled = false;  // RepText may be used elsewhere
            if (script.TimerText) script.TimerText.enabled = false;
            if (script.SetCompleteText) script.SetCompleteText.enabled = false;
        }
    }


    //Initial update
    updateProgressBar();

    // ---- MAIN LOGIC ----
    function update() {
        if (!jointsAreTracked()) { resetSquatState(); return; }

        var hipY = get2DPosition(script.hip).y;
        var kneeAngle = getKneeAngle(script.hip, script.knee, script.ankle);

        if (lastHipY !== null && Math.abs(hipY - lastHipY) > MAX_HIP_JUMP) {
            resetSquatState();
            lastHipY = hipY;
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

        var phaseChanged = false;
        var squatDepth = hipY - baselineHipY;

        if (!inSquat && Math.abs(hipY - baselineHipY) > MINMOVE && kneeAngle < KNEEANGLETHRESHOLD) {
            inSquat = true;
            minHipY = hipY;
            squatWasLowEnough = false;
            goLowerPlayed = false;
            currentSquatStage = "goDown";
            phaseChanged = true;
        }

        if (inSquat) {
            if (hipY < minHipY || minHipY === null) minHipY = hipY;
            if (squatDepth <= MIN_SQUAT_DEPTH) {
                if (!squatWasLowEnough) {
                    squatWasLowEnough = true;
                    currentSquatStage = "liftup";
                    phaseChanged = true;
                }
            }
            if (!squatWasLowEnough) {
                if (currentSquatStage !== "goDown") {
                    currentSquatStage = "goDown";
                    phaseChanged = true;
                }
            }
            if (!ascendingTriggered && kneeAngle > KNEEANGLETHRESHOLD && hipY > minHipY + STANDEPSILON) {
                ascendingTriggered = true;
                if (!squatWasLowEnough && !goLowerPlayed) {
                    goLowerPlayed = true;
                    if (script.lowCueAudio) script.lowCueAudio.play(1);
                }
            }
            if (ascendingTriggered && standingNow && squatWasLowEnough) {
                if (script.goodCueAudio) script.goodCueAudio.play(1);
                repCount++;
                updateProgressBar();
                inSquat = false;
                ascendingTriggered = false;
                squatWasLowEnough = false;
                minHipY = null;
                goLowerPlayed = false;
                baselinePendingReset = true;
                baselineResetFrames = 0;
                currentSquatStage = "goDown";
                phaseChanged = true;
            }
        }

        if (isStanding(hipY, kneeAngle, baselineHipY)) {
            if (inSquat) {
                inSquat = false;
                ascendingTriggered = false;
                squatWasLowEnough = false;
                minHipY = null;
                goLowerPlayed = false;
            }
        }

        if (phaseChanged || repCount !== sentRepCount) {
            sendSquatUpdate();
        }
    }

    // Call updateProgressBar e
    var updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        update(); 
        updateProgressBar(); 
    });

} else {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = false;
    if (script.RepText) script.RepText.enabled = true;
    if (script.TimerText) script.TimerText.enabled = true;
}

