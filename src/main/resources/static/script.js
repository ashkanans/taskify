document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTableBody = document.getElementById('taskTableBody');
    const submitButton = document.getElementById('submit');
    const updateButton = document.getElementById('update');

    function deleteTask(id) {
        fetch(`/tasks/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchTasks();
                }
            });
    }

    function updatePage(id) {
        fetch(`/tasks/${id}`, { method: 'GET' })
            .then(response => response.json())
            .then(task => {
                if(task.id) {
                    document.getElementById('title').value = task.title;
                    document.getElementById('description').value = task.description;
                    updateButton.disabled = false;
                    submitButton.disabled = true;
                    taskForm.setAttribute('data-id', task.id); // Set data-id for update
                }
            });
        submitButton.disabled = true;
        updateButton.disabled = false;
    }

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskTableBody.innerHTML = '';
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>
                            <button class="delete-button" data-id="${task.id}">Delete</button>
                            <button class="update-button" data-id="${task.id}">Update</button>
                        </td>
                    `;
                    taskTableBody.appendChild(row);
                });
            });
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const id = taskForm.getAttribute('data-id');

        if (id) { // Update task
            fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
                .then(response => response.json())
                .then(() => {
                    fetchTasks();
                    taskForm.reset();
                    updateButton.disabled = true;
                    submitButton.disabled = false;
                    taskForm.removeAttribute('data-id');
                });
        } else { // Add new task
            fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
                .then(response => response.json())
                .then(() => {
                    fetchTasks();
                    taskForm.reset();
                });
        }
    });

    taskTableBody.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('delete-button')) {
            const taskId = event.target.getAttribute('data-id');
            deleteTask(taskId);
        } else if (event.target && event.target.classList.contains('update-button')) {
            const taskId = event.target.getAttribute('data-id');
            updatePage(taskId);
        }
    });

    fetchTasks();
});
