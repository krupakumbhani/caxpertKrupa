document.getElementById("taxForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const fileInput = document.getElementById("form-field-attachment");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

          let isValid = true;
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
  
          if (isValid) {
              console.log("Form is valid, submitting...");
              submitForm(this);
            }else{
              console.log("Form is invalid, not submitting.");
            }
  });
  
 
  
  async function submitForm(form) {
    const formData = new FormData(form);
  
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
      console.log(response)
      if (response.ok) {
        console.log(response.ok)
        window.location.href = "https://krupakumbhani.github.io/caxpertKrupa/careers.html";
      } else {
        throw new Error("Form submission failed");
      }
    } 
    catch (error) {
      console.error("Error submitting the form:", error);
    //   alert("There was an error submitting the form. Please try again.");
    //   window.location.href =
    //     "https://krupakumbhani.github.io/caxpertKrupa/index.html";
    }
  }
  