let resourcesData = {};

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        resourcesData = data;
        populateCountyDropdown();
    })
    .catch(error => {
        console.error("Error loading resource data:", error);
    });


function populateCountyDropdown() {
    const countySelect = document.getElementById("county");

    const counties = Object.keys(resourcesData).sort();

    counties.forEach(county => {
        const option = document.createElement("option");

        option.value = county;
        option.textContent = county;

        countySelect.appendChild(option);
    });
}


function findResources() {
    const county = document.getElementById("county").value;
    const results = document.getElementById("results");

    if (!county) {
        results.innerHTML = `
            <div class="no-results">
                Please select a county.
            </div>
        `;
        return;
    }

    const location = resourcesData[county];

    if (!location || !location.resources || location.resources.length === 0) {
        results.innerHTML = `
            <div class="no-results">
                <h3>No mobile crisis providers found</h3>
                <p>
                    We don't currently have provider information for ${county}.
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="location">
            <h2>${county}, ${location.state}</h2>
            <p>
                Mobile crisis services available in this county:
            </p>
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
                    <strong>Phone:</strong>
                    <a href="tel:${resource.phone}">
                        ${resource.phone}
                    </a>
                </p>
        `;

        if (resource.website) {
            html += `
                <a
                    href="${resource.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit provider website →
                </a>
            `;
        }

        html += `
            </div>
        `;
    });

    results.innerHTML = html;
}
