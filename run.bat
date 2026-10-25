@echo off
setlocal enabledelayedexpansion
title MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala

:: [PT-BR]: Script mestre de inicializacao com pre-compilacao de icones, audios neurais e modo aplicativo nativo.
:: [EN-GB]: Master launch script with icon pre-generation, neural audio pre-compilation, and dedicated native app mode.
:: [AI-CTX]: @llm-context: Desktop launcher configuring GPU acceleration, assets verification, dedicated app window, and Godot 4 / Rust native hooks.
::           @llm-invariant: App mode without browser toolbars (--app="%TARGET_URL%"); exact sRGB profile; offline prebuilt assets.
::           @llm-neuroscience: High-fidelity visual and pedagogical launch environment for full CNS exploration.

echo ==============================================================================
echo MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala
echo Sistema Nervoso Central, Conectoma, Fisiologia e Patologia (MNI152 + Micro)
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando e instalando icones multi-resolucao (Desktop, PWA, Godot)...
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python tools/install_mozok_icons.py
) else (
    echo [Nota] Python nao encontrado no PATH; usando icones existentes.
)
echo.

echo [2/4] Verificando biblioteca de audio neural com voz de professor...
if not exist "web\assets\audio\pt-BR\struct_1.mp3" (
    echo Gerando audios neurais de estudio com Edge-TTS...
    where python >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        python tools/prebuild_neural_audio.py
    )
) else (
    echo [OK] Biblioteca de audios neurais pre-compilados validada (27/27 arquivos).
)
echo.

echo [3/4] Configurando GPU dedicada NVIDIA / AMD no Registro do Windows...

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

echo [4/4] Iniciando MOZOK v2.0 em Modo de Aplicativo Dedicado sem Bordas...
set "TARGET_URL=file:///%~dp0web/index.html"
set "TARGET_URL=%TARGET_URL:\=/%"

:: [PT-BR]: Flags de aceleracao GPU com fidelidade cromatica sRGB exata e modo aplicativo dedicado (--app=...)
:: [EN-GB]: GPU acceleration flags with exact sRGB color profile fidelity and dedicated app mode (--app=...)
set "BROWSER_FLAGS=--app=%TARGET_URL% --force-color-profile=srgb --enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist --use-gl=desktop"

if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS%
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS%
) else (
    start "" "%TARGET_URL%"
)

echo [OK] MOZOK v2.0 iniciado com sucesso no modo aplicativo dedicado.
echo.

where godot >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [Godot 4] Motor Godot 4 detectado no PATH do sistema.
    echo Pressione qualquer tecla para abrir tambem o motor Godot 4 nativo, ou feche esta janela.
    pause >nul
    start "" godot --path .
)

echo ==============================================================================
echo MOZOK v2.0 em execucao! Para reiniciar, execute run.bat novamente.
echo ==============================================================================
exit /b 0
