with open('scratch_prompt.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for l in lines[-15:]:
    safe_l = l.encode('ascii', 'backslashreplace').decode('ascii')
    print(safe_l, end='')
