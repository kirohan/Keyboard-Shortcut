from pathlib import Path

root = Path(__file__).parent
src = root / "source"
html = (src / "index.html").read_text(encoding="utf-8")
css = (src / "styles.css").read_text(encoding="utf-8")
data = (src / "data.js").read_text(encoding="utf-8")
app = (src / "app.js").read_text(encoding="utf-8")

compat = """html,body{min-height:100%}
img{max-width:100%}
[hidden]{display:none!important}
@supports not (background: color-mix(in srgb, #000 50%, #fff)){.search-box{background:var(--panel)}}"""

html = html.replace('<link rel="stylesheet" href="styles.css" />', f'<style>\n{compat}\n{css}\n</style>')
html = html.replace('<script src="data.js"></script><script src="app.js"></script>',
                    f'<script>\n{data}\n</script>\n<script>\n{app}\n</script>')
html = html.replace("</head>", '  <link rel="icon" href="favicon.svg" type="image/svg+xml" />\n</head>')
(root / "index.html").write_text(html, encoding="utf-8")
print("Built deployment-safe index.html")
