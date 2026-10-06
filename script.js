let resourceData = [];

// Load the CSV when the page opens
fetch("resources.csv")
    .then(response => response.text())
    .then(csvText => {

        resourceData = parseCSV(csvText);

        populateCountyDropdown();

    })
    .catch(error => {
        console.error("Error loading CSV:", error);

        document.getElementById("results").innerHTML =
            "<p>Sorry, the resource database could not be loaded.</p>";
    });


// Parse CSV while respecting quoted commas and line breaks
function parseCSV(text) {

    const rows = [];
    let row = [];
    let field = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        if (char === '"') {

            if (insideQuotes && text[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }

        } else if (char === "," && !insideQuotes) {

            row.push(field);
            field = "";

        } else if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (char === "\r" && text[i + 1] === "\n") {
                i++;
            }

            row.push(field);

            if (row.some(value => value.trim() !== "")) {
                rows.push(row);
            }

            row = [];
            field = "";

        } else {

            field += char;
        }
    }

    if (field || row.length) {
        row.push(field);
        rows.push(row);
    }

    const headers = rows[0].map(header => header.trim());

    return rows.slice(1).map(row => {

        const item = {};

        headers.forEach((header, index) => {
            item[header] = (row[index] || "").trim();
        });

        return item;
    });
}


// Create the county dropdown automatically from the CSV
function populateCountyDropdown() {

    const select = document.getElementById("countySelect");

    const counties = [
        ...new Set(
            resourceData
                .map(item => item.County)
                .filter(Boolean)
        )
    ].sort();

    counties.forEach(county => {

        const option = document.createElement("option");

        option.value = county;
        option.textContent = county + " County";

        select.appendChild(option);

    });
}


// When the visitor chooses a county
document
    .getElementById("countySelect")
    .addEventListener("change", function () {

        displayResources(this.value);

    });


// Display every matching organization
function displayResources(county) {

    const results = document.getElementById("results");

    results.innerHTML = "";

    if (!county) {
        return;
    }

    const countyResources = resourceData.filter(
        item => item.County === county
    );

    const mobileCrisis = countyResources.filter(
        item => item["Service Type"] === "Mobile Crisis Team"
    );

    const alternative911 = countyResources.filter(
        item => item["Service Type"] === "Alternative 911 Response"
    );


    // County heading
    const heading = document.createElement("h2");

    heading.textContent = county + " County";

    results.appendChild(heading);


    // Alternative 911 section
    if (alternative911.length > 0) {

        results.appendChild(
            createSectionHeading("911 Behavioral Health Response")
        );

        alternative911.forEach(provider => {
            results.appendChild(createProviderCard(provider));
        });
    }


    // Mobile Crisis section
    results.appendChild(
        createSectionHeading("Mobile Crisis Teams")
    );

    if (mobileCrisis.length > 0) {

        mobileCrisis.forEach(provider => {
            results.appendChild(createProviderCard(provider));
        });

    } else {

        const message = document.createElement("p");

        message.textContent =
            "No Mobile Crisis Team information was found for this county.";

        results.appendChild(message);
    }


    // Emergency message
    const emergency = document.createElement("div");

    emergency.className = "emergency";

    emergency.innerHTML =
        "<strong>Immediate danger?</strong> Call 911.";

    results.appendChild(emergency);
}


function createSectionHeading(text) {

    const heading = document.createElement("h2");

    heading.className = "results-heading";
    heading.textContent = text;

    return heading;
}


function createProviderCard(provider) {

    const card = document.createElement("div");

    card.className = "provider-card";


    const name = document.createElement("h3");

    name.textContent = provider.Provider;

    card.appendChild(name);


    if (provider.Description) {

        const description = document.createElement("p");

        description.textContent = provider.Description;

        card.appendChild(description);
    }


    if (provider.Phone) {

        const phone = document.createElement("p");

        phone.className = "phone";

        phone.textContent = "Phone: " + provider.Phone;

        card.appendChild(phone);
    }


    if (provider.Hours) {

        const hours = document.createElement("p");

        hours.textContent = "Hours: " + provider.Hours;

        card.appendChild(hours);
    }


    if (provider["Provider Website"]) {

        const link = document.createElement("a");

        link.href = provider["Provider Website"];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Provider website";

        card.appendChild(link);
    }


    return card;
}
