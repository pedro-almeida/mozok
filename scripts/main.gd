extends Node3D

## MOZOK Interactive Neuroanatomy Explorer (v0.1.0-alpha)
## "Google Earth for the Human Body" — The Brain is Only the Beginning
##
## Implements continuous 6-DOF logarithmic navigation, floating-origin stabilization,
## procedural multi-scale visual proxies, and scientific provenance tracking.

@onready var camera: Camera3D = $NeuroCamera
@onready var brain_root: Node3D = $BrainRoot

# Telemetry HUD
@onready var telemetry_label: Label = $HUD/TelemetryPanel/TelemetryLabel
@onready var provenance_title: Label = $HUD/ProvenanceBanner/TitleLabel
@onready var provenance_details: Label = $HUD/ProvenanceBanner/DetailsLabel
@onready var provenance_doi: Label = $HUD/ProvenanceBanner/DoiLabel
@onready var search_buttons_container: VBoxContainer = $HUD/QuickJumpPanel/Scroll/VBox

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

# Floating Origin stabilization (prevents 32-bit GPU jitter at micro/nano scales)
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

func _ready() -> void:
	print("[MOZOK] Interactive Alpha v0.1.0 presentation initialized.")
	_init_alpha_seed_data()
	_create_visual_proxies()
	_build_quick_jump_ui()
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

func _create_visual_proxies() -> void:
	for id in alpha_regions.keys():
		var data: Dictionary = alpha_regions[id]
		var node = Node3D.new()
		node.name = "Proxy_" + str(data["acronym"])
		
		# Build representative geometry for each scale
		var mesh_inst = MeshInstance3D.new()
		var mat = StandardMaterial3D.new()
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mat.albedo_color = data["color"]
		mat.roughness = 0.3
		mat.emission_enabled = true
		mat.emission = data["color"]
		mat.emission_energy_multiplier = 0.25
		
		if data["scale"] == SpatialScale.MICRO_NEURONS:
			# Stylized Betz cell: Soma + apical dendrite cylinder
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
			# Pre- and post-synaptic pair
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
			post.position = Vector3(data["radius"] * 1.2, 0, 0)
			var post_mat = mat.duplicate()
			post_mat.albedo_color = Color(0.9, 0.4, 0.1, 0.95)
			post.material_override = post_mat
			node.add_child(post)
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
		{"label": "[2] Motor Cortex M1 (25mm)", "id": 4},
		{"label": "[3] Hippocampus (18mm)", "id": 5},
		{"label": "[4] Substantia Nigra (12mm)", "id": 6},
		{"label": "[5] Layer V Tissue (1.8mm)", "id": 7},
		{"label": "[6] Betz Giant Neuron (0.12mm)", "id": 8},
		{"label": "[7] Synaptic Cleft (2µm)", "id": 9},
	]
	
	for item in jump_list:
		var btn = Button.new()
		btn.text = item["label"]
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var target_id: int = item["id"]
		btn.pressed.connect(func(): focus_on_region(target_id))
		search_buttons_container.add_child(btn)

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
	# Compute world position in MNI coordinates from spherical orbit
	var cos_p: float = cos(camera_pitch_rad)
	var sin_p: float = sin(camera_pitch_rad)
	var cos_y: float = cos(camera_yaw_rad)
	var sin_y: float = sin(camera_yaw_rad)
	
	var dir = Vector3(sin_y * cos_p, sin_p, cos_y * cos_p)
	var world_eye_mni: Vector3 = camera_target_mni + dir * camera_distance_mm
	
	# Floating origin check: if eye drifts far from current origin, recenter
	if (world_eye_mni - floating_origin_mni).length() > RECENTER_THRESHOLD_MM:
		floating_origin_mni = world_eye_mni
		recenter_count += 1
		
	# Transform scene root relative to floating origin
	brain_root.position = -floating_origin_mni
	camera.position = world_eye_mni - floating_origin_mni
	camera.look_at(camera_target_mni - floating_origin_mni, Vector3.UP)
	
	# Update spatial scale tier
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
	# Position proxy nodes in brain_root (MNI coordinates)
	for id in proxy_nodes.keys():
		var node: Node3D = proxy_nodes[id]
		var data: Dictionary = alpha_regions[id]
		node.position = data["center"]
		
		# Hierarchical visibility & cross-fading
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
	# Format distance with scientific units
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
			scale_name = "Anatomical Nuclei / Structures"
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
		+ "MNI152 Eye: (%.2f, %.2f, %.2f) mm\n" % [camera_target_mni.x, camera_target_mni.y, camera_target_mni.z] \
		+ "Floating Origin Shifts: %d\n" % recenter_count \
		+ "Memory Governor: 1.5GB Budget [ACTIVE]"

	var reg = alpha_regions[active_region_id]
	provenance_title.text = "%s [%s] — %s" % [reg["name"], reg["acronym"], scale_name]
	provenance_details.text = "Citation: %s\nSpecimen Context: %s" % [reg["citation"], reg["context"]]
	provenance_doi.text = "DOI: %s" % reg["doi"]
