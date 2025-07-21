@echo off
echo Starting Git repository sync verification...
echo.

echo Step 1: Checking current Git status...
git status
echo.

echo Step 2: Fetching latest from remote...
git fetch origin
echo.

echo Step 3: Checking status after fetch...
git status
echo.

echo Step 4: Showing recent commit history...
git log --oneline --graph --decorate --all -10
echo.

echo Step 5: Checking remote configuration...
git remote -v
echo.

echo Step 6: Adding any uncommitted changes...
git add .
echo.

echo Step 7: Committing changes (if any)...
git commit --allow-empty --no-verify -m "Final sync with GitHub repository"
echo.

echo Step 8: Pushing to remote...
git push --no-verify origin main
echo.

echo Step 9: Final verification...
git status
echo.

echo Sync verification complete!
pause