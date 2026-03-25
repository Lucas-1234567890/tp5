# SPA de Leilões de Imóveis (Mobile-First)

Este projeto demonstra uma aplicação web single-page (SPA) desenvolvida com React, focada em leilões de imóveis. O objetivo é atender ao trabalho de Engenharia de Software, com design *mobile-first* e funcionalidades exigidas nas histórias de usuário.

## Tecnologias

- React (JSX)
- React Router
- react-swipeable (gestos)

> **Nota:** como o ambiente de desenvolvimento não possui `npm` instalado, este repositório contém apenas os arquivos de código necessários. Em um ambiente real, execute `npm install` ou `yarn` para instalar dependências.

## Principais recursos implementados

1. **Autenticação e integração com API**
   - Componente `Login` obtém token via `/login` com credenciais fixas.

2. **Listagem de leilões**
   - `LeilaoList` busca `/leiloes` usando o token.
   - Exibe skeleton screens durante carregamento.
   - Clique em um lote abre detalhes.

3. **Detalhes do lote e navegação por gestos**
   - `LeilaoDetail` mostra título, descrição e valor.
   - Suporta swipe horizontal (touch/mouse) para avançar/voltar.
   - Botão "Dar Lance" é desabilitado quando offline; mensagem explicativa.
   - Efeito elástico quando usuário tenta avançar além dos limites.

4. **Cadastro de imóvel via CEP**
   - `ImovelForm` permite inserir CEP, buscar endereço automaticamente (mock) e preencher campos.
   - Validação de CEP, borda vermelha e mensagem de erro.
   - Botão "Salvar" desabilitado até a correção.
   - Campos reorganizam-se verticalmente em dispositivos móveis.
   - Cache de CEP evita buscas repetidas.

5. **Feedback visual e usabilidade**
   - Skeletons, toasts e micro-interações (ex: botão de lances muda estado)
   - Todo elemento interativo tem pelo menos 44x44px de área de toque.
   - Layout responsivo com mobile-first; utiliza `container`, `flex-row` e outras classes.

6. **Cache Offline simples**
   - Após carregar lista de leilões, dados ficam disponíveis se a conexão cair.

7. **Estrutura de componentes flexível**
   - Arquivo `App.jsx` gerencia estados e navegação entre telas.
   - Utiliza contexto de toast para notificações.

## Como usar (hipotético)

1. Clonar repositório.
2. Executar `npm install` (necessário Node.js).
3. Rodar `npm run dev` ou equivalente (Vite, CRA, etc.).
4. Acesso via navegador; a aplicação abrirá em `http://localhost:3000`.

## Critérios de aceitação atendidos

- Busca de CEP com resposta < 2s e foco automático no campo número.
- Validação de CEP com mensagem e borda vermelha.
- Layout responsivo para mobile (<768px) com campo empilhado e altura mínima de 44px.
- Swipe rápido (<300ms) e atualização de contador de página.
- Comportamento offline: botões desabilitados e conteúdo em cache.
- Resistência elástica sem crashes.

## Observações adicionais

- A API `ConsultaLeilao` é utilizada diretamente; para testes locais, é possível substituí-la por mocks.
- Gestos e animações são básicos, mas demonstram a ideia principal.
- A interface usa CSS simples; 
---