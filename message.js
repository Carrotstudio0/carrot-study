let scheduleList = JSON.parse(localStorage.getItem('schedules')) || [];
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let pomodoroTime = 1500; // 25 minutes in seconds
let isRunning = false;
let pomodoroInterval;
let soundFile;
let timerSoundFile;

// Function to render schedule
function renderSchedule() {
    const scheduleListElement = document.getElementById('schedule-list');
    scheduleListElement.innerHTML = '';
    scheduleList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.subject} - ${item.datetime}`;
        scheduleListElement.appendChild(li);
    });
}

// Function to render tasks
function renderTasks() {
    const taskListElement = document.getElementById('task-list');
    taskListElement.innerHTML = '';
    taskList.sort((a, b) => a.priority.localeCompare(b.priority)).forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} [${item.priority}] - Due: ${item.dueDate} ${item.emoji || ''}`;
        
        // Adding image for tasks
        if (item.image) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(item.image);
            img.style.width = '50px'; // Set width for the image
            li.appendChild(img);
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => {
            item.completed = checkbox.checked;
            localStorage.setItem('tasks', JSON.stringify(taskList));
            renderTasks();
            updateStats();
        });
        li.appendChild(checkbox);
        taskListElement.appendChild(li);
    });
    updateStats();
}

// Function to update stats
function updateStats() {
    const completedTasks = taskList.filter(task => task.completed).length;
    const statsElement = document.getElementById('stats');
    statsElement.textContent = `المهام المكتملة: ${completedTasks} من ${taskList.length}`;
}

// Event listeners for forms
document.getElementById('add-schedule-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const datetime = document.getElementById('datetime').value;
    scheduleList.push({ subject, datetime });
    localStorage.setItem('schedules', JSON.stringify(scheduleList));
    renderSchedule();
    this.reset();
});

document.getElementById('add-task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const task = {
        name: document.getElementById('task').value,
        emoji: document.getElementById('emoji').value,
        image: document.getElementById('image').files[0],
        priority: document.getElementById('priority').value,
        completed: false,
        dueDate: document.getElementById('due-date').value,
    };
    taskList.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTasks();
    this.reset();
});

// Pomodoro timer functions
function startPomodoro() {
    if (isRunning) return;
    isRunning = true;
    let time = pomodoroTime;

    pomodoroInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(pomodoroInterval);
            isRunning = false;
            if (timerSoundFile) {
                const audio = new Audio(URL.createObjectURL(timerSoundFile));
                audio.play(); // Play the sound file
            }
            alert("وقت الاستراحة!"); // Break time alert
        }
        time--;
    }, 1000);
}

function stopPomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    document.getElementById('timer').textContent = '25:00'; // Reset timer display
}

// Set custom time for Pomodoro
document.getElementById('set-pomodoro').addEventListener('click', function() {
    const customTime = document.getElementById('custom-time').value;
    if (customTime) {
        pomodoroTime = customTime * 60; // Convert to seconds
        document.getElementById('timer').textContent = `${String(Math.floor(pomodoroTime / 60)).padStart(2, '0')}:00`;
    }
});

// Add event listeners for Pomodoro buttons
document.getElementById('start-pomodoro').addEventListener('click', startPomodoro);
document.getElementById('stop-pomodoro').addEventListener('click', stopPomodoro);

// Handle sound file for timer
document.getElementById('sound-file').addEventListener('change', function() {
    soundFile = this.files[0]; // Save the selected sound file
});

// Handle sound file for timer alert
document.getElementById('timer-sound-file').addEventListener('change', function() {
    timerSoundFile = this.files[0]; // Save the selected timer sound file
});

// Display information about developers and open-source
document.getElementById('developer-info').textContent = 'تم تطوير هذا التطبيق بواسطة كاروت ستوديو وهو مفتوح المصدر. يمكن للجميع تعديله بعد إذن كاروت ستوديو.';
