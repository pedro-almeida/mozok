# MOZOK (МОЗОК) v1.0.0

> **Open-Source Interactive Multi-Scale Atlas of the Human Brain & Connectome**  
> *"A Google Earth for the Human Brain — 500 Neurons, Synaptic Kinetics, CSF & Prion Pathophysiology"*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0%20Official-success.svg)](Cargo.toml)
[![Rust](https://img.shields.io/badge/Rust-2021%20Edition-orange.svg)](https://www.rust-lang.org)
[![Engine](https://img.shields.io/badge/Godot-4.x-478cbf.svg)](https://godotengine.org)
[![WebGL2](https://img.shields.io/badge/WebGL2-Three.js%20Studio-brightgreen.svg)](web/index.html)
[![Manifesto](https://img.shields.io/badge/Manifesto-Read%20Here-green.svg)](MANIFESTO.md)

---

## 1. O que é o MOZOK v1.0.0?

O **MOZOK** (Ucraniano: *Мозок* — "Cérebro") é uma plataforma aberta de exploração neuroanatômica e fisiológica multi-escala contínua. Apelidado de **"Google Earth do Cérebro Humano"**, o MOZOK permite transitar de forma fluida e sem cortes entre múltiplos níveis de organização biológica:

$$\text{Córtex MNI152 (Macro)} \longrightarrow \text{Núcleos Subcorticais (Meso)} \longrightarrow \text{Conectoma 500 Neurônios (Micro)} \longrightarrow \text{Fenda Sináptica (Nano)}$$

Desenvolvido para o ensino de excelência em **Neurociências, Psicologia, Neuroanatomofisiologia e Medicina**, o sistema conta com suporte nativo duplo:
1. **MOZOK WebGL2 Studio (`web/index.html`):** Aplicação 3D moderna, 100% offline, acelerada por hardware na GPU NVIDIA GTX 1650 a 60 FPS, com narração inteligente por voz humana natural em português (`pt-BR`).
2. **Motor Nativo Godot 4 + Rust (`scenes/main.tscn` / `mozok-godot`):** Shaders corticais proceduralmente esculpidos com transparência progressiva por zoom e `MultiMeshInstance3D` na GPU.

---

## 2. As 14 Estruturas Neuroanatômicas Fundamentais

O atlas cobre as 14 regiões essenciais da neurociência contemporânea, cada uma com sua respectiva função fisiológica, correlação clínica/psicopatológica, neurotransmissor e DOI científico:

| # | Estrutura | Sigla | Escala | Função Principal | Correlação Clínica & Psicopatológica | Neurotransmissor | DOI |
| :-: | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **1** | **Encéfalo Humano Completo** | `WB` | Macro | Integração sensorial, motora, cognitiva e homeostática global | Atrofia cortical generalizada, demência na DCJ | Polissináptico integrado | `10.1016/j.neuroimage.2009.04.041` |
| **2** | **Córtex Pré-Frontal Dorsolateral** | `DLPFC` | Meso | Funções executivas, memória operacional e controle inibitório | Síndrome disexecutiva, depressão maior, apatia | Dopamina (D1/D2) & Glutamato | `10.1146/annurev.neuro.24.1.167` |
| **3** | **Giro Pré-Central (Córtex Motor M1)** | `M1` | Meso | Motricidade voluntária somatotópica (Homúnculo de Penfield) | Paresia espástica, perda de motricidade fina, mioclonias | L-Glutamato excitatório | `10.1093/cercor/bhz159` |
| **4** | **Área de Broca (Giro Frontal Inferior)** | `BROCA` | Meso | Planejamento motor da fala, articulação e sintaxe | Afasia de Broca motora não-fluente, apraxia verbal | Acetilcolina & GABA | `10.1093/brain/awm042` |
| **5** | **Área de Wernicke (Giro Temporal Superior)** | `WERN` | Meso | Compreensão fonológica e semântica da linguagem | Afasia de Wernicke fluente com parafasias, anosognosia | Glutamato & GABA | `10.1002/ana.20404` |
| **6** | **Hipocampo (Corno de Amon CA1-CA4)** | `HIP` | Meso | Consolidação da memória declarativa e navegação espacial | Amnésia anterógrada, Doença de Alzheimer precoce | L-Glutamato (LTP via NMDA) | `10.1126/science.abb3333` |
| **7** | **Complexo Amigdaloidiano** | `AMYG` | Meso | Valência emocional, vigilância e condicionamento do medo | Transtornos de ansiedade, PTSD, Síndrome de Klüver-Bucy | Serotonina (5-HT) & GABA | `10.1038/nature14188` |
| **8** | **Corpo Estriado (Caudado & Putâmen)** | `STR` | Meso | Hábitos motores, seleção de ações e modulação do tônus | Coreia de Huntington, discinesias, mioclonias na DCJ | Dopamina & GABA (D1/D2) | `10.1146/annurev.neuro.29.051605.112851` |
| **9** | **Tálamo Pulvinar e Medial** | `PULV` | Meso | Revezamento sensorial multimodal e atenção visual seletiva | Sinal do Taco de Hóquei e Pulvinar na RM DWI na DCJ | Glutamato & GABA | `10.1016/S1474-4422(09)70291-1` |
| **10** | **Substância Negra Pars Compacta** | `SNC` | Meso | Síntese de dopamina com pigmento protetor de neuromelanina | Doença de Parkinson, rigidez em roda denteada, hipocinesia | Dopamina nigroestriatal | `10.1016/j.neuroimage.2014.03.032` |
| **11** | **Córtex Cerebelar & Células de Purkinje** | `CEREB` | Meso | Coordenação motora fina, equilíbrio e correção de erros | Ataxia cerebelar de marcha, dismetria, tremor cinético | GABA & Glutamato | `10.1038/nrn1938` |
| **12** | **Ventrículos Laterais & Sistema Glinfático** | `VENT` | Meso | Produção pulsátil de LCR (500 mL/dia) e depuração via AQP4 | Hidrocefalia ex-vacuo, colapso glinfático, pico de Tau | Líquor com eletrólitos e glicose | `10.1126/science.1234098` |
| **13** | **Camada Piramidal V & Célula de Betz** | `BETZ` | Micro | Neurônio motor piramidal gigante descoberto em Kyiv (1874) | Degeneração axonal, ELA, atrofia citoplasmática rápida | L-Glutamato vesicular | `10.1038/s41586-021-03950-0` |
| **14** | **Fenda Sináptica & Banho de Líquor** | `SYN` | Nano | Transmissão quântica em fenda de 20 nm com vesículas ativas | Excitotoxicidade, ataque priônico PrPSc e perda sináptica | L-Glutamato & GABA (NMDA/AMPA) | `10.1126/science.adk4858` |

---

## 3. Tecnologias & Arquitetura de Ponta

* **Multi-Escala Sem Costuras ("Seamless Google Earth"):** A câmera 6-DOF calcula dinamicamente a distância anatômica (`camera_distance_mm`). Ao afastar-se (`> 140 mm`), o córtex anatômico MNI152 é 100% opaco; ao aproximar-se (`15 mm a 140 mm`), o córtex adquire transparência de raio-X revelando os núcleos internos; ao penetrar abaixo de `15 mm`, o **Micro-Conectoma de 500 Neurônios** se materializa em alta fidelidade.
* **Conectoma de 500 Neurônios 3D na GPU:** Renderizado através de instâncias de alta performance (`MultiMeshInstance3D` no Godot e `THREE.InstancedMesh` no WebGL2), com axônios mielinizados, nódulos de Ranvier, espinhas dendríticas e feixes de condução saltatória.
* **Sinapses Vivas & Banho de Líquor:** Vesículas de Glutamato (verde esmeralda `#4ade80`) e GABA (azul elétrico `#38bdf8`) em trânsito contínuo pela fenda sináptica de 20 nm, além de pulsos hidrodinâmicos do LCR pelo Aqueduto de Sylvius (32 mm/s).
* **Simulador de Encefalopatia Priônica (Doença de Creutzfeldt-Jakob - DCJ):** Modela a cascata autocatalítica $\text{PrP}^\text{C} + \text{PrP}^\text{Sc} \to 2\text{PrP}^\text{Sc}$, a formação de vacúolos espongiformes no neuropilo, astrogliose reativa, atrofia de tecido e o surge dos biomarcadores no líquor (Proteína 14-3-3 > 2.0 ng/mL, Tau Total > 4000 pg/mL e ensaio RT-QuIC positivo).
* **Narração Inteligente por Voz Natural IA:** Tour guiado em 4 atos com síntese de voz nativa em português (`DisplayServer.tts_speak` no Godot e `SpeechSynthesisUtterance` no navegador).

---

## 4. Como Executar

### Inicialização Automática com Aceleração de GPU (Recomendado)
Dê um duplo-clique no arquivo `run.bat` na raiz do projeto:
```cmd
run.bat
```
O script configura automaticamente a GPU dedicada (NVIDIA GeForce GTX 1650) no Registro do Windows e inicia o **MOZOK v1.0 WebGL2 Studio** em tela cheia no Chrome ou Edge. Caso o executável `godot` esteja no seu PATH, você poderá abrir também a cena nativa Godot 4.

### Testes da Fundação Rust (100% dos Testes Passando)
```cmd
cargo test
```
Executa a suíte de testes de precisão espacial, navegação logarítmica, ponto flutuante, ontologias, governança de memória LRU e simulação patológica de príons.

---

## 5. Estrutura do Repositório

```text
C:\mozok\
├── Cargo.toml                  # Workspace Rust v1.0.0 com 8 crates
├── run.bat                     # Launcher otimizado para GPU NVIDIA GTX 1650
├── README.md                   # Documentação oficial v1.0.0
├── MANIFESTO.md                # Fundamento ético de Immanuel Kant & tributo ucraniano
├── project.godot               # Configuração do Godot 4
├── scenes/
│   └── main.tscn               # Cena principal 3D com HUD e botões de Tour e Narração
├── scripts/
│   └── main.gd                 # Controlador GDScript v1.0.0 (Shader, 500 neurônios, TTS)
├── web/
│   ├── index.html              # MOZOK v1.0 WebGL2 Studio (Seamless Google Earth)
│   └── js/
│       ├── vendor/             # Three.js r128 e OrbitControls
│       ├── brain-mesh-data.js  # Malha cortical MNI152 (81.924 vértices reais)
│       ├── scientific-atlas-meshes.js # Núcleos subcorticais reais (estriado, tálamo, ventrículos)
│       └── swc-neurons-data.js # Morfologia SWC de neurônios reais
├── rust/                       # Crates puros em Rust
│   ├── mozok-core/             # Coordenadas 64-bit e escala contínua
│   ├── mozok-atlas/            # Ontologias anatômicas DAG
│   ├── mozok-navigation/       # Câmera logarítmica e floating origin
│   ├── mozok-streaming/        # Cache governado out-of-core
│   ├── mozok-search/           # Busca invertida de termos anatômicos
│   ├── mozok-physiology/       # Hidrodinâmica do LCR e fenda sináptica
│   ├── mozok-pathology/        # Propagação priônica da DCJ
│   └── mozok-godot/            # GDExtension para integração nativa
└── tests/
    └── foundation_tests.rs     # Testes de integração da fundação científica
```

---

## 6. Licença & Compromisso Ético

Distribuído sob a **Apache License, Versão 2.0** ([LICENSE](LICENSE)).  
Inspirado na Boa Vontade (*Der gute Wille*) e no Imperativo Categórico de Immanuel Kant, e dedicado à coragem científica de Volodymyr Bets (Kyiv, 1874).
