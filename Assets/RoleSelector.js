// RoleSelectorSpectacles.js

// @input SceneObject squatRoot // Parent for all squat UI/scripts
// @input SceneObject hudRoot   // Parent for all HUD UI/scripts

global.selectedRole = "NONE";
var selected = false;

// Hide both at startup
if (script.hudRoot) script.hudRoot.enabled = false;
if (script.squatRoot) script.squatRoot.enabled = false;

// Each frame, call require('Input').getTap()/getDoubleTap()
var inputEvent = script.createEvent("UpdateEvent");
inputEvent.bind(function () {
    if (selected) return;

    // Single tap = HUD/Lifter mode
    if (require('Input').getTap()) {
        global.selectedRole = "HUD";
        if (script.hudRoot) script.hudRoot.enabled = true;
        if (script.squatRoot) script.squatRoot.enabled = false;
        selected = true;
        print("HUD/Lifter role selected by tap.");
        return;
    }
    // Double tap = Gym Partner/Squat mode
    if (require('Input').getDoubleTap()) {
        global.selectedRole = "GYM_PARTNER";
        if (script.hudRoot) script.hudRoot.enabled = false;
        if (script.squatRoot) script.squatRoot.enabled = true;
        selected = true;
        print("Squat/Gym Partner role selected by DOUBLE tap.");
        return;
    }
});
