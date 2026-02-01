// Main entry point - initializes and starts the game

import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { CONFIG, UI_IDS } from './config.js';

class TetrisApp {
    constructor() {
        this.renderer = new Renderer();
        this.game = null;
        this.inputHandler = null;
        
        this.init();
    }
    
    init() {
        console.log('Tetris Game - Stage 1 Complete');
        console.log('Project structure initialized successfully!');
        
        // Load high score from localStorage
        const highScore = localStorage.getItem(CONFIG.STORAGE_KEY) || 0;
        this.renderer.updateHighScore(highScore);
        
        // Show start screen
        this.renderer.showStartScreen();
        
        // Set up initial event listener for starting game
        this.setupStartListener();
        
        // Log status
        this.logSetupStatus();
    }
    
    setupStartListener() {
        const startGame = (event) => {
            if (!this.game || this.game.gameOver) {
                event.preventDefault();
                
                // Initialize game components
                this.game = new Game(this.renderer, null);
                this.inputHandler = new InputHandler(this.game);
                this.game.inputHandler = this.inputHandler;
                
                // Set up input controls (will be implemented in Stage 6)
                // this.inputHandler.setupKeyboardControls();
                
                // Hide start screen
                this.renderer.hideStartScreen();
                
                // Start game (will be implemented in Stage 4)
                // this.game.start();
                
                // Remove this listener
                document.removeEventListener('keydown', startGame);
                
                console.log('Game would start here (to be implemented in Stages 4-6)');
            }
        };
        
        document.addEventListener('keydown', startGame);
    }
    
    logSetupStatus() {
        console.log('\n=== STAGE 1: Setup Complete ===');
        console.log('✓ Project directory structure created');
        console.log('✓ index.html with canvas and UI elements');
        console.log('✓ CSS with responsive layout');
        console.log('✓ config.js with game constants');
        console.log('✓ Placeholder modules created:');
        console.log('  - pieces.js (Stage 2)');
        console.log('  - board.js (Stage 3)');
        console.log('  - game.js (Stage 4)');
        console.log('  - renderer.js (Stage 5)');
        console.log('  - input.js (Stage 6)');
        console.log('\nNext: Implement Stage 2 (Piece Definitions)');
        console.log('=====================================\n');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TetrisApp();
});
