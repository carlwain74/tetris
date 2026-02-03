// Board management and collision detection
// Stage 3: Complete implementation

import { CONFIG } from './config.js';

/**
 * Board class manages the game grid, collision detection, and line clearing
 */
export class Board {
    constructor() {
        this.width = CONFIG.BOARD_WIDTH;
        this.height = CONFIG.BOARD_HEIGHT;
        this.grid = this.createEmptyGrid();
    }
    
    /**
     * Create an empty grid filled with zeros
     * @returns {Array<Array<number>>} 2D array representing empty board
     */
    createEmptyGrid() {
        return Array(this.height).fill(null).map(() => Array(this.width).fill(0));
    }
    
    /**
     * Check if a piece can be placed at the given position
     * @param {Piece} piece - The piece to check
     * @param {number} x - X position to check
     * @param {number} y - Y position to check
     * @param {number} rotation - Rotation state to check
     * @returns {boolean} True if move is valid, false otherwise
     */
    isValidMove(piece, x, y, rotation) {
        const shape = piece.getShape ? 
            piece.getShape() : 
            piece.constructor.prototype.getShape.call({...piece, rotation});
        
        // Check each cell of the piece
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    // Check boundaries
                    if (newX < 0 || newX >= this.width || newY >= this.height) {
                        return false;
                    }
                    
                    // Allow pieces above the board (newY < 0) during spawn
                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    /**
     * Lock a piece into the board grid
     * @param {Piece} piece - The piece to lock
     * @param {string} color - Color to use for the locked piece
     */
    lockPiece(piece, color = null) {
        const shape = piece.getShape();
        const pieceColor = color || piece.getColor();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = piece.x + col;
                    const y = piece.y + row;
                    
                    // Only lock cells that are within the board
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        this.grid[y][x] = pieceColor;
                    }
                }
            }
        }
    }
    
    /**
     * Clear completed lines and return the number cleared
     * @returns {number} Number of lines cleared
     */
    clearLines() {
        let linesCleared = 0;
        
        // Check from bottom to top
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.isLineFull(y)) {
                this.removeLine(y);
                linesCleared++;
                y++; // Check this row again since we shifted everything down
            }
        }
        
        return linesCleared;
    }
    
    /**
     * Check if a line is completely filled
     * @param {number} y - Row index to check
     * @returns {boolean} True if line is full
     */
    isLineFull(y) {
        return this.grid[y].every(cell => cell !== 0);
    }
    
    /**
     * Remove a line and shift everything above it down
     * @param {number} lineIndex - Index of line to remove
     */
    removeLine(lineIndex) {
        // Remove the line
        this.grid.splice(lineIndex, 1);
        // Add new empty line at top
        this.grid.unshift(Array(this.width).fill(0));
    }
    
    /**
     * Get all completed line indices
     * @returns {Array<number>} Array of row indices that are complete
     */
    getCompletedLines() {
        const completedLines = [];
        for (let y = 0; y < this.height; y++) {
            if (this.isLineFull(y)) {
                completedLines.push(y);
            }
        }
        return completedLines;
    }
    
    /**
     * Check if the game is over (blocks in top rows)
     * @returns {boolean} True if game over
     */
    isGameOver() {
        // Check top two rows for any blocks
        // Using top two rows gives a bit of grace period
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Get the height of the stack at a given column
     * @param {number} x - Column index
     * @returns {number} Height of stack (0 = empty column)
     */
    getColumnHeight(x) {
        for (let y = 0; y < this.height; y++) {
            if (this.grid[y][x] !== 0) {
                return this.height - y;
            }
        }
        return 0;
    }
    
    /**
     * Calculate the drop distance for a piece
     * Used for ghost piece and hard drop
     * @param {Piece} piece - The piece to check
     * @returns {number} Number of rows the piece can drop
     */
    getDropDistance(piece) {
        let distance = 0;
        
        while (this.isValidMove(piece, piece.x, piece.y + distance + 1, piece.rotation)) {
            distance++;
        }
        
        return distance;
    }
    
    /**
     * Get a cell value at position
     * @param {number} x - Column index
     * @param {number} y - Row index
     * @returns {any} Cell value (0 for empty, color string for filled)
     */
    getCell(x, y) {
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            return null;
        }
        return this.grid[y][x];
    }
    
    /**
     * Set a cell value at position
     * @param {number} x - Column index
     * @param {number} y - Row index
     * @param {any} value - Value to set
     */
    setCell(x, y, value) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            this.grid[y][x] = value;
        }
    }
    
    /**
     * Reset the board to empty state
     */
    reset() {
        this.grid = this.createEmptyGrid();
    }
    
    /**
     * Get a copy of the grid
     * @returns {Array<Array<number>>} Copy of the grid
     */
    getGrid() {
        return this.grid.map(row => [...row]);
    }
    
    /**
     * Count total filled cells on the board
     * @returns {number} Number of filled cells
     */
    getFilledCellCount() {
        let count = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] !== 0) {
                    count++;
                }
            }
        }
        return count;
    }
    
    /**
     * Check if the board is empty
     * @returns {boolean} True if board has no pieces
     */
    isEmpty() {
        return this.getFilledCellCount() === 0;
    }
}
