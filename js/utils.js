/**
 * Utility functions for the Village Shopkeeper game
 */

// Calculate distance between two 3D points
function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + 
        Math.pow(point2.y - point1.y, 2) + 
        Math.pow(point2.z - point1.z, 2)
    );
}

// Show/hide UI elements
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (show) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// Create a simple texture loader with error handling
function loadTexture(path) {
    const textureLoader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        textureLoader.load(
            path,
            (texture) => resolve(texture),
            undefined,
            (error) => reject(error)
        );
    });
}

// Create basic 3D text
function createText3D(text, parameters = {}) {
    const {
        color = 0xffffff,
        size = 1,
        height = 0.2,
        curveSegments = 4,
        bevelEnabled = false,
        position = { x: 0, y: 0, z: 0 }
    } = parameters;

    const textGeometry = new THREE.TextGeometry(text, {
        font: new THREE.Font(),  // You'll need to load a font
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelEnabled: bevelEnabled
    });

    const textMaterial = new THREE.MeshPhongMaterial({ color: color });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    textMesh.position.set(position.x, position.y, position.z);
    
    return textMesh;
}

// Helper to create a standard material
function createStandardMaterial(parameters = {}) {
    const {
        color = 0xffffff,
        roughness = 0.5,
        metalness = 0.5,
        map = null
    } = parameters;

    return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        map
    });
}

// Create a simple box geometry with material
function createBox(parameters = {}) {
    const {
        width = 1,
        height = 1,
        depth = 1,
        material = createStandardMaterial(),
        position = { x: 0, y: 0, z: 0 },
        rotation = { x: 0, y: 0, z: 0 },
        castShadow = true,
        receiveShadow = true
    } = parameters;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    
    return mesh;
}

// Random number in range
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
} 