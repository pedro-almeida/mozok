with open('web/index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if 'category-filter' in line or 'btn-fullscreen' in line or 'lod-status-badge' in line:
            print(f"{idx+1}: {line.strip()[:100]}")
