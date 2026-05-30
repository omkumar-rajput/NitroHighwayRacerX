import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

// =========================
// SCENE
// =========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// =========================
// CAMERA
// =========================

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
5000
);

camera.position.set(0, 5, 15);

// =========================
// RENDERER
// =========================

const renderer = new THREE.WebGLRenderer({
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
renderer.domElement
);

// =========================
// LIGHTS
// =========================

const sunLight = new THREE.DirectionalLight(
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

// =========================
// SUN
// =========================

const sun = new THREE.Mesh(
new THREE.SphereGeometry(
20,
32,
32
),
new THREE.MeshBasicMaterial({
color: 0xffff00
})
);

sun.position.set(
200,
200,
-500
);

scene.add(sun);

// =========================
// GROUND
// =========================

const ground = new THREE.Mesh(

new THREE.PlaneGeometry(
2000,
5000
),

new THREE.MeshStandardMaterial({
color: 0x3cb043
})

);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// =========================
// ROAD
// =========================

const road = new THREE.Mesh(

new THREE.BoxGeometry(
20,
0.1,
4000
),

new THREE.MeshStandardMaterial({
color: 0x444444
})

);

scene.add(road);

// =========================
// ROAD MARKINGS
// =========================

const laneMarkers = [];

for(let i=0;i<200;i++){

const marker = new THREE.Mesh(

new THREE.BoxGeometry(
0.4,
0.05,
6
),

new THREE.MeshStandardMaterial({
color: 0xffffff
})

);

marker.position.set(
0,
0.06,
-i*20
);

scene.add(marker);

laneMarkers.push(marker);

}

// =========================
// PLAYER CAR
// =========================

const carGroup = new THREE.Group();

// BODY

const body = new THREE.Mesh(

new THREE.BoxGeometry(
2.5,
1,
5
),

new THREE.MeshStandardMaterial({
color: 0xff0000
})

);

body.position.y = 0.8;

carGroup.add(body);

// ROOF

const roof = new THREE.Mesh(

new THREE.BoxGeometry(
1.8,
0.8,
2.5
),

new THREE.MeshStandardMaterial({
color: 0x66ccff
})

);

roof.position.y = 1.6;

carGroup.add(roof);

// WHEELS

for(let x of [-1.4,1.4]){

for(let z of [-1.8,1.8]){

const wheel = new THREE.Mesh(

new THREE.CylinderGeometry(
0.4,
0.4,
0.4,
16
),

new THREE.MeshStandardMaterial({
color: 0x111111
})

);

wheel.rotation.z = Math.PI/2;

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

// =========================
// MOUNTAINS
// =========================

for(let i=0;i<30;i++){

const mountain = new THREE.Mesh(

new THREE.ConeGeometry(
40 + Math.random()*50,
80 + Math.random()*100,
4
),

new THREE.MeshStandardMaterial({
color: 0x666666
})

);

mountain.position.set(

-500 + Math.random()*1000,

40,

-300 - i*200

);

scene.add(mountain);

}

// =========================
// TREES
// =========================

for(let i=0;i<200;i++){

createTree(-35,-i*30);
createTree(35,-i*30);

}

function createTree(x,z){

const trunk = new THREE.Mesh(

new THREE.CylinderGeometry(
0.3,
0.4,
2
),

new THREE.MeshStandardMaterial({
color: 0x8b4513
})

);

trunk.position.set(
x,
1,
z
);

scene.add(trunk);

const leaves = new THREE.Mesh(

new THREE.ConeGeometry(
1.5,
4,
8
),

new THREE.MeshStandardMaterial({
color: 0x228b22
})

);

leaves.position.set(
x,
4,
z
);

scene.add(leaves);

}

// =========================
// CONTROLS
// =========================

const keys = {};

document.addEventListener(
'keydown',
e => keys[e.key] = true
);

document.addEventListener(
'keyup',
e => keys[e.key] = false
);

// =========================
// SPEED
// =========================

let speed = 0;

// =========================
// ANIMATION LOOP
// =========================

function animate(){

requestAnimationFrame(
animate
);

// ACCELERATION

if(speed < 2){

speed += 0.002;
}

// CAR MOVEMENT

if(keys["ArrowLeft"]){

carGroup.position.x -= 0.3;

}

if(keys["ArrowRight"]){

carGroup.position.x += 0.3;

}

// CAMERA FOLLOW

camera.position.x = carGroup.position.x;

camera.position.y = 5;

camera.position.z = carGroup.position.z + 15;

camera.lookAt(
    carGroup.position.x,
    1,
    carGroup.position.z - 40
);

// WORLD MOVEMENT


// LANE MARKERS

for(let marker of laneMarkers){

marker.position.z += speed*20;

if(marker.position.z > 100){

marker.position.z = -3900;

}

}

// LOOP ROAD


renderer.render(
scene,
camera
);

}

// =========================
// RESIZE
// =========================

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

// =========================
// START
// =========================

animate();
