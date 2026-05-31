import * as THREE from
'https://unpkg.com/three@0.165.0/build/three.module.js';

// ======================
// SCENE
// ======================

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x87ceeb);

// ======================
// CAMERA
// ======================

const camera =
new THREE.PerspectiveCamera(

75,

window.innerWidth /
window.innerHeight,

0.1,

8000

);

camera.position.set(
0,
5,
15
);

// ======================
// RENDERER
// ======================

const renderer =
new THREE.WebGLRenderer({

antialias:true

});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

// ======================
// HUD
// ======================

const speedUI =
document.getElementById("speed");

const distanceUI =
document.getElementById("distance");

const scoreUI =
document.getElementById("score");

const bestScoreUI =
document.getElementById("bestScore");

const needle =
document.getElementById("needle");

const gameOverUI =
document.getElementById("gameOver");

const warningUI =
document.getElementById("warning");

// ======================
// HIGH SCORE
// ======================

let bestScore =

Number(

localStorage.getItem(
"highScore"
)

) || 0;

bestScoreUI.innerText =
"Best : " + bestScore;

// ======================
// LIGHTS
// ======================

const sunLight =
new THREE.DirectionalLight(

0xffffff,
3

);

sunLight.position.set(
100,
150,
50
);

scene.add(sunLight);

scene.add(

new THREE.AmbientLight(
0xffffff,
2
)

);

// ======================
// SUN
// ======================

const sun =
new THREE.Mesh(

new THREE.SphereGeometry(
20,
32,
32
),

new THREE.MeshBasicMaterial({
color:0xffff00
})

);

sun.position.set(
200,
200,
-500
);

scene.add(sun);

// ======================
// GROUND
// ======================

const ground =
new THREE.Mesh(

new THREE.PlaneGeometry(
4000,
10000
),

new THREE.MeshStandardMaterial({
color:0x3cb043
})

);

ground.rotation.x =
-Math.PI/2;

scene.add(ground);

// ======================
// ROAD
// ======================

const road =
new THREE.Mesh(

new THREE.BoxGeometry(

40,
0.1,
5000

),

new THREE.MeshStandardMaterial({

color:0x444444

})

);

scene.add(road);

// ======================
// ROAD MARKERS
// ======================

const laneMarkers = [];

for(let i=0;i<300;i++){

const marker =
new THREE.Mesh(

new THREE.BoxGeometry(
0.5,
0.05,
8
),

new THREE.MeshStandardMaterial({
color:0xffffff
})

);

marker.position.set(
0,
0.06,
-i*18
);

scene.add(marker);

laneMarkers.push(marker);

}

// ======================
// PLAYER CAR
// ======================

const carGroup =
new THREE.Group();

const body =
new THREE.Mesh(

new THREE.BoxGeometry(
3,
1,
6
),

new THREE.MeshStandardMaterial({
color:0xff0000
})

);

body.position.y = 0.8;

carGroup.add(body);

const roof =
new THREE.Mesh(

new THREE.BoxGeometry(
2,
1,
3
),

new THREE.MeshStandardMaterial({
color:0x66ccff
})

);

roof.position.y = 1.8;

carGroup.add(roof);

for(let x of [-1.6,1.6]){

for(let z of [-2.2,2.2]){

const wheel =
new THREE.Mesh(

new THREE.CylinderGeometry(
0.5,
0.5,
0.5,
16
),

new THREE.MeshStandardMaterial({
color:0x111111
})

);

wheel.rotation.z =
Math.PI/2;

wheel.position.set(
x,
0.4,
z
);

carGroup.add(wheel);

}
}

carGroup.position.y = 0.1;
carGroup.position.z = 0;

scene.add(carGroup);
// ======================
// GAME VARIABLES
// ======================

let speed = 0;

let distance = 0;

let score = 0;

let gameOver = false;

const maxSpeed = 0.6;

const cruiseSpeed = 0.35;

const autoAcceleration = 0.0015;

const turboAcceleration = 0.008;

const brakingForce = 0.03;

let grassTimer = 0;

// ======================
// CONTROLS
// ======================

const keys = {};

document.addEventListener(
'keydown',
e=>{

keys[e.key] = true;

if(
gameOver &&
e.key === "Enter"
){

location.reload();

}

}
);

document.addEventListener(
'keyup',
e=>{

keys[e.key] = false;

}
);

// ======================
// CLOUDS
// ======================

const clouds = [];

for(let i=0;i<20;i++){

const cloud =
new THREE.Group();

for(let j=0;j<4;j++){

const puff =
new THREE.Mesh(

new THREE.SphereGeometry(
5,
16,
16
),

new THREE.MeshBasicMaterial({
color:0xffffff
})

);

puff.position.x =
j * 4;

cloud.add(puff);

}

cloud.position.set(

-400 +
Math.random()*800,

120 +
Math.random()*80,

-300 -
Math.random()*3000

);

scene.add(cloud);

clouds.push(cloud);

}

// ======================
// MOUNTAINS
// ======================

const mountains = [];

for(let i=0;i<40;i++){

const mountain =
new THREE.Mesh(

new THREE.ConeGeometry(

40 +
Math.random()*60,

100 +
Math.random()*100,

4

),

new THREE.MeshStandardMaterial({

color:0x666666

})

);

const side =

Math.random() > 0.5

? 1

: -1;

mountain.position.set(

side *

(

500 +

Math.random()*400

),

40,

-300 -
i*180

);

scene.add(mountain);

mountains.push(mountain);

}

// ======================
// TREES
// ======================

const trees = [];

function createTree(x,z){

const group =
new THREE.Group();

const trunk =
new THREE.Mesh(

new THREE.CylinderGeometry(
0.3,
0.4,
2
),

new THREE.MeshStandardMaterial({
color:0x8b4513
})

);

trunk.position.y = 1;

group.add(trunk);

const leaves =
new THREE.Mesh(

new THREE.ConeGeometry(
1.8,
4,
8
),

new THREE.MeshStandardMaterial({
color:0x228b22
})

);

leaves.position.y = 4;

group.add(leaves);

group.position.set(
x,
0,
z
);

scene.add(group);

trees.push(group);

}

for(let i=0;i<250;i++){

createTree(
-60,
-i*25
);

createTree(
60,
-i*25
);

}

// ======================
// TRAFFIC
// ======================

const trafficCars = [];

function spawnTraffic(){

const colors = [

0x0000ff,
0xffff00,
0xff00ff,
0xffffff,
0x00ffff

];

const traffic =
new THREE.Mesh(

new THREE.BoxGeometry(
3,
1,
6
),

new THREE.MeshStandardMaterial({

color:
colors[
Math.floor(
Math.random()*colors.length
)
]

})

);

const lanes = [

-15,
-7.5,
0,
7.5,
15

];

traffic.position.set(

lanes[
Math.floor(
Math.random()*5
)
],

0.5,

-1000 -
Math.random()*3000

);

traffic.userData.speed =

0.1 +

Math.random()*0.3;

scene.add(
traffic
);

trafficCars.push(
traffic
);

}

for(let i=0;i<20;i++){

spawnTraffic();

}

// ======================
// COLLISION
// ======================

function checkCollision(a,b){

return (

Math.abs(
a.position.x -
b.position.x
) < 3

&&

Math.abs(
a.position.z -
b.position.z
) < 5

);

}
// ======================
// ANIMATION LOOP
// ======================

function animate(){

requestAnimationFrame(
animate
);

// ======================
// GAME OVER
// ======================

if(gameOver){

if(
score > bestScore
){

bestScore =

Math.floor(
score
);

localStorage.setItem(
"highScore",
bestScore
);

}

bestScoreUI.innerText =

"Best : " +

bestScore;

gameOverUI.style.display =
"block";

renderer.render(
scene,
camera
);

return;

}

// ======================
// AUTO ACCELERATION
// ======================

if(
speed < cruiseSpeed
){

speed +=
autoAcceleration;

}

// ======================
// TURBO
// ======================

if(
keys["ArrowUp"] ||
keys["w"]
){

speed +=
turboAcceleration;

}

// ======================
// BRAKE
// ======================

let braking = false;

if(
keys["ArrowDown"] ||
keys["s"]
){

speed -=
brakingForce;

braking = true;

}

if(speed < 0){

speed = 0;

}

if(speed > maxSpeed){

speed = maxSpeed;

}

// ======================
// STEERING
// ======================

let steering = false;

if(
keys["ArrowLeft"] ||
keys["a"]
){

carGroup.position.x -=
0.30;

carGroup.rotation.z =
Math.min(
0.25,
carGroup.rotation.z + 0.02
);

steering = true;

}

if(
keys["ArrowRight"] ||
keys["d"]
){

carGroup.position.x +=
0.30;

carGroup.rotation.z =
Math.max(
-0.25,
carGroup.rotation.z - 0.02
);

steering = true;

}

// ======================
// RETURN TO CENTER
// ======================

if(!steering){

carGroup.rotation.z *=
0.90;

}

// ======================
// BRAKING DRIFT
// ======================

if(braking){

carGroup.rotation.y =

Math.sin(

Date.now()*0.01

) * 0.03;

}else{

carGroup.rotation.y *=
0.90;

}

// ======================
// ROAD LIMITS
// ======================

if(
carGroup.position.x < -14
){

carGroup.position.x = -14;

}

if(
carGroup.position.x > 14
){

carGroup.position.x = 14;

}

// ======================
// GRASS PENALTY
// ======================

if(

Math.abs(
carGroup.position.x
) > 12

){

grassTimer +=

1/60;

speed *= 0.97;

warningUI.style.display =
"block";

if(
grassTimer >= 2
){

gameOver = true;

}

}
else{

grassTimer = 0;

warningUI.style.display =
"none";

}

// ======================
// CAMERA FOLLOW
// ======================

camera.position.x +=

(
carGroup.position.x -
camera.position.x
)

* 0.08;

camera.position.y = 5;

camera.position.z =

carGroup.position.z +
15;

camera.lookAt(

carGroup.position.x,

1,

carGroup.position.z - 40

);

// ======================
// SPEEDOMETER
// ======================

const speedKMH =

Math.floor(
speed * 100
);

speedUI.innerText =

"Speed : " +
speedKMH +
" km/h";

const angle =

-120 +

(
speed /
maxSpeed
)

* 240;

needle.style.transform =

`rotate(${angle}deg)`;

// ======================
// ROAD MARKERS
// ======================

for(

let marker of laneMarkers

){

marker.position.z +=

speed * 25;

if(

marker.position.z > 100

){

marker.position.z =

-5000;

}

}

// ======================
// CLOUDS
// ======================

for(

let cloud of clouds

){

cloud.position.x +=
0.05;

cloud.position.z +=
speed * 0.8;

if(

cloud.position.x > 500

){

cloud.position.x =
-500;

}

if(

cloud.position.z > 200

){

cloud.position.z =
-3000;

}

}

// ======================
// TREES
// ======================

for(

let tree of trees

){

tree.position.z +=

speed * 18;

if(

tree.position.z > 100

){

tree.position.z =

-6000;

}

}

// ======================
// MOUNTAINS
// ======================

for(

let mountain of mountains

){

mountain.position.z +=

speed * 3;

if(

mountain.position.z > 200

){

mountain.position.z =

-7000;

}

}

// ======================
// TRAFFIC
// ======================

for(

let traffic of trafficCars

){

traffic.position.z +=

(speed * 25)

-

(

traffic.userData.speed * 10

);

if(

traffic.position.z > 100

){

traffic.position.z =

-1000 -

Math.random()*4000;

const lanes = [

-15,
-7.5,
0,
7.5,
15

];

traffic.position.x =

lanes[
Math.floor(
Math.random()*5
)
];

}

if(

checkCollision(
carGroup,
traffic
)

){

gameOver = true;

}

}

// ======================
// DISTANCE
// ======================

distance +=

speed * 0.025;

score +=

speed * 6;

// ======================
// HIGH SCORE LIVE UPDATE
// ======================

if(

score > bestScore

){

bestScore =

Math.floor(
score
);

bestScoreUI.innerText =

"Best : " +

bestScore;

}

// ======================
// HUD
// ======================

distanceUI.innerText =

"Distance : " +

distance.toFixed(1) +

" km";

scoreUI.innerText =

"Score : " +

Math.floor(
score
);

// ======================
// RENDER
// ======================

renderer.render(
scene,
camera
);

}

// ======================
// RESIZE
// ======================

window.addEventListener(

'resize',

()=>{

camera.aspect =

window.innerWidth /

window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(

window.innerWidth,

window.innerHeight

);

}

);

// ======================
// START
// ======================

animate();
