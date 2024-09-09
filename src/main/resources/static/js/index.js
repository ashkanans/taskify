document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTableBody = document.getElementById('taskTableBody');
    const submitButton = document.getElementById('submit');
    const updateButton = document.getElementById('update');
    const logoutButton = document.getElementById('logoutButton');
    const tagSelect = document.getElementById('tags');
    const categorySelect = document.getElementById('categories');
    const addTagButton = document.getElementById('addTag');
    const addCategoryButton = document.getElementById('addCategory');
    const newTagInput = document.getElementById('newTag');
    const newCategoryInput = document.getElementById('newCategory');
    const selectedTagsContainer = document.getElementById('selectedTags');
    const selectedCategoriesContainer = document.getElementById('selectedCategories');

    let selectedTags = new Set();
    let selectedCategories = null;


    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskTableBody.innerHTML = '';
                tasks.forEach(task => {
                    const tagsHtml = task.tags.map(tag => `<span class="tag">${tag.name}</span>`).join(' ');
                    const categoriesHtml = task.category ? `<span class="tag">${task.category.name}</span>` : '';
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${tagsHtml}</td>
                        <td>${categoriesHtml}</td>
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

    function fetchCategories() {
        fetch('/categories')
            .then(response => response.json())
            .then(categories => {
                categorySelect.innerHTML = '';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
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
                    selectedCategories = task.category
                    updateSelectedTags();
                    updateSelectedCategories();
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

    function updateSelectedCategories() {
        selectedCategoriesContainer.innerHTML = '';
        fetch('/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    if (selectedCategories.id === category.id) {
                        const categoryElement = document.createElement('span');
                        categoryElement.className = 'category selected';
                        categoryElement.textContent = category.name;
                        selectedCategoriesContainer.appendChild(categoryElement);
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
        const selectedCategoriesList = document.querySelectorAll('#categories option:checked');


        const tags = Array.from(selectedTagsList).map(tag => ({
            id: parseInt(tag.value, 10),
            name: tag.text
        }));

        const category = {
            id: parseInt(selectedCategoriesList[0].value, 10),
            name: selectedCategoriesList[0].text
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
                    selectedCategories = null;
                    updateSelectedTags();
                    updateSelectedCategories()
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
                    selectedCategories.clear()
                    updateSelectedTags();
                    updateSelectedCategories()
                });
        }
    });

    tagSelect.addEventListener('change', function(event) {
        const selectedOptions = Array.from(tagSelect.selectedOptions);
        selectedTags = new Set(selectedOptions.map(option => parseInt(option.value)));
        updateSelectedTags();
    });

    categorySelect.addEventListener('change', function(event) {
        const selectedOptions = categorySelect.selectedOptions[0];
        selectedCategories = {id: parseInt(selectedOptions.value), name: selectedOptions.text};
        updateSelectedCategories();
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

    addCategoryButton.addEventListener('click', function() {
        const categoryName = newCategoryInput.value.trim();
        if (categoryName) {
            fetch(`/categories/create?name=${encodeURIComponent(categoryName)}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(() => {
                    fetchCategories(); // Refresh the tag list
                    newCategoryInput.value = ''; // Clear input field
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
    fetchCategories();
    fetchTasks();
});
