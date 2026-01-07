document.addEventListener('DOMContentLoaded', () => {
    const jobListingDiv = document.getElementById('job-listing');
    const keywordInput = document.getElementById('keyword');
    const postedAfterInput = document.getElementById('posted_after');
    const applyFiltersButton = document.getElementById('applyFilters');
    const clearFiltersButton = document.getElementById('clearFilters');
    const addJobButton = document.getElementById('addJobButton');
    const jobModal = document.getElementById('jobModal');
    const closeButton = document.querySelector('.close-button');
    const jobForm = document.getElementById('jobForm');
    const jobIdInput = document.getElementById('jobId');
    const jobTitleInput = document.getElementById('jobTitle');
    const companyUrlInput = document.getElementById('companyUrl');
    const jobUrlInput = document.getElementById('jobUrl');
    const jobPostingDateInput = document.getElementById('jobPostingDate');

    const API_BASE_URL = 'http://127.0.0.1:5000/api/jobs'; // Assuming Flask runs on 5000

    async function fetchJobs() {
        let url = API_BASE_URL;
        const params = new URLSearchParams();

        if (keywordInput.value) {
            params.append('keyword', keywordInput.value);
        }
        if (postedAfterInput.value) {
            params.append('posted_after', postedAfterInput.value);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            jobListingDiv.innerHTML = '<p class="error-message">Failed to load jobs. Please try again later.</p>';
        }
    }

    function displayJobs(jobs) {
        jobListingDiv.innerHTML = '';
        if (jobs.length === 0) {
            jobListingDiv.innerHTML = '<p class="no-jobs-message">No jobs found matching your criteria.</p>';
            return;
        }

        jobs.forEach(job => {
            const jobItem = document.createElement('div');
            jobItem.classList.add('job-item');
            jobItem.innerHTML = `
                <h3>${job['Job Title']}</h3>
                <p><strong>Company:</strong> <a href="${job['Company URL']}" target="_blank">${job['Company URL'] || 'N/A'}</a></p>
                <p><strong>URL:</strong> <a href="${job['Job URL']}" target="_blank">${job['Job URL']}</a></p>
                <p><strong>Posted:</strong> ${new Date(job['Job Posting Date']).toLocaleDateString()} ${new Date(job['Job Posting Date']).toLocaleTimeString()}</p>
                <div class="job-actions">
                    <button class="btn edit-button" data-id="${job.id}">Edit</button>
                    <button class="btn delete-button" data-id="${job.id}">Delete</button>
                </div>
            `;
            jobListingDiv.appendChild(jobItem);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => deleteJob(e.target.dataset.id));
        });
    }

    function openAddModal() {
        jobIdInput.value = '';
        jobTitleInput.value = '';
        companyUrlInput.value = '';
        jobUrlInput.value = '';
        jobPostingDateInput.value = '';
        jobModal.style.display = 'block';
        document.querySelector('#jobModal h2').textContent = 'Add New Job';
    }

    async function openEditModal(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const job = await response.json();
            jobIdInput.value = job.id;
            jobTitleInput.value = job['Job Title'];
            companyUrlInput.value = job['Company URL'];
            jobUrlInput.value = job['Job URL'];
            const date = new Date(job['Job Posting Date']);
            jobPostingDateInput.value = date.toISOString().slice(0, 16);
            jobModal.style.display = 'block';
            document.querySelector('#jobModal h2').textContent = 'Edit Job';
        } catch (error) {
            console.error('Error fetching job for edit:', error);
            alert('Error fetching job details for edit.');
        }
    }

    async function saveJob(event) {
        event.preventDefault();

        const id = jobIdInput.value;
        const jobData = {
            'Job Title': jobTitleInput.value,
            'Company URL': companyUrlInput.value,
            'Job URL': jobUrlInput.value,
            // Ensure date is in the correct format for the backend if provided
            'Job Posting Date': jobPostingDateInput.value ? new Date(jobPostingDateInput.value).toISOString().slice(0, 19).replace('T', ' ') : undefined
        };

        try {
            let response;
            if (id) { // Update existing job
                response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jobData),
                });
            } else { // Add new job
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jobData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            jobModal.style.display = 'none';
            fetchJobs(); // Refresh the list
        } catch (error) {
            console.error('Error saving job:', error);
            alert(`Error saving job: ${error.message}`);
        }
    }

    async function deleteJob(id) {
        if (confirm('Are you sure you want to delete this job?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                fetchJobs(); // Refresh the list
            } catch (error) {
                console.error('Error deleting job:', error);
                alert(`Error deleting job: ${error.message}`);
            }
        }
    }

    // Event Listeners
    applyFiltersButton.addEventListener('click', fetchJobs);
    clearFiltersButton.addEventListener('click', () => {
        keywordInput.value = '';
        postedAfterInput.value = '';
        fetchJobs();
    });
    addJobButton.addEventListener('click', openAddModal);
    closeButton.addEventListener('click', () => jobModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == jobModal) {
            jobModal.style.display = 'none';
        }
    });
    jobForm.addEventListener('submit', saveJob);

    // Initial fetch
    fetchJobs();
});
