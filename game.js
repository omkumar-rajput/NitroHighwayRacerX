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
    y: canvas.height - 170,

    speed: 120
};


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
// ROAD SETTINGS
// ======================

const roadWidth = canvas.width * 0.45;


// ======================
// UPDATE
// ======================

function update() {

    if (keys["ArrowLeft"] || keys["a"]) {

        car.x -= 8;
    }

    if (keys["ArrowRight"] || keys["d"]) {

        car.x += 8;
    }

    // Left boundary

    const leftBoundary =
        (canvas.width - roadWidth) / 2;

    // Right boundary

    const rightBoundary =
        leftBoundary + roadWidth - car.width;

    if (car.x < leftBoundary) {

        car.x = leftBoundary;
    }

    if (car.x > rightBoundary) {

        car.x = rightBoundary;
    }
}


// ======================
// DRAW SKY
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
// DRAW GRASS
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
// DRAW ROAD
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
// DRAW ROAD LINES
// ======================

function drawRoadLines() {

    ctx.fillStyle = "white";

    for (let i = 0; i < canvas.height; i += 80) {

        ctx.fillRect(
            canvas.width / 2 - 5,
            i,
            10,
            40
        );
    }
}


// ======================
// DRAW PLAYER CAR
// ======================

function drawCar() {

    // Body

    ctx.fillStyle = "red";

    ctx.fillRect(
        car.x,
        car.y,
        car.width,
        car.height
    );

    // Windshield

    ctx.fillStyle = "#66ccff";

    ctx.fillRect(
        car.x + 10,
        car.y + 15,
        40,
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
        "Speed : " + car.speed + " km/h",
        20,
        40
    );
}


// ======================
// GAME LOOP
// ======================

function gameLoop() {

    update();

    drawSky();

    drawGrass();

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
