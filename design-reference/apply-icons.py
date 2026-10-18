"""Use the complete, exported Figma icon assets in the implementation."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
icons = json.loads((ROOT / "design-reference/icon-assets.json").read_text(encoding="utf-8"))
css = ["/* Vetores originais exportados do Figma. Dimensões nativas preservadas. */",
       ".design-icon{display:inline-block;vertical-align:middle;flex:0 0 auto;background-color:currentColor;mask-image:var(--icon-src);mask-position:center;mask-size:contain;mask-repeat:no-repeat}"]
for item in icons:
    width, height = item["viewBox"][2:]
    css.append(f".icon--{item['name']}{{--icon-src:url('../{item['src']}');width:{width:g}px;height:{height:g}px}}")
css.extend([
    ".btn .design-icon,.link-arrow .design-icon,.card__title .design-icon{transition:transform .3s var(--ease-out)}",
    ".btn:hover .design-icon{transform:translateX(3px)}",
    ".card__save[aria-pressed=true] .design-icon,.reader__tools [aria-pressed=true] .design-icon{background-color:var(--clay)}",
    ".btn--underline:hover .design-icon,.site-footer__nav a:hover .design-icon,.site-footer__nav button:hover .design-icon{transform:translate(2px,-2px)}",
])
(ROOT / "css/icons.css").write_text("\n".join(css) + "\n", encoding="utf-8")

# Names follow the visible callsites, in document order. The mobile menu and
# search-only magnifier retain the existing code icon because they are extras.
names = ["search", "bookmark", None, "arrow-up-right-white", "arrow-right",
         "arrow-right-small", "cover-open", "arrow-up-right", "arrow-left",
         "arrow-next", "arrow-up-right", "arrow-up-right", "book",
         "arrow-up-right", "arrow-up-right-small", "arrow-up-right-small",
         "arrow-up-right-small", "arrow-up-right-small", "arrow-up",
         "reader-back", "close", "toc-close", "close", None, "close"]
html_path = ROOT / "index.html"
html = html_path.read_text(encoding="utf-8")
matches = list(re.finditer(r"<svg\b[^>]*>.*?</svg>", html, re.S))
if len(matches) != len(names):
    raise RuntimeError(f"Expected {len(names)} callsites, found {len(matches)}")
for match, name in reversed(list(zip(matches, names))):
    if name:
        html = html[:match.start()] + f'<span class="design-icon icon--{name}" aria-hidden="true"></span>' + html[match.end():]
html = html.replace('<link rel="stylesheet" href="css/reader.css">', '<link rel="stylesheet" href="css/reader.css">\n  <link rel="stylesheet" href="css/icons.css">')
html_path.write_text(html, encoding="utf-8")
print("Applied original icons to static callsites.")
