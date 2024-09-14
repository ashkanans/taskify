function performLogin(username, password) {
    fetch(`/api/auth?username=${username}&password=${password}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(authToken => {
            if (authToken.status === "success") {
                // Store token in localStorage or sessionStorage
                localStorage.setItem('token', authToken.data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                // Handle token expiration if provided in the response
                if (authToken.data.tokenExpiration) {
                    localStorage.setItem('tokenExpiration', authToken.data.tokenExpiration);
                }

                console.log('Token saved!');
            } else {
                console.error('Login failed: Invalid token');
                // Show a message to the user about login failure
                document.getElementById('error-message').textContent = authToken.message || 'Invalid credentials, please try again.';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            // Show a message to the user about network or unexpected error
            document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
        });
}


document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePasswordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.src = "/images/hide-password.png"; // Switch to hide icon
    } else {
        passwordInput.type = "password";
        toggleIcon.src = "/images/show-password.png"; // Switch to show icon
    }
});

document.getElementById("submit").addEventListener("click", (e) => {
    // e.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // Perform login
    performLogin(usernameInput, passwordInput);
});

