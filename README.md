# BitCore — Blog de Estudos

Site com listagem pública de posts e um painel de admin para criar, editar
e excluir posts (com editor rico: texto, código, imagens). Só quem for
marcado como **admin** vê os botões de gerenciar; qualquer visitante só
consegue ler os posts publicados.

Este guia assume que você **não programa** — siga na ordem, sem pular
etapas. Vai levar uns 30-40 minutos na primeira vez.

---

## Parte 1 — Criar o banco de dados (Supabase)

1. Acesse **https://supabase.com**, clique em **Start your project** e
   crie uma conta (dá pra usar login do GitHub ou Google).
2. Clique em **New project**. Dê um nome (ex: `bitcore`), crie uma senha
   forte para o banco (guarde essa senha em um lugar seguro) e escolha
   uma região perto do Brasil (ex: `South America (São Paulo)`).
3. Aguarde uns 2 minutos até o projeto ficar pronto.
4. No menu lateral, clique em **SQL Editor** → **New query**.
5. Abra o arquivo `supabase/schema.sql` (está dentro da pasta do projeto
   que você recebeu), copie **todo** o conteúdo, cole no editor SQL do
   Supabase e clique em **Run**. Isso cria as tabelas e as regras de
   segurança automaticamente.
6. No menu lateral, clique em **Storage** → **New bucket**. Nome:
   `post-images`. Marque a opção **Public bucket**. Clique em **Create bucket**.
   (É aqui que ficam as imagens dos posts.)
7. Ainda no menu lateral, clique em **Project Settings** (ícone de
   engrenagem) → **API**. Você vai precisar de dois valores nessa
   tela, guarde-os:
   - **Project URL**
   - **anon public** key (uma chave longa)

## Parte 2 — Criar seu usuário admin

1. No menu lateral do Supabase, clique em **Authentication** → **Users**
   → **Add user** → **Create new user**.
2. Preencha com seu e-mail e uma senha (essa é a senha que você vai usar
   para entrar em `/admin/login` no site). Marque **Auto Confirm User**.
3. Clique em **Create user**.
4. Volte no **SQL Editor**, cole o comando abaixo (trocando o e-mail pelo
   que você acabou de cadastrar) e clique em **Run**:

   ```sql
   update profiles set role = 'admin' where email = 'seu-email@exemplo.com';
   ```

   Isso transforma seu usuário em administrador. Qualquer outra pessoa
   que se cadastrar no futuro entra como "viewer" (só leitura) por padrão.

## Parte 3 — Configurar o projeto

1. Dentro da pasta do projeto, encontre o arquivo `.env.local.example`.
   Faça uma cópia dele e renomeie a cópia para `.env.local`.
2. Abra o `.env.local` e preencha com os valores que você guardou na
   Parte 1, passo 7:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

## Parte 4 — Colocar no ar (Vercel)

1. Crie uma conta em **https://vercel.com** (pode usar login do GitHub).
2. A forma mais simples é subir a pasta do projeto para um repositório
   no **GitHub** primeiro:
   - Crie uma conta em **https://github.com** se ainda não tiver.
   - Crie um repositório novo (botão **New**), com o nome `bitcore`.
   - Na página do repositório vazio, siga as instruções de
     "uploading an existing file" e arraste todos os arquivos da pasta
     do projeto para lá (menos a pasta `node_modules`, que nem existe
     ainda, e o arquivo `.env.local`, que é secreto e não deve ir pro
     GitHub).
3. Na Vercel, clique em **Add New** → **Project**, escolha o repositório
   `bitcore` que você acabou de criar no GitHub.
4. Antes de clicar em **Deploy**, abra a seção **Environment Variables**
   e adicione as duas mesmas variáveis do seu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy**. Em 1-2 minutos seu site estará no ar, com um
   endereço tipo `bitcore-seu-usuario.vercel.app`.

## Parte 5 — Usar o site no dia a dia

- Site público: `https://seu-site.vercel.app`
- Painel admin: `https://seu-site.vercel.app/admin/login`
- Entre com o e-mail e senha que você criou na Parte 2.
- No painel, clique em **+ novo post** para escrever (dá pra formatar
  texto, adicionar títulos, listas, blocos de código e imagens). Você
  pode salvar como **rascunho** (só você vê) ou **publicar** (todo mundo vê).
- Para tirar um post do ar sem apagar, edite e salve como rascunho.
- Para apagar de vez, use o botão **excluir** no painel.

---

## Rodando no seu computador (opcional, para quem quiser mexer no código)

Se você tiver o **Node.js** instalado, dentro da pasta do projeto rode:

```bash
npm install
npm run dev
```

E acesse `http://localhost:3000`.

## Se algo der errado

- **"Erro ao salvar" ou tela em branco no admin**: confira se o passo 4
  da Parte 2 (transformar seu usuário em admin) foi feito corretamente.
- **Imagens não aparecem**: confira se o bucket `post-images` foi criado
  como **público** (Parte 1, passo 6).
- **Site não conecta ao banco**: confira se `NEXT_PUBLIC_SUPABASE_URL` e
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão certos, tanto no `.env.local`
  quanto nas variáveis de ambiente da Vercel.
