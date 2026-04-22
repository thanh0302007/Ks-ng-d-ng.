/* ============================================
   App Initialization
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHeader();
    initNavigation();
    initMobileMenu();
    initPlatformToggles();
    initFileChecks();
    initGuideCards();
    initGuideTabs();
    initFAQ();
    initScrollAnimations();
    initEarth();
    initMoon();
    initClock();
});

/* ============================================
   Digital Clock
   ============================================ */
function initClock() {
    const clockElement = document.getElementById('digital-clock');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = now.getFullYear();

        clockElement.textContent = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    }

    updateClock(); // Initial call
    setInterval(updateClock, 1000); // Update every second
}

/* ============================================
   Floating Particles
   ============================================ */
/* ============================================
   Anti-Gravity Canvas Particles
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            // Sophisticated color palette
            const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#c084fc', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges with slight dampening
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#6366f1';
                    // Linear alpha drop-off for connections
                    ctx.globalAlpha = (1 - distance / connectionDistance) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    // Click handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll(`.nav-link[data-section="${section}"]`).forEach(l => l.classList.add('active'));
            }
            // Close mobile menu
            closeMobileMenu();
        });
    });

    // Scroll spy
    let spyTicking = false;
    window.addEventListener('scroll', () => {
        if (!spyTicking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                spyTicking = false;
            });
            spyTicking = true;
        }
    });

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;
        let currentSection = '';

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
            });
        }
    }
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('open');
        btn.innerHTML = nav.classList.contains('open')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

function closeMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('mobileMenuBtn');
    if (nav) nav.classList.remove('open');
    if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
}

/* ============================================
   Platform Toggles (File Checker)
   ============================================ */
function initPlatformToggles() {
    const toggles = document.querySelectorAll('.platform-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const platform = this.dataset.platform;
            const card = document.getElementById(`card-${platform}`);

            if (this.checked) {
                card.classList.add('active');
            } else {
                card.classList.remove('active', 'complete', 'incomplete');
                // Uncheck all files
                card.querySelectorAll('.file-check').forEach(fc => {
                    fc.checked = false;
                });
            }

            updateOverallStatus();
        });
    });
}

/* ============================================
   File Checks
   ============================================ */
function initFileChecks() {
    const fileChecks = document.querySelectorAll('.file-check');

    fileChecks.forEach(check => {
        check.addEventListener('change', function () {
            const card = this.closest('.platform-card');
            const platform = card.dataset.platform;
            updatePlatformStatus(platform);
            updateOverallStatus();

            // Micro animation on check
            if (this.checked) {
                const item = this.closest('.file-item');
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 200);
            }
        });
    });
}

/* ============================================
   Platform Status Update
   ============================================ */
function updatePlatformStatus(platform) {
    const card = document.getElementById(`card-${platform}`);
    if (!card || !card.classList.contains('active')) return;

    const totalFiles = card.querySelectorAll('.file-check').length;
    const checkedFiles = card.querySelectorAll('.file-check:checked').length;
    const statusEl = document.getElementById(`status-${platform}`);

    if (!statusEl) return;

    card.classList.remove('complete', 'incomplete');

    if (checkedFiles === totalFiles) {
        card.classList.add('complete');
        statusEl.className = 'platform-status success';
        statusEl.innerHTML = `
            <i class="fas fa-circle-check"></i>
            <span>✅ Đã đủ ${totalFiles}/${totalFiles} file — Sẵn sàng gửi!</span>
        `;
        // Celebration micro-animation
        createConfetti(card);
    } else if (checkedFiles > 0) {
        card.classList.add('incomplete');
        statusEl.className = 'platform-status warning';
        statusEl.innerHTML = `
            <i class="fas fa-triangle-exclamation"></i>
            <span>⚠️ Mới có ${checkedFiles}/${totalFiles} file — còn thiếu ${totalFiles - checkedFiles} file</span>
        `;
    } else {
        statusEl.className = 'platform-status';
        statusEl.innerHTML = `
            <i class="fas fa-circle-info"></i>
            <span>Cần đủ ${totalFiles} file</span>
        `;
    }
}

/* ============================================
   Overall Status Update
   ============================================ */
function updateOverallStatus() {
    const overallEl = document.getElementById('overallStatus');
    if (!overallEl) return;

    const activePlatforms = document.querySelectorAll('.platform-card.active');

    if (activePlatforms.length === 0) {
        overallEl.className = 'overall-status';
        overallEl.innerHTML = `
            <div class="overall-status-inner">
                <div class="overall-icon">
                    <i class="fas fa-circle-question"></i>
                </div>
                <div class="overall-text">
                    <h3>Chọn ít nhất 1 app để bắt đầu kiểm tra</h3>
                    <p>Bật toggle của app bạn sử dụng, sau đó tick vào các file bạn đã có</p>
                </div>
            </div>
        `;
        return;
    }

    let totalFiles = 0;
    let checkedFiles = 0;
    let completePlatforms = 0;
    const missingPlatforms = [];

    activePlatforms.forEach(card => {
        const platformName = card.querySelector('.platform-info h3').textContent;
        const total = card.querySelectorAll('.file-check').length;
        const checked = card.querySelectorAll('.file-check:checked').length;
        totalFiles += total;
        checkedFiles += checked;

        if (checked === total) {
            completePlatforms++;
        } else {
            const missing = total - checked;
            missingPlatforms.push(`${platformName} (thiếu ${missing})`);
        }
    });

    const allComplete = completePlatforms === activePlatforms.length;

    if (allComplete) {
        overallEl.className = 'overall-status all-good';
        overallEl.innerHTML = `
            <div class="overall-status-inner">
                <div class="overall-icon">
                    <i class="fas fa-circle-check"></i>
                </div>
                <div class="overall-text">
                    <h3>🎉 Tuyệt vời! Đã đủ tất cả ${totalFiles} file từ ${activePlatforms.length} app</h3>
                    <p>Bạn có thể gửi file cho trưởng nhóm qua Zalo ngay bây giờ! 
                    <a href="http://zalo.me/84764551902" target="_blank" style="color: var(--success-light); font-weight: 600;">
                        <i class="fas fa-paper-plane"></i> Gửi file ngay
                    </a></p>
                </div>
            </div>
        `;
    } else {
        overallEl.className = 'overall-status has-issues';
        const missingText = missingPlatforms.join(', ');
        overallEl.innerHTML = `
            <div class="overall-status-inner">
                <div class="overall-icon">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>
                <div class="overall-text">
                    <h3>📋 Đã có ${checkedFiles}/${totalFiles} file (${completePlatforms}/${activePlatforms.length} app hoàn thành)</h3>
                    <p>Còn thiếu file ở: ${missingText}</p>
                </div>
            </div>
        `;
    }
}

/* ============================================
   Confetti Effect 
   ============================================ */
function createConfetti(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ['#10b981', '#34d399', '#6366f1', '#fbbf24', '#f87171', '#818cf8', '#a78bfa'];

    for (let i = 0; i < 12; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: ${centerY}px;
            left: ${centerX}px;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        document.body.appendChild(confetti);

        requestAnimationFrame(() => {
            const angle = (Math.PI * 2 / 12) * i;
            const distance = Math.random() * 80 + 40;
            confetti.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
        });

        setTimeout(() => confetti.remove(), 900);
    }
}

/* ============================================
   Guide Cards (Accordion)
   ============================================ */
function initGuideCards() {
    const headers = document.querySelectorAll('.guide-card-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.guide-card');
            const isExpanded = card.classList.contains('expanded');

            // Close all other cards
            document.querySelectorAll('.guide-card.expanded').forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });

            // Toggle current
            card.classList.toggle('expanded', !isExpanded);
        });
    });
}

/* ============================================
   Guide Filter Tabs
   ============================================ */
function initGuideTabs() {
    const tabs = document.querySelectorAll('.guide-tab');
    const cards = document.querySelectorAll('.guide-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            cards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe platform cards
    document.querySelectorAll('.platform-card, .guide-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.08}s`;
        observer.observe(el);
    });

    // Observe step cards
    document.querySelectorAll('.step-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.12}s`;
        observer.observe(el);
    });

    // Observe section elements
    document.querySelectorAll('.security-card, .faq-item, .trust-badge-item, .referral-box').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Observe sections
    document.querySelectorAll('.section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

/* ============================================
   FAQ Accordion
   ============================================ */
function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close other items
            document.querySelectorAll('.faq-item.active').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
        });
    });
}

/* ============================================
   3D Rotating Earth (Three.js)
   ============================================ */
function initEarth() {
    const container = document.getElementById('earth-canvas');
    const wrapper = document.getElementById('earth-container');
    if (!container || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.4; // Zoom out slightly to see the glow better

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Earth geometry and textures
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    
    // Using textures from Three.js official examples (extremely reliable)
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', 
        () => console.log('Earth texture loaded'),
        undefined,
        (err) => console.error('Earth texture failed', err)
    );
    const cloudTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');

    // Main Earth Sphere
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Use MeshStandardMaterial - very robust
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.5,
        metalness: 0
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.6
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);

    // Simple Light Blue Glow (instead of complex shader)
    const glowGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4477ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // Stronger Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Bright base light
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0x44aaff, 1.5);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    // Interaction vars
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const startDrag = (x, y) => {
        isDragging = true;
        previousMouseX = x;
        previousMouseY = y;
    };

    const moveDrag = (x, y) => {
        if (!isDragging) return;
        const deltaX = x - previousMouseX;
        const deltaY = y - previousMouseY;
        earthGroup.rotation.y += deltaX * 0.005;
        earthGroup.rotation.x += deltaY * 0.005;
        previousMouseX = x;
        previousMouseY = y;
    };

    wrapper.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => isDragging = false);

    wrapper.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener('touchend', () => isDragging = false);

    // Resize handling
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Blend better with background: Enhanced Atmosphere Shader
    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                // Fresnel-like intensity for soft blending
                float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (!isDragging) {
            earthGroup.rotation.y += 0.0015;
            clouds.rotation.y += 0.0004;
        }
        renderer.render(scene, camera);
    }
    animate();
}

/* ============================================
   3D Rotating Moon (Three.js)
   ============================================ */
function initMoon() {
    const container = document.getElementById('moon-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    
    // Moon textures - matching the user's reference look
    const moonTexture = textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg');
    
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.8,
        metalness: 0
    });

    const moonMesh = new THREE.Mesh(geometry, material);
    scene.add(moonMesh);

    // Subtle moon atmosphere/glow for natural blending
    const glowGeometry = new THREE.SphereGeometry(1.08, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.4 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                gl_FragColor = vec4(0.8, 0.8, 0.9, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    scene.add(new THREE.Mesh(glowGeometry, glowMaterial));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    function animate() {
        requestAnimationFrame(animate);
        moonMesh.rotation.y += 0.0008;
        renderer.render(scene, camera);
    }
    animate();
}
