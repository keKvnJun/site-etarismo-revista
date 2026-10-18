# etarismo. — revista digital · v2 (HTML único fiel ao Figma)

Transposição direta da **Page 3** do Figma `revista-design` para um único `index.html`
(HTML + CSS + JS inline, sem build e sem dependências). Fonte usada: as exportações do Figma
(`revista_conteudo.zip`: frames da home; `revist_conteudo2.zip`: os 20 modais).

A v1 (site em `css/` + `js/`) continua na branch `main`.

## Abrir

```bash
python -m http.server 8000   # http://localhost:8000
```

Abrir o `index.html` direto (`file://`) também funciona; só "copiar link" depende de HTTP.
Rotas: `#/leitura/<id>` abre uma matéria, `#/sumario` abre o sumário.

## Mapa Figma → HTML

| Frame exportado | No site |
|---|---|
| `Revista interativa moderna (cópia)-21` (1440×7876) | página inicial |
| `…(cópia)-20` (1440×10332) | "Todas as matérias" expandido |
| `Modal` … `Modal-19` (exceto `Modal-12`) | leitor, páginas 02–20 |
| `Modal-12` | sumário |

Medidas, cores e tipografia vêm da geometria dos SVGs. Até 1440 px tudo escala na
proporção do frame (`--u`); abaixo de 900 px a composição empilha em uma coluna
(o Figma não tem frame mobile).

## Pendências

- Os trechos sublinhados nas referências (págs. 18–19) aparecem sublinhados, mas a
  exportação SVG não traz os endereços dos links. Para torná-los clicáveis é preciso
  pegar as URLs no Figma.
- O texto das páginas 12–20 foi transcrito visualmente dos SVGs (o texto vem convertido
  em curvas). Vale uma revisão do texto.
