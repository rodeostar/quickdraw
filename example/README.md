# Intro

This example app was tested on windows in VSCode. If you use another IDE, please look up documentation around setting up the deno environment.


## Setup: Linux/Mac

Install Deno:

`curl -fsSL https://deno.land/x/install/install.sh | sh`


## Setup: Windows

Install Deno:

`iwr https://deno.land/x/install/install.ps1 -useb | iex`

Skip this step if you already have Chocolatey installed.

Open powershell as administrator, then enter:

`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`

Install Make:

`choco install make`


## Configure VSCode

Install the marketplace extension:

`https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno`

This template comes with vscode workspace settings, preconfigured to use the appropriate import maps.


## Run the app

`make dev` - Development server

`make prod` - Server in production mode


## Deploy

Deployment requires a [deno deploy](https://deno.com/deploy) account.

After setting up Deno deploy, create the following two files:

.project - name of your deno deploy project

.token - access token from your deno deploy dashboard

`make deploy` - Deploys to deno deploy
