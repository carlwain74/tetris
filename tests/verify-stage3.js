#!/usr/bin/env node

/**
 * Stage 3 Verification Script
 * Tests board management, collision detection, and line clearing
 */

import { Board } from '../js/board.js';
import { Piece } from '../js/pieces.js';
import { CONFIG } from '../js/config.js';

console.log('\n🎮 Stage 3: Board Management - Verification\n');
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

// Test 1: Board creation
test('Board can be instantiated', () => {
    const board = new Board();
    return board !== null;
});

// Test 2: Board dimensions
test('Board has correct dimensions (10x20)', () => {
    const board = new Board();
    return board.width === 10 && board.height === 20;
});

// Test 3: Empty grid creation
test('Grid is created empty', () => {
    const board = new Board();
    return board.grid.length === 20 && 
           board.grid[0].length === 10 &&
           board.grid.every(row => row.every(cell => cell === 0));
});

// Test 4: Valid move in empty board
test('Piece can spawn in empty board', () => {
    const board = new Board();
    const piece = new Piece('I');
    return board.isValidMove(piece, piece.x, piece.y, piece.rotation);
});

// Test 5: Invalid move - left boundary
test('Cannot move piece past left boundary', () => {
    const board = new Board();
    const piece = new Piece('I');
    return !board.isValidMove(piece, -1, 0, 0);
});

// Test 6: Invalid move - right boundary
test('Cannot move piece past right boundary', () => {
    const board = new Board();
    const piece = new Piece('I');
    return !board.isValidMove(piece, 10, 0, 0);
});

// Test 7: Invalid move - bottom boundary
test('Cannot move piece past bottom boundary', () => {
    const board = new Board();
    const piece = new Piece('I');
    return !board.isValidMove(piece, 0, 20, 0);
});

// Test 8: Lock piece to board
test('Can lock piece to board', () => {
    const board = new Board();
    const piece = new Piece('O');
    piece.x = 4;
    piece.y = 18;
    board.lockPiece(piece);
    
    // Check that some cells are now filled
    return board.getFilledCellCount() > 0;
});

// Test 9: Collision with locked piece
test('Cannot move through locked piece', () => {
    const board = new Board();
    const piece1 = new Piece('O');
    piece1.x = 4;
    piece1.y = 18;
    board.lockPiece(piece1);
    
    const piece2 = new Piece('O');
    piece2.x = 4;
    piece2.y = 17;
    
    return !board.isValidMove(piece2, 4, 18, 0);
});

// Test 10: Line clearing - single line
test('Can detect full line', () => {
    const board = new Board();
    // Fill bottom row
    for (let x = 0; x < 10; x++) {
        board.grid[19][x] = '#FF0000';
    }
    return board.isLineFull(19);
});

// Test 11: Line clearing - clear single line
test('Can clear single line', () => {
    const board = new Board();
    // Fill bottom row
    for (let x = 0; x < 10; x++) {
        board.grid[19][x] = '#FF0000';
    }
    const linesCleared = board.clearLines();
    return linesCleared === 1 && board.grid[19].every(cell => cell === 0);
});

// Test 12: Line clearing - multiple lines
test('Can clear multiple lines', () => {
    const board = new Board();
    // Fill bottom 3 rows
    for (let y = 17; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            board.grid[y][x] = '#FF0000';
        }
    }
    const linesCleared = board.clearLines();
    return linesCleared === 3;
});

// Test 13: Line clearing - gravity
test('Lines above cleared line drop down', () => {
    const board = new Board();
    // Place a block on row 17
    board.grid[17][5] = '#00FF00';
    // Fill row 19
    for (let x = 0; x < 10; x++) {
        board.grid[19][x] = '#FF0000';
    }
    board.clearLines();
    // Block should now be on row 18 (dropped one row)
    return board.grid[18][5] === '#00FF00';
});

// Test 14: Get completed lines
test('Can get list of completed lines', () => {
    const board = new Board();
    for (let x = 0; x < 10; x++) {
        board.grid[18][x] = '#FF0000';
        board.grid[19][x] = '#FF0000';
    }
    const completed = board.getCompletedLines();
    return completed.length === 2 && completed.includes(18) && completed.includes(19);
});

// Test 15: Game over detection
test('Detects game over when blocks reach top', () => {
    const board = new Board();
    board.grid[0][5] = '#FF0000';
    return board.isGameOver();
});

// Test 16: Not game over on empty board
test('Empty board is not game over', () => {
    const board = new Board();
    return !board.isGameOver();
});

// Test 17: Column height calculation
test('Can calculate column height', () => {
    const board = new Board();
    board.grid[19][5] = '#FF0000';
    board.grid[18][5] = '#FF0000';
    return board.getColumnHeight(5) === 2;
});

// Test 18: Drop distance calculation
test('Can calculate drop distance', () => {
    const board = new Board();
    const piece = new Piece('I');
    piece.x = 3;
    piece.y = 0;
    
    const distance = board.getDropDistance(piece);
    return distance > 0;
});

// Test 19: Drop distance with obstacle
test('Drop distance accounts for obstacles', () => {
    const board = new Board();
    // Place obstacle
    for (let x = 0; x < 10; x++) {
        board.grid[10][x] = '#FF0000';
    }
    
    const piece = new Piece('I');
    piece.x = 3;
    piece.y = 0;
    
    const distance = board.getDropDistance(piece);
    return distance < 10; // Should stop before row 10
});

// Test 20: Get cell value
test('Can get cell value', () => {
    const board = new Board();
    board.grid[5][5] = '#FF0000';
    return board.getCell(5, 5) === '#FF0000';
});

// Test 21: Set cell value
test('Can set cell value', () => {
    const board = new Board();
    board.setCell(5, 5, '#00FF00');
    return board.grid[5][5] === '#00FF00';
});

// Test 22: Get cell - out of bounds
test('getCell returns null for out of bounds', () => {
    const board = new Board();
    return board.getCell(-1, 0) === null && 
           board.getCell(0, -1) === null &&
           board.getCell(10, 0) === null &&
           board.getCell(0, 20) === null;
});

// Test 23: Board reset
test('Reset clears the board', () => {
    const board = new Board();
    board.grid[5][5] = '#FF0000';
    board.reset();
    return board.isEmpty();
});

// Test 24: Get grid copy
test('getGrid returns a copy', () => {
    const board = new Board();
    board.grid[5][5] = '#FF0000';
    const copy = board.getGrid();
    copy[5][5] = '#00FF00';
    return board.grid[5][5] === '#FF0000'; // Original unchanged
});

// Test 25: Count filled cells
test('Can count filled cells', () => {
    const board = new Board();
    board.grid[0][0] = '#FF0000';
    board.grid[0][1] = '#FF0000';
    board.grid[1][0] = '#FF0000';
    return board.getFilledCellCount() === 3;
});

// Test 26: isEmpty check
test('isEmpty returns true for empty board', () => {
    const board = new Board();
    return board.isEmpty();
});

// Test 27: isEmpty check - false
test('isEmpty returns false for non-empty board', () => {
    const board = new Board();
    board.grid[10][5] = '#FF0000';
    return !board.isEmpty();
});

// Test 28: Piece spawning above board
test('Allows pieces to spawn above visible board', () => {
    const board = new Board();
    const piece = new Piece('I');
    piece.y = -1; // Above board
    return board.isValidMove(piece, piece.x, piece.y, piece.rotation);
});

// Test 29: Complex collision scenario
test('Handles complex piece shapes in collision', () => {
    const board = new Board();
    const piece1 = new Piece('T');
    piece1.x = 4;
    piece1.y = 18;
    board.lockPiece(piece1);
    
    const piece2 = new Piece('T');
    piece2.x = 4;
    piece2.y = 16;
    
    // Should be able to place above
    return board.isValidMove(piece2, 4, 16, 0);
});

// Test 30: Line clear preserves blocks above
test('Line clear preserves blocks in rows above', () => {
    const board = new Board();
    
    // Place block on row 17
    board.grid[17][3] = '#00FF00';
    
    // Fill row 19
    for (let x = 0; x < 10; x++) {
        board.grid[19][x] = '#FF0000';
    }
    
    board.clearLines();
    
    // Block should still exist (now on row 18)
    return board.getFilledCellCount() === 1;
});

// Summary
console.log('═'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('\n✅ All Stage 3 tests passed! Ready for Stage 4.\n');
    process.exit(0);
} else {
    console.log(`\n❌ ${failed} test(s) failed. Please fix before continuing.\n`);
    process.exit(1);
}
