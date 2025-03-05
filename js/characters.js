/**
 * Character creation and management for Village Shopkeeper
 */

class Character {
    constructor(params = {}) {
        this.mesh = null;
        this.animations = {};
        this.currentAnimation = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        // Create the character
        this.createCharacter(params);
    }
    
    createCharacter(params) {
        // Default implementation to be overridden
        console.error('createCharacter method should be implemented by subclasses');
    }
    
    update(delta) {
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}

class Shopkeeper extends Character {
    constructor() {
        super();
        
        // Shopkeeper-specific properties
        this.interactionRadius = 3;
        this.isTalking = false;
    }
    
    createCharacter() {
        // Create a simple shopkeeper character based on the concept art
        // In the concept art, the shopkeeper has a beard and is behind the counter
        
        // Create a group to hold all parts of the shopkeeper
        const shopkeeperGroup = new THREE.Group();
        shopkeeperGroup.position.set(5, 1, 4.5);
        
        // Create the head
        const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const headMaterial = createStandardMaterial({
            color: 0xF5DEB3, // Skin tone
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.8;
        shopkeeperGroup.add(head);
        
        // Create the body/torso
        const torsoGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8);
        const torsoMaterial = createStandardMaterial({
            color: 0x8B4513, // Brown for clothing
            roughness: 0.8
        });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 1.3;
        shopkeeperGroup.add(torso);
        
        // Create the arms
        const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        const armMaterial = createStandardMaterial({
            color: 0xF5DEB3, // Skin tone
            roughness: 0.7
        });
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 1.3, 0);
        leftArm.rotation.z = -Math.PI / 3; // Angle the arm
        shopkeeperGroup.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 1.3, 0);
        rightArm.rotation.z = Math.PI / 3; // Angle the arm
        shopkeeperGroup.add(rightArm);
        
        // Create the beard (as seen in concept art)
        const beardGeometry = new THREE.ConeGeometry(0.25, 0.4, 8);
        const beardMaterial = createStandardMaterial({
            color: 0x4A412A, // Dark brown
            roughness: 1.0
        });
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, 1.6, 0.15);
        beard.rotation.x = Math.PI / 3; // Angle the beard
        shopkeeperGroup.add(beard);
        
        // Create eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = createStandardMaterial({
            color: 0x000000, // Black
            roughness: 0.5
        });
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 1.85, 0.25);
        shopkeeperGroup.add(leftEye);
        
        // Right eye
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 1.85, 0.25);
        shopkeeperGroup.add(rightEye);
        
        // Set up shadow casting for all parts
        shopkeeperGroup.traverse(function(object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        // Set up animation for the shopkeeper
        this.setupIdleAnimation(shopkeeperGroup);
        
        this.mesh = shopkeeperGroup;
        // Set userData for raycasting interactions
        this.mesh.userData = { 
            isCharacter: true,
            characterType: 'shopkeeper'
        };
    }
    
    setupIdleAnimation(shopkeeperGroup) {
        // Create a simple bobbing animation for the shopkeeper
        const animationClip = {
            duration: 2,
            isRunning: true,
            startTime: 0,
            update: (time) => {
                const sinValue = Math.sin(time * 2) * 0.05;
                shopkeeperGroup.position.y = 1 + sinValue;
                
                // Also slightly rotate back and forth
                shopkeeperGroup.rotation.y = Math.sin(time) * 0.1;
            }
        };
        
        this.animations.idle = animationClip;
        this.currentAnimation = 'idle';
    }
    
    update(delta) {
        super.update(delta);
        
        // Update custom animations
        if (this.currentAnimation && this.animations[this.currentAnimation]) {
            const animation = this.animations[this.currentAnimation];
            animation.startTime += delta;
            animation.update(animation.startTime);
        }
    }
    
    talk() {
        this.isTalking = true;
        // Could add talking animation or sound here
        
        // Return to idle after a short delay
        setTimeout(() => {
            this.isTalking = false;
        }, 2000);
    }
}

class Player extends Character {
    constructor() {
        super();
        
        // Player-specific properties
        this.speed = 5;
        this.isMoving = false;
        this.targetPosition = new THREE.Vector3();
    }
    
    createCharacter() {
        // Create a knight player character based on the concept art
        // In the concept art, the knight has armor and a cape
        
        // Create a group to hold all parts of the player
        const playerGroup = new THREE.Group();
        playerGroup.position.set(0, 1, 0);
        
        // Create the armored body
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 8);
        const armorMaterial = createStandardMaterial({
            color: 0x808080, // Silver/gray for armor
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, armorMaterial);
        body.position.y = 0.6;
        playerGroup.add(body);
        
        // Create the helmet
        const helmetGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const helmet = new THREE.Mesh(helmetGeometry, armorMaterial);
        helmet.position.y = 1.4;
        playerGroup.add(helmet);
        
        // Create the knight's visor
        const visorGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.15);
        const visorMaterial = createStandardMaterial({
            color: 0x000000, // Black
            roughness: 0.5
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.set(0, 1.42, 0.2);
        playerGroup.add(visor);
        
        // Create the cape as seen in concept
        const capeGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        const capeMaterial = createStandardMaterial({
            color: 0x4169E1, // Royal blue
            roughness: 1.0,
            side: THREE.DoubleSide
        });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 0.9, -0.3);
        cape.rotation.x = Math.PI / 12; // Slight angle
        playerGroup.add(cape);
        
        // Create the legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, armorMaterial);
        leftLeg.position.set(-0.2, 0, 0);
        playerGroup.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, armorMaterial);
        rightLeg.position.set(0.2, 0, 0);
        playerGroup.add(rightLeg);
        
        // Create the arms
        const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeometry, armorMaterial);
        leftArm.position.set(-0.4, 0.8, 0);
        leftArm.rotation.z = -Math.PI / 6; // Angle the arm
        playerGroup.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, armorMaterial);
        rightArm.position.set(0.4, 0.8, 0);
        rightArm.rotation.z = Math.PI / 6; // Angle the arm
        playerGroup.add(rightArm);
        
        // Set up shadow casting for all parts
        playerGroup.traverse(function(object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        this.mesh = playerGroup;
        // Set userData for raycasting interactions
        this.mesh.userData = { 
            isCharacter: true,
            characterType: 'player'
        };
    }
    
    moveTo(targetPosition) {
        this.isMoving = true;
        this.targetPosition.copy(targetPosition);
        this.targetPosition.y = this.mesh.position.y; // Keep the same height
    }
    
    update(delta) {
        super.update(delta);
        
        // Handle movement if the player is moving
        if (this.isMoving) {
            const direction = new THREE.Vector3().subVectors(
                this.targetPosition, 
                this.mesh.position
            ).normalize();
            
            // Calculate distance to target
            const distance = this.mesh.position.distanceTo(this.targetPosition);
            
            if (distance > 0.1) {
                // Move towards target
                this.mesh.position.add(
                    direction.multiplyScalar(this.speed * delta)
                );
                
                // Face the direction of movement
                this.mesh.lookAt(
                    this.targetPosition.x,
                    this.mesh.position.y,
                    this.targetPosition.z
                );
            } else {
                // Reached destination
                this.isMoving = false;
            }
        }
    }
} 