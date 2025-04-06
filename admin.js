// Admin credentials
let adminCredentials = {
    username: 'admin',
    password: '1234'
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Login functionality
    const loginForm = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-container');
    const errorMessage = document.getElementById('error-message');

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
    const adminSections = document.querySelectorAll('.admin-section');

    // Initialize admin panel
    initAdminPanel();

    // Add event listeners for sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            adminSections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Add event listeners for forms
    document.getElementById('general-form').addEventListener('submit', saveGeneralInfo);
    document.getElementById('about-form').addEventListener('submit', saveAboutInfo);
    document.getElementById('security-form').addEventListener('submit', updateCredentials);
    
    // Add event listeners for dynamic content
    document.getElementById('add-education').addEventListener('click', addEducationItem);
    document.getElementById('save-education').addEventListener('click', saveEducationItems);
    
    document.getElementById('add-category').addEventListener('click', addSkillCategory);
    document.getElementById('save-skills').addEventListener('click', saveSkillItems);
    
    document.getElementById('add-project').addEventListener('click', addProjectItem);
    document.getElementById('save-projects').addEventListener('click', saveProjectItems);
    
    // Add event listeners for existing delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.education-item-admin, .project-item-admin').remove();
        });
    });
    
    // Add event listeners for existing skill buttons
    document.querySelectorAll('.delete-skill').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.skill-item').remove();
        });
    });
    
    document.querySelectorAll('.add-skill').forEach(btn => {
        btn.addEventListener('click', function() {
            addSkillItem(this.getAttribute('data-category'));
        });
    });
});

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'block';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
}

// Logout function
function logout() {
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('error-message').style.display = 'none';
}

// Initialize admin panel with data from localStorage or default values
function initAdminPanel() {
    // Load saved data if available
    if (localStorage.getItem('portfolioData')) {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
        
        // Load general info
        if (portfolioData.general) {
            document.getElementById('name').value = portfolioData.general.name || 'Mauricio Prieto';
            document.getElementById('title').value = portfolioData.general.title || 'Estudiante y desarollador Frontend';
            document.getElementById('github').value = portfolioData.general.github || '#';
            document.getElementById('linkedin').value = portfolioData.general.linkedin || '#';
            document.getElementById('email').value = portfolioData.general.email || '#';
        }
        
        // Load about info
        if (portfolioData.about) {
            document.getElementById('about-text').value = portfolioData.about.description || 'Soy un desarrollador web apasionado por crear soluciones digitales innovadoras...';
            // Profile pic would need additional handling for file inputs
        }
        
        // Load admin credentials
        if (portfolioData.credentials) {
            adminCredentials = portfolioData.credentials;
            document.getElementById('current-username').value = adminCredentials.username;
        }
        
        // Education, skills, and projects would need more complex handling for dynamic content
    }
    
    // Add event listeners for dynamic elements
    setupDynamicEventListeners();
}

// Save general information
function saveGeneralInfo(e) {
    e.preventDefault();
    
    const generalData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        github: document.getElementById('github').value,
        linkedin: document.getElementById('linkedin').value,
        email: document.getElementById('email').value
    };
    
    // Save to localStorage
    saveToLocalStorage('general', generalData);
    
    // Update the portfolio page
    updatePortfolioPage();
    
    showSaveMessage('Información general guardada correctamente');
}

// Save about information
function saveAboutInfo(e) {
    e.preventDefault();
    
    const aboutData = {
        description: document.getElementById('about-text').value
        // Profile pic would need additional handling for file inputs
    };
    
    // Save to localStorage
    saveToLocalStorage('about', aboutData);
    
    // Update the portfolio page
    updatePortfolioPage();
    
    showSaveMessage('Información "Sobre Mí" guardada correctamente');
}

// Add a new education item
function addEducationItem() {
    const educationItems = document.getElementById('education-items');
    const newItem = document.createElement('div');
    newItem.className = 'education-item-admin';
    newItem.innerHTML = `
        <h3>Nueva Educación</h3>
        <form class="education-form">
            <div class="form-group">
                <label for="institution">Institución:</label>
                <input type="text" name="institution" value="">
            </div>
            <div class="form-group">
                <label for="career">Carrera:</label>
                <input type="text" name="career" value="">
            </div>
            <div class="form-group">
                <label for="years">Años:</label>
                <input type="text" name="years" value="">
            </div>
            <button type="button" class="delete-btn">Eliminar</button>
        </form>
    `;
    educationItems.appendChild(newItem);
    
    // Add event listener to the new delete button
    newItem.querySelector('.delete-btn').addEventListener('click', function() {
        this.closest('.education-item-admin').remove();
    });
}

// Save education items
function saveEducationItems() {
    const educationItems = document.querySelectorAll('.education-item-admin');
    const educationData = [];
    
    educationItems.forEach(item => {
        const form = item.querySelector('.education-form');
        educationData.push({
            institution: form.querySelector('[name="institution"]').value,
            career: form.querySelector('[name="career"]').value,
            years: form.querySelector('[name="years"]').value
        });
    });
    
    // Save to localStorage
    saveToLocalStorage('education', educationData);
    
    // Update the portfolio page
    updatePortfolioPage();
    
    showSaveMessage('Información de educación guardada correctamente');
}

// Add a new skill category
function addSkillCategory() {
    const skillsCategories = document.querySelector('.skills-categories');
    const categoryId = 'category-' + Date.now();
    const newCategory = document.createElement('div');
    newCategory.className = 'skill-category-admin';
    newCategory.innerHTML = `
        <h3 contenteditable="true">Nueva Categoría</h3>
        <div class="skills-list" id="${categoryId}-skills">
        </div>
        <button class="add-skill" data-category="${categoryId}">+ Agregar Habilidad</button>
    `;
    skillsCategories.appendChild(newCategory);
    
    // Add event listener to the new add skill button
    newCategory.querySelector('.add-skill').addEventListener('click', function() {
        addSkillItem(this.getAttribute('data-category'));
    });
}

// Add a new skill item to a category
function addSkillItem(categoryId) {
    const skillsList = document.getElementById(`${categoryId}-skills`);
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-item';
    newSkill.innerHTML = `
        <input type="text" value="">
        <select class="skill-icon">
            <option value="fab fa-html5">HTML5</option>
            <option value="fab fa-css3-alt">CSS3</option>
            <option value="fab fa-js">JavaScript</option>
            <option value="fab fa-react">React</option>
            <option value="fab fa-node-js">Node.js</option>
            <option value="fas fa-database">Database</option>
            <option value="fab fa-java">Java</option>
            <option value="fab fa-git-alt">Git</option>
            <option value="fab fa-github">GitHub</option>
            <option value="fas fa-terminal">Terminal</option>
            <option value="fas fa-code">Code</option>
        </select>
        <button class="delete-skill">X</button>
    `;
    skillsList.appendChild(newSkill);
    
    // Add event listener to the new delete button
    newSkill.querySelector('.delete-skill').addEventListener('click', function() {
        this.closest('.skill-item').remove();
    });
}

// Save skill items
function saveSkillItems() {
    const skillCategories = document.querySelectorAll('.skill-category-admin');
    const skillsData = [];
    
    skillCategories.forEach(category => {
        const categoryName = category.querySelector('h3').textContent;
        const skillItems = category.querySelectorAll('.skill-item');
        const skills = [];
        
        skillItems.forEach(item => {
            skills.push({
                name: item.querySelector('input').value,
                icon: item.querySelector('select').value
            });
        });
        
        skillsData.push({
            category: categoryName,
            skills: skills
        });
    });
    
    // Save to localStorage
    saveToLocalStorage('skills', skillsData);
    
    // Update the portfolio page
    updatePortfolioPage();
    
    showSaveMessage('Información de habilidades guardada correctamente');
}

// Add a new project item
function addProjectItem() {
    const projectsItems = document.getElementById('projects-items');
    const newItem = document.createElement('div');
    newItem.className = 'project-item-admin';
    newItem.innerHTML = `
        <h3>Nuevo Proyecto</h3>
        <form class="project-form">
            <div class="form-group">
                <label for="project-title">Título:</label>
                <input type="text" name="project-title" value="">
            </div>
            <div class="form-group">
                <label for="project-image">Imagen:</label>
                <input type="file" name="project-image">
            </div>
            <div class="form-group">
                <label for="project-description">Descripción:</label>
                <textarea name="project-description" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="project-demo">URL Demo:</label>
                <input type="url" name="project-demo" value="#">
            </div>
            <div class="form-group">
                <label for="project-github">URL GitHub/Figma:</label>
                <input type="url" name="project-github" value="#">
            </div>
            <button type="button" class="delete-btn">Eliminar</button>
        </form>
    `;
    projectsItems.appendChild(newItem);
    
    // Add event listener to the new delete button
    newItem.querySelector('.delete-btn').addEventListener('click', function() {
        this.closest('.project-item-admin').remove();
    });
}

// Save project items
function saveProjectItems() {
    const projectItems = document.querySelectorAll('.project-item-admin');
    const projectsData = [];
    
    projectItems.forEach(item => {
        const form = item.querySelector('.project-form');
        projectsData.push({
            title: form.querySelector('[name="project-title"]').value,
            description: form.querySelector('[name="project-description"]').value,
            demo: form.querySelector('[name="project-demo"]').value,
            github: form.querySelector('[name="project-github"]').value
            // Image would need additional handling for file inputs
        });
    });
    
    // Save to localStorage
    saveToLocalStorage('projects', projectsData);
    
    // Update the portfolio page
    updatePortfolioPage();
    
    showSaveMessage('Información de proyectos guardada correctamente');
}

// Update credentials
function updateCredentials(e) {
    e.preventDefault();
    
    const currentUsername = document.getElementById('current-username').value;
    const newUsername = document.getElementById('new-username').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate current credentials
    if (currentPassword !== adminCredentials.password) {
        showSaveMessage('La contraseña actual es incorrecta', true);
        return;
    }
    
    // Validate new credentials
    if (newPassword && newPassword !== confirmPassword) {
        showSaveMessage('Las nuevas contraseñas no coinciden', true);
        return;
    }
    
    // Update credentials
    if (newUsername) {
        adminCredentials.username = newUsername;
    }
    
    if (newPassword) {
        adminCredentials.password = newPassword;
    }
    
    // Save to localStorage
    saveToLocalStorage('credentials', adminCredentials);
    
    // Update form
    document.getElementById('current-username').value = adminCredentials.username;
    document.getElementById('new-username').value = '';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    showSaveMessage('Credenciales actualizadas correctamente');
}

// Save data to localStorage
function saveToLocalStorage(key, data) {
    let portfolioData = {};
    
    // Get existing data if available
    if (localStorage.getItem('portfolioData')) {
        portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
    }
    
    // Update data
    portfolioData[key] = data;
    
    // Save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// Update the portfolio page with new data
function updatePortfolioPage() {
    // This function would update the actual portfolio page
    // For now, we'll just save the data to localStorage
    // In a real application, this might involve AJAX calls to update the server
    console.log('Portfolio page updated with new data');
}

// Show save message
function showSaveMessage(message, isError = false) {
    // Check if message container exists
    let messageContainer = document.getElementById('save-message');
    
    // Create if it doesn't exist
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'save-message';
        messageContainer.style.position = 'fixed';
        messageContainer.style.bottom = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.padding = '15px 20px';
        messageContainer.style.borderRadius = '4px';
        messageContainer.style.zIndex = '1000';
        document.body.appendChild(messageContainer);
    }
    
    // Set message style based on type
    if (isError) {
        messageContainer.style.backgroundColor = '#dc3545';
    } else {
        messageContainer.style.backgroundColor = '#28a745';
    }
    messageContainer.style.color = 'white';
    
    // Set message content
    messageContainer.textContent = message;
    
    // Show message
    messageContainer.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}

// Setup event listeners for dynamic elements
function setupDynamicEventListeners() {
    // This function would be called after loading data to ensure all dynamic elements have event listeners
    console.log('Dynamic event listeners set up');
}
