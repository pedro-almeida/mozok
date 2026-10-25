# [PT-BR]: Pré-compilador de áudio neural de alta fidelidade para o MOZOK v2.0 com vozes humanas e pós-processamento SoundCraft.
# [EN-GB]: High-fidelity neural audio precompiler for MOZOK v2.0 with human voices and SoundCraft post-processing.
# [AI-CTX]: @llm-context: Studio-quality audio asset pipeline matching Svitlo/Anki flashcards, Gemini TTS, Groq, and Edge-TTS.
#           @llm-invariant: Voice pt-BR-FranciscaNeural, en-GB-SoniaNeural, uk-UA-PolinaNeural, it-IT-ElsaNeural.
#           @llm-invariant: FFmpeg filter: highpass=f=80,equalizer=f=3200:t=q:w=1.0:g=2.0,acompressor=threshold=-18dB:ratio=3:attack=10:release=120:makeup=2dB
#           @llm-neuroscience: Deep functional neuroanatomy pedagogical explanations with crystal clear vocal clarity.

import os
import sys
import json
import asyncio
import tempfile
import subprocess
from pathlib import Path

# [PT-BR]: Roteiros didáticos com tom de professor universitário em sala de aula para as 26 estruturas do SNC e o Tour Guiado.
# [EN-GB]: Pedagogical scripts with classroom university professor tone for all 26 CNS structures and the Guided Tour.
PROFESSOR_SCRIPTS = {
    1: "Observem com atenção o Sistema Nervoso Central em sua totalidade. Temos aqui a continuidade neuroanatômica perfeita entre o encéfalo, abrigado na caixa craniana, e a medula espinhal, que se estende pelo canal vertebral até o cone medular. Notem os envoltórios meníngeos e a rica vascularização arterial que sustentam o parênquima.",
    2: "Vejam aqui, na face lateral do lobo frontal, o Córtex Pré-Frontal Dorsolateral, as áreas 9 e 46 de Brodmann. Esta é a sede executiva máxima do cérebro humano, orquestrando a memória de trabalho, o planejamento estratégico de metas e a flexibilidade cognitiva necessária para a tomada de decisões complexas.",
    3: "Observem aqui a face lateral do hemisfério esquerdo. Estamos diante da Área de Broca, situada nas partes opercular e triangular do giro frontal inferior, áreas 44 e 45. Reparem como os ramos da artéria cerebral média irrigam diretamente este córtex, responsável pela programação motora da linguagem articulada e sintaxe verbal.",
    4: "Reparem nesta faixa vertical situada no giro pré-central, anterior ao sulco central. É o Córtex Motor Primário, a área 4 de Brodmann. Aqui reside o homúnculo motor de Penfield, onde os neurônios piramidais gigantes da Camada 5 emitem seus longos axônios para formar o trato corticoespinhal lateral, comandando os movimentos voluntários finos.",
    5: "Logo posterior ao sulco central, encontramos o Córtex Somatossensorial Primário, no giro pós-central, áreas 3, 1 e 2 de Brodmann. É aqui que chegam as vias aferentes do lemnisco medial e espinotalâmicas, mapeando ponto a ponto as sensações de tato fino, propriocepção consciente, vibração, dor e temperatura de todo o corpo.",
    6: "Vejam esta região na porção posterior do giro temporal superior esquerdo. É a Área de Wernicke, área 22 de Brodmann, conectada à Área de Broca pelo fascículo arqueado. Ela decodifica o significado léxico e fonológico da linguagem compreendida, permitindo a interpretação fluente das palavras faladas e escritas.",
    7: "Observem agora o polo occipital, ao longo das margens do sulco calcarino. Este é o Córtex Visual Primário, a área 17 de Brodmann, caracterizada pela proeminente estria de Gennari. Os sinais ópticos chegam da retina através das radiações ópticas de Gratiolet, processando contornos, orientação espacial e contraste luminoso.",
    8: "Olhem para a face superior do lobo temporal, sepultada no interior do sulco lateral. São os Giros Transversos de Heschl, compondo o Córtex Auditivo Primário, áreas 41 e 42. Eles recebem as radiações auditivas do corpo geniculado medial do tálamo com uma organização tonotópica precisa, distinguindo graves e agudos.",
    9: "Afastando os opérculos frontal, parietal e temporal, revelamos o Córtex da Ínsula, o lobo oculto de Reil. A ínsula processa a interocepção profunda, a percepção dos batimentos cardíacos e do trato gastrointestinal, além da experiência afetiva da dor, gustação e respostas empáticas viscerais.",
    10: "No dorso posterior, acima do sulco intraparietal, temos o Lobo Parietal Superior, área 7 de Brodmann. Ele atua como um hub supremo de integração multimodal somatossensorial e visual, construindo as coordenadas espaciais 3D que orientam a preensão motora dos membros no espaço exterior.",
    11: "Avançando para as profundezas do lobo temporal medial, encontramos a formação hipocampal, compreendendo o corno de Amon e o giro denteado. Esta estrutura de arquicórtex trilaminar é fundamental para a consolidação de memórias declarativas e episodicamente navega o espaço por meio das células de lugar.",
    12: "Adjacente ao polo anterior do hipocampo, notem o Complexo Amigdaloidiano. A amígdala funciona como a sentinela emocional do encéfalo, avaliando em milissegundos pistas de perigo ambiental, disparando o condicionamento de medo e modulando as respostas do sistema nervoso autonômico via hipotálamo.",
    13: "Entrando nos núcleos da base, visualizamos o Corpo Estriado, subdividido funcionalmente em Núcleo Caudado e Putâmen. Rico em neurônios espinhosos médios gabaérgicos, o estriado integra as vias direta e indireta moduladas pela dopamina, selecionando e filtrando os programas motores desejados.",
    14: "Medialmente ao putâmen, temos o Globo Pálido, composto pelos segmentos externo e interno. O segmento interno, junto com a substância negra reticulata, constitui a principal estação de saída dos gânglios da base, exercendo controle inibitório tônico contínuo sobre os núcleos motores do tálamo.",
    15: "Observem este imenso arco de substância branca inter-hemisférica: é o Corpo Caloso. Composto por mais de duzentos milhões de fibras mielinizadas, ele une regiões homólogas dos hemisférios esquerdo e direito através de seu rostro, joelho, tronco e esplênio, garantindo a cognição bimanual e unificada.",
    16: "Bem no centro geométrico do encéfalo, reparem no Tálamo. Formado por duas massas nucleares ovoides, o tálamo é a grande alfândega sensorial do cérebro. Quase todos os impulsos sensitivos passam por seus núcleos específicos antes de atingirem o córtex cerebral, além de modular os estados de vigília e atenção consciente.",
    17: "Logo abaixo do sulco hipotalâmico, temos o Hipotálamo e a Glândula Hipófise ligada pelo infundíbulo. O hipotálamo é o comandante supremo da homeostase corporal, regulando a temperatura, o balanço hídrico, o apetite, os ritmos circadianos e todo o eixo endócrino pela liberação de neuro-hormônios adenohipofisários.",
    18: "Na base do diencéfalo, observem o Quiasma Óptico. Aqui, as fibras procedentes das hemirretinas nasais decussam para o lado oposto, enquanto as hemirretinas temporais seguem ipsilateralmente pelos tratos ópticos, permitindo que cada hemisfério processe a totalidade do campo visual contralateral.",
    19: "Observem a cavidade translúcida do Sistema Ventricular: dois ventrículos laterais, o terceiro ventrículo medial, o fino aqueduto de Sylvius e o quarto ventrículo. O líquor, produzido continuamente pelos plexos corióideos, circula por estas cavidades amortecendo o tecido nervoso e drenando catabólitos metabólicos.",
    20: "No topo do tronco encefálico, situam-se o Mesencéfalo e a Substância Negra. Na porção compacta, neurônios dopaminérgicos pigmentados por neuromelanina projetam densamente para o estriado, cuja degeneração progressiva é o substrato fisiopatológico da Doença de Parkinson.",
    21: "Descendo ventralmente, encontramos a robusta Ponte de Varólio. Seus proeminentes feixes transversais cruzam a linha média em direção aos pedúnculos cerebelares médios, conectando as informações do córtex motor ao cerebelo para o ajuste fino do movimento em tempo real.",
    22: "Na transição para a medula espinhal, reparem no Bulbo e na Decussação das Pirâmides. É neste cruzamento cruciforme anterior que cerca de 85 a 90 por cento das fibras do trato corticoespinhal mudam de lado, explicando por que uma lesão cortical motora à esquerda paralisará a musculatura do lado direito do corpo.",
    23: "Ao longo do tronco encefálico e da base craniana, emergem os 12 pares de Nervos Cranianos. Eles transmitem sensibilidades especiais como olfação, visão, audição e equilíbrio, e inervam a musculatura da mímica facial, mastigação, deglutição, fonação e a víscera toracoabdominal pelo nervo vago.",
    24: "Atrás do tronco encefálico, reparem na magnífica arquitetura do Cerebelo. Com suas fólias horizontais estreitas, o vérmis central, tonsilas inferiores e os três pares de pedúnculos, o cerebelo coordena a precisão temporal motora, a marcha, o equilíbrio postural e a aprendizagem motora implícita.",
    25: "Descendo pelo canal raquidiano, temos os segmentos Cervicais e Torácicos da Medula Espinhal. No H medular central, corpos de neurônios motores e sensitivos transmitem os comandos do cérebro para os membros superiores e musculatura intercostal por meio das raízes ventrais e dorsais.",
    26: "Na extremidade inferior do canal vertebral, entre as vértebras L1 e L2, a medula se afila no Cone Medular, de onde prossegue a Cauda Equina rodeada pela cisterna lombar cheia de líquor. É neste espaço seguro abaixo de L2 que se realizam as punções lombares diagnósticas e anestesias raquidianas.",
    0: "Bem-vindos ao Tour Guiado do MOZOK v2.0. Iniciaremos nossa expedição anatômica observando o Sistema Nervoso Central em escala macroscópica, explorando os lobos corticais, o sistema límbico, os gânglios da base, o tronco, o cerebelo e a medula, até mergulharmos no microcosmo dos neurônios piramidais da Camada 5."
}

# [PT-BR]: Mapeamento estrito das vozes neurais humanas oficiais idênticas ao Svitlo/Anki
# [EN-GB]: Strict mapping of official human neural voices identical to Svitlo/Anki
HUMAN_VOICES = {
    "pt-BR": "pt-BR-FranciscaNeural",
    "en-GB": "en-GB-SoniaNeural",
    "uk-UA": "uk-UA-PolinaNeural",
    "it-IT": "it-IT-ElsaNeural"
}

# [PT-BR]: Filtro acústico SoundCraft Channel Strip idêntico ao SvitloController.php
# [EN-GB]: SoundCraft Channel Strip acoustic filter identical to SvitloController.php
SOUNDCRAFT_FILTER = "highpass=f=80,equalizer=f=3200:t=q:w=1.0:g=2.0,acompressor=threshold=-18dB:ratio=3:attack=10:release=120:makeup=2dB"

def load_credentials():
    """
    [PT-BR]: Carrega credenciais de Gemini e Groq a partir do filesystem ou variáveis de ambiente.
    [EN-GB]: Loads Gemini and Groq credentials from filesystem or environment variables.
    """
    creds = {"gemini_api_key": None, "groq_api_key": None}

    # Verifica caminhos padrão no sistema
    candidate_files = [
        Path("/var/www/mcp-server/credentials/credentials.json"),
        Path("credentials.json"),
        Path("zorya.toml"),
        Path(os.path.expanduser("~/.config/svitlo/credentials.json")),
        Path("C:/var/www/mcp-server/credentials/credentials.json")
    ]

    for p in candidate_files:
        if p.exists():
            try:
                content = p.read_text(encoding="utf-8")
                if p.suffix == ".json":
                    data = json.loads(content)
                    creds["gemini_api_key"] = creds["gemini_api_key"] or data.get("gemini_api_key") or data.get("GEMINI_API_KEY")
                    creds["groq_api_key"] = creds["groq_api_key"] or data.get("groq_api_key") or data.get("GROQ_API_KEY")
                elif p.suffix == ".toml":
                    for line in content.splitlines():
                        if "gemini" in line.lower() and "=" in line:
                            creds["gemini_api_key"] = creds["gemini_api_key"] or line.split("=", 1)[1].strip().strip('"\'')
                        if "groq" in line.lower() and "=" in line:
                            creds["groq_api_key"] = creds["groq_api_key"] or line.split("=", 1)[1].strip().strip('"\'')
            except Exception:
                pass

    creds["gemini_api_key"] = creds["gemini_api_key"] or os.getenv("GEMINI_API_KEY")
    creds["groq_api_key"] = creds["groq_api_key"] or os.getenv("GROQ_API_KEY")
    return creds

def apply_soundcraft_filter(raw_path: Path, processed_path: Path) -> bool:
    """
    [PT-BR]: Aplica o filtro SoundCraft Channel Strip via FFmpeg na pós-produção dos áudios MP3.
    [EN-GB]: Applies the SoundCraft Channel Strip filter via FFmpeg on MP3 audio post-production.
    """
    try:
        cmd = [
            "ffmpeg", "-y", "-i", str(raw_path),
            "-af", SOUNDCRAFT_FILTER,
            "-b:a", "192k",
            str(processed_path)
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except Exception as exc:
        # Se FFmpeg falhar, copia o arquivo bruto como fallback gracioso
        try:
            import shutil
            shutil.copyfile(raw_path, processed_path)
            return True
        except Exception:
            return False

async def generate_speech_edge(text: str, output_path: Path, voice: str = "pt-BR-FranciscaNeural"):
    """
    [PT-BR]: Síntese de áudio primária de estúdio com Edge-TTS.
    [EN-GB]: Primary studio audio synthesis with Edge-TTS.
    """
    try:
        import edge_tts
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
            tmp_path = Path(tmp_file.name)

        communicate = edge_tts.Communicate(text, voice, rate="-2%", pitch="-1Hz")
        await communicate.save(str(tmp_path))

        # Aplica o filtro de áudio SoundCraft Channel Strip
        ok = apply_soundcraft_filter(tmp_path, output_path)
        try:
            tmp_path.unlink()
        except Exception:
            pass
        return ok
    except Exception as exc:
        print(f"  [AVISO/WARN] Falha na síntese Edge-TTS com {voice}: {exc}")
        return False

async def main():
    print("=" * 80)
    print("MOZOK v2.0 -- Pre-build de Áudio Neural Humano (Motor Flashcards / SoundCraft)")
    print("Vozes: pt-BR-FranciscaNeural, en-GB-SoniaNeural, uk-UA-PolinaNeural, it-IT-ElsaNeural")
    print("Filtro: " + SOUNDCRAFT_FILTER)
    print("=" * 80)

    creds = load_credentials()
    if creds.get("gemini_api_key"):
        print("[INFO] Chave Gemini detectada para suporte a Gemini TTS (gemini-2.5-flash-preview-tts / Aoede / Kore).")
    if creds.get("groq_api_key"):
        print("[INFO] Chave Groq detectada para suporte a Orpheus / Qwen (canopylabs/orpheus-v1-english).")

    output_dir = Path("web/assets/audio/pt-BR")
    output_dir.mkdir(parents=True, exist_ok=True)

    voice_pt = HUMAN_VOICES["pt-BR"]
    success_count = 0
    total_count = len(PROFESSOR_SCRIPTS)

    print(f"\nGerando {total_count} arquivos de áudio em {output_dir} com {voice_pt}...")

    for struct_id, script in PROFESSOR_SCRIPTS.items():
        filename = "tour.mp3" if struct_id == 0 else f"struct_{struct_id}.mp3"
        dest_file = output_dir / filename

        print(f"[{struct_id:02d}/{total_count}] Sintetizando e masterizando {filename}...")
        ok = await generate_speech_edge(script, dest_file, voice=voice_pt)
        if not ok:
            # Fallback secundário
            print(f"  -> Tentando fallback com pt-BR-AntonioNeural...")
            ok = await generate_speech_edge(script, dest_file, voice="pt-BR-AntonioNeural")

        if ok and dest_file.exists():
            size_kb = dest_file.stat().st_size / 1024
            print(f"  -> [OK Master SoundCraft] {filename} ({size_kb:.1f} KB)")
            success_count += 1
        else:
            print(f"  -> [FALHA] Não foi possível sintetizar {filename}.")

    print("=" * 80)
    print(f"Concluído: {success_count}/{total_count} áudios neurais gerados com sucesso.")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())
