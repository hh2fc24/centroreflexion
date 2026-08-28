"""Restore the published article from its original PDF, without summarizing it.

Usage: python scripts/restore-desproteccion-article.py /path/to/original.pdf
Requires pdfplumber. Page coordinates and font sizes belong to this specific paper.
"""

import json
import re
import shutil
import sys
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
ARTICLE_ID = "desproteccion-institucionalizacion-y-gobierno-infancia"
NOTE_ANCHORS = {"2": "Santiago2", "3": "aquí3", "4": "Popular”4", "5": "huachos5", "6": "leche.6", "7": "privada.7", "8": "13).8"}


def join_lines(lines):
    text = "\n".join(lines)
    # Join publisher line-break hyphenation, retaining numeric ranges and URLs.
    text = re.sub(r"(?<=[^\W\d_])-\n(?=[^\W\d_])", "", text)
    text = re.sub(r"(https?://\S*)\n", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def main(source):
    body = []
    notes = []
    paragraph = []
    paragraph_quote = False
    in_references = False
    included_lines = []

    def flush():
        nonlocal paragraph, paragraph_quote
        if paragraph:
            body.append(("> " if paragraph_quote else "") + join_lines(paragraph))
        paragraph = []
        paragraph_quote = False

    with pdfplumber.open(source) as pdf:
        assert len(pdf.pages) == 12, "Unexpected source document"
        front = pdf.pages[0].extract_text_lines()

        def front_text(start, end):
            return join_lines([line["text"] for line in front if start <= line["top"] < end])

        title = front_text(200, 235)
        assert title.endswith("Michel Foucault")
        abstract = front_text(296, 373).removeprefix("Resumen. ")
        content = [
            "Resumen", abstract,
            front_text(373, 390).replace("Palabras clave:", "PALABRAS CLAVE:").rstrip("."),
            "## Resumo (português)",
            front_text(405, 435).removeprefix("[pt] "),
            front_text(444, 521).removeprefix("Resumo. "),
            front_text(521, 540),
            "## Abstract (English)",
            front_text(550, 585).removeprefix("[en] "),
            front_text(592, 658).removeprefix("Abstract. "),
            front_text(658, 675),
            "## Introducción",
        ]

        for page_index, page in enumerate(pdf.pages):
            lines = page.extract_text_lines()
            previous = None
            for index, line in enumerate(lines):
                size = max(round(char["size"], 1) for char in line["chars"])
                if size == 8.0 and line["top"] > 700:
                    match = re.match(r"^(\d+)\s+(.*)", line["text"])
                    if match and line["x0"] < 80:
                        notes.append({"id": int(match[1]), "lines": [match[2]]})
                    else:
                        assert notes, "Orphaned footnote"
                        notes[-1]["lines"].append(line["text"])
                    continue
                if page_index == 0 or line["top"] < 65 or size < 9:
                    continue
                if page_index == 1 and line["top"] < 120:
                    continue  # Citation is retained in publication metadata.

                chars = sorted(line["chars"], key=lambda char: char["x0"])
                text = line["text"]
                for char in chars:
                    if 5.8 < char["size"] < 6.3 and char["text"].isdigit():
                        anchor = NOTE_ANCHORS[char["text"]]
                        assert anchor in text, "Source note anchor changed"
                        text = text.replace(anchor, anchor[:-1] + "[" + char["text"] + "]", 1)
                included_lines.append(text)
                heading = bool(re.match(r"^\d+(?:\.\d+)*\.\s+", text)) and sum(
                    "Bold" in char["fontname"] for char in chars
                ) > len(chars) / 2

                if heading:
                    flush()
                    body.append(text)
                    if text.startswith("3. Referencias"):
                        in_references = True
                elif in_references:
                    if line["x0"] < 80:
                        flush()
                    paragraph.append(text)
                else:
                    indented = line["x0"] > 90
                    next_indented = index + 1 < len(lines) and lines[index + 1]["x0"] > 90
                    gap = line["top"] - previous["top"] if previous else 0
                    if indented and (not paragraph_quote or gap > 16):
                        flush()
                        paragraph_quote = next_indented
                    elif paragraph_quote and not indented:
                        flush()
                    paragraph.append(text)
                previous = line
        flush()

    # Every body line must survive extraction exactly once and in order.
    normalize = lambda text: re.sub(r"[\s>\-]", "", text)
    assert normalize("".join(included_lines)) == normalize("".join(body))
    footnotes = [{"id": note["id"], "text": join_lines(note["lines"])} for note in notes]
    assert [note["id"] for note in footnotes] == list(range(1, 9))
    headings = [line for line in body if re.match(r"^\d+(?:\.\d+)*\.\s+", line)]
    assert len(headings) == 16, headings
    refs = body[body.index("3. Referencias bibliográficas") + 1:]
    assert len(refs) == 40, len(refs)

    path = ROOT / "lib/articles.json"
    data = json.loads(path.read_text())
    article = next(item for item in data["academic"] if item["id"] == ARTICLE_ID)
    article.update({
        "title": title,
        "date": "2020",
        "image": "/images/desproteccion-institucionalizacion-editorial.png",
        "imageAlt": "Una silla escolar vacía ante la arquitectura institucional: infancia, cuidado y poder.",
        "imageCaption": "Ilustración editorial generada con IA para el Centro de Reflexiones Críticas. No representa una institución real.",
        "content": content + body,
        "footnotes": footnotes,
        "publication": {
            "journal": "Sociedad e Infancias",
            "volume": "4",
            "pages": "135–146",
            "year": "2020",
            "doi": "10.5209/soci.68287",
            "received": "9 de marzo de 2020",
            "accepted": "19 de junio de 2020",
            "pdf": f"/articles/{ARTICLE_ID}.pdf",
        },
    })
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    pdf_target = ROOT / "public/articles" / f"{ARTICLE_ID}.pdf"
    pdf_target.parent.mkdir(parents=True, exist_ok=True)
    if Path(source).resolve() != pdf_target.resolve():
        shutil.copyfile(source, pdf_target)
    print(json.dumps({"blocks": len(article["content"]), "headings": len(headings), "references": len(refs), "notes": len(footnotes), "words": len(" ".join(article["content"]).split())}))


if __name__ == "__main__":
    main(sys.argv[1])
