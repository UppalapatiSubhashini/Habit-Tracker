/* =====================================================
   HABITFLOW V2
   REAL INTERACTIVE PRODUCTIVITY APP
===================================================== */


/* =====================================================
   DATA
===================================================== */

const defaultHabits = [

    {
        id: 1,
        name: "DSA Practice",
        description: "Solve 2 Java problems",
        category: "Study",
        priority: "High",
        status: "completed",
        progress: 100,
        history: []
    },

    {
        id: 2,
        name: "Web Development",
        description: "Build HabitFlow for 1 hour",
        category: "Study",
        priority: "High",
        status: "in-progress",
        progress: 65,
        history: []
    },

    {
        id: 3,
        name: "Read 20 Pages",
        description: "Read before sleeping",
        category: "Personal",
        priority: "Medium",
        status: "pending",
        progress: 0,
        history: []
    },

    {
        id: 4,
        name: "Exercise",
        description: "30 minute workout",
        category: "Health",
        priority: "Medium",
        status: "completed",
        progress: 100,
        history: []
    },

    {
        id: 5,
        name: "Practice Java",
        description: "Revise OOP concepts",
        category: "Study",
        priority: "High",
        status: "missed",
        progress: 0,
        history: []
    }

];


const defaultGoals = [

    {
        id: 1,
        title: "Master Java DSA",
        description: "Solve 100 LeetCode problems",
        progress: 65,
        deadline: "2026-12-31"
    },

    {
        id: 2,
        title: "Become Full Stack Developer",
        description: "Learn frontend, backend and databases",
        progress: 42,
        deadline: "2027-03-31"
    },

    {
        id: 3,
        title: "Build 5 Projects",
        description: "Create strong portfolio projects",
        progress: 30,
        deadline: "2026-12-31"
    }

];


let habits =
    JSON.parse(
        localStorage.getItem("habitflow_habits")
    ) || defaultHabits;


let goals =
    JSON.parse(
        localStorage.getItem("habitflow_goals")
    ) || defaultGoals;


let focusData =
    JSON.parse(
        localStorage.getItem("habitflow_focus")
    ) || {

        sessions: 0,
        minutes: 0

    };


let currentFilter = "all";

let editingHabitId = null;

let editingGoalId = null;


/* =====================================================
   SAVE
===================================================== */

function save() {

    localStorage.setItem(
        "habitflow_habits",
        JSON.stringify(habits)
    );

    localStorage.setItem(
        "habitflow_goals",
        JSON.stringify(goals)
    );

    localStorage.setItem(
        "habitflow_focus",
        JSON.stringify(focusData)
    );

}


/* =====================================================
   UTILITIES
===================================================== */

function $(selector) {

    return document.querySelector(selector);

}


function $$(selector) {

    return document.querySelectorAll(selector);

}


function today() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function showToast(message, icon = "✓") {

    $("#toastMessage").textContent = message;

    $("#toastIcon").textContent = icon;

    $("#toast").classList.add("show");


    setTimeout(() => {

        $("#toast").classList.remove("show");

    }, 2500);

}


/* =====================================================
   NAVIGATION
===================================================== */

$$(".nav-link[data-page]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            navigate(
                button.dataset.page
            );

            closeMobileMenu();

        }
    );

});


$$("[data-page-link]")
.forEach(element => {

    element.addEventListener(
        "click",
        () => {

            navigate(
                element.dataset.pageLink
            );

            if (element.dataset.filter) {

                currentFilter =
                    element.dataset.filter;

                renderHabits();

            }

        }
    );

});


function navigate(page) {

    $$(".page").forEach(section => {

        section.classList.remove("active");

    });


    const target =
        document.querySelector(
            `#page-${page}`
        );


    if (!target) return;


    target.classList.add("active");


    $$(".nav-link[data-page]")
    .forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    const titles = {

        dashboard: "Dashboard",
        habits: "Habits",
        goals: "Goals",
        analytics: "Analytics",
        calendar: "Calendar",
        focus: "Focus",
        settings: "Settings"

    };


    $("#pageTitle").textContent =
        titles[page] || "Dashboard";


    if (page === "analytics") {

        renderAnalytics();

    }


    if (page === "calendar") {

        renderCalendar();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

$("#mobileMenu")
.addEventListener(
    "click",
    () => {

        $("#sidebar")
            .classList.toggle("open");

        $("#sidebarOverlay")
            .classList.toggle("show");

    }
);


$("#sidebarOverlay")
.addEventListener(
    "click",
    closeMobileMenu
);


function closeMobileMenu() {

    $("#sidebar")
        .classList.remove("open");

    $("#sidebarOverlay")
        .classList.remove("show");

}


/* =====================================================
   HABIT MODAL
===================================================== */

$$("[data-action='add-habit']")
.forEach(button => {

    button.addEventListener(
        "click",
        openAddHabit
    );

});


function openAddHabit() {

    editingHabitId = null;

    $("#habitModalTitle")
        .textContent =
        "Add New Habit";


    $("#habitForm").reset();

    $("#habitId").value = "";


    openModal("habitModal");

}


function openEditHabit(id) {

    const habit =
        habits.find(
            h => h.id === id
        );


    if (!habit) return;


    editingHabitId = id;


    $("#habitModalTitle")
        .textContent =
        "Edit Habit";


    $("#habitId").value =
        habit.id;


    $("#habitName").value =
        habit.name;


    $("#habitDescription").value =
        habit.description;


    $("#habitCategory").value =
        habit.category;


    $("#habitPriority").value =
        habit.priority;


    $("#habitStatus").value =
        habit.status;


    openModal("habitModal");

}


/* =====================================================
   SAVE HABIT
===================================================== */

$("#habitForm")
.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            $("#habitName").value.trim();


        const description =
            $("#habitDescription")
                .value.trim();


        const category =
            $("#habitCategory").value;


        const priority =
            $("#habitPriority").value;


        const status =
            $("#habitStatus").value;


        if (!name) return;


        if (editingHabitId) {

            const habit =
                habits.find(
                    h =>
                        h.id ===
                        editingHabitId
                );


            habit.name =
                name;

            habit.description =
                description;

            habit.category =
                category;

            habit.priority =
                priority;

            habit.status =
                status;

            habit.progress =
                status === "completed"
                    ? 100
                    : status === "in-progress"
                        ? Math.max(
                            habit.progress,
                            1
                        )
                        : 0;


            showToast(
                "Habit updated",
                "✓"
            );

        } else {

            habits.push({

                id: Date.now(),

                name,

                description,

                category,

                priority,

                status,

                progress:
                    status === "completed"
                        ? 100
                        : 0,

                history: []

            });


            showToast(
                "Habit created",
                "🎉"
            );

        }


        save();

        closeModal("habitModal");

        renderAll();

    }
);


/* =====================================================
   HABIT RENDER
===================================================== */

function renderHabits() {

    const grid =
        $("#habitGrid");


    let list =
        [...habits];


    const search =
        $("#habitSearch")
            .value
            .toLowerCase()
            .trim();


    if (search) {

        list =
            list.filter(habit =>

                habit.name
                    .toLowerCase()
                    .includes(search)

            );

    }


    if (currentFilter !== "all") {

        list =
            list.filter(
                habit =>
                    habit.status ===
                    currentFilter
            );

    }


    if (list.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:35px">
                    ✨
                </div>

                <h3>
                    Nothing here yet
                </h3>

                <p>
                    Try another filter or create a new habit.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        list.map(
            createHabitCard
        ).join("");

}


function createHabitCard(habit) {

    const iconMap = {

        Study: "📚",
        Health: "🏃",
        Work: "💼",
        Personal: "🌱"

    };


    return `

        <article class="habit-card">

            <div class="habit-top">

                <div class="habit-icon">

                    ${
                        iconMap[
                            habit.category
                        ] || "⭐"
                    }

                </div>

                <span
                    class="status-pill ${habit.status}">

                    ${
                        formatStatus(
                            habit.status
                        )
                    }

                </span>

            </div>


            <h3>
                ${escapeHTML(habit.name)}
            </h3>


            <p class="habit-description">

                ${
                    escapeHTML(
                        habit.description
                    )
                }

            </p>


            <div class="habit-meta">

                <span class="meta">
                    ${habit.category}
                </span>

                <span class="meta">
                    ${habit.priority} Priority
                </span>

                <span class="meta">
                    ${habit.progress}%
                </span>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="
                        width:${habit.progress}%
                    ">

                </div>

            </div>


            <div class="habit-actions">

                <button
                    class="secondary-btn"
                    onclick="
                        toggleHabit(${habit.id})
                    ">

                    ${
                        habit.status === "completed"
                            ? "↩ Undo"
                            : "✓ Complete"
                    }

                </button>


                <button
                    class="secondary-btn"
                    onclick="
                        openEditHabit(${habit.id})
                    ">

                    Edit

                </button>


                <button
                    class="danger-btn"
                    onclick="
                        deleteHabit(${habit.id})
                    ">

                    Delete

                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   STATUS
===================================================== */

function formatStatus(status) {

    const map = {

        "pending": "Pending",
        "in-progress": "In Progress",
        "completed": "Completed",
        "missed": "Missed"

    };


    return map[status] || status;

}


/* =====================================================
   COMPLETE HABIT
===================================================== */

function toggleHabit(id) {

    const habit =
        habits.find(
            h => h.id === id
        );


    if (!habit) return;


    if (
        habit.status ===
        "completed"
    ) {

        habit.status =
            "in-progress";

        habit.progress =
            50;

        showToast(
            "Habit moved back to progress",
            "↩"
        );

    } else {

        habit.status =
            "completed";

        habit.progress =
            100;


        if (!habit.history) {

            habit.history = [];

        }


        if (
            !habit.history.includes(
                today()
            )
        ) {

            habit.history.push(
                today()
            );

        }


        showToast(
            "Habit completed! 🔥",
            "✓"
        );

    }


    save();

    renderAll();

}


/* =====================================================
   DELETE HABIT
===================================================== */

function deleteHabit(id) {

    if (
        !confirm(
            "Delete this habit?"
        )
    ) return;


    habits =
        habits.filter(
            h => h.id !== id
        );


    save();

    renderAll();

    showToast(
        "Habit deleted",
        "🗑"
    );

}


/* =====================================================
   FILTER
===================================================== */

$$("[data-habit-filter]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentFilter =
                button.dataset.habitFilter;


            $$("[data-habit-filter]")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn === button
                );

            });


            renderHabits();

        }
    );

});


$("#habitSearch")
.addEventListener(
    "input",
    renderHabits
);


/* =====================================================
   GOAL MODAL
===================================================== */

$$("[data-action='add-goal']")
.forEach(button => {

    button.addEventListener(
        "click",
        openAddGoal
    );

});


function openAddGoal() {

    editingGoalId = null;

    $("#goalForm").reset();

    $("#goalId").value = "";


    openModal("goalModal");

}


/* =====================================================
   SAVE GOAL
===================================================== */

$("#goalForm")
.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const title =
            $("#goalTitle")
                .value.trim();


        const description =
            $("#goalDescription")
                .value.trim();


        const progress =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        $("#goalProgress")
                            .value
                    )
                )
            );


        const deadline =
            $("#goalDeadline").value;


        if (!title) return;


        if (editingGoalId) {

            const goal =
                goals.find(
                    g =>
                        g.id ===
                        editingGoalId
                );


            goal.title =
                title;

            goal.description =
                description;

            goal.progress =
                progress;

            goal.deadline =
                deadline;


        } else {

            goals.push({

                id: Date.now(),

                title,

                description,

                progress,

                deadline

            });

        }


        save();

        closeModal("goalModal");

        renderAll();

        showToast(
            "Goal saved",
            "🎯"
        );

    }
);


/* =====================================================
   GOAL RENDER
===================================================== */

function renderGoals() {

    const grid =
        $("#goalGrid");


    if (goals.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:35px">
                    🎯
                </div>

                <h3>
                    No goals yet
                </h3>

                <p>
                    Create your first goal.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        goals.map(goal => `

            <article class="goal-card">

                <div class="goal-header">

                    <div class="goal-icon">
                        🎯
                    </div>

                    <span
                        class="
                            goal-status
                            ${
                                goal.progress === 100
                                    ? "completed"
                                    : ""
                            }
                        ">

                        ${
                            goal.progress === 100
                                ? "Completed"
                                : "In Progress"
                        }

                    </span>

                </div>


                <h2>
                    ${escapeHTML(goal.title)}
                </h2>


                <p>
                    ${
                        escapeHTML(
                            goal.description
                        )
                    }
                </p>


                <div
                    class="goal-progress-info">

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
                        style="
                            width:${goal.progress}%
                        ">

                    </div>

                </div>


                <div class="goal-footer">

                    <small>

                        ${
                            goal.deadline
                                ? "Due " +
                                  formatDate(
                                      goal.deadline
                                  )
                                : "No deadline"
                        }

                    </small>


                    <button
                        class="danger-btn"
                        onclick="
                            deleteGoal(${goal.id})
                        ">

                        Delete

                    </button>

                </div>

            </article>

        `).join("");

}


/* =====================================================
   DELETE GOAL
===================================================== */

function deleteGoal(id) {

    if (
        !confirm(
            "Delete this goal?"
        )
    ) return;


    goals =
        goals.filter(
            g => g.id !== id
        );


    save();

    renderAll();

    showToast(
        "Goal deleted",
        "🗑"
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {

    const pending =
        habits.filter(
            h => h.status === "pending"
        ).length;


    const progress =
        habits.filter(
            h => h.status === "in-progress"
        ).length;


    const completed =
        habits.filter(
            h => h.status === "completed"
        ).length;


    const missed =
        habits.filter(
            h => h.status === "missed"
        ).length;


    const total =
        habits.length;


    const dailyProgress =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    const goalProgress =
        goals.length === 0
            ? 0
            : Math.round(
                goals.reduce(
                    (sum, goal) =>
                        sum + goal.progress,
                    0
                ) /
                goals.length
            );


    $("#statStreak")
        .textContent =
        getStreak() + " days";


    $("#statGoal")
        .textContent =
        goalProgress + "%";


    $("#statHabits")
        .textContent =
        `${completed} / ${total}`;


    $("#statFocus")
        .textContent =
        formatMinutes(
            focusData.minutes
        );


    $("#pendingCount")
        .textContent =
        pending;


    $("#progressCount")
        .textContent =
        progress;


    $("#completedCount")
        .textContent =
        completed;


    $("#missedCount")
        .textContent =
        missed;


    $("#quickPending")
        .textContent =
        pending;


    $("#quickProgress")
        .textContent =
        progress;


    $("#quickCompleted")
        .textContent =
        completed;


    $("#dailyProgress")
        .textContent =
        dailyProgress + "%";


    $(".circle-progress")
        .style
        .setProperty(
            "--progress",
            dailyProgress + "%"
        );


    $("#dashboardCount")
        .textContent =
        pending + progress;


    $("#habitCount")
        .textContent =
        total;


    $("#goalCount")
        .textContent =
        goals.length;


    renderDashboardTasks();

}


/* =====================================================
   DASHBOARD TASKS
===================================================== */

function renderDashboardTasks() {

    const container =
        $("#dashboardTasks");


    if (habits.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No habits yet
                </h3>

                <p>
                    Create one to get started.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        habits
            .slice(0, 6)
            .map(
                habit => `

                    <div class="task">

                        <button
                            class="
                                task-check
                                ${
                                    habit.status ===
                                    "completed"
                                        ? "done"
                                        : ""
                                }
                            "
                            onclick="
                                toggleHabit(
                                    ${habit.id}
                                )
                            ">

                            ${
                                habit.status ===
                                "completed"
                                    ? "✓"
                                    : ""
                            }

                        </button>


                        <div class="task-info">

                            <strong>
                                ${
                                    escapeHTML(
                                        habit.name
                                    )
                                }
                            </strong>

                            <small>
                                ${
                                    habit.category
                                }
                            </small>

                        </div>


                        <span
                            class="
                                status-pill
                                ${habit.status}
                            ">

                            ${
                                formatStatus(
                                    habit.status
                                )
                            }

                        </span>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   ANALYTICS
===================================================== */

function renderAnalytics() {

    const total =
        habits.length;


    const completed =
        habits.filter(
            h =>
                h.status ===
                "completed"
        ).length;


    const completion =
        total === 0
            ? 0
            : Math.round(
                completed /
                total *
                100
            );


    $("#analyticsCompletion")
        .textContent =
        completion + "%";


    $("#analyticsStreak")
        .textContent =
        getStreak() + " days";


    $("#analyticsSessions")
        .textContent =
        focusData.sessions;


    renderChart();

    renderBreakdown();

}


function renderChart() {

    const chart =
        $("#weeklyChart");


    const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    const values =
        days.map(
            () =>
                Math.floor(
                    Math.random() * 70
                ) + 20
        );


    chart.innerHTML =
        values.map(
            (value, index) => `

                <div
                    class="bar"
                    style="
                        height:${value}%
                    ">

                    <span>
                        ${days[index]}
                    </span>

                </div>

            `
        ).join("");

}


function renderBreakdown() {

    const breakdown =
        $("#habitBreakdown");


    const statuses = [

        {
            name: "Completed",
            status: "completed"
        },

        {
            name: "In Progress",
            status: "in-progress"
        },

        {
            name: "Pending",
            status: "pending"
        },

        {
            name: "Missed",
            status: "missed"
        }

    ];


    breakdown.innerHTML =
        statuses.map(item => {

            const count =
                habits.filter(
                    h =>
                        h.status ===
                        item.status
                ).length;


            const percentage =
                habits.length
                    ? count /
                      habits.length *
                      100
                    : 0;


            return `

                <div class="breakdown-row">

                    <span>
                        ${item.name}
                    </span>

                    <div class="breakdown-bar">

                        <div
                            style="
                                width:${percentage}%
                            ">

                        </div>

                    </div>

                    <strong>
                        ${count}
                    </strong>

                </div>

            `;

        }).join("");

}


/* =====================================================
   CALENDAR
===================================================== */

let calendarDate =
    new Date();


$("#prevMonth")
.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();

    }
);


$("#nextMonth")
.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();

    }
);


function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    $("#calendarMonth")
        .textContent =
        new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(calendarDate);


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const grid =
        $("#calendarGrid");


    grid.innerHTML = "";


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day muted";

        grid.appendChild(empty);

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement("div");


        cell.className =
            "calendar-day";


        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        if (
            dateString ===
            today()
        ) {

            cell.classList.add(
                "today"
            );

        }


        const completedThatDay =
            habits.some(
                habit =>
                    habit.history &&
                    habit.history.includes(
                        dateString
                    )
            );


        cell.innerHTML = `

            <strong>
                ${day}
            </strong>

            ${
                completedThatDay
                    ? `<div class="day-indicator"></div>`
                    : ""
            }

        `;


        cell.addEventListener(
            "click",
            () => {

                showDayDetails(
                    dateString
                );

            }
        );


        grid.appendChild(cell);

    }

}


function showDayDetails(dateString) {

    const completed =
        habits.filter(
            habit =>
                habit.history &&
                habit.history.includes(
                    dateString
                )
        );


    $("#dayDetails")
        .innerHTML = `

            <h2>
                ${formatDate(dateString)}
            </h2>

            <p>
                ${
                    completed.length
                        ? `${completed.length} habits completed.`
                        : "No completed habits recorded."
                }
            </p>

            ${
                completed.length
                    ? `

                        <div
                            style="
                                margin-top:15px
                            ">

                            ${completed.map(
                                h =>
                                    `
                                    <div
                                        style="
                                            padding:8px 0;
                                            border-bottom:
                                            1px solid
                                            var(--border)
                                        ">

                                        ✓
                                        ${escapeHTML(
                                            h.name
                                        )}

                                    </div>
                                    `
                            ).join("")}

                        </div>

                    `
                    : ""
            }

        `;

}


/* =====================================================
   FOCUS TIMER
===================================================== */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;


function updateTimer() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    $("#timer")
        .textContent =
        `${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(
            2,
            "0"
        )}`;

}


$("#startTimer")
.addEventListener(
    "click",
    () => {

        if (timerRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }
);


function startTimer() {

    timerRunning = true;

    $("#startTimer")
        .textContent =
        "Pause";


    timerInterval =
        setInterval(
            () => {

                timerSeconds--;

                updateTimer();


                if (
                    timerSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    timerRunning =
                        false;


                    focusData.sessions++;

                    focusData.minutes +=
                        Math.round(
                            25
                        );


                    save();

                    renderAll();


                    showToast(
                        "Focus session complete! 🎉",
                        "🔥"
                    );


                    timerSeconds =
                        25 * 60;

                    updateTimer();


                    $("#startTimer")
                        .textContent =
                        "Start Focus";

                }

            },
            1000
        );

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning =
        false;


    $("#startTimer")
        .textContent =
        "Start Focus";

}


$("#resetTimer")
.addEventListener(
    "click",
    () => {

        clearInterval(
            timerInterval
        );

        timerRunning =
            false;

        timerSeconds =
            25 * 60;

        updateTimer();

        $("#startTimer")
            .textContent =
            "Start Focus";

    }
);


$$("[data-minutes]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );

            timerRunning =
                false;


            timerSeconds =
                Number(
                    button.dataset.minutes
                ) * 60;


            updateTimer();


            $("#startTimer")
                .textContent =
                "Start Focus";

        }
    );

});


/* =====================================================
   SETTINGS / THEME
===================================================== */

function toggleTheme() {

    document.body
        .classList.toggle("dark");


    const dark =
        document.body
            .classList.contains(
                "dark"
            );


    localStorage.setItem(
        "habitflow_theme",
        dark
            ? "dark"
            : "light"
    );

}


$("#themeBtn")
.addEventListener(
    "click",
    toggleTheme
);


$("#settingsTheme")
.addEventListener(
    "click",
    toggleTheme
);


const savedTheme =
    localStorage.getItem(
        "habitflow_theme"
    );


if (savedTheme === "dark") {

    document.body
        .classList.add("dark");

}


/* =====================================================
   CLEAR DATA
===================================================== */

$("#clearData")
.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "This will delete all your HabitFlow data. Continue?"
            );


        if (!confirmed) return;


        localStorage.clear();


        location.reload();

    }
);


/* =====================================================
   NOTIFICATIONS
===================================================== */

$("#notificationBtn")
.addEventListener(
    "click",
    () => {

        const pending =
            habits.filter(
                h =>
                    h.status ===
                    "pending"
            ).length;


        const progress =
            habits.filter(
                h =>
                    h.status ===
                    "in-progress"
            ).length;


        if (
            pending === 0 &&
            progress === 0
        ) {

            showToast(
                "You're all caught up! 🎉",
                "✓"
            );

        } else {

            showToast(
                `${pending} pending • ${progress} in progress`,
                "🔔"
            );

        }

    }
);


/* =====================================================
   MODALS
===================================================== */

function openModal(id) {

    $("#" + id)
        .classList.add("show");

}


function closeModal(id) {

    $("#" + id)
        .classList.remove("show");

}


$$("[data-close-modal]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            closeModal(
                button.dataset.closeModal
            );

        }
    );

});


$$(".modal-overlay")
.forEach(overlay => {

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                overlay.classList.remove(
                    "show"
                );

            }

        }
    );

});


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            $$(".modal-overlay")
            .forEach(
                modal =>
                    modal.classList.remove(
                        "show"
                    )
            );

        }

    }
);


/* =====================================================
   STREAK
===================================================== */

function getStreak() {

    const completed =
        habits.filter(
            h =>
                h.status ===
                "completed"
        );


    if (!completed.length) {

        return 0;

    }


    return Math.min(
        completed.length + 2,
        30
    );

}


/* =====================================================
   HELPERS
===================================================== */

function formatMinutes(minutes) {

    if (minutes < 60) {

        return minutes + "m";

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return `${hours}h ${mins}m`;

}


function formatDate(date) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    ).format(
        new Date(
            date + "T00:00:00"
        )
    );

}


function escapeHTML(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            char => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            })[char]
        );

}


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

    renderDashboard();

    renderHabits();

    renderGoals();

    renderAnalytics();

    updateFocusUI();

}


function updateFocusUI() {

    $("#focusSessions")
        .textContent =
        focusData.sessions;


    $("#focusTime")
        .textContent =
        formatMinutes(
            focusData.minutes
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

renderAll();

updateTimer();
function celebrateTask() {

    const container = document.getElementById("confetti-container");

    const colors = [
        "#ff4d6d",
        "#ffd166",
        "#06d6a0",
        "#118ab2",
        "#8338ec",
        "#ff9f1c"
    ];

    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * 100 + "%";

        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.animationDelay =
            Math.random() * 0.5 + "s";

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        container.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}
function showCelebration(title, message, emoji = "🎉") {

    const celebration = document.getElementById("celebration");

    document.getElementById("celebrationTitle").textContent = title;

    document.getElementById("celebrationMessage").textContent = message;

    document.getElementById("celebrationEmoji").textContent = emoji;

    celebration.classList.add("show");

    setTimeout(() => {
        celebration.classList.remove("show");
    }, 2000);
}function completeTask(button) {

    // Mark task as completed
    button.textContent = "✓ Completed";

    button.classList.add("completed");

    button.disabled = true;

    // 🎉 Confetti
    celebrateTask();

    // Celebration popup
    showCelebration(
        "Task Completed!",
        "Amazing! Keep the momentum going! 🔥",
        "🎉"
    );
}
let completedTasks = 0;

function completeTask(button) {

    button.textContent = "✓ Completed";
    button.classList.add("completed");
    button.disabled = true;

    completedTasks++;

    celebrateTask();

    if (completedTasks >= 5) {

        setTimeout(() => {

            // BIG CONFETTI
            celebrateTask();
            celebrateTask();

            showCelebration(
                "🎯 Daily Goal Completed!",
                "You completed all 5 tasks today! You're unstoppable! 🔥",
                "🏆"
            );

        }, 500);
    }

    else {

        showCelebration(
            "Task Completed!",
            `${completedTasks}/5 tasks completed. Keep going! 💪`,
            "🎉"
        );
    }
}