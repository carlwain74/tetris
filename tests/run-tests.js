#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output (basic fallback if chalk not available)
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Test results storage
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    skipped: 0,
    sections: []
};

// Load HTML file and set up DOM
async function setupDOM() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    const dom = new JSDOM(html, {
        url: 'http://localhost:8000/',
        runScripts: 'outside-only',
        resources: 'usable',
        pretendToBeVisual: true
    });

    global.window = dom.window;
    global.document = dom.window.document;
    
    // Use defineProperty for navigator (read-only in some Node versions)
    Object.defineProperty(global, 'navigator', {
        value: dom.window.navigator,
        writable: true,
        configurable: true
    });
    
    global.localStorage = {
        _data: {},
        setItem(key, value) { this._data[key] = value; },
        getItem(key) { return this._data[key] || null; },
        removeItem(key) { delete this._data[key]; },
        clear() { this._data = {}; }
    };

    // Mock canvas context
    const canvasMock = {
        getContext: () => ({
            fillRect: () => {},
            clearRect: () => {},
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fill: () => {},
            drawImage: () => {},
            save: () => {},
            restore: () => {},
            translate: () => {},
            rotate: () => {},
            scale: () => {}
        })
    };

    // Override createElement for canvas
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function(tagName) {
        const element = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'canvas') {
            element.getContext = canvasMock.getContext;
            element.width = 300;
            element.height = 600;
        }
        return element;
    };

    return dom;
}

// Load modules dynamically
async function loadModules() {
    const configPath = path.join(__dirname, '..', 'js', 'config.js');
    const config = await import(configPath);
    
    try {
        const rendererPath = path.join(__dirname, '..', 'js', 'renderer.js');
        const renderer = await import(rendererPath);
        
        const boardPath = path.join(__dirname, '..', 'js', 'board.js');
        const board = await import(boardPath);
        
        const piecesPath = path.join(__dirname, '..', 'js', 'pieces.js');
        const pieces = await import(piecesPath);
        
        const gamePath = path.join(__dirname, '..', 'js', 'game.js');
        const game = await import(gamePath);
        
        const inputPath = path.join(__dirname, '..', 'js', 'input.js');
        const input = await import(inputPath);
        
        return { config, renderer, board, pieces, game, input };
    } catch (error) {
        console.error(colorize('Error loading modules:', 'red'), error.message);
        return { config };
    }
}

// Test runner class
class TestRunner {
    constructor() {
        this.currentSection = null;
    }

    section(name, stage = null) {
        this.currentSection = {
            name,
            stage,
            tests: []
        };
        testResults.sections.push(this.currentSection);
        return this;
    }

    test(description, testFn, skip = false) {
        testResults.total++;
        
        if (skip) {
            testResults.skipped++;
            this.currentSection.tests.push({
                description,
                status: 'skip',
                message: 'Not yet implemented'
            });
            return this;
        }

        try {
            const result = testFn();
            let status = 'pass';
            let message = null;

            if (result === false) {
                status = 'fail';
                testResults.failed++;
            } else if (typeof result === 'object' && result !== null) {
                if (result.warning) {
                    status = 'warning';
                    message = result.message;
                    testResults.warnings++;
                } else if (result.skip) {
                    status = 'skip';
                    message = result.message || 'Skipped';
                    testResults.skipped++;
                } else {
                    testResults.passed++;
                    message = result.message || null;
                }
            } else {
                testResults.passed++;
            }

            this.currentSection.tests.push({ description, status, message });
        } catch (error) {
            testResults.failed++;
            this.currentSection.tests.push({
                description,
                status: 'fail',
                message: `Error: ${error.message}`
            });
        }

        return this;
    }
}

// Test definitions
function runStage1Tests(runner, modules) {
    const { config } = modules;
    const { CONFIG, PIECE_TYPES, CANVAS_IDS, UI_IDS, KEYS } = config;

    runner.section('📄 Stage 1: HTML Structure & DOM', 1)
        .test('Document body exists', () => document.body !== null)
        .test('Game canvas exists', () => {
            const canvas = document.getElementById(CANVAS_IDS.GAME);
            return canvas !== null;
        })
        .test('Game canvas has correct dimensions', () => {
            const canvas = document.getElementById(CANVAS_IDS.GAME);
            return canvas.width === 300 && canvas.height === 600;
        })
        .test('Hold canvas exists', () => 
            document.getElementById(CANVAS_IDS.HOLD) !== null)
        .test('All next piece canvases exist', () => {
            return document.getElementById(CANVAS_IDS.NEXT_1) &&
                   document.getElementById(CANVAS_IDS.NEXT_2) &&
                   document.getElementById(CANVAS_IDS.NEXT_3);
        })
        .test('UI elements exist', () => {
            return document.getElementById(UI_IDS.SCORE) &&
                   document.getElementById(UI_IDS.LEVEL) &&
                   document.getElementById(UI_IDS.LINES);
        });

    runner.section('⚙️ Stage 1: Configuration', 1)
        .test('CONFIG object exists', () => typeof CONFIG === 'object')
        .test('Board dimensions correct', () => 
            CONFIG.BOARD_WIDTH === 10 && CONFIG.BOARD_HEIGHT === 20)
        .test('All piece types defined', () => PIECE_TYPES.length === 7)
        .test('All colors defined', () => {
            return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'].every(
                type => CONFIG.COLORS[type] !== undefined
            );
        })
        .test('Scoring configured', () => 
            CONFIG.POINTS.SINGLE && CONFIG.POINTS.TETRIS)
        .test('Key bindings configured', () => 
            KEYS.LEFT && KEYS.RIGHT && KEYS.ROTATE_CW);
}

function runStage2Tests(runner, modules) {
    const { pieces } = modules;
    if (!pieces) {
        runner.section('🧩 Stage 2: Piece Definitions', 2)
            .test('PIECES object exists', () => false, true);
        return;
    }

    const { PIECES, Piece } = pieces;
    const implemented = PIECES && Object.keys(PIECES).length > 0;

    runner.section('🧩 Stage 2: Piece Definitions', 2)
        .test('PIECES object exists', () => typeof PIECES === 'object', !implemented)
        .test('All 7 pieces defined', () => {
            return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'].every(
                type => PIECES[type] !== undefined
            );
        }, !implemented)
        .test('Piece class exists', () => typeof Piece === 'function', !implemented)
        .test('Piece can be instantiated', () => {
            try {
                const piece = new Piece('I');
                return piece !== null;
            } catch (e) {
                return false;
            }
        }, !implemented);
}

function runStage3Tests(runner, modules) {
    const { board } = modules;
    if (!board) {
        runner.section('📋 Stage 3: Board Management', 3)
            .test('Board class exists', () => false, true);
        return;
    }

    const { Board } = board;
    const implemented = typeof Board === 'function';

    runner.section('📋 Stage 3: Board Management', 3)
        .test('Board class exists', () => typeof Board === 'function', !implemented)
        .test('Board can be instantiated', () => {
            try {
                const b = new Board();
                return b !== null;
            } catch (e) {
                return false;
            }
        }, !implemented)
        .test('Board has correct dimensions', () => {
            try {
                const b = new Board();
                return b.width === 10 && b.height === 20;
            } catch (e) {
                return false;
            }
        }, !implemented);
}

function runStage4Tests(runner, modules) {
    const { game, renderer } = modules;
    if (!game || !renderer) {
        runner.section('🎮 Stage 4: Game Logic', 4)
            .test('Game class exists', () => false, true);
        return;
    }

    const { Game } = game;
    const { Renderer } = renderer;
    const implemented = typeof Game === 'function';

    runner.section('🎮 Stage 4: Game Logic', 4)
        .test('Game class exists', () => typeof Game === 'function', !implemented)
        .test('Game can be instantiated', () => {
            try {
                const r = new Renderer();
                const g = new Game(r, null);
                return g !== null;
            } catch (e) {
                return false;
            }
        }, !implemented);
}

// Print results
function printResults() {
    console.log('\n' + colorize('═'.repeat(80), 'cyan'));
    console.log(colorize('  TETRIS TEST SUITE RESULTS', 'bright'));
    console.log(colorize('═'.repeat(80), 'cyan') + '\n');

    // Summary
    const passRate = testResults.total > 0 ? 
        Math.round((testResults.passed / testResults.total) * 100) : 0;
    
    console.log(colorize('Summary:', 'bright'));
    console.log(`  Total:    ${testResults.total}`);
    console.log(`  ${colorize('Passed:', 'green')}   ${testResults.passed}`);
    console.log(`  ${colorize('Failed:', 'red')}   ${testResults.failed}`);
    console.log(`  ${colorize('Warnings:', 'yellow')} ${testResults.warnings}`);
    console.log(`  ${colorize('Skipped:', 'gray')}  ${testResults.skipped}`);
    console.log(`  ${colorize('Pass Rate:', 'cyan')} ${passRate}%\n`);

    // Detailed results
    testResults.sections.forEach(section => {
        const sectionPassed = section.tests.filter(t => t.status === 'pass').length;
        const sectionTotal = section.tests.length;
        const allPassed = section.tests.every(t => t.status === 'pass' || t.status === 'skip');
        
        const statusColor = allPassed ? 'green' : 'red';
        const statusText = allPassed ? '✓' : '✗';
        
        console.log(colorize(`${statusText} ${section.name}`, statusColor) + 
                    colorize(` (${sectionPassed}/${sectionTotal})`, 'gray'));
        
        section.tests.forEach(test => {
            let icon, color;
            switch(test.status) {
                case 'pass': icon = '  ✓'; color = 'green'; break;
                case 'fail': icon = '  ✗'; color = 'red'; break;
                case 'skip': icon = '  ⊘'; color = 'gray'; break;
                case 'warning': icon = '  ⚠'; color = 'yellow'; break;
            }
            
            console.log(`  ${colorize(icon, color)} ${test.description}`);
            if (test.message) {
                console.log(colorize(`      ${test.message}`, 'gray'));
            }
        });
        console.log('');
    });

    console.log(colorize('═'.repeat(80), 'cyan'));
    
    // Exit code based on results
    if (testResults.failed > 0) {
        console.log(colorize('\n❌ Tests failed!', 'red'));
        process.exit(1);
    } else if (testResults.warnings > 0) {
        console.log(colorize('\n⚠️  Tests passed with warnings', 'yellow'));
        process.exit(0);
    } else {
        console.log(colorize('\n✅ All tests passed!', 'green'));
        process.exit(0);
    }
}

// Main test execution
async function main() {
    console.log(colorize('\n🎮 Tetris Test Suite\n', 'cyan'));
    console.log('Loading DOM and modules...\n');

    try {
        await setupDOM();
        const modules = await loadModules();

        const runner = new TestRunner();

        // Run tests based on arguments
        const args = process.argv.slice(2);
        const stageArg = args.find(arg => arg.startsWith('--stage='));
        
        if (stageArg) {
            const stage = parseInt(stageArg.split('=')[1]);
            console.log(colorize(`Running Stage ${stage} tests only...\n`, 'cyan'));
            
            switch(stage) {
                case 1: runStage1Tests(runner, modules); break;
                case 2: runStage2Tests(runner, modules); break;
                case 3: runStage3Tests(runner, modules); break;
                case 4: runStage4Tests(runner, modules); break;
                default: console.log('Invalid stage number'); process.exit(1);
            }
        } else {
            console.log(colorize('Running all tests...\n', 'cyan'));
            runStage1Tests(runner, modules);
            runStage2Tests(runner, modules);
            runStage3Tests(runner, modules);
            runStage4Tests(runner, modules);
        }

        printResults();

    } catch (error) {
        console.error(colorize('Fatal error:', 'red'), error);
        process.exit(1);
    }
}

main();
