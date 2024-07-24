// Make sure to include the js-yaml library in your HTML file:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>

// Function to fetch YAML data from a file
async function fetchYamlData(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();
        return jsyaml.load(yamlText);
    } catch (error) {
        console.error(`Could not fetch data from ${filename}:`, error);
        return null;
    }
}

// Function to create and append experience items
async function populateExperiences() {
    const experienceSection = document.getElementById('experience');
    const experiences = await fetchYamlData('data/experiences.yaml');
    
    if (!experiences) return;

    experiences.forEach(exp => {
        const expDiv = document.createElement('div');
        expDiv.className = 'experience';
        expDiv.innerHTML = `
            <h3>${exp.title}</h3>
            <h4>${exp.company} - ${exp.location}</h4>
            <p><em>${exp.period}</em></p>
            <ul>
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        `;
        experienceSection.appendChild(expDiv);
    });
}

// Function to create and append project items
async function populateProjects() {
    const projectsSection = document.getElementById('projects');
    const projects = await fetchYamlData('data/projects.yaml');
    
    if (!projects) return;

    projects.forEach(proj => {
        const projDiv = document.createElement('div');
        projDiv.className = 'project';
        projDiv.innerHTML = `
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            ${proj.tools ? `<p><strong>Tools Used:</strong> ${proj.tools}</p>` : ''}
            ${proj.link ? `<a href="${proj.link}" class="project-link">View Project Details</a>` : ''}
        `;
        projectsSection.appendChild(projDiv);
    });
}

// Function to populate skills
async function populateSkills() {
    const skillsDiv = document.querySelector('.skills');
    const skills = await fetchYamlData('data/skills.yaml');
    
    if (!skills) return;

    skills.forEach(skill => {
        const skillSpan = document.createElement('span');
        skillSpan.className = 'skill';
        skillSpan.textContent = skill;
        skillsDiv.appendChild(skillSpan);
    });
}

// Function to initialize all dynamic content
async function initializePortfolio() {
    await Promise.all([
        populateExperiences(),
        populateProjects(),
        populateSkills()
    ]);

    // Replace all icons with Feather icons
    feather.replace();
}

// Call the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);