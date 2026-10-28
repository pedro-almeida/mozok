with open('scratch_prompt.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def inspect_section(start, end, label):
    print(f"=== {label} (lines {start} to {end}) ===")
    print("Start lines:", [l.strip() for l in lines[start:start+4]])
    print("End lines:", [l.strip() for l in lines[end-4:end]])

inspect_section(36, 411, "File 1: main.rs")
inspect_section(411, 723, "File 2: ontology.rs")
inspect_section(723, 2557, "File 3: cns-anatomy-3d.js")
inspect_section(2557, 2856, "File 4: pathology-engine.js")
