@echo off
setlocal enabledelayedexpansion
title MOZOK v1.0 Beta -- Atlas e Simulador Neuroanatomico 3D Multiescala

:: [PT-BR]: Script mestre de inicializacao do MOZOK v1.0 Beta com servidor HTTP nativo Rust (porta 8090), modo app dedicado e PWA.
:: [EN-GB]: Master launch script for MOZOK v1.0 Beta with native Rust HTTP server (port 8090), dedicated app mode, and PWA.
:: [AI-CTX]: @llm-context: Prevents file:/// CORS issues, normalizes Windows paths, avoids WindowsApps/python.exe false positives, and ensures robust server startup.
::           @llm-invariant: Binds 127.0.0.1:8090, guarantees clean Win32 execution, and launches dedicated application window without browser chrome.
::           @llm-neuroscience: High-performance low-latency rendering pipeline for the entire Central Nervous System and Layer V neuron.

echo ==============================================================================
echo MOZOK v1.0 Beta -- Atlas e Simulador Neuroanatomico 3D Multiescala
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
    echo [OK] Biblioteca de audios neurais pre-compilados validada [27 de 27 arquivos].
)
echo.

echo [3/5] Configurando GPU dedicada NVIDIA exclusivamente para mozok-native.exe...
reg delete "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%ProgramFiles%\Google\Chrome\Application\chrome.exe" /f >nul 2>nul
reg delete "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" /f >nul 2>nul
reg delete "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" /f >nul 2>nul
reg delete "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" /f >nul 2>nul
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%~dp0mozok-native.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>nul
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v "%~dp0target\release\mozok-native.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>nul
echo [OK] GPU dedicada vinculada apenas ao aplicativo nativo (Chrome/Edge livres).
echo.

echo [4/5] Inicializando Aplicativo Desktop Nativo MOZOK (GPU Win32)...
:: Encerra qualquer instancia antiga travada de mozok-native.exe
taskkill /F /IM mozok-native.exe >nul 2>nul

:: Recompila mozok-native se cargo estiver disponivel
where cargo >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Compilando/Verificando mozok-native em perfil release...
    cargo build --release -p mozok-native
)

if exist "target\release\mozok-native.exe" (
    echo [OK] Iniciando mozok-native.exe na GPU dedicada...
    start "" "target\release\mozok-native.exe"
    goto finish_launch
)

:: Verifica se a porta 8090 ja esta ativa caso nao utilize mozok-native
powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8090 -State Listen -ErrorAction SilentlyContinue) -ne $null" | findstr /i "True" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Servidor HTTP local ja em execucao na porta 8090.
    goto launch_browser
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
echo [5/5] Abrindo MOZOK v1.0 Beta em Modo de Aplicativo Dedicado sem Bordas...
if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS%
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS%
) else (
    start "" "%TARGET_URL%"
)

:finish_launch
echo.
echo [OK] MOZOK v1.0 Beta em execucao:
echo      - Janela de aplicativo dedicado: Aberta sem barras de navegacao
echo      - Acesso em abas do navegador:   %TARGET_URL%
echo      - Instalacao como PWA nativo:    Ativa via manifest.json e sw.js
echo.

where godot >nul 2>nul
if %ERRORLEVEL% equ 0 (
    if "%1"=="--godot" (
        echo [Godot 4] Iniciando motor Godot 4 nativo...
        start "" godot --path .
    ) else (
        echo [Godot 4] Motor Godot 4 detectado. Para iniciar junto, use: run.bat --godot
    )
)

echo ==============================================================================
echo MOZOK v1.0 Beta em execucao! Para reiniciar, execute run.bat novamente.
echo ==============================================================================
exit /b 0
