// Tetromino piece definitions and rotation logic
// This will be implemented in Stage 2

import { CONFIG } from './config.js';

// Placeholder - will be filled in Stage 2
export const PIECES = {
    // Each piece will have:
    // - shapes: array of 4 rotation states (4x4 grids)
    // - color: from CONFIG.COLORS
};

export class Piece {
    constructor(type) {
        this.type = type;
        this.rotation = 0;
        this.x = Math.floor(CONFIG.BOARD_WIDTH / 2) - 2;  // Spawn in center
        this.y = 0;
    }
    
    // Methods will be implemented in Stage 2
    getShape() {
        // Return current rotation matrix
    }
    
    rotate(direction = 1) {
        // Rotate piece (1 = clockwise, -1 = counter-clockwise)
    }
    
    clone() {
        // Create a copy for ghost piece
    }
}
