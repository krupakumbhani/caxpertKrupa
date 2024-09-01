document.getElementById("taxForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const fileInput = document.getElementById("form-field-attachment");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file before submitting.");
    return;
  }

  scanFile(file)
    .then((result) => {
      if (result) {
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
         // Proceed with form submission if the file is clean
      } else {
        alert(
          "The file might be infected with a virus and cannot be uploaded."
        );
      }
    })
    .catch((error) => {
      console.error("Error scanning the file:", error);
      alert("There was an error scanning the file. Please try again.");
    });
});

async function scanFile(file) {
  const apiKey =
    "f7ebab7f360c67359d52add3aae8b0fdbabc3a0268c9cff7315120ee9790ec58"; // Replace with your VirusTotal API key
  const formData = new FormData();
  formData.append("file", file);

  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-apikey": apiKey,
      },
      body: formData,
    };

    const response = await fetch(
      "https://www.virustotal.com/api/v3/files",
      options
    );
    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data && data.data.links && data.data.links.self) {
      return await getScanResult(data.data.links.self, apiKey);
    } else if (data.error) {
      throw new Error(`Error: ${data.error.message}`);
    }

    return false; // Unknown response, assume failure
  } catch (error) {
    console.error("Error uploading file to VirusTotal:", error);
    return false;
  }
}

async function getScanResult(url, apiKey) {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-apikey": apiKey,
      },
    };

    // Wait a few seconds before checking the result
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching scan result: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the analysis is done and whether the file is clean
    if (data.data && data.data.attributes && data.data.attributes.stats) {
      const stats = data.data.attributes.stats;
      console.error("Result of scanned file:", stats);
      return stats.malicious === 0; // True if no malicious results
    }
    return false;
  } catch (error) {
    console.error("Error fetching scan result:", error);
    return false;
  }
}

async function submitForm(form) {
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      window.location.href = form.querySelector('input[name="_next"]').value;
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    console.error("Error submitting the form:", error);
    alert("There was an error submitting the form. Please try again.");
    window.location.href =
      "https://krupakumbhani.github.io/caxpertKrupa/index.html";
  }
}
