# Tetris Game 🎮

A browser-based Tetris clone built with vanilla JavaScript, HTML5 Canvas, and CSS. No frameworks, no dependencies (except for testing) - just pure web technologies.

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Contributing](#contributing)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)

## About

This project is a complete implementation of the classic Tetris game, featuring all seven tetromino pieces, authentic rotation mechanics, line clearing, scoring, and progressive difficulty. The game is designed to run entirely in the browser with no backend required.

**Technology Stack:**
- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6 modules)
- CSS3 for UI and responsive design
- LocalStorage for high score persistence

**Current Status:** Stage 1 Complete - Foundation & Setup

## Features

### Current Features (Stage 1)
- ✅ Responsive game interface (desktop & mobile)
- ✅ Beautiful gradient UI design
- ✅ Game canvas (10×20 grid)
- ✅ Hold piece display
- ✅ Next pieces preview (3 pieces)
- ✅ Score, level, and lines tracking
- ✅ Start, pause, and game over screens
- ✅ High score persistence

### Planned Features

#### Stage 2: Tetromino Pieces
- [ ] All 7 classic pieces (I, O, T, S, Z, J, L)
- [ ] 4 rotation states per piece
- [ ] Super Rotation System (SRS)
- [ ] Wall kicks for edge rotations
- [ ] Random piece generation (7-bag system)

#### Stage 3: Board Management
- [ ] Collision detection
- [ ] Piece locking
- [ ] Line clearing (single, double, triple, Tetris)
- [ ] Gravity and line drops
- [ ] Game over detection

#### Stage 4: Core Game Logic
- [ ] Game loop with requestAnimationFrame
- [ ] Automatic piece dropping
- [ ] Level progression (every 10 lines)
- [ ] Speed increase with levels
- [ ] Scoring system:
  - Single: 100 × level
  - Double: 300 × level
  - Triple: 500 × level
  - Tetris: 800 × level
  - Soft drop: 1 point per cell
  - Hard drop: 2 points per cell

#### Stage 5: Rendering
- [ ] Piece rendering with colors
- [ ] Ghost piece (shows landing position)
- [ ] Grid lines
- [ ] Line clear animations
- [ ] Lock animations
- [ ] Visual effects

#### Stage 6: Input Controls
- [ ] Keyboard controls:
  - Arrow Keys: Move and rotate
  - Space: Hard drop
  - C/Shift: Hold piece
  - P/Escape: Pause
- [ ] Touch controls for mobile
- [ ] DAS (Delayed Auto Shift)
- [ ] ARR (Auto Repeat Rate)

#### Future Enhancements
- [ ] Sound effects and music
- [ ] Multiple game modes (Marathon, Sprint, Ultra)
- [ ] Customizable themes
- [ ] Combo system
- [ ] T-spin detection
- [ ] Statistics tracking
- [ ] Online leaderboards
- [ ] Multiplayer mode

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Node.js v18+ (only required for testing)

### Local Installation

1. **Download the project:**
   ```bash
   # Option 1: Download and extract the ZIP file
   # Option 2: Clone the repository (if using git)
   git clone <repository-url>
   cd tetris-game
   ```

2. **Install dependencies (for testing only):**
   ```bash
   npm install
   ```

3. **Run the game:**
   
   **Option A: Direct file access (simplest)**
   ```bash
   # Just open index.html in your browser
   open index.html  # macOS
   start index.html  # Windows
   xdg-open index.html  # Linux
   ```
   
   **Option B: Use the built-in test server**
   ```bash
   npm run test:browser
   # Navigate to: http://localhost:8000/index.html
   ```
   
   **Option C: Use Python's HTTP server**
   ```bash
   python -m http.server 8000
   # Navigate to: http://localhost:8000/index.html
   ```

4. **Verify installation:**
   - You should see the Tetris game interface
   - Start screen displays "Press any key to start"
   - All UI elements are visible and properly styled

## How to Play

### Game Controls

#### Keyboard (Desktop)

| Key | Action |
|-----|--------|
| ← (Left Arrow) | Move piece left |
| → (Right Arrow) | Move piece right |
| ↓ (Down Arrow) | Soft drop (move down faster) |
| ↑ (Up Arrow) or X | Rotate clockwise |
| Z | Rotate counter-clockwise |
| Space | Hard drop (instant drop to bottom) |
| C or Shift | Hold current piece |
| P or Escape | Pause/Resume game |
| R | Restart (on game over screen) |

#### Touch Controls (Mobile)
*Coming in Stage 6*
- Tap left/right: Move piece
- Swipe up: Rotate
- Swipe down: Hard drop
- Two-finger tap: Hold piece

### Gameplay

1. **Starting the Game:**
   - Open the game in your browser
   - Press any key to begin
   - Pieces will start falling from the top

2. **Objective:**
   - Arrange falling tetrominoes to create complete horizontal lines
   - Complete lines disappear and award points
   - Prevent pieces from stacking to the top

3. **Scoring:**
   - **Single line:** 100 points × current level
   - **Double (2 lines):** 300 points × current level
   - **Triple (3 lines):** 500 points × current level
   - **Tetris (4 lines):** 800 points × current level
   - **Soft drop:** 1 point per cell dropped
   - **Hard drop:** 2 points per cell dropped

4. **Level Progression:**
   - Clear 10 lines to advance to the next level
   - Each level increases the falling speed
   - Higher levels = more points per line cleared

5. **Hold Feature:**
   - Press C or Shift to hold the current piece
   - Swap with held piece to use later
   - Can only hold once per piece

6. **Game Over:**
   - Game ends when pieces stack to the top
   - High score is saved automatically
   - Press R to restart

### Tips & Strategies

- **Use the ghost piece** to see where your piece will land
- **Plan ahead** by checking the next pieces preview
- **Keep the field flat** to avoid creating gaps
- **Save I-pieces** for clearing multiple lines (Tetris)
- **Use the hold feature** strategically for difficult situations
- **Soft drop vs Hard drop:** Use soft drop to adjust position, hard drop when placement is perfect

## Contributing

We welcome contributions! Whether you're fixing bugs, implementing features, or improving documentation, your help is appreciated.

### Development Setup

1. **Fork and clone the repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Understand the project structure:**
   ```
   tetris-game/
   ├── index.html          # Main game HTML
   ├── css/
   │   └── styles.css      # All styling
   ├── js/
   │   ├── config.js       # Game constants
   │   ├── pieces.js       # Tetromino definitions (Stage 2)
   │   ├── board.js        # Board management (Stage 3)
   │   ├── game.js         # Core game logic (Stage 4)
   │   ├── renderer.js     # Canvas rendering (Stage 5)
   │   ├── input.js        # Input handling (Stage 6)
   │   └── main.js         # Entry point
   └── tests/              # Test suite
   ```

4. **Check the development roadmap:**
   - See which stage is currently in development
   - Review the implementation plan (see `/tetris_implementation_plan.md`)
   - Pick a feature or fix a bug

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the existing code style
   - Use ES6 modules
   - Add comments for complex logic
   - Keep functions small and focused

3. **Test your changes:**
   ```bash
   # Run the test suite
   npm test
   
   # Or use browser tests for interactive debugging
   npm run test:browser
   ```

4. **Verify everything works:**
   - Open `index.html` in your browser
   - Test the functionality manually
   - Ensure no console errors
   - Check responsive design (resize window)

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add description of your changes"
   ```
   
   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Test additions or changes
   - `refactor:` Code refactoring
   - `style:` Code formatting changes

6. **Push and create a pull request**

### Code Style Guidelines

- **Indentation:** 4 spaces
- **Naming:**
  - Classes: PascalCase (`class GameBoard`)
  - Functions: camelCase (`function movePiece()`)
  - Constants: UPPER_SNAKE_CASE (`const BOARD_WIDTH`)
  - Private methods: prefix with underscore (`_privateMethod()`)
- **Comments:** Use JSDoc style for functions
- **Line length:** Keep under 100 characters when possible
- **ES6 Features:** Use modern JavaScript (arrow functions, destructuring, etc.)

### Areas for Contribution

**High Priority:**
- Implementing Stage 2 (Tetromino pieces and rotation)
- Implementing Stage 3 (Board management and collision)
- Bug fixes and optimizations

**Medium Priority:**
- Implementing Stage 4-6
- Adding sound effects
- Improving animations

**Nice to Have:**
- Additional game modes
- Mobile touch controls optimization
- Accessibility improvements
- Performance optimizations

## Testing

### Overview

The project includes a comprehensive test suite that tests all game components. Tests automatically detect which features are implemented and skip tests for incomplete features.

### Running Tests

#### Browser Tests (Interactive)

Best for development and debugging:

```bash
npm run test:browser
# Open http://localhost:8000 in your browser
```

Features:
- Visual test results with color coding
- Filter tests by status (pass/fail/warning/skip)
- Run all tests or specific stages
- Real-time progress tracking

#### Command Line Tests (CI/CD)

Best for automation and quick validation:

```bash
# Run all tests
npm test

# Run specific stage
npm test -- --stage=1
npm test -- --stage=2
```

Output:
- Color-coded terminal results
- Detailed pass/fail information
- Exit code 0 (success) or 1 (failure)

### Test Workflow

**Before making changes:**
```bash
# Check current test status
npm test
```

**During development:**
```bash
# Use interactive browser tests
npm run test:browser
# Refresh browser after each code change
```

**After completing changes:**
```bash
# Run full test suite
npm test

# Should show:
# - All existing tests still pass
# - New tests pass (if you implemented new features)
# - 0 failures
```

**Before committing:**
```bash
# Final verification
npm test

# All tests should pass (or be skipped if feature not implemented)
```

### Test Structure

Tests are organized by development stage:

1. **Stage 1: Foundation** (~15-20 tests)
   - HTML structure
   - Configuration
   - Renderer setup
   - All should pass ✓

2. **Stage 2: Pieces** (~7 tests)
   - Piece definitions
   - Rotation mechanics
   - Currently skipped (not implemented)

3. **Stage 3: Board** (~6 tests)
   - Grid management
   - Collision detection
   - Currently skipped

4. **Stage 4: Game Logic** (~4 tests)
   - Game state
   - Scoring
   - Currently skipped

5. **Stage 5: Rendering** (tests TBD)
   - Canvas drawing
   - Currently skipped

6. **Stage 6: Input** (tests TBD)
   - Keyboard handling
   - Currently skipped

### Success Criteria

✅ **Ready to commit when:**
- All implemented features pass tests
- 0 test failures
- Warnings are acceptable (0-2 typical)
- Skipped tests are expected for unimplemented features

### Troubleshooting Tests

**Tests won't run:**
```bash
# Ensure dependencies are installed
npm install

# Verify Node.js version (v18+ required)
node --version
```

**All tests show as skipped:**
- This is normal! Tests auto-skip until features are implemented
- Implement the feature, tests will automatically run

**LocalStorage warnings:**
- These are acceptable
- Browser privacy settings may block localStorage
- Doesn't affect core functionality

For more detailed testing information, see:
- `TESTING.md` - Comprehensive testing guide
- `TEST-QUICK-REF.md` - Quick command reference

## Project Structure

### File Organization

```
tetris-game/
├── index.html              # Main game HTML
├── package.json            # NPM dependencies and scripts
├── .gitignore              # Git ignore rules
│
├── css/
│   └── styles.css          # All styling (responsive design)
│
├── js/
│   ├── config.js           # Game constants and configuration
│   ├── pieces.js           # Tetromino definitions (Stage 2)
│   ├── board.js            # Board management (Stage 3)
│   ├── game.js             # Core game logic (Stage 4)
│   ├── renderer.js         # Canvas rendering (Stage 5)
│   ├── input.js            # Input handling (Stage 6)
│   └── main.js             # Application entry point
│
├── tests/
│   ├── index.html          # Browser test runner
│   ├── run-tests.js        # CLI test runner
│   ├── browser-test-server.js  # Development server
│   └── verify-fix.js       # Verification script
│
├── assets/
│   ├── images/             # Game images (sprites, logos)
│   └── sounds/             # Sound effects and music
│
└── docs/
    ├── README.md           # This file
    ├── TESTING.md          # Testing guide
    ├── TEST-QUICK-REF.md   # Quick test reference
    ├── CHANGELOG.md        # Version history
    └── FILE-STRUCTURE.md   # Detailed file descriptions
```

### Module Responsibilities

- **config.js** - All game constants (board size, colors, speeds, scoring)
- **pieces.js** - Tetromino shapes, rotations, and piece logic
- **board.js** - Grid management, collision detection, line clearing
- **game.js** - Game state, score tracking, level progression, game loop
- **renderer.js** - Canvas drawing, visual effects, UI updates
- **input.js** - Keyboard/touch input, DAS/ARR implementation
- **main.js** - Initialization, orchestrates all modules

## Development Roadmap

### ✅ Stage 1: Foundation (Complete)
- Project structure and file organization
- HTML/CSS layout and responsive design
- Configuration system
- Renderer initialization
- Test suite setup

### 🔨 Stage 2: Tetromino Pieces (In Progress)
- Define all 7 piece types with rotations
- Implement rotation mechanics (SRS)
- Piece spawning system
- 7-bag randomizer

### 📋 Stage 3: Board Management (Planned)
- Grid data structure
- Collision detection
- Piece locking
- Line clearing logic
- Game over detection

### 🎮 Stage 4: Core Game Logic (Planned)
- Game loop implementation
- Automatic piece dropping
- Scoring system
- Level progression
- Game state management

### 🖼️ Stage 5: Rendering (Planned)
- Draw pieces on canvas
- Ghost piece rendering
- Line clear animations
- Visual effects
- UI updates

### ⌨️ Stage 6: Input Handling (Planned)
- Keyboard controls
- Touch controls for mobile
- DAS/ARR implementation
- Input buffering

### 🎵 Stage 7: Polish & Enhancement (Future)
- Sound effects and music
- Additional game modes
- Customization options
- Performance optimization

## License

[Specify your license here - e.g., MIT]

## Acknowledgments

- Classic Tetris game by Alexey Pajitnov
- Tetris Guideline for standard rules and mechanics
- Community contributors

## Support

If you encounter issues or have questions:
1. Check the documentation (TESTING.md, CHANGELOG.md)
2. Review existing issues
3. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/Node.js version

---

**Happy coding! 🎮** Let's build an amazing Tetris game together!
