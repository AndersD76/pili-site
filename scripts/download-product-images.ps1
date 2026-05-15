# download-product-images.ps1
# Downloads product images from pili.ind.br and saves them to public/images/tombadores/
#
# Usage: powershell -ExecutionPolicy Bypass -File scripts/download-product-images.ps1
#
# After downloading, update src/lib/product-images.ts PRODUCT_IMAGES map
# with the slug -> file path entries for each successfully downloaded image.

$outputDir = Join-Path $PSScriptRoot "..\public\images\tombadores"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

# PILI product page IDs (from pili.ind.br)
$pages = @(
    @{ id = 1;  slug = "tombador-10m-fixo";   name = "Tombador 10 Metros Fixo" },
    @{ id = 3;  slug = "tombador-11m-fixo";   name = "Tombador 11 Metros Fixo" },
    @{ id = 7;  slug = "tombador-26m-fixo";   name = "Tombador 26 Metros Fixo" },
    @{ id = 8;  slug = "tombador-30m-fixo";   name = "Tombador 30 Metros Fixo" },
    @{ id = 23; slug = "tombador-10m-movel";  name = "Tombador 10 Metros Movel" },
    @{ id = 28; slug = "tombador-26m-movel";  name = "Tombador 26 Metros Movel" }
)

Write-Host ""
Write-Host "=== PILI Product Image Downloader ===" -ForegroundColor Cyan
Write-Host ""

foreach ($page in $pages) {
    $url = "https://www.pili.ind.br/produto/$([uri]::EscapeDataString($page.name))/$($page.id)"
    Write-Host "Fetching page: $url" -ForegroundColor Yellow

    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
        $imgMatches = [regex]::Matches($response.Content, 'src="([^"]*\.(jpg|jpeg|png|webp)(\?[^"]*)?)"')

        if ($imgMatches.Count -eq 0) {
            Write-Host "  No images found on page." -ForegroundColor Red
            continue
        }

        $imgIndex = 0
        foreach ($match in $imgMatches) {
            $imgUrl = $match.Groups[1].Value
            $ext = $match.Groups[2].Value

            # Skip tiny icons, logos, etc
            if ($imgUrl -match "logo|icon|favicon|banner") { continue }

            # Make absolute URL if relative
            if ($imgUrl.StartsWith("/")) {
                $imgUrl = "https://www.pili.ind.br$imgUrl"
            }
            if (-not $imgUrl.StartsWith("http")) { continue }

            $imgIndex++
            $filename = if ($imgIndex -eq 1) { "$($page.slug).$ext" } else { "$($page.slug)-$imgIndex.$ext" }
            $outputPath = Join-Path $outputDir $filename

            Write-Host "  Downloading: $imgUrl" -ForegroundColor Gray
            Write-Host "  Saving to:   $filename" -ForegroundColor Green

            try {
                Invoke-WebRequest -Uri $imgUrl -OutFile $outputPath -TimeoutSec 30
                Write-Host "  OK" -ForegroundColor Green
            }
            catch {
                Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "  Could not fetch page: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check downloaded images in: $outputDir"
Write-Host "2. Update src/lib/product-images.ts with the file paths for downloaded images."
Write-Host "   Example:"
Write-Host '   "tombador-30m-fixo": "/images/tombadores/tombador-30m-fixo.jpg"'
Write-Host ""
