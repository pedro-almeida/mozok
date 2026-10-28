import re

with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('const CNS_STRUCTURES_DATABASE = [')
end = text.find('];', start)
arr_text = text[start:end+2]

for i in [14, 15, 18, 19, 23]:
    m = re.search(r'\{\s*id:\s*' + str(i) + r',[\s\S]*?\n\s*\},', arr_text)
    if m:
        print(f"=== Structure {i} ===")
        safe = m.group(0).encode('ascii', 'backslashreplace').decode('ascii')
        print(safe[:600])
