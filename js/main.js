/**
 * Main entry point for Village Shopkeeper
 */

// Add notification styles to our CSS
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(51, 25, 0, 0.85);
        color: #FFD700;
        padding: 10px 20px;
        border-radius: 5px;
        border: 2px solid #8B4513;
        z-index: 1000;
        transition: opacity 0.5s;
    }
    
    .fade-out {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game scene
    const gameScene = new GameScene();
    
    // Create shopkeeper
    const shopkeeper = new Shopkeeper();
    gameScene.addCharacter(shopkeeper.mesh, 'shopkeeper');
    
    // Create player character
    const player = new Player();
    gameScene.addCharacter(player.mesh, 'player');
    
    // Add potions to shelves
    // Create potions on each shelf (as seen in concept art)
    for (let i = 0; i < 3; i++) {
        const shelfY = 1.5 + i * 0.8; // Match shelf positions from scene.js
        const potions = createPotionShelf({
            position: { x: 5, y: shelfY, z: 2.5 }, // Positions relative to shop
            numberOfPotions: 5 - i, // Fewer potions on higher shelves
            colors: [0xff00ff, 0x00ff00, 0x0000ff, 0xff0000, 0xffff00]
        });
        
        // Add each potion to the scene
        potions.forEach(potion => {
            gameScene.addItem(potion.mesh, potion.name);
        });
    }
    
    // Add swords on display
    const displaySword = createSword({
        position: { x: 5, y: 2, z: 6 }, // In front of the shop counter
        rotation: { x: 0, y: 0, z: -Math.PI / 4 }, // Angled display
        scale: 2 // Larger for display
    });
    gameScene.addItem(displaySword.mesh, 'Display Sword');
    
    // Add a sword in a container
    const swordInBox = createSword({
        position: { x: 7, y: 1, z: 5 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 }, // Lying flat
        scale: 1.5
    });
    gameScene.addItem(swordInBox.mesh, 'Boxed Sword');
    
    // Add floating gem/crystal as seen in concept
    const crystalGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const crystalMaterial = createStandardMaterial({
        color: 0x00BFFF,
        transparent: true,
        opacity: 0.7,
        emissive: 0x00BFFF,
        emissiveIntensity: 0.5
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set(5, 1.5, 4);
    crystal.userData = {
        isItem: true,
        itemType: 'crystal',
        itemName: 'Magic Crystal',
        itemPrice: 50
    };
    
    // Add a simple animation to the crystal
    const crystalAnimation = {
        update: (delta) => {
            crystal.rotation.y += 0.01;
            crystal.position.y = 1.5 + Math.sin(Date.now() * 0.001) * 0.2;
        }
    };
    
    // Create update function for the crystal
    function updateCrystal() {
        crystalAnimation.update(0.016); // ~ 60fps
        requestAnimationFrame(updateCrystal);
    }
    
    // Start crystal animation
    updateCrystal();
    
    gameScene.addItem(crystal, 'Magic Crystal');
    
    // Setup interaction handlers
    const interactions = new GameInteractions(gameScene);
    
    // Override the click handler in the GameScene to use our interaction manager
    gameScene.onClick = function(event) {
        // Cast ray from mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections with scene objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            // Get the first intersected object
            const intersectedObject = intersects[0].object;
            
            // Get the top-level parent if it's part of a group
            let targetObject = intersectedObject;
            while (targetObject.parent && targetObject.parent !== this.scene) {
                targetObject = targetObject.parent;
            }
            
            // Try to handle as an object click first
            if (interactions.handleObjectClick(targetObject)) {
                return;
            }
            
            // If not handled as object, treat as ground click for movement
            interactions.handleGroundClick(intersects[0].point);
        }
    };
    
    // Add keyboard controls for the player
    document.addEventListener('keydown', function(event) {
        const moveSpeed = 0.5;
        let moveDirX = 0;
        let moveDirZ = 0;
        
        switch(event.key) {
            case 'w':
            case 'ArrowUp':
                moveDirZ = -moveSpeed;
                break;
            case 's':
            case 'ArrowDown':
                moveDirZ = moveSpeed;
                break;
            case 'a':
            case 'ArrowLeft':
                moveDirX = -moveSpeed;
                break;
            case 'd':
            case 'ArrowRight':
                moveDirX = moveSpeed;
                break;
            case 'e':
                // Interact with nearby objects
                if (gameScene.shopkeeper) {
                    const distance = calculateDistance(
                        player.mesh.position,
                        gameScene.shopkeeper.position
                    );
                    
                    if (distance < 3) {
                        interactions.startShopkeeperInteraction();
                    }
                }
                break;
        }
        
        if (moveDirX !== 0 || moveDirZ !== 0) {
            const targetPos = new THREE.Vector3(
                player.mesh.position.x + moveDirX,
                player.mesh.position.y,
                player.mesh.position.z + moveDirZ
            );
            player.moveTo(targetPos);
        }
    });
    
    // Listen for window resize
    window.addEventListener('resize', function() {
        gameScene.onWindowResize();
    });
    
    // Display instructions
    const instructions = document.createElement('div');
    instructions.style.position = 'absolute';
    instructions.style.bottom = '20px';
    instructions.style.left = '20px';
    instructions.style.color = 'white';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructions.style.padding = '10px';
    instructions.style.borderRadius = '5px';
    instructions.innerHTML = `
        <h3>Controls:</h3>
        <p>Move: WASD or Arrow Keys</p>
        <p>Interact: E or Click on objects</p>
        <p>Camera: Click and drag to rotate, scroll to zoom</p>
    `;
    document.body.appendChild(instructions);
}); 