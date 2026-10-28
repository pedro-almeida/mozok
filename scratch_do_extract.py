with open('scratch_prompt.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def extract_file(start_header, end_header, out_path):
    # Find start_header
    start_idx = None
    for i, l in enumerate(lines):
        if start_header in l:
            start_idx = i
            break
    if start_idx is None:
        raise ValueError(f"Could not find start header: {start_header}")
    
    # Find ``` after start_idx
    code_start = None
    for i in range(start_idx, len(lines)):
        if lines[i].strip().startswith('```'):
            code_start = i + 1
            break
            
    # Find matching closing ``` before end_header
    end_idx = None
    if end_header:
        for i in range(code_start, len(lines)):
            if end_header in lines[i]:
                end_idx = i
                break
    else:
        end_idx = len(lines)
        
    code_end = None
    for i in range(end_idx - 1, code_start - 1, -1):
        if lines[i].strip() == '```':
            code_end = i
            break
            
    if code_start is None or code_end is None:
        raise ValueError(f"Could not find code boundaries for {out_path}")
        
    content = "".join(lines[code_start:code_end])
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write(content)
    print(f"Extracted {out_path} ({len(content)} bytes)")

extract_file("1. Arquivo: `rust/mozok-native/src/main.rs`", "2. Arquivo:", "rust/mozok-native/src/main.rs")
extract_file("2. Arquivo: `rust/mozok-atlas/src/ontology.rs`", "3. Arquivo:", "rust/mozok-atlas/src/ontology.rs")
extract_file("3. Arquivo: `web/js/cns-anatomy-3d.js`", "4. Arquivo:", "web/js/cns-anatomy-3d.js")
extract_file("4. Arquivo: `web/js/pathology-engine.js`", "5. Arquivo:", "web/js/pathology-engine.js")
