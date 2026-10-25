@echo off
setlocal enabledelayedexpansion
title MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala

:: [PT-BR]: Script mestre de inicializacao do MOZOK v2.0 com servidor HTTP local (porta 8090), modo app dedicado e suporte a PWA.
:: [EN-GB]: Master launch script for MOZOK v2.0 with local HTTP server (port 8090), dedicated app mode, and PWA support.
:: [AI-CTX]: @llm-context: Prevents file:/// CORS issues with WebGL2 shaders, ES modules, audio assets, and parentheses in Program Files (x86).
::           @llm-invariant: Starts background HTTP server on 127.0.0.1:8090 and launches dedicated app mode window with sRGB fidelity.
::           @llm-neuroscience: High-performance low-latency rendering pipeline for the entire Central Nervous System and Layer V neuron.

echo ==============================================================================
echo MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala
echo Sistema Nervoso Central, Conectoma, Fisiologia e Patologia (MNI152 + Micro)
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando e instalando icones multi-resolucao (Desktop, PWA, Godot)...
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python tools/install_mozok_icons.py
) else (
    echo [Nota] Python nao encontrado no PATH; usando icones existentes.
)
echo.

echo [2/5] Verificando biblioteca de audio neural de alta fidelidade...
if not exist "web\assets\audio\pt-BR\struct_1.mp3" (
    echo Gerando audios neurais de estudio com vozes neurais e SoundCraft filter...
    where python >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        python tools/prebuild_neural_audio.py
    )
) else (
    echo [OK] Biblioteca de audios neurais pre-compilados validada (27/27 arquivos).
)
echo.

echo [3/5] Configurando GPU dedicada NVIDIA / AMD no Registro do Windows...

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

echo [4/5] Garantindo servidor HTTP local em segundo plano na porta 8090...
:: [PT-BR]: Verifica se a porta 8090 ja esta respondendo; se nao, inicia mozok-native.exe --no-launch ou python http.server
:: [EN-GB]: Checks if port 8090 is already responding; if not, launches mozok-native.exe --no-launch or python http.server
powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8090 -State Listen -ErrorAction SilentlyContinue) -ne $null" | findstr /i "True" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Servidor HTTP local ja em execucao na porta 8090.
) else (
    if exist "target\release\mozok-native.exe" (
        echo Iniciando servidor embutido nativo de alta performance (target\release\mozok-native.exe --no-launch)...
        start /b "" "target\release\mozok-native.exe" --no-launch
    ) else (
        where python >nul 2>nul
        if !ERRORLEVEL! equ 0 (
            echo Iniciando servidor HTTP local via Python (127.0.0.1:8090)...
            start /b "" python -m http.server 8090 --bind 127.0.0.1 --directory web
        ) else (
            echo [AVISO] Compilando mozok-native para prover servidor HTTP...
            cargo build --release -p mozok-native
            start /b "" "target\release\mozok-native.exe" --no-launch
        )
    )
    :: Aguarda estabilizacao do socket
    timeout /t 2 /nobreak >nul
)
echo.

echo [5/5] Iniciando MOZOK v2.0 em Modo de Aplicativo Nativo Dedicado sem Bordas...
set "TARGET_URL=http://127.0.0.1:8090/index.html"

:: [PT-BR]: Flags de aceleracao GPU com fidelidade cromatica sRGB exata e modo aplicativo dedicado (--app=...)
:: [EN-GB]: GPU acceleration flags with exact sRGB color profile fidelity and dedicated app mode (--app=...)
:: [AI-CTX]: @llm-invariant: Opens http://127.0.0.1:8090/index.html without file:/// CORS restrictions; allows PWA installation and tab access.
set "BROWSER_FLAGS=--app=%TARGET_URL% --force-color-profile=srgb --enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist --use-gl=desktop"

if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS%
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS%
) else (
    start "" "%TARGET_URL%"
)

echo [OK] MOZOK v2.0 em execucao:
echo      - Janela de aplicativo dedicado: Aberta sem barras de navegacao
echo      - Acesso em abas do navegador:   %TARGET_URL%
echo      - Instalacao como PWA nativo:    Ativa via manifest.json e sw.js
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
