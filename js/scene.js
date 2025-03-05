/**
 * Scene setup and management for Village Shopkeeper
 */

class GameScene {
    constructor() {
        // Core Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Camera controls
        this.controls = null;
        
        // Game objects
        this.shopkeeper = null;
        this.player = null;
        this.shop = null;
        this.street = null;
        this.items = {};
        
        // State
        this.isInteracting = false;
        this.selectedObject = null;
        this.clock = new THREE.Clock();
        
        // Raycaster for mouse interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Initialize the scene
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // Setup camera
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Setup lighting
        this.setupLights();
        
        // Create environment
        this.createStreet();
        this.createShop();
        
        // Setup event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
        
        // Start the animation loop
        this.animate();
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
        
        // Point light for the shop
        const shopLight = new THREE.PointLight(0xf5c542, 1, 15);
        shopLight.position.set(5, 5, 5);
        shopLight.castShadow = true;
        this.scene.add(shopLight);
    }
    
    createStreet() {
        // Create ground/street
        const textureLoader = new THREE.TextureLoader();
        
        // Create a stone texture for the street
        const streetGeometry = new THREE.PlaneGeometry(50, 50);
        const streetMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xaaaaaa,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.street = new THREE.Mesh(streetGeometry, streetMaterial);
        this.street.rotation.x = -Math.PI / 2;
        this.street.receiveShadow = true;
        this.scene.add(this.street);
        
        // Add street details
        this.addStoneDetails();
    }
    
    addStoneDetails() {
        // Add some random stones to make the street look more detailed
        for (let i = 0; i < 150; i++) {
            const size = randomInRange(0.2, 0.8);
            const posX = randomInRange(-25, 25);
            const posZ = randomInRange(-25, 25);
            
            const stoneGeometry = new THREE.BoxGeometry(size, 0.05, size);
            const stoneMaterial = new THREE.MeshStandardMaterial({
                color: randomInRange(0x888888, 0xaaaaaa),
                roughness: 1.0
            });
            
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.set(posX, 0.025, posZ);
            stone.receiveShadow = true;
            
            this.scene.add(stone);
        }
    }
    
    createShop() {
        // Create shop with wooden structure as seen in the concept art
        const shopGroup = new THREE.Group();
        shopGroup.position.set(5, 0, 5);
        
        // Shop base/floor
        const baseGeometry = new THREE.BoxGeometry(8, 0.5, 6);
        const baseMaterial = createStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        const shopBase = new THREE.Mesh(baseGeometry, baseMaterial);
        shopBase.position.y = 0.25;
        shopBase.castShadow = true;
        shopBase.receiveShadow = true;
        shopGroup.add(shopBase);
        
        // Shop walls
        const wallMaterial = createStandardMaterial({ 
            color: 0xA0522D,
            roughness: 0.7
        });
        
        // Back wall
        const backWallGeometry = new THREE.BoxGeometry(8, 3, 0.3);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.set(0, 2, -3);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        shopGroup.add(backWall);
        
        // Side walls
        const sideWallGeometry = new THREE.BoxGeometry(0.3, 3, 6);
        
        const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        leftWall.position.set(-4, 2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        shopGroup.add(leftWall);
        
        const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        rightWall.position.set(4, 2, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        shopGroup.add(rightWall);
        
        // Counter
        const counterGeometry = new THREE.BoxGeometry(7, 1.2, 1.5);
        const counterMaterial = createStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.6
        });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 1.1, 2);
        counter.castShadow = true;
        counter.receiveShadow = true;
        shopGroup.add(counter);
        
        // Awning/canopy
        const canopyGeometry = new THREE.BoxGeometry(8, 0.1, 3);
        const canopyMaterial = createStandardMaterial({ 
            color: 0xFF6347, // Red striped awning as in concept
            roughness: 0.5
        });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 3.5, 1);
        canopy.castShadow = true;
        shopGroup.add(canopy);
        
        // Canopy supports
        const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        const supportMaterial = createStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.7
        });
        
        const leftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        leftSupport.position.set(-3.5, 3.2, 2.5);
        shopGroup.add(leftSupport);
        
        const rightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        rightSupport.position.set(3.5, 3.2, 2.5);
        shopGroup.add(rightSupport);
        
        // Create shelves for potions as seen in concept art
        this.createShelves(shopGroup);
        
        this.shop = shopGroup;
        this.scene.add(shopGroup);
    }
    
    createShelves(shopGroup) {
        // Add shelves on the back wall for potions
        const shelfMaterial = createStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.7
        });
        
        // Create three shelves
        for (let i = 0; i < 3; i++) {
            const shelfGeometry = new THREE.BoxGeometry(6, 0.2, 1);
            const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
            shelf.position.set(0, 1.5 + i * 0.8, -2.5);
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            shopGroup.add(shelf);
        }
    }
    
    onWindowResize() {
        // Update camera and renderer on window resize
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        // Calculate mouse position for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onClick(event) {
        // Cast ray from mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections with interactive objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            // Check if we clicked on a specific object
            const clickedObject = intersects[0].object;
            
            // Handle different object interactions here
            if (clickedObject === this.shopkeeper) {
                this.handleShopkeeperInteraction();
            } else if (clickedObject.userData.isItem) {
                this.handleItemInteraction(clickedObject);
            }
        }
    }
    
    handleShopkeeperInteraction() {
        // Show the interaction panel for the shopkeeper
        toggleElement('interaction-panel', true);
        this.isInteracting = true;
    }
    
    handleItemInteraction(item) {
        console.log(`Clicked on item: ${item.userData.itemName}`);
        // Handle item interaction logic
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update controls
        this.controls.update();
        
        // Update character animations if any
        const delta = this.clock.getDelta();
        if (this.player && this.player.update) {
            this.player.update(delta);
        }
        if (this.shopkeeper && this.shopkeeper.update) {
            this.shopkeeper.update(delta);
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    
    // Method to add characters
    addCharacter(character, type) {
        if (type === 'shopkeeper') {
            this.shopkeeper = character;
        } else if (type === 'player') {
            this.player = character;
        }
        this.scene.add(character);
    }
    
    // Method to add items
    addItem(item, name) {
        this.items[name] = item;
        this.scene.add(item);
    }
} 