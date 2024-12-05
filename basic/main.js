import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// 1. Create the scene
const scene = new THREE.Scene();

// 2. Add video as the background
const video = document.createElement('video');
video.src = 'space.mp4'; // Replace with the correct path to your video
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture;

// 3. Add the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 4. Add a directional light
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(1, 1, 1);
scene.add(light);

// 5. Add a world map texture to a sphere
const textureLoader = new THREE.TextureLoader();
const worldTexture = textureLoader.load('earth.jpg'); // Replace with the path to your texture image
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: worldTexture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 6. Load the Suissnord font and add text
const fontLoader = new FontLoader();
fontLoader.load('suissnord.json', (font) => {
    // Create text geometry
    const textGeometry = new TextGeometry('TEN . DEV', {
        font: font,
        size: 0.5, // Adjust text size
        height: 0.1, // Extrusion depth
        curveSegments: 12, // Smoothness of curves
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    // Load metallic texture (optional: replace with your own texture file)
    const metalTexture = textureLoader.load('metal_texture.jpg'); // Replace with path to a metallic texture file

    // Apply material to the text with metallic properties
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,      // Base color for the text (light gray for metallic effect)
        metalness: 1,         // Full metallic effect
        roughness: 0.2,       // Slight roughness to give it a realistic shine
        map: metalTexture,    // Apply the metal texture to the text (optional)
        emissive: 0x111111,   // Slight emissive effect to make it glow a little
        transparent: true,    // Transparency for shiny reflection effect
        opacity: 1,           // Full opacity (no transparency effect)
        depthWrite: false     // No depth writing to prevent background from appearing behind
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position the text
    textMesh.position.set(-2, 2, 0); // Adjust as needed
    scene.add(textMesh);
});

// 7. Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 8. Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere like a planet
    sphere.rotation.y += 0.002;

    renderer.render(scene, camera);
}
animate();

// 9. Adjust renderer on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
