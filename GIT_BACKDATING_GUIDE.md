# Git Backdating Script - Usage Guide

## ⚠️ SAFETY FIRST

Before running the script, **create a backup branch**:

```bash
# Create a backup of your current state
git branch backup-before-commits

# Or create a backup branch and switch back
git checkout -b backup-before-commits
git checkout -

# If you have untracked files, stash them
git stash -u
```

## 📋 What These Scripts Do

The scripts will:
1. Find all uncommitted changes (staged and unstaged)
2. Commit each file separately
3. Assign dates between **October 1 and November 30, 2025**
4. Use meaningful commit messages like "update filename.ts"

## 🚀 Usage Instructions

### Option 1: Full-Featured Script (Recommended)

```bash
# Make the script executable
chmod +x commit-with-dates.sh

# Run it
./commit-with-dates.sh
```

**Features:**
- ✅ Color-coded output
- ✅ Shows progress for each file
- ✅ Random time distribution
- ✅ Detects add/update/delete operations
- ✅ Confirmation prompt

### Option 2: Simple Script (Windows Git Bash friendly)

```bash
# Make it executable
chmod +x commit-simple.sh

# Run it
./commit-simple.sh
```

**Features:**
- ✅ Simple and fast
- ✅ Compatible with Git Bash on Windows
- ✅ Sequential date distribution

## 📝 Step-by-Step Safe Workflow

### 1. Check Your Current Status

```bash
git status
```

### 2. Create a Backup

```bash
git branch backup-$(date +%Y%m%d)
```

### 3. Run the Script

```bash
./commit-with-dates.sh
```

### 4. Review the Commits

```bash
# View commit history with dates
git log --oneline --date=short --pretty=format:"%h %ad %s" --date=short

# Or with graph
git log --oneline --graph --all --decorate --date=short
```

### 5. If Everything Looks Good

```bash
git push
```

### 6. If You Want to Undo

```bash
# Undo all commits but keep your changes
git reset --soft HEAD~<number_of_commits>

# Example: undo last 50 commits
git reset --soft HEAD~50

# Or reset to your backup branch
git reset --hard backup-before-commits
```

## 🔧 Customization

### Change Date Range

Edit the script and modify these lines:

```bash
START_DATE="2025-10-01"
END_DATE="2025-11-30"
```

### Change Commit Messages

Modify this section in the script:

```bash
commit_message="$action $filename"
```

To something like:

```bash
commit_message="feat: implement $filename"
# or
commit_message="chore: update $filename"
```

## ⚙️ Windows Git Bash Compatibility

If you encounter date command issues on Windows:

1. Use the simple script (`commit-simple.sh`)
2. Or install Git Bash with full GNU utilities
3. Or use WSL (Windows Subsystem for Linux)

## 🐛 Troubleshooting

### "Not in a git repository" error
```bash
# Make sure you're in your git project directory
cd /path/to/your/project
git status
```

### "Permission denied" error
```bash
# Make the script executable
chmod +x commit-with-dates.sh
```

### Script not found
```bash
# Run with bash explicitly
bash commit-with-dates.sh
```

### Date command not working on Windows
```bash
# Use the simple version instead
bash commit-simple.sh
```

## 📊 Example Output

```
==================================================
   Git Backdating Commit Script
==================================================

Current Git Status:
M  src/app.ts
A  src/components/NewFeature.tsx
?? README.md

Found 3 file(s) to commit.

Starting to commit files...

  ✓ [1/3] Committed: src/app.ts
    Date: 2025-10-05 14:23:45
    Message: "update app.ts"

  ✓ [2/3] Committed: src/components/NewFeature.tsx
    Date: 2025-10-28 09:15:32
    Message: "add NewFeature.tsx"

  ✓ [3/3] Committed: README.md
    Date: 2025-11-22 16:42:18
    Message: "add README.md"

==================================================
✓ Completed! Created 3 commit(s).
==================================================
```

## ⚠️ Important Notes

1. **This rewrites Git history** - Only use on unpushed commits or your own branches
2. **Don't use on shared branches** - This can cause conflicts for other developers
3. **GitHub may show warnings** - Backdated commits might trigger security alerts
4. **Create backups** - Always make a backup branch before running
5. **Test first** - Try on a test branch before using on your main work

## 🔄 Recovery Options

If something goes wrong:

```bash
# Option 1: Reset to before commits
git reset --soft HEAD~<n>

# Option 2: Reset to backup branch
git reset --hard backup-before-commits

# Option 3: Use reflog to find your previous state
git reflog
git reset --hard HEAD@{n}  # where n is the entry number
```

## 📚 Additional Commands

```bash
# View all commits with full dates
git log --pretty=fuller

# Count commits in date range
git log --after="2025-10-01" --before="2025-12-01" --oneline | wc -l

# Export commit history to file
git log --pretty=format:"%h - %an, %ar : %s" > commits.txt
```

## ✅ Checklist Before Running

- [ ] I have uncommitted changes I want to commit
- [ ] I've created a backup branch
- [ ] I'm on the correct branch
- [ ] I've reviewed what files will be committed
- [ ] I understand this will create backdated commits
- [ ] I'm ready to proceed

---

**Need help?** Check the script output or review your git status before proceeding.
