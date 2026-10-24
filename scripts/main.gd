extends Node3D

## MOZOK v1.0.0 — Multi-Scale Human Brain & Connectome Explorer
## "Google Earth for the Human Brain" — The Brain is Only the Beginning
##
## Implements continuous 6-DOF logarithmic navigation, floating-origin stabilization,
## procedural cortical gyri/sulci shaders with zoom-based progressive transparency,
## living CSF hydrodynamics, 500-neuron 3D GPU connectome (MultiMeshInstance3D),
## synaptic neurotransmitter kinetics, CJD prion pathophysiology cascade,
## and natural human voice narration (DisplayServer.tts_speak).

@onready var camera: Camera3D = $NeuroCamera
@onready var brain_root: Node3D = $BrainRoot

# Telemetry & Provenance HUD
@onready var telemetry_label: Label = $HUD/TelemetryPanel/Margin/TelemetryLabel
@onready var provenance_title: Label = $HUD/ProvenanceBanner/Margin/VBox/TitleLabel
@onready var provenance_details: Label = $HUD/ProvenanceBanner/Margin/VBox/DetailsLabel
@onready var provenance_doi: Label = $HUD/ProvenanceBanner/Margin/VBox/HBox/DoiLabel
@onready var search_buttons_container: VBoxContainer = $HUD/QuickJumpPanel/Margin/VBox/Scroll/VBox
@onready var tour_button: Button = $HUD/QuickJumpPanel/Margin/VBox/TourButton
@onready var narrate_button: Button = $HUD/QuickJumpPanel/Margin/VBox/NarrateButton

# Disease Simulation Controls
@onready var cjd_toggle_btn: CheckButton = $HUD/DiseasePanel/Margin/VBox/CjdToggle
@onready var cjd_speed_slider: HSlider = $HUD/DiseasePanel/Margin/VBox/SpeedHBox/SpeedSlider
@onready var cjd_speed_label: Label = $HUD/DiseasePanel/Margin/VBox/SpeedHBox/SpeedValue
@onready var csf_biomarker_label: Label = $HUD/DiseasePanel/Margin/VBox/BiomarkersLabel

# Spatial scale categories matching mozok-core
enum SpatialScale {
	MACRO_WHOLE_BRAIN,
	MACRO_LOBES,
	MESO_STRUCTURES,
	MESO_TISSUE,
	MICRO_NEURONS,
	MICRO_SYNAPSES
}

# 6-DOF Orbital & Logarithmic Camera State
var camera_target_mni: Vector3 = Vector3.ZERO
var camera_distance_mm: float = 220.0
var camera_yaw_rad: float = 0.55
var camera_pitch_rad: float = 0.28

const MIN_DISTANCE_MM: float = 0.00005 # 50 nm
const MAX_DISTANCE_MM: float = 500.0   # 0.5 m

# Floating Origin stabilization
var floating_origin_mni: Vector3 = Vector3.ZERO
const RECENTER_THRESHOLD_MM: float = 50.0
var recenter_count: int = 0

# Active state
var current_scale: SpatialScale = SpatialScale.MACRO_WHOLE_BRAIN
var active_region_id: int = 1
var is_orbiting: bool = false
var last_mouse_pos: Vector2 = Vector2.ZERO

# Alpha Seed Data Registry
var alpha_regions: Dictionary = {}
var proxy_nodes: Dictionary = {}

# Cortical Shader Material for Whole Brain
var cortex_shader_mat: ShaderMaterial = null

# 500-Neuron Connectome References
var connectome_multimesh: MultiMeshInstance3D = null
var connectome_root: Node3D = null
var axon_lines_group: Node3D = null
var synaptic_vesicles_group: Node3D = null
var csf_molecules_group: Node3D = null

# Living Physiology State
var phys_time_sec: float = 0.0
const HEART_RATE_HZ: float = 1.1        # 66 bpm
const RESPIRATORY_RATE_HZ: float = 0.25  # 15 bpm
var csf_flow_aqueduct_mm_s: float = 32.0
var glymphatic_aqp4_eff: float = 1.0

# Synaptic active transmission (Micro/Nano scale)
var synaptic_vesicles: int = 200
var synaptic_glutamate_umol: float = 0.0
var synaptic_integrity: float = 1.0
var vesicle_nodes: Array[MeshInstance3D] = []

# Creutzfeldt-Jakob Disease (CJD) Simulator State
var cjd_active: bool = false
var cjd_speed_days_per_sec: float = 5.0
var cjd_elapsed_days: float = 0.0

# Regional pathology: prp_sc, vacuole_density, astrogliosis, neuronal_survival
var cjd_regions: Dictionary = {}

# Biomarkers
var protein_14_3_3_ng_ml: float = 0.4
var total_tau_pg_ml: float = 180.0
var rt_quic_positive: bool = false

# Procedural Spongiform Vacuoles and Amyloid Plaques
var vacuole_nodes: Array[Node3D] = []
var plaque_nodes: Array[MeshInstance3D] = []

# AI Natural Voice Tour State
var is_tour_active: bool = false
var tour_step_index: int = 0
var tour_step_timer: float = 0.0
var tour_sequence: Array[int] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

func _ready() -> void:
	print("[MOZOK] v1.0.0 — Multi-Scale Human Brain & Connectome Explorer initialized.")
	_init_alpha_seed_data()
	_init_cjd_pathology_state()
	_create_visual_proxies()
	_create_500_neuron_connectome()
	_build_quick_jump_ui()
	_setup_disease_ui()
	_setup_tour_ui()
	_update_camera_transform()
	_update_hud()

func _init_alpha_seed_data() -> void:
	# 14 Fundamental Structures for Psychology & Neuroanatomophysiology
	alpha_regions[1] = {
		"id": 1,
		"acronym": "WB",
		"name": "Encéfalo Humano Completo (Мозок - MNI152)",
		"scale": SpatialScale.MACRO_WHOLE_BRAIN,
		"center": Vector3(0, 0, 0),
		"radius": 90.0,
		"optimal_dist": 220.0,
		"color": Color(0.85, 0.78, 0.72, 0.95),
		"function": "Integração sensorial, motora, cognitiva, emocional e homeostática global.",
		"clinical": "Atrofia cortical generalizada, perda cognitiva global e demência na DCJ.",
		"neurotransmitter": "Orquestração polissináptica (Glutamato, GABA, Dopamina, 5-HT, ACh)",
		"citation": "Fonov et al. (ICBM / MNI Consortium) (2011)",
		"context": "Espaço estereotáxico MNI152 nonlinear 6th generation average MRI",
		"doi": "10.1016/j.neuroimage.2009.04.041",
		"audio_script": "Você está contemplando o Encéfalo Humano Completo no espaço MNI 152. Com cerca de 86 bilhões de neurônios interconectados, esta estrutura integra toda a cognição, afeto e motricidade humana."
	}
	alpha_regions[2] = {
		"id": 2,
		"acronym": "DLPFC",
		"name": "Córtex Pré-Frontal Dorsolateral (BA 9/46)",
		"scale": SpatialScale.MACRO_LOBES,
		"center": Vector3(-36, 45, 30),
		"radius": 24.0,
		"optimal_dist": 60.0,
		"color": Color(0.28, 0.55, 0.95, 0.75),
		"function": "Funções executivas, memória operacional, planejamento e tomada de decisão.",
		"clinical": "Síndrome disexecutiva, depressão maior, apatia e labilidade precoce na DCJ.",
		"neurotransmitter": "Dopamina (receptores D1/D2) e L-Glutamato córtico-cortical",
		"citation": "Miller & Cohen (2001) / Petrides (2005) Annu Rev Neurosci",
		"context": "Circuito fronto-estriatal executivo e controle top-down",
		"doi": "10.1146/annurev.neuro.24.1.167",
		"audio_script": "O Córtex Pré-Frontal Dorsolateral rege as funções executivas, a memória de trabalho e a inibição de impulsos, sendo intensamente modulado pelas vias dopaminérgicas mesocorticais."
	}
	alpha_regions[3] = {
		"id": 3,
		"acronym": "M1",
		"name": "Giro Pré-Central — Córtex Motor Primário (M1 / BA 4)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-38, -14, 52),
		"radius": 18.0,
		"optimal_dist": 28.0,
		"color": Color(0.92, 0.32, 0.32, 0.75),
		"function": "Planejamento e disparo dos comandos motores voluntários somatotópicos.",
		"clinical": "Paresia espástica, perda da motricidade fina, hiperreflexia e mioclonias na DCJ.",
		"neurotransmitter": "L-Glutamato excitatório nas sinapses córtico-espinhais",
		"citation": "Brodmann (1909) / Penfield & Boldrey (1937) Brain",
		"context": "Homúnculo motor somatotópico e origem do trato piramidal",
		"doi": "10.1093/brain/60.4.389",
		"audio_script": "O Giro Pré-Central hospeda o córtex motor primário M1 e o mapa somatotópico de Penfield. Daqui emergem os tratos córtico-espinhais que comandam cada fração milimétrica do movimento voluntário."
	}
	alpha_regions[4] = {
		"id": 4,
		"acronym": "BROCA",
		"name": "Área de Broca — Giro Frontal Inferior (BA 44/45)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-48, 18, 12),
		"radius": 14.0,
		"optimal_dist": 30.0,
		"color": Color(0.95, 0.52, 0.18, 0.75),
		"function": "Programação motora da fala, sintaxe gramatical e articulação fonológica.",
		"clinical": "Afasia de Broca expressiva não-fluente, apraxia verbal e mutismo acinético na DCJ.",
		"neurotransmitter": "Acetilcolina, L-Glutamato e modulação GABAérgica",
		"citation": "Paul Broca (1861) / Dronkers et al. (2007) Brain",
		"context": "Pars opercularis e triangularis do hemisfério dominante",
		"doi": "10.1093/brain/awm042",
		"audio_script": "A Área de Broca, no giro frontal inferior esquerdo, programa a mecânica da fala e a articulação verbal, interligando-se à área de Wernicke pelo fascículo arqueado."
	}
	alpha_regions[5] = {
		"id": 5,
		"acronym": "WERN",
		"name": "Área de Wernicke — Giro Temporal Superior (BA 22)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-54, -38, 16),
		"radius": 14.0,
		"optimal_dist": 30.0,
		"color": Color(0.25, 0.75, 0.85, 0.75),
		"function": "Decodificação auditiva, reconhecimento semântico e compreensão da fala.",
		"clinical": "Afasia de Wernicke fluente com jargões e anosognosia, parafasias semânticas.",
		"neurotransmitter": "Glutamato e GABA em circuitos tálamo-corticais auditivos",
		"citation": "Carl Wernicke (1874) / Catani et al. (2005) Ann Neurol",
		"context": "Córtex auditivo secundário de associação e processamento semântico",
		"doi": "10.1002/ana.20404",
		"audio_script": "A Área de Wernicke decodifica os fonemas e confere sentido aos símbolos linguísticos. Lesões causam afasia fluente, onde a fala flui sem conexão semântica."
	}
	alpha_regions[6] = {
		"id": 6,
		"acronym": "HIP",
		"name": "Hipocampo — Corno de Amon (CA1-CA4 e Subículo)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-28, -20, -14),
		"radius": 12.0,
		"optimal_dist": 22.0,
		"color": Color(0.68, 0.38, 0.88, 0.80),
		"function": "Consolidação da memória episódica declarativa e navegação espacial.",
		"clinical": "Amnésia anterógrada, Doença de Alzheimer precoce e declínio mnemônico rápido na DCJ.",
		"neurotransmitter": "Glutamato (receptores NMDA para Potenciação de Longa Duração - LTP)",
		"citation": "Amunts et al. Julich Brain Cytoarchitectonic Atlas (2020) Science",
		"context": "Archicórtex límbico, giro denteado e neurogênese subgranular adulta",
		"doi": "10.1126/science.abb3333",
		"audio_script": "O Hipocampo, no lobo temporal mesial, é o centro de consolidação de memórias de longa duração e mapeamento espacial por células de lugar."
	}
	alpha_regions[7] = {
		"id": 7,
		"acronym": "AMYG",
		"name": "Complexo Amigdaloidiano (Núcleo Basolateral e Central)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-22, -6, -18),
		"radius": 9.0,
		"optimal_dist": 16.0,
		"color": Color(0.92, 0.22, 0.45, 0.80),
		"function": "Atribuição de valência emocional, condicionamento do medo e vigilância a perigo.",
		"clinical": "Transtornos de ansiedade, estresse pós-traumático, Síndrome de Klüver-Bucy e pânico.",
		"neurotransmitter": "Serotonina (5-HT), Noradrenalina e modulação inibitória por GABA",
		"citation": "LeDoux (2000) / Janak & Tye (2015) Nature",
		"context": "Reconhecimento de expressões faciais de medo e ativação autonômica",
		"doi": "10.1038/nature14188",
		"audio_script": "A Amígdala detecta estímulos de ameaça e condiciona respostas viscerais de medo e sobrevivência através de eferências ao hipotálamo."
	}
	alpha_regions[8] = {
		"id": 8,
		"acronym": "STR",
		"name": "Corpo Estriado — Caudado e Putâmen",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-18, 8, 4),
		"radius": 16.0,
		"optimal_dist": 25.0,
		"color": Color(0.95, 0.65, 0.15, 0.80),
		"function": "Seleção de ações, automatização de hábitos motores e tônus muscular.",
		"clinical": "Coreia de Huntington, discinesias, parkinsonismo secundário e mioclonias na DCJ.",
		"neurotransmitter": "Dopamina nigroestriatal e GABA (neurônios espinhosos médios D1/D2)",
		"citation": "Albin, Young & Penney (1989) / Graybiel (2008) Annu Rev Neurosci",
		"context": "Porta de entrada dos gânglios da base e vias direta e indireta",
		"doi": "10.1146/annurev.neuro.29.051605.112851",
		"audio_script": "O Corpo Estriado, formado pelo núcleo caudado e putâmen, processa o aprendizado de hábitos motores. Na DCJ, a desinibição estriatal precipita abalos mioclônicos violentos."
	}
	alpha_regions[9] = {
		"id": 9,
		"acronym": "PULV",
		"name": "Tálamo Pulvinar e Medial (Alvo Primário da DCJ)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-12, -24, 6),
		"radius": 12.0,
		"optimal_dist": 22.0,
		"color": Color(0.98, 0.42, 0.18, 0.85),
		"function": "Integração sensorial talamocortical, atenção visual e sincronização rítmica.",
		"clinical": "Sinal do Taco de Hóquei e Pulvinar na ressonância DWI na DCJ esporádica e variante.",
		"neurotransmitter": "Glutamato e neurônios de relé talâmico GABAérgicos",
		"citation": "Zerr et al. (European CJD Surveillance Consortium) (2009) Lancet Neurol",
		"context": "Hiperintensidade patognomônica bilateral em DWI e FLAIR",
		"doi": "10.1016/S1474-4422(09)70291-1",
		"audio_script": "O Tálamo Pulvinar é o principal centro de relé talâmico. Na Doença de Creutzfeldt-Jakob, a deposição priônica massiva produz o emblemático sinal do taco de hóquei na ressonância magnética."
	}
	alpha_regions[10] = {
		"id": 10,
		"acronym": "SNC",
		"name": "Substância Negra Pars Compacta",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-10, -18, -12),
		"radius": 8.0,
		"optimal_dist": 15.0,
		"color": Color(0.18, 0.18, 0.22, 0.90),
		"function": "Produção e projeção de dopamina para o estriado via via nigroestriatal.",
		"clinical": "Doença de Parkinson, rigidez em roda denteada, tremor de repouso e bradicinesia.",
		"neurotransmitter": "Dopamina sintetizada a partir da tirosina (neuromelanina protetora)",
		"citation": "Keuken et al. Ultra-high 7T MRI of Human Subcortex (2014) NeuroImage",
		"context": "Degeneração dopaminérgica seletiva e corpos de Lewy na sinucleinopatia",
		"doi": "10.1016/j.neuroimage.2014.03.032",
		"audio_script": "A Substância Negra pars compacta sintetiza dopamina com pigmentos de neuromelanina. Sua degeneração reduz os disparos motores, gerando rigidez e lentificação dos movimentos."
	}
	alpha_regions[11] = {
		"id": 11,
		"acronym": "CEREB",
		"name": "Córtex Cerebelar e Células de Purkinje",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(0, -38, -32),
		"radius": 26.0,
		"optimal_dist": 55.0,
		"color": Color(0.82, 0.65, 0.62, 0.85),
		"function": "Coordenação motora fina, equilíbrio postural e correção de erros cinemáticos.",
		"clinical": "Ataxia de marcha, dismetria, tremor cinético e forma cerebelar Brownell-Oppenheimer da DCJ.",
		"neurotransmitter": "GABA (células de Purkinje) e Glutamato (fibras paralelas/trepadeiras)",
		"citation": "Ito (2006) Nature Rev Neurosci / Julich Brain Atlas (2020)",
		"context": "Folhas cerebelares e arquitetura trilaminar de alta densidade neuronal",
		"doi": "10.1038/nrn1938",
		"audio_script": "O Cerebelo abriga mais da metade dos neurônios do corpo. As células de Purkinje emitem as únicas projeções inibitórias do córtex cerebelar, calibrando a precisão de cada ato motor."
	}
	alpha_regions[12] = {
		"id": 12,
		"acronym": "VENT",
		"name": "Ventrículos Laterais e Sistema Glinfático AQP4 (Líquor)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(0, -10, 15),
		"radius": 28.0,
		"optimal_dist": 40.0,
		"color": Color(0.12, 0.85, 0.95, 0.60),
		"function": "Produção pulsátil de LCR pelo plexo coroide e depuração glinfática de toxinas.",
		"clinical": "Hidrocefalia ex-vacuo, colapso glinfático, elevação de Proteína 14-3-3 e Tau.",
		"neurotransmitter": "Líquido cefalorraquidiano com íons vitais e peptídeos sinalizadores",
		"citation": "Nedergaard et al. (Glymphatic System Discovery) (2013) Science",
		"context": "Circulação perivascular de Virchow-Robin e depuração durante o sono",
		"doi": "10.1126/science.1234098",
		"audio_script": "Os Ventrículos e o sistema glinfático lavam o parênquima cerebral através do fluxo pulsátil de líquor, depurando proteínas patogênicas como PrPSc, Tau e amiloide durante o sono profundo."
	}
	alpha_regions[13] = {
		"id": 13,
		"acronym": "BETZ",
		"name": "Camada Piramidal V & Célula Gigante de Betz (1874)",
		"scale": SpatialScale.MICRO_NEURONS,
		"center": Vector3(-38.1, -14.0, 52.1),
		"radius": 0.08,
		"optimal_dist": 0.14,
		"color": Color(0.32, 0.88, 0.48, 0.95),
		"function": "Neurônio piramidal gigante com axônio motor longo até a medula espinhal.",
		"clinical": "Degeneração axonal retrógrada, vacuolização citoplasmática e perda motora na DCJ.",
		"neurotransmitter": "L-Glutamato vesicular em terminais pré-sinápticos corticais",
		"citation": "Volodymyr Bets (Kyiv, 1874) / BICCN Nature (2021)",
		"context": "Soma de 100 micrometros com árvore dendrítica apical extensa",
		"doi": "10.1038/s41586-021-03950-0",
		"audio_script": "Descoberta por Volodymyr Bets em 1874, a célula gigante de Betz na camada cinco do córtex motor primário projeta seu axônio por mais de um metro até os motoneurônios da medula espinhal."
	}
	alpha_regions[14] = {
		"id": 14,
		"acronym": "SYN",
		"name": "Fenda Sináptica Glutamatérgica & Banho Molecular do Líquor",
		"scale": SpatialScale.MICRO_SYNAPSES,
		"center": Vector3(-38.102, -14.001, 52.101),
		"radius": 0.0015,
		"optimal_dist": 0.0025,
		"color": Color(1.0, 0.85, 0.15, 0.98),
		"function": "Transmissão química em fenda de 20 nm, exocitose quântica e plasticidade sináptica.",
		"clinical": "Interação PrPC com PrPSc, excitotoxicidade glutamatérgica e perda sináptica inicial.",
		"neurotransmitter": "L-Glutamato, receptores AMPA, NMDA e influxo citotóxico de Cálcio",
		"citation": "Shapson-Coe et al. (Harvard / Google Connectomics) (2024) Science",
		"context": "Fenda sináptica de 20 nanômetros e vesículas de 40 nanômetros",
		"doi": "10.1126/science.adk4858",
		"audio_script": "Na escala de vinte nanômetros, as vesículas sinápticas liberam glutamato na fenda ativando receptores pós-sinápticos. É aqui que os oligômeros de príons PrPSc desestabilizam as sinapses."
	}

func _init_cjd_pathology_state() -> void:
	for id in alpha_regions.keys():
		cjd_regions[id] = {
			"prp_c": 1.0,
			"prp_sc": 0.0,
			"vacuole_density": 0.0,
			"astrogliosis": 0.0,
			"neuronal_survival": 1.0
		}
	# Seed initial sporadic CJD infection in Pulvinar Thalamus (id: 9)
	if cjd_regions.has(9):
		cjd_regions[9]["prp_sc"] = 0.55
		cjd_regions[9]["prp_c"] = 0.45

func _create_visual_proxies() -> void:
	# 1. Whole Human Brain (id == 1): Custom Sculpted ShaderMaterial with Progressive Zoom Transparency
	var brain_node = Node3D.new()
	brain_node.name = "Proxy_WB"
	
	var shader = Shader.new()
	shader.code = """
	// [PT-BR]: Shader Cortical MNI152 Translucido de Alta Fidelidade (Padrao Firefly)
	// [EN-GB]: High-Fidelity Translucent MNI152 Cortical Shader (Firefly Reference Standard)
	// [AI-CTX]: @llm-neuroscience: Dual-band Fresnel with stereotaxic grid exposing illuminated subcortical nuclei.
	shader_type spatial;
	render_mode blend_mix, depth_draw_always, cull_back;

	uniform float camera_dist_mm = 220.0;
	uniform vec4 cortex_color : source_color = vec4(0.82, 0.84, 0.88, 1.0);
	uniform vec4 sulcus_color : source_color = vec4(0.18, 0.20, 0.25, 1.0);
	uniform vec4 fresnel_outer_color : source_color = vec4(0.576, 0.773, 0.992, 1.0); // #93c5fd
	uniform vec4 fresnel_inner_color : source_color = vec4(0.0, 0.949, 0.996, 1.0);   // #00f2fe
	uniform float gyri_frequency = 0.14;
	uniform float gyri_depth = 3.6;
	uniform float roughness : hint_range(0.0, 1.0) = 0.25;

	varying float v_gyrus;
	varying vec3 v_obj_pos;

	void vertex() {
		v_obj_pos = VERTEX;
		// Multi-harmonic domain warping for anatomical cortical gyri & deep sulci
		float g1 = sin(VERTEX.x * gyri_frequency * 1.4 + cos(VERTEX.y * gyri_frequency)) * cos(VERTEX.z * gyri_frequency * 1.2);
		float g2 = sin(VERTEX.y * gyri_frequency * 2.0 + VERTEX.z * gyri_frequency) * 0.45;
		float g3 = cos((VERTEX.x + VERTEX.y + VERTEX.z) * gyri_frequency * 0.8) * 0.3;
		float gyrus = (g1 + g2 + g3);
		v_gyrus = gyrus;
		
		VERTEX += NORMAL * (gyrus * gyri_depth);
	}

	void fragment() {
		vec3 N = normalize(NORMAL);
		vec3 V = normalize(VIEW);
		float NdotV = max(dot(N, V), 0.0);
		float fresnel_outer = pow(1.0 - NdotV, 2.4);
		float fresnel_inner = pow(1.0 - NdotV, 4.8);

		float sulcal_ao = clamp((v_gyrus + 1.2) * 0.45, 0.0, 1.0);
		float grid_line = smoothstep(0.96, 0.99, abs(sin(v_obj_pos.x * 6.0)) + abs(sin(v_obj_pos.y * 6.0)) * 0.5) * 0.14 * sulcal_ao;

		float base_alpha = 0.42;
		if (camera_dist_mm > 140.0) {
			base_alpha = 0.42;
		} else if (camera_dist_mm >= 15.0) {
			float t = (camera_dist_mm - 15.0) / (140.0 - 15.0);
			base_alpha = mix(0.12, 0.42, t);
		} else {
			base_alpha = 0.04;
		}

		float alpha = clamp(base_alpha * (0.18 + 0.52 * fresnel_outer + 0.15 * (1.0 - sulcal_ao)), 0.08, 0.88);

		vec3 base = mix(sulcus_color.rgb, cortex_color.rgb, sulcal_ao);
		vec3 fresnel_glow = fresnel_outer * fresnel_outer_color.rgb * 0.8 + fresnel_inner * fresnel_inner_color.rgb * 1.2;
		vec3 final_rgb = base * 0.35 + fresnel_glow + vec3(0.0, 0.95, 1.0) * grid_line;

		ALBEDO = final_rgb;
		ROUGHNESS = roughness;
		SPECULAR = 0.5;
		ALPHA = alpha;
	}
	"""
	cortex_shader_mat = ShaderMaterial.new()
	cortex_shader_mat.shader = shader
	cortex_shader_mat.set_shader_parameter("camera_dist_mm", camera_distance_mm)
	
	# Left Cerebral Hemisphere
	var left_hemi = MeshInstance3D.new()
	var left_mesh = SphereMesh.new()
	left_mesh.radius = 42.0
	left_mesh.height = 135.0
	left_mesh.radial_segments = 48
	left_mesh.rings = 24
	left_hemi.mesh = left_mesh
	left_hemi.scale = Vector3(0.9, 0.95, 1.25)
	left_hemi.position = Vector3(-24.0, 5.0, 0.0)
	left_hemi.material_override = cortex_shader_mat
	brain_node.add_child(left_hemi)
	
	# Right Cerebral Hemisphere
	var right_hemi = MeshInstance3D.new()
	var right_mesh = SphereMesh.new()
	right_mesh.radius = 42.0
	right_mesh.height = 135.0
	right_mesh.radial_segments = 48
	right_mesh.rings = 24
	right_hemi.mesh = right_mesh
	right_hemi.scale = Vector3(0.9, 0.95, 1.25)
	right_hemi.position = Vector3(24.0, 5.0, 0.0)
	right_hemi.material_override = cortex_shader_mat
	brain_node.add_child(right_hemi)
	
	# Cerebellum (folia-textured)
	var cereb_mat = StandardMaterial3D.new()
	cereb_mat.albedo_color = Color(0.82, 0.65, 0.62, 0.9)
	cereb_mat.roughness = 0.5
	cereb_mat.rim_enabled = true
	cereb_mat.rim = 0.5
	
	var cereb_l = MeshInstance3D.new()
	var cereb_mesh = SphereMesh.new()
	cereb_mesh.radius = 22.0
	cereb_mesh.height = 36.0
	cereb_l.mesh = cereb_mesh
	cereb_l.scale = Vector3(1.1, 0.8, 0.9)
	cereb_l.position = Vector3(-18.0, -32.0, -36.0)
	cereb_l.material_override = cereb_mat
	brain_node.add_child(cereb_l)
	
	var cereb_r = MeshInstance3D.new()
	cereb_r.mesh = cereb_mesh
	cereb_r.scale = Vector3(1.1, 0.8, 0.9)
	cereb_r.position = Vector3(18.0, -32.0, -36.0)
	cereb_r.material_override = cereb_mat
	brain_node.add_child(cereb_r)
	
	# Brainstem
	var stem_mat = StandardMaterial3D.new()
	stem_mat.albedo_color = Color(0.86, 0.82, 0.76, 1.0)
	stem_mat.roughness = 0.4
	
	var stem = MeshInstance3D.new()
	var stem_mesh = CylinderMesh.new()
	stem_mesh.top_radius = 11.0
	stem_mesh.bottom_radius = 8.0
	stem_mesh.height = 55.0
	stem.mesh = stem_mesh
	stem.position = Vector3(0.0, -48.0, -16.0)
	stem.rotation_degrees = Vector3(12.0, 0.0, 0.0)
	stem.material_override = stem_mat
	brain_node.add_child(stem)
	
	brain_root.add_child(brain_node)
	proxy_nodes[1] = brain_node
	
	# 2. Subcortical & Specific Visual Proxies for Structures 2..14
	for id in alpha_regions.keys():
		if id == 1:
			continue
		var data: Dictionary = alpha_regions[id]
		var node = Node3D.new()
		node.name = "Proxy_" + str(data["acronym"])
		
		var mat = StandardMaterial3D.new()
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mat.albedo_color = data["color"]
		mat.roughness = 0.35
		mat.emission_enabled = true
		mat.emission = data["color"]
		mat.emission_energy_multiplier = 0.3
		
		if id == 12: # Ventrículos Laterais (CSF)
			var tor = TorusMesh.new()
			tor.inner_radius = data["radius"] * 0.4
			tor.outer_radius = data["radius"]
			var mi = MeshInstance3D.new()
			mi.mesh = tor
			mi.material_override = mat
			node.add_child(mi)
		elif id == 8: # Corpo Estriado (Caudado & Putâmen)
			var striatum_mesh = CylinderMesh.new()
			striatum_mesh.top_radius = data["radius"] * 0.6
			striatum_mesh.bottom_radius = data["radius"] * 0.3
			striatum_mesh.height = data["radius"] * 1.8
			var mi = MeshInstance3D.new()
			mi.mesh = striatum_mesh
			mi.rotation_degrees = Vector3(30, 20, 0)
			mi.material_override = mat
			node.add_child(mi)
		elif id == 9: # Tálamo Pulvinar
			var pulv_mesh = SphereMesh.new()
			pulv_mesh.radius = data["radius"]
			pulv_mesh.height = data["radius"] * 1.6
			var mi = MeshInstance3D.new()
			mi.mesh = pulv_mesh
			mi.scale = Vector3(0.85, 1.0, 1.3)
			mi.material_override = mat
			node.add_child(mi)
		elif id == 6: # Hipocampo (Corno de Amon)
			var hip_mesh = CapsuleMesh.new()
			hip_mesh.radius = data["radius"] * 0.5
			hip_mesh.height = data["radius"] * 2.2
			var mi = MeshInstance3D.new()
			mi.mesh = hip_mesh
			mi.rotation_degrees = Vector3(15, -35, 10)
			mi.material_override = mat
			node.add_child(mi)
		elif id == 13: # Célula de Betz (Macro representation)
			var soma = SphereMesh.new()
			soma.radius = data["radius"]
			soma.height = data["radius"] * 2.0
			var mi = MeshInstance3D.new()
			mi.mesh = soma
			mi.material_override = mat
			node.add_child(mi)
			
			var axon = MeshInstance3D.new()
			var cyl = CylinderMesh.new()
			cyl.top_radius = data["radius"] * 0.2
			cyl.bottom_radius = data["radius"] * 0.2
			cyl.height = data["radius"] * 4.0
			axon.mesh = cyl
			axon.position = Vector3(0, -data["radius"] * 2.0, 0)
			axon.material_override = mat
			node.add_child(axon)
		elif id == 14: # Fenda Sináptica
			var pre = SphereMesh.new()
			pre.radius = data["radius"] * 0.8
			pre.height = data["radius"] * 1.6
			var mi = MeshInstance3D.new()
			mi.mesh = pre
			mi.material_override = mat
			node.add_child(mi)
			
			var post = MeshInstance3D.new()
			post.mesh = pre
			post.position = Vector3(data["radius"] * 1.5, 0, 0)
			var post_mat = mat.duplicate()
			post_mat.albedo_color = Color(0.95, 0.45, 0.15, 0.95)
			post.material_override = post_mat
			node.add_child(post)
			
			# Vesículas sinápticas ativas
			for i in range(12):
				var v = MeshInstance3D.new()
				var sm = SphereMesh.new()
				sm.radius = data["radius"] * 0.12
				sm.height = data["radius"] * 0.24
				v.mesh = sm
				var vm = StandardMaterial3D.new()
				vm.albedo_color = Color(0.3, 0.95, 0.45, 0.95) if i % 2 == 0 else Color(0.2, 0.75, 1.0, 0.95)
				vm.emission_enabled = true
				vm.emission = vm.albedo_color
				v.material_override = vm
				v.position = Vector3(randf_range(0.1, 0.9) * data["radius"], randf_range(-0.3, 0.3) * data["radius"], randf_range(-0.2, 0.2) * data["radius"])
				node.add_child(v)
				vesicle_nodes.append(v)
		else:
			var mi = MeshInstance3D.new()
			var sphere = SphereMesh.new()
			sphere.radius = data["radius"]
			sphere.height = data["radius"] * 2.0
			mi.mesh = sphere
			mi.material_override = mat
			node.add_child(mi)
			
		node.position = data["center"]
		brain_root.add_child(node)
		proxy_nodes[id] = node

func _create_500_neuron_connectome() -> void:
	# High-performance 500-Neuron 3D Connectome via GPU MultiMeshInstance3D
	connectome_root = Node3D.new()
	connectome_root.name = "Connectome500_Root"
	connectome_root.position = Vector3(-38.0, -14.0, 52.0) # Layer V Motor Area
	
	connectome_multimesh = MultiMeshInstance3D.new()
	connectome_multimesh.name = "MultiMesh_Neurons"
	
	var mm = MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.color_format = MultiMesh.COLOR_8BIT
	mm.instance_count = 500
	
	var soma_mesh = SphereMesh.new()
	soma_mesh.radius = 0.045
	soma_mesh.height = 0.09
	soma_mesh.radial_segments = 12
	soma_mesh.rings = 6
	mm.mesh = soma_mesh
	
	var mat = StandardMaterial3D.new()
	mat.vertex_color_use_as_albedo = true
	mat.roughness = 0.3
	mat.emission_enabled = true
	mat.emission = Color(0.2, 0.9, 0.7)
	mat.emission_energy_multiplier = 0.5
	connectome_multimesh.material_override = mat
	
	# Brainbow color palette
	var brainbow_colors = [
		Color(0.0, 0.95, 1.0),   # Electric Cyan
		Color(0.2, 0.75, 1.0),   # Bioluminescent Blue
		Color(0.1, 0.9, 0.45),   # Confocal GFP Green
		Color(0.9, 0.25, 0.9),   # Magenta Brainbow
		Color(1.0, 0.85, 0.2),   # Amber/Gold
		Color(0.95, 0.4, 0.2)    # Coral Red
	]
	
	var rng = RandomNumberGenerator.new()
	rng.seed = 42
	
	# Distribute 500 neurons in a realistic cortical columnar column (radius ~1.5mm, height ~2.5mm)
	for i in range(500):
		var theta = rng.randf_range(0.0, TAU)
		var rad = sqrt(rng.randf_range(0.0, 1.0)) * 1.8
		var px = cos(theta) * rad
		var pz = sin(theta) * rad
		var py = rng.randf_range(-1.2, 1.2)
		
		var t = Transform3D()
		var rot_y = rng.randf_range(0, TAU)
		var rot_x = rng.randf_range(-0.3, 0.3)
		t = t.rotated(Vector3.UP, rot_y)
		t = t.rotated(Vector3.RIGHT, rot_x)
		var scale_soma = rng.randf_range(0.7, 1.6)
		t = t.scaled(Vector3.ONE * scale_soma)
		t.origin = Vector3(px, py, pz)
		
		mm.set_instance_transform(i, t)
		var col = brainbow_colors[i % brainbow_colors.size()]
		mm.set_instance_color(i, col)
		
	connectome_multimesh.multimesh = mm
	connectome_root.add_child(connectome_multimesh)
	
	# Axon bundles & Synaptic Vesicles group
	axon_lines_group = Node3D.new()
	axon_lines_group.name = "AxonBundles"
	connectome_root.add_child(axon_lines_group)
	
	csf_molecules_group = Node3D.new()
	csf_molecules_group.name = "CsfMolecules"
	connectome_root.add_child(csf_molecules_group)
	
	# Add PrPC and PrPSc molecular nanoparticles in the CSF interstitial space
	for k in range(30):
		var prp = MeshInstance3D.new()
		var s = SphereMesh.new()
		s.radius = 0.015
		s.height = 0.03
		prp.mesh = s
		var pm = StandardMaterial3D.new()
		pm.albedo_color = Color(0.2, 0.9, 0.4) if k % 3 != 0 else Color(1.0, 0.3, 0.1)
		pm.emission_enabled = true
		pm.emission = pm.albedo_color
		prp.material_override = pm
		prp.position = Vector3(rng.randf_range(-1.5, 1.5), rng.randf_range(-1.2, 1.2), rng.randf_range(-1.5, 1.5))
		csf_molecules_group.add_child(prp)
		
	brain_root.add_child(connectome_root)

func _build_quick_jump_ui() -> void:
	for child in search_buttons_container.get_children():
		child.queue_free()
		
	for id in alpha_regions.keys():
		var data: Dictionary = alpha_regions[id]
		var btn = Button.new()
		btn.text = "[%d] %s (%s)" % [data["id"], data["name"], data["acronym"]]
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var target_id: int = data["id"]
		btn.pressed.connect(func(): focus_on_region(target_id))
		search_buttons_container.add_child(btn)

func _setup_disease_ui() -> void:
	cjd_toggle_btn.toggled.connect(func(pressed: bool):
		cjd_active = pressed
		print("[MOZOK] CJD Simulation active: ", cjd_active)
	)
	cjd_speed_slider.value_changed.connect(func(val: float):
		cjd_speed_days_per_sec = val
		cjd_speed_label.text = "%.1f Days/s" % val
	)

func _setup_tour_ui() -> void:
	tour_button.pressed.connect(func(): toggle_guided_tour())
	narrate_button.pressed.connect(func(): narrate_region(active_region_id))

func toggle_guided_tour() -> void:
	is_tour_active = not is_tour_active
	if is_tour_active:
		tour_button.text = "⏸ Pausar Tour Guiado IA"
		tour_step_index = 0
		tour_step_timer = 0.0
		_execute_tour_step(tour_step_index)
	else:
		tour_button.text = "🎬 Iniciar Tour Guiado IA"
		DisplayServer.tts_stop()

func _execute_tour_step(idx: int) -> void:
	if idx >= tour_sequence.size():
		is_tour_active = false
		tour_button.text = "🎬 Iniciar Tour Guiado IA"
		return
	var reg_id = tour_sequence[idx]
	focus_on_region(reg_id)
	narrate_region(reg_id)

func narrate_region(id: int) -> void:
	if not alpha_regions.has(id):
		return
	var reg: Dictionary = alpha_regions[id]
	var speech_text = reg.get("audio_script", reg["name"])
	_speak_tts(speech_text)

# [PT-BR]: Sintese de voz TTS nativa priorizando vozes neurais / Francisca / Natural.
# [EN-GB]: Native TTS voice synthesis prioritising neural / Francisca / Natural voices.
# [AI-CTX]: @llm-context: Queries available system voices prioritizing Natural and Francisca.
func _speak_tts(text: String) -> void:
	DisplayServer.tts_stop()
	var voices = DisplayServer.tts_get_voices_for_language("pt")
	var voice_id = ""
	var best_score = -1
	for v in voices:
		var v_name = v.to_lower()
		var score = 0
		if "natural" in v_name:
			score += 50
		if "francisca" in v_name:
			score += 40
		if "neural" in v_name:
			score += 30
		if "online" in v_name:
			score += 20
		if score > best_score:
			best_score = score
			voice_id = v
	if voice_id == "" and voices.size() > 0:
		voice_id = voices[0]
	DisplayServer.tts_speak(text, voice_id)

func _process(delta: float) -> void:
	phys_time_sec += delta
	var card_pulse = sin(2.0 * PI * HEART_RATE_HZ * phys_time_sec)
	var resp_pulse = sin(2.0 * PI * RESPIRATORY_RATE_HZ * phys_time_sec)
	csf_flow_aqueduct_mm_s = (32.0 + 18.0 * card_pulse + 7.0 * resp_pulse) * glymphatic_aqp4_eff
	
	# 1. Update Whole Brain Shader Material distance uniform
	if cortex_shader_mat:
		cortex_shader_mat.set_shader_parameter("camera_dist_mm", camera_distance_mm)
	
	# 2. Pulsate Ventricles & CSF
	if proxy_nodes.has(12):
		var v_node = proxy_nodes[12]
		var pulse_scale = 1.0 + 0.03 * card_pulse
		var dilation = 1.0 + 0.45 * (1.0 - _get_mean_neuronal_survival())
		v_node.scale = Vector3(pulse_scale, pulse_scale, pulse_scale) * dilation
	
	# 3. Animate 500-Neuron Connectome and Synaptic Vesicles
	if connectome_root:
		# Connectome is vibrantly active when zooming close (< 35 mm)
		connectome_root.visible = (camera_distance_mm < 35.0)
		if connectome_root.visible:
			connectome_multimesh.rotation.y = phys_time_sec * 0.05
			if csf_molecules_group:
				csf_molecules_group.rotation.y = -phys_time_sec * 0.08
				
	for i in range(vesicle_nodes.size()):
		var v = vesicle_nodes[i]
		var t = fmod(phys_time_sec * 3.5 + float(i) * 0.25, 1.0)
		var cleft_dist = 0.0015 * 1.5
		v.position.x = t * cleft_dist
		v.visible = (synaptic_integrity > 0.15)
	
	# 4. CJD Disease Progression
	if cjd_active:
		var sim_days = delta * cjd_speed_days_per_sec
		_step_cjd_simulation(sim_days)
		
	# 5. Tour Timer Progression
	if is_tour_active:
		tour_step_timer += delta
		if tour_step_timer >= 9.0: # 9 seconds per anatomical station
			tour_step_timer = 0.0
			tour_step_index += 1
			_execute_tour_step(tour_step_index)
			
	_update_hud()

func _step_cjd_simulation(dt_days: float) -> void:
	cjd_elapsed_days += dt_days
	
	# Diffusion edges between 14 structures: Thalamus (9) <-> Striatum (8) <-> DLPFC (2) <-> M1 (3) <-> Betz (13) <-> Synapse (14)
	var edges = [
		{"from": 9, "to": 8, "weight": 1.4},
		{"from": 9, "to": 2, "weight": 1.2},
		{"from": 8, "to": 10, "weight": 1.1},
		{"from": 2, "to": 3, "weight": 1.2},
		{"from": 3, "to": 13, "weight": 1.6},
		{"from": 13, "to": 14, "weight": 2.0},
		{"from": 9, "to": 6, "weight": 0.8},
		{"from": 6, "to": 7, "weight": 0.9},
		{"from": 9, "to": 11, "weight": 1.0},
	]
	
	var diff_flux: Dictionary = {}
	for id in cjd_regions.keys():
		diff_flux[id] = 0.0
		
	for edge in edges:
		var u: int = edge["from"]
		var v: int = edge["to"]
		if cjd_regions.has(u) and cjd_regions.has(v):
			var sc_u: float = cjd_regions[u]["prp_sc"]
			var sc_v: float = cjd_regions[v]["prp_sc"]
			var flux = 0.04 * edge["weight"] * (sc_u - sc_v)
			diff_flux[v] += flux
			diff_flux[u] -= flux
			
	var aqp4_clearance = glymphatic_aqp4_eff * 0.012
	var max_prp_sc = 0.0
	var total_prp_sc = 0.0
	
	for id in cjd_regions.keys():
		var node = cjd_regions[id]
		var diff: float = diff_flux[id]
		
		# Autocatalytic conversion: PrP^C + PrP^Sc -> 2 PrP^Sc
		var converted = min(0.08 * node["prp_c"] * node["prp_sc"], node["prp_c"])
		var cleared = node["prp_sc"] * aqp4_clearance
		
		node["prp_c"] = max(0.0, node["prp_c"] - converted * dt_days)
		node["prp_sc"] = clamp(node["prp_sc"] + (converted - cleared + diff) * dt_days, 0.0, 10.0)
		
		node["vacuole_density"] = clamp(node["vacuole_density"] + 0.04 * node["prp_sc"] * dt_days, 0.0, 1.0)
		node["astrogliosis"] = clamp(node["astrogliosis"] + 0.035 * node["prp_sc"] * dt_days, 0.0, 1.0)
		node["neuronal_survival"] = clamp(node["neuronal_survival"] - 0.035 * node["vacuole_density"] * dt_days, 0.0, 1.0)
		
		total_prp_sc += node["prp_sc"]
		max_prp_sc = max(max_prp_sc, node["prp_sc"])
		
		# Visual feedback: update material emission & atrophy
		if proxy_nodes.has(id):
			var p_node = proxy_nodes[id]
			if p_node.get_child_count() > 0:
				var mi = p_node.get_child(0) as MeshInstance3D
				if mi and mi.material_override:
					var mat = mi.material_override as StandardMaterial3D
					if mat and node["prp_sc"] > 0.08:
						var glow_intensity = clamp(node["prp_sc"] * 0.85, 0.0, 3.0)
						mat.emission = Color(0.85, 1.0, 0.2)
						mat.emission_energy_multiplier = 0.3 + glow_intensity
						var atrophy = 1.0 - 0.22 * (1.0 - node["neuronal_survival"])
						p_node.scale = Vector3(atrophy, atrophy, atrophy)
						
	var mean_prp_sc = total_prp_sc / float(cjd_regions.size())
	glymphatic_aqp4_eff = clamp(1.0 - 0.7 * min(mean_prp_sc, 1.0), 0.15, 1.0)
	
	if max_prp_sc > 0.15:
		rt_quic_positive = true
		
	var cell_loss = 1.0 - _get_mean_neuronal_survival()
	protein_14_3_3_ng_ml = 0.4 + 5.0 * cell_loss
	total_tau_pg_ml = 180.0 + 12000.0 * cell_loss
	synaptic_integrity = clamp(1.0 - max_prp_sc * 0.6, 0.0, 1.0)

func _get_mean_neuronal_survival() -> float:
	var total = 0.0
	for id in cjd_regions.keys():
		total += cjd_regions[id]["neuronal_survival"]
	return total / float(cjd_regions.size())

func focus_on_region(id: int) -> void:
	if not alpha_regions.has(id):
		return
	active_region_id = id
	var data: Dictionary = alpha_regions[id]
	camera_target_mni = data["center"]
	camera_distance_mm = data["optimal_dist"]
	_update_camera_transform()
	_update_hud()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_RIGHT:
			is_orbiting = event.pressed
			last_mouse_pos = event.position
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			zoom_logarithmic(1.0)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
			zoom_logarithmic(-1.0)
	elif event is InputEventMouseMotion and is_orbiting:
		var delta: Vector2 = event.position - last_mouse_pos
		last_mouse_pos = event.position
		orbit(delta.x * -0.006, delta.y * -0.006)

func zoom_logarithmic(delta: float) -> void:
	var factor: float = exp(-delta * 0.18)
	camera_distance_mm = clamp(camera_distance_mm * factor, MIN_DISTANCE_MM, MAX_DISTANCE_MM)
	_update_camera_transform()
	_update_hud()

func orbit(delta_yaw: float, delta_pitch: float) -> void:
	camera_yaw_rad += delta_yaw
	var max_pitch: float = deg_to_rad(88.0)
	camera_pitch_rad = clamp(camera_pitch_rad + delta_pitch, -max_pitch, max_pitch)
	_update_camera_transform()
	_update_hud()

func _update_camera_transform() -> void:
	var cos_p: float = cos(camera_pitch_rad)
	var sin_p: float = sin(camera_pitch_rad)
	var cos_y: float = cos(camera_yaw_rad)
	var sin_y: float = sin(camera_yaw_rad)
	
	var dir = Vector3(sin_y * cos_p, sin_p, cos_y * cos_p)
	var world_eye_mni: Vector3 = camera_target_mni + dir * camera_distance_mm
	
	if (world_eye_mni - floating_origin_mni).length() > RECENTER_THRESHOLD_MM:
		floating_origin_mni = world_eye_mni
		recenter_count += 1
		
	brain_root.position = -floating_origin_mni
	camera.position = world_eye_mni - floating_origin_mni
	camera.look_at(camera_target_mni - floating_origin_mni, Vector3.UP)
	
	current_scale = _resolve_scale(camera_distance_mm)
	_update_lod_visibility()

func _resolve_scale(dist_mm: float) -> SpatialScale:
	if dist_mm > 150.0:
		return SpatialScale.MACRO_WHOLE_BRAIN
	elif dist_mm > 45.0:
		return SpatialScale.MACRO_LOBES
	elif dist_mm > 10.0:
		return SpatialScale.MESO_STRUCTURES
	elif dist_mm > 1.0:
		return SpatialScale.MESO_TISSUE
	elif dist_mm > 0.05:
		return SpatialScale.MICRO_NEURONS
	else:
		return SpatialScale.MICRO_SYNAPSES

func _update_lod_visibility() -> void:
	for id in proxy_nodes.keys():
		var node: Node3D = proxy_nodes[id]
		var data: Dictionary = alpha_regions[id]
		node.position = data["center"]
		
		# Continuous visibility:
		# Whole brain is visible at Macro and Meso scales (fades via shader)
		if id == 1:
			node.visible = (camera_distance_mm > 8.0)
		else:
			var s: SpatialScale = data["scale"]
			var visible_tier: bool = false
			match current_scale:
				SpatialScale.MACRO_WHOLE_BRAIN:
					visible_tier = (s == SpatialScale.MACRO_WHOLE_BRAIN or s == SpatialScale.MACRO_LOBES or s == SpatialScale.MESO_STRUCTURES)
				SpatialScale.MACRO_LOBES:
					visible_tier = (s == SpatialScale.MACRO_LOBES or s == SpatialScale.MESO_STRUCTURES)
				SpatialScale.MESO_STRUCTURES:
					visible_tier = (s == SpatialScale.MESO_STRUCTURES or s == SpatialScale.MESO_TISSUE)
				SpatialScale.MESO_TISSUE:
					visible_tier = (s == SpatialScale.MESO_TISSUE or s == SpatialScale.MICRO_NEURONS)
				SpatialScale.MICRO_NEURONS:
					visible_tier = (s == SpatialScale.MICRO_NEURONS or s == SpatialScale.MICRO_SYNAPSES)
				SpatialScale.MICRO_SYNAPSES:
					visible_tier = (s == SpatialScale.MICRO_SYNAPSES or s == SpatialScale.MICRO_NEURONS)
			node.visible = visible_tier

func _update_hud() -> void:
	var dist_str: String = ""
	if camera_distance_mm >= 1.0:
		dist_str = "%.2f mm" % camera_distance_mm
	elif camera_distance_mm >= 0.001:
		dist_str = "%.1f µm" % (camera_distance_mm * 1000.0)
	else:
		dist_str = "%.1f nm" % (camera_distance_mm * 1_000_000.0)
		
	var scale_name: String = ""
	var order_mag: String = ""
	match current_scale:
		SpatialScale.MACRO_WHOLE_BRAIN:
			scale_name = "Whole Organism / Brain"
			order_mag = "10^-1 m"
		SpatialScale.MACRO_LOBES:
			scale_name = "Organ Lobes & Sulci"
			order_mag = "10^-2 m"
		SpatialScale.MESO_STRUCTURES:
			scale_name = "Anatomical Nuclei / Ventricles"
			order_mag = "10^-3 m"
		SpatialScale.MESO_TISSUE:
			scale_name = "Cortical Layers / Tissue"
			order_mag = "10^-4 m"
		SpatialScale.MICRO_NEURONS:
			scale_name = "500-Neuron Connectome (Betz)"
			order_mag = "10^-5 m"
		SpatialScale.MICRO_SYNAPSES:
			scale_name = "Synaptic Cleft / Molecules"
			order_mag = "10^-7 m"
			
	telemetry_label.text = "MOZOK v1.0.0 — Multi-Scale Human Brain & Connectome Explorer\n" \
		+ "Scale Tier: %s (%s)\n" % [scale_name, order_mag] \
		+ "Camera Distance: %s\n" % dist_str \
		+ "MNI152 Target: (%.1f, %.1f, %.1f) mm\n" % [camera_target_mni.x, camera_target_mni.y, camera_target_mni.z] \
		+ "Floating Origin Shifts: %d\n" % recenter_count \
		+ "500 Neurons: MultiMesh GPU Active | 60 FPS"

	var reg = alpha_regions[active_region_id]
	var node_pathology = cjd_regions.get(active_region_id, {})
	var prp_info = ""
	if cjd_active and node_pathology.has("prp_sc"):
		prp_info = " | PrP^Sc: %.2f | Vacúolos: %.1f%% | Sobrevivência: %.1f%%" % [
			node_pathology["prp_sc"],
			node_pathology["vacuole_density"] * 100.0,
			node_pathology["neuronal_survival"] * 100.0
		]
		
	provenance_title.text = "%s [%s] — %s%s" % [reg["name"], reg["acronym"], scale_name, prp_info]
	provenance_details.text = "Função: %s\nCorrelação Clínica: %s\nNeurotransmissor: %s" % [
		reg["function"],
		reg["clinical"],
		reg["neurotransmitter"]
	]
	provenance_doi.text = "Ref: %s | DOI: %s" % [reg["citation"], reg["doi"]]

	var rt_str = "POSITIVO (Príons Amiloides Detectados)" if rt_quic_positive else "NEGATIVO"
	csf_biomarker_label.text = "Tempo Decorrido: Dia %.1f\n" % cjd_elapsed_days \
		+ "Velocidade Líquor Aqueduto: %.1f mm/s\n" % csf_flow_aqueduct_mm_s \
		+ "Eficiência Glinfática AQP4: %.0f%%\n" % (glymphatic_aqp4_eff * 100.0) \
		+ "Proteína 14-3-3: %.2f ng/mL (Normal < 1.0; DCJ > 2.0)\n" % protein_14_3_3_ng_ml \
		+ "Tau Total: %.0f pg/mL (Normal < 300; DCJ > 4000)\n" % total_tau_pg_ml \
		+ "Ensaio RT-QuIC: %s" % rt_str
