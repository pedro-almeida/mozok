import json
import re

with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('const CNS_STRUCTURES_DATABASE = [')
end = text.find('];', start)
arr_text = text[start:end+2]

m = re.search(r'\{\s*id:\s*31,[\s\S]*?\n\s*\}', arr_text)
if m:
    print("Found 31! Length:", len(m.group(0)))
    block = m.group(0)
    code = re.search(r'code:\s*["\']([^"\']+)["\']', block)
    print("Code:", code.group(1) if code else "None")
