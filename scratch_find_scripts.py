with open('web/index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if '<script' in line:
            print(f"Script tag at line {idx+1}: {line.strip()[:80]}")
