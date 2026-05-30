import * as THREE from
'https://unpkg.com/three@0.165.0/build/three.module.js';

// ======================
// SCENE
// ======================

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(
0x87ceeb
);

// ======================
// CAMERA
// ======================

const camera =
new THREE.PerspectiveCamera(

75,

window.innerWidth /
window.innerHeight,

0.1,

5000

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
document.getElementById(
"speed"
);

const distanceUI =
document.getElementById(
"distance"
);

const scoreUI =
document.getElementById(
"score"
);

const gameOverUI =
document.getElementById(
"gameOver"
);

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

scene.add(
sunLight
);

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

scene.add(
sun
);

// ======================
// GROUND
// ======================

const ground =
new THREE.Mesh(

new THREE.PlaneGeometry(

2000,

5000

),

new THREE.MeshStandardMaterial({

color:0x3cb043

})

);

ground.rotation.x =
-Math.PI/2;

scene.add(
ground
);

// ======================
// ROAD
// ======================

const road =
new THREE.Mesh(

new THREE.BoxGeometry(

20,

0.1,

4000

),

new THREE.MeshStandardMaterial({

color:0x444444

})

);

scene.add(
road
);

// ======================
// ROAD MARKERS
// ======================

const laneMarkers =
[];

for(let i=0;i<200;i++){

const marker =
new THREE.Mesh(

new THREE.BoxGeometry(

0.4,

0.05,

6

),

new THREE.MeshStandardMaterial({

color:0xffffff

})

);

marker.position.set(

0,

0.06,

-i*20

);

scene.add(
marker
);

laneMarkers.push(
marker
);

}

// ======================
// PLAYER CAR
// ======================

const carGroup =
new THREE.Group();

const body =
new THREE.Mesh(

new THREE.BoxGeometry(

2.5,

1,

5

),

new THREE.MeshStandardMaterial({

color:0xff0000

})

);

body.position.y =
0.8;

carGroup.add(
body
);

const roof =
new THREE.Mesh(

new THREE.BoxGeometry(

1.8,

0.8,

2.5

),

new THREE.MeshStandardMaterial({

color:0x66ccff

})

);

roof.position.y =
1.6;

carGroup.add(
roof
);

for(
let x of [-1.4,1.4]
){

for(
let z of [-1.8,1.8]
){

const wheel =
new THREE.Mesh(

new THREE.CylinderGeometry(

0.4,

0.4,

0.4,

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

carGroup.add(
wheel
);

}
}

carGroup.position.y =
0.1;

carGroup.position.z =
0;

scene.add(
carGroup
);

// ======================
// GAME VARIABLES
// ======================

let speed = 0;

let distance = 0;

let score = 0;

let gameOver = false;

const maxSpeed = 3;

// ======================
// CONTROLS
// ======================

const keys = {};

document.addEventListener(
'keydown',
e=>{
keys[e.key]=true;
}
);

document.addEventListener(
'keyup',
e=>{
keys[e.key]=false;
}
);
// ======================
// MOUNTAINS
// ======================

for(let i=0;i<30;i++){

const mountain =
new THREE.Mesh(

new THREE.ConeGeometry(

40 + Math.random()*50,

80 + Math.random()*100,

4

),

new THREE.MeshStandardMaterial({

color:0x666666

})

);

mountain.position.set(

-500 + Math.random()*1000,

40,

-300 - i*200

);

scene.add(
mountain
);

}

// ======================
// TREES
// ======================

for(let i=0;i<200;i++){

createTree(
-35,
-i*30
);

createTree(
35,
-i*30
);

}

function createTree(x,z){

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

trunk.position.set(

x,
1,
z

);

scene.add(
trunk
);

const leaves =
new THREE.Mesh(

new THREE.ConeGeometry(

1.5,
4,
8

),

new THREE.MeshStandardMaterial({

color:0x228b22

})

);

leaves.position.set(

x,
4,
z

);

scene.add(
leaves
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
0x00ffff,
0xff00ff,
0xffffff

];

const traffic =
new THREE.Mesh(

new THREE.BoxGeometry(

2.5,
1,
5

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

-5,
0,
5

];

traffic.position.set(

lanes[
Math.floor(
Math.random()*3
)
],

0.5,

-500 -
Math.random()*1000

);

scene.add(
traffic
);

trafficCars.push(
traffic
);

}

for(let i=0;i<10;i++){

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
) < 2.5

&&

Math.abs(
a.position.z -
b.position.z
) < 4

);

}

// ======================
// ANIMATION LOOP
// ======================

function animate(){

requestAnimationFrame(
animate
);

if(gameOver){

gameOverUI.style.display =
"block";

renderer.render(
scene,
camera
);

return;
}

// ======================
// SPEED CONTROL
// ======================

if(
keys["ArrowUp"] ||
keys["w"]
){

speed += 0.03;

}

if(
keys["ArrowDown"] ||
keys["s"]
){

speed -= 0.05;

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

if(
keys["ArrowLeft"] ||
keys["a"]
){

carGroup.position.x -=
0.25;

}

if(
keys["ArrowRight"] ||
keys["d"]
){

carGroup.position.x +=
0.25;

}

// ROAD LIMITS

if(
carGroup.position.x < -8
){

carGroup.position.x = -8;

}

if(
carGroup.position.x > 8
){

carGroup.position.x = 8;

}

// ======================
// CAMERA FOLLOW
// ======================

camera.position.x =
carGroup.position.x;

camera.position.y = 5;

camera.position.z =
carGroup.position.z + 15;

camera.lookAt(

carGroup.position.x,

1,

carGroup.position.z - 40

);

// ======================
// ROAD MARKERS
// ======================

for(
let marker of laneMarkers
){

marker.position.z +=
speed * 20;

if(
marker.position.z > 100
){

marker.position.z =
-3900;

}

}

// ======================
// TRAFFIC MOVEMENT
// ======================

for(
let traffic of trafficCars
){

traffic.position.z +=
speed * 20;

if(
traffic.position.z > 100
){

traffic.position.z =

-500 -

Math.random()*1500;

const lanes = [

-5,
0,
5

];

traffic.position.x =

lanes[
Math.floor(
Math.random()*3
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
// STATS
// ======================

distance +=
speed * 0.02;

score +=
speed * 5;

speedUI.innerText =

"Speed : " +

Math.floor(
speed * 100
) +

" km/h";

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
