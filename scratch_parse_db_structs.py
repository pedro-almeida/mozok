with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
# Let's extract each structure block
struct_blocks = re.findall(r'\{\s*id:\s*(\d+),[\s\S]*?\n\s*\},', code)
print(f"Total structure blocks matched: {len(struct_blocks)}")

# Let's parse each structure's id, code, estrutura/name, categoria/category, etc.
# We can use python to evaluate or parse them
import json
# Or regex for fields
for b in struct_blocks:
    sid = re.search(r'id:\s*(\d+)', b)
    code_m = re.search(r'code:\s*["\']([^"\']+)["\']', b)
    name_m = re.search(r'(?:estrutura|name):\s*["\']([^"\']+)["\']', b)
    cat_m = re.search(r'(?:categoria|category):\s*["\']([^"\']+)["\']', b)
    latin_m = re.search(r'latinName:\s*["\']([^"\']+)["\']', b)
    if sid and code_m:
        print(f"ID {sid.group(1)}: {code_m.group(1)} | {name_m.group(1) if name_m else ''} | {cat_m.group(1) if cat_m else ''} | {latin_m.group(1) if latin_m else ''}")
