import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x87ceeb);

const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

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

// ROAD

const roadGeometry =
new THREE.BoxGeometry(
20,
0.1,
200
);

const roadMaterial =
new THREE.MeshStandardMaterial({
color:0x444444
});

const road =
new THREE.Mesh(
roadGeometry,
roadMaterial
);

scene.add(road);

// CAR

const carGeometry =
new THREE.BoxGeometry(
2,
1,
4
);

const carMaterial =
new THREE.MeshStandardMaterial({
color:0xff0000
});

const car =
new THREE.Mesh(
carGeometry,
carMaterial
);

car.position.y = 0.6;

scene.add(car);

// SUNLIGHT

const light =
new THREE.DirectionalLight(
0xffffff,
3
);

light.position.set(
20,
20,
10
);

scene.add(light);

// AMBIENT LIGHT

scene.add(
new THREE.AmbientLight(
0xffffff,
2
)
);

// CAMERA

camera.position.set(
0,
8,
15
);

camera.lookAt(
0,
0,
0
);

// CONTROLS

const keys = {};

document.addEventListener(
'keydown',
e=>keys[e.key]=true
);

document.addEventListener(
'keyup',
e=>keys[e.key]=false
);

// TREES

for(let i=0;i<100;i++){

    const tree =
    new THREE.Mesh(

        new THREE.CylinderGeometry(
        0.5,
        0.5,
        5
        ),

        new THREE.MeshStandardMaterial({
        color:0x228B22
        })

    );

    tree.position.set(
        -15,
        2.5,
        -i*20
    );

    scene.add(tree);

    const tree2 = tree.clone();

    tree2.position.x = 15;

    scene.add(tree2);
}

// GAME LOOP

function animate(){

    requestAnimationFrame(
        animate
    );

    if(keys["ArrowLeft"]){

        car.position.x -= 0.2;
    }

    if(keys["ArrowRight"]){

        car.position.x += 0.2;
    }

    road.position.z += 0.5;

    renderer.render(
        scene,
        camera
    );
}

animate();
