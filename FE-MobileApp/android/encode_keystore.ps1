# Script untuk mengubah keystore menjadi Base64 string siap pakai untuk GitHub Secrets.
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($ScriptDir -eq "") { $ScriptDir = "." }

$keystorePath = Join-Path $ScriptDir "app/upload-keystore.jks"
$outputPath = Join-Path $ScriptDir "app/upload-keystore.jks.base64"

if (Test-Path $keystorePath) {
    $bytes = [System.IO.File]::ReadAllBytes($keystorePath)
    $base64 = [System.Convert]::ToBase64String($bytes)
    # Menulis string tanpa karakter tambahan (BOM)
    [System.IO.File]::WriteAllText($outputPath, $base64)
    Write-Host "========================================================================" -ForegroundColor Green
    Write-Host "SUKSES! Berkas Base64 berhasil dibuat di:" -ForegroundColor Green
    Write-Host "   $outputPath" -ForegroundColor Cyan
    Write-Host "========================================================================" -ForegroundColor Green
    Write-Host "Langkah selanjutnya:"
    Write-Host "1. Buka berkas tersebut dan SALIN (COPY) semua teks di dalamnya."
    Write-Host "2. Masukkan ke GitHub Secret dengan nama: ANDROID_KEYSTORE_BASE64"
    Write-Host "========================================================================"
} else {
    Write-Host "EROR: Berkas keystore tidak ditemukan di:" -ForegroundColor Red
    Write-Host "   $keystorePath" -ForegroundColor Yellow
    Write-Host "Silakan buat keystore Anda terlebih dahulu sebelum menjalankan script ini."
}
