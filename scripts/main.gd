extends Node3D

## MOZOK Root Presentation Controller
## Responsible for orchestrating scene setup, camera updates,
## and delegating data-plane events to/from GDExtension or fallback state.

@onready var camera: Camera3D = $NeuroCamera
@onready var brain_root: Node3D = $BrainRoot
@onready var status_label: Label = $HUD/ScaleOverlay/StatusLabel

# Scale tracking for continuous hierarchical visualization
enum SpatialScale {
	MACRO_WHOLE_BRAIN,
	MACRO_LOBES,
	MESO_STRUCTURES,
	MESO_TISSUE_COLUMNS,
	MICRO_NEURONS,
	MICRO_SYNAPSES
}

var current_scale: SpatialScale = SpatialScale.MACRO_WHOLE_BRAIN

func _ready() -> void:
	print("[MOZOK] Presentation layer initialized.")
	_update_hud_display()

func _process(_delta: float) -> void:
	# Keep presentation layer decoupled: camera distance informs scale bracket
	var dist: float = camera.position.length()
	var new_scale: SpatialScale = _compute_scale_from_distance(dist)
	if new_scale != current_scale:
		current_scale = new_scale
		_update_hud_display()

func _compute_scale_from_distance(distance_mm: float) -> SpatialScale:
	if distance_mm > 150.0:
		return SpatialScale.MACRO_WHOLE_BRAIN
	elif distance_mm > 50.0:
		return SpatialScale.MACRO_LOBES
	elif distance_mm > 10.0:
		return SpatialScale.MESO_STRUCTURES
	elif distance_mm > 1.0:
		return SpatialScale.MESO_TISSUE_COLUMNS
	elif distance_mm > 0.05:
		return SpatialScale.MICRO_NEURONS
	else:
		return SpatialScale.MICRO_SYNAPSES

func _update_hud_display() -> void:
	var scale_name: String = ""
	match current_scale:
		SpatialScale.MACRO_WHOLE_BRAIN:
			scale_name = "Whole Brain (10^-1 m)"
		SpatialScale.MACRO_LOBES:
			scale_name = "Lobes & Sulci (10^-2 m)"
		SpatialScale.MESO_STRUCTURES:
			scale_name = "Anatomical Nuclei (10^-3 m)"
		SpatialScale.MESO_TISSUE_COLUMNS:
			scale_name = "Cortical Columns (10^-4 m)"
		SpatialScale.MICRO_NEURONS:
			scale_name = "Neuronal Arbors (10^-5 m)"
		SpatialScale.MICRO_SYNAPSES:
			scale_name = "Synaptic Junctions (10^-7 m)"
	
	status_label.text = "MOZOK | Level: %s | Cam Dist: %.2f mm" % [scale_name, camera.position.length()]
