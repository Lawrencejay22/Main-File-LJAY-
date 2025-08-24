// Get the form and result elements from the DOM
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    // Add a listener for the form's 'submit' event
    form.addEventListener('submit', function(e) {
        // Prevent the default form submission (page reload)
        e.preventDefault();

        // Get form data and convert it to a JSON object
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Show a "please wait" message to the user
        result.innerHTML = "Please wait..."

        // Use the fetch API to send the data to Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status === 200) {
                // Handle a successful submission
                result.innerHTML = "Form submitted successfully";
            } else {
                // Handle errors and display the message from the API
                console.error('Form submission failed:', response);
                result.innerHTML = jsonResponse.message;
            }
        })
        .catch(error => {
            // Handle network or other errors
            console.error('An error occurred:', error);
            result.innerHTML = "Something went wrong!";
        })
        .finally(() => {
            // Reset the form and hide the result message after a delay
            form.reset();
            setTimeout(() => {
                result.innerHTML = ''; // Clear the message
            }, 3000);
        });
    });