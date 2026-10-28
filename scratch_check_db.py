import re

with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'id:\s*(\d+),\s*code:\s*["\']([^"\']+)["\'],\s*estrutura:\s*["\']([^"\']+)["\']'
matches = re.findall(pattern, content)
for m in matches:
    print(f"{m[0]}: {m[1]} -> {m[2]}")
