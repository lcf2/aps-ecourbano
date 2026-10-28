# EcoUrbano

Aplicativo de mapeamento e monitoramento urbano para registro de ocorrências e acompanhamento ambiental.

## Visão geral

O projeto foi estruturado como uma aplicação Expo + React Native com Expo Router. A base do app já inclui:

- navegação por abas e rotas em `src/app`
- contexto global para localização, ambiente e ocorrências
- cadastro e listagem de ocorrências
- mapa de ocorrências
- telas ambientais para clima e qualidade do ar
- integração opcional com Supabase para autenticação e persistência remota
- armazenamento local em AsyncStorage como fallback seguro

## Pré-requisitos

- Node.js 18+ recomendado
- npm ou npx
- Expo CLI
- Android Studio / emulador Android, ou dispositivo físico com Expo Go
- Para autenticação remota: conta Supabase configurada

## Instalação

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo de exemplo de ambiente:

```bash
copy .env.example .env
```

4. Preencha os valores reais em `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anon
```

> Nunca versionar chaves reais, senhas ou tokens em repositório público.

## Execução

### Iniciar o app

```bash
npx expo start --clear --port 19000
```

### Executar no Android

```bash
npx expo start --android
```

### Executar no iOS

```bash
npx expo start --ios
```

### Verificar tipos

```bash
npx tsc --noEmit --pretty false
```

## Estrutura do projeto

- `src/app`: telas e rotas do Expo Router
- `src/components`: componentes reutilizáveis
- `src/context`: providers globais de autenticação e app
- `src/services`: integrações com localização, ambiente, auth e persistência
- `src/types`: tipos TS
- `src/constants`: categorias e configurações
- `src/theme`: tokens visuais
- `supabase/schema.sql`: schema e políticas do banco
- `.env.example`: exemplo das variáveis públicas do Supabase

## Funcionalidades implementadas

### Concluídas

- Navegação entre telas de início, clima, qualidade do ar, ocorrências e mapa
- Registro de ocorrência local com título, categoria, descrição e data
- Listagem de ocorrências com filtro por categoria
- Detalhe de ocorrência
- Fallback de armazenamento local com AsyncStorage
- Estados de carregamento, erro e vazio em telas principais
- Mensagens de permissão de localização e orientação manual de endereço
- Integração de autenticação Supabase quando configurada
- Schema SQL com políticas RLS para `profiles` e `ocorrencias`

### Parciais

- Sincronização remota com Supabase: depende de `.env` válido e de projeto Supabase ativo
- Mapa em runtime real: depende da inicialização correta do Metro/Expo no ambiente local
- Dados ambientais: a aplicação usa dados de demonstração claramente identificados enquanto a API externa não é conectada

### Não implementadas

- Serviços externos reais de clima e qualidade do ar conectados ao app
- Autenticação completa de usuários em produção com fluxo de recuperação de senha
- Upload de imagens ou anexos em ocorrências
- Painel administrativo para gestão de registros

## Segurança e boas práticas

- As chaves públicas do Supabase devem ficar em `.env` local e nunca no Git
- O app usa `EXPO_PUBLIC_` apenas para variáveis públicas
- O schema SQL utiliza RLS ativo para `public.ocorrencias`
- A autenticação exige sessão autenticada antes de inserir ou consultar dados remotos
- O app mantém fallback local quando não há configuração do Supabase

## Limitações conhecidas

- A interface de clima e qualidade do ar está pronta para integração, mas os valores atuais são dados de demonstração e não representam medições reais
- A autenticação via Supabase só funciona quando o arquivo `.env` estiver preenchido corretamente
- A inicialização do app em ambiente local pode ser bloqueada por inconsistências na instalação do Expo/Metro
- O mapa e o sistema de localização dependem de permissões do sistema operacional e de serviços ativos

## Evidência de validação

### Verificado com sucesso

```bash
cd c:\Users\USER\Documents\aps final\eco-urbano
npx tsc --noEmit --pretty false
```

Resultado: comando sem erro de TypeScript.

### Bloqueio de runtime identificado

```bash
cd c:\Users\USER\Documents\aps final\eco-urbano
npx expo start --clear --port 19000
```

Resultado observado: erro do ambiente Expo/Metro relacionado a módulo ausente em `node_modules/expo/node_modules/@expo/metro-config`:

```text
Error: Cannot find module '...@expo/metro-config/build/babel-transformer.js'
```

Esse problema é do setup do projeto local e não de uma falha funcional do app em TypeScript.

## Observações finais

O projeto está em bom estado de organização para apresentação acadêmica, com arquitetura clara e módulos bem segmentados. O que já funciona por código e por estrutura foi preservado, enquanto as partes que dependem de serviço externo ou do ambiente Expo foram documentadas como limitações conhecidas.
