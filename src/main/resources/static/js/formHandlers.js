import {TaskManager} from './taskManagement.js';
import {fileState} from './fileUpload.js';

// Create an instance of TaskManager
const taskManager = new TaskManager();

// Initialize the form handler
export function initFormHandler() {
    const taskForm = document.getElementById('taskForm');
    const submitButton = document.getElementById('submit');
    const updateButton = document.getElementById('update');

    taskForm.addEventListener('submit', handleFormSubmit);

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const id = taskForm.getAttribute('data-id'); // Check if form has data-id for update

        const tags = getSelectedTags();
        const category = getSelectedCategory();

        const taskData = {
            title,
            description,
            tags,
            category
        };

        if (id) {
            await updateTask(id, taskData);
        } else {
            await createTask(taskData);
        }
    }

    // Get selected tags from the form
    function getSelectedTags() {
        const selectedTagsList = document.querySelectorAll('#tags option:checked');
        return Array.from(selectedTagsList).map(tag => ({
            id: parseInt(tag.value, 10),
            name: tag.textContent
        }));
    }

    // Get selected category from the form
    function getSelectedCategory() {
        const selectedCategoriesList = document.querySelectorAll('#categories option:checked');
        return selectedCategoriesList.length > 0 ? {
            id: parseInt(selectedCategoriesList[0].value, 10),
            name: selectedCategoriesList[0].textContent
        } : null;
    }

    // Update an existing task
    async function updateTask(id, taskData) {
        try {
            await taskManager.ensureValidToken();
            const response = await fetch(`api/tasks/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${taskManager.token}`},
                body: JSON.stringify(taskData)
            });
            const updatedTask = await response.json();
            console.log('Task updated successfully');
            handlePostTaskUpdate();
            await uploadTaskFiles(updatedTask.id);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Create a new task
    async function createTask(taskData) {
        try {
            await taskManager.ensureValidToken();
            const response = await fetch('api/tasks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${taskManager.token}`},
                body: JSON.stringify(taskData)
            });
            const createdTask = await response.json();
            console.log('Task created successfully');
            handlePostTaskCreation();
            await uploadTaskFiles(createdTask.id);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    // Common post-task operations after creating or updating
    function handlePostTaskUpdate() {
        taskForm.reset();
        taskManager.taskState.selectedTags.clear();  // Clear selected tags
        taskManager.taskState.selectedCategories = null;
        taskManager.fetchTasks(document.getElementById('taskTableBody'));
        taskManager.updateSelectedTags(document.getElementById('selectedTags'));
        taskManager.updateSelectedCategories(document.getElementById('selectedCategories'));
        updateButton.disabled = true;
        submitButton.disabled = false;
    }

    function handlePostTaskCreation() {
        handlePostTaskUpdate();
    }

    // Upload files associated with the task
    async function uploadTaskFiles(taskId) {
        const files = fileState.files;
        if (files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach(file => formData.append('files', file));
            formData.append('taskId', taskId);

            try {
                const response = await fetch('/files/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                console.log('Files uploaded successfully:', result);
                // Optionally clear the file input or file preview after upload
                fileState.files = []; // Clear file state after upload
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
    }
}