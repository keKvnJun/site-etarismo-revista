# etarismo. — revista digital (edição especial 2026)

Site estático (HTML + CSS + JavaScript puro, sem build e sem dependências) baseado na **Page 3** do Figma `revista-design` (nó `194:3869`).

## Como abrir

Sirva a pasta por HTTP (copiar link e algumas checagens do navegador não funcionam em `file://`):

```bash
cd revista-etarismo
python3 -m http.server 8000
# abra http://localhost:8000
```

Links diretos funcionam: `#/leitura/<id>` abre uma matéria (ex.: `#/leitura/mercado-muda`) e `#/sumario` abre o sumário.

## Estrutura

```
index.html            página única: capa, números, matérias, editorial, dados, glossário, equipe, rodapé
css/styles.css        tokens do Figma, layout responsivo, movimento (respeita prefers-reduced-motion)
js/edition.js         estrutura da edição: ordem, páginas, temas, números, glossário, equipe
js/articles-a.js      texto integral das páginas transcritas do Figma
js/app.js             leitor, filtros, paginação, busca, salvos, gráfico, roteamento
assets/fonts/         DM Serif Display, DM Sans e Lora (SIL OFL 1.1, via @fontsource)
assets/img/           fotos (ver abaixo)
assets/charts/        gráficos originais das matérias (ver abaixo)
```

## O que funciona

- Leitor em formato de página: A−/A+, leitura escura, salvar, copiar link, anterior/próxima, barra de progresso, Esc e clique fora para fechar, foco devolvido ao botão de origem.
- Matérias: filtro por tema (Trabalho, Sociedade, Economia, Direitos), grupos de 3 com pontos e setas, "Todas as matérias" / "Mostrar destaques".
- Salvos da sessão (contador no cabeçalho), busca por título, tema e texto (sem acento e sem diferenciar maiúsculas), sumário das 18 leituras.
- Gráfico "Um Brasil que envelhece" com barras clicáveis e escala exata 0–40%.
- Glossário em acordeão, menu móvel abaixo de 900 px, indicador da seção ativa na navegação.

## Pendências (dependem do Figma)

A cota de chamadas do Figma MCP (plano Starter) acabou durante a extração. Ficou faltando:

1. **Texto das páginas 12 a 20.** O metadata disponível corta cada texto em 50 caracteres, então essas páginas mostram título, chapéu e um aviso. Para completar, adicione objetos no mesmo formato de `js/articles-a.js` (ids em `js/edition.js`). Nós dos modais: 12 `196:912`, 13 `196:1006`, 14 `196:1098`, 15 `196:1192`, 16 `196:1284`, 17 `196:1369`, 18 `196:1463`, 19 `196:1552`, 20 `196:1643`.
2. **Definições do glossário 02 a 06** (o termo 01 está completo). A página 20 tem as seis definições.
3. **Imagens.** Enquanto um arquivo não existir, o site mostra um bloco neutro com a descrição original da imagem. Exporte do Figma com estes nomes:

| Arquivo | Origem no Figma |
|---|---|
| `assets/img/retrato-danie-franco.jpg` | capa e cards (Danie Franco / Unsplash) |
| `assets/img/retrato-ravi-patel.jpg` | cards (Ravi Patel) |
| `assets/img/profissional-vitaly-gariev.jpg` | cards (Vitaly Gariev) |
| `assets/img/equipe-giovanna.jpg`, `equipe-arthur.jpg`, `equipe-murilo.jpg`, `equipe-kevin.jpg`, `equipe-davi-dias.jpg`, `equipe-davi-alcanfor.jpg` | equipe (nós `194:18469`, `194:18466`, `194:18475`, `194:18460`, `205:19`, `194:18463`) |
| `assets/charts/grafico-1.png` … `grafico-3.png` | gráficos das páginas 05, 07 e 11 (`196:323`, `196:513`, `196:873`) |

   Os gráficos 4, 5 e 6 (páginas 13, 14 e 15) entram junto com o texto dessas páginas.

## Decisões a confirmar

- O editorial aparece como **página 02** (como no sumário do Figma); o modal do editorial no Figma diz "04 / 20".
- O cabeçalho do bloco de matérias e o primeiro filtro dizem os dois "Todas as matérias", como no Figma. Vale diferenciar o rótulo do botão de expandir.
- Sálvia `#7a8565` e terracota `#b95d40` continuam nos detalhes e preenchimentos; em texto pequeno usei `#636d52` e `#a14d32` para atingir contraste AA.
