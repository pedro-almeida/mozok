with open('scratch_prompt.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

file_indices = []
for i, l in enumerate(lines):
    if l.strip().startswith(('1. Arquivo:', '2. Arquivo:', '3. Arquivo:', '4. Arquivo:', '5. Arquivo:', '6. Arquivo:')):
        file_indices.append((i, l.strip()))

print('Found file headers:')
for idx, name in file_indices:
    print(idx, name)
