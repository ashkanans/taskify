// index.js
document.addEventListener('DOMContentLoaded', function () {
    const passwordField = document.getElementById('password');
    const togglePassword = document.createElement('span');

    togglePassword.textContent = 'Show';
    togglePassword.style.cursor = 'pointer';
    togglePassword.style.marginLeft = '10px';
    passwordField.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', function () {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePassword.textContent = 'Hide';
        } else {
            passwordField.type = 'password';
            togglePassword.textContent = 'Show';
        }
    });
});
