# Interface Copa Bet

Telas oficiais do produto. Servidas pelo backend em **http://localhost:3000**.

## Pastas

| Pasta | Conteúdo |
|-------|----------|
| `css/` | Estilos por tela |
| `js/` | Lógica + integração com `/api` |
| `pages/` | Dashboard, jogos, palpites, ranking, perfil, admin |
| `images/` | `logo.jpeg`, `background.jpeg` |

## Scripts JS

- `api.js` — cliente HTTP
- `auth.js` — sessão de login
- `common.js` — cabeçalho, toast, tickets
- `jogos.js`, `palpites.js`, `dashboard.js`, `ranking.js` — telas conectadas à API

## Rodar

Na **raiz** do repositório (`copaBet/`):

```bash
npm run dev
```

Não abra os arquivos HTML direto no navegador.
