"""Prepare local, font-correct previews of the exported Figma reference.

These files are comparison artifacts only. The application never loads them.
"""
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
NS = {"s": "http://www.w3.org/2000/svg"}
ET.register_namespace("", NS["s"])

fonts = """
@font-face{font-family:'DM Sans';src:url('../assets/fonts/dm-sans-latin-opsz-normal.woff2');font-weight:100 1000}
@font-face{font-family:'DM Serif Display';src:url('../assets/fonts/dm-serif-display-latin-400-normal.woff2')}
@font-face{font-family:'DM Serif Display';src:url('../assets/fonts/dm-serif-display-latin-400-italic.woff2');font-style:italic}
@font-face{font-family:'Lora';src:url('../assets/fonts/lora-latin-wght-normal.woff2');font-weight:400 700}
@font-face{font-family:'Lora';src:url('../assets/fonts/lora-latin-wght-italic.woff2');font-style:italic;font-weight:400 700}
html,body{margin:0;background:#f7f6f0}svg{display:block}
"""

home = (ROOT / "revisada-home.svg").read_text(encoding="utf-8")
(ROOT / "home-preview.html").write_text(
    f"<!doctype html><meta charset='utf-8'><title>Referência Figma · capa</title><style>{fonts}</style>{home}",
    encoding="utf-8",
)

source = ET.parse(ROOT / "revisada-completa.svg").getroot()
section = source.find("s:g/s:g", NS)
frame = section.find("s:g", NS)
rect = frame.find("s:rect", NS)
origin = rect.attrib["transform"].removeprefix("translate(").removesuffix(")")
x, y = origin.split()
svg = ET.Element(f"{{{NS['s']}}}svg", {
    "width": "1440", "height": "7875", "viewBox": f"{x} {y} 1440 7875"
})
svg.append(frame)
svg.append(source.find("s:defs", NS))
(ROOT / "reader-preview.html").write_text(
    f"<!doctype html><meta charset='utf-8'><title>Referência Figma · leitura</title><style>{fonts}</style>"
    + ET.tostring(svg, encoding="unicode"), encoding="utf-8"
)
print("Prepared home-preview.html and reader-preview.html")
