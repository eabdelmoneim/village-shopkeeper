# Medieval Village Scene Design (Three.js)

This document outlines the steps for creating a 3D scene in Three.js where the player interacts with a shopkeeper in a medieval village. The scene will include:
- A village layout.
- Shopkeeper character.
- Player character.
- Negotiation interaction.

## Getting Started

### Prerequisites
1. Install Three.js: `npm install three @types/three`.
2. Set up HTML file structure for Three.js scene.
3. Add necessary scripts (e.g., OrbitControls, Hammer.js for gestures).

---

## Scene Breakdown

### 1. **Scene Setup**
- **Load Three.js**: Include Three.js and OrbitControls in the HTML head.
- **Set up basic lighting**: Ambient light for background and directional lights for shop buildings.
- **Create a village grid**: Use a grid system to place buildings, walls, and terrain.

#### Example Code:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Medieval Village</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hammer@0.7.2/dist/hammer.min.js"></script>
</head>
<body>
    <div id="controls">
        <button id="buy">Buy Sword (Space)</button>
    </div>

    <script>
        // Initialize scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.set(10, 10, 10);

        // Load textures for village walls and roof tiles
        const wallTexture = new THREE.TextureLoader().load("wall.jpg");
        const tileTexture = new THREE.TextureLoader().load("tile.jpg");

        // Create grid system for village layout
        function createVillage() {
            const gridHelper = new THREE.GridHelper(50, 50, 2, 2);
            scene.add(gridHelper);

            // Create buildings and walls
            function createBuilding(x, y) {
                const building = [];
                for (let i = 0; i < 3; i++) {
                    const wall = createWall(x * 5, y * 5, 1);
                    building.push(...wall);
                }
                return building;
            }

            function createWall(x, y, type) {
                // Wall geometry using box geometry
                const geometry = new THREE.BoxGeometry(2, 4, 0.25);
                const material = new THREE.MeshPhongMaterial({ map: wallTexture });
                const wall = new THREE.Mesh(geometry, material);
                wall.position.set(x * 1, y * 1, 0);
                return [wall];
            }

            // Create tiled roof
            function createRoof(x, y) {
                const geometry = new THREE.PlaneGeometry(2, 1.5, 8, 8);
                const material = new THREE.MeshPhongMaterial({ map: tileTexture });
                const roof = new THREE.Mesh(geometry, material);
                roof.rotation.x = -Math.PI / 2;
                roof.position.set(x * 1, y * 1, 2);
                return [roof];
            }

            // Add buildings
            for (let i = 0; i < 10; i++) {
                createBuilding(i, i);
            }
        }

        createVillage();

        // Add camera controls
        camera.addEventlistener("pointermove", function(event) {
            camera.position.x += event.offsetX * 0.01;
            camera.position.y += event.offsetY * 0.01;
        });

        // Add Hammer.js for mobile touch events
        const hammer = new Hammer(camera);
        hammer.get('pinch-to-zoom').enable();
    </script>
</body>
</html>
```

---

### 2. **Shopkeeper Character**
- **Model**: Use a simple 3D model of a shopkeeper (e.g., a capsule shape).
- **Animations**: Add idle animation and response when the player approaches.

#### Example Code:
```javascript
// Shopkeeper character
function createShopkeeper() {
    const geometry = new THREE.BoxGeometry(1.5, 2, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0x008B8B });
    const shopkeeper = new THREE.Mesh(geometry, material);
    shopkeeper.position.set(5, 5, 0);
    shopkeeper.castShadow = true;
    shopkeeper.receiveShadow = true;

    // Add idle animation
    const animationId = anime({
        loops: Infinity,
        duration: 2,
        easing: "easeInOutQuad",
        start() {
            shopkeeper.rotation.y = 0;
        },
        update() {
            shopkeeper.rotation.y += 0.02;
        }
    });

    return { mesh: shopkeeper, animationId };
}

// Add shopkeeper to scene
const { mesh, animationId } = createShopkeeper();
scene.add(mesh);
anime.remove(animationId);
```

---

### 3. **Player Character**
- **Model**: Use a simple character model (e.g., capsule or stick figure).
- **Animations**: Walk and approach animations.

#### Example Code:
```javascript
// Player character
function createPlayer() {
    const geometry = new THREE.BoxGeometry(0.8, 1.5, 0.4);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const player = new THREE.Mesh(geometry, material);
    player.position.set(0, 0.5, 0);
    player.castShadow = true;
    player.receiveShadow = true;

    // Add walk animation
    const animationId = anime({
        loops: Infinity,
        duration: 2,
        easing: "easeInOutQuad",
        start() {
            player.rotation.y = 0;
        },
        update() {
            player.rotation.y += 0.02;
        }
    });

    return { mesh: player, animationId };
}

// Add player to scene
const { mesh: playerMesh, animationId } = createPlayer();
scene.add(playerMesh);
anime.remove(animationId);
```

---

### 4. **Interaction System**
- **Pointer Events**: Track mouse and touch events for object selection.
- **Distance Calculation**: Calculate the distance between the player and shopkeeper to trigger interaction.

#### Example Code:
```javascript
// Interaction logic
let isInteracting = false;

// Update camera position
camera.addEventlistener("pointermove", function(event) {
    camera.position.x += event.offsetX * 0.01;
    camera.position.y += event.offsetY * 0.01;
});

// Add click/tap event listener
const clickHandler = new Hammer.Instances.DailyPress();
clickHandler.get('single-tap').enable();

clickHandler.addEventlistener(function(event) {
    // Check if player is close enough to shopkeeper
    const distance = calculateDistance(playerMesh.position, shopkeeper.position);

    if (distance < 2) {
        // Trigger negotiation
        showPrice(10); // Example: sword costs 10 coins
    }
});

function calculateDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) + 
        Math.pow(pos2.y - pos1.y, 2) +
        Math.pow(pos2.z - pos1.z, 2)
    );
}
```

---

### 5. **UI Elements**
- **Price Display**: Show the cost of the sword using a dynamic UI element.

#### Example Code:
```javascript
// Add buy button functionality
document.getElementById('buy').addEventListener('click', function() {
    if (isInteracting) {
        alert('You already clicked! Try again...');
    }
});

function showPrice(price) {
    const priceDisplay = document.createElement('div');
    priceDisplay.textContent = `Sword: ${price} coins`;
    document.body.appendChild(priceDisplay);
    
    setTimeout(function() {
        priceDisplay.remove();
    }, 2000);
}
```

---

### 6. **Sound Effects**
- **Click Sound**: Add a sound effect when the player clicks on the shopkeeper.

#### Example Code:
```html
<audio id="clickSound" src="https://www.soundjay.com button/01.mp3"></audio>
<script>
const clickSound = document.getElementById('clickSound');
    
// Trigger sound on click
clickHandler.addEventlistener(function(event) {
    if (distance < 2) {
        clickSound.play();
        showPrice(10);
    }
});
</script>
```

---

### 7. **Polishing**
- **Shadows**: Add shadows to all characters and objects for better visualization.
- **Lighting**: Position lights at the right angle to make the scene look more realistic.

#### Example Code:
```javascript
// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Add directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);
```

---

### 8. **Testing**
- **Debug Logs**: Use console.log for debugging.
- **Check Interactions**: Ensure the player can click on the shopkeeper to see the price.

#### Example:
```javascript
console.log('Shopkeeper position:', shopkeeper.position);
console.log('Player position:', playerMesh.position);
```

---

### 9. **Finalization**
- **Optimization**: Remove unnecessary animations and reduce poly count where possible.
- **Mobile Testing**: Test on mobile devices to ensure touch events work.