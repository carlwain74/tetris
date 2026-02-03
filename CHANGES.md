# Stage 2 Changes (v2 - Path Fix)

## What's Fixed

Fixed npm script paths to work correctly regardless of where npm is installed.

**Error you may have seen:**
```
Error: Cannot find module '/path/to/tests/run-tests.js'
```

**Solution:**
Changed all script paths from `node tests/...` to `node ./tests/...`

## Modified Files

### package.json
- Fixed all npm script paths to use `./tests/` instead of `tests/`
- Changed: `test`, `test:watch`, `test:browser`, `test:stage2`, `demo:pieces`

### TEST-QUICK-REF.md
- Added note to run commands from project root
- Clarified directory requirements

### TESTING.md
- Added troubleshooting section for path issues
- Clear instructions on running from correct directory

## How to Apply

```bash
# Navigate to your project
cd tetris-game

# Extract this ZIP
unzip stage2-changes-v2.zip

# Copy files (overwrite when prompted)
cd stage2-changes-v2
cp package.json ../
cp TEST-QUICK-REF.md ../
cp TESTING.md ../
cd ..

# Verify the fix
npm run test:stage2
```

## Verification

After applying, this should work:
```bash
cd tetris-game  # Make sure you're in project root
npm run test:stage2
# Should run successfully
```

## Full Stage 2 Files

If you want all Stage 2 files including the original changes:
1. Apply stage2-changes.zip first (if you haven't)
2. Then apply this fix (stage2-changes-v2.zip)

Or just download the full tetris-game.zip which has everything.
