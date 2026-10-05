document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particle-text-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let particles = [];
    let animationFrameId;

    let mouse = { x: null, y: null, radius: 100 };

    // Handle mouse movement
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch support
    canvas.addEventListener("touchmove", (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.touches[0].clientX - rect.left;
        mouse.y = event.touches[0].clientY - rect.top;
    });
    canvas.addEventListener("touchend", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function init() {
        cancelAnimationFrame(animationFrameId);
        particles = [];

        const wrapper = canvas.parentElement;
        // Make canvas fill the parent wrapper
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;

        // Draw text to off-screen context to get pixel data
        const fontSize = Math.min(canvas.width / 6, 200); // Responsive font size
        ctx.font = `900 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = "AURA '26";
        const textX = canvas.width / 2;
        const textY = canvas.height / 2;

        // Create gradient for text
        const gradient = ctx.createLinearGradient(
            textX - canvas.width / 3, 0, 
            textX + canvas.width / 3, 0
        );
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(0.25, "#F0ABFC"); // Light magenta
        gradient.addColorStop(0.5, "#FFFFFF");
        gradient.addColorStop(0.75, "#D946EF"); // Bright magenta
        gradient.addColorStop(1, "#FFFFFF");

        ctx.fillStyle = gradient;
        ctx.fillText(text, textX, textY);

        // Scan pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Density step (higher = fewer particles)
        // Responsive step based on screen size so we don't blow up performance on big screens
        let step = canvas.width > 1200 ? 5 : (canvas.width > 768 ? 4 : 3);

        for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
                const index = (y * canvas.width + x) * 4;
                const alpha = data[index + 3];

                if (alpha > 128) {
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        originX: x,
                        originY: y,
                        color: `rgb(${r}, ${g}, ${b})`,
                        size: Math.random() * 2 + 1,
                        vx: 0,
                        vy: 0,
                        friction: Math.random() * 0.05 + 0.85,
                        ease: Math.random() * 0.05 + 0.05
                    });
                }
            }
        }

        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            // Distance to origin
            let dxOrigin = p.originX - p.x;
            let dyOrigin = p.originY - p.y;

            // Distance to mouse
            if (mouse.x !== null) {
                let dxMouse = mouse.x - p.x;
                let dyMouse = mouse.y - p.y;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < mouse.radius) {
                    let forceDirectionX = dxMouse / distMouse;
                    let forceDirectionY = dyMouse / distMouse;
                    
                    // The closer to mouse, the stronger the force
                    let force = (mouse.radius - distMouse) / mouse.radius;
                    
                    // Repel away from mouse
                    p.vx -= forceDirectionX * force * 5;
                    p.vy -= forceDirectionY * force * 5;
                }
            }

            // Return to origin
            p.vx += dxOrigin * p.ease;
            p.vy += dyOrigin * p.ease;

            // Apply friction
            p.vx *= p.friction;
            p.vy *= p.friction;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Draw particle
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize on load and resize
    init();

    // Debounce resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(init, 200);
    });
});
