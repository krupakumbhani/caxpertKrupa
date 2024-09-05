$("#form-field-attachment").on("change", function () {
    var file = this.files[0];
    var fr = new FileReader();
    fr.fileName = file.name; // Store the filename
    fr.onload = function (e) {
      var result = e.target.result;
      var data = result.replace(/^.*,/, ""); // Remove the data URL prefix
      var mimetype = result.match(/^.*(?=;)/)[0]; // Extract MIME type
      var filename = e.target.fileName; // Get filename from FileReader
  
      // Append hidden input fields with file data, mimetype, and filename
      var html = `
        <input type="hidden" name="data" value="${data}">
        <input type="hidden" name="mimetype" value="${mimetype}">
        <input type="hidden" name="filename" value="${filename}">
      `;
  
      $("#data").empty().append(html); // Update the form with file data
    };
    fr.readAsDataURL(file); // Read the file as a Data URL
  });
  
  $("#taxForm").on("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
  
    let isValid = true;
    var recaptchaResponse = grecaptcha.getResponse(); // Check reCAPTCHA
    const captchError = document.getElementById("captchaError");
  
    // Check reCAPTCHA validity
    if (recaptchaResponse.length === 0) {
      isValid = false;
      captchError.style.display = "block";
      captchError.style.color = "red";
      captchError.textContent = "Please complete the reCAPTCHA to proceed.";
    } else {
      captchError.textContent = "";
      captchError.style.display = "none";
    }
  
    // Continue if form is valid
    if (isValid) {
      const fileInput = document.getElementById("form-field-attachment");
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select a file before submitting.");
        return; // Stop submission if no file is selected
      }
      console.log("Form is valid, submitting...");
      submitForm(this); // Submit the form if valid
    } else {
      console.log("Form is invalid, not submitting.");
    }
  
    async function submitForm(form) {
      // Show the loader
      $("#loader").show();
     
      $("#submitButton").prop('disabled', true).css({
        'background-color': '#ccc',  // Change to the desired disabled color
        'color': '#666',             // Change text color if needed
        'cursor': 'not-allowed'      // Change cursor to indicate disabled state
    });
     
      // Create a FormData object for the form
      var formData = new FormData(form);
  
      // Use AJAX to submit the form
      $.ajax({
        url: $(form).attr("action"), // Use 'form' instead of 'this'
        type: "POST",
        data: formData,
        processData: false, // Disable automatic processing of the data
        contentType: false, // Let the browser set content-type
        success: function (response) {
          // Hide the loader
          $("#loader").hide();
  
          // Display success or failure popup
          var popupTitle = response.status === "success" ? "Success" : "Error";
          var popupMessage =
            response.status === "success"
              ? "File uploaded successfully!"
              : "Failed to upload file: " + response.message;
          showPopup(popupTitle, popupMessage);
  
          // Redirect after popup is closed if the upload is successful
          if (response.status === "success") {
            
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // Hide the loader on error
          $("#loader").hide();
          showPopup("Error", "Failed, Please try again");
        },
      });
    }
  });
  
  // Function to show popup with a message
  function showPopup(title, message) {
    $("#popup-title").text(title);
    $("#popup-message").text(message);
    $("#popup").show();
  }
  
  // Function to close the popup
  function closePopup() {
    $("#popup").hide();
    $("#submitButton").prop('disabled', false).css({
        'background-color': '',  // Reset to original color
        'color': '',             // Reset text color
        'cursor': 'pointer'      // Restore cursor
    });;
    const filledform =  $("#taxForm");
            filledform[0].reset();
            document.querySelectorAll('input[type="hidden"], textarea').forEach(field => field.value = '');
            document.getElementById('position').value = '';
            document.getElementById('customDropdownButton').textContent = 'Select an option';
            if (typeof grecaptcha !== "undefined") {
                grecaptcha.reset(); // Reset the reCAPTCHA widget
            }
  }

  function clearForm() {
    
  }
  