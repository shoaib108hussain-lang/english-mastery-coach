@echo off
title English Mastery Coach Launcher
echo ===================================================
echo   🇬🇧 English Mastery Coach (Start -> B2) Launcher
echo ===================================================
echo Starting local web server...
cd /d "C:\Users\dell\.gemini\antigravity-ide\scratch\english-mastery-coach"

start "" python server.py
timeout /t 2 /nobreak >nul

echo Opening application in default web browser...
start "" "http://localhost:8095"
