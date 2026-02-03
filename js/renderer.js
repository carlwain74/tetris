// Canvas rendering system
// Stage 5: Complete implementation

import { CONFIG, CANVAS_IDS, UI_IDS } from './config.js';
import { PIECES } from './pieces.js';

/**
 * Renderer class handles all canvas drawing and UI updates
 */
export class Renderer {
    constructor() {
        // Get canvas elements
        this.gameCanvas = document.getElementById(CANVAS_IDS.GAME);
        this.holdCanvas = document.getElementById(CANVAS_IDS.HOLD);
        this.next1Canvas = document.getElementById(CANVAS_IDS.NEXT_1);
        this.next2Canvas = document.getElementById(CANVAS_IDS.NEXT_2);
        this.next3Canvas = document.getElementById(CANVAS_IDS.NEXT_3);
        
        // Get contexts
        this.gameCtx = this.gameCanvas?.getContext('2d');
        this.holdCtx = this.holdCanvas?.getContext('2d');
        this.next1Ctx = this.next1Canvas?.getContext('2d');
        this.next2Ctx = this.next2Canvas?.getContext('2d');
        this.next3Ctx = this.next3Canvas?.getContext('2d');
        
        // Get UI elements
        this.scoreElement = document.getElementById(UI_IDS.SCORE);
        this.levelElement = document.getElementById(UI_IDS.LEVEL);
        this.linesElement = document.getElementById(UI_IDS.LINES);
        this.highScoreElement = document.getElementById(UI_IDS.HIGH_SCORE);
        this.finalScoreElement = document.getElementById(UI_IDS.FINAL_SCORE);
        
        // Get screen overlays
        this.startScreen = document.getElementById(UI_IDS.START_SCREEN);
        this.pauseScreen = document.getElementById(UI_IDS.PAUSE_SCREEN);
        this.gameOverScreen = document.getElementById(UI_IDS.GAME_OVER_SCREEN);
        
        this.cellSize = CONFIG.CELL_SIZE;
    }
    
    /**
     * Draw the complete game board with pieces
     * @param {Board} board - Game board
     * @param {Piece} currentPiece - Currently falling piece
     * @param {Piece} ghostPiece - Ghost piece showing drop position
     */
    drawBoard(board, currentPiece, ghostPiece) {
        if (!this.gameCtx) return;
        
        // Clear canvas
        this.clear(this.gameCanvas, this.gameCtx);
        
        // Draw locked pieces on board
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                if (board.grid[y][x]) {
                    this.drawCell(x, y, board.grid[y][x], this.gameCtx);
                }
            }
        }
        
        // Draw ghost piece (if exists)
        if (ghostPiece) {
            this.drawGhostPiece(ghostPiece);
        }
        
        // Draw current piece (if exists)
        if (currentPiece) {
            this.drawPieceOnBoard(currentPiece);
        }
        
        // Draw grid lines
        this.drawGrid(this.gameCtx, board.width, board.height);
    }
    
    /**
     * Draw a piece on the game board
     * @param {Piece} piece - Piece to draw
     */
    drawPieceOnBoard(piece) {
        if (!this.gameCtx) return;
        
        const shape = piece.getShape();
        const color = piece.getColor();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = piece.x + col;
                    const y = piece.y + row;
                    if (y >= 0) { // Only draw if visible
                        this.drawCell(x, y, color, this.gameCtx);
                    }
                }
            }
        }
    }
    
    /**
     * Draw ghost piece (semi-transparent preview)
     * @param {Piece} ghostPiece - Ghost piece to draw
     */
    drawGhostPiece(ghostPiece) {
        if (!this.gameCtx) return;
        
        const shape = ghostPiece.getShape();
        const color = ghostPiece.getColor();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = ghostPiece.x + col;
                    const y = ghostPiece.y + row;
                    if (y >= 0) {
                        this.drawGhostCell(x, y, color, this.gameCtx);
                    }
                }
            }
        }
    }
    
    /**
     * Draw a single cell
     * @param {number} x - Grid x position
     * @param {number} y - Grid y position
     * @param {string} color - Cell color
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawCell(x, y, color, ctx) {
        const pixelX = x * this.cellSize;
        const pixelY = y * this.cellSize;
        
        // Draw filled cell
        ctx.fillStyle = color;
        ctx.fillRect(pixelX, pixelY, this.cellSize, this.cellSize);
        
        // Draw cell border for 3D effect
        ctx.strokeStyle = this.lightenColor(color, 20);
        ctx.lineWidth = 2;
        ctx.strokeRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2);
        
        // Inner shadow for depth
        ctx.strokeStyle = this.darkenColor(color, 20);
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX + 3, pixelY + 3, this.cellSize - 6, this.cellSize - 6);
    }
    
    /**
     * Draw a ghost cell (semi-transparent)
     * @param {number} x - Grid x position
     * @param {number} y - Grid y position
     * @param {string} color - Cell color
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawGhostCell(x, y, color, ctx) {
        const pixelX = x * this.cellSize;
        const pixelY = y * this.cellSize;
        
        // Draw semi-transparent outline
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(pixelX + 2, pixelY + 2, this.cellSize - 4, this.cellSize - 4);
        
        // Optional: fill with very transparent color
        ctx.fillStyle = color + '20'; // Add alpha
        ctx.fillRect(pixelX + 2, pixelY + 2, this.cellSize - 4, this.cellSize - 4);
    }
    
    /**
     * Draw grid lines
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Grid width
     * @param {number} height - Grid height
     */
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= width; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.cellSize, 0);
            ctx.lineTo(x * this.cellSize, height * this.cellSize);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.cellSize);
            ctx.lineTo(width * this.cellSize, y * this.cellSize);
            ctx.stroke();
        }
    }
    
    /**
     * Draw next pieces preview
     * @param {Array<string>} pieceTypes - Array of piece type strings
     */
    drawNextPieces(pieceTypes) {
        const contexts = [this.next1Ctx, this.next2Ctx, this.next3Ctx];
        const canvases = [this.next1Canvas, this.next2Canvas, this.next3Canvas];
        
        for (let i = 0; i < Math.min(3, pieceTypes.length); i++) {
            if (contexts[i] && canvases[i]) {
                this.clear(canvases[i], contexts[i]);
                this.drawPiecePreview(pieceTypes[i], contexts[i]);
            }
        }
    }
    
    /**
     * Draw held piece
     * @param {string|null} pieceType - Piece type or null
     */
    drawHeldPiece(pieceType) {
        if (!this.holdCtx || !this.holdCanvas) return;
        
        this.clear(this.holdCanvas, this.holdCtx);
        
        if (pieceType) {
            this.drawPiecePreview(pieceType, this.holdCtx);
        }
    }
    
    /**
     * Draw a piece preview (for hold/next)
     * @param {string} pieceType - Piece type
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawPiecePreview(pieceType, ctx) {
        const piece = PIECES[pieceType];
        if (!piece) return;
        
        const shape = piece.shapes[0]; // Use first rotation
        const color = piece.color;
        const previewCellSize = 25; // Smaller cells for preview
        
        // Calculate centering offset
        const pieceWidth = shape[0].length;
        const pieceHeight = shape.length;
        const offsetX = (4 - pieceWidth) * previewCellSize / 2;
        const offsetY = (4 - pieceHeight) * previewCellSize / 2;
        
        // Draw piece
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * previewCellSize;
                    const y = offsetY + row * previewCellSize;
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, previewCellSize, previewCellSize);
                    
                    // Border
                    ctx.strokeStyle = this.lightenColor(color, 20);
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + 1, y + 1, previewCellSize - 2, previewCellSize - 2);
                }
            }
        }
    }
    
    /**
     * Update score display
     * @param {number} score - Current score
     * @param {number} level - Current level
     * @param {number} lines - Lines cleared
     * @param {number} highScore - High score
     */
    updateScore(score, level, lines, highScore) {
        if (this.scoreElement) this.scoreElement.textContent = score.toString();
        if (this.levelElement) this.levelElement.textContent = level.toString();
        if (this.linesElement) this.linesElement.textContent = lines.toString();
        if (this.highScoreElement) this.highScoreElement.textContent = highScore.toString();
    }
    
    /**
     * Show start screen
     */
    showStartScreen() {
        if (this.startScreen) {
            this.startScreen.style.display = 'flex';
        }
    }
    
    /**
     * Hide start screen
     */
    hideStartScreen() {
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
    }
    
    /**
     * Show pause screen
     */
    showPauseScreen() {
        if (this.pauseScreen) {
            this.pauseScreen.style.display = 'flex';
        }
    }
    
    /**
     * Hide pause screen
     */
    hidePauseScreen() {
        if (this.pauseScreen) {
            this.pauseScreen.style.display = 'none';
        }
    }
    
    /**
     * Show game over screen
     * @param {number} score - Final score
     * @param {boolean} isHighScore - Whether this is a new high score
     */
    showGameOverScreen(score, isHighScore) {
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'flex';
        }
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = score.toString();
        }
        
        // Show "New High Score!" message if applicable
        const highScoreMessage = this.gameOverScreen?.querySelector('.high-score-message');
        if (highScoreMessage) {
            highScoreMessage.style.display = isHighScore ? 'block' : 'none';
        }
    }
    
    /**
     * Hide game over screen
     */
    hideGameOverScreen() {
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
    }
    
    /**
     * Clear a canvas
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    clear(canvas, ctx) {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Lighten a color
     * @param {string} color - Hex color
     * @param {number} amount - Amount to lighten (0-100)
     * @returns {string} Lightened color
     */
    lightenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + amount);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount);
        const b = Math.min(255, (num & 0xff) + amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    
    /**
     * Darken a color
     * @param {string} color - Hex color
     * @param {number} amount - Amount to darken (0-100)
     * @returns {string} Darkened color
     */
    darkenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, ((num >> 16) & 0xff) - amount);
        const g = Math.max(0, ((num >> 8) & 0xff) - amount);
        const b = Math.max(0, (num & 0xff) - amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    
    /**
     * Render a complete frame
     * @param {object} gameState - Complete game state
     */
    render(gameState) {
        // Draw main board
        this.drawBoard(
            gameState.board,
            gameState.currentPiece,
            gameState.ghostPiece
        );
        
        // Draw next pieces
        if (gameState.nextPieces) {
            this.drawNextPieces(gameState.nextPieces);
        }
        
        // Draw held piece
        if (gameState.heldPiece !== undefined) {
            this.drawHeldPiece(gameState.heldPiece);
        }
        
        // Update score display
        this.updateScore(
            gameState.score || 0,
            gameState.level || 1,
            gameState.lines || 0,
            gameState.highScore || 0
        );
    }
}
