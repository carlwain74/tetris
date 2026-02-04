// Input handling for keyboard and touch controls
// Stage 6: Complete implementation

import { KEYS, CONFIG } from './config.js';

/**
 * InputHandler class manages keyboard and touch input
 */
export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keysPressed = new Set();
        
        // DAS (Delayed Auto Shift) state
        this.dasDelay = 170; // ms before auto-repeat starts
        this.dasInterval = 50; // ms between auto-repeats
        this.dasLeft = { active: false, timer: 0, lastMove: 0 };
        this.dasRight = { active: false, timer: 0, lastMove: 0 };
        
        // Soft drop state
        this.softDropActive = false;
        this.softDropInterval = 50; // ms between soft drops
        this.lastSoftDrop = 0;
        
        // Touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchMoved = false;
        
        // Bind methods to maintain 'this' context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }
    
    /**
     * Set up keyboard event listeners
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    
    /**
     * Set up touch event listeners for mobile
     */
    setupTouchControls() {
        const gameCanvas = document.getElementById('gameCanvas');
        if (gameCanvas) {
            gameCanvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
            gameCanvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            gameCanvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        }
    }
    
    /**
     * Handle key press
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        const key = event.code || event.key; // Use code first, fallback to key
        
        // Don't handle any input during game over - let main.js handle restart
        if (this.game.gameOver) {
            return;
        }
        
        // Prevent default for game keys
        if (this.isGameKey(key)) {
            event.preventDefault();
        }
        
        // Avoid key repeat
        if (this.keysPressed.has(key)) {
            return;
        }
        
        this.keysPressed.add(key);
        
        // Handle game start if not started
        if (!this.game.started) {
            this.game.init();
            this.game.start();
            return;
        }
        
        // Handle game controls
        if (this.isKeyInArray(key, KEYS.LEFT)) {
            this.game.movePieceLeft();
            this.dasLeft.active = true;
            this.dasLeft.timer = 0;
            this.dasLeft.lastMove = performance.now();
        } 
        else if (this.isKeyInArray(key, KEYS.RIGHT)) {
            this.game.movePieceRight();
            this.dasRight.active = true;
            this.dasRight.timer = 0;
            this.dasRight.lastMove = performance.now();
        } 
        else if (this.isKeyInArray(key, KEYS.DOWN)) {
            this.softDropActive = true;
            this.lastSoftDrop = performance.now();
            this.game.softDrop();
        } 
        else if (this.isKeyInArray(key, KEYS.ROTATE_CW)) {
            this.game.rotatePiece(1);
        } 
        else if (this.isKeyInArray(key, KEYS.ROTATE_CCW)) {
            this.game.rotatePiece(-1);
        } 
        else if (this.isKeyInArray(key, KEYS.HARD_DROP)) {
            this.game.hardDrop();
        } 
        else if (this.isKeyInArray(key, KEYS.HOLD)) {
            this.game.holdPiece();
        } 
        else if (this.isKeyInArray(key, KEYS.PAUSE)) {
            this.game.pause();
        }
    }
    
    /**
     * Handle key release
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        const key = event.code || event.key;
        this.keysPressed.delete(key);
        
        // Stop DAS when key released
        if (this.isKeyInArray(key, KEYS.LEFT)) {
            this.dasLeft.active = false;
            this.dasLeft.timer = 0;
        } 
        else if (this.isKeyInArray(key, KEYS.RIGHT)) {
            this.dasRight.active = false;
            this.dasRight.timer = 0;
        } 
        else if (this.isKeyInArray(key, KEYS.DOWN)) {
            this.softDropActive = false;
        }
    }
    
    /**
     * Update DAS and soft drop (called each frame)
     * @param {number} deltaTime - Time since last update in ms
     */
    update(deltaTime) {
        if (this.game.paused || this.game.gameOver) {
            return;
        }
        
        const now = performance.now();
        
        // Handle left DAS
        if (this.dasLeft.active) {
            this.dasLeft.timer += deltaTime;
            if (this.dasLeft.timer >= this.dasDelay) {
                if (now - this.dasLeft.lastMove >= this.dasInterval) {
                    this.game.movePieceLeft();
                    this.dasLeft.lastMove = now;
                }
            }
        }
        
        // Handle right DAS
        if (this.dasRight.active) {
            this.dasRight.timer += deltaTime;
            if (this.dasRight.timer >= this.dasDelay) {
                if (now - this.dasRight.lastMove >= this.dasInterval) {
                    this.game.movePieceRight();
                    this.dasRight.lastMove = now;
                }
            }
        }
        
        // Handle soft drop
        if (this.softDropActive) {
            if (now - this.lastSoftDrop >= this.softDropInterval) {
                this.game.softDrop();
                this.lastSoftDrop = now;
            }
        }
    }
    
    /**
     * Handle touch start
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        event.preventDefault();
        
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchMoved = false;
    }
    
    /**
     * Handle touch move
     * @param {TouchEvent} event - Touch event
     */
    handleTouchMove(event) {
        event.preventDefault();
        this.touchMoved = true;
    }
    
    /**
     * Handle touch end
     * @param {TouchEvent} event - Touch event
     */
    handleTouchEnd(event) {
        event.preventDefault();
        
        if (!this.touchMoved) {
            // Tap - rotate piece
            this.game.rotatePiece(1);
            return;
        }
        
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (absDeltaX > 50) { // Minimum swipe distance
                if (deltaX > 0) {
                    // Swipe right
                    this.game.movePieceRight();
                } else {
                    // Swipe left
                    this.game.movePieceLeft();
                }
            }
        } else {
            // Vertical swipe
            if (absDeltaY > 50) {
                if (deltaY > 0) {
                    // Swipe down - soft drop
                    this.game.softDrop();
                } else {
                    // Swipe up - hard drop
                    this.game.hardDrop();
                }
            }
        }
    }
    
    /**
     * Check if key is in array or matches single key
     * @param {string} key - Key to check
     * @param {string|Array<string>} keyArray - Key or array of keys
     * @returns {boolean} True if key matches
     */
    isKeyInArray(key, keyArray) {
        if (Array.isArray(keyArray)) {
            return keyArray.includes(key);
        }
        return key === keyArray;
    }
    
    /**
     * Check if key is a game key (for preventDefault)
     * @param {string} key - Key to check
     * @returns {boolean} True if it's a game key
     */
    isGameKey(key) {
        const allKeys = [
            ...this.toArray(KEYS.LEFT),
            ...this.toArray(KEYS.RIGHT),
            ...this.toArray(KEYS.DOWN),
            ...this.toArray(KEYS.ROTATE_CW),
            ...this.toArray(KEYS.ROTATE_CCW),
            ...this.toArray(KEYS.HARD_DROP),
            ...this.toArray(KEYS.HOLD),
            ...this.toArray(KEYS.PAUSE),
            ...this.toArray(KEYS.RESTART)
        ];
        return allKeys.includes(key);
    }
    
    /**
     * Convert to array if not already
     * @param {string|Array<string>} value - Value to convert
     * @returns {Array<string>} Array of values
     */
    toArray(value) {
        return Array.isArray(value) ? value : [value];
    }
    
    /**
     * Clean up event listeners
     */
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        
        const gameCanvas = document.getElementById('gameCanvas');
        if (gameCanvas) {
            gameCanvas.removeEventListener('touchstart', this.handleTouchStart);
            gameCanvas.removeEventListener('touchmove', this.handleTouchMove);
            gameCanvas.removeEventListener('touchend', this.handleTouchEnd);
        }
    }
}
