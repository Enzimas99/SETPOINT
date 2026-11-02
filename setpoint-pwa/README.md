# SETPOINT

Súmula digital de voleibol (PWA). Arquivos: `index.html` (app), `manifest.webmanifest`, `sw.js` (offline) e os ícones.

## Publicar no GitHub Pages
1. Crie conta em github.com e clique em **New repository**. Nome: `setpoint`. Deixe **Public** e crie.
2. Na página do repositório: **uploading an existing file** e arraste TODOS os arquivos desta pasta (descompactada). Clique **Commit changes**.
3. **Settings → Pages**. Em *Build and deployment*: Source **Deploy from a branch**, Branch **main**, pasta **/ (root)**, **Save**.
4. Em 1–2 minutos o endereço aparece no topo: `https://SEU-USUARIO.github.io/setpoint/`.

## Instalar no celular
- Android (Chrome): menu ⋮ → **Instalar app** / **Adicionar à tela inicial**.
- iPhone (Safari): **Compartilhar** → **Adicionar à Tela de Início**.
Abra uma vez com internet; depois funciona offline.

## Atualizar
No GitHub abra `index.html` → ✎ → cole a versão nova → **Commit changes**. O app atualiza sozinho quando abrir com internet. Se não mudar, aumente o número `CACHE='setpoint-v1'` em `sw.js`.
