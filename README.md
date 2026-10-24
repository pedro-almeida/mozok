# MOZOK (МОЗОК) v2.0 — Atlas e Simulador Multiescala do Sistema Nervoso Central

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0%20Scientific-success.svg)](web/index.html)
[![WebGL2](https://img.shields.io/badge/WebGL2-Three.js%20Studio-brightgreen.svg)](web/index.html)
[![A11y](https://img.shields.io/badge/Accessibility-WCAG%20AAA%20%2B%20VLibras-purple.svg)](https://vlibras.gov.br)
[![Coordinates](https://img.shields.io/badge/Coordinates-MNI152%20Canonical%20Validated-orange.svg)](web/js/cns-anatomy-3d.js)

---

### 🌐 Idiomas / Languages / Lingue / Мови / Idiomas
* [🇧🇷 Português Brasileiro](#-português-brasileiro)
* [🇬🇧 British English](#-british-english)
* [🇮🇹 Italiano](#-italiano)
* [🇺🇦 Українська (Кирилиця)](#-українська-кирилиця)
* [🇪🇸 Español](#-español)

---

## 🇧🇷 Português Brasileiro

### 1. Visão Geral do Projeto
O **MOZOK v2.0** (Ucraniano: *Мозок* — "Cérebro") é um atlas tridimensional de alta precisão e simulador fisiopatológico multiescala do **Sistema Nervoso Central Humano Completo** (Encéfalo, Diencéfalo, Tronco Encefálico e Medula Espinhal com cauda equina). Funciona como um *"Google Earth neuroanatômico"*, permitindo navegar de forma contínua e reversível entre a macroanatomia cortical e a microscopia celular profunda da Camada V.

### 2. Remoção de Artefatos e Escala Canônica MNI152 Unificada (`SCALE = 1.0`)
* **Eliminação de Vias Fora do Encéfalo:** Remoção integral da dupla multiplicação de escala que gerava tubos gigantes ("espaguetes de bola de ar") voando fora do encéfalo.
* **Escala Canônica MNI152 Estrita (`SCALE = 1.0`):** Todas as geometrias, peças corticais e subcorticais operam estritamente no volume delimitado por `window.REAL_MNI_BRAIN` (`X ∈ [-5.42, +5.42]`, `Y ∈ [-5.08, +5.08]`, `Z ∈ [-6.90, +6.90]`).
* **Vias de Substância Branca DTI de Raio Fino:** Fascículo Arqueado (conectando a Área de Wernicke à Área de Broca no hemisfério esquerdo `X > 0`), Trato Corticoespinhal, Radiações Ópticas e demais vias operam com raios finíssimos (`r = 0.04` a `0.08`), visíveis estritamente no espaço intra-encefálico com córtex semitransparente.
* **Câmera Canônica:** Visão inicial em `camera.position = (0, 3.5, 24.0)` e `target = (0, -2.5, 0)`, enquadrando perfeitamente todo o neuroeixo.

### 3. Peças Anatômicas Reais e Modo "Isolar Peça 3D"
* **Extração Direta dos Triângulos MNI152 (`extractCorticalPieceGeometry`):**
  - Para as áreas corticais (**Área de Broca Esquerda BA 44/45** em `[+4.62, +0.50, +2.39]`, **Área de Wernicke Esquerda BA 22** em `[+4.89, -0.29, -1.41]`, **Córtex Motor Primário M1 Esquerdo** em `[+3.79, +3.80, +0.43]`, **Córtex Pré-Frontal DLPFC** em `[+3.04, +1.86, +4.72]`, **S1**, **V1** e **Ínsula**), o simulador extrai a sub-malha triangular real de McGill/MNI152 preservando integralmente giros, sulcos e relevo com shader GLSL de Subsurface Scattering.
* **Escultura Anatômica Subcortical Realística (Zero Bolas Lisas):**
  - **Cerebelo Real com Folia e Árvore da Vida:** Malha de alta resolução (`120 × 80`) com folia cerebelares esculpidas matematicamente ($\Delta r = 0.12 \cos(28y)$), incisura posterior, vérmis mediano e coloração rosada parenquimatosa (`#8c7a74`).
  - **Hipocampo Real em Arco C:** Estrutura anatômica contínua de 80 segmentos com digitações na cabeça temporal, corpo arqueado e fórnix projetando-se aos corpos mamilares.
  - **Hipotálamo + Infundíbulo + Hipófise + Quiasma Óptico:** Assoalho e paredes do III ventrículo com corpos mamilares, infundíbulo, hipófise bilobada e quiasma óptico cruzando anteriormente.
  - **Corpo Estriado e Tálamo Bilateral:** Núcleo caudado em formato C, putâmen com pontes celulares estriatais e aderência intertalâmica com pulvinar.
  - **Tronco Encefálico Contínuo e Medula Espinhal:** Mesencéfalo, ponte de Varólio com estrias transversais, bulbo com pirâmides e olivas, e medula espinhal unificada.
* **Modo `🧩 Isolar Peça Real 3D`:** Permite isolar qualquer região selecionada em 360° ou reintegrá-la instantaneamente através do botão `🧠 Ver no SNC Completo`.

### 4. Meninges Dissecáveis e Árvore Vascular Cortical
* **3 Camadas Meníngeas Dissecáveis (`buildMeningesLayers`):**
  - **Dura-Máter (`offset = +0.22`):** Membrana fibrosa translúcida com a Foice do Cérebro (*Falx Cerebri*), Tentório do Cerebelo e Seio Sagital Superior venoso (`#1d4ed8`).
  - **Aracnoide-Máter & LCR (`offset = +0.11`):** Trabéculas aracnóideas com fluxo pulsátil de Líquido Cefalorraquidiano.
  - **Pia-Máter (`offset = +0.015`):** Membrana vascular aderida intimamente ao fundo de cada sulco cortical.
  - Controle interativo: `🛡️ Meninges: [Ocultar] [Pia-Máter] [Aracnoide + LCR] [Dura-Máter] [Todas]`.
* **Árvore Vascular Cerebral Colada à Superfície:**
  - Polígono de Willis na base encefálica (Carótidas Internas, Basilar, Comunicantes).
  - Artéria Cerebral Média (ACM) com ramos `M4` projetados diretamente nos vértices e sulcos de `REAL_MNI_BRAIN` (`v + normal * 0.035`), irrigando a Área de Broca, M1 e Wernicke.
  - Artéria Cerebral Anterior (ACA), Posterior (ACP) e seios venosos durais (`#1e40af`).

### 5. Raycasting Interativo e Disparo de AVC/Patologias em Tempo Real
* **Click-to-Trigger Stroke:** Clique em qualquer giro cortical 3D ou selecione uma estrutura anatômica para disparar:
  - `🩸 Disparar AVC Isquêmico Aqui` | `💥 Disparar AVC Hemorrágico Aqui` | `↺ Restaurar Tecido Saudável`.
* **Propagação Fisiopatológica GLSL:**
  - Oclusão vascular visível com trombo intraluminal e cessação de pulso a jusante.
  - Propagação radial em tempo real do **Núcleo Isquêmico Necrótico (`#111827`)** envolvido pelo halo da **Zona de Penumbra Isquêmica (`#dc2626` / `#f97316`)**.
  - Correlação clínico-topográfica imediata: na Área de Broca (*Afasia Expressiva e apraxia*), Wernicke (*Afasia Receptiva*), M1 (*Hemiplegia espástica contralateral*), V1 (*Hemianopsia homônima*).
  - Mergulho celular: visualização em tempo real de falência de ATP, excitotoxicidade por glutamato, influxo de $\text{Ca}^{2+}$ e edema citotóxico.

### 6. Conectoma Microscópico Estilo "Firefly Layer V"
* Fundo limpo em azul-petróleo escuro (`#030d18`).
* Neurônio Piramidal Central da Camada V em âmbar translúcido (`#f59e0b` / `#fbbf24`) com núcleo visível por SSS, 8 árvores dendríticas de 5ª ordem, cone axonal e 5 bainhas de mielina com nódulos de Ranvier em azul-elétrico (`#00f2fe`) com condução saltatória.
* 16 neurônios vizinhos esculpidos em azul-ciano (`#0284c7`) e âmbar (`#d97706`).
* 24 sinapses químicas funcionais com fluxo bidirecional de neurotransmissores: exocitose anterógrada (Glutamato dourado e GABA ciano) e fluxo retrógrado (2-AG/NO esmeralda com recaptação EAAT2/GAT-1).
* Retorno suave e desobstruído com botão `🏠 Voltar à Visão Inicial (SNC)` e scroll do mouse.

---

## 🇬🇧 British English

### 1. Project Overview
**MOZOK v2.0** (Ukrainian: *Мозок* — "Brain") is an open-access, high-precision three-dimensional atlas and multiscale pathophysiological simulator of the **Complete Human Central Nervous System** (Brain, Diencephalon, Brainstem, and Spinal Cord with cauda equina). It enables continuous, reversible navigation between macroscopic cortical topology and deep Layer V cellular microscopy.

### 2. Elimination of Visual Artefacts & Canonical MNI152 Scale (`SCALE = 1.0`)
* **Removal of Extracranial Tracts:** Completely eliminated double-scale multiplication that caused giant DTI tract tubes to float outside the brain volume.
* **Strict Canonical MNI152 Scaling (`SCALE = 1.0`):** All cortical and subcortical geometries operate strictly within the `window.REAL_MNI_BRAIN` bounding volume (`X ∈ [-5.42, +5.42]`, `Y ∈ [-5.08, +5.08]`, `Z ∈ [-6.90, +6.90]`).
* **Fine-Calibre White Matter Tractography:** Arcuate Fasciculus (connecting Wernicke's to Broca's area in the left hemisphere `X > 0`), Corticospinal Tract, Optic Radiations, and Corpus Callosum feature fine radii (`r = 0.04` to `0.08`), visible strictly within the parenchymal volume during cortical semitransparency.
* **Canonical Camera Framing:** Initial camera at `(0, 3.5, 24.0)` with target `(0, -2.5, 0)` framing the entire neuraxis smoothly.

### 3. Authentic Anatomical Pieces & "3D Piece Isolation" Mode
* **Direct Extraction of MNI152 Triangles (`extractCorticalPieceGeometry`):**
  - For cortical areas (**Left Broca's Area BA 44/45** at `[+4.62, +0.50, +2.39]`, **Left Wernicke's Area BA 22** at `[+4.89, -0.29, -1.41]`, **Left Primary Motor Cortex M1** at `[+3.79, +3.80, +0.43]`, **DLPFC**, **S1**, **V1**, and **Insula**), the simulator extracts the authentic McGill/MNI152 triangular sub-mesh preserving natural gyri, sulci, and relief with GLSL Subsurface Scattering.
* **Sculpted Subcortical Anatomy (Zero Smooth Spheres):**
  - **Foliated Cerebellum with Arbor Vitae:** High-resolution mesh (`120 × 80`) featuring mathematical folia ($\Delta r = 0.12 \cos(28y)$), posterior cerebellar notch, median vermis, and pinkish parenchymal tone (`#8c7a74`).
  - **C-Curved Hippocampus:** Continuous 80-segment anatomical structure with anterior temporal digitations, hippocampal body, and fornix columns converging to mamillary bodies.
  - **Hypothalamus + Infundibulum + Pituitary + Optic Chiasm:** Third ventricle floor and walls with mamillary bodies, tuber cinereum, bilobed pituitary gland, and anterior optic chiasm.
  - **Corpus Striatum & Bilateral Thalamus:** C-shaped caudate nucleus, putamen with cellular bridges, interthalamic adhesion, and pulvinar.
  - **Unified Brainstem and Spinal Cord:** Midbrain, pons with transverse fibres, medulla oblongata with pyramids and olives, and spinal cord.
* **`🧩 Isolate 3D Anatomical Piece` Mode:** Inspect any isolated anatomical piece in full 360° or restore the integrated view via `🧠 View Full CNS`.

### 4. Dissectible Meninges & Cortical Vascular Tree
* **3 Dissectible Meningeal Layers (`buildMeningesLayers`):**
  - **Dura Mater (`offset = +0.22`):** Fibrous translucent membrane featuring Falx Cerebri, Tentorium Cerebelli, and Superior Sagittal Sinus (`#1d4ed8`).
  - **Arachnoid Mater & CSF (`offset = +0.11`):** Arachnoid trabeculae with pulsatile cerebrospinal fluid flow.
  - **Pia Mater (`offset = +0.015`):** Delicate vascular membrane adhering closely to each sulcus and gyrus.
  - Dissection UI: `🛡️ Meninges: [Hide] [Pia Mater] [Arachnoid + CSF] [Dura Mater] [All]`.
* **Cerebral Vasculature Adhering to Gyri:**
  - Circle of Willis at the base of the brain.
  - Middle Cerebral Artery (MCA) cortical `M4` branches adhering directly to `REAL_MNI_BRAIN` vertices (`v + normal * 0.035`), perfusing Broca's area, M1, and Wernicke's area.
  - Anterior Cerebral Artery (ACA), Posterior Cerebral Artery (PCA), and dural sinuses (`#1e40af`).

### 5. Interactive Raycasting & Real-Time Stroke Triggering
* **Click-to-Trigger Stroke:** Click any 3D cortical gyrus or select an anatomical region:
  - `🩸 Trigger Ischaemic Stroke Here` | `💥 Trigger Haemorrhagic Stroke Here` | `↺ Restore Healthy Tissue`.
* **GLSL Pathological Progression:**
  - Visible vascular occlusion via intraluminal thrombus and downstream cessation of pulsation.
  - Dynamic radial expansion of the **Necrotic Ischaemic Core (`#111827`)** bordered by the **Ischaemic Penumbra (`#dc2626` / `#f97316`)**.
  - Immediate topographic clinical syndrome: Broca's Area (*Expressive Aphasia & apraxia*), Wernicke's (*Receptive Aphasia*), M1 (*Contralateral spastic hemiplegia*), V1 (*Homonymous hemianopia*).
  - Cellular dive: Real-time visualisation of ATP breakdown, glutamate excitotoxicity, $\text{Ca}^{2+}$ influx, and cytotoxic oedema.

### 6. "Firefly Layer V" Microscopic Connectome
* Clean dark teal background (`#030d18`).
* Central Layer V Pyramidal Neuron in translucent amber (`#f59e0b` / `#fbbf24`) with SSS nucleus, 8 5th-order dendritic trees, axon hillock, and 5 myelin sheaths with electric-blue Ranvier nodes (`#00f2fe`) exhibiting saltatory conduction.
* 16 neighbouring sculpted neurons in deep cyan (`#0284c7`) and amber (`#d97706`).
* 24 chemical synapses with bidirectional neurotransmitter trafficking: anterograde exocytosis (golden Glutamate and cyan GABA) and retrograde messenger feedback (emerald 2-AG/NO with EAAT2/GAT-1 reuptake).
* Seamless return via `🏠 Return to Home View (CNS)` button and mouse wheel.

---

## 🇮🇹 Italiano

### 1. Visione Generale del Progetto
**MOZOK v2.0** (Ucraino: *Мозок* — "Cervello") è un atlante tridimensionale interattivo e simulatore fisiopatologico multiscala del **Sistema Nervoso Centrale Umano Completo** (Cervello, Diencefalo, Tronco Encefalico e Midollo Spinale con cauda equina).

### 2. Eliminazione delle Anomalie Visive e Scala Canonica MNI152 (`SCALE = 1.0`)
* **Rimozione Completa dei Tubi Fuori dal Cervello:** Eliminata la doppia moltiplicazione di scala che proiettava le vie DTI fuori dall'encefalo.
* **Scala Canonica MNI152 Rigorosa (`SCALE = 1.0`):** Tutte le geometrie operano strettamente entro il volume di `window.REAL_MNI_BRAIN` (`X ∈ [-5.42, +5.42]`, `Y ∈ [-5.08, +5.08]`, `Z ∈ [-6.90, +6.90]`).
* **Trattografia a Calibro Fine:** Fascicolo Arcuato (connessione da Wernicke a Broca nell'emisfero sinistro `X > 0`), Fascio Corticospinale e radiazioni ottiche con raggio sottile (`r = 0.04` a `0.08`), visibili internamente con corteccia semitrasparente.
* **Inquadratura Canonica:** Telecamera iniziale in `(0, 3.5, 24.0)` e bersaglio in `(0, -2.5, 0)`.

### 3. Pezzi Anatomici Reali e Modalità "Isola Pezzo 3D"
* **Estrazione Triangolare MNI152 (`extractCorticalPieceGeometry`):** Per l'Area di Broca, Wernicke, M1, DLPFC e V1, il sistema estrae la sottomaglia reale preservando solchi e giri con shader Subsurface Scattering.
* **Scultura Sottocorticale Realistica:** Cervelletto con folia matematiche ($\Delta r = 0.12 \cos(28y)$), Ippocampo ad arco C con digitazioni e fornice, Ipotalamo continuo con infundibolo e ipofisi, Corpo Striato, Talamo e Tronco Encefalico continuo con midollo spinale.
* **Modalità `🧩 Isola Pezzo Reale 3D` e `🧠 Vista SNC Completo`:** Ispezione a 360° del singolo distretto anatomico o integrazione nel volume globale.

### 4. Meningi Sezionabili e Vascolarizzazione Corticale
* **3 Strati Meningei (`buildMeningesLayers`):** Dura Madre con Falce Cerebrale e Seno Sagittale Superiore (`#1d4ed8`), Aracnoide con flusso di Liquor, e Pia Madre aderente ai solchi.
* **Arteria Cerebrale Media (ACM):** Rami `M4` aderenti ai vertici della corteccia che irrorano l'Area di Broca, M1 e Wernicke.

### 5. Raycasting e Attivazione Ictus in Tempo Reale
* Clic su qualsiasi giro 3D per attivare: `🩸 Attiva Ictus Ischemico Qui` | `💥 Attiva Ictus Emorragico Qui` | `↺ Ripristina Tessuto Sano`.
* Propagazione GLSL del **Nucleo Necrotico Ischemico (`#111827`)** e della **Penombra Ischemica (`#dc2626` / `#f97316`)**, con sindromi topografiche corrispondenti (Afasia di Broca, Wernicke, Emiplegia controlaterale).

### 6. Microconnettoma "Firefly Layer V"
* Sfondo verde petrolio scuro (`#030d18`), neurone piramidale centrale in ambra dorata con nucleo SSS, 16 neuroni vicini, 24 sinapsi con rilascio bidirezionale di neurotrasmettitori (Glutammato, GABA, 2-AG/NO e ricaptazione).

---

## 🇺🇦 Українська (Кирилиця)

### 1. Загальний огляд проєкту
**МОЗОК v2.0** — відкритий інтерактивний тривимірний атлас високої точності та багатомасштабний фізіологічний симулятор **Повної центральної нервової системи людини** (головний мозок, проміжний мозок, стовбур мозку та спинний мозок із кінським хвостом).

### 2. Усунення візуальних артефактів і канонічний масштаб MNI152 (`SCALE = 1.0`)
* **Повне видалення волокон поза мозком:** Усунуто подвійне масштабування, через яке трактографічні трубки ДТІ літали у повітрі за межами мозку.
* **Суворий канонічний масштаб MNI152 (`SCALE = 1.0`):** Усі анатомічні структури розташовані в межах координат `window.REAL_MNI_BRAIN` (`X ∈ [-5.42, +5.42]`, `Y ∈ [-5.08, +5.08]`, `Z ∈ [-6.90, +6.90]`).
* **Тонкокаліберні провідні шляхи білої речовини:** Дугоподібний пучок (що з'єднує зону Верніке із зоною Брока в лівій півкулі `X > 0`), кірково-спинномозковий шлях і зорова променистість з радіусом `r = 0.04` – `0.08`, видимі всередині паренхіми при напівпрозорій корі.
* **Канонічна камера:** Початкове положення `(0, 3.5, 24.0)` з фокусом на `(0, -2.5, 0)`.

### 3. Справжні анатомічні структури та режим "Ізолювати 3D деталь"
* **Вилучення трикутників MNI152 (`extractCorticalPieceGeometry`):** Для кіркових зон (зона Брока BA 44/45, зона Верніке BA 22, моторна кора M1, DLPFC, V1 тощо) вилучається автентична геометрія зі збереженням борозен і звивин з підповерхневим розсіюванням світла (SSS).
* **Анатомічна скульптура підкіркових структур (без гладких сфер):** Мозочок з математичними листками ($\Delta r = 0.12 \cos(28y)$), С-подібний гіпокамп із пальцеподібними втисненнями та склепінням, гіпоталамус із лійкою, двочастковим гіпофізом і зоровим перехрестом, смугасте тіло та неперервний стовбур зі спинним мозком.
* **Режим `🧩 Ізолювати анатомічну деталь 3D`:** Огляд виділеної структури на 360° або повернення до загального вигляду (`🧠 Переглянути всю ЦНС`).

### 4. Оболони мозку та судинне русло кори
* **3 шари мозкових оболон (`buildMeningesLayers`):** Тверда оболона з серпом великого мозку та верхньою сагітальною пазухою (`#1d4ed8`), павутинна оболона з циркуляцією ліквору та м'яка судинна оболона, що прилягає до борозен.
* **Середня мозкова артерія (СМА):** Кіркові гілки `M4`, що повторюють рельєф поверхні кори `REAL_MNI_BRAIN` (`v + normal * 0.035`) та живлять зону Брока, M1 і зону Верніке.

### 5. Інтерактивний інсульт у реальному часі (Click-to-Trigger Stroke)
* Клікніть на будь-яку звивину кори для виклику: `🩸 Спричинити ішемічний інсульт тут` | `💥 Спричинити геморагічний інсульт тут` | `↺ Відновити здорову тканину`.
* Шейдерне моделювання некротичного ядра інсульту (`#111827`) та пульсуючої ішемічної напівтіні (пенумбри `#dc2626` / `#f97316`) з відповідною клінічною картиною (моторна афазія Брока, сенсорна афазія Верніке, геміплегія).
* Клітинний рівень: дефіцит АТФ, глутаматна ексайтотоксичність, надлишок $\text{Ca}^{2+}$ і цитотоксичний набряк.

### 6. Мікроконектом "Firefly Layer V"
* Темне бірюзове тло (`#030d18`), центральний пірамідний нейрон V шару в бурштиново-золотому кольорі з ядром SSS, 16 модельованих сусідніх нейронів, 24 синапси з двонапрямленим транспортом нейромедіаторів (глутамат, ГАМК, ретроградні 2-AG/NO та зворотне захоплення).

---

## 🇪🇸 Español

### 1. Visión General del Proyecto
**MOZOK v2.0** (Ucraniano: *Мозок* — "Cerebro") es un atlas tridimensional interactivo de alta precisión y simulador fisiopatológico multiescala del **Sistema Nervioso Central Humano Completo** (Encéfalo, Diencéfalo, Tronco Encefálico y Médula Espinal con cauda equina).

### 2. Eliminación de Artefactos y Escala Canónica MNI152 (`SCALE = 1.0`)
* **Eliminación Total de Tubos Fuera del Encéfalo:** Se corrigió la doble multiplicación de escala que proyectaba vías DTI gigantes fuera del cerebro.
* **Escala Canónica MNI152 Estricta (`SCALE = 1.0`):** Toda la geometría opera exactamente dentro del volumen delimitado por `window.REAL_MNI_BRAIN` (`X ∈ [-5.42, +5.42]`, `Y ∈ [-5.08, +5.08]`, `Z ∈ [-6.90, +6.90]`).
* **Vías de Tractografía de Calibre Fino:** Fascículo Arqueado (conectando Wernicke con Broca en el hemisferio izquierdo `X > 0`), Fascículo Corticoespinal y radiaciones ópticas con radio fino (`r = 0.04` a `0.08`), visibles dentro del parénquima con la corteza semitransparente.
* **Cámara Canónica:** Posición inicial `(0, 3.5, 24.0)` con foco en `(0, -2.5, 0)`.

### 3. Piezas Anatómicas Reales y Modo "Aislar Pieza 3D"
* **Extracción de Triángulos MNI152 (`extractCorticalPieceGeometry`):** Para el Área de Broca, Wernicke, M1, DLPFC, S1, V1 e Ínsula, se extrae la sub-malla triangular real preservando surcos y giros con sombreador GLSL Subsurface Scattering.
* **Escultura Subcortical Realista (Cero Esferas Lisas):** Cerebelo con folia matemáticas ($\Delta r = 0.12 \cos(28y)$), Hipocampo en arco C con digitaciones y fórnix, Hipotálamo continuo con infundíbulo e hipófisis bilobulada, Cuerpo Estriado, Tálamo y Tronco Encefálico unificado con médula espinal.
* **Modo `🧩 Aislar Pieza Real 3D`:** Inspección en 360° de la estructura aislada o reintegración mediante `🧠 Ver SNC Completo`.

### 4. Meninges Disecables y Árbol Vascular Cortical
* **3 Capas Meníngeas Disecables (`buildMeningesLayers`):** Duramadre con Hoz del Cerebro y Seno Sagital Superior (`#1d4ed8`), Aracnoides con flujo de LCR y Piamadre adherida a los surcos corticales.
* **Arteria Cerebral Media (ACM):** Ramas `M4` adheridas a la superficie de `REAL_MNI_BRAIN` (`v + normal * 0.035`) que irrigan el Área de Broca, M1 y Wernicke.

### 5. Raycasting Interactivo y Simulación de Ictus en Tiempo Real
* Clic directo en cualquier giro 3D: `🩸 Disparar Ictus Isquémico Aquí` | `💥 Disparar Ictus Hemorrágico Aquí` | `↺ Restaurar Tejido Sano`.
* Propagación fisiopatológica en GLSL: Núcleo necrótico (`#111827`) y penumbra isquémica (`#dc2626` / `#f97316`) con síndrome clínico topográfico exacto (Afasia de Broca, Wernicke, Hemiplejía espástica contralateral).
* Inmersión celular: visualización inmediata de fallo de ATP, excitotoxicidad por glutamato, influjo de $\text{Ca}^{2+}$ y edema citotóxico.

### 6. Microconectoma "Firefly Layer V"
* Fondo limpio azul petróleo oscuro (`#030d18`), neurona piramidal central en ámbar dorado con núcleo SSS, 16 neuronas vecinas modeladas, 24 sinapsis con tráfico bidireccional de neurotransmisores (Glutamato, GABA, 2-AG/NO y recaptación).

---

## 🚀 Requisitos e Inicialização / How to Run

### Requisitos de Hardware
* **GPU Recomendada:** NVIDIA GeForce GTX 1650 (ou superior) para 60 FPS estáveis com MSAA e sombras em tempo real.
* **Navegador:** Google Chrome, Microsoft Edge, Mozilla Firefox ou Safari com suporte a WebGL 2.0.

### Execução Local Rápida
Abra o terminal e execute um servidor estático local ou abra diretamente o arquivo `web/index.html`:
```bash
# Via Python
python -m http.server 8080 --directory web

# Ou via Node.js / npx
npx serve web
```
Acesse no navegador: `http://localhost:8080`.
