/* =====================================================
   HABITFLOW - REAL FRONTEND FUNCTIONALITY
===================================================== */


/* =====================================================
   1. DATA
===================================================== */

let habits = JSON.parse(localStorage.getItem("habitflow_habits")) || [
    {
        id: 1,
        name: "DSA Practice",
        description: "Complete 2 problems",
        icon: "💻",
        progress: 100,
        completedToday: true,
        history: []
    },

    {
        id: 2,
        name: "Web Development",
        description: "Practice for 1 hour",
        icon: "🌐",
        progress: 75,
        completedToday: true,
        history: []
    },

    {
        id: 3,
        name: "Reading",
        description: "Read 20 pages",
        icon: "📚",
        progress: 40,
        completedToday: false,
        history: []
    },

    {
        id: 4,
        name: "Exercise",
        description: "Workout for 30 minutes",
        icon: "💗",
        progress: 100,
        completedToday: true,
        history: []
    }
];


let goals = JSON.parse(localStorage.getItem("habitflow_goals")) || [
    {
        id: 1,
        title: "Master Java DSA",
        description: "Solve 100 DSA problems",
        progress: 65,
        icon: "💻",
        status: "In Progress"
    },

    {
        id: 2,
        title: "Become a Full-Stack Developer",
        description: "Learn frontend, backend and databases",
        progress: 42,
        icon: "🌐",
        status: "In Progress"
    },

    {
        id: 3,
        title: "Read 10 Books",
        description: "Read and complete 10 books",
        progress: 100,
        icon: "📚",
        status: "Completed"
    }
];


/* =====================================================
   2. SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "habitflow_habits",
        JSON.stringify(habits)
    );

    localStorage.setItem(
        "habitflow_goals",
        JSON.stringify(goals)
    );
}


/* =====================================================
   3. MOBILE MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const navbar =
    document.getElementById("navbar");


if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        navbar.classList.toggle("mobile-active");

        if (
            navbar.classList.contains("mobile-active")
        ) {

            menuBtn.textContent = "✕";

        } else {

            menuBtn.textContent = "☰";

        }

    });

}


/* Close menu when clicking navigation */

document.querySelectorAll(".navbar a")
    .forEach(function(link) {

        link.addEventListener("click", function() {

            navbar.classList.remove(
                "mobile-active"
            );

            menuBtn.textContent = "☰";

        });

    });



/* =====================================================
   4. HABIT SECTION
===================================================== */

function renderHabits() {

    const habitList =
        document.querySelector(".habit-list");

    if (!habitList) return;


    habitList.innerHTML = "";


    habits.forEach(function(habit) {

        const habitItem =
            document.createElement("article");

        habitItem.className =
            "habit-item";


        habitItem.innerHTML = `

            <div class="habit-left">

                <div class="habit-icon">
                    ${habit.icon}
                </div>

                <div>

                    <h3>
                        ${habit.name}
                    </h3>

                    <p>
                        ${habit.description}
                    </p>

                </div>

            </div>


            <div class="habit-progress">

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${habit.progress}%">
                    </div>

                </div>

                <span>
                    ${habit.progress}%
                </span>

                <button
                    class="complete-btn ${
                        habit.completedToday
                            ? ""
                            : "incomplete"
                    }"
                    onclick="toggleHabit(${habit.id})">

                    ✓

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteHabit(${habit.id})">

                    🗑️

                </button>

            </div>

        `;


        habitList.appendChild(habitItem);

    });

}


/* =====================================================
   5. COMPLETE / UNCOMPLETE HABIT
===================================================== */

function toggleHabit(id) {

    const habit =
        habits.find(function(item) {

            return item.id === id;

        });


    if (!habit) return;


    habit.completedToday =
        !habit.completedToday;


    if (habit.completedToday) {

        habit.progress = 100;

        addTodayToHistory(habit);

    } else {

        habit.progress = 0;

    }


    saveData();

    renderHabits();

    updateDashboard();

}


/* =====================================================
   6. DELETE HABIT
===================================================== */

function deleteHabit(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this habit?"
        );


    if (!confirmed) return;


    habits =
        habits.filter(function(habit) {

            return habit.id !== id;

        });


    saveData();

    renderHabits();

    updateDashboard();

}


/* =====================================================
   7. ADD HABIT
===================================================== */

function addHabit() {

    const name =
        prompt("Enter habit name:");

    if (!name) return;


    const description =
        prompt(
            "What do you want to achieve?"
        ) || "Daily habit";


    const newHabit = {

        id: Date.now(),

        name: name,

        description: description,

        icon: "⭐",

        progress: 0,

        completedToday: false,

        history: []

    };


    habits.push(newHabit);


    saveData();

    renderHabits();

    updateDashboard();


    alert(
        "Habit added successfully! 🎉"
    );

}


/* =====================================================
   8. CONNECT ADD HABIT BUTTON
===================================================== */

document.querySelectorAll(
    ".page-header .primary-btn"
).forEach(function(button) {

    if (
        button.textContent
            .includes("Add Habit")
    ) {

        button.addEventListener(
            "click",
            addHabit
        );

    }

});


/* =====================================================
   9. HABIT HISTORY
===================================================== */

function addTodayToHistory(habit) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (!habit.history) {

        habit.history = [];

    }


    if (
        !habit.history.includes(today)
    ) {

        habit.history.push(today);

    }

}


/* =====================================================
   10. STREAK CALCULATION
===================================================== */

function calculateStreak(habit) {

    if (
        !habit.history ||
        habit.history.length === 0
    ) {

        return habit.completedToday
            ? 1
            : 0;

    }


    const dates =
        [...habit.history]
            .sort()
            .reverse();


    let streak = 0;


    let currentDate =
        new Date();


    for (
        let i = 0;
        i < dates.length;
        i++
    ) {

        const date =
            new Date(dates[i]);


        const difference =
            Math.floor(
                (
                    currentDate - date
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === streak) {

            streak++;

            currentDate = date;

        } else {

            break;

        }

    }


    return streak;

}


/* =====================================================
   11. TOTAL STREAK
===================================================== */

function getCurrentStreak() {

    if (habits.length === 0) {

        return 0;

    }


    return Math.max(
        ...habits.map(function(habit) {

            return calculateStreak(habit);

        })
    );

}


/* =====================================================
   12. DASHBOARD UPDATE
===================================================== */

function updateDashboard() {


    /* TODAY'S HABITS */

    const completed =
        habits.filter(function(habit) {

            return habit.completedToday;

        }).length;


    const total =
        habits.length;


    /* CURRENT STREAK */

    const streak =
        getCurrentStreak();


    /* GOAL PROGRESS */

    let goalProgress = 0;


    if (goals.length > 0) {

        const totalProgress =
            goals.reduce(
                function(sum, goal) {

                    return sum + goal.progress;

                },
                0
            );


        goalProgress =
            Math.round(
                totalProgress /
                goals.length
            );

    }


    /* STAT CARDS */

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    if (statCards.length >= 3) {


        /* STREAK */

        statCards[0]
            .querySelector("h2")
            .textContent =
            streak + " Days";


        /* GOAL */

        statCards[1]
            .querySelector("h2")
            .textContent =
            goalProgress + "%";


        /* HABITS */

        statCards[2]
            .querySelector("h2")
            .textContent =
            `${completed} / ${total}`;

    }

}


/* =====================================================
   13. GOAL SECTION
===================================================== */

function renderGoals() {

    const goalGrid =
        document.querySelector(".goal-grid");


    if (!goalGrid) return;


    goalGrid.innerHTML = "";


    goals.forEach(function(goal) {


        const goalCard =
            document.createElement("article");


        goalCard.className =
            "goal-card";


        const statusClass =
            goal.progress === 100
                ? "completed"
                : "";


        const status =
            goal.progress === 100
                ? "Completed"
                : "In Progress";


        goalCard.innerHTML = `

            <div class="goal-header">

                <div class="goal-icon">
                    ${goal.icon}
                </div>

                <span
                    class="goal-status ${statusClass}">

                    ${status}

                </span>

            </div>


            <h2>
                ${goal.title}
            </h2>


            <p>
                ${goal.description}
            </p>


            <div class="goal-info">

                <span>
                    Progress
                </span>

                <strong>
                    ${goal.progress}%
                </strong>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${goal.progress}%">
                </div>

            </div>


            <div class="goal-footer">

                <span>
                    ${
                        goal.progress === 100
                            ? "✅ Completed"
                            : "🚀 In Progress"
                    }
                </span>

                <button
                    class="delete-goal"
                    onclick="deleteGoal(${goal.id})">

                    🗑️

                </button>

            </div>

        `;


        goalGrid.appendChild(goalCard);

    });

}


/* =====================================================
   14. ADD GOAL
===================================================== */

function addGoal() {

    const title =
        prompt("Enter your goal:");


    if (!title) return;


    const description =
        prompt(
            "Describe your goal:"
        ) ||
        "My new goal";


    const newGoal = {

        id: Date.now(),

        title: title,

        description: description,

        progress: 0,

        icon: "🎯",

        status: "In Progress"

    };


    goals.push(newGoal);


    saveData();

    renderGoals();

    updateDashboard();


    alert(
        "Goal created successfully! 🎯"
    );

}


/* =====================================================
   15. DELETE GOAL
===================================================== */

function deleteGoal(id) {

    const confirmed =
        confirm(
            "Delete this goal?"
        );


    if (!confirmed) return;


    goals =
        goals.filter(function(goal) {

            return goal.id !== id;

        });


    saveData();

    renderGoals();

    updateDashboard();

}


/* =====================================================
   16. CONNECT CREATE GOAL BUTTONS
===================================================== */

document.querySelectorAll(
    ".primary-btn"
).forEach(function(button) {

    const text =
        button.textContent.trim();


    if (
        text.includes("Add Goal") ||
        text.includes("Create Goal")
    ) {

        button.addEventListener(
            "click",
            addGoal
        );

    }

});


/* =====================================================
   17. FOCUS TIMER
===================================================== */

let timerSeconds = 25 * 60;

let timerRunning = false;

let timerInterval = null;


function updateTimerDisplay() {

    const timer =
        document.querySelector(
            ".timer h1"
        );


    if (!timer) return;


    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =====================================================
   18. START TIMER
===================================================== */

function startTimer() {

    if (timerRunning) return;


    timerRunning = true;


    const button =
        document.querySelector(
            ".timer .primary-btn"
        );


    button.textContent =
        "Pause Focus";


    timerInterval =
        setInterval(function() {


            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            } else {

                clearInterval(
                    timerInterval
                );

                timerRunning = false;

                button.textContent =
                    "Start Focus";


                alert(
                    "🎉 Focus session complete!"
                );

            }

        }, 1000);

}


/* =====================================================
   19. PAUSE TIMER
===================================================== */

function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;


    const button =
        document.querySelector(
            ".timer .primary-btn"
        );


    if (button) {

        button.textContent =
            "Start Focus";

    }

}


/* =====================================================
   20. TIMER BUTTON
===================================================== */

const timerButton =
    document.querySelector(
        ".timer .primary-btn"
    );


if (timerButton) {

    timerButton.addEventListener(
        "click",
        function() {

            if (timerRunning) {

                pauseTimer();

            } else {

                startTimer();

            }

        }
    );

}


updateTimerDisplay();


/* =====================================================
   21. NOTIFICATION
===================================================== */

const notificationBtn =
    document.querySelector(
        ".notification-btn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function() {

            alert(
                "🔔 You have 3 pending habits today!"
            );

        }
    );

}


/* =====================================================
   22. CREATE DYNAMIC DELETE BUTTON STYLE
===================================================== */

const deleteStyle =
    document.createElement("style");


deleteStyle.textContent = `

    .delete-btn,
    .delete-goal {

        border: none;

        background: transparent;

        cursor: pointer;

        opacity: 0.6;

        transition: 0.2s;

    }


    .delete-btn:hover,
    .delete-goal:hover {

        opacity: 1;

        transform: scale(1.1);

    }


    .goal-footer {

        align-items: center;

    }

`;


document.head.appendChild(
    deleteStyle
);


/* =====================================================
   23. INITIALIZE APPLICATION
===================================================== */

function initializeApp() {

    renderHabits();

    renderGoals();

    updateDashboard();

    updateTimerDisplay();

}


/* =====================================================
   START
===================================================== */

initializeApp();