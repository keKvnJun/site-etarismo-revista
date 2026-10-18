# Etapa 1 — fidelidade à versão revisada

Referência: seção **Revista Etarismo — Versão Revisada**, Page 3 do arquivo Figma `BG6N6B0h2YBUO4tD1i6lih` (seção `234:2`; home `234:13827`, 1440 × 7875). O site anterior se baseava no frame antigo `194:3869`.

As exportações oficiais da home e da seção completa estão em `design-reference/`. Foram obtidas pelo próprio Figma após a integração informar que a cota Starter estava esgotada. Os SVGs servem apenas para comparação e extração de recursos; a aplicação continua construída em HTML, CSS e JavaScript.

## Diferenças corrigidas

| Área | Antes | Implementado nesta etapa |
| --- | --- | --- |
| Conteúdo | Nove leituras disponíveis; páginas 12–20 provisórias | 18 leituras integrais, transcritas literalmente das telas revisadas |
| Cartões | Fotografias repetidas/ausentes, resumos incompletos e tempo fixo | 14 fotografias vinculadas aos cartões corretos, resumos completos e tempos da referência |
| Glossário | Cinco definições ausentes | Seis definições da referência |
| Imagens | Blocos de substituição e iniciais da equipe | Fotos originais, seis gráficos e vetores exportados do Figma |
| Capa | Proporções, recortes, posição do destaque e medidas diferentes | Título de 108 px, foto de 810 px e destaque sobreposto no desktop, com medidas da referência |
| Navegação e botões | Setas genéricas, botões arredondados e filtros em chips | Vetores originais, formatos de botão e filtros com sublinhado conforme o Figma |
| Tipografia | Tamanhos, fontes e itálicos divergentes | DM Serif Display, DM Sans e Lora nos respectivos lugares; itálicos e pesos conferidos |
| Seções | Larguras, intervalos e alinhamentos diferentes | Indicadores, matérias, editorial, dados, glossário, equipe e rodapé recompostos |
| Leitor e sumário | Dimensões e hierarquia tipográfica menores | Folhas, títulos, texto, cores, metadados e introdução do sumário aproximados às medidas exportadas |

## Decisões de conteúdo

- Foram usados os **textos das telas do site revisado**, conforme a escolha do usuário, e não as versões alternativas dos quadros “Conteudo Revista”. Só um parágrafo diferia entre essas fontes; o registro está em `design-reference/articles-source-difference.diff`.
- Na etapa inicial, a numeração do Figma foi preservada. Por solicitação posterior, a home passou a mostrar Editorial `01` antes de Matérias `02`; no leitor, a ordem é Editorial `02` → Sumário `03` → primeira matéria `04`, sem a duplicação do número do editorial.
- A home básica não contém as três frases extras de capa presentes em algumas cópias de estado; essas frases não foram acrescentadas à home.
- Fotografias e gráficos foram copiados sem redesenhar ou substituir seu conteúdo. Os recortes dos cartões seguem os retângulos da referência.

## Funções preservadas e verificações

Busca em título e conteúdo, filtros, paginação, expansão dos cartões, salvos da sessão, links diretos, tamanho do texto, leitura escura, sumário e menu móvel foram preservados. A ampliação de gráficos já existia no código: o carregamento das imagens permite que o botão existente seja habilitado; nenhuma nova experiência de ampliação foi criada nesta etapa.

Verificações no navegador: pesquisa retornando as leituras correspondentes, filtro Economia com quatro cartões, expansão com 14 fotografias carregadas, sumário com 18 entradas, leitura de matéria antes ausente, gráfico carregado, salvar, A+/A− e leitura escura. Layout verificado em desktop e em 390 px, sem rolagem horizontal da página ou do leitor. Sintaxe JavaScript, caminhos dos recursos e integridade das transcrições também conferidos.

O Figma contém um desktop estático; a rolagem dos diálogos e a adaptação ao celular continuam necessárias no site. Há pequenas diferenças de quebra de linha decorrentes da largura da barra de rolagem do navegador. O gráfico interativo mantém uma escala matemática comum entre eixo e barras.

## Próximas etapas

A etapa 2 fica para as funcionalidades adicionais que o usuário definir, incluindo a revisão da experiência de ampliação dos gráficos. Uma eventual etapa 3 pode concentrar os refinamentos apontados após a revisão desta versão.

Cópias dos SVGs originais e das fotografias também foram salvas na pasta autorizada: `C:\Users\murilofonseca-ieg\OneDrive\Materias Basicas\Revista_etarismo\originais-figma`.
