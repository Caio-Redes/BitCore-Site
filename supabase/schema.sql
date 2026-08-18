-- ============================================================
-- BitCore - schema do banco de dados
-- Cole este script inteiro no SQL Editor do Supabase e clique em "Run"
-- ============================================================

-- Tabela de perfis (guarda quem é admin e quem é apenas visualizador)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

-- Cria automaticamente um perfil "viewer" sempre que alguém se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabela de posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb,
  cover_url text,
  published boolean not null default false,
  author_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Mantém "updated_at" sempre atualizado
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Segurança (Row Level Security)
-- ============================================================
alter table profiles enable row level security;
alter table posts enable row level security;

-- Qualquer pessoa logada pode ver seu próprio perfil (o middleware usa isso)
create policy "usuarios veem o proprio perfil"
  on profiles for select
  using (auth.uid() = id);

-- Todo mundo (mesmo sem login) pode ler posts publicados
create policy "posts publicados sao publicos"
  on posts for select
  using (published = true);

-- Admin pode ver TODOS os posts, inclusive rascunhos
create policy "admin ve todos os posts"
  on posts for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Só admin pode criar, editar ou excluir posts
create policy "admin cria posts"
  on posts for insert
  with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin edita posts"
  on posts for update
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin exclui posts"
  on posts for delete
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- Depois de rodar este script:
-- 1. Va em Authentication > Users e crie o seu usuario admin
--    (ou cadastre-se pela tela /admin/login do site, se voce
--    adicionar uma tela de cadastro).
-- 2. Volte aqui no SQL Editor e rode o comando abaixo, trocando
--    o e-mail pelo seu, para virar admin:
--
--    update profiles set role = 'admin' where email = 'seu-email@exemplo.com';
-- ============================================================
