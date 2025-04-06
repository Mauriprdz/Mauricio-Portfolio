// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Manejar el envío del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nombre = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const mensaje = this.querySelector('textarea').value;

            if (nombre && email && mensaje) {
                alert('Gracias por tu mensaje, ' + nombre + '. Te contactaremos pronto.');
                this.reset();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }
    
    // Cargar datos del portafolio desde localStorage si están disponibles
    loadPortfolioData();
});

// Función para cargar datos del portafolio desde localStorage
function loadPortfolioData() {
    if (localStorage.getItem('portfolioData')) {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
        
        // Actualizar información general
        if (portfolioData.general) {
            const heroSection = document.querySelector('#inicio .hero');
            if (heroSection) {
                const nameElement = heroSection.querySelector('h1');
                const titleElement = heroSection.querySelector('p');
                const socialLinks = heroSection.querySelectorAll('.social-links a');
                
                if (nameElement) nameElement.textContent = portfolioData.general.name || 'Mauricio Prieto';
                if (titleElement) titleElement.textContent = portfolioData.general.title || 'Estudiante y desarollador Frontend';
                
                if (socialLinks.length >= 3) {
                    socialLinks[0].href = portfolioData.general.github || '#';
                    socialLinks[1].href = portfolioData.general.linkedin || '#';
                    socialLinks[2].href = 'mailto:' + (portfolioData.general.email || '#');
                }
            }
        }
        
        // Actualizar sección "Sobre Mí"
        if (portfolioData.about) {
            const aboutSection = document.querySelector('#sobre-mi');
            if (aboutSection) {
                const aboutText = aboutSection.querySelector('p:not(.profile-pic)');
                if (aboutText) {
                    aboutText.textContent = portfolioData.about.description || 'Soy un desarrollador web apasionado por crear soluciones digitales innovadoras...';
                }
            }
        }
        
        // Actualizar sección "Educación"
        if (portfolioData.education && portfolioData.education.length > 0) {
            const educationGrid = document.querySelector('.education-grid');
            if (educationGrid) {
                educationGrid.innerHTML = '';
                
                portfolioData.education.forEach(item => {
                    const educationItem = document.createElement('div');
                    educationItem.className = 'education-item';
                    educationItem.innerHTML = `
                        <h3>${item.institution}</h3>
                        <p class="carrer">${item.career}</p>
                        <p class="year">${item.years}</p>
                    `;
                    educationGrid.appendChild(educationItem);
                });
            }
        }
        
        // Actualizar sección "Habilidades"
        if (portfolioData.skills && portfolioData.skills.length > 0) {
            const skillsGrid = document.querySelector('.skills-grid');
            if (skillsGrid) {
                skillsGrid.innerHTML = '';
                
                portfolioData.skills.forEach(category => {
                    const skillCategory = document.createElement('div');
                    skillCategory.className = 'skill-category';
                    
                    let skillsHtml = `<h3>${category.category}</h3><ul>`;
                    
                    category.skills.forEach(skill => {
                        skillsHtml += `<li><i class="${skill.icon}"></i> ${skill.name}</li>`;
                    });
                    
                    skillsHtml += '</ul>';
                    skillCategory.innerHTML = skillsHtml;
                    skillsGrid.appendChild(skillCategory);
                });
            }
        }
        
        // Actualizar sección "Proyectos"
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid) {
                // Mantener los proyectos existentes por ahora, ya que las imágenes requieren manejo especial
                // En una implementación completa, esto reemplazaría los proyectos existentes
                console.log('Proyectos actualizados desde localStorage');
            }
        }
    }
}

// Función de login (mantenida para compatibilidad)
function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    // Obtener credenciales del localStorage si están disponibles
    let adminUsername = 'admin';
    let adminPassword = '1234';
    
    if (localStorage.getItem('portfolioData')) {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
        if (portfolioData.credentials) {
            adminUsername = portfolioData.credentials.username;
            adminPassword = portfolioData.credentials.password;
        }
    }
    
    if (user === adminUsername && pass === adminPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('portfolio-container').style.display = 'block';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
}