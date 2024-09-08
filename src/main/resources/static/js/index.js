document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTableBody = document.getElementById('taskTableBody');
    const submitButton = document.getElementById('submit');
    const updateButton = document.getElementById('update');
    const logoutButton = document.getElementById('logoutButton');
    const tagSelect = document.getElementById('tags');
    const addTagButton = document.getElementById('addTag');
    const newTagInput = document.getElementById('newTag');
    const selectedTagsContainer = document.getElementById('selectedTags');

    let selectedTags = new Set();

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskTableBody.innerHTML = '';
                tasks.forEach(task => {
                    const tagsHtml = task.tags.map(tag => `<span class="tag">${tag.name}</span>`).join(' ');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${tagsHtml}</td>
                        <td>
                            <button class="delete-button" data-id="${task.id}">Delete</button>
                            <button class="update-button" data-id="${task.id}">Update</button>
                        </td>
                    `;
                    taskTableBody.appendChild(row);
                });
            });
    }

    function fetchTags() {
        fetch('/tags')
            .then(response => response.json())
            .then(tags => {
                tagSelect.innerHTML = '';
                tags.forEach(tag => {
                    const option = document.createElement('option');
                    option.value = tag.id;
                    option.textContent = tag.name;
                    tagSelect.appendChild(option);
                });
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
                    selectedTags = new Set(task.tags.map(tag => tag.id));
                    updateSelectedTags();
                }
            });
        submitButton.disabled = true;
        updateButton.disabled = false;
    }

    function updateSelectedTags() {
        selectedTagsContainer.innerHTML = '';
        fetch('/tags')
            .then(response => response.json())
            .then(tags => {
                tags.forEach(tag => {
                    if (selectedTags.has(tag.id)) {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'tag selected';
                        tagElement.textContent = tag.name;
                        selectedTagsContainer.appendChild(tagElement);
                    }
                });
            });
    }

    function deleteTask(id) {
        fetch(`/tasks/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchTasks();
                }
            });
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const id = taskForm.getAttribute('data-id');

        const selectedTagsList = document.querySelectorAll('#tags option:checked');

        const tags = Array.from(selectedTagsList).map(tag => ({
            id: parseInt(tag.value, 10),
            name: tag.text
        }));


        const taskData = {
            title,
            description,
            tags
        };

        if (id) { // Update task
            fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
                .then(response => response.json())
                .then(() => {
                    fetchTasks();
                    taskForm.reset();
                    updateButton.disabled = true;
                    submitButton.disabled = false;
                    taskForm.removeAttribute('data-id');
                    selectedTags.clear();
                    updateSelectedTags();
                });
        } else { // Add new task
            fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
                .then(response => response.json())
                .then(() => {
                    fetchTasks();
                    taskForm.reset();
                    selectedTags.clear();
                    updateSelectedTags();
                });
        }
    });

    tagSelect.addEventListener('change', function(event) {
        const selectedOptions = Array.from(tagSelect.selectedOptions);
        selectedTags = new Set(selectedOptions.map(option => parseInt(option.value)));
        updateSelectedTags();
    });

    addTagButton.addEventListener('click', function() {
        const tagName = newTagInput.value.trim();
        if (tagName) {
            fetch(`/tags/create?name=${encodeURIComponent(tagName)}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(() => {
                    fetchTags(); // Refresh the tag list
                    newTagInput.value = ''; // Clear input field
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

    logoutButton.addEventListener('click', function () {
        fetch('/logout', {method: 'POST'})
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login'; // Redirect to login page
                }
            });
    });

    fetchTags();
    fetchTasks();
});
