@echo off
title AutoClick Antigravity V5.0
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                    ANTIGRAVITY AUTOCLICK V5.0                      ║
echo ║         Iniciando Acelite Automatico...                           ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

:: Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado! Instale Python 3.10+ primeiro.
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Verificar/instalar dependencias
echo [INFO] Verificando dependencias...
pip install -r requirements.txt --quiet

:: Executar o AutoClick
echo.
echo [INFO] Iniciando AutoClick...
echo.
python autoclick.py

pause
