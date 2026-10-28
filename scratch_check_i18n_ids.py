import re

with open('web/js/mozok-i18n.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all keys in structures: { ... }
m = re.findall(r'(\d+):\s*\{', text)
print("Found structure IDs in original mozok-i18n.js:", m)
