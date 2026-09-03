// Default Timetable
const DEFAULT_TIMETABLE = [
    // Monday
    { day: "Monday", start: "09:05", end: "10:45", subject: "CSD201B: Data Structures and Algorithms", teacher: "Mr. Abhishek Chakraborty", room: "C-407" },
    { day: "Monday", start: "11:15", end: "12:05", subject: "LAN201B: Indian Constitution, Human Rights...", teacher: "CSE B / Faculty B", room: "C-407" },
    { day: "Monday", start: "12:55", end: "13:45", subject: "CSD201B: Data Structures and Algorithms", teacher: "Contact Hour", room: "C-407" },
    { day: "Monday", start: "14:30", end: "15:20", subject: "CSD208B: Discrete Mathematics", teacher: "Dr Pavithra R C", room: "C-407" },
    { day: "Monday", start: "15:20", end: "16:10", subject: "CSC203B: Software Development Fundamental", teacher: "Contact Hour", room: "C-407" },

    // Tuesday
    { day: "Tuesday", start: "09:05", end: "09:55", subject: "CSD202B: Logic Design", teacher: "Contact Hour", room: "C-407" },
    { day: "Tuesday", start: "09:55", end: "10:45", subject: "MTE301B: Probability and Statistics", teacher: "Dr Sachin S M", room: "C-407" },
    { day: "Tuesday", start: "11:15", end: "12:55", subject: "CSD202B / CSD207B / CSC203B Lab", teacher: "Mr. Ashwathnarayana R", room: "Lab A103" },
    { day: "Tuesday", start: "12:55", end: "13:45", subject: "CSD208B: Discrete Mathematics", teacher: "Mr. Madan Desai", room: "C-407" },
    { day: "Tuesday", start: "14:30", end: "15:20", subject: "CSD201B: Data Structures and Algorithms Lab", teacher: "Mr. Abhishek Chakraborty", room: "B3-A103D" },
    { day: "Tuesday", start: "15:20", end: "17:00", subject: "Foundation Mathematics-1", teacher: "Dr Sandeep Kumar", room: "C-407" },

    // Wednesday
    { day: "Wednesday", start: "09:05", end: "10:45", subject: "CSD202B: Logic Design", teacher: "Mr. Ashwath Narayan", room: "C-407" },
    { day: "Wednesday", start: "11:15", end: "12:55", subject: "CSD202B / CSD207B / CSC203B Lab", teacher: "Mr. Ashwathnarayana R", room: "Lab A103" },
    { day: "Wednesday", start: "14:30", end: "15:20", subject: "CSC203B: Software Development Fundamental", teacher: "Ms. Aiswarya R", room: "C-407" },
    { day: "Wednesday", start: "15:20", end: "17:00", subject: "CSD207B: Programming Paradigms", teacher: "Contact Hour", room: "C-407" },

    // Thursday
    { day: "Thursday", start: "09:05", end: "10:45", subject: "CSD201B: Data Structures and Algorithms Lab", teacher: "Mr. Abhishek Chakraborty", room: "B2-A103D" },
    { day: "Thursday", start: "11:15", end: "12:05", subject: "MTE301B: Probability and Statistics", teacher: "Dr Sachin S M", room: "C-407" },
    { day: "Thursday", start: "12:05", end: "12:55", subject: "CSD201B: Data Structures and Algorithms", teacher: "Mr. Abhishek Chakraborty", room: "C-407" },
    { day: "Thursday", start: "14:30", end: "15:20", subject: "CSD207B: Programming Paradigms", teacher: "Ms. M. Shona", room: "C-407" },
    { day: "Thursday", start: "15:20", end: "17:00", subject: "Foundation Mathematics-1", teacher: "Dr Sandeep Kumar", room: "C-407" },

    // Friday
    { day: "Friday", start: "09:05", end: "09:55", subject: "CSD207B: Programming Paradigms", teacher: "Ms. M. Shona", room: "C-407" },
    { day: "Friday", start: "09:55", end: "10:45", subject: "MTE301B: Probability and Statistics", teacher: "Dr Sachin S M", room: "C-407" },
    { day: "Friday", start: "11:15", end: "12:55", subject: "CSD202B / CSD207B / CSC203B Lab", teacher: "Mr. Ashwathnarayana R", room: "Lab A103" },
    { day: "Friday", start: "12:55", end: "13:45", subject: "CSD208B: Discrete Mathematics", teacher: "Mr. Madan Desai", room: "C-407" },
    { day: "Friday", start: "14:30", end: "16:10", subject: "CSD201B: Data Structures and Algorithms Lab", teacher: "Mr. Abhishek Chakraborty", room: "B1-A103G" }
];

// App State
let timetable = JSON.parse(localStorage.getItem('smart_timetable')) || DEFAULT_TIMETABLE;
let settings = JSON.parse(localStorage.getItem('smart_settings')) || {
    darkMode: false,
    notificationsEnabled: false,
    reminderMinutes: 15
};

let notifiedClasses = new Set();

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setInterval(realTimeTicker, 1000);
});

function initializeApp() {
    applySettings();
    updateHeaderClock();
    renderAllViews();
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Three-dot popover menu toggle (Running Card)
    const menuBtn = document.getElementById('running-menu-btn');
    const popover = document.getElementById('running-popover');
    
    if (menuBtn && popover) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popover.classList.toggle('show');
            const current = getCurrentClass();
            if (current) {
                populateSubjectPopover(current.subject);
            }
        });
    }

    // Modal Events
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('subject-modal').classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (popover) popover.classList.remove('show');
        
        const modal = document.getElementById('subject-modal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Settings inputs
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.checked = settings.darkMode;
    darkModeToggle.addEventListener('change', (e) => {
        settings.darkMode = e.target.checked;
        saveSettings();
        applySettings();
    });

    const notifToggle = document.getElementById('notification-toggle');
    notifToggle.checked = settings.notificationsEnabled;
    notifToggle.addEventListener('change', (e) => {
        settings.notificationsEnabled = e.target.checked;
        saveSettings();
        if (settings.notificationsEnabled) requestNotificationPermission();
    });

    document.getElementById('reminder-time-select').value = settings.reminderMinutes;
    document.getElementById('reminder-time-select').addEventListener('change', (e) => {
        settings.reminderMinutes = parseInt(e.target.value);
        saveSettings();
    });

    document.getElementById('notification-permission-btn').addEventListener('click', requestNotificationPermission);
    document.getElementById('reset-default-btn').addEventListener('click', resetToDefaults);

    // Timetable Form Submit
    document.getElementById('class-form').addEventListener('submit', handleClassFormSubmit);
    document.getElementById('cancel-edit-btn').addEventListener('click', resetClassForm);

    // Export / Import
    document.getElementById('export-btn').addEventListener('click', exportTimetableJSON);
    document.getElementById('import-file').addEventListener('change', importTimetableJSON);
}

// Time & Greeting Helpers
function updateHeaderClock() {
    const now = new Date();
    const hours = now.getHours();
    
    let greeting = "Good Evening 👋";
    if (hours < 12) greeting = "Good Morning 👋";
    else if (hours < 17) greeting = "Good Afternoon 👋";

    document.getElementById('greeting-text').textContent = greeting;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-text').textContent = now.toLocaleDateString('en-US', options);
}

function getCurrentDay() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
}

function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function getCurrentTimeMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

function getCurrentClass() {
    const day = getCurrentDay();
    const currentMins = getCurrentTimeMinutes();
    const todaysClasses = getTodaysClasses(day);

    for (let cls of todaysClasses) {
        const startMins = timeToMinutes(cls.start);
        const endMins = timeToMinutes(cls.end);
        if (currentMins >= startMins && currentMins < endMins) {
            return cls;
        }
    }
    return null;
}

function getNextClass() {
    const day = getCurrentDay();
    const currentMins = getCurrentTimeMinutes();
    const todaysClasses = getTodaysClasses(day);

    for (let cls of todaysClasses) {
        const startMins = timeToMinutes(cls.start);
        if (startMins > currentMins) {
            return cls;
        }
    }
    return null;
}

function getTodaysClasses(dayName) {
    return timetable
        .filter(item => item.day === dayName)
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

// Subject Schedule Frequency Analysis
function getSubjectSchedule(subjectName) {
    const matches = timetable.filter(item => item.subject.toLowerCase() === subjectName.toLowerCase());
    const daysSet = [...new Set(matches.map(m => m.day))];
    
    return {
        count: matches.length,
        days: daysSet,
        entries: matches
    };
}

// Modal Logic
function openSubjectModal(subjectName) {
    const modal = document.getElementById('subject-modal');
    const detailsContainer = document.getElementById('modal-subject-details');
    const stats = getSubjectSchedule(subjectName);

    let scheduleHtml = stats.entries.map(e => `
        <li class="modal-schedule-item">
            <strong>${e.day}</strong>
            <span>${e.start} - ${e.end}</span>
        </li>
    `).join('');

    detailsContainer.innerHTML = `
        <div class="modal-title">${subjectName}</div>
        <div class="modal-subtitle">${stats.count} classes scheduled this week</div>
        <ul class="modal-schedule-list">
            ${scheduleHtml}
        </ul>
    `;

    modal.classList.add('show');
}

// Real-time Tick Loop
function realTimeTicker() {
    updateHeaderClock();
    renderDashboardCards();
    checkReminders();
}

// Render Views
function renderAllViews() {
    renderDashboardCards();
    renderTodayView();
    renderWeeklyMatrix();
    renderManageEntries();
}

function renderDashboardCards() {
    const current = getCurrentClass();
    const next = getNextClass();
    const currentMins = getCurrentTimeMinutes();

    const runningBody = document.getElementById('running-body');
    const runningMenuBtn = document.getElementById('running-menu-btn');
    
    if (current) {
        if(runningMenuBtn) runningMenuBtn.style.display = 'block';
        const endMins = timeToMinutes(current.end);
        const remainingSecs = Math.max(0, (endMins - currentMins) * 60);
        const totalDuration = (endMins - timeToMinutes(current.start)) * 60;
        const progressPercent = Math.min(100, Math.max(0, ((totalDuration - remainingSecs) / totalDuration) * 100));

        runningBody.innerHTML = `
            <div class="class-title clickable-subject" onclick="openSubjectModal('${current.subject.replace(/'/g, "\\'")}')">${current.subject}</div>
            <div class="class-time">🕒 ${current.start} - ${current.end}</div>
            <div class="class-location">📍 Room: ${current.room || 'N/A'}</div>
            <div class="class-teacher">👤 Teacher: ${current.teacher || 'N/A'}</div>
            <div class="countdown-box">Ends in ${formatSeconds(remainingSecs)}</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
        `;
    } else {
        if(runningMenuBtn) runningMenuBtn.style.display = 'none';
        runningBody.innerHTML = `
            <div class="class-title" style="color: var(--text-muted);">No class currently running</div>
            <p class="class-time">Enjoy your free time or check upcoming schedules below.</p>
        `;
    }

    const nextBody = document.getElementById('next-body');
    if (next) {
        const startMins = timeToMinutes(next.start);
        const remainingSecs = Math.max(0, (startMins - currentMins) * 60);

        nextBody.innerHTML = `
            <div class="class-title clickable-subject" onclick="openSubjectModal('${next.subject.replace(/'/g, "\\'")}')">${next.subject}</div>
            <div class="class-time">🕒 ${next.start} - ${next.end}</div>
            <div class="class-location">📍 Room: ${next.room || 'N/A'}</div>
            <div class="class-teacher">👤 Teacher: ${next.teacher || 'N/A'}</div>
            <div class="countdown-box">Starts in ${formatSeconds(remainingSecs)}</div>
        `;
    } else {
        nextBody.innerHTML = `
            <div class="class-title" style="color: var(--text-muted);">No more classes today 🎉</div>
            <p class="class-time">All scheduled lectures for today have concluded.</p>
        `;
    }

    renderDashboardTodayTimeline(current, next);
}

function formatSeconds(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = Math.floor(totalSecs % 60);

    if (hrs > 0) {
        return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
}

function populateSubjectPopover(subjectName) {
    const popover = document.getElementById('running-popover');
    const stats = getSubjectSchedule(subjectName);

    let scheduleHtml = stats.entries.map(e => `
        <li class="popover-schedule-item">
            <span>${e.day}</span>
            <span>${e.start} - ${e.end}</span>
        </li>
    `).join('');

    popover.innerHTML = `
        <div class="popover-title">${subjectName}</div>
        <div class="popover-subtitle">${stats.count} classes scheduled this week</div>
        <ul class="popover-schedule-list">
            ${scheduleHtml}
        </ul>
    `;
}

function renderDashboardTodayTimeline(current, next) {
    const container = document.getElementById('dashboard-today-list');
    const day = getCurrentDay();
    const todaysClasses = getTodaysClasses(day);

    if (todaysClasses.length === 0) {
        container.innerHTML = `<p class="class-time">No classes recorded for ${day}.</p>`;
        return;
    }

    container.innerHTML = todaysClasses.map(cls => {
        let statusClass = "";
        let badgeText = "";
        if (current && current.subject === cls.subject && current.start === cls.start) {
            statusClass = "is-current";
            badgeText = "🟢 Running";
        } else if (next && next.subject === cls.subject && next.start === cls.start) {
            statusClass = "is-next";
            badgeText = "⏳ Next";
        }

        return `
            <div class="timeline-item clickable-subject ${statusClass}" onclick="openSubjectModal('${cls.subject.replace(/'/g, "\\'")}')">
                <div class="timeline-info">
                    <h4>${cls.subject} ${badgeText ? `<code>[${badgeText}]</code>` : ''}</h4>
                    <p>Room: ${cls.room || 'N/A'} • Teacher: ${cls.teacher || 'N/A'}</p>
                </div>
                <div class="timeline-time">
                    ${cls.start} - ${cls.end}
                </div>
            </div>
        `;
    }).join('');
}

function renderTodayView() {
    const container = document.getElementById('full-today-list');
    const day = getCurrentDay();
    const todaysClasses = getTodaysClasses(day);

    if (todaysClasses.length === 0) {
        container.innerHTML = `<p>No classes scheduled for today (${day}).</p>`;
        return;
    }

    container.innerHTML = todaysClasses.map(cls => `
        <div class="timeline-item clickable-subject" onclick="openSubjectModal('${cls.subject.replace(/'/g, "\\'")}')">
            <div class="timeline-info">
                <h4>${cls.subject}</h4>
                <p>Room: ${cls.room} | Teacher: ${cls.teacher}</p>
            </div>
            <div class="timeline-time">${cls.start} - ${cls.end}</div>
        </div>
    `).join('');
}

function renderWeeklyMatrix() {
    const table = document.getElementById('weekly-matrix-table');
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = getCurrentDay();

    const timesSet = new Set();
    timetable.forEach(item => timesSet.add(item.start));
    const sortedTimes = [...timesSet].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

    let headerHtml = `<tr><th>Time / Day</th>`;
    days.forEach(d => {
        headerHtml += `<th ${d === currentDay ? 'style="color: var(--primary);"' : ''}>${d}</th>`;
    });
    headerHtml += `</tr>`;

    let bodyHtml = sortedTimes.map(timeSlot => {
        let row = `<tr><td><strong>${timeSlot}</strong></td>`;
        days.forEach(day => {
            const match = timetable.find(i => i.day === day && i.start === timeSlot);
            if (match) {
                row += `<td class="clickable-subject" onclick="openSubjectModal('${match.subject.replace(/'/g, "\\'")}')">
                            <strong>${match.subject}</strong><br>
                            <small>${match.room || ''}</small>
                        </td>`;
            } else {
                row += `<td style="color: var(--text-muted); font-style: italic;">Free Period</td>`;
            }
        });
        row += `</tr>`;
        return row;
    }).join('');

    table.innerHTML = headerHtml + bodyHtml;
}

// Notifications
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        showToast("Browser does not support desktop notifications.");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            settings.notificationsEnabled = true;
            document.getElementById('notification-toggle').checked = true;
            saveSettings();
            showToast("Notifications enabled successfully!");
        } else {
            showToast("Notification permission denied.");
            settings.notificationsEnabled = false;
            document.getElementById('notification-toggle').checked = false;
            saveSettings();
        }
    });
}

function checkReminders() {
    if (!settings.notificationsEnabled) return;

    const day = getCurrentDay();
    const currentMins = getCurrentTimeMinutes();
    const todaysClasses = getTodaysClasses(day);
    const leadTime = settings.reminderMinutes;

    todaysClasses.forEach(cls => {
        const startMins = timeToMinutes(cls.start);
        const diff = startMins - currentMins;

        const uniqueKey = `${cls.day}-${cls.start}-${cls.subject}`;
        if (diff > 0 && diff <= leadTime && !notifiedClasses.has(uniqueKey)) {
            triggerAlert(cls, Math.ceil(diff));
            notifiedClasses.add(uniqueKey);
        }
    });
}

function triggerAlert(cls, minsLeft) {
    const title = `🔔 Class starting in ${minsLeft} mins!`;
    const body = `${cls.subject}\nRoom: ${cls.room} (${cls.start} - ${cls.end})`;

    showToast(`${title}\n${body}`);

    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    }
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message.replace(/\n/g, '<br>')}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Manage Timetable
function renderManageEntries() {
    const container = document.getElementById('editable-entries-list');
    container.innerHTML = timetable.map((item, index) => `
        <div class="entry-card">
            <h4>${item.subject}</h4>
            <p><strong>${item.day}</strong> | ${item.start} - ${item.end}</p>
            <p>Room: ${item.room || 'N/A'} • Teacher: ${item.teacher || 'N/A'}</p>
            <div class="entry-card-actions">
                <button class="secondary-btn small-btn" onclick="editEntry(${index})">Edit</button>
                <button class="danger-btn small-btn" onclick="deleteEntry(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function handleClassFormSubmit(e) {
    e.preventDefault();
    const index = document.getElementById('edit-index').value;
    
    const newEntry = {
        day: document.getElementById('input-day').value,
        start: document.getElementById('input-start').value,
        end: document.getElementById('input-end').value,
        subject: document.getElementById('input-subject').value,
        teacher: document.getElementById('input-teacher').value,
        room: document.getElementById('input-room').value
    };

    if (index === "") {
        timetable.push(newEntry);
        showToast("Class added successfully!");
    } else {
        timetable[parseInt(index)] = newEntry;
        showToast("Class updated successfully!");
    }

    saveTimetable();
    resetClassForm();
    renderAllViews();
}

function editEntry(index) {
    const item = timetable[index];
    document.getElementById('edit-index').value = index;
    document.getElementById('input-day').value = item.day;
    document.getElementById('input-start').value = item.start;
    document.getElementById('input-end').value = item.end;
    document.getElementById('input-subject').value = item.subject;
    document.getElementById('input-teacher').value = item.teacher || '';
    document.getElementById('input-room').value = item.room || '';

    document.getElementById('form-title').textContent = "Edit Class Entry";
    document.getElementById('save-class-btn').textContent = "Update Class";
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
}

function resetClassForm() {
    document.getElementById('class-form').reset();
    document.getElementById('edit-index').value = "";
    document.getElementById('form-title').textContent = "Add New Class";
    document.getElementById('save-class-btn').textContent = "Save Class";
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this class?")) {
        timetable.splice(index, 1);
        saveTimetable();
        renderAllViews();
        showToast("Class deleted.");
    }
}

// Storage Helpers
function saveTimetable() {
    localStorage.setItem('smart_timetable', JSON.stringify(timetable));
}

function saveSettings() {
    localStorage.setItem('smart_settings', JSON.stringify(settings));
}

function applySettings() {
    if (settings.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('current-theme-label').textContent = "Theme: Dark";
    } else {
        document.body.removeAttribute('data-theme');
        document.getElementById('current-theme-label').textContent = "Theme: Light";
    }
}

function resetToDefaults() {
    if (confirm("Reset timetable back to the default curriculum matrix?")) {
        timetable = [...DEFAULT_TIMETABLE];
        saveTimetable();
        renderAllViews();
        showToast("Restored default timetable.");
    }
}

// Import / Export JSON
function exportTimetableJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timetable, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "smart_timetable_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importTimetableJSON(e) {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed)) {
                    timetable = parsed;
                    saveTimetable();
                    renderAllViews();
                    showToast("Timetable successfully imported!");
                } else {
                    alert("Invalid JSON format.");
                }
            } catch (error) {
                alert("Error parsing JSON file.");
            }
        };
    }
}