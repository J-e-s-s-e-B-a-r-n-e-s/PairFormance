// HUDController.js

// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input int totalReps = 12
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint

var pollInterval = 1.0;
var lastPoll = 0.0;
var currentRepCount = 0;
var totalReps = script.totalReps || 12;

function updateHUD() {
    var repsRemaining = totalReps - currentRepCount;
    if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    if (script.TimerText) script.TimerText.text = "Ready";
}

function pollSquatData() {
    var req = RemoteServiceHttpRequest.create();
    req.url = script.apiEndpoint + "/squat";
    req.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;
    req.headers = { "Content-Type": "application/json" };
    script.serviceModule.performHttpRequest(req, function(response) {
        if (response.statusCode === 200) {
            try {
                var data = JSON.parse(response.body);
                if (data && typeof data.repCount !== "undefined" && data.repCount !== currentRepCount) {
                    currentRepCount = data.repCount;
                    totalReps = data.totalReps || totalReps;
                    updateHUD();
                    print("[HUD] Updated rep count: " + currentRepCount);
                }
            } catch (err) {
                print("[HUD] Error parsing rep count: " + err);
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

updateHUD();
