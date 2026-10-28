import json
import re

with open('web/js/mozok-database.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('const CNS_STRUCTURES_DATABASE = [')
end = text.find('];', start)
arr_text = text[start:end+2]

structures = {}
for i in range(1, 32):
    m = re.search(r'\{\s*id:\s*' + str(i) + r',[\s\S]*?\n\s*\},', arr_text)
    if m:
        block = m.group(0)
        code = re.search(r'code:\s*["\']([^"\']+)["\']', block)
        name = re.search(r'(?:estrutura|name):\s*["\']([^"\']+)["\']', block)
        cat = re.search(r'(?:categoria|category):\s*["\']([^"\']+)["\']', block)
        desc = re.search(r'descricao:\s*["\']([^"\']+)["\']', block)
        audio = re.search(r'audioScript:\s*["\']([^"\']+)["\']', block)
        
        # funcoes array
        fn_match = re.search(r'funcoes:\s*\[([\s\S]*?)\]', block)
        funcoes = []
        if fn_match:
            funcoes = re.findall(r'["\']([^"\']+)["\']', fn_match.group(1))
            
        # doencas array
        dn_match = re.search(r'doencas:\s*\[([\s\S]*?)\]', block)
        doencas = []
        if dn_match:
            doencas = re.findall(r'["\']([^"\']+)["\']', dn_match.group(1))
            
        # neurotransmissores array
        nt_match = re.search(r'neurotransmissores:\s*\[([\s\S]*?)\]', block)
        nt = []
        if nt_match:
            nt = re.findall(r'["\']([^"\']+)["\']', nt_match.group(1))
            
        structures[i] = {
            "id": i,
            "code": code.group(1) if code else "",
            "name": name.group(1) if name else "",
            "cat": cat.group(1) if cat else "",
            "desc": desc.group(1) if desc else "",
            "funcoes": funcoes,
            "doencas": doencas,
            "neuro": nt,
            "audio": audio.group(1) if audio else ""
        }

with open('scratch_db_31.json', 'w', encoding='utf-8') as out:
    json.dump(structures, out, indent=2, ensure_ascii=False)

print(f"Extracted {len(structures)} structures to scratch_db_31.json")
