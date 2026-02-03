# Tetris Test Suite - Quick Reference

## 🚀 Quick Start

**IMPORTANT: Run all commands from the tetris-game project root directory**

```bash
# Navigate to project directory first
cd tetris-game

# First time setup
npm install

# Run tests (choose one)
npm test                    # Command line (all tests)
npm run test:browser        # Browser (interactive)
npm run test:stage2         # Stage 2 only
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies (first time only) |
| `npm test` | Run all tests via command line |
| `npm test -- --stage=1` | Run Stage 1 tests only |
| `npm test -- --stage=2` | Run Stage 2 tests only |
| `npm run test:browser` | Start browser test server |
| `npm run serve` | Start game server (alternative) |

## 🌐 Browser Tests

**Start server:**
```bash
npm run test:browser
```

**Access:**
- Tests: http://localhost:8000
- Game: http://localhost:8000/index.html

**Features:**
- ▶ Run All Tests
- Stage 1-6 buttons (run specific stages)
- Filter: All / Passed / Failed / Warnings / Skipped
- 🔄 Reset

## 💻 Command Line Tests

**Run all:**
```bash
npm test
```

**Run specific stage:**
```bash
npm test -- --stage=1   # Foundation
npm test -- --stage=2   # Pieces
npm test -- --stage=3   # Board
npm test -- --stage=4   # Game Logic
```

**Exit codes:**
- 0 = Pass (may have warnings)
- 1 = Fail

## 📊 Expected Results by Stage

### Stage 1: Foundation
```
Total: 15-20 tests
Pass: All should pass
Fail: 0
Warnings: 0-2 (LocalStorage, CORS)
```

### Stage 2: Pieces
```
Tests: Skipped until PIECES implemented
Will test: Definitions, rotations, Piece class
```

### Stage 3: Board
```
Tests: Skipped until Board implemented
Will test: Grid, collision, line clearing
```

### Stage 4: Game Logic
```
Tests: Skipped until Game implemented
Will test: State, scoring, level progression
```

## 🎯 Development Workflow

**1. Before starting new stage:**
```bash
npm test -- --stage=X  # See tests that need to pass
```

**2. During development:**
```bash
npm run test:browser  # Interactive testing
# Refresh browser after changes
```

**3. After completing stage:**
```bash
npm test -- --stage=X  # Verify stage complete
npm test               # Run all tests
```

**4. Before committing:**
```bash
npm test  # All tests, ensure 0 failures
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` |
| Port 8000 in use | Kill other process or change port |
| All tests skipped | Normal! Implement features to un-skip |
| LocalStorage warning | Acceptable, doesn't affect tests |

## 📈 Success Criteria

**Ready for next stage when:**
- ✅ Current stage: 0 failures
- ✅ Pass rate > 90%
- ✅ Warnings documented
- ✅ Visual verification done

## 🔗 More Information

- Full guide: See `TESTING.md`
- Test code: `tests/run-tests.js` (CLI)
- Test code: `tests/index.html` (Browser)

---

**Pro tip:** Use browser tests for debugging, CLI tests for verification!
