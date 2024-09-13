export const fileState = {
    files: []
};

export function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const dropZone = document.getElementById('dropZone');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);

    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        fileInput.files = files;
        fileState.files = files; // Update the global fileState
        displayFiles(files);
    }

    function handleFiles() {
        fileState.files = fileInput.files; // Update the global fileState
        displayFiles(fileState.files);
    }

    function displayFiles(files) {
        filePreview.innerHTML = '';
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            const fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileItem.appendChild(fileName);
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                fileItem.appendChild(img);
            }
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-file';
            removeButton.textContent = 'x';
            removeButton.onclick = (e) => {
                e.stopPropagation();
                fileItem.remove();
            };
            fileItem.appendChild(removeButton);
            filePreview.appendChild(fileItem);
        });
    }
}
