@echo off
REM ===============================================
REM Toolshub Gemini Chat API Test Script
REM ===============================================

REM Set your API key here
set API_KEY=YOUR_API_KEY_HERE

REM Set base URL
set BASE_URL=http://localhost:3000/api/tools

echo.
echo ===============================================
echo Toolshub Gemini Chat API Test
echo ===============================================
echo.

REM Test 1: Check API Key
echo [1] Testing API Key Authentication...
curl -X GET "%BASE_URL%/test" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json"
echo.
echo.

REM Test 2: Get Available Tools
echo [2] Getting Available Tools...
curl -X GET "%BASE_URL%" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json"
echo.
echo.

REM Test 3: Simple Text Chat
echo [3] Testing Simple Text Chat...
curl -X POST "%BASE_URL%/chat-gemini" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Halo! Siapa nama kamu dan apa yang bisa kamu lakukan?\"}"
echo.
echo.

REM Test 4: Get Gemini Models
echo [4] Getting Gemini Models...
curl -X GET "%BASE_URL%/gemini/models" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json"
echo.
echo.

REM Test 5: Test Gemini Connection
echo [5] Testing Gemini Connection...
curl -X GET "%BASE_URL%/gemini/test" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json"
echo.
echo.

echo ===============================================
echo All tests completed!
echo ===============================================
pause