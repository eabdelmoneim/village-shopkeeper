/**
 * Interaction handling for Village Shopkeeper
 */

class GameInteractions {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.currentInteraction = null;
        this.shopItems = [];
        this.playerCoins = 100; // Starting money
        this.inventory = [];
        
        // Set up UI event listeners
        this.setupUIListeners();
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
    
    startShopkeeperInteraction() {
        // Show the interaction panel
        toggleElement('interaction-panel', true);
        toggleElement('shop-items', false);
        
        // Update dialog text
        document.getElementById('dialog-text').textContent = 
            "Greetings traveler! I have potions and weapons for sale. Would you like to see my wares?";
        
        // Make the shopkeeper talk if it has a talk method
        if (this.gameScene.shopkeeper && typeof this.gameScene.shopkeeper.talk === 'function') {
            this.gameScene.shopkeeper.talk();
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
        if (this.gameScene.player && typeof this.gameScene.player.moveTo === 'function') {
            this.gameScene.player.moveTo(point);
            
            // Close any open interactions when moving
            if (this.currentInteraction) {
                this.closeInteraction();
            }
            
            return true;
        }
        
        return false;
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