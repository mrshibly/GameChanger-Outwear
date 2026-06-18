document.addEventListener('DOMContentLoaded', () => {
    // 1. PARTICLE CANVAS ENGINE
    initParticles();

    // 2. HEADER SCROLL EFFECT & BACK TO TOP BUTTON VISIBILITY
    const header = document.querySelector('.main-header');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('main-header--scrolled');
        } else {
            header.classList.remove('main-header--scrolled');
        }
        
        // Show back-to-top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Highlight active nav links on scroll
        highlightNavLink();
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile Nav Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navBar = document.querySelector('.nav-bar');
    mobileNavToggle.addEventListener('click', () => {
        navBar.classList.toggle('nav-bar--open');
    });

    // Close menu when resizing above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navBar.classList.remove('nav-bar--open');
        }
    });

    // 3. 360° PRODUCT VIEWER LOGIC (WITH DRAG-TO-ROTATE SUPPORT)
    const views360 = [
        { src: 'assets/images/jackets/360_views/jacket_right.png', label: 'Right Side View' },
        { src: 'assets/images/jackets/360_views/jacket_front.png', label: 'Front View' },
        { src: 'assets/images/jackets/360_views/jacket_inside.png', label: 'Inside Structure (Heating & Cooling)' },
        { src: 'assets/images/jackets/360_views/jacket_left.png', label: 'Left Side View' },
        { src: 'assets/images/jackets/360_views/jacket_back.png', label: 'Back View' }
    ];
    
    // Preload all 360° views on load to ensure instant, smooth rotation without blinking
    views360.forEach(view => {
        const img = new Image();
        img.src = view.src;
    });

    let currentViewIndex = 0;
    
    const viewerImages = document.querySelectorAll('.viewer-img');
    const activeLabel = document.getElementById('active-view-label');
    const thumbCards = document.querySelectorAll('.thumb-card');
    const btnPrev = document.getElementById('btn-360-prev');
    const btnNext = document.getElementById('btn-360-next');
    const viewerContainer = document.querySelector('.viewer-image-container');

    function update360Viewer(index) {
        currentViewIndex = index;
        
        // Crossfade between angles using the pre-loaded image layer opacity toggles
        viewerImages.forEach((img, i) => {
            if (i === currentViewIndex) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        activeLabel.textContent = views360[currentViewIndex].label;

        // Update thumbnails active state
        thumbCards.forEach((thumb, i) => {
            if (i === currentViewIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Nav Click handlers
    const dragHelper = document.getElementById('drag-helper-cue');
    function hideDragHelper() {
        if (dragHelper && !dragHelper.classList.contains('hidden')) {
            dragHelper.classList.add('hidden');
        }
    }

    btnPrev.addEventListener('click', () => {
        let index = currentViewIndex - 1;
        if (index < 0) index = views360.length - 1;
        update360Viewer(index);
        hideDragHelper();
    });

    btnNext.addEventListener('click', () => {
        let index = currentViewIndex + 1;
        if (index >= views360.length) index = 0;
        update360Viewer(index);
        hideDragHelper();
    });

    thumbCards.forEach((thumb) => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.getAttribute('data-index'));
            update360Viewer(index);
            hideDragHelper();
        });
    });

    // DRAG AND SWIPE TO ROTATE ENGINE
    let isDragging = false;
    let startX = 0;
    const dragThreshold = 20; // Lowered threshold for a more tactile rotation response

    function setDraggingState(active) {
        if (active) {
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        } else {
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
        }
    }

    // Mouse handlers
    viewerContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        viewerContainer.style.cursor = 'grabbing';
        setDraggingState(true);
        hideDragHelper();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > dragThreshold) {
            if (deltaX > 0) {
                let index = currentViewIndex - 1;
                if (index < 0) index = views360.length - 1;
                update360Viewer(index);
            } else {
                let index = currentViewIndex + 1;
                if (index >= views360.length) index = 0;
                update360Viewer(index);
            }
            startX = e.clientX;
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            viewerContainer.style.cursor = 'grab';
            setDraggingState(false);
        }
    });

    // Touch handlers for mobile viewports (lock page scroll during interaction)
    viewerContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        hideDragHelper();
    }, { passive: true });

    viewerContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        // Prevent default window scroll while swiping the jacket
        if (e.cancelable) {
            e.preventDefault();
        }
        
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > dragThreshold) {
            if (deltaX > 0) {
                let index = currentViewIndex - 1;
                if (index < 0) index = views360.length - 1;
                update360Viewer(index);
            } else {
                let index = currentViewIndex + 1;
                if (index >= views360.length) index = 0;
                update360Viewer(index);
            }
            startX = e.touches[0].clientX;
        }
    }, { passive: false });

    viewerContainer.addEventListener('touchend', () => {
        isDragging = false;
    });


    // 4. THERMOCHROMIC TEMPERATURE SIMULATION (WITH FLOATING TOOLTIP)
    const tempSlider = document.getElementById('temp-slider-control');
    const tempDisplay = document.getElementById('temp-display');
    const jacketCold = document.getElementById('jacket-cold');
    const jacketMid = document.getElementById('jacket-mid');
    const jacketHot = document.getElementById('jacket-hot');
    const tooltip = document.getElementById('slider-tooltip-bubble');

    function updateSliderTooltip(val) {
        const min = parseInt(tempSlider.min);
        const max = parseInt(tempSlider.max);
        
        // Calculate offset percentage (corrected division formula)
        const pct = (val - min) / (max - min);
        
        // Update tooltip value and horizontal offset
        tooltip.textContent = `${val}°C`;
        
        // Dynamic color variable (applied to tooltip background and arrow border)
        let bubbleColor = 'var(--color-orange)';
        let glowStyle = 'var(--glow-orange)';
        let trackBg = '';
        if (val < 30) {
            bubbleColor = '#212529';
            glowStyle = '0 4px 12px rgba(0, 0, 0, 0.35)';
            // Dynamic track fill from dark gray to gray
            trackBg = `linear-gradient(to right, #212529 0%, #212529 ${pct * 100}%, rgba(0, 0, 0, 0.08) ${pct * 100}%, rgba(0, 0, 0, 0.08) 100%)`;
        } else {
            bubbleColor = 'var(--color-orange)';
            glowStyle = 'var(--glow-orange)';
            // Dynamic track fill transitioning from dark gray to burning orange
            trackBg = `linear-gradient(to right, #212529 0%, #212529 50%, var(--color-orange) ${pct * 100}%, rgba(0, 0, 0, 0.08) ${pct * 100}%, rgba(0, 0, 0, 0.08) 100%)`;
        }
        
        tooltip.style.setProperty('--tooltip-bg', bubbleColor);
        tooltip.style.backgroundColor = bubbleColor;
        tooltip.style.boxShadow = glowStyle;
        
        // Apply dynamic color gradient to slider track
        tempSlider.style.background = trackBg;
        
        // Calculate position (offset centering based on thumb travel track)
        tooltip.style.left = `calc(${pct * 100}% + ${(0.5 - pct) * 20}px)`;
    }

    const splitContainer = document.querySelector('.thermo-split-container');

    tempSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        tempDisplay.textContent = val;
        
        // Crossfade layers (3-way fade: cold -> mid -> hot)
        const opacity = (val - 15) / 30; // 0 to 1 range
        if (val <= 30) {
            const pct = (val - 15) / 15;
            jacketCold.style.opacity = 1 - pct;
            jacketMid.style.opacity = pct;
            jacketHot.style.opacity = 0;
        } else {
            const pct = (val - 30) / 15;
            jacketCold.style.opacity = 0;
            jacketMid.style.opacity = 1 - pct;
            jacketHot.style.opacity = pct;
        }
        
        // Update floating tooltip bubble position and styling
        updateSliderTooltip(val);

        // Adjust coloring of readouts and thermal container shadow glow (Senior UX Polish)
        if (val < 30) {
            tempDisplay.style.color = 'var(--text-primary)';
            if (splitContainer) {
                // Neutral dark shadow
                splitContainer.style.filter = `drop-shadow(0 20px 45px rgba(0, 0, 0, ${0.06 + (1 - opacity) * 0.08}))`;
            }
        } else {
            // Interpolate color from black (#121212) to orange (#ff5a00)
            const pct = (val - 30) / 15;
            const r = Math.floor(18 + pct * (255 - 18));
            const g = Math.floor(18 + pct * (90 - 18));
            const b = Math.floor(18 + pct * (0 - 18));
            tempDisplay.style.color = `rgb(${r}, ${g}, ${b})`;

            if (splitContainer) {
                // Shift shadow filter from neutral to fiery orange-red
                const sr = 255;
                const sg = Math.floor(90 + (1 - opacity) * 90);
                const sb = 0;
                splitContainer.style.filter = `drop-shadow(0 20px 45px rgba(${sr}, ${sg}, ${sb}, ${0.08 + opacity * 0.12}))`;
            }
        }
    });

    // Initialize slider states and tooltips on load
    tempSlider.dispatchEvent(new Event('input'));


    // 5. SMART SYSTEM WORKFLOW DETAILS (WITH REFLOW ANIMATION TRIGGER)
    const stepsData = {
        1: {
            title: "Wear & Power On",
            components: [
                "3S Li-ion Battery",
                "3S 40A BMS",
                "Power Switch",
                "LM2596 Buck Converter",
                "ESP32 DevKit"
            ],
            desc: "The battery supplies power to the smart jacket. The BMS protects the battery while the LM2596 buck converter provides a stable 5V voltage. The ESP32 microchip initializes the control program."
        },
        2: {
            title: "Connect Mobile App",
            components: [
                "Mobile Application",
                "Bluetooth / Wi-Fi Protocols",
                "ESP32 DevKit"
            ],
            desc: "The ESP32 controller establishes a secure wireless connection with the companion mobile application, enabling remote monitoring, diagnostics, and direct zone regulation."
        },
        3: {
            title: "Set Your Comfort Temperature",
            components: [
                "Mobile App Interface",
                "ESP32 DevKit EEPROM"
            ],
            desc: "The user inputs a desired comfort threshold (e.g. 35°C) on the mobile application dashboard. The ESP32 receives this parameter and registers it in flash memory as the target feedback index."
        },
        4: {
            title: "Select Heating Zones",
            components: [
                "Carbon Fibre Heating Pads ×3",
                "IRFZ44N MOSFET Switches",
                "ESP32 DevKit GPIOs"
            ],
            desc: "The user selects active heating zones (Left Chest, Right Chest, or Back) on the app. The ESP32 outputs gate voltages to trigger the designated IRFZ44N MOSFET power switching paths."
        },
        5: {
            title: "Real-Time Temperature Monitoring",
            components: [
                "DS18B20 Temperature Sensor",
                "ESP32 OneWire Bus"
            ],
            desc: "The digital DS18B20 sensor probe continuously samples the jacket interior temperature and transmits accurate reading packets to the ESP32 motherboard."
        },
        6: {
            title: "Smart Processing",
            components: [
                "ESP32 Core Processor",
                "Resistor-Capacitor Filter Lines"
            ],
            desc: "The ESP32 executes an internal logic check, comparing the current sensor temperature to the user's selected comfort threshold, filtering out noise, and computing trigger variables."
        },
        7: {
            title: "Heating Activation (If Cold)",
            components: [
                "Carbon Fibre Heating Pads",
                "IRFZ44N MOSFET (Switched ON)",
                "Red Status LED"
            ],
            desc: "If the measured temperature falls below the comfort setpoint, the ESP32 turns on the MOSFET switches. The carbon fiber pads generate radiant heat, and a Red LED glows to confirm active warming."
        },
        8: {
            title: "Cooling Activation (If Hot)",
            components: [
                "Dual Blower Fans",
                "BC547 Transistor Circuit",
                "Blue Status LED"
            ],
            desc: "If the temperature exceeds the comfort limit, the controller switches off the heating pads and turns on the dual blower fans to circulate air, signaled by a glowing Blue LED."
        },
        9: {
            title: "Comfort Temperature Achieved",
            components: [
                "ESP32 Controller Logic",
                "DS18B20 Feedback Loop"
            ],
            desc: "Once the temperature matches the user's target setpoint, the microcontroller cuts active heating and cooling, entering an equilibrium state to conserve battery power."
        },
        10: {
            title: "Continuous Auto Adjustment",
            components: [
                "Feedback Loops",
                "1N5819 Flyback Diodes",
                "Full System Array"
            ],
            desc: "The jacket continuously loops this thermal scanning cycles. If environmental winds cool the jacket or physical activity heats it, the system automatically reacts to sustain stability."
        }
    };

    const stepBtns = document.querySelectorAll('.step-btn');
    const stepCard = document.getElementById('active-step-card');

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const stepNum = btn.getAttribute('data-step');
            
            // Highlight active button
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Reset CSS keyframe animation by forcing reflow
            stepCard.style.animation = 'none';
            stepCard.offsetHeight; // trigger reflow
            stepCard.style.animation = '';

            const data = stepsData[stepNum];
            
            // Construct components HTML
            let compsHtml = '<h4>Active Components:</h4><ul class="workflow-comp-list">';
            data.components.forEach(comp => {
                compsHtml += `<li><span class="pulse-node-dot"></span> ${comp}</li>`;
            });
            compsHtml += '</ul>';
            
            stepCard.innerHTML = `
                <div class="step-header">
                    <span class="step-num">Step ${stepNum.padStart(2, '0')}</span>
                    <h3 class="step-title">${data.title}</h3>
                </div>
                <div class="step-body">
                    <div class="step-components">
                        ${compsHtml}
                    </div>
                    <div class="step-desc">
                        <h4>Process Description:</h4>
                        <p>${data.desc}</p>
                    </div>
                </div>
            `;
        });
    });


    // 6. COMPONENTS MODAL POPUPS
    const componentCards = document.querySelectorAll('.component-card');
    const modal = document.getElementById('component-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close-btn');

    componentCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const details = card.getAttribute('data-details');
            
            modalTitle.textContent = title;
            modalDesc.textContent = details;
            
            modal.classList.add('active');
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });


    // 7. DEMO VIDEO OVERLAY HANDLING
    const videoWrapper = document.querySelector('.video-wrapper');
    const video = document.getElementById('demo-video');
    const videoOverlay = document.getElementById('video-overlay-btn');

    if (videoOverlay) {
        videoOverlay.addEventListener('click', () => {
            videoWrapper.classList.add('playing');
            video.play();
        });
    }

    video.addEventListener('pause', () => {
        videoWrapper.classList.remove('playing');
    });

    video.addEventListener('ended', () => {
        videoWrapper.classList.remove('playing');
    });


    // 8. FAQ ACCORDION TOGGLES
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            
            // Toggle active class
            item.classList.toggle('active');
            
            // Close other items
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
        });
    });


    // 9. PRE-ORDER FORM SIMULATION
    const preorderForm = document.getElementById('preorder-form');
    const formFeedback = document.getElementById('form-message');

    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSubmit = preorderForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            
            // Show loading state
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Simulate server network latency
            setTimeout(() => {
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalText;
                
                // Show success status
                formFeedback.textContent = 'Pre-Order Request Submitted! We will contact you soon.';
                formFeedback.classList.add('success');
                preorderForm.reset();
            }, 1500);
        });
    }

    // Nav Links click highlight and scroll adjust
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                navBar.classList.remove('nav-bar--open');
                
                // Smooth scroll
                const offset = targetSection.offsetTop - header.offsetHeight;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Helper functions
    function highlightNavLink() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        const sections = document.querySelectorAll('section');
        sections.forEach(sec => {
            if (scrollPos >= sec.offsetTop && scrollPos < (sec.offsetTop + sec.offsetHeight)) {
                const currentId = sec.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // IntersectionObserver for reveal-on-scroll elements (Senior UX Polish)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target); // trigger animation only once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    // Automatically register premium reveal elements
    const revealElements = document.querySelectorAll(
        '.feature-card, .component-card, .team-card, .use-case-card, .timeline-step, .section-header, .about-visual, .about-content, .overview-visual, .app-visual, .materials-column, .specs-table-container, .contact-info, .contact-form-container, .video-wrapper'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // 11. INTERACTIVE PHONE APP SIMULATION LOGIC
    const appBodyTempNode = document.getElementById('app-body-temp');
    const appAutoToggle = document.getElementById('app-auto-mode-toggle');
    const appSlider = document.getElementById('app-target-temp-slider');
    const appSliderBadge = document.getElementById('app-slider-value-badge');
    const appFanBtn = document.getElementById('app-fan-btn');
    const appHeatBtn = document.getElementById('app-heat-btn');

    if (appBodyTempNode && appAutoToggle && appSlider && appSliderBadge && appFanBtn && appHeatBtn) {
        let bodyTemp = 35.50;
        let targetTemp = parseFloat(appSlider.value);
        let isAutoMode = appAutoToggle.checked;
        let fanManual = false;
        let heatManual = false;

        function updateSliderBadge(val) {
            const min = parseFloat(appSlider.min);
            const max = parseFloat(appSlider.max);
            const pct = (val - min) / (max - min);
            
            appSliderBadge.textContent = val.toFixed(2);
            // Translate position matching the webkit thumb (36px width offset adjustment)
            appSliderBadge.style.left = `calc(${pct * 100}% + ${(0.5 - pct) * 36}px)`;
        }

        function updateAppOutputs() {
            let isFanOn = false;
            let isHeatOn = false;

            if (isAutoMode) {
                // Auto calculation logic
                if (targetTemp > bodyTemp) {
                    isHeatOn = true;
                } else if (targetTemp < bodyTemp) {
                    isFanOn = true;
                }
                
                // Style button elements as static indicators (no pointer cursors)
                appFanBtn.style.cursor = 'default';
                appHeatBtn.style.cursor = 'default';
            } else {
                // Manual override mode
                isFanOn = fanManual;
                isHeatOn = heatManual;
                
                // Show pointer cursors for interactive items
                appFanBtn.style.cursor = 'pointer';
                appHeatBtn.style.cursor = 'pointer';
            }

            // Apply classes
            if (isFanOn) {
                appFanBtn.classList.remove('inactive');
                appFanBtn.classList.add('active');
            } else {
                appFanBtn.classList.remove('active');
                appFanBtn.classList.add('inactive');
            }

            if (isHeatOn) {
                appHeatBtn.classList.remove('inactive');
                appHeatBtn.classList.add('active');
            } else {
                appHeatBtn.classList.remove('active');
                appHeatBtn.classList.add('inactive');
            }
        }

        // Handle target slider movement
        appSlider.addEventListener('input', (e) => {
            targetTemp = parseFloat(e.target.value);
            updateSliderBadge(targetTemp);
            updateAppOutputs();
        });

        // Handle Auto Mode toggle switch
        appAutoToggle.addEventListener('change', (e) => {
            isAutoMode = e.target.checked;
            if (!isAutoMode) {
                // Preserve current states as initial manual states
                fanManual = (targetTemp < bodyTemp);
                heatManual = (targetTemp > bodyTemp);
            }
            updateAppOutputs();
        });

        // Handle manual button clicks
        appFanBtn.addEventListener('click', () => {
            if (!isAutoMode) {
                fanManual = !fanManual;
                updateAppOutputs();
            }
        });

        appHeatBtn.addEventListener('click', () => {
            if (!isAutoMode) {
                heatManual = !heatManual;
                updateAppOutputs();
            }
        });

        // Live Body Temperature Fluctuation simulation
        setInterval(() => {
            // Random wobbly drift within [35.40, 35.60] to simulate sensor data noise
            const drift = (Math.random() * 0.04 - 0.02);
            bodyTemp = Math.max(35.40, Math.min(35.60, bodyTemp + drift));
            appBodyTempNode.textContent = bodyTemp.toFixed(2);
            
            // Re-trigger auto mode state checks if active
            updateAppOutputs();
        }, 1500);

        // Initial Layout sync
        updateSliderBadge(targetTemp);
        updateAppOutputs();
    }
});


// 10. PARTICLE BACKGROUND CANVAS IMPLEMENTATION (WITH CURSOR REPULSION PHYSICS)
let mouseX = null;
let mouseY = null;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 65;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleRange = Math.random() * 0.3 + 0.1;
            this.time = Math.random() * 100;
            
            // Left half gets falling ice-blue snow particles
            // Right half gets floating red/orange heat particles
            if (this.x < w / 2) {
                this.type = 'cold';
                this.color = 'rgba(9, 146, 165, ' + (Math.random() * 0.25 + 0.05) + ')';
                this.speedY = Math.random() * 0.6 + 0.2; // falling
            } else {
                this.type = 'hot';
                this.color = 'rgba(255, 90, 0, ' + (Math.random() * 0.25 + 0.05) + ')';
                this.speedY = -(Math.random() * 0.6 + 0.2); // rising
            }
        }

        update() {
            // Apply cursor repulsion force
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repulsionRadius = 120; // radius of influence
                
                if (dist < repulsionRadius) {
                    const force = (repulsionRadius - dist) / repulsionRadius;
                    const forceX = (dx / dist) * force * 1.8;
                    const forceY = (dy / dist) * force * 1.8;
                    
                    this.x += forceX;
                    this.y += forceY;
                }
            }

            // Sine wave drift for natural floatation
            this.time += this.wobbleSpeed;
            this.x += Math.sin(this.time) * this.wobbleRange + this.speedX;
            this.y += this.speedY;

            // Boundary checks
            if (this.type === 'cold') {
                if (this.y > h || this.x < 0 || this.x > w / 2) {
                    this.reset();
                    this.y = 0; // restart at top
                }
            } else {
                if (this.y < 0 || this.x < w / 2 || this.x > w) {
                    this.reset();
                    this.y = h; // restart at bottom
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        
        // Render simple split center line in background
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
