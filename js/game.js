// Core game logic and state management
// Stage 4: Complete implementation

import { CONFIG, PIECE_TYPES } from './config.js';
import { Board } from './board.js';
import { Piece, getRandomPieceType } from './pieces.js';

/**
 * Game class manages the core game logic, state, and game loop
 */
export class Game {
    constructor(renderer, inputHandler) {
        this.renderer = renderer;
        this.inputHandler = inputHandler;
        this.board = new Board();
        
        // Game state
        this.currentPiece = null;
        this.nextPieces = [];
        this.heldPiece = null;
        this.canHold = true;
        
        // Stats
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        // Timing
        this.lastDropTime = 0;
        this.dropInterval = CONFIG.INITIAL_SPEED;
        this.lockDelay = 0;
        this.lockDelayMax = CONFIG.LOCK_DELAY;
        
        // Status
        this.gameOver = false;
        this.paused = false;
        this.started = false;
        
        // Animation frame ID for cleanup
        this.animationId = null;
        
        // High score
        this.highScore = this.loadHighScore();
    }
    
    /**
     * Initialize the game
     */
    init() {
        // Reset game state
        this.board.reset();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = CONFIG.INITIAL_SPEED;
        this.lockDelay = 0;
        
        // Generate initial next pieces
        this.nextPieces = [];
        for (let i = 0; i < CONFIG.NEXT_PIECES_COUNT; i++) {
            this.nextPieces.push(getRandomPieceType());
        }
        
        // Reset held piece
        this.heldPiece = null;
        this.canHold = true;
        
        // Spawn first piece
        this.spawnPiece();
    }
    
    /**
     * Start the game loop
     */
    start() {
        if (!this.started) {
            this.started = true;
            this.lastDropTime = performance.now();
            this.gameLoop(this.lastDropTime);
        }
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp from requestAnimationFrame
     */
    gameLoop(timestamp) {
        if (this.gameOver) {
            return;
        }
        
        this.update(timestamp);
        
        // Request next frame
        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    /**
     * Update game state
     * @param {number} timestamp - Current timestamp
     */
    update(timestamp) {
        if (this.paused || this.gameOver || !this.currentPiece) {
            return;
        }
        
        const deltaTime = timestamp - this.lastDropTime;
        
        // Check if it's time to drop the piece
        if (deltaTime >= this.dropInterval) {
            this.movePieceDown();
            this.lastDropTime = timestamp;
        }
    }
    
    /**
     * Spawn a new piece
     */
    spawnPiece() {
        // Get next piece type from queue
        const type = this.nextPieces.shift();
        
        // Add new piece to end of queue
        this.nextPieces.push(getRandomPieceType());
        
        // Create new piece
        this.currentPiece = new Piece(type);
        this.canHold = true;
        this.lockDelay = 0;
        
        // Check if piece can spawn (game over if not)
        if (!this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y, this.currentPiece.rotation)) {
            this.endGame();
        }
    }
    
    /**
     * Move current piece down
     * @returns {boolean} True if piece moved, false if locked
     */
    movePieceDown() {
        if (!this.currentPiece) return false;
        
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.rotation)) {
            this.currentPiece.moveDown();
            this.lockDelay = 0; // Reset lock delay on successful move
            return true;
        } else {
            // Piece hit bottom or another piece
            this.lockCurrentPiece();
            return false;
        }
    }
    
    /**
     * Move current piece left
     * @returns {boolean} True if piece moved
     */
    movePieceLeft() {
        if (!this.currentPiece) return false;
        
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.rotation)) {
            this.currentPiece.move(-1);
            return true;
        }
        return false;
    }
    
    /**
     * Move current piece right
     * @returns {boolean} True if piece moved
     */
    movePieceRight() {
        if (!this.currentPiece) return false;
        
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.rotation)) {
            this.currentPiece.move(1);
            return true;
        }
        return false;
    }
    
    /**
     * Rotate current piece
     * @param {number} direction - 1 for clockwise, -1 for counter-clockwise
     * @returns {boolean} True if piece rotated
     */
    rotatePiece(direction = 1) {
        if (!this.currentPiece) return false;
        
        const newRotation = (this.currentPiece.rotation + direction + 4) % 4;
        
        if (this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y, newRotation)) {
            this.currentPiece.rotate(direction);
            return true;
        }
        
        // Try wall kicks (simple implementation)
        const wallKicks = [
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
            { x: 0, y: -1 }, // Up
            { x: -2, y: 0 }, // Left 2
            { x: 2, y: 0 }   // Right 2
        ];
        
        for (const kick of wallKicks) {
            if (this.board.isValidMove(this.currentPiece, this.currentPiece.x + kick.x, this.currentPiece.y + kick.y, newRotation)) {
                this.currentPiece.x += kick.x;
                this.currentPiece.y += kick.y;
                this.currentPiece.rotate(direction);
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Hard drop - instantly drop piece to bottom
     * @returns {number} Number of rows dropped
     */
    hardDrop() {
        if (!this.currentPiece) return 0;
        
        const distance = this.board.getDropDistance(this.currentPiece);
        this.currentPiece.y += distance;
        
        // Add hard drop points
        this.score += distance * CONFIG.POINTS.HARD_DROP;
        
        // Lock immediately
        this.lockCurrentPiece();
        
        return distance;
    }
    
    /**
     * Soft drop - move piece down and add points
     * @returns {boolean} True if piece moved
     */
    softDrop() {
        if (!this.currentPiece) return false;
        
        if (this.movePieceDown()) {
            this.score += CONFIG.POINTS.SOFT_DROP;
            return true;
        }
        return false;
    }
    
    /**
     * Hold current piece (swap with held piece)
     * @returns {boolean} True if hold was successful
     */
    holdPiece() {
        if (!this.currentPiece || !this.canHold) {
            return false;
        }
        
        if (this.heldPiece === null) {
            // First hold - store current and spawn next
            this.heldPiece = this.currentPiece.type;
            this.spawnPiece();
        } else {
            // Swap current with held
            const temp = this.heldPiece;
            this.heldPiece = this.currentPiece.type;
            this.currentPiece = new Piece(temp);
            
            // Check if swapped piece can spawn
            if (!this.board.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y, this.currentPiece.rotation)) {
                // Can't spawn - revert
                this.heldPiece = temp;
                return false;
            }
        }
        
        this.canHold = false;
        return true;
    }
    
    /**
     * Lock current piece to board
     */
    lockCurrentPiece() {
        if (!this.currentPiece) return;
        
        // Lock piece to board
        this.board.lockPiece(this.currentPiece);
        
        // Clear lines and calculate score
        const linesCleared = this.board.clearLines();
        if (linesCleared > 0) {
            this.calculateScore(linesCleared);
            this.lines += linesCleared;
            this.updateLevel();
        }
        
        // Check game over
        if (this.board.isGameOver()) {
            this.endGame();
            return;
        }
        
        // Spawn next piece
        this.spawnPiece();
    }
    
    /**
     * Calculate and add score for cleared lines
     * @param {number} linesCleared - Number of lines cleared (1-4)
     */
    calculateScore(linesCleared) {
        const points = {
            1: CONFIG.POINTS.SINGLE,
            2: CONFIG.POINTS.DOUBLE,
            3: CONFIG.POINTS.TRIPLE,
            4: CONFIG.POINTS.TETRIS
        };
        
        const basePoints = points[linesCleared] || 0;
        this.score += basePoints * this.level;
    }
    
    /**
     * Update level based on lines cleared
     */
    updateLevel() {
        const newLevel = Math.floor(this.lines / CONFIG.LINES_PER_LEVEL) + 1;
        
        if (newLevel !== this.level) {
            this.level = newLevel;
            this.updateSpeed();
        }
    }
    
    /**
     * Update drop speed based on level
     */
    updateSpeed() {
        this.dropInterval = Math.max(
            CONFIG.MIN_SPEED,
            CONFIG.INITIAL_SPEED - (this.level - 1) * CONFIG.SPEED_DECREASE_PER_LEVEL
        );
    }
    
    /**
     * Toggle pause state
     */
    pause() {
        this.paused = !this.paused;
    }
    
    /**
     * Reset game to initial state
     */
    reset() {
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.started = false;
        this.init();
    }
    
    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        this.started = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Get ghost piece position (for rendering)
     * @returns {Piece|null} Ghost piece or null
     */
    getGhostPiece() {
        if (!this.currentPiece) return null;
        
        const ghost = this.currentPiece.clone();
        ghost.y += this.board.getDropDistance(this.currentPiece);
        return ghost;
    }
    
    /**
     * Load high score from localStorage
     * @returns {number} High score
     */
    loadHighScore() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    }
    
    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        localStorage.setItem(CONFIG.STORAGE_KEY, this.highScore.toString());
    }
    
    /**
     * Get current game state
     * @returns {object} Game state object
     */
    getState() {
        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            highScore: this.highScore,
            gameOver: this.gameOver,
            paused: this.paused,
            currentPiece: this.currentPiece,
            nextPieces: this.nextPieces,
            heldPiece: this.heldPiece,
            board: this.board.grid
        };
    }
}

