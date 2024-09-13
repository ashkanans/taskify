import {fetchTasks, taskState, updateSelectedCategories, updateSelectedTags} from './taskManagement.js';
import {fileState} from './fileUpload.js';

// Function to handle form submission
export function handleTaskFormSubmission() {
    const taskForm = document.getElementById('taskForm');
    const submitButton = document.getElementById('submit');
    const updateButton = document.getElementById('update');

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const id = taskForm.getAttribute('data-id'); // Check if form has data-id for update

        const selectedTagsList = document.querySelectorAll('#tags option:checked');
        const selectedCategoriesList = document.querySelectorAll('#categories option:checked');

        const tags = Array.from(selectedTagsList).map(tag => ({
            id: parseInt(tag.value, 10),
            name: tag.textContent
        }));

        const category = {
            id: parseInt(selectedCategoriesList[0].value, 10),
            name: selectedCategoriesList[0].textContent
        };

        const taskData = {
            title,
            description,
            tags,
            category
        };

        if (id) { // Update task
            fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(taskData)
            })
                .then(response => response.json())
                .then((updatedTask) => {
                    console.log('Task updated successfully');
                    taskForm.reset();
                    taskState.selectedTags.clear();  // Clear selected tags
                    taskState.selectedCategories = null;
                    fetchTasks(document.getElementById('taskTableBody'));  // Fetch and update task list
                    updateSelectedTags(document.getElementById('selectedTags'));
                    updateSelectedCategories(document.getElementById('selectedCategories'));
                    updateButton.disabled = true;
                    submitButton.disabled = false;

                    // Upload files after task update
                    uploadTaskFiles(updatedTask.id);
                })
                .catch(error => console.error('Error updating task:', error));
        } else { // Create new task
            fetch('/tasks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(taskData)
            })
                .then(response => response.json())
                .then((createdTask) => {
                    console.log('Task created successfully');
                    taskForm.reset();
                    taskState.selectedTags.clear();  // Clear selected tags
                    taskState.selectedCategories = null;
                    fetchTasks(document.getElementById('taskTableBody'));
                    updateSelectedTags(document.getElementById('selectedTags'));
                    updateSelectedCategories(document.getElementById('selectedCategories'));

                    // Upload files after task creation
                    uploadTaskFiles(createdTask.id);
                })
                .catch(error => console.error('Error creating task:', error));
        }
    });
}

function uploadTaskFiles(taskId) {
    const files = fileState.files; // Files selected from the file input
    if (files.length > 0) {
        const formData = new FormData();

        // Append each file to the formData object with the key 'files'
        Array.from(files).forEach(file => {
            formData.append('files', file); // Use 'files' as the key
        });

        formData.append('taskId', taskId); // Append the taskId separately

        // Send files to the server
        fetch('/files/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                console.log('Files uploaded successfully:', result);
                // Optionally, clear the file input or file preview after upload
            })
            .catch(error => console.error('Error uploading files:', error));
    }
}
