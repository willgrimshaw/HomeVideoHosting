const filter_form = document.getElementById("filter_form");
const applied_filters = document.getElementById('applied_filters');

apply_filters();

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
        document.getElementById('applied_filters').innerHTML = "Applied filters: " + parts.join(", ");
    } else {
        document.getElementById('applied_filters').innerHTML = "";
    }

    // Populate videos table
    const videosContainer = document.getElementById('videos_container');
    
    if (!data.videos || data.videos.length === 0) {
        videosContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    let html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    html += '<thead><tr>';
    html += '<th style="padding: 8px;">ID</th>';
    html += '<th style="padding: 8px;">Filename</th>';
    html += '<th style="padding: 8px;">Length (seconds)</th>';
    html += '<th style="padding: 8px;">Recorded Date</th>';
    html += '<th style="padding: 8px;">Location</th>';
    html += '<th style="padding: 8px;">People</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    data.videos.forEach(video => {
        html += '<tr>';
        html += `<td style="padding: 8px;">${video.Id}</td>`;
        html += `<td style="padding: 8px;">${video.Filename}</td>`;
        html += `<td style="padding: 8px;">${video.LengthSeconds}</td>`;
        html += `<td style="padding: 8px;">${video.RecordedDate}</td>`;
        html += `<td style="padding: 8px;">${video.Location}</td>`;
        html += `<td style="padding: 8px;">${video.People || 'None'}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    videosContainer.innerHTML = html;
}