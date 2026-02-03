#!/usr/bin/env node

/**
 * Visual demonstration of board features
 */

import { Board } from '../js/board.js';
import { Piece } from '../js/pieces.js';

console.log('\n🎮 Board Management - Visual Demo\n');
console.log('═'.repeat(60));

// Helper to draw board
function drawBoard(board, title) {
    console.log(`\n${title}`);
    console.log('┌' + '─'.repeat(20) + '┐');
    
    for (let y = 0; y < Math.min(10, board.height); y++) {
        let row = '│';
        for (let x = 0; x < board.width; x++) {
            row += board.grid[y][x] ? '██' : '  ';
        }
        row += '│';
        console.log(row);
    }
    
    console.log('└' + '─'.repeat(20) + '┘');
}

// Demo 1: Empty board
console.log('\n📋 Demo 1: Empty Board');
const board1 = new Board();
drawBoard(board1, 'New Board (10×20)');
console.log(`Filled cells: ${board1.getFilledCellCount()}`);
console.log(`Is empty: ${board1.isEmpty()}`);

// Demo 2: Lock a piece
console.log('\n📋 Demo 2: Locking Pieces');
const board2 = new Board();
const piece1 = new Piece('I');
piece1.x = 3;
piece1.y = 8;
board2.lockPiece(piece1);
drawBoard(board2, 'After locking I piece');
console.log(`Filled cells: ${board2.getFilledCellCount()}`);

// Demo 3: Stack multiple pieces
console.log('\n📋 Demo 3: Stacking Pieces');
const board3 = new Board();

const pieceO = new Piece('O');
pieceO.x = 4;
pieceO.y = 8;
board3.lockPiece(pieceO);

const pieceT = new Piece('T');
pieceT.x = 1;
pieceT.y = 8;
board3.lockPiece(pieceT);

const pieceL = new Piece('L');
pieceL.x = 7;
pieceL.y = 8;
board3.lockPiece(pieceL);

drawBoard(board3, 'Three pieces locked');
console.log(`Filled cells: ${board3.getFilledCellCount()}`);

// Demo 4: Line clearing
console.log('\n📋 Demo 4: Line Clearing');
const board4 = new Board();

// Fill rows 8 and 9 completely
for (let x = 0; x < 10; x++) {
    board4.grid[8][x] = '█';
    board4.grid[9][x] = '█';
}

// Add some blocks above
board4.grid[7][3] = '█';
board4.grid[7][4] = '█';
board4.grid[6][4] = '█';

console.log('Before clearing:');
drawBoard(board4, 'Two full lines at bottom');
console.log(`Completed lines: ${board4.getCompletedLines().join(', ')}`);

const linesCleared = board4.clearLines();

console.log('\nAfter clearing:');
drawBoard(board4, `Cleared ${linesCleared} lines`);
console.log(`Lines cleared: ${linesCleared}`);
console.log(`Filled cells remaining: ${board4.getFilledCellCount()}`);

// Demo 5: Collision detection
console.log('\n📋 Demo 5: Collision Detection');
const board5 = new Board();

// Place obstacle
for (let x = 0; x < 10; x++) {
    board5.grid[7][x] = '█';
}

const testPiece = new Piece('I');
testPiece.x = 3;
testPiece.y = 5;

drawBoard(board5, 'Board with obstacle at row 7');

console.log(`\nTesting I piece at position (3, 5):`);
console.log(`  Can place at y=5: ${board5.isValidMove(testPiece, 3, 5, 0)}`);
console.log(`  Can place at y=6: ${board5.isValidMove(testPiece, 3, 6, 0)}`);
console.log(`  Can place at y=7: ${board5.isValidMove(testPiece, 3, 7, 0)}`);
console.log(`  Drop distance from y=5: ${board5.getDropDistance(testPiece)}`);

// Demo 6: Column heights
console.log('\n📋 Demo 6: Column Heights');
const board6 = new Board();

// Create irregular surface
board6.grid[9][0] = '█';
board6.grid[9][1] = '█';
board6.grid[8][1] = '█';
board6.grid[9][2] = '█';
board6.grid[8][2] = '█';
board6.grid[7][2] = '█';
board6.grid[9][4] = '█';
board6.grid[8][4] = '█';
board6.grid[7][4] = '█';
board6.grid[6][4] = '█';

drawBoard(board6, 'Irregular surface');

console.log('\nColumn heights:');
for (let x = 0; x < 10; x++) {
    const height = board6.getColumnHeight(x);
    if (height > 0) {
        console.log(`  Column ${x}: ${height} blocks high`);
    }
}

// Demo 7: Game over scenario
console.log('\n📋 Demo 7: Game Over Detection');
const board7 = new Board();

console.log('Empty board - Game over?', board7.isGameOver());

// Stack to near top
for (let y = 2; y < 10; y++) {
    board7.grid[y][5] = '█';
}

console.log('Stack at column 5 - Game over?', board7.isGameOver());

// Reach top
board7.grid[0][5] = '█';

console.log('Block in top row - Game over?', board7.isGameOver());

drawBoard(board7, 'Game Over State');

console.log('\n═'.repeat(60));
console.log('\n✨ All demonstrations complete!\n');
