// ======================
// CANVAS SETUP
// ======================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ======================
// PLAYER CAR
// ======================

const car = {
    width: 60,
    height: 120,

    x: canvas.width / 2 - 30,
    y: canvas.height - 180,

    speed: 0
};

// ======================
// GAME VARIABLES
// ======================

let distance = 0;
let lineOffset = 0;

// ======================
// ROAD SETTINGS
// ======================

const roadWidth = canvas.width * 0.45;

// ======================
// KEYBOARD CONTROLS
// ======================

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ======================
// UPDATE
// ======================

function update() {

    // Steering

    if (keys["ArrowLeft"] || keys["a"]) {
        car.x -= 8;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        car.x += 8;
    }

    // Road boundaries

    const leftBoundary =
        (canvas.width - roadWidth) / 2;

    const rightBoundary =
        leftBoundary + roadWidth - car.width;

    if (car.x < leftBoundary) {
        car.x = leftBoundary;
    }

    if (car.x > rightBoundary) {
        car.x = rightBoundary;
    }

    // Speed increases gradually

    if (car.speed < 180) {
        car.speed += 0.05;
    }

    // Distance travelled

    distance += car.speed / 10000;

    // Road animation speed

    lineOffset += car.speed / 10;
}

// ======================
// SKY
// ======================

function drawSky() {

    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// ======================
// SUN
// ======================

function drawSun() {

    ctx.beginPath();

    ctx.arc(
        canvas.width - 150,
        120,
        50,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "yellow";
    ctx.fill();
}

// ======================
// MOUNTAINS
// ======================

function drawMountains() {

    ctx.fillStyle = "#666";

    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(250, 80);
    ctx.lineTo(500, 300);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.lineTo(650, 50);
    ctx.lineTo(1000, 300);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(850, 300);
    ctx.lineTo(1200, 120);
    ctx.lineTo(1600, 300);
    ctx.fill();
}

// ======================
// GRASS
// ======================

function drawGrass() {

    ctx.fillStyle = "#2E8B57";

    ctx.fillRect(
        0,
        0,
        (canvas.width - roadWidth) / 2,
        canvas.height
    );

    ctx.fillRect(
        (canvas.width + roadWidth) / 2,
        0,
        (canvas.width - roadWidth) / 2,
        canvas.height
    );
}

// ======================
// TREE
// ======================

function drawTree(x, y) {

    ctx.fillStyle = "#8B4513";

    ctx.fillRect(
        x,
        y,
        12,
        35
    );

    ctx.beginPath();

    ctx.arc(
        x + 6,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#228B22";

    ctx.fill();
}

// ======================
// TREES
// ======================

function drawTrees() {

    for (let i = 0; i < 12; i++) {

        drawTree(
            120,
            i * 100 + 50
        );

        drawTree(
            canvas.width - 140,
            i * 100 + 50
        );
    }
}

// ======================
// ROAD
// ======================

function drawRoad() {

    ctx.fillStyle = "#444";

    ctx.fillRect(
        (canvas.width - roadWidth) / 2,
        0,
        roadWidth,
        canvas.height
    );
}

// ======================
// ROAD LINES
// ======================

function drawRoadLines() {

    ctx.fillStyle = "white";

    for (
        let i = -100;
        i < canvas.height;
        i += 80
    ) {

        ctx.fillRect(
            canvas.width / 2 - 5,
            (i + lineOffset) % (canvas.height + 100),
            10,
            40
        );
    }
}

// ======================
// CAR
// ======================

function drawCar() {

    // Shadow

    ctx.fillStyle = "rgba(0,0,0,0.3)";

    ctx.fillRect(
        car.x + 5,
        car.y + 5,
        car.width,
        car.height
    );

    // Main body

    ctx.fillStyle = "red";

    ctx.fillRect(
        car.x,
        car.y,
        car.width,
        car.height
    );

    // Roof

    ctx.fillStyle = "#66ccff";

    ctx.fillRect(
        car.x + 10,
        car.y + 20,
        40,
        40
    );

    // Wheels

    ctx.fillStyle = "black";

    ctx.fillRect(
        car.x - 5,
        car.y + 20,
        10,
        30
    );

    ctx.fillRect(
        car.x + 55,
        car.y + 20,
        10,
        30
    );

    ctx.fillRect(
        car.x - 5,
        car.y + 70,
        10,
        30
    );

    ctx.fillRect(
        car.x + 55,
        car.y + 70,
        10,
        30
    );

    // Headlights

    ctx.fillStyle = "yellow";

    ctx.fillRect(
        car.x + 5,
        car.y,
        10,
        8
    );

    ctx.fillRect(
        car.x + 45,
        car.y,
        10,
        8
    );
}

// ======================
// DASHBOARD
// ======================

function drawDashboard() {

    ctx.fillStyle = "black";

    ctx.font = "24px Arial";

    ctx.fillText(
        "Speed : " +
        Math.floor(car.speed) +
        " km/h",
        20,
        40
    );

    ctx.fillText(
        "Distance : " +
        distance.toFixed(2) +
        " km",
        20,
        80
    );
}

// ======================
// GAME LOOP
// ======================

function gameLoop() {

    update();

    drawSky();

    drawSun();

    drawMountains();

    drawGrass();

    drawTrees();

    drawRoad();

    drawRoadLines();

    drawCar();

    drawDashboard();

    requestAnimationFrame(gameLoop);
}

// ======================
// START GAME
// ======================

gameLoop();
