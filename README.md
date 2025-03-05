# Village Shopkeeper

A Three.js game scene that implements a medieval village shopkeeper experience based on the provided concept art. Players can interact with the shopkeeper to buy potions and swords.

## Features

- 3D medieval village scene with a potion shop
- Interactive shopkeeper character with dialog
- Knight player character that can move around the scene
- Colorful potion bottles on display shelves
- Sword for sale
- Magic crystal with glowing effects
- Buy and sell system with currency

## Implementation Notes

The application provides two main files:
- `index.html` - The main application with the complete scene implementation
- `test.html` - A simplified version that loads faster and demonstrates core functionality

Both files use CDN-hosted Three.js libraries to avoid module loading issues, making them more compatible across different environments.

## Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Internet connection (for loading Three.js libraries from CDN)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/village-shopkeeper.git
cd village-shopkeeper
```

2. Start a local development server:
```bash
npx serve
```

3. Open your browser and navigate to `http://localhost:3000`

## Controls

- **Movement**: WASD or Arrow Keys (in full version)
- **Interact**: Click on objects or characters
- **Camera**: Click and drag to rotate, scroll to zoom

## Technical Implementation

This project is built using:

- **Three.js**: For 3D rendering (via CDN)
- **OrbitControls**: For camera movement
- **Custom Characters**: Built using primitive Three.js shapes
- **Custom Items**: Potions, swords, and other items built with Three.js geometry

The scene is structured with:

- **Street**: Cobblestone street with stone details
- **Shop**: Wooden structure with counter, shelves, and awning
- **Items for Sale**: Potions with different colors and a sword
- **Characters**: Shopkeeper with beard and interactive elements

## Project Structure

```
village-shopkeeper/
├── index.html              # Main application (self-contained)
├── test.html               # Simplified test version
├── styles/
│   └── main.css            # CSS styles for UI (used by main version)
├── assets/                 # For future textures/models
├── node_modules/           # Dependencies
├── package.json            # Project configuration
└── README.md               # This file
```

## Troubleshooting

If you encounter issues with the main application (`index.html`):
1. Try the simplified version (`test.html`) first to verify Three.js is working
2. Check your browser console for errors
3. Ensure your browser supports WebGL 
4. Verify your internet connection for loading CDN libraries

## Extending the Project

You can extend this project by:

1. Adding more items to the shop
2. Creating a day/night cycle
3. Adding more NPCs and buildings
4. Implementing a quest system
5. Adding textures instead of using basic materials

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for providing a powerful WebGL library
- Concept art that inspired this implementation 