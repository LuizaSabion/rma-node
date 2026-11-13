# Configuração do PowerShell para o Sistema Portable Environment

$ppwRoot = $PSScriptRoot

# adiciona o node no diretório para usar o comando padrão.
if (Test-Path "$ppwRoot\nodejs") {
    $env:Path = "$ppwRoot\nodejs;" + $env:Path
}

# --- Aliases / Funções para os comandos ---
function ppw-node {
    & "$ppwRoot\nodejs\node.exe" @args
}

function ppw-npm {
    & "$ppwRoot\nodejs\npm.cmd" @args
}

function ppw-npx {
    & "$ppwRoot\nodejs\npx.cmd" @args
}

function ppw-nest {
    & "$ppwRoot\nodejs\npx.cmd" "@nestjs\cli" @args
}

function ppw-shadcn {
    & "$ppwRoot\nodejs\npx.cmd" "shadcn@latest" @args
}

# atalhos para os comandos do projeto
function ppw-dev {
    & "$ppwRoot\nodejs\npm.cmd" run dev @args
}

# --- Customização do Prompt 
function prompt {
    # Pega apenas o nome da pasta atual (ex: "frontend" ou "backend")
    $folder = Split-Path -Leaf (Get-Location)
    
    # Exibe no formato: PS [frontend]> 
    Write-Host "PS " -NoNewline -ForegroundColor Cyan
    Write-Host "[$folder]" -NoNewline -ForegroundColor Green
    return "> "
}

function ppw-build {
    & "$ppwRoot\nodejs\npm.cmd" run build @args
}

# --- Funções do Git para o Ambiente Portátil ---

# Função para iniciar/conectar ao repositório rapidamente
function sistema-git-init {
    param ([string]$remoteUrl)
    
    if (-not (Test-Path ".git")) {
        git init
        git branch -M main
        Write-Host "Git inicializado!" -ForegroundColor Green
    }
    
    if ($remoteUrl) {
        git remote add origin $remoteUrl
        Write-Host "Repositório remoto vinculado: $remoteUrl" -ForegroundColor Green
    }
}

# Upload Automático (Salva tudo e envia)
function sistema-push {
    param ([string]$msg = "Atualização automática: " + (Get-Date -Format "dd/MM/yyyy HH:mm"))
    
    Write-Host "Enviando alterações para o GitHub..." -ForegroundColor Yellow
    git add .
    git commit -m "$msg"
    git push origin main
    Write-Host "Upload concluído!" -ForegroundColor Green
}

# Download Automático (Puxa as últimas atualizações)
function sistema-pull {
    Write-Host "Baixando alterações do GitHub..." -ForegroundColor Yellow
    git pull origin main
    Write-Host "Projeto atualizado!" -ForegroundColor Green
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  System Portable Environment Loaded!      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Node Path: $ppwRoot\nodejs" -ForegroundColor Yellow
Write-Host "Commands available: node, npm, npx, sistema-nest, etc." -ForegroundColor Gray
Write-Host ""
