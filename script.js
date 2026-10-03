// ========================================
// HTML ELEMENTS
// ========================================

const timerDisplay =
    document.getElementById("timer");

const modeBadge =
    document.getElementById("modeBadge");

const setupPanel =
    document.getElementById("setupPanel");

const activeControls =
    document.getElementById("activeControls");

const sessionCounter =
    document.getElementById("sessionCounter");

const sessionStatus =
    document.getElementById("sessionStatus");

const pawProgress =
    document.getElementById("pawProgress");

const soundToggle =
    document.getElementById("soundToggle");

const photoGlow =
    document.querySelector(".photo-glow");

const catPhoto =
    document.getElementById("catPhoto");

const randomScubaCat =
    document.getElementById("randomScubaCat");


// ========================================
// SEGMENTED PROGRESS
// ========================================

const progressLabel =
    document.getElementById("progressLabel");

const progressPercent =
    document.getElementById("progressPercent");

const progressSegments =
    document.querySelectorAll(
        ".progress-segment"
    );

let previousActiveSegments =
    0;


// ========================================
// TASK ELEMENTS
// ========================================

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const taskCounter =
    document.getElementById("taskCounter");

const emptyTasks =
    document.getElementById("emptyTasks");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const taskMotivation =
    document.getElementById("taskMotivation");


// ========================================
// CELEBRATION
// ========================================

const celebrationOverlay =
    document.getElementById("celebrationOverlay");

const celebrationCard =
    document.getElementById("celebrationCard");

const celebrationTitle =
    document.getElementById("celebrationTitle");

const celebrationMessage =
    document.getElementById("celebrationMessage");

const celebrationIcon =
    document.getElementById("celebrationIcon");

const celebrationPaw =
    document.getElementById("celebrationPaw");

const celebrationProgress =
    document.getElementById("celebrationProgress");

const celebrationGif =
    document.getElementById("celebrationGif");


// ========================================
// IMAGE PATHS
// ========================================

const focusPhotoSrc =
    "study-cat-crying.png";

const breakPhotoSrc =
    "cat-break.png";

const finalCelebrationGif =
    "happy-happy-cat.gif";


const celebrationGifs = [
    "cat-cat-dance.gif",
    "cat-cute.gif",
    "scuba-scuba-cat.gif"
];


// ========================================
// INPUTS
// ========================================

const focusHoursInput =
    document.getElementById("focusHours");

const focusMinutesInput =
    document.getElementById("focusMinutes");

const focusSecondsInput =
    document.getElementById("focusSeconds");

const breakHoursInput =
    document.getElementById("breakHours");

const breakMinutesInput =
    document.getElementById("breakMinutes");

const breakSecondsInput =
    document.getElementById("breakSeconds");

const longBreakHoursInput =
    document.getElementById("longBreakHours");

const longBreakMinutesInput =
    document.getElementById("longBreakMinutes");

const longBreakSecondsInput =
    document.getElementById("longBreakSeconds");

const totalSessionsInput =
    document.getElementById("totalSessions");

const longBreakEveryInput =
    document.getElementById("longBreakEvery");


// ========================================
// BUTTONS
// ========================================

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");


// ========================================
// SETTINGS
// ========================================

let focusDuration =
    25 * 60 * 1000;

let breakDuration =
    5 * 60 * 1000;

let longBreakDuration =
    15 * 60 * 1000;

let totalSessions =
    4;

let longBreakEvery =
    4;


// ========================================
// STATE
// ========================================

let currentMode =
    "focus";

let currentDuration =
    focusDuration;

let remainingTime =
    focusDuration;

let completedFocusSessions =
    0;

let currentSession =
    1;

let endTime =
    null;

let animationFrameId =
    null;

let isRunning =
    false;

let sessionStarted =
    false;

let popPawIndex =
    null;

let celebrationTimeout =
    null;

let scubaScheduleTimeout =
    null;

let scubaHideTimeout =
    null;


// ========================================
// SOUND
// ========================================

let soundEnabled =
    true;

let audioContext =
    null;


// ========================================
// TASKS
// ========================================

let tasks =
    [];

const TASK_STORAGE_KEY =
    "catPomodoroTasks";


// ========================================
// TIME INPUT
// ========================================

function getInputTime(
    hoursInput,
    minutesInput,
    secondsInput
) {

    const hours =
        Math.max(
            0,
            Number(hoursInput.value) || 0
        );

    const minutes =
        Math.max(
            0,
            Number(minutesInput.value) || 0
        );

    let seconds =
        Number(secondsInput.value) || 0;

    seconds =
        Math.max(
            0,
            Math.min(
                59,
                seconds
            )
        );

    secondsInput.value =
        seconds;

    return (
        (
            (hours * 3600) +
            (minutes * 60) +
            seconds
        )
        *
        1000
    );

}


// ========================================
// SETTINGS
// ========================================

function readSettings() {

    focusDuration =
        getInputTime(
            focusHoursInput,
            focusMinutesInput,
            focusSecondsInput
        );

    breakDuration =
        getInputTime(
            breakHoursInput,
            breakMinutesInput,
            breakSecondsInput
        );

    longBreakDuration =
        getInputTime(
            longBreakHoursInput,
            longBreakMinutesInput,
            longBreakSecondsInput
        );

    totalSessions =
        Math.max(
            1,
            Number(totalSessionsInput.value) || 1
        );

    longBreakEvery =
        Math.max(
            1,
            Number(longBreakEveryInput.value) || 1
        );

}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(milliseconds) {

    const totalSeconds =
        Math.max(
            0,
            Math.ceil(
                milliseconds / 1000
            )
        );

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    if (
        hours > 0
    ) {

        return (
            String(hours).padStart(2, "0")
            +
            ":"
            +
            String(minutes).padStart(2, "0")
            +
            ":"
            +
            String(seconds).padStart(2, "0")
        );

    }


    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0")
    );

}


// ========================================
// AUDIO
// ========================================

function prepareAudio() {

    if (
        !audioContext
    ) {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (
            !AudioContextClass
        ) {
            return;
        }

        audioContext =
            new AudioContextClass();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


function playTone(
    frequency,
    delay,
    duration,
    volume = 0.05
) {

    if (
        !soundEnabled ||
        !audioContext
    ) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const startTime =
        audioContext.currentTime +
        delay;

    oscillator.type =
        "sine";

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );

    oscillator.connect(
        gain
    );

    gain.connect(
        audioContext.destination
    );

    oscillator.start(
        startTime
    );

    oscillator.stop(
        startTime +
        duration +
        0.05
    );

}


function playFocusFinishedSound() {

    playTone(
        660,
        0,
        0.22
    );

    playTone(
        880,
        0.20,
        0.32
    );

}


function playBreakFinishedSound() {

    playTone(
        520,
        0,
        0.20
    );

    playTone(
        660,
        0.18,
        0.20
    );

    playTone(
        780,
        0.36,
        0.30
    );

}


function playAllFinishedSound() {

    playTone(
        523,
        0,
        0.25
    );

    playTone(
        659,
        0.20,
        0.25
    );

    playTone(
        784,
        0.40,
        0.45
    );

}


function toggleSound() {

    soundEnabled =
        !soundEnabled;

    soundToggle.textContent =
        soundEnabled
            ? "Sound On"
            : "Sound Off";

    soundToggle.style.opacity =
        soundEnabled
            ? "1"
            : "0.55";

}


// ========================================
// SCUBA CAT
// ========================================

function clearScubaCatTimers() {

    if (
        scubaScheduleTimeout
    ) {

        clearTimeout(
            scubaScheduleTimeout
        );

        scubaScheduleTimeout =
            null;

    }

    if (
        scubaHideTimeout
    ) {

        clearTimeout(
            scubaHideTimeout
        );

        scubaHideTimeout =
            null;

    }

    randomScubaCat
        .classList
        .remove(
            "show"
        );

}


function scheduleRandomScubaCat() {

    if (
        !sessionStarted
    ) {
        return;
    }

    const randomDelay =
        20000
        +
        Math.random()
        *
        25000;

    scubaScheduleTimeout =
        setTimeout(
            () => {

                scubaScheduleTimeout =
                    null;

                showRandomScubaCat();

            },
            randomDelay
        );

}


function showRandomScubaCat() {

    if (
        !sessionStarted
    ) {
        return;
    }

    if (
        !isRunning
        ||
        !celebrationOverlay
            .classList
            .contains(
                "hidden"
            )
    ) {

        scheduleRandomScubaCat();

        return;

    }

    randomScubaCat.src =
        "";

    requestAnimationFrame(
        () => {

            randomScubaCat.src =
                "scuba-scuba-cat.gif";

            randomScubaCat
                .classList
                .add(
                    "show"
                );

        }
    );

    scubaHideTimeout =
        setTimeout(
            () => {

                randomScubaCat
                    .classList
                    .remove(
                        "show"
                    );

                scubaHideTimeout =
                    null;

                scheduleRandomScubaCat();

            },
            3000
        );

}


// ========================================
// PHOTO MODE
// ========================================

function updatePhotoByMode() {

    if (
        currentMode ===
        "focus"
    ) {

        catPhoto.src =
            focusPhotoSrc;

        catPhoto.alt =
            "Focus study cat";

        return;

    }

    catPhoto.src =
        breakPhotoSrc;

    catPhoto.alt =
        "Break cat";

}


// ========================================
// MODE UI
// ========================================

function updateModeUI() {

    updatePhotoByMode();


    if (
        currentMode ===
        "focus"
    ) {

        modeBadge.textContent =
            "Focus Time";

        progressLabel.textContent =
            "Focus Progress";

        modeBadge.style.color =
            "#ffbf78";

        modeBadge.style.background =
            "rgba(255, 168, 87, 0.14)";

        return;

    }


    if (
        currentMode ===
        "break"
    ) {

        modeBadge.textContent =
            "Short Break";

        progressLabel.textContent =
            "Break Progress";

        modeBadge.style.color =
            "#9edcff";

        modeBadge.style.background =
            "rgba(85, 184, 255, 0.14)";

        return;

    }


    modeBadge.textContent =
        "Long Break";

    progressLabel.textContent =
        "Long Break Progress";

    modeBadge.style.color =
        "#d8b7ff";

    modeBadge.style.background =
        "rgba(175, 116, 255, 0.15)";

}


// ========================================
// SEGMENTED PROGRESS
// ========================================

function updateSegmentProgress() {

    let percentage =
        0;


    if (
        currentDuration > 0
    ) {

        percentage =
            (
                1 -
                (
                    remainingTime /
                    currentDuration
                )
            )
            *
            100;

    }


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    progressPercent.textContent =
        Math.round(
            percentage
        )
        +
        "%";


    const activeSegments =
        Math.min(
            10,
            Math.floor(
                percentage /
                10
            )
        );


    progressSegments.forEach(
        (
            segment,
            index
        ) => {

            segment.classList.remove(
                "active",
                "segment-pop"
            );


            if (
                index <
                activeSegments
            ) {

                segment.classList.add(
                    "active"
                );


                if (
                    index ===
                    activeSegments - 1
                    &&
                    activeSegments >
                    previousActiveSegments
                ) {

                    segment.classList.add(
                        "segment-pop"
                    );

                }

            }


            if (
                currentMode ===
                "focus"
            ) {

                segment.style.background =
                    index < activeSegments
                        ?
                        "linear-gradient(90deg, #ff9148, #ffc87a)"
                        :
                        "";

            }


            else if (
                currentMode ===
                "break"
            ) {

                segment.style.background =
                    index < activeSegments
                        ?
                        "linear-gradient(90deg, #4da8ff, #8dd5ff)"
                        :
                        "";

            }


            else {

                segment.style.background =
                    index < activeSegments
                        ?
                        "linear-gradient(90deg, #9e6ceb, #cda8ff)"
                        :
                        "";

            }

        }
    );


    previousActiveSegments =
        activeSegments;

}


// ========================================
// SESSION TEXT
// ========================================

function updateSessionText() {

    if (
        !sessionStarted
    ) {
        return;
    }


    if (
        currentMode ===
        "focus"
    ) {

        sessionCounter.textContent =
            "Session "
            +
            currentSession
            +
            " / "
            +
            totalSessions;

    }

    else if (
        currentMode ===
        "break"
    ) {

        sessionCounter.textContent =
            "Short Break • "
            +
            completedFocusSessions
            +
            " / "
            +
            totalSessions
            +
            " completed";

    }

    else {

        sessionCounter.textContent =
            "Long Break • "
            +
            completedFocusSessions
            +
            " / "
            +
            totalSessions
            +
            " completed";

    }


    sessionStatus.textContent =
        completedFocusSessions
        +
        " of "
        +
        totalSessions
        +
        " sessions completed";

}


// ========================================
// PAWS
// ========================================

function renderPaws() {

    pawProgress.innerHTML =
        "";


    for (
        let session = 1;
        session <= totalSessions;
        session++
    ) {

        const paw =
            document.createElement(
                "span"
            );

        paw.classList.add(
            "paw"
        );

        paw.textContent =
            "🐾";


        if (
            session <=
            completedFocusSessions
        ) {

            paw.classList.add(
                "completed"
            );

        }

        else if (
            currentMode ===
            "focus"
            &&
            session ===
            currentSession
            &&
            sessionStarted
        ) {

            paw.classList.add(
                "current"
            );

        }


        if (
            popPawIndex !== null
            &&
            session ===
            popPawIndex
        ) {

            paw.classList.add(
                "pop"
            );

        }


        pawProgress.appendChild(
            paw
        );

    }

}


function triggerCompletedPawPop(
    pawIndex
) {

    popPawIndex =
        pawIndex;

    renderPaws();

    setTimeout(
        () => {

            popPawIndex =
                null;

            renderPaws();

        },
        650
    );

}


// ========================================
// DISPLAY
// ========================================

function updateDisplay() {

    timerDisplay.textContent =
        formatTime(
            remainingTime
        );

    updateModeUI();

    updateSegmentProgress();

    updateSessionText();

}


// ========================================
// VIEWS
// ========================================

function showSetupView() {

    setupPanel
        .classList
        .remove(
            "hidden"
        );

    activeControls
        .classList
        .add(
            "hidden"
        );

}


function showActiveView() {

    setupPanel
        .classList
        .add(
            "hidden"
        );

    activeControls
        .classList
        .remove(
            "hidden"
        );

}


// ========================================
// PREVIEW
// ========================================

function updatePreviewFromInputs() {

    if (
        sessionStarted
    ) {
        return;
    }

    readSettings();

    currentMode =
        "focus";

    currentDuration =
        focusDuration;

    remainingTime =
        focusDuration;

    previousActiveSegments =
        0;

    updateDisplay();

}


// ========================================
// TIMER LOOP
// ========================================

function timerLoop(
    currentTime
) {

    if (
        !isRunning
    ) {
        return;
    }

    remainingTime =
        Math.max(
            0,
            endTime -
            currentTime
        );

    updateDisplay();


    if (
        remainingTime <= 0
    ) {

        isRunning =
            false;

        animationFrameId =
            null;

        document.body
            .classList
            .remove(
                "timer-running"
            );

        handleTimerEnd();

        return;

    }


    animationFrameId =
        requestAnimationFrame(
            timerLoop
        );

}


// ========================================
// START INTERVAL
// ========================================

function startInterval() {

    if (
        isRunning
    ) {
        return;
    }

    if (
        remainingTime <= 0
    ) {
        return;
    }

    isRunning =
        true;

    pauseBtn.textContent =
        "Pause";

    endTime =
        performance.now()
        +
        remainingTime;

    document.body
        .classList
        .add(
            "timer-running"
        );

    animationFrameId =
        requestAnimationFrame(
            timerLoop
        );

}


// ========================================
// CELEBRATION GIF
// ========================================

function getRandomCelebrationGif() {

    const randomIndex =
        Math.floor(
            Math.random() *
            celebrationGifs.length
        );

    return celebrationGifs[
        randomIndex
    ];

}


function restartCelebrationGif(
    gifPath
) {

    celebrationGif.src =
        "";

    requestAnimationFrame(
        () => {

            celebrationGif.src =
                gifPath;

        }
    );

}


// ========================================
// CELEBRATION
// ========================================

function showCelebration(
    finalSession,
    callback
) {

    clearScubaCatTimers();


    if (
        celebrationTimeout
    ) {

        clearTimeout(
            celebrationTimeout
        );

    }


    if (
        finalSession
    ) {

        celebrationCard
            .classList
            .add(
                "final-celebration"
            );

        restartCelebrationGif(
            finalCelebrationGif
        );

        celebrationIcon.textContent =
            "🎉";

        celebrationTitle.textContent =
            "Congratulations!";

        celebrationMessage.textContent =
            "You completed all your Pomodoro sessions";

        celebrationPaw.textContent =
            "🐾 🐾 🐾";

        celebrationProgress.textContent =
            completedFocusSessions
            +
            " / "
            +
            totalSessions
            +
            " sessions completed";

    }

    else {

        celebrationCard
            .classList
            .remove(
                "final-celebration"
            );

        restartCelebrationGif(
            getRandomCelebrationGif()
        );

        celebrationIcon.textContent =
            "✨";

        celebrationTitle.textContent =
            "Great job!";

        celebrationMessage.textContent =
            "Focus session completed";

        celebrationPaw.textContent =
            "🐾";

        celebrationProgress.textContent =
            completedFocusSessions
            +
            " / "
            +
            totalSessions
            +
            " sessions";

    }


    celebrationOverlay
        .classList
        .remove(
            "hidden"
        );

    document.body
        .classList
        .add(
            "overlay-open"
        );


    const popupDuration =
        finalSession
            ? 10000
            : 5000;


    celebrationTimeout =
        setTimeout(
            () => {

                celebrationOverlay
                    .classList
                    .add(
                        "hidden"
                    );

                celebrationCard
                    .classList
                    .remove(
                        "final-celebration"
                    );

                document.body
                    .classList
                    .remove(
                        "overlay-open"
                    );

                celebrationTimeout =
                    null;


                if (
                    callback
                ) {

                    callback();

                }

            },
            popupDuration
        );

}


// ========================================
// NEXT FOCUS
// ========================================

function startNextFocus() {

    if (
        completedFocusSessions >=
        totalSessions
    ) {

        finishPomodoro();

        return;

    }

    currentSession =
        completedFocusSessions +
        1;

    currentMode =
        "focus";

    currentDuration =
        focusDuration;

    remainingTime =
        focusDuration;

    previousActiveSegments =
        0;

    updateDisplay();

    renderPaws();

    startInterval();

    scheduleRandomScubaCat();

}


// ========================================
// TIMER END
// ========================================

function handleTimerEnd() {

    clearScubaCatTimers();


    if (
        currentMode ===
        "focus"
    ) {

        completedFocusSessions++;

        playFocusFinishedSound();

        updateSessionText();

        triggerCompletedPawPop(
            completedFocusSessions
        );


        const finalSession =
            completedFocusSessions >=
            totalSessions;


        if (
            finalSession
        ) {

            playAllFinishedSound();

            showCelebration(
                true,
                () => {

                    finishPomodoro();

                }
            );

            return;

        }


        const shouldTakeLongBreak =
            (
                completedFocusSessions %
                longBreakEvery
            )
            ===
            0;


        showCelebration(
            false,
            () => {

                if (
                    shouldTakeLongBreak
                    &&
                    longBreakDuration > 0
                ) {

                    currentMode =
                        "longBreak";

                    currentDuration =
                        longBreakDuration;

                    remainingTime =
                        longBreakDuration;

                    previousActiveSegments =
                        0;

                    updateDisplay();

                    renderPaws();

                    startInterval();

                    scheduleRandomScubaCat();

                    return;

                }


                if (
                    breakDuration > 0
                ) {

                    currentMode =
                        "break";

                    currentDuration =
                        breakDuration;

                    remainingTime =
                        breakDuration;

                    previousActiveSegments =
                        0;

                    updateDisplay();

                    renderPaws();

                    startInterval();

                    scheduleRandomScubaCat();

                    return;

                }


                startNextFocus();

            }
        );


        return;

    }


    if (
        currentMode ===
        "break"
    ) {

        playBreakFinishedSound();

        startNextFocus();

        return;

    }


    if (
        currentMode ===
        "longBreak"
    ) {

        playBreakFinishedSound();

        startNextFocus();

    }

}


// ========================================
// START TIMER
// ========================================

function startTimer() {

    readSettings();


    if (
        focusDuration <= 0
    ) {

        alert(
            "Please select a focus time."
        );

        return;

    }


    prepareAudio();

    clearScubaCatTimers();


    completedFocusSessions =
        0;

    currentSession =
        1;

    currentMode =
        "focus";

    currentDuration =
        focusDuration;

    remainingTime =
        focusDuration;

    sessionStarted =
        true;

    popPawIndex =
        null;

    previousActiveSegments =
        0;


    showActiveView();

    updateDisplay();

    renderPaws();

    startInterval();

    scheduleRandomScubaCat();

}


// ========================================
// PAUSE / RESUME
// ========================================

function togglePauseResume() {

    if (
        !sessionStarted
    ) {
        return;
    }


    if (
        isRunning
    ) {

        remainingTime =
            Math.max(
                0,
                endTime -
                performance.now()
            );

        cancelAnimationFrame(
            animationFrameId
        );

        animationFrameId =
            null;

        isRunning =
            false;

        document.body
            .classList
            .remove(
                "timer-running"
            );

        pauseBtn.textContent =
            "Resume";

        clearScubaCatTimers();

        updateDisplay();

        return;

    }


    if (
        remainingTime > 0
    ) {

        startInterval();

        scheduleRandomScubaCat();

    }

}


// ========================================
// RESET
// ========================================

function resetTimer() {

    cancelAnimationFrame(
        animationFrameId
    );

    clearScubaCatTimers();


    if (
        celebrationTimeout
    ) {

        clearTimeout(
            celebrationTimeout
        );

        celebrationTimeout =
            null;

    }


    celebrationOverlay
        .classList
        .add(
            "hidden"
        );

    celebrationCard
        .classList
        .remove(
            "final-celebration"
        );

    document.body
        .classList
        .remove(
            "overlay-open"
        );


    animationFrameId =
        null;

    isRunning =
        false;

    sessionStarted =
        false;

    endTime =
        null;

    completedFocusSessions =
        0;

    currentSession =
        1;

    popPawIndex =
        null;

    previousActiveSegments =
        0;


    document.body
        .classList
        .remove(
            "timer-running"
        );


    pauseBtn.textContent =
        "Pause";


    showSetupView();

    readSettings();


    currentMode =
        "focus";

    currentDuration =
        focusDuration;

    remainingTime =
        focusDuration;


    updateDisplay();

    renderPaws();

}


// ========================================
// FINISH
// ========================================

function finishPomodoro() {

    cancelAnimationFrame(
        animationFrameId
    );

    clearScubaCatTimers();


    animationFrameId =
        null;

    isRunning =
        false;

    sessionStarted =
        false;

    endTime =
        null;


    document.body
        .classList
        .remove(
            "timer-running"
        );


    pauseBtn.textContent =
        "Pause";


    showSetupView();

    readSettings();


    currentMode =
        "focus";

    currentDuration =
        focusDuration;

    remainingTime =
        focusDuration;

    completedFocusSessions =
        0;

    currentSession =
        1;

    popPawIndex =
        null;

    previousActiveSegments =
        0;


    updateDisplay();

    renderPaws();

}


// ========================================
// TASK STORAGE
// ========================================

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(
                TASK_STORAGE_KEY
            );

        if (
            savedTasks
        ) {

            const parsedTasks =
                JSON.parse(
                    savedTasks
                );

            if (
                Array.isArray(
                    parsedTasks
                )
            ) {

                tasks =
                    parsedTasks;

            }

        }

    }

    catch (
        error
    ) {

        tasks =
            [];

    }


    renderTasks();

}


function saveTasks() {

    localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(
            tasks
        )
    );

}


// ========================================
// TASK ID
// ========================================

function createTaskId() {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }

    return (
        Date.now().toString()
        +
        "-"
        +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const text =
        taskInput.value
            .trim();

    if (
        !text
    ) {

        taskInput.focus();

        return;

    }


    tasks.push(
        {
            id:
                createTaskId(),

            text:
                text,

            completed:
                false
        }
    );


    taskInput.value =
        "";


    saveTasks();

    renderTasks();

    taskInput.focus();

}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(
    taskId
) {

    tasks =
        tasks.map(
            (task) => {

                if (
                    task.id ===
                    taskId
                ) {

                    return {
                        ...task,

                        completed:
                            !task.completed
                    };

                }

                return task;

            }
        );


    saveTasks();

    renderTasks();

}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(
    taskId
) {

    tasks =
        tasks.filter(
            (task) =>
                task.id !==
                taskId
        );


    saveTasks();

    renderTasks();

}


// ========================================
// CLEAR COMPLETED
// ========================================

function clearCompletedTasks() {

    tasks =
        tasks.filter(
            (task) =>
                !task.completed
        );


    saveTasks();

    renderTasks();

}


// ========================================
// TASK COUNTER
// ========================================

function updateTaskCounter() {

    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    taskCounter.textContent =
        completed
        +
        " / "
        +
        tasks.length
        +
        " completed";


    clearCompletedBtn.disabled =
        completed === 0;


    if (
        tasks.length === 0
    ) {

        taskMotivation.textContent =
            "One task at a time ♡";

    }

    else if (
        completed ===
        tasks.length
    ) {

        taskMotivation.textContent =
            "Everything done. Nice work! ✨";

    }

    else if (
        completed > 0
    ) {

        taskMotivation.textContent =
            "Keep going — you're making progress ♡";

    }

    else {

        taskMotivation.textContent =
            "Small steps still count ♡";

    }

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML =
        "";


    emptyTasks.classList.toggle(
        "hidden",
        tasks.length > 0
    );


    tasks.forEach(
        (task) => {

            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.classList.add(
                "task-item"
            );


            if (
                task.completed
            ) {

                taskItem.classList.add(
                    "completed"
                );

            }


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.classList.add(
                "task-checkbox"
            );


            checkbox.checked =
                task.completed;


            checkbox.addEventListener(
                "change",
                () => {

                    toggleTask(
                        task.id
                    );

                }
            );


            const text =
                document.createElement(
                    "div"
                );


            text.classList.add(
                "task-text"
            );


            text.textContent =
                task.text;


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.classList.add(
                "task-delete"
            );


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "✕";


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteTask(
                        task.id
                    );

                }
            );


            taskItem.appendChild(
                checkbox
            );

            taskItem.appendChild(
                text
            );

            taskItem.appendChild(
                deleteButton
            );


            taskList.appendChild(
                taskItem
            );

        }
    );


    updateTaskCounter();

}


// ========================================
// EVENTS
// ========================================

startBtn.addEventListener(
    "click",
    startTimer
);

pauseBtn.addEventListener(
    "click",
    togglePauseResume
);

resetBtn.addEventListener(
    "click",
    resetTimer
);

soundToggle.addEventListener(
    "click",
    toggleSound
);

addTaskBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            addTask();

        }

    }
);

clearCompletedBtn.addEventListener(
    "click",
    clearCompletedTasks
);


// ========================================
// INPUT EVENTS
// ========================================

const setupInputs = [

    focusHoursInput,
    focusMinutesInput,
    focusSecondsInput,

    breakHoursInput,
    breakMinutesInput,
    breakSecondsInput,

    longBreakHoursInput,
    longBreakMinutesInput,
    longBreakSecondsInput,

    totalSessionsInput,
    longBreakEveryInput

];


setupInputs.forEach(
    (input) => {

        input.addEventListener(
            "input",
            updatePreviewFromInputs
        );

    }
);


// ========================================
// INITIAL STATE
// ========================================

readSettings();

currentMode =
    "focus";

currentDuration =
    focusDuration;

remainingTime =
    focusDuration;

previousActiveSegments =
    0;

updateDisplay();

renderPaws();

showSetupView();

loadTasks();