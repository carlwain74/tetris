#!/bin/bash

# Stage Changes Packager
# Usage: ./package-changes.sh <stage-number> <description>

STAGE=$1
DESCRIPTION=$2

if [ -z "$STAGE" ]; then
    echo "Usage: ./package-changes.sh <stage-number> [description]"
    echo "Example: ./package-changes.sh 3 'Board Management'"
    exit 1
fi

CHANGES_DIR="/tmp/stage${STAGE}-changes"
OUTPUT_ZIP="stage${STAGE}-changes.zip"

echo "📦 Packaging Stage ${STAGE} Changes"
echo "=================================="

# Create changes directory
mkdir -p "$CHANGES_DIR"

# You'll manually specify changed files here for each stage
# This is a template - modify the files list for each stage

# Example for Stage 2:
# cp js/pieces.js "$CHANGES_DIR/"
# cp package.json "$CHANGES_DIR/"
# cp CHANGELOG.md "$CHANGES_DIR/"
# etc...

echo "Files to package:"
echo "1. List modified files"
echo "2. List new files"
echo ""
echo "Creating CHANGES.md..."

# Create CHANGES.md
cat > "$CHANGES_DIR/CHANGES.md" << EOF
# Stage ${STAGE} Changes - ${DESCRIPTION}

## Modified Files

[List modified files and what changed]

## New Files

[List new files and their purpose]

## How to Apply

1. Extract this ZIP to your tetris-game directory
2. Overwrite existing files when prompted
3. Run tests if available

## Verification

[Add verification steps]
EOF

echo "✓ Created CHANGES.md"
echo ""
echo "Next steps:"
echo "1. Copy changed files to $CHANGES_DIR/"
echo "2. Update CHANGES.md with file list"
echo "3. Run: cd /tmp && zip -r $OUTPUT_ZIP stage${STAGE}-changes/"
echo "4. Move ZIP to outputs directory"
