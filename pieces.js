// Tetromino piece definitions and rotation logic
// Stage 2: Complete implementation

import { CONFIG } from './config.js';

/**
 * PIECES object containing all 7 tetromino types
 * Each piece has:
 * - shapes: Array of 4 rotation states (each is a 4x4 grid)
 * - color: Color from CONFIG.COLORS
 * 
 * Grid notation: 0 = empty, 1 = filled
 * All pieces use a 4x4 grid for consistent rotation handling
 */
export const PIECES = {
    I: {
        shapes: [
            // Rotation 0: Horizontal
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: Vertical
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            // Rotation 2: Horizontal
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            // Rotation 3: Vertical
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.I
    },

    O: {
        shapes: [
            // All rotations are the same for O piece
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.O
    },

    T: {
        shapes: [
            // Rotation 0: T pointing up
            [
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: T pointing right
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 2: T pointing down
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 3: T pointing left
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.T
    },

    S: {
        shapes: [
            // Rotation 0: Horizontal
            [
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: Vertical
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 2: Horizontal
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 3: Vertical
            [
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.S
    },

    Z: {
        shapes: [
            // Rotation 0: Horizontal
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: Vertical
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 2: Horizontal
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 3: Vertical
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.Z
    },

    J: {
        shapes: [
            // Rotation 0: J standard
            [
                [1, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: J rotated 90° clockwise
            [
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 2: J rotated 180°
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 3: J rotated 270°
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.J
    },

    L: {
        shapes: [
            // Rotation 0: L standard
            [
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1: L rotated 90° clockwise
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 2: L rotated 180°
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 3: L rotated 270°
            [
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: CONFIG.COLORS.L
    }
};

/**
 * Piece class representing a single tetromino
 */
export class Piece {
    /**
     * Create a new piece
     * @param {string} type - Type of piece (I, O, T, S, Z, J, L)
     */
    constructor(type) {
        if (!PIECES[type]) {
            throw new Error(`Invalid piece type: ${type}`);
        }
        
        this.type = type;
        this.rotation = 0;
        this.x = Math.floor(CONFIG.BOARD_WIDTH / 2) - 2;  // Spawn in center
        this.y = 0;
    }
    
    /**
     * Get the current shape matrix for this piece
     * @returns {Array<Array<number>>} 4x4 matrix of the current rotation
     */
    getShape() {
        return PIECES[this.type].shapes[this.rotation];
    }
    
    /**
     * Get the color of this piece
     * @returns {string} Hex color code
     */
    getColor() {
        return PIECES[this.type].color;
    }
    
    /**
     * Rotate the piece
     * @param {number} direction - 1 for clockwise, -1 for counter-clockwise
     */
    rotate(direction = 1) {
        // Calculate new rotation (0-3)
        this.rotation = (this.rotation + direction + 4) % 4;
    }
    
    /**
     * Move the piece horizontally
     * @param {number} dx - Amount to move (-1 left, 1 right)
     */
    move(dx) {
        this.x += dx;
    }
    
    /**
     * Move the piece down
     */
    moveDown() {
        this.y += 1;
    }
    
    /**
     * Create a copy of this piece (useful for ghost piece)
     * @returns {Piece} New piece instance with same properties
     */
    clone() {
        const cloned = new Piece(this.type);
        cloned.rotation = this.rotation;
        cloned.x = this.x;
        cloned.y = this.y;
        return cloned;
    }
    
    /**
     * Reset piece position to spawn location
     */
    reset() {
        this.rotation = 0;
        this.x = Math.floor(CONFIG.BOARD_WIDTH / 2) - 2;
        this.y = 0;
    }
}

/**
 * Generate a random piece type using 7-bag randomizer
 * This ensures all 7 pieces appear before any repeat
 */
let bag = [];

export function getRandomPieceType() {
    if (bag.length === 0) {
        // Refill bag with all 7 pieces
        bag = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        // Shuffle the bag (Fisher-Yates shuffle)
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
    }
    return bag.pop();
}
