#!/usr/bin/env node

/**
 * Visual demonstration of all tetromino pieces and rotations
 */

import { PIECES } from '../js/pieces.js';

console.log('\n🎮 Tetris Pieces - Visual Display\n');
console.log('═'.repeat(70));

const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

PIECE_TYPES.forEach(type => {
    const piece = PIECES[type];
    console.log(`\n${type} Piece (${piece.color}):`);
    console.log('─'.repeat(70));
    
    // Display all 4 rotations side by side
    console.log('Rotation 0:      Rotation 1:      Rotation 2:      Rotation 3:');
    
    for (let row = 0; row < 4; row++) {
        let line = '';
        for (let rotation = 0; rotation < 4; rotation++) {
            const shape = piece.shapes[rotation];
            for (let col = 0; col < 4; col++) {
                line += shape[row][col] === 1 ? '██' : '  ';
            }
            line += '     '; // Space between rotations
        }
        console.log(line);
    }
});

console.log('\n═'.repeat(70));
console.log('\n✨ All pieces rendered successfully!\n');
