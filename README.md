# dudaFit — Meu Projeto 45 Dias

Planilha de treino de 45 dias em forma de app (**React + Vite**), publicada na **Vercel**.

- Sem login e sem servidor: tudo fica salvo no navegador do aparelho (`localStorage`).
- Na primeira vez ela responde: dias de academia por semana (2 ou 3), data de início e início da menstruação. Com isso o plano (fixo) e as fases do ciclo são calculados.
- Academia em **sequência** (A → B → C → A…): se ela não treinar num dia, o mesmo treino continua sendo o próximo. Pilates: 2x por semana, em qualquer dia.
- No celular basta abrir o site e responder o perfil uma vez para ver o treino do dia.

## Desenvolvimento

1. VS Code → **Reopen in Container**.
2. `npm run dev` → http://localhost:5173 · `npm test` · `npm run build`

Deploy: importar o repositório na Vercel (detecta Vite automaticamente, sem variáveis de ambiente).
