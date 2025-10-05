@echo off
REM ===============================================
REM Toolshub Gemini File Upload Test Script
REM ===============================================

REM Set your API key here
set API_KEY=YOUR_API_KEY_HERE

REM Set base URL
set BASE_URL=http://localhost:3000/api/tools

REM Set your file path here (change this to your actual file)
set IMAGE_PATH=C:\path\to\your\image.jpg
set PDF_PATH=C:\path\to\your\document.pdf

echo.
echo ===============================================
echo Toolshub Gemini File Upload Test
echo ===============================================
echo.

REM Check if image file exists
if not exist "%IMAGE_PATH%" (
    echo WARNING: Image file not found at %IMAGE_PATH%
    echo Please update IMAGE_PATH variable in this script
    echo.
)

REM Check if PDF file exists
if not exist "%PDF_PATH%" (
    echo WARNING: PDF file not found at %PDF_PATH%
    echo Please update PDF_PATH variable in this script
    echo.
)

echo Note: Make sure to update API_KEY and file paths before running tests
echo.

REM Test 1: Upload Image Only
echo [1] Testing Image Upload (Image Only)...
if exist "%IMAGE_PATH%" (
    curl -X POST "%BASE_URL%/chat-gemini" ^
         -H "x-api-key: %API_KEY%" ^
         -F "file=@%IMAGE_PATH%"
) else (
    echo SKIPPED: Image file not found
)
echo.
echo.

REM Test 2: Upload Image with Message
echo [2] Testing Image Upload with Message...
if exist "%IMAGE_PATH%" (
    curl -X POST "%BASE_URL%/chat-gemini" ^
         -H "x-api-key: %API_KEY%" ^
         -F "message=Jelaskan apa yang ada di gambar ini secara detail" ^
         -F "file=@%IMAGE_PATH%"
) else (
    echo SKIPPED: Image file not found
)
echo.
echo.

REM Test 3: Upload PDF with Message
echo [3] Testing PDF Upload with Message...
if exist "%PDF_PATH%" (
    curl -X POST "%BASE_URL%/chat-gemini" ^
         -H "x-api-key: %API_KEY%" ^
         -F "message=Buatkan ringkasan dari dokumen PDF ini" ^
         -F "file=@%PDF_PATH%"
) else (
    echo SKIPPED: PDF file not found
)
echo.
echo.

REM Test 4: Test Multiple Conversation
echo [4] Testing Conversation with Custom ID...
curl -X POST "%BASE_URL%/chat-gemini" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Ini adalah pesan pertama dalam percakapan\", \"conversationId\": \"test_conv_001\"}"
echo.
echo.

echo [5] Testing Follow-up Message...
curl -X POST "%BASE_URL%/chat-gemini" ^
     -H "x-api-key: %API_KEY%" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Lanjutkan pembahasan sebelumnya\", \"conversationId\": \"test_conv_001\"}"
echo.
echo.

echo ===============================================
echo File upload tests completed!
echo ===============================================
echo.
echo To customize this script:
echo 1. Update API_KEY with your actual API key
echo 2. Update IMAGE_PATH with path to your test image
echo 3. Update PDF_PATH with path to your test PDF
echo.
pause