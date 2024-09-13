export function initUIUpdates() {
    const tagSelect = document.getElementById('tags');
    const categorySelect = document.getElementById('categories');
    const addTagButton = document.getElementById('addTag');
    const addCategoryButton = document.getElementById('addCategory');
    const newTagInput = document.getElementById('newTag');
    const newCategoryInput = document.getElementById('newCategory');
    const selectedTagsContainer = document.getElementById('selectedTags');
    const selectedCategoriesContainer = document.getElementById('selectedCategories');
    const logoutButton = document.getElementById('logoutButton');

    let selectedTags = new Set();
    let selectedCategories = null;

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
                    if (selectedCategories && selectedCategories.id === category.id) {
                        const categoryElement = document.createElement('span');
                        categoryElement.className = 'category selected';
                        categoryElement.textContent = category.name;
                        selectedCategoriesContainer.appendChild(categoryElement);
                    }
                });
            });
    }

    function handleTagSelectChange() {
        const selectedOptions = Array.from(tagSelect.selectedOptions);
        selectedTags = new Set(selectedOptions.map(option => parseInt(option.value)));
        updateSelectedTags();
    }

    function handleCategorySelectChange() {
        const selectedOptions = categorySelect.selectedOptions[0];
        selectedCategories = {id: parseInt(selectedOptions.value), name: selectedOptions.text};
        updateSelectedCategories();
    }

    function handleAddTag() {
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
    }

    function handleAddCategory() {
        const categoryName = newCategoryInput.value.trim();
        if (categoryName) {
            fetch(`/categories/create?name=${encodeURIComponent(categoryName)}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(() => {
                    fetchCategories(); // Refresh the category list
                    newCategoryInput.value = ''; // Clear input field
                });
        }
    }

    function handleLogout() {
        fetch('/logout', {method: 'POST'})
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login'; // Redirect to login page
                }
            });
    }

    tagSelect.addEventListener('change', handleTagSelectChange);
    categorySelect.addEventListener('change', handleCategorySelectChange);
    addTagButton.addEventListener('click', handleAddTag);
    addCategoryButton.addEventListener('click', handleAddCategory);
    logoutButton.addEventListener('click', handleLogout);

    fetchTags();
    fetchCategories();
    updateSelectedTags();
    updateSelectedCategories();
}
