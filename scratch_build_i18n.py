import json
import re

# Read original mozok-i18n.js to preserve UI and existing translations
with open('web/js/mozok-i18n.js', 'r', encoding='utf-8') as f:
    orig_text = f.read()

# Let's extract UI block
ui_start = orig_text.find('ui: {')
# find matching closing bracket for ui
# we know structures start with 'structures: {'
struct_start = orig_text.find('structures: {')
ui_block = orig_text[ui_start:struct_start].strip()
if ui_block.endswith(','):
    ui_block = ui_block[:-1].strip()

# Update structureCount in ui_block
ui_block = ui_block.replace("structureCount: '22 Estruturas'", "structureCount: '31 Estruturas'")
ui_block = ui_block.replace("structureCount: '22 Structures'", "structureCount: '31 Structures'")
ui_block = ui_block.replace("structureCount: '22 Strutture'", "structureCount: '31 Strutture'")
ui_block = ui_block.replace("structureCount: '22 структури'", "structureCount: '31 структура'")
ui_block = ui_block.replace("structureCount: '22 Estructuras'", "structureCount: '31 Estructuras'")

# Let's extract existing structure blocks from orig_text
def extract_struct_block(text, sid):
    # Find sid: {
    pattern = r'(?m)^\s*' + str(sid) + r':\s*\{'
    m = re.search(pattern, text)
    if not m:
        return None
    start = m.start()
    # Find matching closing } for this structure
    # Count braces
    brace_count = 0
    in_str = False
    quote_char = ''
    end = start
    for idx in range(start, len(text)):
        ch = text[idx]
        if ch in ('"', "'", '`') and (idx == 0 or text[idx-1] != '\\'):
            if not in_str:
                in_str = True
                quote_char = ch
            elif quote_char == ch:
                in_str = False
        elif not in_str:
            if ch == '{':
                brace_count += 1
            elif ch == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = idx + 1
                    break
    return text[start:end]

orig_structs = {}
for i in range(1, 23):
    sb = extract_struct_block(orig_text, i)
    if sb:
        orig_structs[i] = sb

print(f"Extracted {len(orig_structs)} original structure blocks.")

# Extract pathologies block
path_start = orig_text.find('pathologies: {')
func_t_start = orig_text.find('// Obtém texto localizado', path_start)
if func_t_start == -1:
    func_t_start = orig_text.find('t(key)', path_start)
# find closing of pathologies
pathologies_block = orig_text[path_start:func_t_start].strip()
if pathologies_block.endswith(','):
    pathologies_block = pathologies_block[:-1].strip()

print("Extracted pathologies block, length:", len(pathologies_block))
