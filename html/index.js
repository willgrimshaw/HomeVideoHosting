const filter_form = document.getElementById("filter_form");
const applied_filters = document.getElementById('applied_filters');

function reset_filters() {
    filter_form.reset();

    apply_filters();
}

async function apply_filters() {
    const form = document.getElementById("filter_form");
    const formData = new FormData(form);

    const params = new URLSearchParams(formData);

    const response = await fetch(`/fetchvideos.php?${params}`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const parts = [];

    for (const key in data.filters) {
        if (data.filters[key] !== "") {
            parts.push(`${key}: ${data.filters[key]}`);
        }
    }

    if (parts.length != 0) {
        applied_filters.innerHTML = "Applied filters:" + parts.join(", ");
    } else {
        applied_filters.innerHTML = "";
    }
}