/**
 * ============================================================================
 * MOZOK v1.0 BETA — MOTOR 3D DE ANATOMIA REAL DO SNC & SNP (MNI152 + MEDULA + SNP)
 * ============================================================================
 * [PT-BR]: Renderizador neuroanatômico de alta precisão com:
 *          1. Córtex Cerebral Real MNI152 (32.768 triângulos) com micro-sulcos dFdx/dFdy e rede pial.
 *          2. Cerebelo Anatômico Hiper-Detalhado (144x104) com Folia 3D reais nos vértices,
 *             Vérmis Mediano, Fissuras Primária/Horizontal/Posterolateral, Tonsilas e Arbor Vitae interna.
 *          3. Diencéfalo, Sistema Límbico, Gânglios da Base e Sistema Ventricular 3D.
 *          4. Tronco Encefálico (Mesencéfalo, Ponte, Bulbo) e Medula Espinhal (C1–Co1) com
 *             Ligamentos Denticulados, Artéria Espinhal Anterior, H Medular 3D, Raízes e Gânglios DRG.
 *          5. Sistema Nervoso Periférico (SNP): Cadeia Simpática, Plexo Cervical/Frênico,
 *             Plexo Braquial, Nervos Intercostais, Plexo Lombossacral/Nervo Isquiático e Nervo Vago.
 *          6. Isolamento Cirúrgico 360° (isolatePiece) com centralização Box3 exata para todas as 31 peças.
 * ============================================================================
 */

(function (window) {
  'use strict';

  const EXTRA_ANATOMY_REGIONS = [
    {
      id: 27,
      code: 'PNS_CERVICAL_PHRENIC',
      estrutura: 'Plexo Cervical e Nervo Frênico (C1–C5)',
      name: 'Plexo Cervical e Nervo Frênico (C1–C5)',
      latinName: 'Plexus Cervicalis et Nervus Phrenicus',
      uberonId: 'UBERON:0001813',
      categoria: 'SNP — PLEXOS E NERVOS',
      category: 'SNP — PLEXOS E NERVOS',
      escala: 'Macro SNP (C1–C5)',
      tier: 'MACRO',
      coordenadas: [1.65, -7.20, -1.10],
      center: [1.65, -7.20, -1.10],
      optimalDist: 10.5,
      radius: 1.8,
      color: '#fde047',
      descricao: 'Rede anastomótica das raízes ventrais de C1 a C4 e origem do Nervo Frênico (C3–C5), responsável pelo comando motor vital do músculo diafragma.',
      funcoes: [
        'Inervação motora diafragmática via Nervo Frênico (C3, C4, C5)',
        'Sensibilidade proprioceptiva do pescoço, nuca e ombro superior',
        'Alça cervical (C1–C3) para os músculos infra-hióideos da deglutição e fonação'
      ],
      neurotransmissores: ['Acetilcolina (Junção Neuromuscular)', 'Glutamato (Aferências Sensitivas)'],
      doencas: ['Paralisia Diafragmática por Lesão Medular Alta (C1–C3)', 'Nevralgia Occipital', 'Soluço Intratável'],
      doi: '10.1016/B978-0-7020-5230-9.00028-4',
      audioScript: 'Plexo Cervical e Nervo Frênico (C1 a C5). Emerge das raízes cervicais superiores e origina o nervo frênico, que desce pelo mediastino para comandar a contração do diafragma e sustentar a ventilação pulmonar.'
    },
    {
      id: 28,
      code: 'PNS_BRACHIAL_PLEXUS',
      estrutura: 'Plexo Braquial (C5–T1) — Nervos Mediano, Ulnar e Radial',
      name: 'Plexo Braquial (C5–T1) — Nervos Mediano, Ulnar e Radial',
      latinName: 'Plexus Brachialis (C5–T1)',
      uberonId: 'UBERON:0001814',
      categoria: 'SNP — PLEXOS E NERVOS',
      category: 'SNP — PLEXOS E NERVOS',
      escala: 'Macro SNP (C5–T1)',
      tier: 'MACRO',
      coordenadas: [2.85, -9.40, -1.15],
      center: [2.85, -9.40, -1.15],
      optimalDist: 12.0,
      radius: 2.4,
      color: '#facc15',
      descricao: 'Complexo nervoso formado pelos ramos ventrais de C5, C6, C7, C8 e T1 organizados em Raízes, Troncos (Superior, Médio, Inferior), Divisões e Fascículos (Lateral, Medial, Posterior).',
      funcoes: [
        'Motricidade fina da mão e dedos (Nervos Mediano e Ulnar)',
        'Extensão do braço, antebraço e punho (Nervo Radial)',
        'Flexão do cotovelo (Nervo Musculocutâneo) e abdução do ombro (Nervo Axilar)'
      ],
      neurotransmissores: ['Acetilcolina', 'Substância P', 'CGRP'],
      doencas: ['Paralisia de Erb-Duchenne (C5–C6)', 'Paralisia de Klumpke (C8–T1)', 'Síndrome do Túnel do Carpo'],
      doi: '10.1056/NEJMra1908681',
      audioScript: 'Plexo Braquial, de C5 a T1. As raízes da intumescência cervical convergem em troncos, divisões e fascículos que originam os nervos mediano, ulnar, radial e musculocutâneo para todo o membro superior.'
    },
    {
      id: 29,
      code: 'PNS_SYMPATHETIC_CHAIN',
      estrutura: 'Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
      name: 'Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
      latinName: 'Truncus Sympathicus et Nervi Intercostales',
      uberonId: 'UBERON:0001809',
      categoria: 'SNP — AUTÔNOMO & TORÁCICO',
      category: 'SNP — AUTÔNOMO & TORÁCICO',
      escala: 'Macro SNP (T1–L2)',
      tier: 'MACRO',
      coordenadas: [1.45, -13.20, -1.10],
      center: [1.45, -13.20, -1.10],
      optimalDist: 13.5,
      radius: 2.5,
      color: '#fb923c',
      descricao: 'Troncos simpáticos paravertebrais bilaterais com gânglios interconectados de base do crânio ao cóccix, recebendo fibras pré-ganglionares tóraco-lombares (T1–L2) e acompanhados pelos 12 pares de nervos intercostais.',
      funcoes: [
        'Resposta autonômica de luta ou fuga (taquicardia, broncodilatação, midríase)',
        'Controle vasomotor arterial sistêmico e sudorese termorreguladora',
        'Motricidade intercostal respiratória e sensibilidade em faixa dos dermátomos torácicos'
      ],
      neurotransmissores: ['Acetilcolina (Pré-ganglionar)', 'Noradrenalina (Pós-ganglionar)', 'Adrenalina'],
      doencas: ['Síndrome de Horner (lesão simpática T1/estrelado)', 'Neuralgia Pós-Herpética Intercostal', 'Disautonomia'],
      doi: '10.1152/physrev.00038.2018',
      audioScript: 'Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais. Os gânglios simpáticos correm ao lado da coluna vertebral distribuindo o tônus adrenérgico visceral, enquanto os nervos intercostais seguem as costelas.'
    },
    {
      id: 31,
      code: 'PNS_LUMBOSACRAL_SCIATIC',
      estrutura: 'Plexo Lombossacral e Nervo Isquiático / Ciático (L1–S4)',
      name: 'Plexo Lombossacral e Nervo Isquiático / Ciático (L1–S4)',
      latinName: 'Plexus Lumbosacralis et Nervus Ischiadicus',
      uberonId: 'UBERON:0001022',
      categoria: 'SNP — PLEXOS E NERVOS',
      category: 'SNP — PLEXOS E NERVOS',
      escala: 'Macro SNP (L1–S4)',
      tier: 'MACRO',
      coordenadas: [2.25, -19.20, -1.30],
      center: [2.25, -19.20, -1.30],
      optimalDist: 13.5,
      radius: 2.8,
      color: '#f59e0b',
      descricao: 'União dos plexos lombar (L1–L4: nervos femoral e obturatório) e sacral (L4–S4), originando o Nervo Isquiático (Ciático) — o mais calibroso nervo do corpo humano, que se divide em Nervo Tibial e Fibular Comum.',
      funcoes: [
        'Locomoção bípede, extensão do joelho (Nervo Femoral) e flexão plantar/dorsiflexão (Nervo Ciático)',
        'Sensibilidade cutânea e proprioceptiva da pelve, coxa, perna e pé',
        'Controle autonômico sacral (S2–S4) dos esfíncteres vesical e entérico'
      ],
      neurotransmissores: ['Acetilcolina', 'Glutamato', 'Óxido Nítrico'],
      doencas: ['Ciatalgia por Hérnia de Disco L4–L5 / L5–S1', 'Síndrome da Cauda Equina', 'Pé Caído (Lesão Fibular)'],
      doi: '10.1056/NEJMcp1413017',
      audioScript: 'Plexo Lombossacral e Nervo Isquiático, de L1 a S4. Desta rede emergem os nervos femoral, obturatório e o calibroso nervo ciático, essencial para a marcha, postura bípede e sensibilidade dos membros inferiores.'
    },
    {
      id: 30,
      code: 'PNS_VAGUS_PARASYMPATHETIC',
      estrutura: 'Nervo Vago (NC X) e Eixo Parassimpático Craniossacral',
      name: 'Nervo Vago (NC X) e Eixo Parassimpático Craniossacral',
      latinName: 'Nervus Vagus [X] et Systema Parasympathicum',
      uberonId: 'UBERON:0001759',
      categoria: 'SNP — PARASSIMPÁTICO',
      category: 'SNP — PARASSIMPÁTICO',
      escala: 'Macro SNP (Bulbo → Vísceras)',
      tier: 'MACRO',
      coordenadas: [1.15, -8.50, -0.45],
      center: [1.15, -8.50, -0.45],
      optimalDist: 12.0,
      radius: 2.2,
      color: '#34d399',
      descricao: 'Décimo par craniano emergindo do sulco pós-olivar do bulbo raquidiano, descendo pelo pescoço, tórax e abdome para fornecer 75% de todas as fibras parassimpáticas do organismo.',
      funcoes: [
        'Redução da frequência cardíaca (bradicardia vagal) e regulação da pressão arterial (barorreflexo)',
        'Estímulo do peristaltismo gastrointestinal e secreção digestiva (Eixo Intestino-Cérebro)',
        'Fonação e deglutição via nervos laríngeos superior e recorrente, além do reflexo anti-inflamatório colinérgico'
      ],
      neurotransmissores: ['Acetilcolina (Receptores Muscarínicos M2/M3 e Nicotínicos α7)', 'VIP'],
      doencas: ['Síncope Vasovagal', 'Gastroparesia Vagal', 'Disfonia por Paralisia de Prega Vocal'],
      doi: '10.1038/s41583-018-0003-5',
      audioScript: 'Nervo Vago, décimo par craniano, e o eixo parassimpático. Emerge do bulbo raquidiano e viaja até o coração, pulmões e trato digestivo, promovendo a homeostase de repouso, digestão e modulação vagal.'
    }
  ];

  function getMergedRegions() {
    const base = (window.MOZOK_DATABASE && window.MOZOK_DATABASE.structures) ? window.MOZOK_DATABASE.structures.slice() : [];
    EXTRA_ANATOMY_REGIONS.forEach(extra => {
      if (!base.some(r => r.code === extra.code || r.id === extra.id)) {
        base.push(extra);
      }
    });
    return base;
  }

  class CNSAnatomy3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = 'CNS_Master_Anatomy_MNI152';
      this.scene.add(this.masterGroup);

      this.subcorticalGroup = new THREE.Group();
      this.subcorticalGroup.name = 'Subcortical_Structures_Group';
      this.masterGroup.add(this.subcorticalGroup);

      this.spinalGroup = new THREE.Group();
      this.spinalGroup.name = 'Brainstem_SpinalCord_Group';
      this.masterGroup.add(this.spinalGroup);

      this.pnsGroup = new THREE.Group();
      this.pnsGroup.name = 'Peripheral_Nervous_System_Group';
      this.masterGroup.add(this.pnsGroup);

      this.meningesGroup = new THREE.Group();
      this.meningesGroup.name = 'Meninges_Dissection_Layers';
      this.masterGroup.add(this.meningesGroup);

      this.vascularGroup = new THREE.Group();
      this.vascularGroup.name = 'Cerebrospinal_Vascular_Tree';
      this.masterGroup.add(this.vascularGroup);

      this.markersGroup = new THREE.Group();
      this.markersGroup.name = 'Surgical_3D_Pins_Group';
      this.masterGroup.add(this.markersGroup);

      this.isolatedPieceGroup = new THREE.Group();
      this.isolatedPieceGroup.name = 'Isolated_Anatomical_Piece_3D';
      this.isolatedPieceGroup.visible = false;
      this.scene.add(this.isolatedPieceGroup);

      this.cortexUniforms = null;
      this.cerebellumUniforms = null;
      this.spinalUniforms = null;
      this.csfParticles = null;
      this.pnsPulses = null;

      this.cortexMesh = null;
      this.cerebellumMesh = null;
      this.arborVitaeGroup = null;
      this.subcorticalMeshes = [];
      this.subcorticalMeshMap = {};
      this.spinalMeshes = [];
      this.pnsMeshes = [];
      this.markerMeshes = [];

      this.activeStructureCode = 'WB_CNS';
      this.viewMode = 'external';
      this.isPieceIsolated = false;
      this.time = 0;

      this.buildPhotorealisticMNICortex();
      this.buildDetailedCerebellum();
      this.buildSubcorticalNuclei();
      this.buildContinuousBrainstemAndSpinalCord();
      this.buildPeripheralNervousSystem3D();
      this.buildMeningesLayers();
      this.buildCerebrospinalVascularTree();
      this.buildSurgicalPinMarkers();
      this.buildCSFVentricularFlow();

      if (window.Tractography3D) {
        this.tractography = new window.Tractography3D(this.masterGroup);
      }

      // Inicia no modo 'external' limpo (córtex MNI152 sólido + cerebelo + tronco + medula + SNP, ocultando pinos/tratos internos até o modo Raio-X ou seleção subcortical)
      this.setViewMode('external');
    }

    // =========================================================================
    // 1. CÓRTEX MNI152 REAL COM MICRO-SULCOS (dFdx/dFdy), AO E REDE PIAL
    // =========================================================================
    buildPhotorealisticMNICortex() {
      const meshData = window.REAL_MNI_BRAIN || window.BRAIN_MESH_DATA;
      if (!meshData || !meshData.vertices) return;
      const fFlat = meshData.indices || meshData.faces;
      if (!fFlat) return;

      const isRealMni = !!window.REAL_MNI_BRAIN;
      const vFlat = meshData.vertices;
      const gFlat = meshData.gyrus || null;
      const numVerts = Math.floor(vFlat.length / 3);
      const positions = new Float32Array(numVerts * 3);
      const colors = new Float32Array(numVerts * 3);

      for (let i = 0; i < numVerts; i++) {
        // window.REAL_MNI_BRAIN já está normalizado no espaço MNI da cena (X:[-5.4,5.4], Y:[-5.1,5.1], Z:[-6.9,6.9])
        const vx = isRealMni ? vFlat[i * 3] : (vFlat[i * 3] / 14.5);
        const vy = isRealMni ? vFlat[i * 3 + 1] : (vFlat[i * 3 + 2] / 14.5);
        const vz = isRealMni ? vFlat[i * 3 + 2] : (vFlat[i * 3 + 1] / 14.5);

        positions[i * 3] = vx;
        positions[i * 3 + 1] = vy;
        positions[i * 3 + 2] = vz;

        let sulcalDepth;
        if (gFlat && i < gFlat.length) {
          sulcalDepth = Math.max(0.0, Math.min(1.0, gFlat[i]));
        } else {
          const r = Math.hypot(vx, vy * 1.12, vz * 0.92);
          const foldNoise =
            Math.sin(vx * 5.8 + Math.cos(vz * 5.2)) *
            Math.cos(vy * 5.8 + Math.sin(vx * 4.8)) * 0.5 +
            Math.sin(vx * 13.5 - vz * 12.8) * Math.cos(vy * 13.2) * 0.35;
          sulcalDepth = Math.max(0.0, Math.min(1.0, (r - 3.6) / 1.9 + foldNoise * 0.30));
        }

        colors[i * 3] = 0.56 + 0.36 * sulcalDepth;
        colors[i * 3 + 1] = 0.44 + 0.32 * sulcalDepth;
        colors[i * 3 + 2] = 0.45 + 0.33 * sulcalDepth;
      }

      const indices = (fFlat instanceof Uint32Array) ? fFlat : new Uint32Array(fFlat);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeVertexNormals();

      this.cortexUniforms = {
        uTime: { value: 0.0 },
        uOpacity: { value: 1.0 },
        uHighlightCenter: { value: new THREE.Vector3(0.0, 999.0, 0.0) },
        uHighlightRadius: { value: 0.0 },
        uHighlightColor: { value: new THREE.Color(0x00f2fe) },
        uLesionCenter: { value: new THREE.Vector3(0.0, 999.0, 0.0) },
        uLesionRadius: { value: 0.0 },
        uDiseaseMode: { value: 0 },
        uDiseaseSeverity: { value: 0.0 },
        uCutPlaneY: { value: 999.0 }
      };

      const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying vec3 vObjPos;
        varying vec3 vViewPosition;
        varying vec3 vColor;

        uniform float uTime;
        uniform int uDiseaseMode;
        uniform float uDiseaseSeverity;
        uniform vec3 uHighlightCenter;
        uniform float uHighlightRadius;

        void main() {
          vColor = color;
          vec3 pos = position;

          float g1 = sin(pos.x * 5.6 + cos(pos.z * 5.2)) * cos(pos.y * 5.6 + sin(pos.x * 5.0));
          float g2 = sin(pos.x * 13.0 - pos.z * 12.5) * cos(pos.y * 12.8) * 0.45;
          float g3 = cos(pos.x * 23.0 + pos.y * 21.0 - pos.z * 22.0) * 0.18;
          float sulcalDisp = (g1 + g2 + g3) * 0.025;
          pos += normal * sulcalDisp;

          if (uDiseaseMode == 3 && uDiseaseSeverity > 0.01) {
            float atrophy = 1.0 - (0.14 * uDiseaseSeverity);
            pos *= atrophy;
          }

          if (uHighlightRadius > 0.05) {
            float dH = distance(pos, uHighlightCenter);
            if (dH < uHighlightRadius) {
              float lift = smoothstep(uHighlightRadius, 0.0, dH) * 0.06;
              pos += normal * lift;
            }
          }

          vObjPos = pos;
          vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPosition.xyz;
          vec4 mvPosition = viewMatrix * worldPosition;
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying vec3 vObjPos;
        varying vec3 vViewPosition;
        varying vec3 vColor;

        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uHighlightCenter;
        uniform float uHighlightRadius;
        uniform vec3 uHighlightColor;
        uniform vec3 uLesionCenter;
        uniform float uLesionRadius;
        uniform int uDiseaseMode;
        uniform float uDiseaseSeverity;
        uniform float uCutPlaneY;

        float gyralHeightField(vec3 p) {
          float f1 = sin(p.x * 5.8 + cos(p.z * 5.4)) * cos(p.y * 5.8 + sin(p.x * 5.1));
          float f2 = sin(p.x * 13.5 - p.z * 13.0) * cos(p.y * 13.2) * 0.48;
          float f3 = cos(p.x * 25.0 + p.y * 24.0 - p.z * 23.0) * 0.22;
          return f1 + f2 + f3;
        }

        void main() {
          if (vObjPos.y > uCutPlaneY) discard;

          vec3 viewDir = normalize(vViewPosition);
          float h = gyralHeightField(vObjPos);

          vec3 dPdx = dFdx(vViewPosition);
          vec3 dPdy = dFdy(vViewPosition);
          float dHdx = dFdx(h);
          float dHdy = dFdy(h);
          vec3 surfGrad = normalize(cross(dPdx, vNormal) * dHdy + cross(vNormal, dPdy) * dHdx + vec3(1e-5));
          vec3 normal = normalize(vNormal - surfGrad * 0.24);

          float sulcalFactor = clamp(0.5 + 0.5 * h, 0.0, 1.0);
          vec3 sulcusDark = vec3(0.28, 0.16, 0.18);
          vec3 gyrusCrown = vec3(0.92, 0.77, 0.75);
          vec3 baseTissue = mix(sulcusDark, gyrusCrown, smoothstep(0.12, 0.88, sulcalFactor)) * (0.72 + 0.34 * vColor);

          float vesselWave = abs(sin(vObjPos.x * 16.0 + sin(vObjPos.y * 9.0) * 2.2) * cos(vObjPos.z * 15.0 + cos(vObjPos.x * 8.0) * 2.0));
          float capillaryMask = smoothstep(0.05, 0.0, vesselWave) * (1.0 - sulcalFactor * 0.45);
          baseTissue = mix(baseTissue, vec3(0.76, 0.12, 0.18), capillaryMask * 0.52);

          vec3 lightDir1 = normalize(vec3(0.55, 0.78, 0.65));
          vec3 lightDir2 = normalize(vec3(-0.65, 0.30, -0.50));
          float diff1 = max(dot(normal, lightDir1), 0.0);
          float diff2 = max(dot(normal, lightDir2), 0.0) * 0.38;

          float wrap = max(0.0, (dot(normal, lightDir1) + 0.48) / 1.48);
          vec3 sssColor = vec3(0.96, 0.36, 0.34) * pow(wrap, 2.1) * 0.30;

          vec3 halfVec = normalize(lightDir1 + viewDir);
          float spec = pow(max(dot(normal, halfVec), 0.0), 48.0) * (0.28 + 0.25 * sulcalFactor);
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

          float roiMask = 0.0;
          float roiBorder = 0.0;
          if (uHighlightRadius > 0.05) {
            float distH = distance(vObjPos, uHighlightCenter);
            roiMask = smoothstep(uHighlightRadius, uHighlightRadius * 0.22, distH);
            roiBorder = smoothstep(uHighlightRadius * 1.05, uHighlightRadius * 0.90, distH) *
                        (1.0 - smoothstep(uHighlightRadius * 0.88, uHighlightRadius * 0.72, distH));
          }

          if (roiMask > 0.01) {
            float pulse = 0.78 + 0.22 * sin(uTime * 3.8);
            baseTissue = mix(baseTissue, uHighlightColor * 1.12, roiMask * 0.60 * pulse);
          }
          if (roiBorder > 0.01) {
            baseTissue += uHighlightColor * roiBorder * 1.35;
          }

          if (uDiseaseMode == 1 && uDiseaseSeverity > 0.01) {
            float vNoise = fract(sin(dot(floor(vObjPos * 15.0), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            if (vNoise < 0.34 * uDiseaseSeverity) {
              baseTissue = mix(baseTissue, vec3(0.10, 0.06, 0.14), 0.85);
            }
          }
          if (uLesionRadius > 0.05) {
            float distL = distance(vObjPos, uLesionCenter);
            if (distL < uLesionRadius * 0.58) {
              baseTissue = mix(baseTissue, vec3(0.11, 0.07, 0.09), 0.90);
            } else if (distL < uLesionRadius) {
              float penumbra = 0.5 + 0.5 * sin(uTime * 6.0 - distL * 4.0);
              baseTissue = mix(baseTissue, vec3(0.95, 0.18, 0.12), 0.75 * penumbra);
            }
          }

          vec3 finalColor = baseTissue * (0.34 + 0.72 * diff1 + diff2) + sssColor + vec3(0.95, 0.98, 1.0) * spec;
          if (uOpacity < 0.55) {
            finalColor += vec3(0.0, 0.85, 1.0) * fresnel * 0.62;
          } else {
            finalColor += vec3(0.38, 0.65, 0.95) * fresnel * 0.14;
          }

          float alpha = uOpacity;
          if (uOpacity < 0.5 && roiMask > 0.15) {
            alpha = max(uOpacity, 0.84 * roiMask);
          }

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: this.cortexUniforms,
        vertexShader,
        fragmentShader,
        extensions: { derivatives: true },
        vertexColors: true,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true
      });

      this.cortexMesh = new THREE.Mesh(geometry, material);
      this.cortexMesh.name = 'MNI152_Real_Cortex';
      this.masterGroup.add(this.cortexMesh);
    }

    // =========================================================================
    // 2. CEREBELO ANATÔMICO HIPER-DETALHADO (FOLIA 3D REAIS + ARBOR VITAE)
    // =========================================================================
    buildDetailedCerebellum() {
      this.cerebellumUniforms = {
        uTime: { value: 0.0 },
        uOpacity: { value: 1.0 },
        uHighlight: { value: 0.0 }
      };

      // Malha única esculpida de altíssima resolução (144 x 104) com Vérmis Mediano,
      // Hemisférios Cerebelares Bilaterais, Fissuras Primária/Horizontal/Posterolateral,
      // Lóbulo Floculonodular, Tonsilas e Folia Cerebelares 3D reais deslocadas nos vértices!
      const segU = 144;
      const segV = 104;
      const positions = [];
      const indices = [];

      for (let iv = 0; iv <= segV; iv++) {
        const v = iv / segV;
        const phi = v * Math.PI;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        for (let iu = 0; iu <= segU; iu++) {
          const u = iu / segU;
          const theta = u * Math.PI * 2.0;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          // Base esférica unitária
          let nx = sinPhi * cosT;
          let ny = cosPhi;
          let nz = sinPhi * sinT;

          // Escala anatômica do cerebelo humano (transversal largo, achatado verticalmente)
          let x = nx * 3.15;
          let y = ny * 1.55;
          let z = nz * 2.05;

          const absX = Math.abs(x);
          const normLat = Math.min(1.0, absX / 3.15);

          // 1. Vérmis Mediano (faixa central canelada entre os dois hemisférios) e Valécula do Cerebelo
          const vermisZone = Math.exp(-Math.pow(absX / 0.52, 2.0));
          const paravermisGroove = Math.exp(-Math.pow((absX - 0.62) / 0.22, 2.0));

          // Incisura cerebelar posterior (valécula na face posterior) e incisura anterior (abraçando a ponte/quarto ventrículo)
          if (nz < 0.0) {
            z += vermisZone * 0.42 * Math.abs(nz); // Incisura posterior
          } else {
            // Incisura cerebelar anterior larga que abraça o tronco encefálico dorsalmente
            const antNotch = Math.exp(-Math.pow(absX / 1.45, 2.0)) * Math.max(0.0, nz);
            z -= antNotch * 0.78;
          }

          // Sulcos paravermianos delimitando o vérmis mediano
          const rScale = 1.0 - 0.11 * paravermisGroove + 0.05 * vermisZone * (ny > 0 ? 1.0 : -0.4);
          x *= rScale;
          y *= rScale;

          // Curvatura natural dos hemisférios cerebelares (formato reniforme/bilobado)
          y -= Math.pow(normLat, 1.8) * 0.22;
          z -= Math.pow(normLat, 2.2) * 0.18;

          // 2. Grandes Fissuras Anatômicas do Cerebelo:
          // - Fissura Primária (separa lobo anterior e posterior na face superior)
          const primaryFissureDist = Math.abs(ny - 0.38 - 0.12 * nz);
          const primaryFissure = (nz < 0.4) ? Math.exp(-Math.pow(primaryFissureDist / 0.065, 2.0)) * 0.16 : 0.0;

          // - Fissura Horizontal (grande fenda contornando a margem póstero-lateral)
          const horizFissureDist = Math.abs(ny + 0.06);
          const horizFissure = (nz < 0.25) ? Math.exp(-Math.pow(horizFissureDist / 0.055, 2.0)) * 0.20 : 0.0;

          // - Fissura Posterolateral (separa o lobo posterior do lóbulo floculonodular inferiormente)
          const postLatDist = Math.abs(ny + 0.56 - 0.15 * nz);
          const postLatFissure = (nz > -0.2) ? Math.exp(-Math.pow(postLatDist / 0.06, 2.0)) * 0.15 : 0.0;

          // 3. Tonsilas Cerebelares (proeminências inferiores mediais junto ao bulbo) e Flóculo
          const tonsilZone = Math.exp(-Math.pow((absX - 0.85) / 0.42, 2.0)) *
                             Math.exp(-Math.pow((ny + 0.72) / 0.25, 2.0)) *
                             Math.exp(-Math.pow((nz - 0.22) / 0.35, 2.0));

          // 4. Folia Cerebelares 3D (Lamelas Transversais Paralelas Esculpidas nos Vértices!)
          // As folhas cerebelares curvam-se suavemente acompanhando a geometria de cada lóbulo
          const foliaCoord = y * 29.5 + z * 5.2 * ny - 0.28 * Math.sin(absX * 2.2);
          const foliaWave = Math.sin(foliaCoord);
          // Perfil de crista arredondada (giro folhar) e sulco agudo (fissura intralaminar)
          const foliaRidge = Math.sign(foliaWave) * Math.pow(Math.abs(foliaWave), 0.65) * 0.055;
          const microFolia = Math.sin(foliaCoord * 2.0) * 0.015;

          const totalDisplacement = foliaRidge + microFolia - primaryFissure - horizFissure - postLatFissure + tonsilZone * 0.18;

          const lenN = Math.hypot(nx, ny, nz) || 1.0;
          x += (nx / lenN) * totalDisplacement;
          y += (ny / lenN) * totalDisplacement;
          z += (nz / lenN) * totalDisplacement;

          // Posicionamento anatômico exato na fossa craniana posterior (abaixo do tentório e atrás da ponte/bulbo)
          positions.push(x, y - 3.95, z - 2.38);
        }
      }

      for (let iv = 0; iv < segV; iv++) {
        for (let iu = 0; iu < segU; iu++) {
          const a = iv * (segU + 1) + iu;
          const b = a + 1;
          const c = (iv + 1) * (segU + 1) + iu;
          const d = c + 1;
          indices.push(a, b, d);
          indices.push(a, d, c);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vObjPos;
        varying vec3 vViewPos;
        void main() {
          vObjPos = position;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPos.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPos;
        }
      `;

      const fragmentShader = `
                varying vec3 vNormal;
        varying vec3 vObjPos;
        varying vec3 vViewPos;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uHighlight;

        void main() {
          vec3 viewDir = normalize(vViewPos);
          vec3 lightDir1 = normalize(vec3(0.45, 0.72, 0.62));
          vec3 lightDir2 = normalize(vec3(-0.55, -0.35, -0.65));

          // Coordenada laminar de alta frequência das Folia Cerebelares
          float absX = abs(vObjPos.x);
          float foliaPhase = (vObjPos.y + 3.95) * 29.5 + (vObjPos.z + 2.38) * 3.8 - 0.28 * sin(absX * 2.2);
          float foliaPattern = 0.5 + 0.5 * sin(foliaPhase);
          float deepSulcus = smoothstep(0.05, 0.65, foliaPattern);

          // Perturbação micro-normal adicional para nitidez cirúrgica de cada folha
          vec3 dPdx = dFdx(vViewPos);
          vec3 dPdy = dFdy(vViewPos);
          float dFdxVal = dFdx(foliaPattern);
          float dFdyVal = dFdy(foliaPattern);
          vec3 grad = normalize(cross(dPdx, vNormal) * dFdyVal + cross(vNormal, dPdy) * dFdxVal + vec3(1e-5));
          vec3 norm = normalize(vNormal - grad * 0.22);

          float diff1 = max(dot(norm, lightDir1), 0.0);
          float diff2 = max(dot(norm, lightDir2), 0.0) * 0.38;

          // Coloração histológica real do córtex cerebelar (camada molecular rosada-acinzentada vs sulcos escuros)
          vec3 sulcusCol = vec3(0.30, 0.16, 0.18);
          vec3 crownCol = vec3(0.86, 0.66, 0.64);
          vec3 vermisTint = vec3(0.90, 0.72, 0.68);
          float isVermis = exp(-pow(absX / 0.55, 2.0));
          vec3 col = mix(sulcusCol, mix(crownCol, vermisTint, isVermis * 0.45), deepSulcus);

          if (uHighlight > 0.05) {
            float pulse = 0.75 + 0.25 * sin(uTime * 4.0);
            col = mix(col, vec3(0.0, 0.92, 1.0), 0.55 * uHighlight * pulse);
          }

          vec3 halfV = normalize(lightDir1 + viewDir);
          float spec = pow(max(dot(norm, halfV), 0.0), 38.0) * 0.26 * deepSulcus;
          float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 2.8);

          vec3 finalCol = col * (0.34 + 0.68 * diff1 + diff2) + vec3(1.0, 0.95, 0.95) * spec;
          if (uOpacity < 0.55) {
            finalCol += vec3(0.0, 0.85, 1.0) * fresnel * 0.55;
          }

          gl_FragColor = vec4(finalCol, uOpacity);
        }
      `;

      const mat = new THREE.ShaderMaterial({
        uniforms: this.cerebellumUniforms,
        vertexShader,
        fragmentShader,
        extensions: { derivatives: true },
        transparent: true,
        side: THREE.DoubleSide
      });

      this.cerebellumMesh = new THREE.Mesh(geometry, mat);
      this.cerebellumMesh.name = 'Cerebellum_Folia_3D';
      this.masterGroup.add(this.cerebellumMesh);

      // 5. ARBOR VITAE (Árvore da Vida de Substância Branca + Núcleo Denteado) no interior do Cerebelo
      this.arborVitaeGroup = new THREE.Group();
      this.arborVitaeGroup.name = 'Cerebellum_Arbor_Vitae';
      const arborMat = new THREE.MeshPhysicalMaterial({
        color: 0xfef3c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.18,
        roughness: 0.35,
        transparent: true,
        opacity: 0.92
      });
      const dentateMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.32,
        roughness: 0.3
      });

      [-1.35, 0.0, 1.35].forEach((xPlane, idx) => {
        const scaleBr = idx === 1 ? 0.85 : 1.0;
        const centerCorpus = new THREE.Vector3(xPlane, -3.95, -2.05);
        // Corpo medular central do cerebelo
        const coreGeo = new THREE.SphereGeometry(0.32 * scaleBr, 18, 14);
        coreGeo.scale(1.2, 0.75, 1.1);
        const coreMesh = new THREE.Mesh(coreGeo, arborMat);
        coreMesh.position.copy(centerCorpus);
        this.arborVitaeGroup.add(coreMesh);

        // 8 ramos foliares primários e secundários formando a Árvore da Vida
        const branchAngles = [-1.15, -0.75, -0.35, 0.05, 0.45, 0.85, 1.25, 1.65];
        branchAngles.forEach(ang => {
          const bLen = (0.85 + 0.25 * Math.cos(ang)) * scaleBr;
          const p0 = centerCorpus.clone();
          const p1 = new THREE.Vector3(
            xPlane,
            -3.95 + Math.sin(ang) * bLen * 0.55,
            -2.05 - Math.cos(ang) * bLen * 0.55
          );
          const p2 = new THREE.Vector3(
            xPlane + (xPlane === 0 ? 0 : Math.sign(xPlane) * 0.22),
            -3.95 + Math.sin(ang) * bLen,
            -2.05 - Math.cos(ang) * bLen
          );
          const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
          const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.055 * scaleBr, 8, false), arborMat);
          this.arborVitaeGroup.add(tube);

          // Ramificações secundárias (folia brancas)
          [-0.28, 0.28].forEach(subAng => {
            const pSub = new THREE.Vector3(
              p2.x,
              p2.y + Math.sin(ang + subAng) * 0.36 * scaleBr,
              p2.z - Math.cos(ang + subAng) * 0.36 * scaleBr
            );
            const subCurve = new THREE.CatmullRomCurve3([p1, p2, pSub]);
            const subTube = new THREE.Mesh(new THREE.TubeGeometry(subCurve, 8, 0.032 * scaleBr, 6, false), arborMat);
            this.arborVitaeGroup.add(subTube);
          });
        });

        // Núcleo Denteado (folha pregueada profunda em cada hemisfério)
        if (xPlane !== 0) {
          const dentGeo = new THREE.TorusGeometry(0.24, 0.065, 12, 24, Math.PI * 1.65);
          const dentMesh = new THREE.Mesh(dentGeo, dentateMat);
          dentMesh.position.set(xPlane * 0.82, -3.95, -2.02);
          dentMesh.rotation.y = Math.PI * 0.5;
          this.arborVitaeGroup.add(dentMesh);
        }
      });

      this.subcorticalGroup.add(this.arborVitaeGroup);
    }

    // =========================================================================
    // 3. NÚCLEOS SUBCORTICAIS, SISTEMA LÍMBICO E VENTRÍCULOS
    // =========================================================================
    buildSubcorticalNuclei() {
      const createOrganicMat = (hexColor, opacity = 0.90, emissiveHex = 0x000000) => {
        return new THREE.MeshPhysicalMaterial({
          color: hexColor,
          emissive: emissiveHex,
          emissiveIntensity: 0.25,
          roughness: 0.32,
          metalness: 0.05,
          clearcoat: 0.45,
          transparent: true,
          opacity: opacity
        });
      };

      const registerSubMesh = (codes, mesh, ids) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];
        mesh.userData = {
          structureCode: codeList[0],
          structureCodes: codeList,
          structureId: idList[0] || null,
          structureIds: idList,
          baseEmissive: (mesh.material && mesh.material.emissive) ? mesh.material.emissive.getHex() : 0x000000
        };
        this.subcorticalGroup.add(mesh);
        this.subcorticalMeshes.push(mesh);
        codeList.forEach(c => {
          if (!this.subcorticalMeshMap[c]) this.subcorticalMeshMap[c] = [];
          this.subcorticalMeshMap[c].push(mesh);
        });
        idList.forEach(id => {
          const idKey = String(id);
          if (!this.subcorticalMeshMap[idKey]) this.subcorticalMeshMap[idKey] = [];
          this.subcorticalMeshMap[idKey].push(mesh);
        });
      };

      // 1. Corpo Caloso (Joelho, Tronco e Esplênio com estrias transversais)
      const ccCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 0.15, 2.35),
        new THREE.Vector3(0.0, 1.25, 1.35),
        new THREE.Vector3(0.0, 1.45, -0.25),
        new THREE.Vector3(0.0, 1.05, -1.85),
        new THREE.Vector3(0.0, 0.35, -2.45)
      ]);
      const ccGeo = new THREE.TubeGeometry(ccCurve, 44, 0.42, 18, false);
      ccGeo.scale(2.8, 0.55, 1.0);
      registerSubMesh('CORPUS_CALLOSUM', new THREE.Mesh(ccGeo, createOrganicMat(0xf8fafc, 0.92, 0x38bdf8)));

      // 2. Tálamo Dorsal Bilateral + Aderência Intertalâmica
      [-0.95, 0.95].forEach(xSign => {
        const thalGeo = new THREE.SphereGeometry(0.86, 32, 24);
        thalGeo.scale(0.82, 0.92, 1.38);
        const thalMesh = new THREE.Mesh(thalGeo, createOrganicMat(0x06b6d4, 0.92, 0x0891b2));
        thalMesh.position.set(xSign, -0.62, -0.58);
        registerSubMesh('THALAMUS', thalMesh);
      });
      const interThal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 1.2, 16),
        createOrganicMat(0x06b6d4, 0.92, 0x0891b2)
      );
      interThal.rotation.z = Math.PI * 0.5;
      interThal.position.set(0, -0.60, -0.50);
      registerSubMesh('THALAMUS', interThal);

      // 3. Hipotálamo, Infundíbulo e Hipófise (Pituitária)
      const hypoGeo = new THREE.SphereGeometry(0.54, 24, 20);
      hypoGeo.scale(0.9, 0.85, 1.05);
      const hypoMesh = new THREE.Mesh(hypoGeo, createOrganicMat(0x22d3ee, 0.92, 0x06b6d4));
      hypoMesh.position.set(0.0, -1.48, 0.28);
      registerSubMesh(['HYPOTHALAMUS_PITUITARY', 'HYPOTHALAMUS'], hypoMesh);

      const stalkMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.07, 0.55, 12),
        createOrganicMat(0xf472b6, 0.95, 0xdb2777)
      );
      stalkMesh.position.set(0.0, -1.92, 0.42);
      stalkMesh.rotation.x = 0.25;
      registerSubMesh(['HYPOTHALAMUS_PITUITARY', 'HYPOTHALAMUS'], stalkMesh);

      const pitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 20, 16),
        createOrganicMat(0xf43f5e, 0.95, 0xe11d48)
      );
      pitMesh.scale.set(1.25, 0.85, 1.05);
      pitMesh.position.set(0.0, -2.22, 0.50);
      registerSubMesh(['HYPOTHALAMUS_PITUITARY', 'HYPOTHALAMUS'], pitMesh);

      // 4. Glândula Pineal (Epífise)
      const pinealMesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.42, 18),
        createOrganicMat(0xfbbf24, 0.96, 0xd97706)
      );
      pinealMesh.rotation.x = -Math.PI * 0.5;
      pinealMesh.position.set(0.0, -0.82, -1.78);
      registerSubMesh(['PINEAL_GLAND', 'EPITHALAMUS'], pinealMesh);

      // 5. Hipocampo (Corno de Ammon) + Fórnix Bilateral
      [-1, 1].forEach(side => {
        const hipCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 1.95, -2.18, 0.15),
          new THREE.Vector3(side * 2.38, -1.95, -0.65),
          new THREE.Vector3(side * 2.28, -1.35, -1.48),
          new THREE.Vector3(side * 1.65, -0.55, -1.85),
          new THREE.Vector3(side * 0.72, 0.22, -1.10),
          new THREE.Vector3(side * 0.28, -0.15, 0.12)
        ]);
        const hipGeo = new THREE.TubeGeometry(hipCurve, 42, 0.28, 16, false);
        registerSubMesh('HIPPOCAMPUS', new THREE.Mesh(hipGeo, createOrganicMat(0x10b981, 0.94, 0x059669)));

        // 6. Complexo Amigdaliano (Amígdala)
        const amygGeo = new THREE.SphereGeometry(0.42, 24, 20);
        amygGeo.scale(1.12, 0.88, 1.18);
        const amygMesh = new THREE.Mesh(amygGeo, createOrganicMat(0xf43f5e, 0.94, 0xe11d48));
        amygMesh.position.set(side * 1.95, -2.08, 0.58);
        registerSubMesh('AMYGDALA', amygMesh);

        // 7. Núcleo Caudado (Cabeça, Corpo e Cauda em C) e Putâmen/Globo Pálido
        const caudCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 1.15, 0.35, 1.55),
          new THREE.Vector3(side * 1.42, 1.08, 0.45),
          new THREE.Vector3(side * 1.55, 0.72, -0.88),
          new THREE.Vector3(side * 1.78, -0.35, -1.35)
        ]);
        const caudGeo = new THREE.TubeGeometry(caudCurve, 36, 0.27, 16, false);
        registerSubMesh(['STRIATUM', 'BASAL_GANGLIA'], new THREE.Mesh(caudGeo, createOrganicMat(0x8b5cf6, 0.92, 0x6d28d9)));

        const putGeo = new THREE.SphereGeometry(0.68, 24, 20);
        putGeo.scale(0.58, 0.88, 1.42);
        const putMesh = new THREE.Mesh(putGeo, createOrganicMat(0xa855f7, 0.90, 0x7e22ce));
        putMesh.position.set(side * 1.92, -0.25, 0.32);
        registerSubMesh(['STRIATUM', 'BASAL_GANGLIA'], putMesh, 13);

        // Malha anatômica dedicada para o Globo Pálido (GPi/GPe)
        const gpGeo = new THREE.SphereGeometry(0.50, 22, 18);
        gpGeo.scale(0.52, 0.76, 1.15);
        const gpMesh = new THREE.Mesh(gpGeo, createOrganicMat(0xd97706, 0.94, 0xb45309));
        gpMesh.position.set(side * 1.52, -0.32, 0.20);
        registerSubMesh(['GLOBUS_PALLIDUS', 'BASAL_GANGLIA'], gpMesh, 14);
      });

      // 8. Sistema Ventricular (Ventrículos Laterais, III e IV Ventrículo)
      [-1, 1].forEach(side => {
        const ventCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.68, 0.42, 1.65),
          new THREE.Vector3(side * 0.92, 0.98, 0.25),
          new THREE.Vector3(side * 1.18, 0.45, -1.25),
          new THREE.Vector3(side * 1.55, -0.65, -2.15)
        ]);
        const ventGeo = new THREE.TubeGeometry(ventCurve, 36, 0.30, 16, false);
        registerSubMesh('VENTRICULAR_SYSTEM', new THREE.Mesh(ventGeo, createOrganicMat(0x38bdf8, 0.68, 0x0284c7)));

        // 9. Quiasma Óptico e Tratos Ópticos (NC II)
        const opticCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.95, -1.35, 2.25),
          new THREE.Vector3(0.0, -1.40, 1.45),
          new THREE.Vector3(-side * 1.15, -1.10, 0.15)
        ]);
        const opticGeo = new THREE.TubeGeometry(opticCurve, 20, 0.12, 10, false);
        registerSubMesh('OPTIC_CHIASM', new THREE.Mesh(opticGeo, createOrganicMat(0x38bdf8, 0.95, 0x0284c7)), 18);
      });
    }

    // =========================================================================
    // 4. TRONCO ENCEFÁLICO E MEDULA ESPINHAL CONTÍNUA (C1–Co1 + CAUDA EQUINA)
    // =========================================================================
    buildContinuousBrainstemAndSpinalCord() {
      this.spinalUniforms = {
        uTime: { value: 0.0 },
        uOpacity: { value: 1.0 },
        uHighlightY: { value: 999.0 },
        uHighlightRange: { value: 0.0 }
      };

      const stemMat = new THREE.MeshPhysicalMaterial({
        color: 0xf1d4ce,
        emissive: 0x3b1d22,
        emissiveIntensity: 0.16,
        roughness: 0.36,
        metalness: 0.04,
        clearcoat: 0.35
      });

      const registerSpinalMesh = (codes, mesh, ids) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];
        mesh.userData = {
          structureCode: codeList[0],
          structureCodes: codeList,
          structureId: idList[0] || null,
          structureIds: idList
        };
        this.spinalGroup.add(mesh);
        this.spinalMeshes.push(mesh);
      };

      // 4.1 MESENCÉFALO: Pedúnculos Cerebrais Bilaterais + Teto Mesencefálico (4 Colículos Quadrigêmeos)
      [-0.42, 0.42].forEach(xPed => {
        const pedGeo = new THREE.CylinderGeometry(0.52, 0.46, 1.35, 28, 16);
        pedGeo.scale(1.0, 1.0, 0.88);
        const pedMesh = new THREE.Mesh(pedGeo, stemMat.clone());
        pedMesh.position.set(xPed, -2.42, -0.58);
        pedMesh.rotation.z = xPed > 0 ? -0.14 : 0.14;
        pedMesh.rotation.x = 0.18;
        registerSpinalMesh(['MIDBRAIN_SN', 'BRAINSTEM_MIDBRAIN', 'CRANIAL_NERVES'], pedMesh);
      });

      // Colículos Superiores e Inferiores (Lâmina Quadrigêmea)
      [-0.26, 0.26].forEach(xCol => {
        const supCol = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), stemMat.clone());
        supCol.position.set(xCol, -2.18, -1.18);
        registerSpinalMesh(['MIDBRAIN_SN', 'BRAINSTEM_MIDBRAIN', 'CRANIAL_NERVES'], supCol);

        const infCol = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 14), stemMat.clone());
        infCol.position.set(xCol, -2.55, -1.24);
        registerSpinalMesh(['MIDBRAIN_SN', 'BRAINSTEM_MIDBRAIN', 'CRANIAL_NERVES'], infCol);
      });

      // 4.2 PONTE DE VARÓLIO: Abaulada com Fibras Pontocerebelares Transversais, Sulco Basilar e Pedúnculos Cerebelares Médios
      const ponsGeo = new THREE.SphereGeometry(1.12, 48, 36);
      const pPos = ponsGeo.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        let px = pPos.getX(i) * 1.18;
        let py = pPos.getY(i) * 0.85;
        let pz = pPos.getZ(i) * 0.96;

        // Sulco Basilar mediano anterior (onde repousa a Artéria Basilar)
        if (pz > 0) {
          const basilarGroove = Math.exp(-Math.pow(px / 0.24, 2.0)) * pz;
          pz -= basilarGroove * 0.18;
        }
        // Estrias transversais das fibras pontocerebelares
        const striation = Math.sin(py * 24.0 + Math.cos(px * 4.0) * 0.8) * 0.025;
        pz += striation;

        pPos.setXYZ(i, px, py, pz);
      }
      ponsGeo.computeVertexNormals();
      const ponsMesh = new THREE.Mesh(ponsGeo, stemMat.clone());
      ponsMesh.position.set(0.0, -3.55, -0.78);
      registerSpinalMesh(['PONS_VAROLII', 'BRAINSTEM_PONS', 'CRANIAL_NERVES'], ponsMesh);

      // Pedúnculos Cerebelares Médios conectando a Ponte ao Cerebelo
      [-1, 1].forEach(side => {
        const mcpCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.85, -3.55, -0.82),
          new THREE.Vector3(side * 1.25, -3.72, -1.45),
          new THREE.Vector3(side * 1.48, -3.90, -2.05)
        ]);
        const mcpMesh = new THREE.Mesh(new THREE.TubeGeometry(mcpCurve, 18, 0.36, 16, false), stemMat.clone());
        registerSpinalMesh(['PONS_VAROLII', 'BRAINSTEM_PONS', 'CRANIAL_NERVES'], mcpMesh);
      });

      // 4.3 BULBO RAQUIDIANO (MEDULLA OBLONGATA): Pirâmides Bulbares, Decussação e Olivas Inferiores
      const medGeo = new THREE.CylinderGeometry(0.78, 0.48, 1.55, 42, 28);
      const mPos = medGeo.attributes.position;
      for (let i = 0; i < mPos.count; i++) {
        let mx = mPos.getX(i);
        let my = mPos.getY(i);
        let mz = mPos.getZ(i);

        // Fissura mediana anterior + Pirâmides Bulbares pareadas + Olivas laterais
        if (mz > 0) {
          const antFissure = Math.exp(-Math.pow(mx / 0.08, 2.0)) * 0.14;
          const pyramidBulge = Math.exp(-Math.pow((Math.abs(mx) - 0.22) / 0.16, 2.0)) * 0.12;
          const oliveBulge = (my > -0.25)
            ? Math.exp(-Math.pow((Math.abs(mx) - 0.52) / 0.16, 2.0)) * Math.exp(-Math.pow((my - 0.18) / 0.32, 2.0)) * 0.16
            : 0.0;
          mz = mz - antFissure + pyramidBulge + oliveBulge;
        }
        mPos.setXYZ(i, mx, my, mz);
      }
      medGeo.computeVertexNormals();
      const medullaMesh = new THREE.Mesh(medGeo, stemMat.clone());
      medullaMesh.position.set(0.0, -4.85, -1.02);
      medullaMesh.rotation.x = -0.14;
      registerSpinalMesh(['MEDULLA_OBLONGATA', 'BRAINSTEM_MEDULLA'], medullaMesh, 22);

      // Malhas anatômicas 3D dedicadas para os Nervos Cranianos (CRANIAL_NERVES, ID 23)
      const cnMat = new THREE.MeshPhysicalMaterial({ color: 0x34d399, emissive: 0x059669, emissiveIntensity: 0.35, roughness: 0.32 });
      [-1, 1].forEach(side => {
        // NC III (Oculomotor)
        const nc3Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.18, -2.45, -0.25),
          new THREE.Vector3(side * 0.38, -2.48, 0.45),
          new THREE.Vector3(side * 0.55, -2.35, 1.15)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc3Curve, 12, 0.05, 8, false), cnMat.clone()), 23);

        // NC V (Trigêmeo calibroso na ponte)
        const nc5Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 1.05, -3.45, -0.65),
          new THREE.Vector3(side * 1.55, -3.35, -0.25),
          new THREE.Vector3(side * 1.95, -3.20, 0.25)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc5Curve, 12, 0.075, 8, false), cnMat.clone()), 23);

        // NC VII/VIII (Facial e Vestibulococlear no ângulo pontocerebelar)
        const nc7Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.95, -4.15, -0.85),
          new THREE.Vector3(side * 1.48, -4.20, -0.65),
          new THREE.Vector3(side * 1.85, -4.15, -0.35)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc7Curve, 10, 0.048, 8, false), cnMat.clone()), 23);

        // NC XII (Hipoglosso no bulbo)
        const nc12Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.32, -4.85, -0.82),
          new THREE.Vector3(side * 0.65, -4.92, -0.55),
          new THREE.Vector3(side * 0.95, -4.88, -0.22)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc12Curve, 10, 0.042, 8, false), cnMat.clone()), 23);
      });

      // 4.4 MEDULA ESPINHAL CONTÍNUA (C1 a L2, Y = -5.50 até Y = -20.5)
      // Com Intumescências Cervical (C4–T1) e Lombossacral (L1–S3), Fissura Mediana Anterior e Sulcos
      const cordCurvePts = [
        new THREE.Vector3(0.0, -5.50, -1.12),
        new THREE.Vector3(0.0, -7.20, -1.02), // Lordose cervical
        new THREE.Vector3(0.0, -9.20, -1.10), // Intumescência cervical
        new THREE.Vector3(0.0, -12.80, -1.42), // Cifose torácica
        new THREE.Vector3(0.0, -16.40, -1.26),
        new THREE.Vector3(0.0, -18.60, -1.15), // Intumescência lombossacral
        new THREE.Vector3(0.0, -20.50, -1.24)  // Cone Medular (L1/L2)
      ];
      const cordCurve = new THREE.CatmullRomCurve3(cordCurvePts);
      const tubularSegs = 180;
      const radialSegs = 36;
      const cordGeo = new THREE.TubeGeometry(cordCurve, tubularSegs, 0.38, radialSegs, false);

      const cPos = cordGeo.attributes.position;
      for (let i = 0; i < cPos.count; i++) {
        let vx = cPos.getX(i);
        let vy = cPos.getY(i);
        let vz = cPos.getZ(i);

        const tNorm = Math.max(0.0, Math.min(1.0, (-5.50 - vy) / 15.0));
        const spineCenter = cordCurve.getPointAt(tNorm);

        let dx = vx - spineCenter.x;
        let dz = vz - spineCenter.z;

        // Fator de calibre com intumescência cervical (t ~ 0.22) e lombossacral (t ~ 0.84) + afilamento do Cone Medular
        const cervSwelling = 1.0 + 0.34 * Math.exp(-Math.pow((tNorm - 0.22) / 0.11, 2.0));
        const lumboSwelling = 1.0 + 0.32 * Math.exp(-Math.pow((tNorm - 0.83) / 0.09, 2.0));
        const conusTaper = tNorm > 0.90 ? Math.max(0.08, 1.0 - (tNorm - 0.90) / 0.105) : 1.0;
        const scaleR = Math.max(cervSwelling, lumboSwelling) * conusTaper;

        dx *= scaleR * 1.16; // Medula ligeiramente oval no eixo látero-lateral
        dz *= scaleR * 0.90;

        // Fissura Mediana Anterior profunda e Sulco Mediano Posterior
        const grooveStrength = Math.exp(-Math.pow(dx / (0.075 * scaleR + 0.01), 2.0));
        if (dz > 0) {
          dz -= 0.11 * grooveStrength * scaleR;
        } else {
          dz += 0.065 * grooveStrength * scaleR;
        }

        cPos.setXYZ(i, spineCenter.x + dx, vy, spineCenter.z + dz);
      }
      cordGeo.computeVertexNormals();

      const cordShaderMat = new THREE.ShaderMaterial({
        uniforms: this.spinalUniforms,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vViewPos;
          void main() {
            vObjPos = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vViewPos = -mv.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vObjPos;
          varying vec3 vViewPos;
          uniform float uTime;
          uniform float uOpacity;
          uniform float uHighlightY;
          uniform float uHighlightRange;

          void main() {
            vec3 viewDir = normalize(vViewPos);
            vec3 lightDir = normalize(vec3(0.45, 0.65, 0.72));
            float diff = max(dot(vNormal, lightDir), 0.0);

            // Funículos de substância branca mielinizada com estrias longitudinais e anéis metaméricos
            float longTracts = 0.5 + 0.5 * sin(vObjPos.x * 42.0);
            float segRing = 0.5 + 0.5 * sin(vObjPos.y * 12.8);
            vec3 cordCol = mix(vec3(0.84, 0.75, 0.72), vec3(0.95, 0.89, 0.86), 0.6 * longTracts + 0.4 * segRing);

            // Fissura mediana anterior sombreada + Artéria Espinhal Anterior em vermelho vivo
            float midline = exp(-pow(vObjPos.x / 0.055, 2.0));
            if (vNormal.z > 0.25) {
              cordCol = mix(cordCol, vec3(0.82, 0.12, 0.18), midline * 0.85);
            } else {
              cordCol = mix(cordCol, vec3(0.45, 0.32, 0.34), midline * 0.55);
            }

            // Destaque cirúrgico do segmento selecionado (Cervical, Torácica, Lombossacral)
            if (uHighlightRange > 0.1) {
              float dSeg = abs(vObjPos.y - uHighlightY);
              float hMask = smoothstep(uHighlightRange, uHighlightRange * 0.25, dSeg);
              float pulse = 0.75 + 0.25 * sin(uTime * 4.2);
              cordCol = mix(cordCol, vec3(0.0, 0.95, 1.0), hMask * 0.62 * pulse);
            }

            float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.6);
            vec3 finalCol = cordCol * (0.38 + 0.68 * diff) + vec3(0.25, 0.75, 1.0) * fresnel * 0.20;
            gl_FragColor = vec4(finalCol, uOpacity);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      });

      const cordMesh = new THREE.Mesh(cordGeo, cordShaderMat);
      cordMesh.name = 'Spinal_Cord_Main_3D';
      registerSpinalMesh(['SPINAL_CERVICAL_THORACIC', 'SPINAL_CORD_CERVICAL'], cordMesh);

      // 4.5 H MEDULAR INTERNO 3D (Colunas Cinzentas Dorsais, Ventrais e Intermédio-Laterais)
      const greyHornMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97757,
        emissive: 0x9a3412,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        transparent: true,
        opacity: 0.88
      });
      [-0.14, 0.14].forEach(xHorn => {
        const hornCurve = new THREE.CatmullRomCurve3(
          cordCurvePts.map(pt => new THREE.Vector3(pt.x + xHorn, pt.y, pt.z))
        );
        const hornMesh = new THREE.Mesh(new THREE.TubeGeometry(hornCurve, 80, 0.085, 10, false), greyHornMat);
        registerSpinalMesh(['SPINAL_CERVICAL_THORACIC', 'SPINAL_CORD_THORACIC'], hornMesh);
      });

      // 4.6 31 PARES DE RAÍZES ESPINHAIS (Dorsais e Ventrais), GÂNGLIOS DA RAIZ DORSAL (DRG) E LIGAMENTOS DENTICULADOS
      const rootMat = new THREE.MeshPhysicalMaterial({
        color: 0xfef08a,
        emissive: 0xca8a04,
        emissiveIntensity: 0.22,
        roughness: 0.32
      });
      const drgMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.32,
        roughness: 0.28
      });
      const dentLigMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });

      for (let s = 0; s < 31; s++) {
        const frac = s / 30.0;
        const pt = cordCurve.getPointAt(frac);
        const segCode = s < 20 ? ['SPINAL_CERVICAL_THORACIC', 'SPINAL_CORD_CERVICAL', 'SPINAL_CORD_THORACIC'] : ['SPINAL_LUMBAR_CAUDA', 'SPINAL_CORD_LUMBOSACRAL'];
        const spreadX = 0.72 + 0.25 * Math.sin(frac * Math.PI);
        const dropY = -0.12 - frac * 0.42;

        [-1, 1].forEach(side => {
          // Raiz Dorsal (Sensitiva) + Gânglio da Raiz Dorsal (DRG oval)
          const dorsalCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pt.x + side * 0.22, pt.y + 0.03, pt.z - 0.12),
            new THREE.Vector3(pt.x + side * (spreadX * 0.62), pt.y + dropY * 0.5, pt.z - 0.08),
            new THREE.Vector3(pt.x + side * spreadX, pt.y + dropY, pt.z)
          ]);
          const dorsalRoot = new THREE.Mesh(new THREE.TubeGeometry(dorsalCurve, 8, 0.028, 6, false), rootMat);
          registerSpinalMesh(segCode, dorsalRoot);

          // Raiz Ventral (Motora)
          const ventralCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pt.x + side * 0.20, pt.y - 0.03, pt.z + 0.12),
            new THREE.Vector3(pt.x + side * (spreadX * 0.62), pt.y + dropY * 0.5, pt.z + 0.08),
            new THREE.Vector3(pt.x + side * spreadX, pt.y + dropY, pt.z)
          ]);
          const ventralRoot = new THREE.Mesh(new THREE.TubeGeometry(ventralCurve, 8, 0.026, 6, false), rootMat);
          registerSpinalMesh(segCode, ventralRoot);

          // Gânglio Espinhal da Raiz Dorsal (DRG)
          const drgGeo = new THREE.SphereGeometry(0.068, 12, 10);
          drgGeo.scale(1.35, 0.85, 0.90);
          const drgMesh = new THREE.Mesh(drgGeo, drgMat);
          drgMesh.position.set(pt.x + side * (spreadX * 0.82), pt.y + dropY * 0.78, pt.z - 0.04);
          registerSpinalMesh(segCode, drgMesh);

          // Ligamentos Denticulados (21 pares de extensões triangulares da pia-máter entre as raízes C1–L1)
          if (s < 21) {
            const dentGeo = new THREE.ConeGeometry(0.06, 0.28, 4);
            dentGeo.rotateZ(side * Math.PI * 0.5);
            const dentMesh = new THREE.Mesh(dentGeo, dentLigMat);
            dentMesh.position.set(pt.x + side * 0.36, pt.y - 0.12, pt.z);
            registerSpinalMesh(segCode, dentMesh);
          }
        });
      }

      // 4.7 CAUDA EQUINA (Feixe de 18 Raízes Lombossacrais L2–Co1) e FILUM TERMINALE
      for (let r = 0; r < 18; r++) {
        const side = r % 2 === 0 ? 1 : -1;
        const idx = Math.floor(r / 2);
        const spread = (idx + 1) * 0.12;
        const ceCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.08, -20.10 - idx * 0.06, -1.24),
          new THREE.Vector3(side * (0.24 + spread * 0.55), -21.25 - idx * 0.16, -1.28 + (idx % 3 - 1) * 0.08),
          new THREE.Vector3(side * (0.48 + spread), -22.65 - idx * 0.22, -1.20)
        ]);
        const ceMesh = new THREE.Mesh(new THREE.TubeGeometry(ceCurve, 16, 0.026, 6, false), rootMat);
        registerSpinalMesh(['SPINAL_LUMBAR_CAUDA', 'SPINAL_CORD_LUMBOSACRAL'], ceMesh);
      }

      // Filum Terminale Interno (Pia-máter brilhante descendo no centro da Cauda Equina)
      const filumCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -20.45, -1.24),
        new THREE.Vector3(0.0, -22.20, -1.25),
        new THREE.Vector3(0.0, -23.90, -1.22)
      ]);
      const filumMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 });
      registerSpinalMesh(['SPINAL_LUMBAR_CAUDA', 'SPINAL_CORD_LUMBOSACRAL'], new THREE.Mesh(new THREE.TubeGeometry(filumCurve, 16, 0.032, 8, false), filumMat));
    }

    // =========================================================================
    // 5. SISTEMA NERVOSO PERIFÉRICO 3D (SNP COMPLETO E ANATÔMICO)
    // =========================================================================
    buildPeripheralNervousSystem3D() {
      const makeNerveMat = (hex, emHex) => new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: emHex,
        emissiveIntensity: 0.28,
        roughness: 0.30,
        metalness: 0.06,
        clearcoat: 0.45,
        transparent: true,
        opacity: 0.95
      });

      const matPlexus = makeNerveMat(0xfacc15, 0xca8a04);
      const matSymp = makeNerveMat(0xfb923c, 0xea580c);
      const matVagus = makeNerveMat(0x34d399, 0x059669);

      const addNerve = (code, pts, radius, mat) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, Math.max(16, pts.length * 7), radius, 10, false);
        const mesh = new THREE.Mesh(geo, mat.clone());
        mesh.userData = { structureCode: code };
        this.pnsGroup.add(mesh);
        this.pnsMeshes.push(mesh);
        return mesh;
      };

      [-1, 1].forEach(side => {
        // 5.1 PLEXO CERVICAL (C1–C4) + ALÇA CERVICAL + NERVO FRÊNICO (C3–C5)
        [0, 1, 2, 3].forEach(i => {
          const yRoot = -5.85 - i * 0.42;
          addNerve('PNS_CERVICAL_PHRENIC', [
            new THREE.Vector3(side * 0.65, yRoot, -1.04),
            new THREE.Vector3(side * 1.45, yRoot - 0.25, -0.85),
            new THREE.Vector3(side * 2.05, yRoot - 0.55, -0.55)
          ], 0.036, matPlexus);
        });
        // Nervo Frênico descendo pelo mediastino até a cúpula diafragmática
        addNerve('PNS_CERVICAL_PHRENIC', [
          new THREE.Vector3(side * 1.15, -6.70, -0.95),
          new THREE.Vector3(side * 1.55, -8.80, -0.55),
          new THREE.Vector3(side * 1.72, -11.50, -0.25),
          new THREE.Vector3(side * 1.88, -14.20, 0.15),
          new THREE.Vector3(side * 2.55, -14.65, 0.55)
        ], 0.044, matPlexus);

        // 5.2 PLEXO BRAQUIAL (C5–T1): Raízes → Troncos (Sup/Méd/Inf) → Fascículos → Nervos Mediano, Ulnar, Radial e Musculocutâneo
        const brachRootsY = [-7.75, -8.20, -8.65, -9.10, -9.55];
        brachRootsY.forEach((yR, idx) => {
          addNerve('PNS_BRACHIAL_PLEXUS', [
            new THREE.Vector3(side * 0.78, yR, -1.08),
            new THREE.Vector3(side * 1.85, -8.55 - idx * 0.22, -1.02),
            new THREE.Vector3(side * 2.75, -9.10 - idx * 0.18, -0.92)
          ], 0.050, matPlexus);
        });
        // Anastomose entre Troncos e Fascículos Axilares
        addNerve('PNS_BRACHIAL_PLEXUS', [
          new THREE.Vector3(side * 1.85, -8.55, -1.02),
          new THREE.Vector3(side * 2.45, -9.15, -0.95),
          new THREE.Vector3(side * 1.85, -9.43, -1.02)
        ], 0.042, matPlexus);

        // Nervo Mediano
        addNerve('PNS_BRACHIAL_PLEXUS', [
          new THREE.Vector3(side * 2.75, -9.25, -0.92),
          new THREE.Vector3(side * 3.85, -10.85, -0.65),
          new THREE.Vector3(side * 4.55, -12.90, -0.35),
          new THREE.Vector3(side * 5.05, -14.85, -0.05)
        ], 0.055, matPlexus);
        // Nervo Ulnar
        addNerve('PNS_BRACHIAL_PLEXUS', [
          new THREE.Vector3(side * 2.75, -9.55, -0.96),
          new THREE.Vector3(side * 3.65, -11.20, -0.82),
          new THREE.Vector3(side * 4.25, -13.20, -0.58),
          new THREE.Vector3(side * 4.72, -15.05, -0.25)
        ], 0.048, matPlexus);
        // Nervo Radial
        addNerve('PNS_BRACHIAL_PLEXUS', [
          new THREE.Vector3(side * 2.75, -9.38, -1.08),
          new THREE.Vector3(side * 4.08, -10.60, -1.02),
          new THREE.Vector3(side * 4.82, -12.60, -0.78),
          new THREE.Vector3(side * 5.35, -14.55, -0.45)
        ], 0.052, matPlexus);

        // 5.3 CADEIA GANGLIONAR SIMPÁTICA PARAVERTEBRAL (22 Gânglios Fusiformes por lado + Ramos Comunicantes + 12 Nervos Intercostais)
        const sympPts = [];
        for (let g = 0; g < 22; g++) {
          const frac = g / 21.0;
          const gy = -6.0 - frac * 14.2;
          const gz = -1.05 - Math.sin(frac * Math.PI) * 0.25;
          const gx = side * (0.98 + 0.14 * Math.sin(frac * Math.PI));
          const gPt = new THREE.Vector3(gx, gy, gz);
          sympPts.push(gPt);

          const gangGeo = new THREE.SphereGeometry(0.088, 14, 12);
          gangGeo.scale(0.85, 1.48, 0.85);
          const gangMesh = new THREE.Mesh(gangGeo, matSymp.clone());
          gangMesh.position.copy(gPt);
          gangMesh.userData = { structureCode: 'PNS_SYMPATHETIC_CHAIN' };
          this.pnsGroup.add(gangMesh);
          this.pnsMeshes.push(gangMesh);

          // Ramo comunicante branco/cinzento conectando o gânglio simpático ao nervo espinhal
          addNerve('PNS_SYMPATHETIC_CHAIN', [
            new THREE.Vector3(side * 0.55, gy + 0.05, gz - 0.08),
            gPt
          ], 0.024, matSymp);
        }
        addNerve('PNS_SYMPATHETIC_CHAIN', sympPts, 0.042, matSymp);

        // 12 Pares de Nervos Intercostais (T1–T12) arqueando na caixa torácica
        for (let t = 0; t < 12; t++) {
          const ty = -9.95 - t * 0.56;
          const ribWidth = 2.85 + 0.75 * Math.sin((t / 11.0) * Math.PI);
          addNerve('PNS_SYMPATHETIC_CHAIN', [
            new THREE.Vector3(side * 0.82, ty, -1.25),
            new THREE.Vector3(side * (ribWidth * 0.62), ty - 0.24, -0.82),
            new THREE.Vector3(side * ribWidth, ty - 0.52, 0.18),
            new THREE.Vector3(side * (ribWidth * 0.72), ty - 0.76, 1.05)
          ], 0.032, matSymp);
        }

        // 5.4 PLEXO LOMBOSSACRAL (L1–S4), NERVO FEMORAL, OBTURATÓRIO E NERVO ISQUIÁTICO (CIÁTICO -> TIBIAL + FIBULAR)
        for (let l = 0; l < 6; l++) {
          const ly = -17.0 - l * 0.62;
          addNerve('PNS_LUMBOSACRAL_SCIATIC', [
            new THREE.Vector3(side * 0.65, ly, -1.20),
            new THREE.Vector3(side * 1.65, ly - 0.65, -1.16),
            new THREE.Vector3(side * 2.25, -19.65, -1.12)
          ], 0.052, matPlexus);
        }
        // Nervo Femoral (L2–L4, anterior da coxa)
        addNerve('PNS_LUMBOSACRAL_SCIATIC', [
          new THREE.Vector3(side * 1.55, -18.10, -1.10),
          new THREE.Vector3(side * 2.55, -19.80, -0.55),
          new THREE.Vector3(side * 2.75, -22.20, -0.15),
          new THREE.Vector3(side * 2.65, -24.50, 0.10)
        ], 0.058, matPlexus);
        // Nervo Obturatório (medial da coxa)
        addNerve('PNS_LUMBOSACRAL_SCIATIC', [
          new THREE.Vector3(side * 1.45, -18.45, -1.10),
          new THREE.Vector3(side * 1.75, -20.50, -0.65),
          new THREE.Vector3(side * 1.65, -22.80, -0.35)
        ], 0.042, matPlexus);
        // Nervo Isquiático / Ciático (L4–S3, o maior nervo do corpo humano)
        addNerve('PNS_LUMBOSACRAL_SCIATIC', [
          new THREE.Vector3(side * 2.25, -19.65, -1.12),
          new THREE.Vector3(side * 2.48, -21.40, -1.18),
          new THREE.Vector3(side * 2.38, -23.50, -1.10)
        ], 0.088, matPlexus);
        // Divisão Poplítea: Nervo Tibial + Nervo Fibular Comum
        addNerve('PNS_LUMBOSACRAL_SCIATIC', [
          new THREE.Vector3(side * 2.38, -23.50, -1.10),
          new THREE.Vector3(side * 2.22, -25.60, -1.05),
          new THREE.Vector3(side * 2.15, -27.20, -0.95)
        ], 0.056, matPlexus);
        addNerve('PNS_LUMBOSACRAL_SCIATIC', [
          new THREE.Vector3(side * 2.38, -23.50, -1.10),
          new THREE.Vector3(side * 2.68, -25.40, -0.82),
          new THREE.Vector3(side * 2.62, -27.10, -0.55)
        ], 0.048, matPlexus);

        // 5.5 NERVO VAGO (NC X — PARASSIMPÁTICO CRANIOSSACRAL)
        addNerve('PNS_VAGUS_PARASYMPATHETIC', [
          new THREE.Vector3(side * 0.55, -4.75, -0.92),
          new THREE.Vector3(side * 1.05, -6.50, -0.55),
          new THREE.Vector3(side * 1.15, -9.20, -0.32),
          new THREE.Vector3(side * 0.92, -12.00, -0.10),
          new THREE.Vector3(side * 0.65, -14.80, 0.25)
        ], 0.052, matVagus);
        // Ramos Cardíacos, Pulmonares e Plexo Celíaco do Vago
        [-10.2, -11.8, -13.6, -14.8].forEach((vy, vIdx) => {
          addNerve('PNS_VAGUS_PARASYMPATHETIC', [
            new THREE.Vector3(side * 0.95, vy, -0.15),
            new THREE.Vector3(side * (1.75 - vIdx * 0.12), vy - 0.55, 0.48)
          ], 0.032, matVagus);
        });
      });

      // Impulsos bioelétricos animados correndo pelos plexos do SNP
      const pCount = 260;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        pPos[i * 3] = side * (0.8 + Math.random() * 3.4);
        pPos[i * 3 + 1] = -5.8 - Math.random() * 20.0;
        pPos[i * 3 + 2] = -1.1 + (Math.random() - 0.5) * 0.8;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.16,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      this.pnsPulses = new THREE.Points(pGeo, pMat);
      this.pnsGroup.add(this.pnsPulses);
    }

    // =========================================================================
    // 6. CAMADAS MENÍNGEAS & ÁRVORE VASCULAR CEREBROESPINHAL
    // =========================================================================
    buildMeningesLayers() {
      const layers = [
        { name: 'pia', scale: 1.015, color: 0xf43f5e, opacity: 0.16 },
        { name: 'arachnoid', scale: 1.038, color: 0x38bdf8, opacity: 0.20 },
        { name: 'dura', scale: 1.062, color: 0xfef3c7, opacity: 0.24 }
      ];
      layers.forEach(l => {
        const geo = new THREE.SphereGeometry(5.2 * l.scale, 36, 28);
        geo.scale(0.88, 0.78, 1.12);
        const mat = new THREE.MeshPhysicalMaterial({
          color: l.color,
          transparent: true,
          opacity: l.opacity,
          roughness: 0.25,
          wireframe: l.name === 'arachnoid',
          depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = `meninges_${l.name}`;
        mesh.position.set(0, 0.45, -0.35);
        mesh.visible = false;
        this.meningesGroup.add(mesh);
      });
    }

    buildCerebrospinalVascularTree() {
      const arteryMat = new THREE.MeshPhysicalMaterial({
        color: 0xef4444,
        emissive: 0x991b1b,
        emissiveIntensity: 0.42,
        roughness: 0.25
      });
      const veinMat = new THREE.MeshPhysicalMaterial({
        color: 0x2563eb,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.35,
        roughness: 0.30
      });

      // Artéria Basilar, Polígono de Willis e Artérias Cerebrais Médias/Anteriores
      const basilarCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -4.95, -0.45),
        new THREE.Vector3(0.0, -3.55, 0.38),
        new THREE.Vector3(0.0, -2.35, 0.45)
      ]);
      this.vascularGroup.add(new THREE.Mesh(new THREE.TubeGeometry(basilarCurve, 24, 0.085, 10, false), arteryMat));

      [-1, 1].forEach(side => {
        const mcaCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.35, -2.10, 0.55),
          new THREE.Vector3(side * 1.95, -1.45, 0.85),
          new THREE.Vector3(side * 3.85, -0.35, 0.65),
          new THREE.Vector3(side * 4.55, 1.15, -0.25)
        ]);
        this.vascularGroup.add(new THREE.Mesh(new THREE.TubeGeometry(mcaCurve, 32, 0.075, 10, false), arteryMat));
      });

      // Seio Sagital Superior
      const sssCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 1.25, 4.85),
        new THREE.Vector3(0.0, 4.15, 2.15),
        new THREE.Vector3(0.0, 4.35, -1.45),
        new THREE.Vector3(0.0, 1.45, -5.25)
      ]);
      this.vascularGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sssCurve, 40, 0.12, 12, false), veinMat));
      this.vascularGroup.visible = false;
    }

    buildSurgicalPinMarkers() {
      const regions = this.getRegions();
      regions.forEach(reg => {
        if (reg.id === 1) return;
        const c = reg.center || reg.coordenadas || [0, 0, 0];
        const pinGeo = new THREE.SphereGeometry(0.16, 14, 12);
        const pinMat = new THREE.MeshBasicMaterial({
          color: reg.color || 0x00f2fe,
          transparent: true,
          opacity: 0.88
        });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(c[0], c[1], c[2]);
        pin.userData = { regionId: reg.id, structureCode: reg.code };
        this.markersGroup.add(pin);
        this.markerMeshes.push(pin);
      });
    }

    buildCSFVentricularFlow() {
      const count = 180;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.4;
        pos[i * 3 + 1] = 1.0 - Math.random() * 21.0;
        pos[i * 3 + 2] = -0.8 + (Math.random() - 0.5) * 0.8;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.12,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      this.csfParticles = new THREE.Points(geo, mat);
      this.masterGroup.add(this.csfParticles);
    }

    // =========================================================================
    // 7. DESTAQUE CIRÚRGICO E ISOLAMENTO 360° UNIVERSAL (ZERO TELA PRETA)
    // =========================================================================
    getRegions() {
      return getMergedRegions();
    }

    highlightRegion(reg) {
      if (!reg) return;
      if (typeof reg === 'number') {
        reg = this.getRegions().find(r => r.id === reg) || { id: reg };
      } else if (typeof reg === 'string') {
        reg = this.getRegions().find(r => r.code === reg || String(r.id) === reg) || { code: reg };
      }
      this.activeStructureCode = reg.code || 'WB_CNS';
      const coords = reg.center || reg.coordenadas || [0, -2.5, 0];
      const col = new THREE.Color(reg.color || '#00f2fe');
      const codeStr = String(reg.code || '');
      const regId = reg.id;

      if (this.cortexUniforms) {
        if (regId === 1 || codeStr === 'WB_CNS') {
          this.cortexUniforms.uHighlightRadius.value = 0.0;
        } else {
          this.cortexUniforms.uHighlightCenter.value.set(coords[0], coords[1], coords[2]);
          this.cortexUniforms.uHighlightRadius.value = reg.radius || 1.85;
          this.cortexUniforms.uHighlightColor.value.copy(col);
        }
      }

      if (this.cerebellumUniforms) {
        this.cerebellumUniforms.uHighlight.value = (codeStr === 'CEREBELLUM' || codeStr === 'CEREBELLUM_FOLIA' || regId === 24) ? 1.0 : 0.0;
      }

      if (this.spinalUniforms) {
        if (
          codeStr.startsWith('SPINAL_') ||
          codeStr.startsWith('PNS_') ||
          codeStr.includes('MIDBRAIN') ||
          codeStr.includes('PONS') ||
          codeStr.includes('MEDULLA') ||
          codeStr.includes('CRANIAL') ||
          (regId && [20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31].includes(regId))
        ) {
          this.spinalUniforms.uHighlightY.value = coords[1];
          this.spinalUniforms.uHighlightRange.value = 2.8;
        } else {
          this.spinalUniforms.uHighlightRange.value = 0.0;
        }
      }

      this.subcorticalMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          const isMatch = codes.includes(codeStr) || (regId && ids.includes(regId));
          m.material.emissiveIntensity = isMatch ? 0.85 : 0.22;
        }
      });

      this.pnsMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          const isMatch = codes.includes(codeStr) || (regId && ids.includes(regId));
          m.material.emissiveIntensity = isMatch ? 0.92 : 0.25;
        }
      });

      this.markerMeshes.forEach(pin => {
        const isCurrent = (pin.userData && pin.userData.regionId === regId) || (pin.userData && pin.userData.structureCode === codeStr);
        pin.scale.setScalar(isCurrent ? 1.85 : 1.0);
      });
    }

    isolatePiece(structureIdentifier) {
      while (this.isolatedPieceGroup.children.length > 0) {
        this.isolatedPieceGroup.remove(this.isolatedPieceGroup.children[0]);
      }

      const regions = this.getRegions();
      let reg = null;
      if (typeof structureIdentifier === 'number') {
        reg = regions.find(r => r.id === structureIdentifier);
      } else if (typeof structureIdentifier === 'string') {
        reg = regions.find(r => r.code === structureIdentifier || String(r.id) === structureIdentifier);
        if (!reg && window.MOZOK_I18N && window.MOZOK_I18N.codeToIdMap) {
          const mappedId = window.MOZOK_I18N.codeToIdMap[structureIdentifier];
          if (mappedId) reg = regions.find(r => r.id === mappedId);
        }
      } else if (structureIdentifier && typeof structureIdentifier === 'object') {
        reg = structureIdentifier;
      }
      if (!reg) reg = regions[0];
      const code = reg ? reg.code : 'WB_CNS';
      const regId = reg ? reg.id : 1;

      if (code === 'WB_CNS' || regId === 1) {
        this.restoreFullCNS();
        return null;
      }

      this.masterGroup.visible = false;
      this.isolatedPieceGroup.visible = true;
      this.isPieceIsolated = true;

      const wrapper = new THREE.Group();

      // 1. Cerebelo completo (Folia 3D + Arbor Vitae interna)
      if ((code === 'CEREBELLUM' || code === 'CEREBELLUM_FOLIA' || regId === 24) && this.cerebellumMesh) {
        const cbClone = this.cerebellumMesh.clone();
        if (this.cerebellumUniforms) this.cerebellumUniforms.uOpacity.value = 1.0;
        wrapper.add(cbClone);
        if (this.arborVitaeGroup) wrapper.add(this.arborVitaeGroup.clone(true));
      }
      // 2. Estruturas do Sistema Nervoso Periférico (SNP)
      else if (code.startsWith('PNS_') || (regId && regId >= 27) || code === 'BRACHIAL_PLEXUS' || code === 'SCIATIC_LUMBOSACRAL') {
        this.pnsMeshes.forEach(m => {
          const mCode = m.userData && m.userData.structureCode;
          const mId = m.userData && m.userData.structureId;
          if (mCode === code || (mId && mId === regId)) {
            wrapper.add(m.clone());
          }
        });
        this.spinalMeshes.forEach(m => {
          const cloneS = m.clone();
          if (cloneS.material) {
            cloneS.material = cloneS.material.clone();
            cloneS.material.transparent = true;
            if (cloneS.material.uniforms && cloneS.material.uniforms.uOpacity) {
              cloneS.material.uniforms.uOpacity.value = 0.35;
            } else {
              cloneS.material.opacity = 0.35;
            }
          }
          wrapper.add(cloneS);
        });
      }
      // 3. Tronco Encefálico, Nervos Cranianos ou Medula Espinhal
      else if (
        code.startsWith('BRAINSTEM_') ||
        code.startsWith('SPINAL_') ||
        code === 'MIDBRAIN_SN' ||
        code === 'PONS_VAROLII' ||
        code === 'MEDULLA_OBLONGATA' ||
        code === 'CRANIAL_NERVES' ||
        [20, 21, 22, 23, 25, 26].includes(regId)
      ) {
        const matched = this.spinalMeshes.filter(m => {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          return codes.includes(code) || (regId && ids.includes(regId));
        });
        const listToClone = matched.length > 0 ? matched : this.spinalMeshes;
        listToClone.forEach(m => wrapper.add(m.clone()));
      }
      // 4. Núcleos Subcorticais, Límbico e Ventrículos
      else if (
        (this.subcorticalMeshMap[code] && this.subcorticalMeshMap[code].length > 0) ||
        (this.subcorticalMeshMap[String(regId)] && this.subcorticalMeshMap[String(regId)].length > 0)
      ) {
        const list = (this.subcorticalMeshMap[code] && this.subcorticalMeshMap[code].length > 0)
          ? this.subcorticalMeshMap[code]
          : this.subcorticalMeshMap[String(regId)];
        list.forEach(m => wrapper.add(m.clone()));
      }
      // 5. Áreas Corticais de Brodmann / Giros Reais MNI152 (Recorte Cirúrgico 3D da Malha MNI152)
      else if (this.cortexMesh) {
        const center = reg.center || reg.coordenadas || [0, 0, 0];
        const radius = (reg.radius || 2.1) * 1.45;
        const srcGeo = this.cortexMesh.geometry;
        const posAttr = srcGeo.attributes.position;
        const colAttr = srcGeo.attributes.color;
        const idxAttr = srcGeo.index;

        const subIndices = [];
        for (let i = 0; i < idxAttr.count; i += 3) {
          const ia = idxAttr.getX(i);
          const ib = idxAttr.getX(i + 1);
          const ic = idxAttr.getX(i + 2);
          const ax = posAttr.getX(ia), ay = posAttr.getY(ia), az = posAttr.getZ(ia);
          const d = Math.hypot(ax - center[0], ay - center[1], az - center[2]);
          if (d <= radius) {
            subIndices.push(ia, ib, ic);
          }
        }

        if (subIndices.length >= 30) {
          const patchGeo = new THREE.BufferGeometry();
          patchGeo.setAttribute('position', posAttr);
          if (colAttr) patchGeo.setAttribute('color', colAttr);
          patchGeo.setIndex(subIndices);
          patchGeo.computeVertexNormals();
          const patchMat = new THREE.MeshPhysicalMaterial({
            color: reg.color || 0x38bdf8,
            emissive: reg.color || 0x0284c7,
            emissiveIntensity: 0.25,
            roughness: 0.32,
            clearcoat: 0.45,
            side: THREE.DoubleSide
          });
          wrapper.add(new THREE.Mesh(patchGeo, patchMat));
        } else {
          wrapper.add(this.cortexMesh.clone());
        }
      }

      const box = new THREE.Box3().setFromObject(wrapper);
      if (!box.isEmpty()) {
        const centerVec = new THREE.Vector3();
        const sizeVec = new THREE.Vector3();
        box.getCenter(centerVec);
        box.getSize(sizeVec);
        wrapper.position.sub(centerVec);

        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z, 0.5);
        const targetSpan = 4.2;
        const normScale = Math.max(0.28, Math.min(2.2, targetSpan / maxDim));
        this.isolatedPieceGroup.scale.setScalar(normScale);
      } else {
        this.isolatedPieceGroup.scale.setScalar(1.0);
      }

      this.isolatedPieceGroup.add(wrapper);
      return this.isolatedPieceGroup;
    }

    restoreFullCNS() {
      this.isPieceIsolated = false;
      this.isolatedPieceGroup.visible = false;
      this.masterGroup.visible = true;
    }

    setViewMode(mode) {
      this.viewMode = mode;
      if (mode === 'external') {
        this.setAnatomyOpacity(1.0, 1.0);
        this.subcorticalGroup.visible = false;
        this.markersGroup.visible = false;
        this.vascularGroup.visible = false;
        if (this.tractography && this.tractography.masterGroup) {
          this.tractography.masterGroup.visible = false;
        }
      } else if (mode === 'internal_xray') {
        this.setAnatomyOpacity(0.18, 0.28);
        this.subcorticalGroup.visible = true;
        this.markersGroup.visible = true;
        this.vascularGroup.visible = false;
        if (this.tractography && this.tractography.masterGroup) {
          this.tractography.masterGroup.visible = true;
        }
      } else if (mode === 'vascular') {
        this.setAnatomyOpacity(0.22, 0.35);
        this.subcorticalGroup.visible = true;
        this.markersGroup.visible = false;
        this.vascularGroup.visible = true;
        if (this.tractography && this.tractography.masterGroup) {
          this.tractography.masterGroup.visible = false;
        }
      }
    }

    setAnatomyOpacity(cortexAlpha, cerebellumAlpha = 1.0) {
      if (this.cortexUniforms) {
        this.cortexUniforms.uOpacity.value = cortexAlpha;
      }
      if (this.cortexMesh && this.cortexMesh.material) {
        this.cortexMesh.material.depthWrite = cortexAlpha > 0.65;
      }
      if (this.cerebellumUniforms) {
        this.cerebellumUniforms.uOpacity.value = cerebellumAlpha;
      }
      if (this.cerebellumMesh && this.cerebellumMesh.material) {
        this.cerebellumMesh.material.depthWrite = cerebellumAlpha > 0.65;
      }
    }

    setMeningesLayer(layerName) {
      this.meningesGroup.children.forEach(child => {
        if (layerName === 'none') child.visible = false;
        else if (layerName === 'all') child.visible = true;
        else child.visible = (child.name === `meninges_${layerName}`);
      });
    }

    restoreHealthyTissue() {
      if (this.cortexUniforms) {
        this.cortexUniforms.uLesionRadius.value = 0.0;
        this.cortexUniforms.uDiseaseMode.value = 0;
        this.cortexUniforms.uDiseaseSeverity.value = 0.0;
      }
    }

    setVisible(visible) {
      this.masterGroup.visible = visible && !this.isPieceIsolated;
      if (!visible) {
        this.isolatedPieceGroup.visible = false;
      }
    }

    update(dt = 0.016) {
      this.time += dt;
      if (this.cortexUniforms) this.cortexUniforms.uTime.value = this.time;
      if (this.cerebellumUniforms) this.cerebellumUniforms.uTime.value = this.time;
      if (this.spinalUniforms) this.spinalUniforms.uTime.value = this.time;

      if (this.isPieceIsolated && this.isolatedPieceGroup.visible) {
        this.isolatedPieceGroup.rotation.y += dt * 0.25;
      }

      if (this.csfParticles && this.csfParticles.geometry) {
        const arr = this.csfParticles.geometry.attributes.position.array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= dt * 1.4;
          if (arr[i + 1] < -20.5) arr[i + 1] = 1.2;
        }
        this.csfParticles.geometry.attributes.position.needsUpdate = true;
      }

      if (this.pnsPulses && this.pnsPulses.geometry) {
        const arr = this.pnsPulses.geometry.attributes.position.array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= dt * 2.8;
          if (arr[i + 1] < -26.5) arr[i + 1] = -5.8;
        }
        this.pnsPulses.geometry.attributes.position.needsUpdate = true;
      }

      if (this.tractography && typeof this.tractography.update === 'function') {
        this.tractography.update(dt);
      }
    }
  }

  window.CNSAnatomy3D = CNSAnatomy3D;
})(window);
