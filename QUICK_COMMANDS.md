# Quick One-Liner Commands

## Simple One-Liner (Copy & Paste)

If you don't want to create a script file, you can use this one-liner:

```bash
git diff --name-only HEAD; git ls-files --others --exclude-standard | while IFS= read -r file; do [ -z "$file" ] && continue; days=$((RANDOM % 61)); git add "$file" && GIT_AUTHOR_DATE="2025-10-01 09:00:00 +$days days" GIT_COMMITTER_DATE="2025-10-01 09:00:00 +$days days" git commit -m "update $(basename "$file")"; done
```

## Safer Version with Backup

```bash
# 1. Create backup first
git branch backup-$(date +%Y%m%d) && \

# 2. Commit all files with dates
for file in $(git diff --name-only HEAD; git ls-files --others --exclude-standard); do
  days=$((RANDOM % 61))
  date="2025-10-01 09:00:00"
  git add "$file" && \
  GIT_AUTHOR_DATE="$date +$days days" \
  GIT_COMMITTER_DATE="$date +$days days" \
  git commit -m "update $(basename "$file")" && \
  echo "✓ Committed: $file"
done
```

## Undo Last N Commits

```bash
# Undo but keep changes
git reset --soft HEAD~50  # Replace 50 with number of commits

# Undo and discard changes (DANGER!)
git reset --hard HEAD~50
```

## Quick Status Check

```bash
# See what will be committed
git status --short

# Count changed files
git status --short | wc -l
```
