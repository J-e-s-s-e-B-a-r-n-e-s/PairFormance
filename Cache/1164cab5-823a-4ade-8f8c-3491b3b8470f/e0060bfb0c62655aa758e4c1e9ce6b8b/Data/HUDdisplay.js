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

    var pollInterval = 0.2; // seconds for responsive HUD
    var lastPoll = 0.0;
    var currentRepCount = 0;
    var totalReps = script.totalReps || 12;

    function updateHUD(repsRemaining) {
        if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    }

    function updateTimerDisplay(state, goDownCounter, liftUpCounter) {
        if (!script.TimerText) return;
        if (state === "descending") {
            script.TimerText.text = "Go Down: " + goDownCounter;
        } else if (state === "bottom") {
            script.TimerText.text = "Hold: " + liftUpCounter;
        } else if (state === "ascending") {
            script.TimerText.text = "Lift Up: " + liftUpCounter;
        } else if (state === "completed") {
            script.TimerText.text = "Good Rep!";
        } else if (state === "interrupted") {
            script.TimerText.text = "Try Deeper!";
        } else {
            script.TimerText.text = "Ready";
        }
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
                        // Fix: handle nested "data" field
                        var data = res.data ? res.data : res;
                        // Rep Count
                        if (typeof data.repCount !== "undefined") {
                            currentRepCount = data.repCount;
                            totalReps = data.totalReps || totalReps;
                            var repsRemaining = totalReps - currentRepCount;
                            updateHUD(repsRemaining);
                        }
                        // Timer and squat state
                        if (typeof data.squatStage !== "undefined") {
                            updateTimerDisplay(
                                data.squatStage,
                                data.goDownCounter,
                                data.liftUpCounter
                            );
                        }
                    } catch (err) {
                        print("[HUD] Error parsing squat data: " + err);
                    }
                } // empty body: just wait for next frame
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
