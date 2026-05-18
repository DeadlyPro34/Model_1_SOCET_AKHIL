const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const options = ["Pizza Hut", "Taco Bell", "Subway", "Salad Bar", "Sushi Zen", "Pasta Co"];
// Using a sophisticated, slightly muted palette
const colors = ["#475569", "#6366f1", "#818cf8", "#94a3b8", "#4f46e5", "#334155"];

function drawWheel() {
    const arcSize = (2 * Math.PI) / options.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    options.forEach((opt, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(160, 160);
        ctx.arc(160, 160, 158, angle, angle + arcSize);
        ctx.lineTo(160, 160);
        ctx.fill();

        // Fine inner border for each segment
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Typography
        ctx.save();
        ctx.translate(160, 160);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "500 12px Inter";
        ctx.fillText(opt.toUpperCase(), 140, 5);
        ctx.restore();
    });

    // Center circle decoration
    ctx.beginPath();
    ctx.arc(160, 160, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.stroke();
}

let currentRotation = 0;
let isSpinning = false;

function spinWheel() {
    if (isSpinning) return;

    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('wheel');
    const resultBox = document.getElementById('resultBox');
    const decisionResult = document.getElementById('decisionResult');

    isSpinning = true;
    spinBtn.innerText = "Analyzing...";
    spinBtn.classList.add('opacity-50', 'cursor-not-allowed');
    resultBox.classList.add('hidden');

    // Randomly determine spins (between 4 and 6 full rotations)
    const extraSpins = 4 + Math.random() * 2;
    const targetRotation = currentRotation + (extraSpins * 360) + (Math.random() * 360);
    currentRotation = targetRotation;

    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        spinBtn.innerText = "Execute Randomization";
        spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        const actualDegree = (currentRotation % 360);
        // The 0 degree of the canvas is on the right, but the pointer is at the top.
        // We need to offset by 90 degrees to find the top segment.
        const offset = 90;
        const normalizedDegree = (360 - (actualDegree - offset) % 360) % 360;
        const index = Math.floor(normalizedDegree / (360 / options.length));

        decisionResult.innerText = options[index];
        resultBox.classList.remove('hidden');
    }, 4000);
}

window.onload = drawWheel;