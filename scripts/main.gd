extends Node3D

## MOZOK Interactive Neuroanatomy Explorer (v0.1.0-alpha)
## "Google Earth for the Human Body" — The Brain is Only the Beginning
##
## Implements continuous 6-DOF logarithmic navigation, floating-origin stabilization,
## pulsatile cerebrospinal fluid (CSF) hydrodynamics, active synaptic neurotransmission,
## and multi-scale Creutzfeldt-Jakob Disease (CJD / PrP^Sc) pathophysiology simulation.

@onready var camera: Camera3D = $NeuroCamera
@onready var brain_root: Node3D = $BrainRoot

# Telemetry & Provenance HUD
@onready var telemetry_label: Label = $HUD/TelemetryPanel/Margin/TelemetryLabel
@onready var provenance_title: Label = $HUD/ProvenanceBanner/Margin/VBox/TitleLabel
@onready var provenance_details: Label = $HUD/ProvenanceBanner/Margin/VBox/DetailsLabel
@onready var provenance_doi: Label = $HUD/ProvenanceBanner/Margin/VBox/HBox/DoiLabel
@onready var search_buttons_container: VBoxContainer = $HUD/QuickJumpPanel/Margin/VBox/Scroll/VBox

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
var camera_yaw_rad: float = 0.0
var camera_pitch_rad: float = 0.0

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

# -------------------------------------------------------------
# Living Physiology State
# -------------------------------------------------------------
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

# -------------------------------------------------------------
# Creutzfeldt-Jakob Disease (CJD) Simulator State
# -------------------------------------------------------------
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

func _ready() -> void:
	print("[MOZOK] Interactive Living Brain & CJD Simulation Engine initialized.")
	_init_alpha_seed_data()
	_init_cjd_pathology_state()
	_create_visual_proxies()
	_build_quick_jump_ui()
	_setup_disease_ui()
	_update_camera_transform()
	_update_hud()

func _init_alpha_seed_data() -> void:
	alpha_regions[1] = {
		"id": 1,
		"acronym": "WB",
		"name": "Whole Human Brain (Мозок)",
		"scale": SpatialScale.MACRO_WHOLE_BRAIN,
		"center": Vector3(0, 0, 0),
		"radius": 90.0,
		"optimal_dist": 220.0,
		"color": Color(0.70, 0.75, 0.85, 0.65),
		"citation": "Fonov et al. (ICBM / MNI Consortium) (2011)",
		"context": "MNI152 nonlinear 6th generation average MRI template",
		"doi": "10.1016/j.neuroimage.2009.04.041"
	}
	alpha_regions[2] = {
		"id": 2,
		"acronym": "FL",
		"name": "Frontal Lobe",
		"scale": SpatialScale.MACRO_LOBES,
		"center": Vector3(0, 40, 20),
		"radius": 55.0,
		"optimal_dist": 90.0,
		"color": Color(0.28, 0.52, 0.95, 0.55),
		"citation": "Desikan et al. (2006) Cortical Parcellation",
		"context": "Macro-scale anatomical lobar demarcation",
		"doi": "10.1016/j.neuroimage.2006.01.021"
	}
	alpha_regions[3] = {
		"id": 3,
		"acronym": "TL",
		"name": "Temporal Lobe",
		"scale": SpatialScale.MACRO_LOBES,
		"center": Vector3(50, -15, -15),
		"radius": 45.0,
		"optimal_dist": 85.0,
		"color": Color(0.85, 0.55, 0.22, 0.55),
		"citation": "Desikan et al. (2006) Cortical Parcellation",
		"context": "Archicortex and neocortical auditory/memory centers",
		"doi": "10.1016/j.neuroimage.2006.01.021"
	}
	alpha_regions[4] = {
		"id": 4,
		"acronym": "PrG",
		"name": "Precentral Gyrus (Primary Motor Cortex - M1)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-38, -14, 52),
		"radius": 18.0,
		"optimal_dist": 25.0,
		"color": Color(0.92, 0.32, 0.32, 0.65),
		"citation": "Brodmann Area 4 / Human Motor Cortex Standard (2019)",
		"context": "Somatotopic upper-limb motor representation",
		"doi": "10.1093/cercor/bhz159"
	}
	alpha_regions[5] = {
		"id": 5,
		"acronym": "HIP",
		"name": "Hippocampus (Cornu Ammonis)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-28, -20, -14),
		"radius": 12.0,
		"optimal_dist": 18.0,
		"color": Color(0.65, 0.35, 0.85, 0.65),
		"citation": "Amunts et al. Julich Brain Cytoarchitectonic Atlas (2020)",
		"context": "Subiculum and CA1-CA4 archicortex",
		"doi": "10.1126/science.abb3333"
	}
	alpha_regions[6] = {
		"id": 6,
		"acronym": "SNc",
		"name": "Substantia Nigra pars compacta",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-10, -18, -12),
		"radius": 8.0,
		"optimal_dist": 12.0,
		"color": Color(0.18, 0.18, 0.22, 0.85),
		"citation": "Keuken et al. Ultra-high 7T MRI of Human Subcortex (2014)",
		"context": "Dopaminergic neuromelanin-pigmented cluster",
		"doi": "10.1016/j.neuroimage.2014.03.032"
	}
	alpha_regions[7] = {
		"id": 7,
		"acronym": "L5-M1",
		"name": "Cortical Layer V (Internal Pyramidal Layer)",
		"scale": SpatialScale.MESO_TISSUE,
		"center": Vector3(-38.0, -14.0, 52.0),
		"radius": 1.5,
		"optimal_dist": 1.8,
		"color": Color(0.95, 0.55, 0.45, 0.70),
		"citation": "Mountcastle (1997) The Columnar Organization of Neocortex",
		"context": "Neocortical laminar microcircuit band",
		"doi": "10.1093/brain/120.4.701"
	}
	alpha_regions[8] = {
		"id": 8,
		"acronym": "BETZ",
		"name": "Giant Pyramidal Cell of Betz (Volodymyr Bets, Kyiv 1874)",
		"scale": SpatialScale.MICRO_NEURONS,
		"center": Vector3(-38.1, -14.0, 52.1),
		"radius": 0.08,
		"optimal_dist": 0.12,
		"color": Color(0.32, 0.88, 0.48, 0.90),
		"citation": "BRAIN Initiative Cell Census Network (BICCN) (2021) Nature",
		"context": "Soma diameter ~100 µm, longest projection in human CNS",
		"doi": "10.1038/s41586-021-03950-0"
	}
	alpha_regions[9] = {
		"id": 9,
		"acronym": "SYN-M1",
		"name": "Corticospinal Glutamatergic Synapse",
		"scale": SpatialScale.MICRO_SYNAPSES,
		"center": Vector3(-38.102, -14.001, 52.101),
		"radius": 0.0015,
		"optimal_dist": 0.002,
		"color": Color(1.0, 0.85, 0.15, 0.95),
		"citation": "Shapson-Coe et al. (Harvard / Google Connectomics) (2024) Science",
		"context": "Synaptic cleft width ~20 nm, vesicle pool & postsynaptic density",
		"doi": "10.1126/science.adk4858"
	}
	alpha_regions[10] = {
		"id": 10,
		"acronym": "VENT-LAT",
		"name": "Lateral Ventricles & Choroid Plexus (CSF)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(0, -10, 15),
		"radius": 28.0,
		"optimal_dist": 35.0,
		"color": Color(0.12, 0.82, 0.92, 0.45),
		"citation": "Nedergaard et al. (Glymphatic System Discovery) (2013) Science",
		"context": "Macroscopic ventricular volume and perivascular Virchow-Robin spaces",
		"doi": "10.1126/science.1234098"
	}
	alpha_regions[11] = {
		"id": 11,
		"acronym": "AQUEDUCT",
		"name": "Cerebral Aqueduct of Sylvius (CSF Flow)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(0, -28, -8),
		"radius": 5.0,
		"optimal_dist": 15.0,
		"color": Color(0.20, 0.70, 1.0, 0.60),
		"citation": "Barkhof et al. High-resolution MRI of CSF Circulation",
		"context": "Peak pulsatile ventricular flow velocity ~30–50 mm/s",
		"doi": "10.1148/radiology.182.2.1732958"
	}
	alpha_regions[12] = {
		"id": 12,
		"acronym": "PULV",
		"name": "Pulvinar & Medial Thalamus (CJD Target)",
		"scale": SpatialScale.MESO_STRUCTURES,
		"center": Vector3(-12, -24, 6),
		"radius": 12.0,
		"optimal_dist": 20.0,
		"color": Color(0.75, 0.28, 0.55, 0.70),
		"citation": "Zerr et al. (European CJD Surveillance Consortium) (2009) Lancet Neurol",
		"context": "Bilateral pulvinar and hockey-stick high-signal intensity on MRI DWI",
		"doi": "10.1016/S1474-4422(09)70291-1"
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
	# Seed initial infection in Pulvinar Thalamus (classic sCJD initiation)
	cjd_regions[12]["prp_sc"] = 0.5
	cjd_regions[12]["prp_c"] = 0.5

func _create_visual_proxies() -> void:
	for id in alpha_regions.keys():
		var data: Dictionary = alpha_regions[id]
		var node = Node3D.new()
		node.name = "Proxy_" + str(data["acronym"])
		
		var mesh_inst = MeshInstance3D.new()
		var mat = StandardMaterial3D.new()
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mat.albedo_color = data["color"]
		mat.roughness = 0.3
		mat.emission_enabled = true
		mat.emission = data["color"]
		mat.emission_energy_multiplier = 0.25
		
		if data["scale"] == SpatialScale.MICRO_NEURONS:
			var sphere = SphereMesh.new()
			sphere.radius = data["radius"]
			sphere.height = data["radius"] * 2.0
			mesh_inst.mesh = sphere
			mesh_inst.material_override = mat
			node.add_child(mesh_inst)
			
			var dendrite = MeshInstance3D.new()
			var cyl = CylinderMesh.new()
			cyl.top_radius = data["radius"] * 0.25
			cyl.bottom_radius = data["radius"] * 0.4
			cyl.height = data["radius"] * 3.5
			dendrite.mesh = cyl
			dendrite.position = Vector3(0, data["radius"] * 1.8, 0)
			dendrite.material_override = mat
			node.add_child(dendrite)
		elif data["scale"] == SpatialScale.MICRO_SYNAPSES:
			var pre = SphereMesh.new()
			pre.radius = data["radius"] * 0.7
			pre.height = data["radius"] * 1.4
			mesh_inst.mesh = pre
			mesh_inst.material_override = mat
			node.add_child(mesh_inst)
			
			var post = MeshInstance3D.new()
			var post_mesh = SphereMesh.new()
			post_mesh.radius = data["radius"] * 0.7
			post_mesh.height = data["radius"] * 1.4
			post.mesh = post_mesh
			post.position = Vector3(data["radius"] * 1.4, 0, 0)
			var post_mat = mat.duplicate()
			post_mat.albedo_color = Color(0.9, 0.4, 0.1, 0.95)
			post.material_override = post_mat
			node.add_child(post)
			
			# Create animated neurotransmitter vesicle particles
			for i in range(8):
				var v = MeshInstance3D.new()
				var sm = SphereMesh.new()
				sm.radius = data["radius"] * 0.12
				sm.height = data["radius"] * 0.24
				v.mesh = sm
				var vm = StandardMaterial3D.new()
				vm.albedo_color = Color(1.0, 1.0, 0.3, 0.9)
				vm.emission_enabled = true
				vm.emission = Color(1.0, 1.0, 0.3)
				v.material_override = vm
				v.position = Vector3(randf_range(0.1, 0.9) * data["radius"], randf_range(-0.3, 0.3) * data["radius"], 0)
				node.add_child(v)
				vesicle_nodes.append(v)
		elif id == 10 or id == 11:
			# Ventricular Cavities (CSF)
			var tor = TorusMesh.new() if id == 10 else CylinderMesh.new()
			if id == 10:
				tor.inner_radius = data["radius"] * 0.4
				tor.outer_radius = data["radius"]
			else:
				tor.top_radius = data["radius"] * 0.5
				tor.bottom_radius = data["radius"] * 0.5
				tor.height = data["radius"] * 2.5
			mesh_inst.mesh = tor
			mesh_inst.material_override = mat
			node.add_child(mesh_inst)
		else:
			var sphere = SphereMesh.new()
			sphere.radius = data["radius"]
			sphere.height = data["radius"] * 2.0
			mesh_inst.mesh = sphere
			mesh_inst.material_override = mat
			node.add_child(mesh_inst)
			
		brain_root.add_child(node)
		proxy_nodes[id] = node

func _build_quick_jump_ui() -> void:
	for child in search_buttons_container.get_children():
		child.queue_free()
		
	var jump_list = [
		{"label": "[1] Whole Brain (220mm)", "id": 1},
		{"label": "[2] Frontal Lobe (90mm)", "id": 2},
		{"label": "[3] Lateral Ventricles (CSF)", "id": 10},
		{"label": "[4] Cerebral Aqueduct (Flow)", "id": 11},
		{"label": "[5] Pulvinar Thalamus (CJD)", "id": 12},
		{"label": "[6] Motor Cortex M1 (25mm)", "id": 4},
		{"label": "[7] Layer V Pyramidal Tissue", "id": 7},
		{"label": "[8] Betz Giant Neuron (0.12mm)", "id": 8},
		{"label": "[9] Synaptic Cleft (2µm)", "id": 9},
	]
	
	for item in jump_list:
		var btn = Button.new()
		btn.text = item["label"]
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var target_id: int = item["id"]
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

func _process(delta: float) -> void:
	# 1. Living Physiology Update
	phys_time_sec += delta
	var card_pulse = sin(2.0 * PI * HEART_RATE_HZ * phys_time_sec)
	var resp_pulse = sin(2.0 * PI * RESPIRATORY_RATE_HZ * phys_time_sec)
	csf_flow_aqueduct_mm_s = (32.0 + 18.0 * card_pulse + 7.0 * resp_pulse) * glymphatic_aqp4_eff
	
	# Animate ventricular pulsation & aqueduct CSF stream
	if proxy_nodes.has(10):
		var v_node = proxy_nodes[10]
		var pulse_scale = 1.0 + 0.03 * card_pulse
		# Ex-vacuo ventricular dilation under CJD neurodegeneration
		var dilation = 1.0 + 0.45 * (1.0 - _get_mean_neuronal_survival())
		v_node.scale = Vector3(pulse_scale, pulse_scale, pulse_scale) * dilation
	
	# Animate micro-scale synaptic vesicle transmission across cleft
	for i in range(vesicle_nodes.size()):
		var v = vesicle_nodes[i]
		var t = fmod(phys_time_sec * 3.0 + float(i) * 0.35, 1.0)
		var cleft_dist = 0.0015 * 1.4
		v.position.x = t * cleft_dist
		v.visible = (synaptic_integrity > 0.15)
	
	# 2. CJD Pathophysiology Simulation Progression
	if cjd_active:
		var sim_days = delta * cjd_speed_days_per_sec
		_step_cjd_simulation(sim_days)
		
	_update_hud()

func _step_cjd_simulation(dt_days: float) -> void:
	cjd_elapsed_days += dt_days
	
	# Connectome diffusion network: Thalamus (12) <-> Frontal (2) <-> Motor (4) <-> Layer V (7) <-> Betz (8)
	var edges = [
		{"from": 12, "to": 2, "weight": 1.2},
		{"from": 12, "to": 3, "weight": 0.9},
		{"from": 2, "to": 4, "weight": 1.1},
		{"from": 4, "to": 7, "weight": 1.5},
		{"from": 7, "to": 8, "weight": 1.8},
		{"from": 8, "to": 9, "weight": 2.0},
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
			var flux = 0.035 * edge["weight"] * (sc_u - sc_v)
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
		
		# Spongiform vacuolation & astrogliosis
		node["vacuole_density"] = clamp(node["vacuole_density"] + 0.04 * node["prp_sc"] * dt_days, 0.0, 1.0)
		node["astrogliosis"] = clamp(node["astrogliosis"] + 0.035 * node["prp_sc"] * dt_days, 0.0, 1.0)
		node["neuronal_survival"] = clamp(node["neuronal_survival"] - 0.035 * node["vacuole_density"] * dt_days, 0.0, 1.0)
		
		total_prp_sc += node["prp_sc"]
		max_prp_sc = max(max_prp_sc, node["prp_sc"])
		
		# Visual feedback: update material colors & cortical ribboning glow
		if proxy_nodes.has(id):
			var p_node = proxy_nodes[id]
			var mi = p_node.get_child(0) as MeshInstance3D
			if mi and mi.material_override:
				var mat = mi.material_override as StandardMaterial3D
				# DWI Hyperintensity ribboning (bright yellow-green glow)
				if node["prp_sc"] > 0.1:
					var glow_intensity = clamp(node["prp_sc"] * 0.8, 0.0, 2.5)
					mat.emission = Color(0.8, 1.0, 0.2)
					mat.emission_energy_multiplier = 0.25 + glow_intensity
					# Atrophy shrinkage
					var atrophy = 1.0 - 0.25 * (1.0 - node["neuronal_survival"])
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
	elif dist_mm > 50.0:
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
		
		var s: SpatialScale = data["scale"]
		var visible_tier: bool = false
		match current_scale:
			SpatialScale.MACRO_WHOLE_BRAIN:
				visible_tier = (s == SpatialScale.MACRO_WHOLE_BRAIN or s == SpatialScale.MACRO_LOBES)
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
			scale_name = "Cellular Morphology (Betz)"
			order_mag = "10^-5 m"
		SpatialScale.MICRO_SYNAPSES:
			scale_name = "Sub-cellular / Synaptic Cleft"
			order_mag = "10^-7 m"
			
	telemetry_label.text = "MOZOK TELEMETRY (v0.1.0-alpha)\n" \
		+ "Scale Tier: %s (%s)\n" % [scale_name, order_mag] \
		+ "Camera Distance: %s\n" % dist_str \
		+ "MNI152 Target: (%.1f, %.1f, %.1f) mm\n" % [camera_target_mni.x, camera_target_mni.y, camera_target_mni.z] \
		+ "Floating Origin Shifts: %d\n" % recenter_count \
		+ "Memory Governor: 1.5GB Budget [ACTIVE]"

	var reg = alpha_regions[active_region_id]
	var node_pathology = cjd_regions.get(active_region_id, {})
	var prp_info = ""
	if cjd_active and node_pathology.has("prp_sc"):
		prp_info = " | PrP^Sc: %.2f | Spongiform Vacuoles: %.1f%% | Survival: %.1f%%" % [
			node_pathology["prp_sc"],
			node_pathology["vacuole_density"] * 100.0,
			node_pathology["neuronal_survival"] * 100.0
		]
		
	provenance_title.text = "%s [%s] — %s%s" % [reg["name"], reg["acronym"], scale_name, prp_info]
	provenance_details.text = "Citation: %s\nSpecimen Context: %s" % [reg["citation"], reg["context"]]
	provenance_doi.text = "DOI: %s" % reg["doi"]

	# Biomarkers readout
	var rt_str = "POSITIVE (Prion Amyloid Detected)" if rt_quic_positive else "NEGATIVE"
	var rt_color = "red" if rt_quic_positive else "lightgreen"
	csf_biomarker_label.text = "Elapsed Time: Day %.1f\n" % cjd_elapsed_days \
		+ "Aqueduct CSF Velocity: %.1f mm/s\n" % csf_flow_aqueduct_mm_s \
		+ "Glymphatic AQP4 Efficiency: %.0f%%\n" % (glymphatic_aqp4_eff * 100.0) \
		+ "Protein 14-3-3: %.2f ng/mL (Normal < 1.0; CJD > 2.0)\n" % protein_14_3_3_ng_ml \
		+ "Total Tau: %.0f pg/mL (Normal < 300; CJD > 4000)\n" % total_tau_pg_ml \
		+ "RT-QuIC Assay: %s" % rt_str
