/**
 * Items creation and management for Village Shopkeeper
 */

class GameItem {
    constructor(params = {}) {
        const {
            name = 'Unknown Item',
            price = 0,
            description = '',
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 },
            scale = 1
        } = params;
        
        this.name = name;
        this.price = price;
        this.description = description;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        
        this.mesh = null;
        
        // Create the item mesh
        this.createMesh();
    }
    
    createMesh() {
        // Default implementation to be overridden
        console.error('createMesh method should be implemented by subclasses');
    }
    
    update(delta) {
        // Default update method for animations or effects
        if (this.mesh) {
            // Simple hovering animation
            this.mesh.position.y += Math.sin(Date.now() * 0.002) * 0.0005;
            this.mesh.rotation.y += 0.005;
        }
    }
}

class Potion extends GameItem {
    constructor(params = {}) {
        // Set default values for potions
        const defaults = {
            name: 'Health Potion',
            price: 5,
            description: 'Restores health points.',
            color: 0xff00ff // Magenta as seen in concept art
        };
        
        // Merge defaults with provided params
        const mergedParams = { ...defaults, ...params };
        super(mergedParams);
        
        this.color = mergedParams.color;
    }
    
    createMesh() {
        // Create a potion bottle mesh based on the concept art
        const bottleGroup = new THREE.Group();
        
        // Create the bottle body
        const bottleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        bottleGeometry.scale(1, 1.5, 1); // Make it oval-shaped
        
        // Create a glass-like material for the bottle
        const glassMaterial = createStandardMaterial({
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.3
        });
        
        const bottle = new THREE.Mesh(bottleGeometry, glassMaterial);
        bottleGroup.add(bottle);
        
        // Create the potion liquid inside
        const liquidGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        liquidGeometry.scale(1, 1.3, 1);
        
        // Create a glowing material for the liquid
        const liquidMaterial = createStandardMaterial({
            color: this.color,
            roughness: 0.2,
            metalness: 0.3,
            transparent: true,
            opacity: 0.8,
            emissive: this.color,
            emissiveIntensity: 0.5
        });
        
        const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
        bottleGroup.add(liquid);
        
        // Create the bottle neck
        const neckGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.15, 16);
        const neck = new THREE.Mesh(neckGeometry, glassMaterial);
        neck.position.y = 0.3;
        bottleGroup.add(neck);
        
        // Create the bottle cork
        const corkGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16);
        const corkMaterial = createStandardMaterial({
            color: 0x8B4513,
            roughness: 1.0
        });
        const cork = new THREE.Mesh(corkGeometry, corkMaterial);
        cork.position.y = 0.4;
        bottleGroup.add(cork);
        
        // Position and configure the bottle
        bottleGroup.position.set(
            this.position.x, 
            this.position.y, 
            this.position.z
        );
        bottleGroup.rotation.set(
            this.rotation.x, 
            this.rotation.y, 
            this.rotation.z
        );
        bottleGroup.scale.set(this.scale, this.scale, this.scale);
        
        // Setup shadow casting
        bottleGroup.traverse(function(object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        // Add user data for raycasting
        bottleGroup.userData = {
            isItem: true,
            itemType: 'potion',
            itemName: this.name,
            itemPrice: this.price
        };
        
        this.mesh = bottleGroup;
    }
}

class Sword extends GameItem {
    constructor(params = {}) {
        // Set default values for swords
        const defaults = {
            name: 'Steel Sword',
            price: 25,
            description: 'A sharp steel sword for combat.',
        };
        
        // Merge defaults with provided params
        const mergedParams = { ...defaults, ...params };
        super(mergedParams);
    }
    
    createMesh() {
        // Create a sword mesh based on the concept art
        const swordGroup = new THREE.Group();
        
        // Create the blade
        const bladeGeometry = new THREE.BoxGeometry(0.08, 0.7, 0.02);
        const bladeMaterial = createStandardMaterial({
            color: 0xC0C0C0, // Silver
            roughness: 0.2,
            metalness: 0.8
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.4;
        swordGroup.add(blade);
        
        // Create the blade tip
        const tipGeometry = new THREE.ConeGeometry(0.04, 0.15, 8);
        const tip = new THREE.Mesh(tipGeometry, bladeMaterial);
        tip.position.y = 0.825;
        tip.rotation.x = Math.PI; // Flip to point upward
        swordGroup.add(tip);
        
        // Create the crossguard
        const guardGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.05);
        const guardMaterial = createStandardMaterial({
            color: 0xFFD700, // Gold
            roughness: 0.3,
            metalness: 0.7
        });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.05;
        swordGroup.add(guard);
        
        // Create the handle
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 16);
        const handleMaterial = createStandardMaterial({
            color: 0x8B4513, // Brown
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = -0.075;
        swordGroup.add(handle);
        
        // Create the pommel
        const pommelGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const pommel = new THREE.Mesh(pommelGeometry, guardMaterial);
        pommel.position.y = -0.18;
        swordGroup.add(pommel);
        
        // Add a glow to the blade to make it magical (like the blue gem in concept)
        const edgeGeometry = new THREE.BoxGeometry(0.09, 0.72, 0.01);
        const edgeMaterial = createStandardMaterial({
            color: 0x00BFFF, // Light blue
            transparent: true,
            opacity: 0.5,
            emissive: 0x00BFFF,
            emissiveIntensity: 0.5
        });
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.y = 0.4;
        edge.position.z = 0.015; // Slightly in front of the blade
        swordGroup.add(edge);
        
        // Position and configure the sword
        swordGroup.position.set(
            this.position.x, 
            this.position.y, 
            this.position.z
        );
        swordGroup.rotation.set(
            this.rotation.x, 
            this.rotation.y, 
            this.rotation.z
        );
        swordGroup.scale.set(this.scale, this.scale, this.scale);
        
        // Setup shadow casting
        swordGroup.traverse(function(object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        // Add user data for raycasting
        swordGroup.userData = {
            isItem: true,
            itemType: 'sword',
            itemName: this.name,
            itemPrice: this.price
        };
        
        this.mesh = swordGroup;
    }
}

// Create some helper functions to generate items
function createPotionShelf(params = {}) {
    const {
        position = { x: 0, y: 0, z: 0 },
        numberOfPotions = 5,
        spacing = 0.3,
        colors = [0xff00ff, 0x00ff00, 0x0000ff, 0xff0000, 0xffff00]
    } = params;
    
    const potions = [];
    
    for (let i = 0; i < numberOfPotions; i++) {
        const xPos = position.x - (numberOfPotions - 1) * spacing / 2 + i * spacing;
        
        const potion = new Potion({
            name: `${getColorName(colors[i % colors.length])} Potion`,
            price: 5 + Math.floor(Math.random() * 10),
            color: colors[i % colors.length],
            position: { 
                x: xPos, 
                y: position.y, 
                z: position.z 
            },
            scale: 1.5
        });
        
        potions.push(potion);
    }
    
    return potions;
}

function createSword(params = {}) {
    const {
        position = { x: 0, y: 0, z: 0 },
        rotation = { x: 0, y: 0, z: 0 },
        scale = 1
    } = params;
    
    return new Sword({
        position,
        rotation,
        scale
    });
}

// Helper to get color name from hex
function getColorName(hex) {
    const colorNames = {
        0xff00ff: 'Healing',
        0x00ff00: 'Poison',
        0x0000ff: 'Mana',
        0xff0000: 'Strength',
        0xffff00: 'Speed'
    };
    
    return colorNames[hex] || 'Mystery';
} 