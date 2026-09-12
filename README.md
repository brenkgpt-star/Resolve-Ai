# Resolve Aí — MVP

Landing page com diagnóstico simulado por "IA" e vitrine de produtos recomendados,
pra pessoas com um problema doméstico urgente (chuveiro, torneira, tomada, porta etc).

## Estrutura

```
resolve-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # ponto de entrada
    ├── App.jsx               # monta a página a partir das seções
    ├── index.css
    ├── data/
    │   └── diagnosticData.js # categorias, diagnósticos e produtos (editar aqui pra mudar conteúdo)
    ├── hooks/
    │   └── useDiagnosis.js   # toda a lógica de estado do chat/diagnóstico
    └── components/
        ├── Header.jsx
        ├── Hero.jsx
        ├── DiagnosticChat.jsx
        ├── ChatMessage.jsx
        ├── TypingIndicator.jsx
        ├── ChipList.jsx
        ├── FreeformInput.jsx
        ├── Marketplace.jsx
        ├── ProductCard.jsx
        ├── Stars.jsx
        ├── HowItWorks.jsx
        ├── Footer.jsx
        └── icons.js
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Pra build de produção

```bash
npm run build
npm run preview
```

## O que ainda é "mockado" (precisa virar de verdade)

* O diagnóstico em `useDiagnosis.js` é baseado em regras fixas (`DIAGNOSIS\\\_DATA`), não chama
nenhuma IA de verdade. Pra conectar a um modelo real, trocar a lógica dentro de
`runDiagnosis()` por uma chamada de API (ex: Anthropic) que recebe a descrição do usuário
e devolve diagnóstico + categoria de produtos.
* Os botões "Ver oferta" não têm link real ainda — precisam apontar pra ofertas/afiliados de
verdade.
* O Tailwind está sendo carregado via CDN no `index.html` pra manter o setup simples. Se o
projeto crescer, vale trocar por Tailwind instalado via PostCSS (`npm install -D tailwindcss`).

