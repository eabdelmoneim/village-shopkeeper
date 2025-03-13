/**
 * Interaction handling for Village Shopkeeper
 */

class GameInteractions {
    constructor(options) {
        // Extract options
        this.shopkeeper = options.shopkeeper || null;
        this.scene = options.scene || null;
        this.camera = options.camera || null;
        
        // Initialize state
        this.currentInteraction = null;
        this.shopItems = [];
        this.playerCoins = 100; // Starting money
        this.inventory = [];
        this.userAddress = ''; // Store the user's address
        this.preloadedGreeting = null; // Store preloaded greeting
        this.isPreloadingGreeting = false; // Flag to track if preloading is in progress
        
        // Set up UI event listeners
        this.setupUIListeners();
    }
    
    // Set the user's address (called from initializeScene after welcome screen)
    setUserAddress(address) {
        this.userAddress = address;
        console.log('User address set in interactions:', this.userAddress);
        
        // Start preloading the greeting as soon as we have an address
        this.preloadInitialGreeting();
    }
    
    // Preload the initial greeting in the background
    async preloadInitialGreeting() {
        if (this.isPreloadingGreeting || this.preloadedGreeting) {
            return; // Already preloading or preloaded
        }
        
        this.isPreloadingGreeting = true;
        console.log('Preloading initial greeting in the background');
        
        try {
            // Configure API url
            const API_URL = window.ENV?.API_URL || 'http://localhost:3001/api';
            
            // Create the message payload
            const payload = {
                messages: [
                    { role: "user", content: "I've just entered your shop for the first time. Greet me!" }
                ],
                userAddress: this.userAddress // Include the user's address
            };
            
            console.log('Sending background initial greeting request to API:', payload);
            
            // Make the API call
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received preloaded greeting from API:', data);
            
            // Store the preloaded greeting
            this.preloadedGreeting = data.response;
            console.log('Initial greeting preloaded successfully');
        } catch (error) {
            console.error('Error preloading initial greeting:', error);
            // We don't set a fallback here, we'll handle that in getInitialGreeting if needed
        } finally {
            this.isPreloadingGreeting = false;
        }
    }
    
    setupUIListeners() {
        // View items button
        document.getElementById('view-items-btn').addEventListener('click', () => {
            this.showShopItems();
        });
        
        // Close interaction panel button
        document.getElementById('close-btn').addEventListener('click', () => {
            this.closeInteraction();
        });
        
        // Buy buttons (using event delegation)
        document.getElementById('shop-items').addEventListener('click', (event) => {
            if (event.target.classList.contains('buy-btn')) {
                const itemElement = event.target.closest('.item');
                if (itemElement) {
                    const itemType = itemElement.dataset.item;
                    this.buyItem(itemType);
                }
            }
        });
    }
    
    // Call the API to get the initial greeting or use preloaded greeting
    async getInitialGreeting() {
        // First check if there's a global preloaded greeting
        if (window.preloadedShopkeeperGreeting) {
            console.log('Using globally preloaded greeting');
            const greeting = window.preloadedShopkeeperGreeting;
            window.preloadedShopkeeperGreeting = null; // Clear it so it's used only once
            return greeting;
        }
        
        // If we already have a preloaded greeting
        if (this.preloadedGreeting) {
            console.log('Using preloaded greeting');
            const greeting = this.preloadedGreeting;
            this.preloadedGreeting = null; // Clear it so it's used only once
            return greeting;
        }
        
        // If preloading is in progress, wait for it to complete
        if (this.isPreloadingGreeting) {
            console.log('Waiting for preloading to complete...');
            
            // Wait for preloading to finish (up to 5 seconds)
            for (let i = 0; i < 50; i++) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
                
                if (!this.isPreloadingGreeting) {
                    // Preloading finished
                    if (this.preloadedGreeting) {
                        console.log('Preloading completed while waiting');
                        const greeting = this.preloadedGreeting;
                        this.preloadedGreeting = null; // Clear it so it's used only once
                        return greeting;
                    }
                    break; // Preloading finished but no greeting available
                }
            }
            
            console.log('Timed out waiting for preloaded greeting');
        }
        
        // If we get here, either preloading failed or wasn't started
        try {
            // Configure API url
            const API_URL = window.ENV?.API_URL || 'http://localhost:3001/api';
            
            // Create the message payload
            const payload = {
                messages: [
                    { role: "user", content: "I've just entered your shop for the first time. Greet me!" }
                ],
                userAddress: this.userAddress // Include the user's address
            };
            
            console.log('Sending initial greeting request to API:', payload);
            
            // Make the API call
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received initial greeting from API:', data);
            
            return data.response;
        } catch (error) {
            console.error('Error getting initial greeting:', error);
            // Return a fallback greeting if the API call fails
            return `Greetings ${this.userAddress.toLowerCase().endsWith('.eth') ? this.userAddress.split('.')[0] : "traveler"}! I have potions and weapons for sale. Would you like to see my wares?`;
        }
    }
    
    async startShopkeeperInteraction() {
        // Show loading state
        toggleElement('interaction-panel', true);
        document.getElementById('dialog-text').textContent = "...";
        
        // Get personalized greeting from API
        const greeting = await this.getInitialGreeting();
        
        // Update dialog text with the API response
        document.getElementById('dialog-text').textContent = greeting;
        
        // Hide shop items initially
        toggleElement('shop-items', false);
        
        // Make the shopkeeper talk if it has a talk method
        if (this.shopkeeper && typeof this.shopkeeper.talk === 'function') {
            this.shopkeeper.talk();
        }
        
        this.currentInteraction = 'shopkeeper';
    }
    
    showShopItems() {
        // Show the shop items panel
        toggleElement('shop-items', true);
        
        // Update dialog text
        document.getElementById('dialog-text').textContent = 
            `You have ${this.playerCoins} coins. What would you like to buy?`;
    }
    
    buyItem(itemType) {
        let price = 0;
        let itemName = '';
        
        // Get item details
        if (itemType === 'potion') {
            price = 5;
            itemName = 'Healing Potion';
        } else if (itemType === 'sword') {
            price = 25;
            itemName = 'Steel Sword';
        }
        
        // Check if player has enough coins
        if (this.playerCoins >= price) {
            // Deduct coins
            this.playerCoins -= price;
            
            // Add to inventory
            this.inventory.push(itemType);
            
            // Update dialog text
            document.getElementById('dialog-text').textContent = 
                `You bought a ${itemName} for ${price} coins. You have ${this.playerCoins} coins left.`;
                
            // Provide feedback
            this.showNotification(`Purchased ${itemName}!`);
        } else {
            // Not enough coins
            document.getElementById('dialog-text').textContent = 
                `You don't have enough coins to buy the ${itemName}. It costs ${price} coins, but you only have ${this.playerCoins}.`;
        }
    }
    
    closeInteraction() {
        // Hide the interaction panel
        toggleElement('interaction-panel', false);
        toggleElement('shop-items', false);
        
        this.currentInteraction = null;
    }
    
    showNotification(message) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to the document
        document.body.appendChild(notification);
        
        // Remove after a delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }
    
    // Handle ground clicks for player movement
    handleGroundClick(point) {
        // Since we're not handling player movement in this version,
        // we'll just close any open interactions
        if (this.currentInteraction) {
            this.closeInteraction();
        }
        
        return true;
    }
    
    // Handle object clicks (shopkeeper, items, etc.)
    handleObjectClick(object) {
        if (!object) return false;
        
        // Check if it's the shopkeeper
        if (object.userData && object.userData.characterType === 'shopkeeper') {
            this.startShopkeeperInteraction();
            return true;
        }
        
        // Check if it's an item
        if (object.userData && object.userData.isItem) {
            // Show item info
            this.showNotification(`${object.userData.itemName}: ${object.userData.itemPrice} coins`);
            return true;
        }
        
        return false;
    }
} 