/**
 * SATAKI - Легенда Portal Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. SAKURA PETALS FALLING ANIMATION (HTML5 Canvas Engine)
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const petalCount = 45;
    const petals = [];

    class Petal {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.r = Math.random() * 6 + 4; // size radius
            this.d = Math.random() * petalCount; // density
            this.horizontalSpeed = Math.random() * 2 - 0.5; // drift
            this.verticalSpeed = Math.random() * 1.5 + 1.2; // fall speed
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            // Palette of cherry blossoms: soft pinks to deeper neon reds
            const colors = [
                'rgba(255, 51, 80, 0.85)',
                'rgba(255, 26, 43, 0.8)',
                'rgba(255, 100, 120, 0.85)',
                'rgba(240, 10, 45, 0.75)'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            
            // Draw a beautiful organic petal shape
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.ellipse(0, 0, this.r, this.r * 1.6, 0, 0, 2 * Math.PI);
            ctx.fill();

            // Highlight line in the middle of the petal
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.moveTo(0, -this.r * 1.6);
            ctx.lineTo(0, this.r * 1.6);
            ctx.stroke();

            ctx.restore();
        }

        update() {
            this.y += this.verticalSpeed;
            this.x += this.horizontalSpeed + Math.sin(this.y / 30) * 0.5;
            this.rotation += this.rotationSpeed;

            // Reset when going off-screen
            if (this.y > height + 20) {
                this.y = -20;
                this.x = Math.random() * width;
                this.verticalSpeed = Math.random() * 1.5 + 1.2;
                this.horizontalSpeed = Math.random() * 2 - 0.5;
            }
            if (this.x > width + 20) {
                this.x = -20;
            } else if (this.x < -20) {
                this.x = width + 20;
            }
        }
    }

    // Initialize petals
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animateSakura() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animateSakura);
    }
    animateSakura();

    // -------------------------------------------------------------------------
    // 2. INTERACTIVE MENU NAVIGATION
    // -------------------------------------------------------------------------
    const avatarTrigger = document.getElementById('avatar-trigger');
    const sectionsNav = document.getElementById('sections-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.info-tab-content');
    const infoDisplay = document.getElementById('info-display-field');

    // Menu state
    let menuOpen = false;

    // Show menu by default or toggle on click
    avatarTrigger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            sectionsNav.classList.add('visible');
            avatarTrigger.parentElement.classList.add('active');
            // Hide the pulsing click hint
            const indicator = document.querySelector('.pulse-indicator');
            if (indicator) indicator.style.opacity = '0';
        } else {
            sectionsNav.classList.remove('visible');
            avatarTrigger.parentElement.classList.remove('active');
        }
    });

    // Automatically trigger menu on start to show the beautiful menu layout
    setTimeout(() => {
        menuOpen = true;
        sectionsNav.classList.add('visible');
        avatarTrigger.parentElement.classList.add('active');
    }, 400);

    // Tab Navigation switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-target');
            
            // Update Active Nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Apply fading transition to right field
            infoDisplay.style.opacity = '0.3';
            infoDisplay.style.transform = 'translateY(5px)';

            setTimeout(() => {
                // Update Content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `content-${targetTab}`) {
                        content.classList.add('active');
                    }
                });

                // Reset field visual styling
                infoDisplay.style.opacity = '1';
                infoDisplay.style.transform = 'translateY(0)';
            }, 250);
        });
    });

    // -------------------------------------------------------------------------
    // 3. STAFF / ВЫШКА SECTION (Dynamic Discord Loading & Rendering)
    // -------------------------------------------------------------------------
    const staffData = [
        // Admin
        { id: '958344372326367262', name: 'ahiko4kaa', role: 'admin', duties: 'По всем вопросам', replaces: '' },
        // Assistants
        { id: '979410115578962020', name: '@s737530057', role: 'assistant', duties: 'Работа ветки', replaces: '' },
        { id: '1202861728707256361', name: '@__mouse__o.', role: 'assistant', duties: 'Интерактивы', replaces: '' },
        { id: '568846800715251712', name: '@padshaya', role: 'assistant', duties: 'Вкачи', replaces: '' },
        { id: '14366876926298507', name: '@tarnikkk', role: 'assistant', duties: 'Работа ветки', replaces: '' },
        // Curators
        { id: '707864892811771964', name: '@pepyka', role: 'curator', duties: 'Пересобесы', replaces: '@i_fotograf_idi_nahui' },
        { id: '1009148413721456681', name: '@fameshorito', role: 'curator', duties: 'Тех часть', replaces: '@mrarctic91' },
        { id: '294880921117655041', name: '@mrarctic91', role: 'curator', duties: 'Собесы', replaces: '@isnatan' },
        { id: '974416716245377105', name: '@vopross.', role: 'curator', duties: 'Эмбиты, оформление', replaces: '' },
        { id: '1439613747009421432', name: '@heshli12', role: 'curator', duties: 'Проверка pm, собесы, ресобесы', replaces: '' },
        { id: '1000712782183936070', name: '@icntchange', role: 'curator', duties: 'Вкачи + наборы', replaces: '' },
        // Masters
        { id: '606134844585410580', name: '@veta.official', role: 'master', duties: 'Тех часть', replaces: '' },
        { id: '7224848007313438', name: '@i_fotograf_idi_nahui', role: 'master', duties: 'Главный воркер + Пересобесы', replaces: '@Салфетка 2' },
        { id: '1238509954906984469', name: '@helgisadnesss', role: 'master', duties: 'Собесы', replaces: '' },
        { id: '113451059594192546', name: '@izpodzemka', role: 'master', duties: 'Собесы', replaces: '' },
        { id: '60926790922200104', name: '@isnatan.', role: 'master', duties: 'Собесы', replaces: '' },
        { id: '1183107932443922464', name: '@gung_g', role: 'master', duties: 'Собесы', replaces: '' },
        { id: '75933442642883802', name: '@kwittal', role: 'master', duties: 'Пересобесы', replaces: '' },
        { id: '788851098365984869', name: '@gladiator_3388', role: 'master', duties: 'Собесы', replaces: '' }
    ];

    const staffGrid = document.getElementById('staff-grid-container');

    // Fetch single user details from express backend
    async function loadUserProfile(user) {
        try {
            // Attempt to hit server endpoint `/api/discord/:id`
            const response = await fetch(`/api/discord/${user.id}`);
            if (!response.ok) throw new Error('API fetch failed');
            const data = await response.json();
            return {
                ...user,
                nick: data.nick || user.name,
                avatar: data.avatar || ''
            };
        } catch (e) {
            // Graceful fallback avatar and names
            return {
                ...user,
                nick: user.name,
                avatar: `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id.slice(-4), 10) % 6}.png`
            };
        }
    }

    // Render cards to grid
    function renderStaff(list) {
        staffGrid.innerHTML = '';
        list.forEach(member => {
            const card = document.createElement('div');
            card.className = `staff-card role-${member.role}`;
            card.setAttribute('data-role', member.role);
            
            // Build card html structure
            card.innerHTML = `
                <div class="staff-avatar-container">
                    <img src="${member.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="${member.nick}" class="staff-avatar">
                </div>
                <h3 class="staff-name">${member.nick}</h3>
                <span class="staff-role-badge">${member.role.toUpperCase()}</span>
                <div class="staff-duties">
                    <p class="duty-title">Обязанности</p>
                    <p class="duty-text">${member.duties || '—'}</p>
                    ${member.replaces ? `<p class="replacement-info">Заменяет: ${member.replaces}</p>` : ''}
                </div>
                <div class="staff-id">ID: ${member.id}</div>
            `;
            
            staffGrid.appendChild(card);
        });
    }

    // Load profiles and render
    async function initStaffList() {
        // Load all profiles in parallel with fallback
        const profiles = await Promise.all(staffData.map(loadUserProfile));
        renderStaff(profiles);

        // Wire up filtering buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const selectedRole = btn.getAttribute('data-role');
                if (selectedRole === 'all') {
                    renderStaff(profiles);
                } else {
                    const filtered = profiles.filter(p => p.role === selectedRole);
                    renderStaff(filtered);
                }
            });
        });
    }

    initStaffList();
});
