// HUDdisplay.js

// @input bool isHost = false
// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input int totalReps = 12
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint

if (!script.isHost) {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = false;
    if (script.RepText) script.RepText.enabled = true;
    if (script.TimerText) script.TimerText.enabled = true;

    var pollInterval = 0.2; // seconds
    var lastPoll = 0.0;
    var currentRepCount = 0;
    var totalReps = script.totalReps || 12;

    // Countdown state
    var lastSquatStage = "standing";
    var countdownDuration = 3; // seconds for "Hold"
    var countdownStartTime = null;
    var isCountingDown = false;

    function updateHUD(repsRemaining) {
        if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    }

    function updateTimerDisplay(squatStage) {
        if (!script.TimerText) return;

        var now = getTime();

        // Start a countdown when squat starts descending or hits bottom
        if ((squatStage === "descending" || squatStage === "bottom") && !isCountingDown) {
            countdownStartTime = now;
            isCountingDown = true;
        }

        // Countdown logic for hold at bottom
        if ((squatStage === "descending" || squatStage === "bottom") && isCountingDown && countdownStartTime !== null) {
            var elapsed = now - countdownStartTime;
            var remaining = Math.max(0, countdownDuration - Math.floor(elapsed));
            script.TimerText.text = "Hold: " + remaining;
            if (remaining === 0) isCountingDown = false;
        } else if (squatStage === "ascending") {
            script.TimerText.text = "Lift Up";
            isCountingDown = false;
        } else if (squatStage === "completed") {
            script.TimerText.text = "Good Rep!";
            isCountingDown = false;
        } else if (squatStage === "interrupted") {
            script.TimerText.text = "Try Deeper!";
            isCountingDown = false;
        } else if (squatStage === "standing") {
            script.TimerText.text = "Ready";
            isCountingDown = false;
        }
        lastSquatStage = squatStage;
    }

    function pollSquatData() {
        var req = RemoteServiceHttpRequest.create();
        req.url = script.apiEndpoint + "/squat";
        req.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
        req.headers = { "Content-Type": "application/json" };

        script.serviceModule.performHttpRequest(req, function(response) {
            if (response.statusCode === 200) {
                if (response.body && response.body.trim() !== "") {
                    try {
                        var res = JSON.parse(response.body);
                        var data = res.data ? res.data : res;
                        if (typeof data.repCount !== "undefined") {
                            currentRepCount = data.repCount;
                            totalReps = data.totalReps || totalReps;
                            var repsRemaining = totalReps - currentRepCount;
                            updateHUD(repsRemaining);
                        }
                        if (typeof data.squatStage !== "undefined") {
                            updateTimerDisplay(data.squatStage);
                        }
                    } catch (err) {
                        print("[HUD] Error parsing squat data: " + err);
                    }
                }
            } else {
                print("[HUD] HTTP error " + response.statusCode + " | " + response.body);
            }
        });
    }

    var updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function(eventData) {
        if (getTime() - lastPoll > pollInterval) {
            pollSquatData();
            lastPoll = getTime();
        }
    });

    updateHUD(totalReps);
    if (script.TimerText) script.TimerText.text = "Ready";
}
