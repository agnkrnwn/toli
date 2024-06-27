const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed');
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentEditIndex = -1;

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDate(date) {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function sortTodos() {
    todos.sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.completed ? 1 : -1;
    });
}

function renderTodos() {
    sortTodos();
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="todo-content">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="complete-btn" data-index="${index}"><i class="fas fa-check"></i></button>
                    <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="todo-time">
                Dibuat: ${formatDate(todo.createdAt)}
                ${todo.completed ? `<br>Selesai: ${formatDate(todo.completedAt)}` : ''}
            </div>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.unshift({
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

todoList.addEventListener('click', (e) => {
    if (e.target.closest('.complete-btn')) {
        const index = e.target.closest('.complete-btn').dataset.index;
        todos[index].completed = !todos[index].completed;
        todos[index].completedAt = todos[index].completed ? new Date().toISOString() : null;
        saveTodos();
        renderTodos();
    } else if (e.target.closest('.edit-btn')) {
        const index = e.target.closest('.edit-btn').dataset.index;
        currentEditIndex = index;
        editInput.value = todos[index].text;
        editModal.style.display = 'block';
    } else if (e.target.closest('.delete-btn')) {
        const index = e.target.closest('.delete-btn').dataset.index;
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }
    }
});

clearCompletedBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua tugas yang sudah selesai?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
});

saveEditBtn.addEventListener('click', () => {
    const newText = editInput.value.trim();
    if (newText && currentEditIndex !== -1) {
        todos[currentEditIndex].text = newText;
        saveTodos();
        renderTodos();
        editModal.style.display = 'none';
    }
});

cancelEditBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

renderTodos();