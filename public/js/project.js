const username = 'teche74';
const projectsPerPage = 3;
let page = 1;
let allProjects = [];
const projectCache = new Map();  // For caching GitHub API project info

// Utility
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch projects from your backend
async function fetchProjects() {
    try {
        const response = await fetch(`/api/projects?username=${username}&page=${page}&projectsPerPage=${projectsPerPage}`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Network error while fetching projects.');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

// Create a single project card
function createProjectElement(project) {
    const index = getRandomInt(1, 5);
    const card = document.createElement('div');
    card.classList.add('project-card', 'light-button', `color-${index}`);

    card.innerHTML = `
        <button class="bt color-${index}" data-project-id="${project.id}">
            <div class="light-holder color-${index}">
                <div class="dot color-${index}"></div>
                <div class="light color-${index}"></div>
            </div>
            <div class="button-holder color-${index}">
                <img loading="lazy" src="../images/github.svg" alt="GitHub" width="80px" height="80px" />
                <p>${project.name}</p>
            </div>
        </button>
    `;

    return card;
}

// Append projects (don't clear container unless needed)
function appendProjects(projects) {
    const container = document.getElementById('projects-container');
    const fragment = document.createDocumentFragment();
    projects.forEach(p => fragment.appendChild(createProjectElement(p)));
    container.appendChild(fragment);
}

// Load and display projects
async function displayProjects() {
    const newProjects = await fetchProjects();
    if (newProjects.length === 0) return;

    allProjects = [...allProjects, ...newProjects];
    appendProjects(newProjects);

    // Hide load more if fewer than expected
    document.getElementById('load-more').style.display =
        newProjects.length < projectsPerPage ? 'none' : 'block';
}

// Initialize first page
async function initialize() {
    page = 1;
    allProjects = [];  // reset
    document.getElementById('projects-container').innerHTML = '';
    await displayProjects();
}

// Handle project card click
document.getElementById('projects-container').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-project-id]');
    if (!btn) return;

    const projectId = btn.getAttribute('data-project-id');
    if (projectCache.has(projectId)) {
        return displayProjectInfo(projectCache.get(projectId));
    }

    try {
        const response = await fetch(`https://api.github.com/repositories/${projectId}`);
        if (!response.ok) throw new Error("GitHub API failed");
        const project = await response.json();
        projectCache.set(projectId, project);
        displayProjectInfo(project);
    } catch (err) {
        console.error("Error fetching GitHub project info:", err);
    }
});

// Display project info panel
function displayProjectInfo(project) {
    const container = document.getElementById('project-info-container');
    container.innerHTML = `
        <div class="project-info">
            <h2>${project.name}</h2>
            <p><strong>Description:</strong> ${project.description || 'No description.'}</p>
            <p><strong>Language:</strong> ${project.language || 'N/A'}</p>
            <p><strong>Created:</strong> ${new Date(project.created_at).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> ${new Date(project.updated_at).toLocaleDateString()}</p>
            <p><strong>Stars:</strong> ${project.stargazers_count}</p>
            <p><strong>Forks:</strong> ${project.forks_count}</p>
            <a href="${project.html_url}" target="_blank" class="btn visit-btn">View on GitHub</a>
        </div>
    `;

    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        maxWidth: '100%',
        fontFamily: '"Rubik Pixels", system-ui'
    });
}

// Load more button
document.getElementById('load-more').addEventListener('click', () => {
    page++;
    displayProjects();
});

// Search functionality
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function filterProjects(term) {
    const filtered = allProjects.filter(p =>
        p.name.toLowerCase().includes(term.toLowerCase())
    );
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    appendProjects(filtered);
}

document.getElementById('search-bar').addEventListener('input', debounce((e) => {
    filterProjects(e.target.value);
}, 300));

// Start
initialize();
