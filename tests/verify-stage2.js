#!/usr/bin/env node

/**
 * Stage 2 Verification Script
 * Tests piece definitions without requiring jsdom
 */

import { PIECES, Piece, getRandomPieceType } from '../js/pieces.js';
import { CONFIG, PIECE_TYPES } from '../js/config.js';

console.log('\n🎮 Stage 2: Piece Definitions - Verification\n');
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

// Test 1: PIECES object exists
test('PIECES object is defined', () => {
    return typeof PIECES === 'object' && PIECES !== null;
});

// Test 2: All 7 piece types exist
test('All 7 piece types defined (I, O, T, S, Z, J, L)', () => {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types.every(type => PIECES[type] !== undefined);
});

// Test 3: Each piece has 4 rotation states
test('Each piece has 4 rotation states', () => {
    return Object.values(PIECES).every(piece => 
        piece.shapes && piece.shapes.length === 4
    );
});

// Test 4: Each rotation is a 4x4 grid
test('Each rotation is a 4x4 grid', () => {
    return Object.values(PIECES).every(piece =>
        piece.shapes.every(shape =>
            shape.length === 4 && shape.every(row => row.length === 4)
        )
    );
});

// Test 5: Each piece has a color
test('Each piece has a color defined', () => {
    return Object.values(PIECES).every(piece => 
        piece.color && typeof piece.color === 'string'
    );
});

// Test 6: Piece class can be instantiated
test('Piece class can be instantiated', () => {
    const piece = new Piece('I');
    return piece !== null && piece.type === 'I';
});

// Test 7: Invalid piece type throws error
test('Invalid piece type throws error', () => {
    try {
        new Piece('X');
        return false;
    } catch (error) {
        return error.message.includes('Invalid piece type');
    }
});

// Test 8: Piece has correct initial position
test('Piece spawns in correct position', () => {
    const piece = new Piece('T');
    return piece.x === Math.floor(CONFIG.BOARD_WIDTH / 2) - 2 && piece.y === 0;
});

// Test 9: getShape returns correct matrix
test('getShape() returns 4x4 matrix', () => {
    const piece = new Piece('I');
    const shape = piece.getShape();
    return Array.isArray(shape) && 
           shape.length === 4 && 
           shape[0].length === 4;
});

// Test 10: getColor returns color string
test('getColor() returns color string', () => {
    const piece = new Piece('O');
    const color = piece.getColor();
    return typeof color === 'string' && color === CONFIG.COLORS.O;
});

// Test 11: Rotation works correctly
test('rotate() changes rotation state', () => {
    const piece = new Piece('T');
    const initialRotation = piece.rotation;
    piece.rotate(1);
    return piece.rotation === (initialRotation + 1) % 4;
});

// Test 12: Counter-clockwise rotation
test('rotate(-1) rotates counter-clockwise', () => {
    const piece = new Piece('L');
    piece.rotation = 1;
    piece.rotate(-1);
    return piece.rotation === 0;
});

// Test 13: Rotation wraps around
test('Rotation wraps around (0-3)', () => {
    const piece = new Piece('S');
    piece.rotation = 3;
    piece.rotate(1);
    return piece.rotation === 0;
});

// Test 14: move() changes x position
test('move() changes x position', () => {
    const piece = new Piece('Z');
    const initialX = piece.x;
    piece.move(1);
    return piece.x === initialX + 1;
});

// Test 15: moveDown() changes y position
test('moveDown() changes y position', () => {
    const piece = new Piece('J');
    const initialY = piece.y;
    piece.moveDown();
    return piece.y === initialY + 1;
});

// Test 16: clone() creates independent copy
test('clone() creates independent copy', () => {
    const piece1 = new Piece('I');
    piece1.rotation = 2;
    piece1.x = 5;
    piece1.y = 10;
    
    const piece2 = piece1.clone();
    
    return piece2.type === piece1.type &&
           piece2.rotation === piece1.rotation &&
           piece2.x === piece1.x &&
           piece2.y === piece1.y &&
           piece2 !== piece1;
});

// Test 17: Clone independence
test('Cloned piece is independent', () => {
    const piece1 = new Piece('T');
    const piece2 = piece1.clone();
    piece1.rotate(1);
    return piece1.rotation !== piece2.rotation;
});

// Test 18: reset() returns to spawn
test('reset() returns piece to spawn position', () => {
    const piece = new Piece('O');
    piece.x = 5;
    piece.y = 10;
    piece.rotation = 2;
    piece.reset();
    return piece.x === Math.floor(CONFIG.BOARD_WIDTH / 2) - 2 &&
           piece.y === 0 &&
           piece.rotation === 0;
});

// Test 19: getRandomPieceType exists
test('getRandomPieceType() function exists', () => {
    return typeof getRandomPieceType === 'function';
});

// Test 20: getRandomPieceType returns valid type
test('getRandomPieceType() returns valid piece type', () => {
    const type = getRandomPieceType();
    return PIECE_TYPES.includes(type);
});

// Test 21: 7-bag randomizer works
test('7-bag randomizer generates all 7 pieces', () => {
    const generated = new Set();
    // Generate 14 pieces to ensure we get a full bag (7 pieces per bag)
    for (let i = 0; i < 14; i++) {
        generated.add(getRandomPieceType());
    }
    return generated.size === 7;
});

// Test 22: Verify I piece rotations are different
test('I piece has different rotations', () => {
    const shapes = PIECES.I.shapes;
    const shape0 = JSON.stringify(shapes[0]);
    const shape1 = JSON.stringify(shapes[1]);
    return shape0 !== shape1;
});

// Test 23: O piece rotations are same (square)
test('O piece rotations are identical (square piece)', () => {
    const shapes = PIECES.O.shapes;
    const shape0 = JSON.stringify(shapes[0]);
    return shapes.every(s => JSON.stringify(s) === shape0);
});

// Test 24: T piece has 4 unique rotations
test('T piece has 4 different rotations', () => {
    const shapes = PIECES.T.shapes.map(s => JSON.stringify(s));
    const uniqueShapes = new Set(shapes);
    return uniqueShapes.size === 4;
});

// Summary
console.log('═'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('\n✅ All Stage 2 tests passed! Ready for Stage 3.\n');
    process.exit(0);
} else {
    console.log(`\n❌ ${failed} test(s) failed. Please fix before continuing.\n`);
    process.exit(1);
}
