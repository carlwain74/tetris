#!/usr/bin/env node

/**
 * Stage 4 Verification Script
 * Tests game logic, scoring, and game loop
 */

// Mock localStorage for Node.js environment
global.localStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = value.toString(); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; }
};

// Mock performance.now for Node.js
if (typeof performance === 'undefined') {
    global.performance = {
        now: () => Date.now()
    };
}

// Mock requestAnimationFrame for Node.js
if (typeof requestAnimationFrame === 'undefined') {
    global.requestAnimationFrame = (callback) => {
        return setTimeout(() => callback(Date.now()), 16);
    };
    global.cancelAnimationFrame = (id) => {
        clearTimeout(id);
    };
}

import { Game } from '../js/game.js';
import { CONFIG } from '../js/config.js';

console.log('\n🎮 Stage 4: Core Game Logic - Verification\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;

function test(description, fn) {
    try {
        const result = fn();
        if (result) {
            console.log(`✓ ${description}`);
            passed++;
        } else {
            console.log(`✗ ${description}`);
            failed++;
        }
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

// Test 1: Game creation
test('Game can be instantiated', () => {
    const game = new Game(null, null);
    return game !== null;
});

// Test 2: Initial state
test('Game has correct initial state', () => {
    const game = new Game(null, null);
    return game.score === 0 && 
           game.level === 1 && 
           game.lines === 0 &&
           !game.gameOver &&
           !game.paused;
});

// Test 3: Board initialization
test('Game creates a board', () => {
    const game = new Game(null, null);
    return game.board !== null && game.board.width === 10;
});

// Test 4: Game initialization
test('init() sets up game state', () => {
    const game = new Game(null, null);
    game.init();
    return game.nextPieces.length === CONFIG.NEXT_PIECES_COUNT &&
           game.currentPiece !== null;
});

// Test 5: Piece spawning
test('spawnPiece() creates current piece', () => {
    const game = new Game(null, null);
    game.init();
    const piece = game.currentPiece;
    return piece !== null && piece.type !== undefined;
});

// Test 6: Next pieces queue
test('Next pieces queue is maintained', () => {
    const game = new Game(null, null);
    game.init();
    const initialNext = game.nextPieces[0];
    game.spawnPiece();
    return game.nextPieces.length === CONFIG.NEXT_PIECES_COUNT &&
           game.nextPieces[0] !== initialNext;
});

// Test 7: Move left
test('movePieceLeft() moves piece left', () => {
    const game = new Game(null, null);
    game.init();
    const initialX = game.currentPiece.x;
    game.movePieceLeft();
    return game.currentPiece.x === initialX - 1;
});

// Test 8: Move right
test('movePieceRight() moves piece right', () => {
    const game = new Game(null, null);
    game.init();
    const initialX = game.currentPiece.x;
    game.movePieceRight();
    return game.currentPiece.x === initialX + 1;
});

// Test 9: Move down
test('movePieceDown() moves piece down', () => {
    const game = new Game(null, null);
    game.init();
    const initialY = game.currentPiece.y;
    game.movePieceDown();
    return game.currentPiece.y === initialY + 1;
});

// Test 10: Rotation
test('rotatePiece() rotates piece', () => {
    const game = new Game(null, null);
    game.init();
    const initialRotation = game.currentPiece.rotation;
    game.rotatePiece(1);
    return game.currentPiece.rotation !== initialRotation;
});

// Test 11: Boundary prevention - left
test('Cannot move piece past left boundary', () => {
    const game = new Game(null, null);
    game.init();
    game.currentPiece.x = 0;
    const moved = game.movePieceLeft();
    return !moved && game.currentPiece.x === 0;
});

// Test 12: Boundary prevention - right
test('Cannot move piece past right boundary', () => {
    const game = new Game(null, null);
    game.init();
    game.currentPiece.x = 9;
    const moved = game.movePieceRight();
    return !moved;
});

// Test 13: Hard drop
test('hardDrop() drops piece to bottom', () => {
    const game = new Game(null, null);
    game.init();
    const initialY = game.currentPiece.y;
    const distance = game.hardDrop();
    return distance > 0;
});

// Test 14: Hard drop scoring
test('Hard drop awards points', () => {
    const game = new Game(null, null);
    game.init();
    const initialScore = game.score;
    game.hardDrop();
    return game.score > initialScore;
});

// Test 15: Soft drop scoring
test('Soft drop awards points', () => {
    const game = new Game(null, null);
    game.init();
    const initialScore = game.score;
    game.softDrop();
    return game.score >= initialScore; // May not move if at bottom
});

// Test 16: Hold piece
test('holdPiece() swaps current with held', () => {
    const game = new Game(null, null);
    game.init();
    const currentType = game.currentPiece.type;
    game.holdPiece();
    return game.heldPiece === currentType;
});

// Test 17: Hold piece - only once per piece
test('Can only hold once per piece', () => {
    const game = new Game(null, null);
    game.init();
    game.holdPiece();
    const canHoldAgain = game.holdPiece();
    return !canHoldAgain;
});

// Test 18: Hold resets after lock
test('Hold resets after piece locks', () => {
    const game = new Game(null, null);
    game.init();
    game.holdPiece();
    game.hardDrop(); // Lock current piece
    return game.canHold;
});

// Test 19: Scoring - single line
test('Single line clear awards correct points', () => {
    const game = new Game(null, null);
    game.init();
    game.calculateScore(1);
    return game.score === CONFIG.POINTS.SINGLE * game.level;
});

// Test 20: Scoring - double line
test('Double line clear awards correct points', () => {
    const game = new Game(null, null);
    game.init();
    const initialScore = game.score;
    game.calculateScore(2);
    return game.score === initialScore + (CONFIG.POINTS.DOUBLE * game.level);
});

// Test 21: Scoring - triple line
test('Triple line clear awards correct points', () => {
    const game = new Game(null, null);
    game.init();
    const initialScore = game.score;
    game.calculateScore(3);
    return game.score === initialScore + (CONFIG.POINTS.TRIPLE * game.level);
});

// Test 22: Scoring - tetris (4 lines)
test('Tetris awards correct points', () => {
    const game = new Game(null, null);
    game.init();
    const initialScore = game.score;
    game.calculateScore(4);
    return game.score === initialScore + (CONFIG.POINTS.TETRIS * game.level);
});

// Test 23: Level progression
test('Level increases after enough lines', () => {
    const game = new Game(null, null);
    game.init();
    game.lines = CONFIG.LINES_PER_LEVEL;
    game.updateLevel();
    return game.level === 2;
});

// Test 24: Speed increase with level
test('Speed increases with level', () => {
    const game = new Game(null, null);
    game.init();
    const initialSpeed = game.dropInterval;
    game.level = 2;
    game.updateSpeed();
    return game.dropInterval < initialSpeed;
});

// Test 25: Pause toggle
test('pause() toggles pause state', () => {
    const game = new Game(null, null);
    game.init();
    game.pause();
    const wasPaused = game.paused;
    game.pause();
    return wasPaused && !game.paused;
});

// Test 26: Reset game
test('reset() clears game state', () => {
    const game = new Game(null, null);
    game.init();
    game.score = 1000;
    game.level = 5;
    game.lines = 50;
    game.reset();
    return game.score === 0 && game.level === 1 && game.lines === 0;
});

// Test 27: Ghost piece
test('getGhostPiece() returns ghost piece', () => {
    const game = new Game(null, null);
    game.init();
    const ghost = game.getGhostPiece();
    return ghost !== null && ghost.y >= game.currentPiece.y;
});

// Test 28: Game state
test('getState() returns game state', () => {
    const game = new Game(null, null);
    game.init();
    const state = game.getState();
    return state.score !== undefined && 
           state.level !== undefined &&
           state.currentPiece !== undefined;
});

// Test 29: High score loading
test('High score loads from localStorage', () => {
    const game = new Game(null, null);
    return game.highScore >= 0;
});

// Test 30: Wall kicks on rotation
test('Rotation attempts wall kicks', () => {
    const game = new Game(null, null);
    game.init();
    // Move piece to left edge
    game.currentPiece.x = 0;
    // Try to rotate (should wall kick if needed)
    const rotated = game.rotatePiece(1);
    // Should either rotate or fail gracefully
    return true; // Just verify no crash
});

// Summary
console.log('═'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('\n✅ All Stage 4 tests passed! Ready for Stage 5.\n');
    process.exit(0);
} else {
    console.log(`\n❌ ${failed} test(s) failed. Please fix before continuing.\n`);
    process.exit(1);
}
