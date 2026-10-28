with open('scratch_prompt.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('5. Arquivo: `web/js/mozok-i18n.js`')
if pos != -1:
    print("Found mozok-i18n.js in prompt! Length remaining:", len(text) - pos)
    # Check which structure IDs were defined in prompt
    import re
    ids = re.findall(r'(\d+):\s*\{', text[pos:])
    print("Structure IDs in prompt for mozok-i18n.js:", ids)
