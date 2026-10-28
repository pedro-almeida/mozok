import json
with open('scratch_db_31.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i in range(1, 32):
    if str(i) not in data:
        print(f"Missing ID: {i}")
