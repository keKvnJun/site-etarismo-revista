# etarismo. — Revista digital · Edição especial 2026

Site estático em HTML, CSS e JavaScript, sem build ou dependências de execução. A primeira etapa de revisão reproduz os textos e a identidade visual da seção **Revista Etarismo — Versão Revisada**, na Page 3 do Figma.

O comparativo e as decisões desta revisão estão em [ALTERACOES-ETAPA-1.md](ALTERACOES-ETAPA-1.md).

## Abrir

Use o Live Server na pasta do projeto ou sirva `site-etarismo-revista` por HTTP:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. No Live Server já configurado no workspace, o endereço é `http://127.0.0.1:5500/site-etarismo-revista/index.html`.

Links diretos: `#/leitura/mercado-muda` e `#/sumario`.

A home apresenta o Editorial antes de Matérias. No leitor, a sequência é Editorial (02) → Sumário (03) → Matérias (04–17), seguida das fontes e do encerramento (18–20); a capa ocupa a página 01.

## Estrutura

- `index.html`: estrutura e seções da revista.
- `css/styles.css`: estilos da home e adaptação a telas menores.
- `css/reader.css`: leitor e sumário revisados.
- `css/icons.css`: dimensões e exibição dos vetores originais.
- `js/edition.js`: metadados, resumos, fotos, números, glossário e equipe.
- `js/articles-a.js`: 18 leituras transcritas do Figma, com gráficos e referências.
- `js/app.js`: navegação, busca, filtros, leitor, salvos e gráfico interativo.
- `assets/`: fontes locais, fotografias, gráficos e ícones.
- `design-reference/`: exportações e registros de comparação; não são carregados pela aplicação.

Busca, salvos da sessão, filtros, paginação, leitura escura e controles de texto estão preservados. As fontes mantêm suas licenças em `assets/fonts/`.
