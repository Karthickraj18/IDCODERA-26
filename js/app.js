/**
 * AURA '26 Main JavaScript (WOW VISUAL UPGRADE)
 */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    document.body.classList.add('is-mobile');
}

// ==========================================================================
// ENERGY CORE PARTICLES
// ==========================================================================
function initEnergyCore() {
    const container = document.getElementById('core-particles');
    if (!container || prefersReducedMotion) return;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = Math.random() * 4 + 2 + 'px';
        p.style.height = p.style.width;
        p.style.background = Math.random() > 0.5 ? 'var(--violet-neon)' : 'var(--magenta)';
        p.style.borderRadius = '50%';
        p.style.left = '50%';
        p.style.top = '50%';
        p.style.opacity = Math.random() * 0.5 + 0.2;
        p.style.boxShadow = '0 0 10px currentColor';
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 250;
        const duration = Math.random() * 4 + 2;
        
        gsap.set(p, {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        });

        gsap.to(p, {
            x: Math.cos(angle) * (radius + 50),
            y: Math.sin(angle) * (radius + 50),
            opacity: 0,
            duration: duration,
            repeat: -1,
            ease: 'power1.out',
            delay: Math.random() * 2
        });
        
        container.appendChild(p);
    }
}

// Ensure smooth loading cinematic entrance
window.addEventListener('load', () => {
    initEnergyCore();

    if (prefersReducedMotion) {
        document.body.classList.remove('loading');
        initAnimations();
        return;
    }

    const tl = gsap.timeline();
    tl.fromTo('.reveal-up', 
        { y: 60, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.15, ease: 'power4.out' }
    ).add(() => {
        document.body.classList.remove('loading');
        initAnimations();
    });
});

// ==========================================================================
// CUSTOM CURSOR & MAGNETIC BUTTONS
// ==========================================================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorText = document.querySelector('.cursor-text');

if (!isMobile && !prefersReducedMotion && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 100, fill: "forwards" });
    });

    const interactives = document.querySelectorAll('a, button, .event-panel');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            
            const text = el.getAttribute('data-cursor-text');
            if (text) {
                cursorText.textContent = text;
                document.body.classList.add('cursor-text-active');
            } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
                cursorText.textContent = 'OPEN';
                document.body.classList.add('cursor-text-active');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
            document.body.classList.remove('cursor-text-active');
            cursorText.textContent = '';
        });
    });
}

const magneticElements = document.querySelectorAll('.magnetic');
if (!isMobile && !prefersReducedMotion) {
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const strength = el.getAttribute('data-strength') || 20;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: (x / rect.width) * strength,
                y: (y / rect.height) * strength,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ==========================================================================
// GSAP SCROLL ANIMATIONS (WOW UPGRADE)
// ==========================================================================
function initAnimations() {
    if (prefersReducedMotion) return;

    // Signature Orb Mouse Follow
    const sigOrb = document.getElementById('signature-orb');
    if (sigOrb && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(sigOrb, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }

    // Header Blur on Scroll
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '.header' }
    });
    
    // Global Background Color Journey
    gsap.to('body', {
        backgroundColor: '#1a0b2e',
        scrollTrigger: {
            trigger: '.events-section',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    });
    
    gsap.to('body', {
        backgroundColor: '#2b0a3d',
        scrollTrigger: {
            trigger: '.prizes-section',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    });

    gsap.to('body', {
        backgroundColor: '#05020D',
        scrollTrigger: {
            trigger: '.registration-section',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    });

    // Glance Section Cinematic Reveal
    if (document.querySelector('.glance-section')) {
        const glanceTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.glance-section',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse'
            }
        });

        glanceTl.from('.g-slide-left', { x: -100, opacity: 0, duration: 1, ease: 'power4.out' })
                .from('.g-slide-right', { x: 100, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
                .from('.prize-glow-bg', { scale: 0, opacity: 0, duration: 1.5, ease: 'power3.out' }, '-=0.5')
                .from('.g-prize-val', { y: 50, scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, '-=1')
                .from('.g-prize-lbl', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
                .from('.g-slide-up', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 }, '-=0.6');
    }

    // Countdown Section Reveal
    if (document.querySelector('.countdown-section')) {
        gsap.from('.cd-reveal', {
            y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.countdown-section',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse'
            }
        });
    }

    // Generic Text Reveals
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        gsap.from(text, {
            y: 40, opacity: 0, duration: 1, ease: 'power4.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });

    // Cinematic Events Horizontal Scroll
    const eventsTrack = document.querySelector('.events-track');
    
    if (eventsTrack && !isMobile) {
        let getScrollAmount = () => {
            let trackWidth = eventsTrack.scrollWidth;
            return -(trackWidth - window.innerWidth);
        };

        const tween = gsap.to(eventsTrack, {
            x: getScrollAmount,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: ".events-section",
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                let activeIdx = Math.min(3, Math.floor(self.progress * 4));
                const numDisplay = document.querySelector('.current-event-num');
                if(numDisplay) numDisplay.innerText = '0' + (activeIdx + 1);
            }
        });

        // Background Number Pop-up Cinematic Animation
        const eventPanels = document.querySelectorAll('.event-panel');
        eventPanels.forEach((panel) => {
            const bgNum = panel.querySelector('.ep-bg-num');
            if (bgNum) {
                gsap.from(bgNum, {
                    scale: 0.3,
                    opacity: 0,
                    x: 50,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: tween,
                        start: "left 75%",
                        toggleActions: "play reverse play reverse"
                    }
                });
            }
        });
    }

    // Prizes Dynamic Parallax Scroll
    if (document.querySelector('.prizes-section')) {
        const prizesTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.prizes-section',
                start: 'top 85%',
                end: 'center center',
                scrub: 1
            }
        });

        prizesTl.fromTo('.prize-energy-bg', 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1.5, opacity: 1, ease: 'none' }, 0
        );

        prizesTl.fromTo('.total-pool-cinematic',
            { y: 100, scale: 0.8, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, ease: 'power2.out' }, 0
        );

        prizesTl.fromTo('.rank-2', { y: 150, opacity: 0 }, { y: 0, opacity: 1, ease: 'power1.out' }, 0.1);
        prizesTl.fromTo('.rank-3', { y: 180, opacity: 0 }, { y: 20, opacity: 1, ease: 'power1.out' }, 0.15);
        prizesTl.fromTo('.rank-1', { y: 250, scale: 0.7, opacity: 0 }, { y: -10, scale: 1.05, opacity: 1, ease: 'back.out(1.5)' }, 0.2);
    }
}

// ==========================================================================
// COUNTDOWN TIMER
// ==========================================================================
const targetDate = new Date("2026-10-14T09:00:00+05:30").getTime();
const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
};

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        if(els.days) els.days.innerText = "00";
        if(els.hours) els.hours.innerText = "00";
        if(els.mins) els.mins.innerText = "00";
        if(els.secs) els.secs.innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(els.days) els.days.innerText = String(days).padStart(2, '0');
    if(els.hours) els.hours.innerText = String(hours).padStart(2, '0');
    if(els.mins) els.mins.innerText = String(minutes).padStart(2, '0');
    if(els.secs) els.secs.innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================================================
// MOBILE NAVIGATION
// ==========================================================================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const closeNav = document.querySelector('.mobile-close-btn');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

function toggleMenu(force) {
    const isActive = typeof force === 'boolean' ? force : !mobileNav.classList.contains('active');
    mobileNav.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
}

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => toggleMenu(true));
    closeNav.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
const accTriggers = document.querySelectorAll('.accordion-trigger');
accTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        accTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        if (!isExpanded) {
            trigger.setAttribute('aria-expanded', 'true');
        }
    });
});


