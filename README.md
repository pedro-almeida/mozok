# MOZOK (МОЗОК) v2.0 — Atlas e Simulador Multiescala do Sistema Nervoso Central

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0%20Scientific-success.svg)](web/index.html)
[![WebGL2](https://img.shields.io/badge/WebGL2-Three.js%20Studio-brightgreen.svg)](web/index.html)
[![A11y](https://img.shields.io/badge/Accessibility-WCAG%20AAA%20%2B%20VLibras-purple.svg)](https://vlibras.gov.br)
[![Coordinates](https://img.shields.io/badge/Coordinates-MNI152%20Validated-orange.svg)](web/js/cns-anatomy-3d.js)

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
O **MOZOK v2.0** (Ucraniano: *Мозок* — "Cérebro") é um atlas tridimensional de alta precisão e simulador fisiopatológico multiescala do **Sistema Nervoso Central Humano Completo** (Encéfalo, Diencéfalo, Tronco Encefálico e Medula Espinhal com cauda equina). Funciona como um *"Google Earth neuroanatômico"*, permitindo navegar de forma contínua e reversível entre a macroanatomia cortical e a microscopia profunda da Camada V.

### 2. Arquitetura Multiescala Contínua
* **Macro (280–140 mm):** Córtex cerebral MNI152 com giros e sulcos anatômicos, cerebelo foliado e medula espinhal contínua estendendo-se até o cone medular e cauda equina.
* **Meso (140–35 mm):** Transparência progressiva cortical por shader revelando as 22 estruturas subcorticais esculpidas: Tálamo Pulvinar, Hipocampo em arco C com fórnix, Complexo Amigdalino, Corpo Estriado, Hipotálamo contínuo com infundíbulo e hipófise bilobada, e Tronco Encefálico unificado (Mesencéfalo, Ponte e Bulbo com pirâmides e olivas).
* **Micro (35–5 mm):** Conectoma denso de **500 Neurônios da Camada V**: 36 neurônios piramidais em primeiro plano com estética de microscopia âmbar-dourada, núcleo âmbar escuro, nucléolo dourado, ramificações de 5ª ordem (Lei de Rall), bainhas de mielina orgânicas texturizadas e nódulos de Ranvier em azul-elétrico intenso com saltos de potenciais de ação em tempo real.
* **Nano (< 5 mm):** Fendas sinápticas com exocitose vesicular quântica de neurotransmissores e banho hidrodinâmico de líquor (LCR) com 1.200 partículas Bokeh flutuantes.

### 3. Validação Científica MNI152 e Orientação Anatômica
O sistema unifica rigorosamente o referencial estereotáxico MNI152 (`SCALE = 10.0`, sem giros arbitrários `rotation.y = -Math.PI / 2`):
* **Eixo `+Z`:** Anterior (Polo Frontal / Rosto);
* **Eixo `-Z`:** Posterior (Polo Occipital e Cerebelo);
* **Eixo `+Y`:** Superior / Dorsal;
* **Eixo `-Y`:** Inferior / Ventral;
* **Eixo `+X`:** **Hemisfério Cerebral Esquerdo Anatômico** (onde se localizam a Área de Broca `[+4.62, +0.50, +2.39]`, Área de Wernicke `[+4.89, -0.29, -1.41]`, Córtex Motor Primário M1 `[+3.79, +3.80, +0.43]`, Córtex Somatossensorial S1 `[+3.47, +3.65, -0.54]`, Córtex Auditivo A1 `[+4.76, -0.86, -0.12]` e Ínsula `[+3.55, -0.35, +0.60]`);
* **Eixo `-X`:** **Hemisfério Cerebral Direito Anatômico**.
Ao selecionar estruturas do hemisfério esquerdo, a câmera se posiciona lateral e anteriormente para visualização anatômica direta e desobstruída.

### 4. Simulador de 5 Patologias do SNC
Inclui controle em tempo real com botões de **`▶ Iniciar Simulação`**, **`⏸ Pausar`** e **`↺ Reiniciar SNC`**:
1. **Fisiologia Normal (SNC Hígido):** Ritmo gama de 40 Hz, condução saltatória perfeita, homeostase glutamatérgica e gabaérgica.
2. **Doença de Alzheimer (DA):** Atrofia seletiva córtico-hipocampal, placas senis de beta-amiloide Aβ42, emaranhados neurofibrilares de proteína Tau hiperfosforilada e colapso colinérgico.
3. **Doença de Parkinson (DP):** Degeneração dos neurônios dopaminérgicos da Substância Negra Pars Compacta e privação do corpo estriado com tremor de repouso em 4–6 Hz.
4. **AVC Isquêmico da Artéria Cerebral Média:** Infarto vascular na Área de Broca e M1 esquerdo, despolarização anóxica, excitotoxicidade maciça por glutamato e edema citotóxico.
5. **Esclerose Múltipla (EM):** Ataque autoimune desmielinizante nos tratos da medula espinhal e ponte com bloqueio da condução saltatória nos nódulos de Ranvier.
6. **Doença de Creutzfeldt-Jakob (DCJ — Príons):** Degeneração espongiforme fulminante, conversão autocatalítica PrPC $\to$ PrPSc, sinal talâmico do taco de hóquei e RT-QuIC positivo.

### 5. Navegação Reversível e Acessibilidade Total
* **Botão `🏠 Voltar à Visão Inicial (SNC)`:** Retorno suave em 0.9s à visão global do encéfalo e medula espinhal (`controls.target = (0, -25, 0)`, `camera.position = (65, 35, 220)`), acionado também pelas teclas `Escape` e `Home`.
* **Zoom Reversível com Mouse:** Scroll para trás (`dist > 38`) retorna automaticamente do microcosmo para o macro sem travar a câmera.
* **Acessibilidade WCAG AAA & VLibras:** Integração com o widget oficial do VLibras (`vlibras-plugin.js`), sincronizando cada fala da IA com legendas de alto contraste e tradução simultânea em Língua Brasileira de Sinais.

---

## 🇬🇧 British English

### 1. Project Overview
**MOZOK v2.0** (Ukrainian: *Мозок* — "Brain") is an open-access, high-precision three-dimensional atlas and multiscale pathophysiological simulator of the **Complete Human Central Nervous System** (Brain, Diencephalon, Brainstem, and Spinal Cord with cauda equina). Operating as a *"neuroanatomical Google Earth"*, it provides fluid and reversible navigation between macroscopic cortical topology and deep Layer V cellular microscopy.

### 2. Continuous Multiscale Architecture
* **Macro Scale (280–140 mm):** MNI152 cerebral cortex with sculpted sulci and gyri, foliated cerebellum, and continuous spinal cord descending to the conus medullaris and cauda equina.
* **Meso Scale (140–35 mm):** Real-time cortical shader transparency revealing 22 subcortical structures: Pulvinar Thalamus, C-curved Hippocampus with fornix, Amygdaloid Complex, Corpus Striatum, continuous Hypothalamus with infundibular stalk and bilobed pituitary gland, and unified Brainstem (Midbrain, Pons, and Medulla Oblongata with pyramids and olives).
* **Micro Scale (35–5 mm):** Dense connectome of **500 Layer V Neurons**: 36 hero pyramidal neurons with amber-gold confocal microscopy aesthetic, dark amber nucleus, bright gold nucleolus, 5th-order dendritic branching (Rall's Law), textured organic myelin sheaths, and electric-blue Nodes of Ranvier with real-time saltatory action potential propagation.
* **Nano Scale (< 5 mm):** Synaptic clefts featuring quantal neurotransmitter exocytosis and cerebrospinal fluid (CSF) hydrodynamics with 1,200 Brownian bokeh microparticles.

### 3. Validated MNI152 Stereotaxic Coordinate Frame
The framework strictly adheres to the standard MNI152 coordinate system (`SCALE = 10.0`, eliminating arbitrary `rotation.y = -Math.PI / 2` rotations):
* **`+Z` Axis:** Anterior (Frontal pole / Face);
* **`-Z` Axis:** Posterior (Occipital pole and Cerebellum);
* **`+Y` Axis:** Superior / Dorsal;
* **`-Y` Axis:** Inferior / Ventral;
* **`+X` Axis:** **Anatomical Left Cerebral Hemisphere** (housing Broca's Area `[+4.62, +0.50, +2.39]`, Wernicke's Area `[+4.89, -0.29, -1.41]`, Primary Motor Cortex M1 `[+3.79, +3.80, +0.43]`, Primary Somatosensory Cortex S1 `[+3.47, +3.65, -0.54]`, Primary Auditory Cortex A1 `[+4.76, -0.86, -0.12]`, and Insula `[+3.55, -0.35, +0.60]`);
* **`-X` Axis:** **Anatomical Right Cerebral Hemisphere**.
Selecting left hemisphere structures automatically orientates the camera from the lateral-anterior left aspect for unobstructed anatomical inspection.

### 4. Five-Disorder CNS Pathology Simulator
Equipped with top-bar controls (**`▶ Start Simulation`**, **`⏸ Pause`**, and **`↺ Reset CNS`**):
1. **Healthy Physiology:** 40 Hz gamma oscillations, robust saltatory conduction, balanced glutamatergic and GABAergic neurotransmission.
2. **Alzheimer's Disease:** Cortico-hippocampal atrophy, extracellular amyloid-beta Aβ42 senile plaques, hyperphosphorylated Tau neurofibrillary tangles, and cholinergic collapse.
3. **Parkinson's Disease:** Degeneration of pigmented dopaminergic neurons in the Substantia Nigra Pars Compacta with striatal dopamine denervation and 4–6 Hz rest tremor.
4. **Middle Cerebral Artery Ischaemic Stroke:** Thromboembolic infarction of Broca's area and left M1, anoxic depolarization, massive glutamate excitotoxicity, and cytotoxic oedema.
5. **Multiple Sclerosis:** Autoimmune inflammatory demyelination across spinal cord and brainstem tracts, impairing saltatory conduction across Nodes of Ranvier.
6. **Creutzfeldt-Jakob Disease (CJD — Prions):** Fulminant spongiform encephalopathy, autocatalytic PrPC $\to$ PrPSc conversion, pulvinar hockey-stick sign, and positive RT-QuIC.

### 5. Reversible Navigation & Accessibility
* **`🏠 Return to Home View (CNS)` Button:** Smooth 0.9s camera flight restoring full CNS view (`controls.target = (0, -25, 0)`, `camera.position = (65, 35, 220)`), also triggered via `Escape` or `Home` keys.
* **Reversible Scroll Zoom:** Scrolling backwards (`dist > 38`) smoothly transitions from micro to macro scale without camera locking.
* **WCAG AAA Compliance:** Integrated with AI speech synthesis and synchronous Brazilian Sign Language (VLibras) translation.

---

## 🇮🇹 Italiano

### 1. Visione Generale del Progetto
**MOZOK v2.0** (Ucraino: *Мозок* — "Cervello") è un atlante tridimensionale interattivo e simulatore fisiopatologico multiscala del **Sistema Nervoso Centrale Umano Completo** (Cervello, Diencefalo, Tronco Encefalico e Midollo Spinale con cauda equina). Concepito come un *"Google Earth neuroanatomico"*, consente una navigazione fluida e reversibile dalla macrostruttura corticale alla microscopia cellulare dello Strato V.

### 2. Architettura Multiscala Continua
* **Macro (280–140 mm):** Corteccia MNI152 con solchi e giri accurati, cervelletto e midollo spinale continuo fino al cono midollare.
* **Meso (140–35 mm):** Trasparenza corticale progressiva che rivela le 22 strutture sottocorticali: Talamo Pulvinar, Ippocampo a forma di C con fornice, Amigdala, Corpo Striato, Ipotalamo continuo con infundibolo e ipofisi bilobata, e Tronco Encefalico continuo (Mesencefalo, Ponte e Bulbo con piramidi e olive).
* **Micro (35–5 mm):** Connettoma denso di **500 Neuroni dello Strato V**: 36 neuroni piramidali hero in ambra dorata con diffusione subsuperficiale (SSS), nucleo ambrato scuro, nucleolo brillante, diramazioni di quinto ordine (Legge di Rall), guaine mieliniche organiche e nodi di Ranvier in blu elettrico brillante con potenziali d'azione saltatori in tempo reale.
* **Nano (< 5 mm):** Fessure sinaptiche con rilascio quantico di neurotrasmettitori e dinamica del liquido cefalorachidiano con 1.200 particelle colloidali fluttuanti.

### 3. Coordinate MNI152 e Orientamento Anatomico
* **Asse `+Z`:** Anteriore (Polo Frontale / Viso);
* **Asse `-Z`:** Posteriore (Polo Occipitale e Cervelletto);
* **Asse `+Y`:** Superiore / Dorsale;
* **Asse `-Y`:** Inferiore / Ventrale;
* **Asse `+X`:** **Emisfero Cerebrale Sinistro Anatomico** (Area di Broca `[+4.62, +0.50, +2.39]`, Area di Wernicke `[+4.89, -0.29, -1.41]`, Corteccia Motoria Primaria M1 `[+3.79, +3.80, +0.43]`);
* **Asse `-X`:** **Emisfero Cerebrale Destro Anatomico**.
La selezione delle strutture dell'emisfero sinistro orienta automaticamente la telecamera dal lato sinistro e anteriore per una visione chiara e diretta.

### 4. Simulatore di 5 Patologie del SNC
Pulsanti di controllo rapido: **`▶ Avvia Simulazione`**, **`⏸ Pausa`**, e **`↺ Ripristina SNC`**:
1. **Fisiologia Normale:** Ritmo gamma a 40 Hz, conduzione saltatoria ottimale, equilibrio glutammatergico e GABAergico.
2. **Malattia di Alzheimer:** Atrofia ippocampale, placche senili di beta-amiloide, grovigli neurofibrillari di proteina Tau e declino colinergico.
3. **Morbo di Parkinson:** Degenerazione dei neuroni dopaminergici della Substantia Nigra Pars Compacta e tremore a riposo a 4–6 Hz.
4. **Ictus Ischemico dell'Arteria Cerebrale Media:** Infarto nell'area di Broca e M1 sinistro con eccitotossicità da glutammato ed edema citotossico.
5. **Sclerosi Multipla:** Demielinizzazione autoimmune nei tratti del midollo spinale e del tronco encefalico.
6. **Malattia di Creutzfeldt-Jakob (CJD — Prioni):** Encefalopatia spongiforme a progressione rapida, conversione conformazionale PrPC $\to$ PrPSc e RT-QuIC positivo.

### 5. Navigazione Reversibile e Accessibilità
* **Pulsante `🏠 Torna alla Vista Iniziale (SNC)`:** Volo di 0,9 secondi che ripristina la visuale completa del SNC (`controls.target = (0, -25, 0)`, `camera.position = (65, 35, 220)`), attivabile anche con i tasti `Escape` e `Home`.
* **Zoom Reversibile:** Lo zoom all'indietro (`dist > 38`) ritorna automaticamente dal micro al macro senza bloccare la telecamera.

---

## 🇺🇦 Українська (Кирилиця)

### 1. Загальний огляд проєкту
**МОЗОК v2.0** — відкритий інтерактивний тривимірний атлас високої точності та багатомасштабний фізіологічний симулятор **Повної центральної нервової системи людини** (головний мозок, проміжний мозок, стовбур мозку та спинний мозок із кінським хвостом). Проєкт функціонує як *"нейроанатомічний Google Earth"*, забезпечуючи плавний і зворотний перехід від макроскопічної топографії кори до глибинної мікроскопії V шару кори.

### 2. Безперервна багатомасштабна архітектура
* **Макрорівень (280–140 мм):** Кора головного мозку MNI152 з анатомічними борознами та звивинами, мозочок і суцільний спинний мозок до мозкового конуса та корінців кінського хвоста.
* **Мезорівень (140–35 мм):** Прогресивна прозорість кори через шейдери, що відкриває 22 підкіркові структури: таламус із подушкою, С-подібний гіпокамп зі склепінням, мигдалеподібний комплекс, смугасте тіло, гіпоталамус із лійкою та двочастковим гіпофізом, а також стовбур мозку (середній мозок, міст і довгастий мозок із пірамідами й оливами).
* **Мікрорівень (35–5 мм):** Щільний конектом із **500 нейронів V шару**: 36 головних пірамідних нейронів у бурштиново-золотій естетиці конфокальної мікроскопії, темне бурштинове ядро, яскраве ядерце, розгалуження 5-го порядку (закон Ралла), текстуровані органічні мієлінові оболонки та електрично-сині перехопи Ранв'є із сальтаторним проведенням потенціалів дії в реальному часі.
* **Нанорівень (< 5 мм):** Синаптичні щілини з квантовим вивільненням нейромедіаторів і гідродинамікою ліквору з 1 200 мікрочастинками Боке.

### 3. Наукова валідація координат MNI152 та орієнтація півкуль
Система суворо уніфікує стереотаксичну систему MNI152 (`SCALE = 10.0` без довільних поворотів):
* **Вісь `+Z`:** Передній полюс (лобовий полюс / обличчя);
* **Вісь `-Z`:** Задній полюс (потиличний полюс і мозочок);
* **Вісь `+Y`:** Верхній / дорсальний напрямок;
* **Вісь `-Y`:** Нижній / вентральний напрямок;
* **Вісь `+X`:** **Анатомічна ліва півкуля головного мозку** (де розташовані зона Брока `[+4.62, +0.50, +2.39]`, зона Верніке `[+4.89, -0.29, -1.41]`, первинна моторна кора M1 `[+3.79, +3.80, +0.43]`, первинна соматосенсорна кора S1 `[+3.47, +3.65, -0.54]`, первинна слухова кора A1 `[+4.76, -0.86, -0.12]` та острівець `[+3.55, -0.35, +0.60]`);
* **Вісь `-X`:** **Анатомічна права півкуля головного мозку**.
Під час вибору структур лівої півкулі камера автоматично розташовується з лівого передньо-бокового боку для прямого анатомічного огляду.

### 4. Симулятор 5 патологій ЦНС
Керування за допомогою кнопок **`▶ Запустити симуляцію`**, **`⏸ Пауза`** та **`↺ Скинути ЦНС`**:
1. **Нормальна фізіологія:** Гамма-ритм 40 Гц, бездоганне сальтаторне проведення, баланс глутамату та ГАМК.
2. **Хвороба Альцгеймера:** Селективна атрофія гіпокампа, сенильні бляшки бета-амілоїду, нейрофібрилярні клубки Тау-білка та холінергічний колапс.
3. **Хвороба Паркінсона:** Загибель дофамінергічних нейронів чорної речовини, дефіцит дофаміну в смугастому тілі та тремор спокою 4–6 Гц.
4. **Ішемічний інсульт середньої мозкової артерії:** Інфаркт у зоні Брока та моторній корі з масивною глутаматною ексайтотоксичністю та цитотоксичним набряком.
5. **Розсіяний склероз:** Автоімунна демієлінізація у провідних шляхах спинного мозку та стовбура з блокуванням проведення в перехопах Ранв'є.
6. **Хвороба Кройтцфельдта — Якоба (ХКЯ — Пріони):** Блискавична спонгіформна дегенерація, автокаталітична конверсія PrPC $\to$ PrPSc, симптом хокейної ключки в таламусі та позитивний тест RT-QuIC.

### 5. Зворотна навігація та доступність
* **Кнопка `🏠 Повернутися до початкового вигляду (ЦНС)`:** Плавний політ за 0,9 с до загального огляду ЦНС (`controls.target = (0, -25, 0)`, `camera.position = (65, 35, 220)`), що також активується клавішами `Escape` та `Home`.
* **Зворотне масштабування колесом миші:** Віддалення (`dist > 38`) плавно повертає з мікросвіту до макрорівня без блокування камери.
* **Синтез мовлення та доступність:** Підтримка озвучення українською мовою та сумісність зі стандартами WCAG AAA.

---

## 🇪🇸 Español

### 1. Visión General del Proyecto
**MOZOK v2.0** (Ucraniano: *Мозок* — "Cerebro") es un atlas tridimensional interactivo de alta precisión y simulador fisiopatológico multiescala del **Sistema Nervioso Central Humano Completo** (Encéfalo, Diencéfalo, Tronco Encefálico y Médula Espinal con cauda equina). Diseñado como un *"Google Earth neuroanatómico"*, permite navegar de forma continua y reversible entre la macroanatomía cortical y la microscopía celular de la Capa V.

### 2. Arquitectura Multiescala Continua
* **Macro (280–140 mm):** Corteza cerebral MNI152 con giros y surcos esculpidos, cerebelo y médula espinal continua que desciende hasta el cono medular y la cauda equina.
* **Meso (140–35 mm):** Transparencia cortical progresiva mediante shader que revela 22 estructuras subcorticales: Tálamo Pulvinar, Hipocampo en arco C con fórnix, Complejo Amigdalino, Cuerpo Estriado, Hipotálamo continuo con infundíbulo e hipófisis bilobulada, y Tronco Encefálico unificado (Mesencéfalo, Puente y Bulbo con pirámides y olivas).
* **Micro (35–5 mm):** Conectoma denso de **500 Neuronas de la Capa V**: 36 neuronas piramidales principales en ámbar dorado con dispersión subsuperficial (SSS), núcleo ámbar oscuro, nucléolo dorado brillante, ramificación de quinto orden (Ley de Rall), vainas de mielina orgánicas texturizadas y nódulos de Ranvier en azul eléctrico con potenciales de acción saltatorios en tiempo real.
* **Nano (< 5 mm):** Hendiduras sinápticas con liberación cuántica de neurotransmisores y dinámica del líquido cefalorraquídeo con 1.200 partículas coloidales flotantes.

### 3. Validación Científica MNI152 y Orientación Anatómica
* **Eje `+Z`:** Anterior (Polo Frontal / Rostro);
* **Eje `-Z`:** Posterior (Polo Occipital y Cerebelo);
* **Eje `+Y`:** Superior / Dorsal;
* **Eje `-Y`:** Inferior / Ventral;
* **Eje `+X`:** **Hemisferio Cerebral Izquierdo Anatómico** (Área de Broca `[+4.62, +0.50, +2.39]`, Área de Wernicke `[+4.89, -0.29, -1.41]`, Corteza Motora Primaria M1 `[+3.79, +3.80, +0.43]`, Corteza Somatosensorial S1 `[+3.47, +3.65, -0.54]`, Corteza Auditiva A1 `[+4.76, -0.86, -0.12]` e Ínsula `[+3.55, -0.35, +0.60]`);
* **Eje `-X`:** **Hemisferio Cerebral Derecho Anatómico**.
Al seleccionar estructuras del hemisferio izquierdo, la cámara se orienta desde la vista lateral y anterior izquierda para una inspección anatómica directa y despejada.

### 4. Simulador de 5 Patologías del SNC
Control inmediato mediante botones: **`▶ Iniciar Simulación`**, **`⏸ Pausar`** y **`↺ Reiniciar SNC`**:
1. **Fisiología Normal:** Ritmo gamma de 40 Hz, conducción saltatoria íntegra, equilibrio de glutamato y GABA.
2. **Enfermedad de Alzheimer:** Atrofia cortico-hipocampal, placas seniles de beta-amiloide Aβ42, ovillos neurofibrilares de proteína Tau y colapso colinérgico.
3. **Enfermedad de Parkinson:** Muerte de neuronas dopaminérgicas de la Sustancia Negra Pars Compacta y temblor de reposo de 4–6 Hz.
4. **Ictus Isquémico de la Arteria Cerebral Media:** Infarto en el Área de Broca y M1 izquierdo con excitotoxicidad por glutamato y edema citotóxico.
5. **Esclerosis Múltiple:** Desmielinización autoinmune en las vías de la médula espinal y el tronco encefálico.
6. **Enfermedad de Creutzfeldt-Jakob (ECJ — Priones):** Degeneración espongiforme fulminante, conversión PrPC $\to$ PrPSc, signo talámico del palo de hockey y RT-QuIC positivo.

### 5. Navegación Reversible y Accesibilidad Total
* **Botón `🏠 Voltar à Visão Inicial (SNC)`:** Vuelo suave de 0,9 s que restablece la vista completa del SNC (`controls.target = (0, -25, 0)`, `camera.position = (65, 35, 220)`), también accionable con las teclas `Escape` o `Inicio`.
* **Desbloqueo del Zoom con Rueda del Ratón:** Al girar la rueda hacia atrás (`dist > 38`), la cámara transiciona suavemente del microcosmo al macrocosmos sin bloquearse.
* **Accesibilidad WCAG AAA y Síntesis de Voz:** Locución por voz IA sincronizada en los 5 idiomas y subtítulos de alto contraste.

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
