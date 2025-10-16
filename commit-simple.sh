#!/bin/bash

# Simple version - commits files with sequential dates
# Works on Git Bash for Windows

echo "Git Backdating Script (Simple Version)"
echo "======================================="
echo ""

# Get all changed files
files=($(git diff --name-only HEAD; git ls-files --others --exclude-standard))

if [ ${#files[@]} -eq 0 ]; then
    echo "No changes to commit."
    exit 0
fi

echo "Found ${#files[@]} file(s) to commit."
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Reset staging area
git reset HEAD . 2>/dev/null

# Start date: October 1, 2025
start_date="2025-10-01 09:00:00"
counter=0

for file in "${files[@]}"; do
    # Skip empty entries
    [ -z "$file" ] && continue
    
    # Calculate date (add days based on counter)
    days_offset=$((counter * 60 / ${#files[@]}))  # Spread over 60 days
    commit_date=$(date -d "$start_date + $days_offset days" "+%Y-%m-%d %H:%M:%S" 2>/dev/null)
    
    # Fallback for macOS
    if [ -z "$commit_date" ]; then
        commit_date=$(date -v+${days_offset}d -j -f "%Y-%m-%d %H:%M:%S" "$start_date" "+%Y-%m-%d %H:%M:%S" 2>/dev/null)
    fi
    
    # If date calculation fails, use simple format
    if [ -z "$commit_date" ]; then
        commit_date="2025-10-01 09:00:00"
    fi
    
    # Stage and commit
    git add "$file"
    
    filename=$(basename "$file")
    
    GIT_AUTHOR_DATE="$commit_date" \
    GIT_COMMITTER_DATE="$commit_date" \
    git commit -m "update $filename" >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Committed: $file (Date: $commit_date)"
        counter=$((counter + 1))
    fi
done

echo ""
echo "Done! Created $counter commits."
echo ""
echo "To undo all commits: git reset --soft HEAD~$counter"
