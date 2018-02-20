### Introdução

Este é um projeto simples para monitorar oportunidades de arbitragem entre o kraken e o mercadobitcoin.
Para executar o projeto você precisará do navegador Chrome e do plugin de CORS instalado: https://chrome.google.com/webstore/detail/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-app-launcher-info-dialog  

Adicionar os seguintes URL patterns no plugin:

```bash
*://support.kraken.com/*
*://kraken.zendesk.com/*
*://api.kraken.com/*

### Quick start
**Make sure you have Node version >= 6.0 and NPM >= 3**
> Clone/Download the repo then edit `app.component.ts` inside [`/src/app/app.component.ts`](/src/app/app.component.ts)

```bash
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/AngularClass/angular-starter.git

# change directory to our repo
cd angular-starter

# WINDOWS only. In terminal as administrator
npm install -g node-pre-gyp

# install the repo with npm
npm install

# start the server
npm start

# use Hot Module Replacement
npm run server:dev:hmr


___

# License
 [MIT](/LICENSE)
