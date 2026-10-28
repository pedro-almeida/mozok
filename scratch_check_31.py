import re

with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find array CNS_STRUCTURES_DATABASE = [ ... ];
start = text.find('const CNS_STRUCTURES_DATABASE = [')
end = text.find('];', start)
arr_text = text[start:end+2]

for i in range(1, 32):
    # find id: i,
    m = re.search(r'\{\s*id:\s*' + str(i) + r',[\s\S]*?\n\s*\},', arr_text)
    if m:
        block = m.group(0)
        code = re.search(r'code:\s*["\']([^"\']+)["\']', block)
        name = re.search(r'(?:estrutura|name):\s*["\']([^"\']+)["\']', block)
        cat = re.search(r'(?:categoria|category):\s*["\']([^"\']+)["\']', block)
        print(f"ID {i}: {code.group(1) if code else '??'} | {name.group(1) if name else '??'} | {cat.group(1) if cat else '??'}")
    else:
        print(f"ID {i}: NOT FOUND")
