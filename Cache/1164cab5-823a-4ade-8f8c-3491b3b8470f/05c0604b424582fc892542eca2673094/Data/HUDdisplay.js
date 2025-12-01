function updateTimerDisplay(squatStage) {
    if (!script.TimerText) return;

    var now = getTime();

    // Start the countdown on descending
    if (squatStage === "descending" && lastSquatStage !== "descending") {
        countdownStartTime = now;
        isCountingDown = true;
        lastLiftUp = false;
    }

    if (squatStage === "descending" && isCountingDown && countdownStartTime !== null) {
        var elapsed = now - countdownStartTime;
        var remaining = Math.max(0, countdownDuration - Math.floor(elapsed));
        script.TimerText.text = "Hold: " + remaining;
        if (remaining === 0) {
            isCountingDown = false;
        }
    } else if (
        (squatStage === "ascending" || squatStage === "completed" || squatStage === "bottom")
        && !lastLiftUp
    ) {
        // <--- Add "bottom" to this line!
        script.TimerText.text = squatStage === "bottom" ? "Hold: 1" : "Lift Up";
        isCountingDown = false;
        lastLiftUp = true;
    } else if (squatStage === "interrupted") {
        script.TimerText.text = "Try Deeper!";
        isCountingDown = false;
        lastLiftUp = false;
    } else if (squatStage === "standing") {
        script.TimerText.text = "Ready";
        isCountingDown = false;
        lastLiftUp = false;
    }
    lastSquatStage = squatStage;
}
