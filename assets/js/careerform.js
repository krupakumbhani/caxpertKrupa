document.getElementById('taxForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('form-field-attachment');
    const file = fileInput.files[0];

    if (file) {
        scanFile(file).then(result => {
            if (result) {
                this.submit(); // Proceed with form submission if the file is clean
            } else {
                alert('The file might be infected with a virus and cannot be uploaded.');
            }
        }).catch(error => {
            console.error('Error scanning the file:', error);
            alert('There was an error scanning the file. Please try again.');
        });
    }
});

async function scanFile(file) {
    const apiKey = 'f7ebab7f360c67359d52add3aae8b0fdbabc3a0268c9cff7315120ee9790ec58'; // Replace with your VirusTotal API key
    const formData = new FormData();
    formData.append('file', file);

    try {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'x-apikey': apiKey
            },
            body: formData
        };

        const response = await fetch('https://www.virustotal.com/api/v3/files', options);
        const data = await response.json();

        if (data.data && data.data.links && data.data.links.self) {
            return await getScanResult(data.data.links.self, apiKey);
        } else if (data.error) {
            throw new Error(Error: ${data.error.message});
        }

        return false; // Unknown response, assume failure
    } catch (error) {
        console.error('Error uploading file to VirusTotal:', error);
        return false;
    }
}

async function getScanResult(url, apiKey) {
    try {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-apikey': apiKey
            }
        };

        // Wait a few seconds before checking the result
        await new Promise(resolve => setTimeout(resolve, 5000));

        const response = await fetch(url, options);
        const data = await response.json();

        // Check if the analysis is done and whether the file is clean
        if (data.data && data.data.attributes && data.data.attributes.stats) {
            const stats = data.data.attributes.stats;
            console.error('result of scanned file :', stats);
            return stats.malicious === 0; // True if no malicious results
        }
        return false;
    } catch (error) {
        console.error('Error fetching scan result:', error);
        return false;
    }
}