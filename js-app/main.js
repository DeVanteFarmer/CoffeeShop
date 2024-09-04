const url = "https://localhost:5000/api/beanvariety/";

// Select elements
const button = document.querySelector("#run-button");
const beanVarietiesDiv = document.querySelector("#bean-varieties");
const form = document.querySelector("#bean-form");

// Event listener for "Run It!" button
button.addEventListener("click", () => {
    getAllBeanVarieties()
        .then(beanVarieties => {
            displayBeanVarieties(beanVarieties);
        })
        .catch(error => console.error('Error fetching bean varieties:', error));
});

// Fetch all bean varieties from the API
function getAllBeanVarieties() {
    return fetch(url)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        });
}

// Display bean varieties in the DOM
function displayBeanVarieties(beanVarieties) {
    beanVarietiesDiv.innerHTML = ""; // Clear existing content
    beanVarieties.forEach(variety => {
        const varietyDiv = document.createElement("div");
        varietyDiv.innerHTML = `
            <strong>Name:</strong> ${variety.name}<br>
            <strong>Region:</strong> ${variety.region}<br>
            <strong>Notes:</strong> ${variety.notes || "N/A"}<br>
            <hr>
        `;
        beanVarietiesDiv.appendChild(varietyDiv);
    });
}

// Event listener for the form to add a new bean variety
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newVariety = {
        name: document.querySelector("#name").value,
        region: document.querySelector("#region").value,
        notes: document.querySelector("#notes").value || null
    };

    addNewBeanVariety(newVariety)
        .then(() => {
            form.reset(); // Clear the form fields
            getAllBeanVarieties() // Refresh the displayed list
                .then(beanVarieties => displayBeanVarieties(beanVarieties))
                .catch(error => console.error('Error fetching updated bean varieties:', error));
        })
        .catch(error => console.error('Error adding new bean variety:', error));
});

// Add a new bean variety to the database
function addNewBeanVariety(variety) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(variety)
    }).then(resp => {
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        return resp.json();
    });
}
