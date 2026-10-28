with open('web/index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if 'setupEventListeners' in line or 'mozokAdaptiveLOD' in line or 'btn-fullscreen' in line:
            safe = line.strip()[:100].encode('ascii', 'backslashreplace').decode('ascii')
            print(f"{idx+1}: {safe}")
