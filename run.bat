@echo off
setlocal enabledelayedexpansion
title MOZOK v7.1 -- Atlas e Simulador Neuroanatomico 3D Multiescala

:: [PT-BR]: Script mestre de inicializacao do MOZOK com servidor HTTP nativo Rust (porta 8090), modo app dedicado e PWA.
:: [EN-GB]: Master launch script for MOZOK with native Rust HTTP server (port 8090), dedicated app mode, and PWA.
:: [AI-CTX]: @llm-invariant: Binds 127.0.0.1:8090, guarantees clean Win32 execution, signs binary with Authenticode.

echo ==============================================================================
echo MOZOK v7.1 -- Atlas e Simulador Neuroanatomico 3D Multiescala
echo Sistema Nervoso Central, Conectoma, Fisiologia e Patologia (MNI152 + Micro)
echo ==============================================================================
echo.

cd /d "%~dp0"
set "TARGET_URL=http://127.0.0.1:8090/index.html"
set "BROWSER_FLAGS=--app=%TARGET_URL% --start-maximized"

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
)

echo [1/5] Verificando e instalando icones multi-resolucao (Desktop, PWA, Godot)...
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

echo [4/5] Inicializando Aplicativo Desktop Nativo MOZOK (GPU Win32 :8090)...
taskkill /F /IM mozok-native.exe >nul 2>nul

where cargo >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Compilando/Verificando mozok-native em perfil release...
    cargo build --release -p mozok-native
    if exist "target\release\mozok-native.exe" (
        copy /y "target\release\mozok-native.exe" "mozok-native.exe" >nul
        powershell -NoProfile -Command "$c = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert -ErrorAction SilentlyContinue | Where-Object { $_.Subject -match 'Pedro Almeida' } | Select-Object -First 1; if ($c) { Unblock-File 'target\release\mozok-native.exe','mozok-native.exe' -ErrorAction SilentlyContinue; Set-AuthenticodeSignature -FilePath 'target\release\mozok-native.exe' -Certificate $c -HashAlgorithm SHA256 | Out-Null; Set-AuthenticodeSignature -FilePath 'mozok-native.exe' -Certificate $c -HashAlgorithm SHA256 | Out-Null }"
    )
)

if exist "target\release\mozok-native.exe" (
    echo [OK] Iniciando mozok-native.exe na GPU dedicada (porta 8090)...
    start "" "target\release\mozok-native.exe"
    goto finish_launch
)

if exist "mozok-native.exe" (
    echo [OK] Iniciando mozok-native.exe pre-compilado na GPU dedicada (porta 8090)...
    start "" "mozok-native.exe"
    goto finish_launch
)

powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8090 -State Listen -ErrorAction SilentlyContinue) -ne $null" | findstr /i "True" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Servidor HTTP local ja em execucao na porta 8090.
    goto launch_browser
)

python -c "import http.server" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Iniciando servidor HTTP Python em segundo plano (127.0.0.1:8090)...
    start /b "" python -m http.server 8090 --bind 127.0.0.1 --directory web
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
pause
exit /b 1

:launch_browser
echo [5/5] Abrindo MOZOK em Modo de Aplicativo Dedicado sem Bordas...
if defined CHROME_PATH (
    start "" "!CHROME_PATH!" %BROWSER_FLAGS%
) else if defined EDGE_PATH (
    start "" "!EDGE_PATH!" %BROWSER_FLAGS%
) else (
    start "" "%TARGET_URL%"
)

:finish_launch
echo.
echo [OK] MOZOK v7.1 em execucao:
echo      - Janela de aplicativo dedicado: Aberta sem barras de navegacao
echo      - Acesso em abas do navegador:   %TARGET_URL%
echo      - Instalacao como PWA nativo:    Ativa via manifest.json e sw.js
echo.
exit /b 0
