# SETPOINT - ativar login e nuvem (Supabase)

O app funciona sem nada disso (só neste aparelho). Estes passos ligam a conta e a sincronização.
Você só faz isto UMA vez. Reserve uns 15 minutos.

## 1. Criar o projeto no Supabase
1. Entre em https://supabase.com e crie uma conta gratuita.
2. **New project**: nome `setpoint`, escolha uma senha forte para o banco (guarde-a) e a região mais próxima (ex.: South America / São Paulo). Aguarde terminar de criar.

## 2. Criar as tabelas e as regras de segurança
1. No menu do projeto, abra **SQL Editor** → **New query**.
2. Abra o arquivo `supabase-setup.sql`, copie TUDO, cole e clique em **Run**. Deve aparecer "Success".
   (Isso cria as tabelas `teams` e `matches` e liga a segurança: cada usuário só acessa os próprios dados.)

## 3. Dizer ao Supabase qual é o endereço do app
Menu **Authentication → URL Configuration**:
- **Site URL**: o endereço do seu app, por exemplo `https://enzimas99.github.io/SETPOINT/setpoint-pwa/`
- **Redirect URLs**: adicione `https://enzimas99.github.io/**`
Salve. (Sem isso, os links de e-mail de confirmação e de recuperação de senha não funcionam.)

## 4. E-mail de confirmação
Em **Authentication** (aba de provedores/Sign In) → **Email**:
- Com **Confirm email** LIGADO (recomendado), cada pessoa precisa clicar no link do e-mail antes de entrar.
- O envio de e-mail padrão do Supabase tem limite baixo por hora. Para muitos usuários, configure um SMTP próprio em **Authentication → SMTP**.
- Para testar rápido sozinho, você pode desligar a confirmação por um tempo e ligar de novo depois.

## 5. Copiar os dados do projeto para o app
1. Menu **Project Settings → API Keys** (ou "API").
2. Copie a **Project URL** (algo como `https://abcdefgh.supabase.co`).
3. Copie a **Publishable key** (começa com `sb_publishable_`; em projetos mais antigos pode ser a chave `anon`).
4. No GitHub, abra o arquivo `config.js`, clique no lápis, cole os dois valores entre as aspas e faça **Commit changes**.

IMPORTANTE: use só a chave **publishable/anon** (pública por desenho, protegida pelas regras do passo 2). NUNCA cole a chave **secret** ou **service_role** no `config.js`.

## 6. Atualizar o app no GitHub
Envie para a pasta `setpoint-pwa` do repositório os arquivos novos: `index.html`, `sw.js` e `config.js` (já preenchido). Abra o app com internet; ele se atualiza sozinho.

## 7. Testar
1. No app, na tela inicial, toque em **Criar conta**, informe nome, e-mail e senha (mín. 6 caracteres).
2. Confirme o e-mail (se a confirmação estiver ligada) e entre.
3. Se havia equipes/partidas salvas no aparelho antes do login, o app pergunta se quer enviá-las para a conta.
4. Crie uma equipe, espere o texto "☁ Tudo sincronizado" no canto da tela.
5. Entre com a mesma conta em outro aparelho: as equipes e partidas aparecem lá.
6. Modo avião: registre pontos; aparece "☁ Offline · N pendente(s)". Ao voltar a internet, ele envia sozinho.

## Como funciona (resumo)
- O app sempre grava primeiro no aparelho. A nuvem é uma cópia, sincronizada em segundo plano.
- Cada conta tem seu próprio armazenamento local; sair de uma conta e entrar em outra não mistura dados.
- Se a mesma equipe for editada em dois aparelhos, vale a alteração mais recente.
- Excluir uma equipe ou partida também é sincronizado.
- O **backup em arquivo** continua existindo como segurança extra.

## Atenção
- Projetos do plano gratuito do Supabase podem ser **pausados após cerca de uma semana sem uso**. Se isso acontecer, entre no painel e clique em restaurar/retomar o projeto (confira as regras atuais do plano). Os dados no aparelho continuam seguros.
- Esqueceu a senha? Na tela de login, toque em "Esqueci minha senha".
