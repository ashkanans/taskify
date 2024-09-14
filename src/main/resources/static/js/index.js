import {initFormHandler} from './formHandlers.js';
import {initFileUpload} from './fileUpload.js';
import {TaskManager} from './taskManagement.js';
import {initUIUpdates} from './uiUpdates.js';
// import {validate} from "./login";

const taskManager = new TaskManager();
document.addEventListener('DOMContentLoaded', function() {
    // validate()
    initFormHandler();
    initFileUpload();
    taskManager.initTaskManagement();
    initUIUpdates();
});
