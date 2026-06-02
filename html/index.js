const app = {
    videosData: [],
    currentFilters: {},
    sortBy: {field: 'Id', ascending: true},
    
    init() {
        this.applyFilters();
    },
    
    resetFilters() {
        document.getElementById("filter_form").reset();
        this.applyFilters();
    },
    
    async applyFilters() {
        const form = document.getElementById("filter_form");
        const formData = new FormData(form);
        const params = new URLSearchParams(formData);
        
        try {
            const response = await fetch(`/fetchvideos.php?${params}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            this.currentFilters = data.filters || {};
            this.videosData = data.videos || [];
            
            this.updateFilterDisplay();
            this.renderTable();
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    },
    
    updateFilterDisplay() {
        const parts = [];
        for (const key in this.currentFilters) {
            if (this.currentFilters[key] !== "") {
                parts.push(`${key}: ${this.currentFilters[key]}`);
            }
        }
        
        const appliedFilters = document.getElementById('applied_filters');
        if (parts.length > 0) {
            appliedFilters.innerHTML = "Applied filters: " + parts.join(", ");
        } else {
            appliedFilters.innerHTML = "";
        }
    },
    
    renderTable(sortField = null) {
        const tbody = document.querySelector('#videos_table tbody');
        
        if (!this.videosData || this.videosData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 8px; text-align: center;">No videos found.</td></tr>';
            return;
        }

        // Update sortBy if a new field is provided
        if (sortField) { 
            if (this.sortBy.field === sortField) {
                this.sortBy.ascending = !this.sortBy.ascending; // Toggle sort order if same field is clicked
            } else {
                this.sortBy.field = sortField; 
                this.sortBy.ascending = true; // Default to ascending when changing field
            }
        }

        this.videosData.sort((a, b) => {
            let aVal = a[this.sortBy.field];
            let bVal = b[this.sortBy.field];

            // Flip values for descending order
            if (!this.sortBy.ascending) {
                [aVal, bVal] = [bVal, aVal];
            }

            // Handle numeric values
            if (!isNaN(aVal) && !isNaN(bVal)) {
                return aVal - bVal;
            }

            // Handle string values
            if (typeof aVal === 'string') {
                return aVal.localeCompare(bVal);
            }

            // Handle date values            
            if (Date.parse(aVal) && Date.parse(bVal)) {
                return new Date(aVal) - new Date(bVal);
            }

            return 0;
        });

        let html = '';
        this.videosData.forEach(video => {
            html += '<tr onclick="window.open(\'/player.html?file=' + video.Filename + '\', \'_blank\')" style="cursor: pointer;">';
            html += `<td style="padding: 8px;">${video.Id}</td>`;
            html += `<td style="padding: 8px;">${video.Filename}</td>`;
            html += `<td style="padding: 8px;">${video.LengthSeconds}</td>`;
            html += `<td style="padding: 8px;">${video.RecordedDate}</td>`;
            html += `<td style="padding: 8px;">${video.Location}</td>`;
            html += `<td style="padding: 8px;">${video.People || 'None'}</td>`;
            html += '</tr>';
        });
        
        tbody.innerHTML = html;
    },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => app.init());