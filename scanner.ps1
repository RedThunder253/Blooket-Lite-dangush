# PowerShell Network IP Scanner

# Function to get MAC address and hostname
function Get-MacAndHostname {
    param (
        [string]$IPAddress
    )
    try {
        $arpOutput = arp -a $IPAddress
        $macAddress = ($arpOutput -split '\n' | Where-Object { $_ -match $IPAddress }) -split '\s+' | Select-Object -Last 1
        $hostname = [System.Net.Dns]::GetHostEntry($IPAddress).HostName
        return [PSCustomObject]@{
            IPAddress  = $IPAddress
            Hostname   = $hostname
            MacAddress = $macAddress
        }
    } catch {
        return [PSCustomObject]@{
            IPAddress  = $IPAddress
            Hostname   = "N/A"
            MacAddress = "N/A"
        }
    }
}

# Specify range of IPs to scan (adjust as needed)
$ipRange = "192.168.1."
$startRange = 1
$endRange = 254

# Loop through each IP in the range
Write-Host "Starting network scan..." -ForegroundColor Green
$results = @()
for ($i = $startRange; $i -le $endRange; $i++) {
    $currentIP = "$ipRange$i"
    Write-Host "Scanning $currentIP..." -ForegroundColor Yellow

    try {
        # Check if the port is open (defaulting to port 80)
        $port = 80
        $connection = Test-NetConnection -ComputerName $currentIP -Port $port -WarningAction SilentlyContinue

        if ($connection.TcpTestSucceeded) {
            # If port is open, get MAC and hostname
            Write-Host "$currentIP is active" -ForegroundColor Cyan
            $info = Get-MacAndHostname -IPAddress $currentIP
            $results += $info
        } else {
            Write-Host "$currentIP is inactive" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error scanning $currentIP: $_" -ForegroundColor Magenta
    }
}

# Display results
Write-Host "Scan complete. Active devices:" -ForegroundColor Green
$results | Format-Table -AutoSize

# Export results to a file
$results | Export-Csv -Path "scan_results.csv" -NoTypeInformation
Write-Host "Results saved to scan_results.csv" -ForegroundColor Green