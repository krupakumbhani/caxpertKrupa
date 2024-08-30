document.addEventListener("DOMContentLoaded", function() {
    const phoneInputField = document.querySelector("#mobile");
    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "auto",
        geoIpLookup: function (callback) {
            fetch('https://ipinfo.io/json?token=9d7a5db97b7701', { headers: { 'Accept': 'application/json' } })
                .then((resp) => resp.json())
                .then((resp) => {
                    const countryCode = resp && resp.country ? resp.country : "us";
                    callback(countryCode);
                });
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;

        // Name validation
        const nameField = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (nameField.value.trim() === '') {
            nameError.textContent = 'Please enter your name.';
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        // Email validation
        const emailField = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Mobile validation
        const mobileError = document.getElementById('mobileError');
        if (phoneInput.isValidNumber()) {
            mobileError.textContent = "";
        } else {
            isValid = false;
            mobileError.textContent = "Please enter a valid mobile number.";
        }

        if (isValid) {
            this.submit();
        }
    });
});
