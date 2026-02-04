// Main entry point - initializes and starts the game
// Stage 6: Complete integration

import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { CONFIG, UI_IDS } from './config.js';

class TetrisApp {
    constructor() {
        this.renderer = new Renderer();
        this.game = null;
        this.inputHandler = null;
        this.lastFrameTime = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        console.log('🎮 Tetris Game - Fully Playable!');
        
        // Show start screen with high score
        const highScore = localStorage.getItem(CONFIG.STORAGE_KEY) || 0;
        this.renderer.updateScore(0, 1, 0, parseInt(highScore));
        this.renderer.showStartScreen();
        
        // Set up initial event listener for starting game
        this.setupStartListener();
    }
    
    setupStartListener() {
        const startGame = (event) => {
            event.preventDefault();
            
            // Remove start listener
            document.removeEventListener('keydown', startGame);
            
            // Initialize game
            this.startNewGame();
        };
        
        document.addEventListener('keydown', startGame);
    }
    
    startNewGame() {
        // Clean up previous game if exists
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove old game over listener if exists
        if (this.gameOverListener) {
            document.removeEventListener('keydown', this.gameOverListener);
            this.gameOverListener = null;
        }
        
        // Create new game components
        this.game = new Game(this.renderer, null);
        this.inputHandler = new InputHandler(this.game);
        this.game.inputHandler = this.inputHandler;
        
        // Set up controls
        this.inputHandler.setupKeyboardControls();
        this.inputHandler.setupTouchControls();
        
        // Initialize and start game
        this.game.init();
        this.renderer.hideStartScreen();
        
        // Start game loop
        this.lastFrameTime = performance.now();
        this.game.start();
        this.startRenderLoop();
        
        // Set up restart on game over
        this.setupGameOverListener();
        
        console.log('✨ Game started! Use arrow keys to play.');
        console.log('Controls: ←→↓ move, ↑/X rotate, Space hard drop, C hold, P pause');
    }
    
    startRenderLoop() {
        const render = (timestamp) => {
            const deltaTime = timestamp - this.lastFrameTime;
            this.lastFrameTime = timestamp;
            
            // Update input handler (for DAS and soft drop)
            if (this.inputHandler) {
                this.inputHandler.update(deltaTime);
            }
            
            // Render frame
            if (this.game && this.renderer) {
                const gameState = {
                    board: this.game.board,
                    currentPiece: this.game.currentPiece,
                    ghostPiece: this.game.getGhostPiece(),
                    nextPieces: this.game.nextPieces,
                    heldPiece: this.game.heldPiece,
                    score: this.game.score,
                    level: this.game.level,
                    lines: this.game.lines,
                    highScore: this.game.highScore
                };
                
                this.renderer.render(gameState);
                
                // Show pause screen if paused
                if (this.game.paused) {
                    this.renderer.showPauseScreen();
                } else {
                    this.renderer.hidePauseScreen();
                }
                
                // Show game over screen if game over
                if (this.game.gameOver) {
                    this.renderer.showGameOverScreen(this.game.score, this.game.isNewHighScore || false);
                    return; // Stop render loop
                }
            }
            
            this.animationId = requestAnimationFrame(render);
        };
        
        this.animationId = requestAnimationFrame(render);
    }
    
    setupGameOverListener() {
        const restartOnGameOver = (event) => {
            if (this.game && this.game.gameOver) {
                if (event.key === 'r' || event.key === 'R' || event.key === 'Enter') {
                    event.preventDefault();
                    // Remove this specific listener
                    document.removeEventListener('keydown', restartOnGameOver);
                    // Hide game over screen
                    this.renderer.hideGameOverScreen();
                    // Start new game
                    this.startNewGame();
                }
            }
        };
        
        // Store reference to remove later if needed
        this.gameOverListener = restartOnGameOver;
        document.addEventListener('keydown', restartOnGameOver);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TetrisApp();
});
