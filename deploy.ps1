# deployment script for MedCore Clinic on AWS EC2 Ubuntu

$PEM_PATH = "D:\SOTT\Project\medcore.pem"
$IP_ADDRESS = "18.60.40.74"
$USER = "ubuntu"
$LOCAL_ARCHIVE = "deploy.tar.gz"
$LOCAL_SCRIPT = "remote_deploy.sh"

Write-Host "=== Step 1: Configuring local PEM permissions ===" -ForegroundColor Cyan
icacls.exe $PEM_PATH /reset
icacls.exe $PEM_PATH /grant:r "$($env:username):(R)"
icacls.exe $PEM_PATH /inheritance:r

Write-Host "=== Step 2: Building frontend locally ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Local build failed."
    exit 1
}

Write-Host "=== Step 3: Packaging project files ===" -ForegroundColor Cyan
if (Test-Path $LOCAL_ARCHIVE) {
    Remove-Item $LOCAL_ARCHIVE -Force
}
# Compress required files into a tarball using bsdtar
tar -czf $LOCAL_ARCHIVE dist prisma src/server package.json package-lock.json tsconfig.json server.ts
if ($LASTEXITCODE -ne 0) {
    Write-Error "Packaging failed."
    exit 1
}

Write-Host "=== Step 4: Uploading files to EC2 ===" -ForegroundColor Cyan
scp -i $PEM_PATH -o StrictHostKeyChecking=no $LOCAL_ARCHIVE $LOCAL_SCRIPT "$($USER)@$($IP_ADDRESS):/home/ubuntu/"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to upload files to EC2."
    exit 1
}

Write-Host "=== Step 5: Executing remote deployment script via SSH ===" -ForegroundColor Cyan
ssh -i $PEM_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o TCPKeepAlive=yes "$($USER)@$($IP_ADDRESS)" "bash /home/ubuntu/$LOCAL_SCRIPT"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Remote deployment failed."
    exit 1
}

# Clean up local archive
if (Test-Path $LOCAL_ARCHIVE) {
    Remove-Item $LOCAL_ARCHIVE -Force
}

Write-Host "=== Deployment process complete! ===" -ForegroundColor Green
