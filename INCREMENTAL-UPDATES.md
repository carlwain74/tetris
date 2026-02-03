# Incremental Updates

## Overview

Instead of downloading the entire project each time, you can download only the files that changed in each stage. This makes updates faster and clearer.

## Available Update Packages

### Stage 2: Piece Definitions
**File:** `stage2-changes.zip`  
**Size:** ~11 KB (vs 43 KB full project)

**Changes:**
- Modified: `js/pieces.js`, `package.json`, `CHANGELOG.md`
- New: `tests/verify-stage2.js`, `tests/demo-pieces.js`, `STAGE2-COMPLETE.md`

**How to apply:**
```bash
# Extract to your project directory
unzip stage2-changes.zip
cd stage2-changes

# Copy files to your tetris-game directory
cp -r * /path/to/tetris-game/

# Verify
cd /path/to/tetris-game
npm run test:stage2
```

## Going Forward

For each stage, you'll receive:
1. **Full project ZIP** (`tetris-game.zip`) - Complete project
2. **Changes ZIP** (`stageN-changes.zip`) - Only modified/new files

### Which One to Use?

**Use Full Project ZIP if:**
- Starting fresh
- Want to ensure everything is in sync
- Having issues with incremental updates

**Use Changes ZIP if:**
- Already have the project
- Want faster downloads
- Want to see exactly what changed

## File Structure in Changes ZIP

```
stageN-changes/
├── CHANGES.md              # What changed and how to apply
├── [modified-file1]        # Modified files
├── [modified-file2]
├── [new-file1]             # New files
└── tests/                  # New test files
    └── verify-stageN.js
```

## Best Practices

1. **Always read CHANGES.md first** - It tells you exactly what changed
2. **Backup before applying** - In case you need to rollback
3. **Run tests after applying** - Verify everything works
4. **Check the version** - Make sure you're applying in order

## Version Tracking

Each stage updates the version in `package.json`:
- Stage 1: v1.0.0
- Stage 2: v1.0.2
- Stage 3: v1.1.0 (will be)
- etc.

## Need the Full Project?

You can always download the complete project ZIP if:
- You get out of sync
- You want to start fresh
- You're new to the project

Both ZIPs are always provided for each stage completion.
