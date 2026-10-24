@echo off
setlocal enabledelayedexpansion
title MOZOK v1.0.0 -- Multi-Scale Human Brain and Connectome Explorer

echo ==============================================================================
echo MOZOK v1.0.0 -- Multi-Scale Human Brain and Connectome Explorer
echo Google Earth for the Human Brain -- 500 Neurons 3D and Prion Simulator
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Configurando GPU dedicada NVIDIA GTX 1650 no Registro do Windows...

set "CHROME_PATH="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

set "EDGE_PATH="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if defined CHROME_PATH (
    reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "!CHROME_PATH!" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>nul
)
if defined EDGE_PATH (
    reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "!EDGE_PATH!" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>nul
)

echo [OK] Aceleracao maxima por hardware GPU ativada.
echo.

echo [2/3] Iniciando MOZOK v1.0 WebGL2 Studio em tela cheia...
set "TARGET_URL=file:///%~dp0web/index.html"
set "TARGET_URL=%TARGET_URL:\=/%"

:: [PT-BR]: Flags de aceleracao GPU com fidelidade cromatica sRGB exata para shaders WebGL2 MNI152
:: [EN-GB]: GPU acceleration flags with exact sRGB color profile fidelity for MNI152 WebGL2 shaders
:: [AI-CTX]: @llm-context: Browser launch configuration enforcing dedicated GPU and sRGB color profile
set "BROWSER_FLAGS=--force-color-profile=srgb --enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist --use-gl=desktop --start-fullscreen"

if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS% "%TARGET_URL%"
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS% "%TARGET_URL%"
) else (
    start "" "%TARGET_URL%"
)

echo [OK] WebGL2 Studio iniciado no navegador padrao.
echo.

echo [3/3] Verificando Motor Nativo Godot 4...
where godot >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Motor Godot 4 detectado no PATH do sistema.
    echo Pressione qualquer tecla para abrir tambem o motor Godot 4 nativo, ou feche esta janela.
    pause >nul
    start "" godot --path .
) else (
    echo [Nota] Executavel godot nao encontrado no PATH (execucao pura via WebGL2 Studio 100%% offline).
)

echo.
echo ==============================================================================
echo MOZOK v1.0.0 em execucao! Para reiniciar, execute run.bat novamente.
echo ==============================================================================
exit /b 0
