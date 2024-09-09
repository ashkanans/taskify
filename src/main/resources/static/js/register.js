document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('register-form');
    const messageDiv = document.getElementById('registration-message');

    // Fetch the registration status from the server
    try {
        const response = await fetch('/registration-status');
        const status = await response.json();

        if (status.registrationBlocked) {
            // Show the registration blocked message
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'Registration is currently disabled. Please try again later.';

            // Disable all form fields and the button
            const formElements = form.querySelectorAll('input, button');
            formElements.forEach(element => {
                element.disabled = true;
            });

            // Optionally, you can also hide the form if desired
            // form.style.display = 'none';
        } else {
            // Show the registration form if registration is not blocked
            form.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching registration status:', error);
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'An error occurred while checking registration status.';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Create a FormData object from the form
        const formData = new FormData(form);

        try {
            // Send the form data to the server using Fetch API
            const response = await fetch('/register', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Handle successful registration
                alert('Registration successful!');
                window.location.href = '/login'; // Redirect to login page or another page
            } else {
                // Handle errors (e.g., show error message)
                const errorText = await response.text();
                alert('Registration failed: ' + errorText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
