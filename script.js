const canvas = document.getElementById('tile');
const ctx = canvas.getContext('2d');
const textCanvas = document.getElementById("textCanvas");
const textCtx = textCanvas.getContext("2d");
const input = document.getElementById("input");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;

let textCords = [];
let particlesArray = [];
const numberOfParticles = 5000;

let mouse = { x: undefined, y: undefined };

// Rita text på textCanvas
function drawText() {
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    const text = input.value;
    const centerX = textCanvas.width / 2;
    const centerY = textCanvas.height / 2;
    let fontSize = Math.min(textCanvas.width, textCanvas.height) / 5;
    textCtx.font = `${fontSize}px Arial`;
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillText(text, centerX, centerY);
}

// Hämta koordinater från text
function getTextCords() {
    const cords = [];
    const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const data = imageData.data;

    for (let y = 0; y < textCanvas.height; y += 4) {
        for (let x = 0; x < textCanvas.width; x += 4) {
            let pixelIndex = (y * textCanvas.width + x) * 4;
            if (data[pixelIndex + 3] > 0) { // Alpha > 0
                cords.push({ x, y });
            }
        }
    }
    return cords;
}

// Partikelklass
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;

        this.baseSpeedX = Math.random() * 0.5 - 0.25;
        this.baseSpeedY = Math.random() * 0.5 - 0.25;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;

        let gray = Math.floor(Math.random() * 156) + 100;
        this.color = `rgb(${gray}, ${gray}, ${gray})`;

        // Fallback om textCords är tomt
        const randomIndex = textCords.length > 0 ? Math.floor(Math.random() * textCords.length) : 0;
        this.target = textCords[randomIndex] || { x: this.x, y: this.y };
    }

    update() {
        // Rör dig mot target
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        this.x += dx * 0.05;
        this.y += dy * 0.05;

        // Lägg till grundhastighet
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        this.x += this.speedX;
        this.y += this.speedY;

        // Studsa mot kanter
        if (this.x - this.size < 0 || this.x + this.size > canvas.width) this.speedX *= -1;
        if (this.y - this.size < 0 || this.y + this.size > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Skapa partiklar
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particlesArray) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animate);
}

// Event: musposition
document.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

input.addEventListener("input", () => {
    drawText();
    textCords = getTextCords();
    initParticles(); // Partiklarna får nya targets
});

// Kör allt
drawText();
textCords = getTextCords();
initParticles();
animate();