@echo off
echo Starting Pictalk deployment process...

:: Clean up any previous build artifacts
echo Cleaning up previous build artifacts...
if exist public\build rmdir /s /q public\build

:: Run Firebase deploy
echo Deploying to Firebase hosting...
call firebase deploy --only hosting

echo Deployment complete! Your app should be live shortly.
echo Visit https://pictalk-c6b9d.web.app to view your application.
pause 