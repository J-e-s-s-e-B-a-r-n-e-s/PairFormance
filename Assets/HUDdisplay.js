// HUDdisplay.js

// @input bool isHost = false
// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input int totalReps = 12
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint
// @input Component.Text SetCompleteText

if (!script.isHost) {
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = false;
    if (script.RepText) script.RepText.enabled = true;
    if (script.TimerText) script.TimerText.enabled = true;

    var pollInterval = 0.2;
    var lastPoll = 0.0;
    var currentRepCount = 0;
    var totalReps = script.totalReps || 12;

    function updateHUD(repsRemaining) {
        if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    }

    function updateTimerDisplay(squatStage) {
        if (!script.TimerText) return;
        if (squatStage === "liftup") {
            script.TimerText.text = "Lift Up";
        } else {
            script.TimerText.text = "Go Down";
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
                        var data = res.data ? res.data : res;
                        if (typeof data.repCount !== "undefined") {
                            currentRepCount = data.repCount;
                            totalReps = data.totalReps || totalReps;
                            var repsRemaining = totalReps - currentRepCount;
                         
                            if (currentRepCount >= totalReps) {
                                // Hide everything except Set Complete Text
                                if (script.RepText) script.RepText.enabled = false;
                                if (script.TimerText) script.TimerText.enabled = false;
                                if (script.SetCompleteText) {
                                    script.SetCompleteText.enabled = true;
                                }
                            } else {
                                // Show normal interface
                                updateHUD(repsRemaining);
                                if (script.RepText) script.RepText.enabled = true;
                                if (script.TimerText) script.TimerText.enabled = true;
                                if (script.SetCompleteText) script.SetCompleteText.enabled = false;
                            }
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
    if (script.TimerText) script.TimerText.text = "Go Down";
}
