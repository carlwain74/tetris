// Game Configuration Constants

export const CONFIG = {
    // Board dimensions
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    CELL_SIZE: 30,
    
    // Timing (in milliseconds)
    INITIAL_SPEED: 1000,          // Starting drop speed
    SPEED_DECREASE_PER_LEVEL: 50,  // Speed increase per level
    MIN_SPEED: 100,                // Fastest possible speed
    LOCK_DELAY: 500,               // Time before piece locks after landing
    DAS_DELAY: 170,                // Delayed Auto Shift initial delay
    DAS_REPEAT: 50,                // DAS repeat rate
    
    // Game progression
    LINES_PER_LEVEL: 10,           // Lines needed to advance level
    
    // Scoring
    POINTS: {
        SOFT_DROP: 1,              // Points per cell for soft drop
        HARD_DROP: 2,              // Points per cell for hard drop
        SINGLE: 100,               // 1 line clear
        DOUBLE: 300,               // 2 lines clear
        TRIPLE: 500,               // 3 lines clear
        TETRIS: 800,               // 4 lines clear (Tetris!)
    },
    
    // Piece colors (using standard Tetris colors)
    COLORS: {
        I: '#00F0F0',  // Cyan
        O: '#F0F000',  // Yellow
        T: '#A000F0',  // Purple
        S: '#00F000',  // Green
        Z: '#F00000',  // Red
        J: '#0000F0',  // Blue
        L: '#F0A000',  // Orange
        GHOST: 'rgba(255, 255, 255, 0.2)',  // Semi-transparent white
        GRID: 'rgba(255, 255, 255, 0.05)',  // Very faint white
        EMPTY: '#000000',  // Black
    },
    
    // Preview settings
    NEXT_PIECES_COUNT: 3,
    
    // Storage keys
    STORAGE_KEY: 'tetrisHighScore',
};

// Piece type definitions
export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Canvas IDs for easy reference
export const CANVAS_IDS = {
    GAME: 'gameCanvas',
    HOLD: 'holdCanvas',
    NEXT_1: 'next1Canvas',
    NEXT_2: 'next2Canvas',
    NEXT_3: 'next3Canvas',
};

// UI element IDs
export const UI_IDS = {
    SCORE: 'score',
    LEVEL: 'level',
    LINES: 'lines',
    HIGH_SCORE: 'highScore',
    FINAL_SCORE: 'finalScore',
    START_SCREEN: 'startScreen',
    PAUSE_SCREEN: 'pauseScreen',
    GAME_OVER_SCREEN: 'gameOverScreen',
    HIGH_SCORE_NOTICE: 'high-score-notice',
};

// Key bindings
export const KEYS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE_CW: ['ArrowUp', 'KeyX'],
    ROTATE_CCW: 'KeyZ',
    HARD_DROP: 'Space',
    HOLD: ['KeyC', 'ShiftLeft', 'ShiftRight'],
    PAUSE: ['KeyP', 'Escape'],
    RESTART: 'KeyR',
};
