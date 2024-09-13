import {handleTaskFormSubmission} from './formHandlers.js';
import {initFileUpload} from './fileUpload.js';
import {initTaskManagement} from './taskManagement.js';
import {initUIUpdates} from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', function() {
    handleTaskFormSubmission();
    initFileUpload();
    initTaskManagement();
    initUIUpdates();
});
