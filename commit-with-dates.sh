#!/bin/bash

# Script to commit changed files with backdated timestamps
# Commits files one by one with dates between Oct 1 and Nov 30, 2025

# ANSI color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   Git Backdating Commit Script${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository!${NC}"
    exit 1
fi

# Check for uncommitted changes
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit. Exiting.${NC}"
    exit 0
fi

# Show current status
echo -e "${YELLOW}Current Git Status:${NC}"
git status --short
echo ""

# Ask for confirmation
echo -e "${YELLOW}This script will commit all changed files one by one with dates between Oct 1 - Nov 30, 2025.${NC}"
echo -e "${YELLOW}Make sure you've backed up your work!${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${RED}Aborted by user.${NC}"
    exit 1
fi

# Get list of all changed files (modified, new, deleted)
# This includes both staged and unstaged changes
mapfile -t files < <(git diff --name-only HEAD && git ls-files --others --exclude-standard)

# Remove duplicates and empty lines
files=($(printf '%s\n' "${files[@]}" | sort -u | grep -v '^$'))

if [ ${#files[@]} -eq 0 ]; then
    echo -e "${YELLOW}No files to commit. Exiting.${NC}"
    exit 0
fi

echo -e "${GREEN}Found ${#files[@]} file(s) to commit.${NC}"
echo ""

# Date range: Oct 1, 2025 to Nov 30, 2025
START_DATE="2025-10-01"
END_DATE="2025-11-30"

# Convert dates to seconds since epoch
START_TIMESTAMP=$(date -d "$START_DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$START_DATE" +%s 2>/dev/null)
END_TIMESTAMP=$(date -d "$END_DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$END_DATE" +%s 2>/dev/null)

if [ -z "$START_TIMESTAMP" ] || [ -z "$END_TIMESTAMP" ]; then
    echo -e "${RED}Error: Could not parse dates. Make sure you're using a compatible system.${NC}"
    exit 1
fi

# Calculate time range
TIME_RANGE=$((END_TIMESTAMP - START_TIMESTAMP))

# Total number of files
TOTAL_FILES=${#files[@]}

# Counter for commits
COMMIT_COUNT=0

# Unstage all files first (to ensure clean slate)
git reset HEAD . > /dev/null 2>&1

echo -e "${BLUE}Starting to commit files...${NC}"
echo ""

# Loop through each file
for i in "${!files[@]}"; do
    file="${files[$i]}"
    
    # Skip if file doesn't exist (might have been deleted)
    if [ ! -e "$file" ] && ! git ls-files --deleted | grep -q "^$file$"; then
        continue
    fi
    
    # Calculate evenly distributed timestamp
    # This spreads commits evenly across the date range
    OFFSET=$((TIME_RANGE * i / TOTAL_FILES))
    COMMIT_TIMESTAMP=$((START_TIMESTAMP + OFFSET))
    
    # Add some randomness (±4 hours) to make it look more natural
    RANDOM_OFFSET=$((RANDOM % 28800 - 14400))
    COMMIT_TIMESTAMP=$((COMMIT_TIMESTAMP + RANDOM_OFFSET))
    
    # Format the date for display
    COMMIT_DATE=$(date -d "@$COMMIT_TIMESTAMP" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -r "$COMMIT_TIMESTAMP" "+%Y-%m-%d %H:%M:%S" 2>/dev/null)
    
    # Stage the file
    git add "$file"
    
    # Check if staging was successful
    if [ $? -ne 0 ]; then
        echo -e "${RED}  ✗ Failed to stage: $file${NC}"
        continue
    fi
    
    # Create commit message
    filename=$(basename "$file")
    
    # Determine action (add, update, or delete)
    if git ls-files --deleted | grep -q "^$file$"; then
        action="remove"
    elif git diff --cached --diff-filter=A --name-only | grep -q "^$file$"; then
        action="add"
    else
        action="update"
    fi
    
    commit_message="$action $filename"
    
    # Commit with backdated timestamp
    GIT_AUTHOR_DATE="$COMMIT_TIMESTAMP" \
    GIT_COMMITTER_DATE="$COMMIT_TIMESTAMP" \
    git commit -m "$commit_message" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        COMMIT_COUNT=$((COMMIT_COUNT + 1))
        echo -e "${GREEN}  ✓ [$COMMIT_COUNT/$TOTAL_FILES] Committed: $file${NC}"
        echo -e "    Date: $COMMIT_DATE"
        echo -e "    Message: \"$commit_message\""
        echo ""
    else
        echo -e "${RED}  ✗ Failed to commit: $file${NC}"
    fi
done

echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}✓ Completed! Created $COMMIT_COUNT commit(s).${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review commits: ${BLUE}git log --oneline --graph --date=short${NC}"
echo -e "  2. If everything looks good: ${BLUE}git push${NC}"
echo -e "  3. If you want to undo: ${BLUE}git reset --soft HEAD~$COMMIT_COUNT${NC}"
echo ""
