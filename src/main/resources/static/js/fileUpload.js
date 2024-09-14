export const fileState = {
    files: []
};

export function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const dropZone = document.getElementById('dropZone');

    // Setup event listeners
    setupEventListeners();

    // Setup all event listeners
    function setupEventListeners() {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFiles);
    }

    // Handle drag over to allow file drop
    function handleDragOver(e) {
        e.preventDefault();
        dropZone.classList.add('dragging');
    }

    // Handle file drop
    function handleDrop(e) {
        e.preventDefault();
        dropZone.classList.remove('dragging');
        const files = e.dataTransfer.files;
        updateFileInput(files); // Update file input and state
        displayFiles(fileState.files); // Display the dropped files
    }

    // Handle files when selected via file input
    function handleFiles() {
        const files = fileInput.files;
        updateFileInput(files); // Update file input and state
        displayFiles(fileState.files); // Display the selected files
    }

    // Update file input and global fileState
    function updateFileInput(files) {
        fileInput.files = files;
        fileState.files = Array.from(files); // Convert FileList to array for easy manipulation
    }

    // Display the selected/dropped files in the UI
    function displayFiles(files) {
        filePreview.innerHTML = ''; // Clear previous previews
        files.forEach((file) => {
            const fileItem = createFileItem(file);
            filePreview.appendChild(fileItem);
        });
    }

    // Create a DOM element for each file
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Add file name
        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        fileItem.appendChild(fileName);

        // Add file preview (if image)
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            fileItem.appendChild(img);
        }

        // Add remove button
        const removeButton = createRemoveButton(file);
        fileItem.appendChild(removeButton);

        return fileItem;
    }

    // Create a remove button for each file
    function createRemoveButton(file) {
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-file';
        removeButton.textContent = 'x';

        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(file);
        });

        return removeButton;
    }

    // Remove the selected file from the global fileState
    function removeFile(fileToRemove) {
        fileState.files = fileState.files.filter(file => file !== fileToRemove);
        displayFiles(fileState.files); // Refresh the displayed files
    }
}
