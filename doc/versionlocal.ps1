# Script para forzar tu versión local al remoto en Git (PowerShell)
# -------------------------------

Write-Host "1️⃣ Abortando cualquier rebase o merge pendiente..." -ForegroundColor Cyan
git rebase --abort 2>$null
git merge --abort 2>$null

Write-Host "2️⃣ Cambiando a la rama master..." -ForegroundColor Cyan
git checkout master

Write-Host "3️⃣ Descargando referencias remotas (opcional)..." -ForegroundColor Cyan
git fetch origin

Write-Host "4️⃣ Forzando tu versión local al remoto..." -ForegroundColor Cyan
git push origin master --force

Write-Host "✅ Todo listo. Tu versión local ahora está en GitHub." -ForegroundColor Green
