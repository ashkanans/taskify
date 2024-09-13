export const taskState = {
    selectedTags: new Set(),
    selectedCategories: null
};

export function fetchTasks(taskTableBody) {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskTableBody.innerHTML = '';
            tasks.forEach(task => {
                const tagsHtml = task.tags.map(tag => `<span class="tag">${tag.name}</span>`).join(' ');
                const categoriesHtml = task.category ? `<span class="tag">${task.category.name}</span>` : '';
                let attachmentsHTML = '';
                if (task.fileMetadata && task.fileMetadata.length > 0) {
                    attachmentsHTML = `
                        <button class="attachments-button" data-id="${task.id}">
                            <img src="/images/attachment.png" alt="Attachments Icon">
                        </button>
                    `;
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${tagsHtml}</td>
                    <td>${categoriesHtml}</td>
                    <td>${attachmentsHTML}</td>
                    <td>
                        <button class="delete-button" data-id="${task.id}">Delete</button>
                        <button class="update-button" data-id="${task.id}">Update</button>
                    </td>
                `;
                taskTableBody.appendChild(row);
            });
            addAttachmentsButtonListener();
        });
}

// Download task attachments
export function downloadAttachments(taskId) {
    fetch(`/tasks/${taskId}/files`)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                const link = document.createElement('a');
                link.href = `${file.fileUrl}`;
                link.download = file.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        })
        .catch(error => console.error('Error downloading attachments:', error));
}

// Add event listener to download attachments
function addAttachmentsButtonListener() {
    document.querySelectorAll('.attachments-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Ensure we are getting the button itself, not the img
            const buttonElement = e.target.closest('button');
            const taskId = buttonElement.getAttribute('data-id');
            if (taskId) {
                downloadAttachments(taskId);
            }
        });
    });
}

// Update selected tags in the UI
export function updateSelectedTags(selectedTagsContainer) {
    selectedTagsContainer.innerHTML = '';
    fetch('/tags')
        .then(response => response.json())
        .then(tags => {
            tags.forEach(tag => {
                if (taskState.selectedTags.has(tag.id)) {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag selected';
                    tagElement.textContent = tag.name;
                    selectedTagsContainer.appendChild(tagElement);
                }
            });
        });
}

// Update selected categories in the UI
export function updateSelectedCategories(selectedCategoriesContainer) {
    selectedCategoriesContainer.innerHTML = '';
    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                if (taskState.selectedCategories && taskState.selectedCategories.id === category.id) {
                    const categoryElement = document.createElement('span');
                    categoryElement.className = 'category selected';
                    categoryElement.textContent = category.name;
                    selectedCategoriesContainer.appendChild(categoryElement);
                }
            });
        });
}

// Delete a task by id
export function deleteTask(id, taskTableBody) {
    fetch(`/tasks/${id}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok) {
                fetchTasks(taskTableBody);
            }
        });
}

// Update a task in the form for editing
export function updatePage(id, taskForm, updateButton, submitButton) {
    fetch(`/tasks/${id}`, {method: 'GET'})
        .then(response => response.json())
        .then(task => {
            if (task.id) {
                document.getElementById('title').value = task.title;
                document.getElementById('description').value = task.description;
                updateButton.disabled = false;
                submitButton.disabled = true;
                taskForm.setAttribute('data-id', task.id);
                taskState.selectedTags = new Set(task.tags.map(tag => tag.id));
                taskState.selectedCategories = task.category;
                updateSelectedTags(document.getElementById('selectedTags'));
                updateSelectedCategories(document.getElementById('selectedCategories'));
            }
        });
}

// Initialize task management and add event listeners
export function initTaskManagement() {
    const taskTableBody = document.getElementById('taskTableBody');
    const updateButton = document.getElementById('update');
    const submitButton = document.getElementById('submit');
    const taskForm = document.getElementById('taskForm');

    taskTableBody.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('delete-button')) {
            const taskId = event.target.getAttribute('data-id');
            deleteTask(taskId, taskTableBody);
        } else if (event.target && event.target.classList.contains('update-button')) {
            const taskId = event.target.getAttribute('data-id');
            updatePage(taskId, taskForm, updateButton, submitButton);
        }
    });

    fetchTasks(taskTableBody);
}
