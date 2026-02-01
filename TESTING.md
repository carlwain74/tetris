# Tetris Game - Testing Guide

## Overview

This project includes a comprehensive test suite that can be run both in the browser and from the command line. Tests are organized by development stage and automatically detect which features are implemented.

## Quick Start

### Browser Tests (Recommended for Development)

```bash
# Install dependencies (first time only)
npm install

# Start test server
npm run test:browser

# Open http://localhost:8000 in your browser
```

### Command Line Tests

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run specific stage tests
npm test -- --stage=1
npm test -- --stage=2
```

## Installation

### First Time Setup

```bash
# Navigate to project directory
cd tetris-game

# Install dependencies
npm install
```

This installs:
- `jsdom` - For DOM simulation in Node.js
- `chalk` - For colored terminal output

## Test Suite Structure

### Test Organization

```
tests/
├── index.html              # Browser-based test runner
├── run-tests.js            # Command-line test runner
└── browser-test-server.js  # Development server for tests
```

### Test Stages

1. **Stage 1: Foundation** (HTML, CSS, Config, Renderer Setup)
2. **Stage 2: Pieces** (Tetromino definitions and rotation)
3. **Stage 3: Board** (Board management and collision detection)
4. **Stage 4: Game Logic** (Core game mechanics)
5. **Stage 5: Rendering** (Canvas drawing)
6. **Stage 6: Input** (Keyboard and touch controls)

## Running Tests

### Option 1: Browser Tests (Interactive)

**Start the server:**
```bash
npm run test:browser
```

**Navigate to:** `http://localhost:8000`

**Features:**
- Visual test results with color coding
- Filter by pass/fail/warning/skip
- Run all tests or specific stages
- Real-time progress tracking
- Console output logging

**Controls:**
- **Run All Tests** - Execute complete test suite
- **Stage 1-6** - Run specific stage tests
- **Filter buttons** - Show only pass/fail/warnings/skipped
- **Reset** - Reload page and clear results

### Option 2: Command Line Tests (CI/CD Ready)

**Run all tests:**
```bash
npm test
```

**Run specific stage:**
```bash
npm test -- --stage=1
npm test -- --stage=2
npm test -- --stage=3
```

**Output:**
- Color-coded terminal output
- Detailed pass/fail information
- Test summary with pass rate
- Exit code 0 (success) or 1 (failure)

## Test Results

### Understanding Test Status

- ✓ **PASS** (Green) - Test passed successfully
- ✗ **FAIL** (Red) - Test failed, needs fixing
- ⚠ **WARNING** (Yellow) - Test passed with minor issues
- ⊘ **SKIP** (Gray) - Feature not yet implemented

### Success Criteria

**Stage 1 (Foundation):**
- Expected: 15-20 tests, all should pass
- Required: 0 failures
- Acceptable: 0-2 warnings (LocalStorage, CORS)

**Stage 2 (Pieces):**
- Expected: 7+ tests
- Skipped until PIECES object is implemented

**Stage 3 (Board):**
- Expected: 6+ tests
- Skipped until Board class is implemented

**Stage 4 (Game Logic):**
- Expected: 4+ tests
- Skipped until Game class is implemented

**Stage 5 (Rendering):**
- Expected: Tests as rendering methods are implemented

**Stage 6 (Input):**
- Expected: Tests as input handling is implemented

## Interpreting Results

### Browser Test Output

```
Summary:
Total:    42
Passed:   35
Failed:   0
Warnings: 2
Skipped:  5
Pass Rate: 83%
```

**This means:**
- 42 tests total
- 35 passed (features working)
- 0 failed (no broken features)
- 2 warnings (minor issues, can proceed)
- 5 skipped (not implemented yet)
- 83% pass rate (good for early stages)

### Command Line Test Output

```
═══════════════════════════════════════
  TETRIS TEST SUITE RESULTS
═══════════════════════════════════════

Summary:
  Total:    20
  Passed:   18
  Failed:   0
  Warnings: 2
  Skipped:  0
  Pass Rate: 90%

✓ Stage 1: HTML Structure & DOM (7/7)
  ✓ Document body exists
  ✓ Game canvas exists
  ...

✓ Stage 1: Configuration (6/6)
  ✓ CONFIG object exists
  ...
```

## Common Scenarios

### Scenario 1: Starting New Project

```bash
# Run Stage 1 tests only
npm test -- --stage=1

# Expected: All pass, 0 failures
# If failures: Fix HTML/CSS/config issues
```

### Scenario 2: After Implementing Pieces

```bash
# Run Stage 2 tests
npm test -- --stage=2

# Tests will check:
# - PIECES object exists
# - All 7 pieces defined
# - Rotation states correct
# - Piece class works
```

### Scenario 3: Continuous Development

```bash
# Run all tests after each change
npm test

# Use browser tests for debugging:
npm run test:browser
```

### Scenario 4: Before Git Commit

```bash
# Run full test suite
npm test

# Should pass with 0 failures
# Warnings acceptable
# Skipped tests are fine (not implemented yet)
```

## Troubleshooting

### "Cannot find module 'jsdom'"

**Problem:** Dependencies not installed

**Solution:**
```bash
npm install
```

### "Cannot set property navigator" Error

**Problem:** This was a Node.js compatibility issue that has been fixed in the test runner.

**Solution:** If you still see this error:
```bash
# Update to latest test files
# The fix uses Object.defineProperty instead of direct assignment
```

**Verification:**
```bash
node tests/verify-fix.js
# Should show: "Fix verified! The test suite should work now."
```

### "EADDRINUSE: address already in use"

**Problem:** Port 8000 already taken

**Solution:**
```bash
# Find and kill process using port 8000
# Or edit tests/browser-test-server.js to use different port
```

### Tests fail with "Module not found"

**Problem:** Running from wrong directory

**Solution:**
```bash
cd tetris-game  # Navigate to project root
npm test
```

### Browser tests show all skipped

**Problem:** Features not implemented yet

**Solution:** This is normal! Tests will automatically un-skip as you implement features.

### LocalStorage warnings

**Problem:** Browser blocking localStorage

**Solution:** This is acceptable. Either:
- Use different browser
- Ignore warning (doesn't affect core functionality)
- Check browser privacy settings

## Integration with Development

### Recommended Workflow

1. **Before starting new stage:**
   ```bash
   npm test -- --stage=X  # Run tests for stage X
   # Should show tests as skipped
   ```

2. **During development:**
   ```bash
   npm run test:browser  # Interactive testing
   # Refresh browser after code changes
   ```

3. **After completing stage:**
   ```bash
   npm test -- --stage=X  # Verify all tests pass
   npm test               # Run full suite
   ```

4. **Before committing:**
   ```bash
   npm test  # Full test suite
   # Ensure 0 failures
   ```

### CI/CD Integration

The command-line test runner is designed for CI/CD pipelines:

**GitHub Actions example:**
```yaml
- name: Run tests
  run: |
    npm install
    npm test
```

**Exit codes:**
- `0` - All tests passed (or only warnings)
- `1` - One or more tests failed

## Test Coverage

### What Gets Tested

✅ **HTML/DOM Structure**
- All required elements exist
- Canvas elements have correct dimensions
- UI elements properly defined

✅ **Configuration**
- All constants defined
- Correct values set
- No missing properties

✅ **Module Loading**
- ES6 modules load correctly
- Classes can be instantiated
- No import errors

✅ **Game Components**
- Piece definitions and rotations
- Board collision detection
- Game state management
- Rendering methods
- Input handling

### What Doesn't Get Tested

❌ **Visual Appearance** - Manual verification needed
❌ **Gameplay Feel** - Requires playtesting
❌ **Performance** - Not covered by unit tests
❌ **Browser Compatibility** - Test in target browsers

## Advanced Usage

### Watch Mode (Auto-run on Changes)

```bash
npm run test:watch
```

Currently requires manual implementation of file watching.

### Custom Test Port

Edit `tests/browser-test-server.js`:
```javascript
const PORT = 3000;  // Change from 8000
```

### Verbose Output

Tests automatically show detailed output. For even more detail, modify test runners to log intermediate values.

## Best Practices

1. **Run tests frequently** - After each feature implementation
2. **Fix failures immediately** - Don't accumulate technical debt
3. **Use browser tests for debugging** - Visual feedback helps
4. **Use CLI tests for verification** - Fast and automatable
5. **Check all stages before release** - Run full suite
6. **Don't skip warnings** - Investigate and document them

## Getting Help

If tests consistently fail:

1. Check test output for specific error messages
2. Verify file structure matches expected layout
3. Ensure using correct Node.js version (v18+)
4. Try browser tests for more debugging info
5. Check browser console for JavaScript errors

## Next Steps

- Implement features stage by stage
- Run tests after each implementation
- Keep test pass rate > 90%
- Use tests to guide development
- Add custom tests for specific features

---

**Happy Testing! 🎮**
