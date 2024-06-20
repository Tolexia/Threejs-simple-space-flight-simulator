import * as THREE from 'three' 
import gsap from 'gsap';

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
camera.position.set(0, 10, -1000);
camera.lookAt(0,0,0)
let init = false;

/**
 * Light (optionnal if MeshBasicMaterial but mandatory if material depending on light, like MeshStandardMaterial)
 */
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
light.intensity = 200
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(sun_direction.x, sun_direction.y, sun_direction.z)
light.intensity = 20
scene.add( directionalLight );


/**
 * Particles (Stars)
 */
const point_count = 50000
const universe_radius = 5000
const position_buffer = new Float32Array(point_count * 3)

// Setting Stars Positions in the universe
for (let index = 0; index < point_count; index++) 
{
	let i = index * 3

	const x = universe_radius * Math.random() - (universe_radius/2);
	const y = universe_radius * Math.random() - (universe_radius/2);
	let z = universe_radius * Math.random() - (universe_radius/2);

	if(z < 100 && z > -100) z -= 200
	
	position_buffer[i + 0] = x
	position_buffer[i + 1] = y
	position_buffer[i + 2] = z
	
}

const particles_geometry = new THREE.BufferGeometry();
particles_geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position_buffer, 3 ) );

const particles_material = new THREE.PointsMaterial( { 
	color: 0xFFFFFF,
	alphaTest: 0.5, 
	sizeAttenuation: true,
	transparent: true
} );

const particles = new THREE.Points( particles_geometry, particles_material );
scene.add( particles );


/**
 * Spaceship
 */
const spaceship_geometry = new THREE.BoxGeometry(10,10,10)
const spaceship_material = new THREE.MeshBasicMaterial()
const spaceship = new THREE.Mesh(spaceship_geometry, spaceship_material)

scene.add(spaceship)

spaceship.add( camera );

// Animation from far rear to close rear
gsap.to(camera.position, {
	duration:4,
	z: -50,
	ease:"power4.out", 
	onComplete: () => init=true
})

/**
 * Flight Simulation with Arrow Keys, Space (forward) and Ctrl (backward)
 */
let gettin_up = false
let gettin_down = false
let gettin_left = false
let gettin_right = false
let gettin_forwards = false
let gettin_backwards = false

document.body.addEventListener('keydown', e => {

	if(!spaceship) return;

	if(e.key == "ArrowUp" && !gettin_down) {
		gettin_down = true
		down()
	}
	if(e.key == "ArrowLeft" && !gettin_left) {
		gettin_left = true
		left()
	}
	if(e.key == "ArrowRight" && !gettin_right) {
		gettin_right = true
		right()
	}
	if(e.key == "ArrowDown" && !gettin_up) {
		gettin_up = true
		up()
	}
	if(e.code == "Space" && !gettin_forwards) {
		gettin_forwards = true
		forward()
	}
	if(e.key == "Control" && !gettin_backwards) {
		gettin_backwards = true
		backward()
	}
})

function up()
{
	spaceship.rotateOnAxis(new THREE.Vector3(-1,0,0),0.01) 
	if(gettin_up)requestAnimationFrame(up)
}
function down()
{
	spaceship.rotateOnAxis(new THREE.Vector3(1,0,0),0.01) 
	if(gettin_down)requestAnimationFrame(down)
}
function left()
{
	spaceship.rotation.z -= 0.025
	if(!gettin_up && !gettin_down)camera.rotateOnAxis(new THREE.Vector3(0,0,-1),0.025)
	if(gettin_left)requestAnimationFrame(left)
}
function right()
{
	spaceship.rotation.z += 0.025
	if(!gettin_up && !gettin_down)camera.rotateOnAxis(new THREE.Vector3(0,0,1),0.025)
	if(gettin_right)requestAnimationFrame(right)
}
function forward()
{
	const speedFactor = 1.0;
	const direction = new THREE.Vector3();
	spaceship.getWorldDirection(direction);
	spaceship.position.add(direction.multiplyScalar(speedFactor));

	if(gettin_forwards)requestAnimationFrame(forward)
}
function backward()
{
	const speedFactor = -1.0;
	const direction = new THREE.Vector3();
	spaceship.getWorldDirection(direction);
	spaceship.position.add(direction.multiplyScalar(speedFactor));

	if(gettin_backwards)requestAnimationFrame(backward)
}

document.body.addEventListener('keyup', e => {

	if(!spaceship) return;

	if(e.key == "ArrowUp") {
		gettin_down = false
	}
	if(e.key == "ArrowLeft") {
		gettin_left = false
	}
	if(e.key == "ArrowRight") {
		gettin_right = false
	}
	if(e.key == "ArrowDown") {
		gettin_up = false
	}
	if(e.code == "Space") {
		gettin_forwards = false
	}
	if(e.key == "Control") {
		gettin_backwards = false
	}
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/**
 * Handling Resize
 */
window.addEventListener('resize', function(e) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
})


/**
 * Animation Loop
 */
function animate() {
	
    renderer.render( scene, camera );

}
renderer.setAnimationLoop( animate );

