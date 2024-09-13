document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePasswordIcon");

    // Toggle the type attribute of the password input
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.src = "/images/hide-password.png"; // Switch to hide icon
    } else {
        passwordInput.type = "password";
        toggleIcon.src = "/images/show-password.png"; // Switch to show icon
    }
});
