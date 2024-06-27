// Fungsi untuk memeriksa dukungan LocalStorage
function isLocalStorageSupported() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// Fungsi untuk mendapatkan daftar tugas dari LocalStorage
function getTasksFromLocalStorage() {
    if (isLocalStorageSupported()) {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
    return [];
}

// Fungsi untuk menyimpan daftar tugas ke LocalStorage
function saveTasksToLocalStorage(tasks) {
    if (isLocalStorageSupported()) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Fungsi untuk mengisi ul dengan tugas-tugas
function populateTaskList() {
    const tasks = getTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.done) {
            taskItem.classList.add('done');
        }

        taskItem.innerHTML = `
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-timestamp">${task.timestamp}</div>
                ${task.done ? `<div class="task-completedAt">Selesai pada: ${task.completedAt}</div>` : ''}
            </div>
            <div class="task-buttons">
                <button class="task-btn done-btn" onclick="markTaskAsDone(${index})"><i class="fas fa-check"></i></button>
                <button class="task-btn edit-btn" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
                <button class="task-btn delete-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    // Tampilkan atau sembunyikan tombol "Hapus Semua Tugas Selesai"
    const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
    deleteCompletedBtn.style.display = tasks.some(task => task.done) ? 'block' : 'none';
}

// Fungsi untuk menambah tugas baru
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const tasks = getTasksFromLocalStorage();
        const now = new Date();
        const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        tasks.push({ text: taskText, done: false, timestamp: formattedDate });
        saveTasksToLocalStorage(tasks);
        taskInput.value = '';
        populateTaskList();
    }
}

// Fungsi untuk menghapus tugas
function deleteTask(index) {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus tugas ini?');
    
    if (isConfirmed) {
        const tasks = getTasksFromLocalStorage();
        tasks.splice(index, 1);
        saveTasksToLocalStorage(tasks);
        populateTaskList();
    }
}

// Fungsi untuk menandai tugas sebagai selesai
function markTaskAsDone(index) {
    const tasks = getTasksFromLocalStorage();
    tasks[index].done = true;
    tasks[index].completedAt = new Date().toLocaleString();

    const completedTask = tasks.splice(index, 1)[0];
    tasks.push(completedTask);

    saveTasksToLocalStorage(tasks);
    populateTaskList();

    const allTasksCompleted = tasks.every(task => task.done);
    if (allTasksCompleted) {
        showAllTasksCompletedPopup();
    }
}

// Fungsi untuk mengedit tugas
function editTask(index) {
    const tasks = getTasksFromLocalStorage();
    const editedTaskInput = document.getElementById('editedTaskInput');
    
    editedTaskInput.value = tasks[index].text;
    showModal('editTaskModal');

    const saveEditedTaskBtn = document.getElementById('saveEditedTaskBtn');
    saveEditedTaskBtn.onclick = function() {
        saveEditedTask(index);
    };
}

function saveEditedTask(index) {
    const editedTaskInput = document.getElementById('editedTaskInput');
    const editedTaskText = editedTaskInput.value.trim();

    if (editedTaskText !== '') {
        const tasks = getTasksFromLocalStorage();
        tasks[index].text = editedTaskText;
        saveTasksToLocalStorage(tasks);
        populateTaskList();
    }

    hideModal('editTaskModal');
}

// Fungsi untuk menampilkan modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Fungsi untuk menyembunyikan modal
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fungsi untuk memperbarui tanggal dan waktu
function updateDateTime() {
    const datetimeElement = document.getElementById('datetime');
    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    datetimeElement.textContent = formattedDateTime;
}

// Fungsi untuk menampilkan popup semua tugas selesai
function showAllTasksCompletedPopup() {
    showModal('completionModal');
}

// Fungsi untuk menghapus semua tugas yang sudah selesai
function deleteCompletedTasks() {
    const tasks = getTasksFromLocalStorage();
    const remainingTasks = tasks.filter(task => !task.done);
    saveTasksToLocalStorage(remainingTasks);
    populateTaskList();
}

// Event Listeners
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
document.getElementById('cancelEditBtn').addEventListener('click', () => hideModal('editTaskModal'));
document.getElementById('closeCompletionModalBtn').addEventListener('click', () => hideModal('completionModal'));
document.getElementById('deleteCompletedBtn').addEventListener('click', deleteCompletedTasks);

// Inisialisasi
populateTaskList();
setInterval(updateDateTime, 1000);