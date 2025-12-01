// HUDdisplay.js

// @input bool isHost = false
// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input int totalReps = 12
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint

if (!script.isHost) {
    // Only enable HUD, not stick figure, on client
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = false;
    if (script.RepText) script.RepText.enabled = true;
    if (script.TimerText) script.TimerText.enabled = true;

    var pollInterval = 0.2; // Poll server 5x/second for latest squatStage
    var lastPoll = 0.0;
    var currentRepCount = 0;
    var totalReps = script.totalReps || 12;

    function updateHUD(repsRemaining) {
        if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    }

    function updateTimerDisplay(squatStage) {
        if (!script.TimerText) return;
        // React immediately to current phase from server
        switch (squatStage) {
            case "descending":   script.TimerText.text = "Go Down";    break;
            case "bottom":       script.TimerText.text = "Hold";       break;
            case "ascending":    script.TimerText.text = "Lift Up";    break;
            case "completed":    script.TimerText.text = "Good Rep!";  break;
            case "interrupted":  script.TimerText.text = "Try Deeper!"; break;
            case "standing":
            default:             script.TimerText.text = "Ready";      break;
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
