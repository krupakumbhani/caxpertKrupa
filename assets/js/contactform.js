
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const form = document.getElementById("contactForm");
    console.log("Form element:", form); // Check if the form element is correctly selected
  
    if (!form) {
      console.error("Form element not found");
      return; // Exit if the form is not found
    }
  const phoneInputField = document.querySelector("#mobile");
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      fetch("https://ipinfo.io/json?token=9d7a5db97b7701", {
        headers: { Accept: "application/json" },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          const countryCode = resp && resp.country ? resp.country : "us";
          callback(countryCode);
        });
    },
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
       
        console.log("Form submit event triggered");
      e.preventDefault();
      let isValid = true;
      // ReCAPTCHA validation
      var recaptchaResponse = grecaptcha.getResponse();
      const captchError = document.getElementById("captchaError");
      if (recaptchaResponse.length === 0) {
        isValid = false;
        captchError.style.display = "block";
        captchError.textContent = "Please complete the reCAPTCHA to proceed.";
      } else {
        captchError.textContent = "";
        captchError.style.display = "none";
      }
      // Name validation
      const nameField = document.getElementById("name");
      const nameError = document.getElementById("nameError");
      if (nameField.value.trim() === "") {
        nameError.textContent = "Please enter your name.";
        nameError.style.display = "block";
        isValid = false;
      } else {
        nameError.style.display = "none";
      }

      // Email validation
      const emailField = document.getElementById("email");
      const emailError = document.getElementById("emailError");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.display = "block";
        isValid = false;
      } else {
        emailError.style.display = "none";
      }

      // Mobile validation
      const mobileError = document.getElementById("mobileError");
      if (phoneInput.isValidNumber()) {
        mobileError.textContent = "";
        mobileError.style.display = "none";
      } else {
        isValid = false;
        mobileError.textContent = "Please enter a valid mobile number.";
        mobileError.style.display = "block";
      }

      if (isValid) {
        console.log("Form is valid, submitting...");
        this.submit();
        window.location.href = "https://caxpert.com/contact.html"

      }else{
        console.log("Form is invalid, not submitting.");
      }
    });
});
