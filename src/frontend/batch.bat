@echo off 
cls
echo.
echo.
echo ### Inizio script procedura creazione build...
echo.
echo.
pause
:: variables
set currentDir=%cd%
set localdir=C:\Users\Davide\PhpstormProjects\sovvf\src\frontend\launcherComponent
set remotedir=\\so115-mike\public
set projectname=SO115
set buildcmd=ng build --prod --configuration=production --aot --base-href='./'

echo.
echo.
echo ### Cancello le directory "dist" del progetto %projectname%...
echo.
echo.
if exist "%localdir%\dist\%projectname%" rd "%localdir%\dist\%projectname%" /s /q >nul 2>&1
if exist "%remotedir%\%projectname%" rd "%remotedir%\%projectname%\" /s /q >nul 2>&1
if not exist "%remotedir%\%projectname%" mkdir "%remotedir%\%projectname%"

echo.
echo.
echo ### Effettuo la build del progetto %projectname%...
echo.
echo.
cd %localdir%
:: start /separate /wait cmd /c "%buildcmd%" &
start /separate /wait "" "%PROGRAMFILES%\Git\bin\sh.exe" --login %buildcmd%
if %ERRORLEVEL% == 0 (
GOTO SUCCESS
) else (
GOTO FAILED
)

:SUCCESS
cls
echo.
echo.
echo ### Copio la build locale nella directory remota %remotedir%\%projectname%...
echo.
echo.
xcopy "%localdir%\dist\%projectname%\*.*" "%remotedir%\%projectname%\*.*" /q /s

cls
echo.
echo.
echo ###Build %projectname% correttamente copiata su %remotedir%
echo.
echo.
GOTO END


:FAILED
cls
echo.
echo.
echo Qualcosa ? andato storto
echo.
echo.
GOTO END

:END
cd %currentDir%
pause
