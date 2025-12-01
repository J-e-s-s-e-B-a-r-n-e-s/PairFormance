// @input SceneObject stickFigureRoot
// @input Component.Text RepText
// @input Component.Text TimerText
// @input int totalReps = 12
// @input Asset.InternetModule serviceModule
// @input string apiEndpoint

var pollInterval = 1.0; // seconds
var lastPoll = 0.0;
var currentRepCount = 0;
var totalReps = script.totalReps || 12;

function updateHUD() {
    var repsRemaining = totalReps - currentRepCount;
    if (script.RepText) script.RepText.text = "REPS: " + repsRemaining;
    if (script.TimerText) script.TimerText.text = "Ready";
}

// Only run poll as CLIENT
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

// Role-based UI
function updateRoleDependentUI(role) {
    var isHost = (role === "HOST");
    if (script.stickFigureRoot) script.stickFigureRoot.enabled = isHost;
    if (script.RepText) script.RepText.enabled = !isHost;
    if (script.TimerText) script.TimerText.enabled = !isHost;
}

// Listen for role changes
global.addRoleChangedListener(updateRoleDependentUI);
// Initial
updateRoleDependentUI(global.selectedRole);

function mainLoop(eventData) {
    if (global.selectedRole === "CLIENT" && (getTime() - lastPoll > pollInterval)) {
        pollSquatData();
        lastPoll = getTime();
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(mainLoop);

updateHUD();
