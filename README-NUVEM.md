# SETPOINT — contas e nuvem (guia do administrador)

**Para o usuário comum não há nada a configurar.** Ele abre o app, toca em **Criar conta** (nome, e-mail e senha) ou **Entrar**, e as equipes e partidas passam a ser guardadas na conta e sincronizadas entre aparelhos. Sem conta, o app continua funcionando normalmente, só neste aparelho.

Este guia é só para quem publica o app (administrador). Faça uma vez.

## 1. Projeto no Supabase
1. Em https://supabase.com crie um projeto gratuito (nome `setpoint`, região mais próxima).
2. **SQL Editor → New query**: cole TODO o arquivo `supabase-setup.sql` e execute (**Run**). Ele cria as tabelas `teams` e `matches` e liga a segurança (RLS): cada usuário só lê e altera as próprias linhas; visitantes sem login não têm acesso.

## 2. Endereços do app (Authentication → URL Configuration)
- **Site URL**: o endereço exato do app publicado, com a pasta. Ex.: `https://SEU-USUARIO.github.io/SETPOINT/setpoint-pwa/`
  (não use só a raiz `https://SEU-USUARIO.github.io/`: ela não tem site e dá erro 404).
- **Redirect URLs**: adicione `https://SEU-USUARIO.github.io/**`.
Sem isso, os links de confirmação de e-mail e de recuperação de senha não funcionam.

## 3. E-mails (Authentication → Providers → Email)
- **Confirm email** ligado: cada pessoa confirma o e-mail antes de entrar (recomendado).
- O envio de e-mail padrão do Supabase tem limite baixo por hora. Para uso real, configure um SMTP próprio em **Authentication → SMTP**.
- Para testar sozinho, você pode desligar a confirmação por um tempo.

## 4. Chave pública no app (uma vez, só você)
No arquivo `index.html`, procure por `BUILTIN` e confira:
```
const BUILTIN={url:'https://SEU-PROJETO.supabase.co',key:'sb_publishable_...'};
```
- A **Project URL** e a **chave publishable** (Project Settings → API Keys) são públicas por desenho e podem ficar no código: a proteção é feita pelas regras RLS do passo 1.
- **NUNCA** coloque a chave `secret` ou `service_role` em nenhum arquivo do app.
- O usuário comum nunca vê nem digita essas informações. (O arquivo opcional `config.js` não é mais necessário.)

## Como funciona
- **Offline primeiro**: o app sempre grava no aparelho; a nuvem é uma cópia sincronizada em segundo plano. Sem internet, os pontos ficam guardados e são enviados quando a conexão volta, sem duplicar.
- **Contas separadas**: cada conta tem seu próprio armazenamento local; sair de uma conta e entrar em outra não mistura dados.
- **Alterações em dois aparelhos**: vale a mais recente. Exclusões também são sincronizadas.
- **Indicador de estado** (barra superior): "Tudo sincronizado", "N aguardando envio", "Offline · N pendente(s)" ou "Falha ao sincronizar".
- **Login**: e-mail e senha, criação de conta, recuperação de senha e confirmação de e-mail.

## Teste em dois aparelhos
1. Crie uma conta no aparelho 1 e uma equipe: aguarde "Tudo sincronizado".
2. Entre com a mesma conta no aparelho 2: a equipe aparece.
3. Modo avião no aparelho 1: registre pontos ("Offline · N pendente(s)"). Ao reconectar, envia sozinho; no aparelho 2 a partida aparece completa e sem duplicar.

## Problemas comuns
- **Link do e-mail abre "There isn't a GitHub Pages site here"**: o Site URL está na raiz. Corrija (passo 2) e peça um novo e-mail.
- **"Link expirado ou inválido"**: o link vale uma vez só; alguns apps de e-mail o abrem sozinhos. Tente entrar com e-mail e senha; se pedir confirmação, use "Reenviar e-mail de confirmação" na tela de login.
- **"Entrar indisponível"**: falta a chave publishable em `BUILTIN` (passo 4).
- **"Nuvem sem as tabelas"**: o `supabase-setup.sql` não foi executado (passo 1).
- Projetos do plano gratuito do Supabase podem ser pausados após cerca de uma semana sem uso: retome o projeto no painel (confira as regras atuais do plano). Os dados no aparelho continuam seguros.
