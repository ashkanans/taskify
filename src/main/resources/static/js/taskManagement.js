export class TaskManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.username = localStorage.getItem('username');
        this.password = localStorage.getItem('password');
        this.taskState = {
            selectedTags: new Set(),
            selectedCategories: null
        };
    }

    async validateToken() {
        try {
            const response = await fetch(`api/validate?username=${this.username}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            return result.status === "success";
        } catch (error) {
            console.error('Error during token validation:', error);
            return false;
        }
    }

    async ensureValidToken() {
        const isValid = await this.validateToken();
        if (!isValid) {
            await this.performLogin();
            this.token = localStorage.getItem('token');
        }
    }

    async performLogin() {
        try {
            const response = await fetch(`/api/auth?username=${this.username}&password=${this.password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const authToken = await response.json();

            if (authToken.status === "success") {
                // Store token and credentials in localStorage
                localStorage.setItem('token', authToken.data.token);
                localStorage.setItem('username', this.username);
                localStorage.setItem('password', this.password);

                if (authToken.data.tokenExpiration) {
                    localStorage.setItem('tokenExpiration', authToken.data.tokenExpiration);
                }

                console.log('Token saved!');
            } else {
                console.error('Login failed: Invalid token');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    async fetchTasks(taskTableBody) {
        await this.ensureValidToken();

        fetch('api/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
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
                this.addAttachmentsButtonListener();
            });
    }

    async downloadAttachments(taskId) {
        await this.ensureValidToken();

        fetch(`api/tasks/${taskId}/files`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
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

    addAttachmentsButtonListener() {
        document.querySelectorAll('.attachments-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonElement = e.target.closest('button');
                const taskId = buttonElement.getAttribute('data-id');
                if (taskId) {
                    this.downloadAttachments(taskId);
                }
            });
        });
    }

    async deleteTask(id, taskTableBody) {
        await this.ensureValidToken();

        fetch(`api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    this.fetchTasks(taskTableBody);
                }
            });
    }

    async updatePage(id, taskForm, updateButton, submitButton) {
        await this.ensureValidToken();

        fetch(`api/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(task => {
                if (task.id) {
                    document.getElementById('title').value = task.title;
                    document.getElementById('description').value = task.description;
                    updateButton.disabled = false;
                    submitButton.disabled = true;
                    taskForm.setAttribute('data-id', task.id);
                    this.taskState.selectedTags = new Set(task.tags.map(tag => tag.id));
                    this.taskState.selectedCategories = task.category;
                    this.updateSelectedTags(document.getElementById('selectedTags'));
                    this.updateSelectedCategories(document.getElementById('selectedCategories'));
                }
            });
    }

    async updateSelectedTags(selectedTagsContainer) {
        selectedTagsContainer.innerHTML = '';
        try {
            const response = await fetch('/tags');
            const tags = await response.json();
            tags.forEach(tag => {
                if (this.taskState.selectedTags.has(tag.id)) {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag selected';
                    tagElement.textContent = tag.name;
                    selectedTagsContainer.appendChild(tagElement);
                }
            });
        } catch (error) {
            console.error('Error updating selected tags:', error);
        }
    }

    async updateSelectedCategories(selectedCategoriesContainer) {
        selectedCategoriesContainer.innerHTML = '';
        try {
            const response = await fetch('/categories');
            const categories = await response.json();
            categories.forEach(category => {
                if (this.taskState.selectedCategories && this.taskState.selectedCategories.id === category.id) {
                    const categoryElement = document.createElement('span');
                    categoryElement.className = 'category selected';
                    categoryElement.textContent = category.name;
                    selectedCategoriesContainer.appendChild(categoryElement);
                }
            });
        } catch (error) {
            console.error('Error updating selected categories:', error);
        }
    }

    async initTaskManagement() {
        const taskTableBody = document.getElementById('taskTableBody');
        const updateButton = document.getElementById('update');
        const submitButton = document.getElementById('submit');
        const taskForm = document.getElementById('taskForm');

        taskTableBody.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('delete-button')) {
                const taskId = event.target.getAttribute('data-id');
                this.deleteTask(taskId, taskTableBody);
            } else if (event.target && event.target.classList.contains('update-button')) {
                const taskId = event.target.getAttribute('data-id');
                this.updatePage(taskId, taskForm, updateButton, submitButton);
            }
        });

        await this.fetchTasks(taskTableBody);
    }
}

