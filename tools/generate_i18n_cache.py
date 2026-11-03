import json
import urllib.request
import urllib.parse
import os
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

cred = json.load(open('c:/mriya/mriya/credentials.json', 'r', encoding='utf-8'))
deepl_key = cred.get('deepl', {}).get('api_key')
print(f"DeepL Key present: {bool(deepl_key)}")

# Extract the MOZOK_ONTOLOGY JS definition by running node
js_extract = """
const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');
const start = html.indexOf('const MOZOK_ONTOLOGY = [');
const end = html.indexOf('];', start) + 2;
const code = html.substring(start, end) + '; console.log(JSON.stringify(MOZOK_ONTOLOGY));';
eval(code);
"""
with open('tools/_extract_onto.js', 'w', encoding='utf-8') as f:
    f.write(js_extract)

res = subprocess.check_output(['node', 'tools/_extract_onto.js'], encoding='utf-8')
if os.path.exists('tools/_extract_onto.js'):
    os.remove('tools/_extract_onto.js')

ontology = json.loads(res)
print(f"Loaded {len(ontology)} structures from MOZOK_ONTOLOGY.")

# DeepL target languages: EN-GB, ES, IT, UK
deepl_lang_map = {
    'en-GB': 'EN-GB',
    'es-ES': 'ES',
    'it-IT': 'IT',
    'uk-UA': 'UK'
}

def translate_batch_deepl(texts, target_lang):
    if not texts:
        return []
    url = 'https://api-free.deepl.com/v2/translate' if deepl_key.endswith(':fx') else 'https://api.deepl.com/v2/translate'
    
    results = []
    chunk_size = 40
    for i in range(0, len(texts), chunk_size):
        chunk = texts[i:i+chunk_size]
        params = [('text', t) for t in chunk]
        params.append(('target_lang', target_lang))
        params.append(('source_lang', 'PT'))
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={
            'Authorization': f'DeepL-Auth-Key {deepl_key}',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                res = json.loads(r.read().decode('utf-8'))
                for item in res.get('translations', []):
                    results.append(item['text'])
        except Exception as e:
            print(f"DeepL batch error for {target_lang}: {e}")
            for t in chunk:
                results.append(t)
    return results

# Build translation dictionary: i18n_cache[lang][structure_id] = { name, badge, summary, clinical, functions }
i18n_cache = {
    'en-GB': {},
    'es-ES': {},
    'it-IT': {},
    'uk-UA': {}
}

for lang_code, deepl_lang in deepl_lang_map.items():
    print(f"Translating {len(ontology)} structures to {lang_code} ({deepl_lang})...")
    
    names = [s['name'] for s in ontology]
    badges = [s['badge'] for s in ontology]
    summaries = [s['summary'] for s in ontology]
    clinicals = [s['clinical'] for s in ontology]
    
    tr_names = translate_batch_deepl(names, deepl_lang)
    tr_badges = translate_batch_deepl(badges, deepl_lang)
    tr_summaries = translate_batch_deepl(summaries, deepl_lang)
    tr_clinicals = translate_batch_deepl(clinicals, deepl_lang)
    
    # Also functions
    all_funcs = []
    func_counts = []
    for s in ontology:
        fn = s.get('functions', [])
        func_counts.append(len(fn))
        all_funcs.extend(fn)
    
    tr_all_funcs = translate_batch_deepl(all_funcs, deepl_lang)
    
    # Reassemble
    func_ptr = 0
    for idx, s in enumerate(ontology):
        s_id = s['id']
        n_funcs = func_counts[idx]
        s_tr_funcs = tr_all_funcs[func_ptr:func_ptr+n_funcs]
        func_ptr += n_funcs
        
        i18n_cache[lang_code][s_id] = {
            "name": tr_names[idx] if idx < len(tr_names) else s['name'],
            "badge": tr_badges[idx] if idx < len(tr_badges) else s['badge'],
            "summary": tr_summaries[idx] if idx < len(tr_summaries) else s['summary'],
            "clinical": tr_clinicals[idx] if idx < len(tr_clinicals) else s['clinical'],
            "functions": s_tr_funcs
        }
    print(f"Completed {lang_code}: {len(i18n_cache[lang_code])} entries.")

# 9 neuron parts
neuron_parts = [
    {
        "id": "NEURON_SOMA",
        "name": "Corpo Celular (Soma / Pericário)",
        "badge": "Centro Metabólico e Integração Sináptica",
        "summary": "Centro trófico e genômico do neurônio piramidal da Camada V neocortical. Contém o núcleo eucromático esférico, corpúsculos de Nissl densos (retículo endoplasmático rugoso hiperativo) e complexo de Golgi de alta demanda.",
        "clinical": "Degeneração do soma com cromatólise central é o marcador clássico de axotomia retrógrada e apoptose em esclerose lateral amiotrófica (ELA) e isquemia cerebral aguda."
    },
    {
        "id": "NEURON_NUCLEUS",
        "name": "Núcleo Eucromático & Nucléolo",
        "badge": "Transcrição e Síntese Proteica",
        "summary": "Núcleo vesicular com predomínio de eucromatina descondensada, refletindo taxa contínua de transcrição de canais iônicos, receptores pós-sinápticos e tubulinas para manutenção axônica.",
        "clinical": "Inclusões intranucleares anormais (TDP-43 em ELA/Demência Frontotemporal, cauda poliQ na Doença de Huntington) sequestram maquinário de splicing e levam à falência transcricional neuronal."
    },
    {
        "id": "NEURON_DENDRITES",
        "name": "Árvore Dendrítica & Espinhos",
        "badge": "Recepção Pós-Sináptica e Plasticidade LTP",
        "summary": "Árvore ramificada com dendrito apical longo ascendente e dendritos basais. Recoberta por milhares de espinhos dendríticos ricamente dotados de receptores glutamatérgicos AMPA e NMDA.",
        "clinical": "Perda precoce de espinhos dendríticos induzida por oligômeros solúveis de β-amiloide (Aβ42) na Doença de Alzheimer; base do déficit de plasticidade sináptica e falha da potenciação de longa duração (LTP)."
    },
    {
        "id": "NEURON_AXON_HILLOCK",
        "name": "Cone de Implantação & Zona de Gatilho (AIS)",
        "badge": "Geração do Potencial de Ação",
        "summary": "Segmento inicial do axônio (AIS - Axon Initial Segment). Possui a densidade mais alta de canais de sódio voltagem-dependentes (NaV1.6), funcionando como o somador digital e disparador elétrico do potencial de ação.",
        "clinical": "Canalopatias com mutações nos canais NaV (gene SCN1A na Síndrome de Dravet) desestabilizam o limiar de disparo, gerando hiperexcitabilidade e crises epilépticas farmacorresistentes."
    },
    {
        "id": "NEURON_MYELIN",
        "name": "Bainha de Mielina (Oligodendrócitos)",
        "badge": "Isolamento Lipídico e Condução Saltatória",
        "summary": "Múltiplas camadas concêntricas de membrana plasmática rica em esfingomielina e cerebrosídeos, formadas por oligodendrócitos no SNC. Reduz a capacitância da membrana e eleva a resistência transmembrana.",
        "clinical": "Ataque autoimune mediado por linfócitos T contra proteína básica da mielina (MBP) e MOG na Esclerose Múltipla; causa bloqueio de condução saltatória, lentificação axonal e déficits neurológicos multifocais."
    },
    {
        "id": "NEURON_SCHWANN",
        "name": "Célula de Schwann (Mielinização SNP)",
        "badge": "Suporte e Regeneração no SNP",
        "summary": "Célula glial periférica responsável pela formação de mielina em axônios do SNP (um único entrenó por célula) e secreção de neurotrofinas (NGF, BDNF) durante o processo regenerativo.",
        "clinical": "Polirradiculoneuropatia inflamatória desmielinizante (Síndrome de Guillain-Barré) ataca a mielina periférica e células de Schwann após infecções, desencadeando tetraparesia flácida arreflexa ascendente."
    },
    {
        "id": "NEURON_NODE_RANVIER",
        "name": "Nódulos de Ranvier",
        "badge": "Propagação Saltatória e Canais NaV1.6",
        "summary": "Descontinuidades periódicas (1–2 µm) entre entrenós mielinizados. Concentram altíssima densidade de canais NaV1.6 ancorados por anquirina-G, permitindo a regeneração do potencial de ação a até 120 m/s.",
        "clinical": "Anticorpos anti-neurofascina 155/186 ou anti-contactina atacam a junção paranodal em neuropatias nodopáticas autoimunes, rompendo o isolamento nodal e causando bloqueio agudo de condução motora."
    },
    {
        "id": "NEURON_TERMINAL",
        "name": "Botão Terminal & Terminação Axônica",
        "badge": "Canais CaV2.1 e Exocitose de Vesículas",
        "summary": "Dilatação terminal do axônio contendo mitocôndrias abundantes, complexos SNARE (sinaptobrevina, sintaxina, SNAP-25) e canais de cálcio dependentes de voltagem P/Q (CaV2.1).",
        "clinical": "Toxinas bacterianas (Toxina Botulínica, Tétano) clivam irreversivelmente as proteínas SNARE, bloqueando a exocitose de acetilcolina ou GABA e provocando paralisia flácida ou espástica fulminante."
    },
    {
        "id": "NEURON_SYNAPSE",
        "name": "Fenda Sináptica & Densidade Pós-Sináptica",
        "badge": "Transmissão Neuroquímica e Receptores",
        "summary": "Espaço extracelular de 20 nm entre a membrana pré e pós-sináptica. O influxo de cálcio dispara a liberação de glutamato na fenda, ligando-se a receptores AMPA, NMDA e mGluR na densidade pós-sináptica (PSD-95).",
        "clinical": "A superexposição ao glutamato na isquemia aguda provoca influxo maciço descontrolado de cálcio por receptores NMDA hiperativados, gerando excitotoxicidade, disfunção mitocondrial e apoptose em cascata."
    }
]

for lang_code, deepl_lang in deepl_lang_map.items():
    p_names = [p['name'] for p in neuron_parts]
    p_badges = [p['badge'] for p in neuron_parts]
    p_summaries = [p['summary'] for p in neuron_parts]
    p_clinicals = [p['clinical'] for p in neuron_parts]
    
    tr_pn = translate_batch_deepl(p_names, deepl_lang)
    tr_pb = translate_batch_deepl(p_badges, deepl_lang)
    tr_ps = translate_batch_deepl(p_summaries, deepl_lang)
    tr_pc = translate_batch_deepl(p_clinicals, deepl_lang)
    
    for idx, p in enumerate(neuron_parts):
        i18n_cache[lang_code][p['id']] = {
            "name": tr_pn[idx] if idx < len(tr_pn) else p['name'],
            "badge": tr_pb[idx] if idx < len(tr_pb) else p['badge'],
            "summary": tr_ps[idx] if idx < len(tr_ps) else p['summary'],
            "clinical": tr_pc[idx] if idx < len(tr_pc) else p['clinical'],
            "functions": []
        }

# Save i18n_cache to web/assets/i18n_cache.json
os.makedirs('web/assets', exist_ok=True)
with open('web/assets/i18n_cache.json', 'w', encoding='utf-8') as f:
    json.dump(i18n_cache, f, ensure_ascii=False, indent=2)

print(f"Generated web/assets/i18n_cache.json successfully! File size: {os.path.getsize('web/assets/i18n_cache.json')} bytes.")
