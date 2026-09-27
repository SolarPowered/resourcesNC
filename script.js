let resourcesData = {};

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        resourcesData = data;
    })
    .catch(error => {
        console.error("Error loading resource data:", error);
    });


function findResources() {

    const zipcode = document
        .getElementById("zipcode")
        .value
        .trim();

    const results = document.getElementById("results");

    if (zipcode.length !== 5 || isNaN(zipcode)) {
        results.innerHTML = `
            <div class="no-results">
                Please enter a valid 5-digit ZIP code.
            </div>
        `;
        return;
    }

    const location = resourcesData[zipcode];

    if (!location) {
        results.innerHTML = `
            <div class="no-results">
                <h3>No resources found</h3>
                <p>
                    We don't currently have information for ZIP code ${zipcode}.
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="location">
            <h2>${location.city}, ${location.state}</h2>
            <p>${location.county}</p>
        </div>
    `;

    location.resources.forEach(resource => {

        html += `
            <div class="resource-card">

                <div class="resource-type">
                    ${resource.type}
                </div>

                <h3>${resource.name}</h3>

                <p>
                    ${resource.description}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${resource.phone}
                </p>

                <a
                    href="${resource.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit website →
                </a>

            </div>
        `;
    });

    results.innerHTML = html;
}
