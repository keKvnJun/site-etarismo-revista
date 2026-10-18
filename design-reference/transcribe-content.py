"""Transcreve os textos literais do SVG exportado do Figma, sem reescrevê-los."""
from pathlib import Path
import difflib
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
NS = "{http://www.w3.org/2000/svg}"
SVG = ET.parse(ROOT / "design-reference/revisada-completa.svg").getroot()
GROUPS = {g.get("id"): g for g in SVG.iter(NS + "g")}
SOURCES = [
    ("editorial", "Modal_2", "Modal_38"),
    ("curriculo-elogiado", "Modal", "Modal_37"),
    ("mercado-muda", "Modal_3", "Modal_40"),
    ("experiencia-custo", "Modal_4", "Modal_39"),
    ("trabalhar-vaga", "Modal_5", "Modal_35"),
    ("idade-decide", "Modal_6", "Modal_34"),
    ("curriculo-impressiona", "Modal_7", "Modal_32"),
    ("mesma-idade", "Modal_8", "Modal_29"),
    ("distancia-carreira", "Modal_9", "Modal_31"),
    ("renda-geracoes", "Modal_10", "Modal_28"),
    ("dinheiro-nao-para", "Modal_11", "Modal_26"),
    ("dados-permitem", "Modal_12", "Modal_25"),
    ("aposentadoria", "Modal_13", "Modal_24"),
    ("alternativas-encolhem", "Modal_14", "Modal_30"),
    ("mudanca-contrata", "Modal_15", "Modal_23"),
    ("referencias", "Modal_16", "Modal_36"),
    ("fontes-legislacao", "Modal_17", "Modal_22"),
    ("reflexao-final", "Modal_18", "Modal_21"),
]


def text(node):
    return "".join(node.itertext()).strip()


def paragraph_runs(nodes):
    # Figma exporta links/sublinhados em <text> separado. A posição de cada
    # tspan reconstrói a ordem original da frase, inclusive entre linhas.
    spans = []
    for node in nodes:
        for span in node.findall(NS + "tspan"):
            link = span.find(NS + "a")
            run = {"text": "".join(span.itertext())}
            if node.get("text-decoration") == "underline":
                run["underline"] = True
            if link is not None and link.get("href"):
                run["href"] = link.get("href")
            spans.append((float(span.get("y", "0")), float(span.get("x", "0")), run))
    spans.sort(key=lambda item: (round(item[0]), item[1]))
    runs = []
    for _, _, run in spans:
        style = {k: v for k, v in run.items() if k != "text"}
        previous_style = {k: v for k, v in runs[-1].items() if k != "text"} if runs else None
        if style == previous_style:
            runs[-1]["text"] += run["text"]
        else:
            runs.append(run)
    if runs:
        runs[0]["text"] = runs[0]["text"].lstrip()
        runs[-1]["text"] = runs[-1]["text"].rstrip()
    return runs


def article(article_id, modal_id):
    nodes = list(GROUPS[modal_id].iter(NS + "text"))
    blocks = []
    index = 9  # cabeçalho e ferramentas precedem o corpo em todos os modais
    while index < len(nodes):
        node = nodes[index]
        value = text(node)
        if value.startswith("VOCÊ CHEGOU"):
            break
        if value == "Ampliar gráfico original":
            index += 1
            continue
        if value.startswith("Gráfico "):
            number = value.split()[1]
            blocks.append(["figure", f"assets/charts/grafico-{number}.png", value])
        elif node.get("font-family") == "DM Sans":
            blocks.append(["h", value])
        else:
            fragments = [node]
            while index + 1 < len(nodes) and nodes[index + 1].get("text-decoration") == "underline":
                index += 1
                fragments.append(nodes[index])
            runs = paragraph_runs(fragments)
            block = ["p", "".join(run["text"] for run in runs)]
            if any("underline" in run or "href" in run for run in runs):
                block.append(runs)
            blocks.append(block)
        index += 1
    result = {
        "id": article_id,
        "page": "02" if article_id == "editorial" else text(nodes[2]).split()[1],
        "kicker": text(nodes[3]),
        "title": text(nodes[4]),
        "minutes": int(text(nodes[5]).split()[0]),
        "blocks": blocks,
    }
    if article_id == "editorial":
        result.update(readerPage="04", summaryPage="04")
    return result


def write_json(name, value):
    (ROOT / "design-reference" / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


screen_articles = [article(article_id, screen_id) for article_id, screen_id, _ in SOURCES]
source_articles = [article(article_id, source_id) for article_id, _, source_id in SOURCES]
write_json("articles-transcribed.json", screen_articles)
write_json("articles-content-source.json", source_articles)

cards = {}
expanded = list(GROUPS["Revista interativa moderna (cÃ³pia)_21"].iter(NS + "text"))
for entry in screen_articles:
    for index, node in enumerate(expanded):
        if node.get("font-size") == "41.4" and text(node) == entry["title"]:
            cards[entry["id"]] = {
                "teaser": text(expanded[index + 1]),
                "minutes": int(text(expanded[index - 1]).split()[0]),
            }
write_json("cards-transcribed.json", cards)

diff = list(difflib.unified_diff(
    json.dumps(screen_articles, ensure_ascii=False, indent=2).splitlines(),
    json.dumps(source_articles, ensure_ascii=False, indent=2).splitlines(),
    fromfile="Telas — Section 1", tofile="Conteudo Revista", lineterm="",
))
(ROOT / "design-reference/articles-source-difference.diff").write_text("\n".join(diff) + "\n", encoding="utf-8")

header = """/*
 * Transcrição literal dos 18 modais da versão revisada do Figma, Page 3.
 * Fonte: design-reference/revisada-completa.svg, telas de Section 1.
 * Reprodutor e comparação com 'Conteudo Revista': transcribe-content.py.
 * Blocos: p (texto e runs opcionais), h (intertítulo), figure (imagem/legenda).
 */
window.ARTICLES = """
(ROOT / "js/articles-a.js").write_text(header + json.dumps(screen_articles, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"Transcritos {len(screen_articles)} artigos e {len(cards)} resumos de cards.")
