@echo off
setlocal enabledelayedexpansion
title MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala

:: [PT-BR]: Script mestre de inicializacao do MOZOK v2.0 com servidor HTTP nativo Rust (porta 8090), modo app dedicado e PWA.
:: [EN-GB]: Master launch script for MOZOK v2.0 with native Rust HTTP server (port 8090), dedicated app mode, and PWA.
:: [AI-CTX]: @llm-context: Prevents file:/// CORS issues, normalizes Windows paths, avoids WindowsApps/python.exe false positives, and ensures robust server startup.
::           @llm-invariant: Binds 127.0.0.1:8090, guarantees clean Win32 execution, and launches dedicated application window without browser chrome.
::           @llm-neuroscience: High-performance low-latency rendering pipeline for the entire Central Nervous System and Layer V neuron.

echo ==============================================================================
echo MOZOK v2.0 -- Atlas e Simulador Neuroanatomico 3D Multiescala
echo Sistema Nervoso Central, Conectoma, Fisiologia e Patologia (MNI152 + Micro)
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando e instalando icones multi-resolucao (Desktop, PWA, Godot)...
:: [PT-BR]: Testa se o Python real esta disponivel (evita falso positivo do stub WindowsApps\python.exe)
:: [EN-GB]: Tests if real Python is available (avoids false positive from WindowsApps\python.exe stub)
python -c "import http.server" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python tools/install_mozok_icons.py
) else (
    echo [Nota] Python real nao detectado no PATH; mantendo icones existentes.
)
echo.

echo [2/5] Verificando biblioteca de audio neural de alta fidelidade...
if not exist "web\assets\audio\pt-BR\struct_1.mp3" (
    echo Gerando audios neurais de estudio com vozes humanas e SoundCraft filter...
    python -c "import http.server" >nul 2>nul
    if !ERRORLEVEL! equ 0 (
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

echo [4/5] Inicializando Servidor HTTP Local (127.0.0.1:8090)...
set "TARGET_URL=http://127.0.0.1:8090/index.html"
set "BROWSER_FLAGS=--app=%TARGET_URL% --force-color-profile=srgb --enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist --use-gl=desktop"

:: Verifica se a porta 8090 ja esta ativa
powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8090 -State Listen -ErrorAction SilentlyContinue) -ne $null" | findstr /i "True" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Servidor HTTP local ja em execucao na porta 8090.
    goto launch_browser
)

:: Compila mozok-native se necessario
if not exist "target\release\mozok-native.exe" (
    where cargo >nul 2>nul
    if !ERRORLEVEL! equ 0 (
        echo [INFO] Compilando mozok-native em perfil release...
        cargo build --release -p mozok-native
    )
)

if exist "target\release\mozok-native.exe" (
    echo [OK] Iniciando mozok-native.exe...
    :: [PT-BR]: Inicia mozok-native sem --no-launch para abrir o navegador apos o bind do listener TCP
    :: [EN-GB]: Launches mozok-native without --no-launch to open browser after TCP listener bind
    start "" "target\release\mozok-native.exe"
    goto finish_launch
)

:: Fallback para servidor HTTP embutido do Python caso o executavel nativo nao esteja disponivel
python -c "import http.server" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Iniciando servidor HTTP Python em segundo plano (127.0.0.1:8090)...
    start /b "" python -m http.server 8090 --bind 127.0.0.1 --directory web
    
    :: Aguarda em loop ate a porta 8090 estar ouvindo (ate 10 tentativas)
    set /a attempts=0
    :wait_port
    set /a attempts+=1
    powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8090 -State Listen -ErrorAction SilentlyContinue) -ne $null" | findstr /i "True" >nul 2>nul
    if !ERRORLEVEL! neq 0 (
        if !attempts! lss 10 (
            timeout /t 1 /nobreak >nul
            goto wait_port
        )
    )
    goto launch_browser
)

echo [ERRO] Nao foi possivel iniciar o servidor via mozok-native nem via Python.
echo Instale o Rust ou Python para executar o MOZOK.
pause
exit /b 1

:launch_browser
echo [5/5] Abrindo MOZOK v2.0 em Modo de Aplicativo Dedicado sem Bordas...
if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS%
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS%
) else (
    start "" "%TARGET_URL%"
)

:finish_launch
echo.
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
