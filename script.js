const canvas = document.getElementById('tile');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 5000;

let mouse = {
    x: undefined,
    y: undefined
};

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;

        // Grundläggande hastighet
        this.baseSpeedX = Math.random() * 0.5 - 0.25;
        this.baseSpeedY = Math.random() * 0.5 - 0.25;

        // Aktuell hastighet (påverkas av mus)
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;

        let gray = Math.floor(Math.random() * 156) + 100;
        this.color = `rgb(${gray}, ${gray}, ${gray})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x - this.size < 0 || this.x + this.size > canvas.width) this.speedX *= -1;
        if (this.y - this.size < 0 || this.y + this.size > canvas.height) this.speedY *= -1;

        // Återställ hastighet mot grundhastigheten för naturlig rörelse
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
    }

    draw() {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    checkIfNearMouse() {
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radius = 200;

            if (distance < radius + this.size) {
                const angle = Math.atan2(dy, dx);
                const force = (radius - distance) / radius * 0.5;

                // Temporär påverkan på hastighet
                this.speedX += Math.cos(angle) * force;
                this.speedY += Math.sin(angle) * force;
            }
        }
    }
}


// Skapa partiklar
for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        p.update();
        p.draw();
        p.checkIfNearMouse();
    }

    requestAnimationFrame(animate);
}



document.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

animate();
