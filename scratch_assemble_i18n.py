import re

with open('web/js/mozok-i18n.js', 'r', encoding='utf-8') as f:
    orig_text = f.read()

# UI Block
ui_start = orig_text.find('ui: {')
struct_start = orig_text.find('structures: {')
ui_block = orig_text[ui_start:struct_start].strip()
if ui_block.endswith(','):
    ui_block = ui_block[:-1].strip()

ui_block = ui_block.replace("structureCount: '22 Estruturas'", "structureCount: '31 Estruturas'")
ui_block = ui_block.replace("structureCount: '22 Structures'", "structureCount: '31 Structures'")
ui_block = ui_block.replace("structureCount: '22 Strutture'", "structureCount: '31 Strutture'")
ui_block = ui_block.replace("structureCount: '22 структури'", "structureCount: '31 структура'")
ui_block = ui_block.replace("structureCount: '22 Estructuras'", "structureCount: '31 Estructuras'")

def extract_struct_block(text, sid):
    pattern = r'(?m)^\s*' + str(sid) + r':\s*\{'
    m = re.search(pattern, text)
    if not m:
        return None
    start = m.start()
    brace_count = 0
    in_str = False
    quote_char = ''
    end = start
    for idx in range(start, len(text)):
        ch = text[idx]
        if ch in ('"', "'", '`') and (idx == 0 or text[idx-1] != '\\'):
            if not in_str:
                in_str = True
                quote_char = ch
            elif quote_char == ch:
                in_str = False
        elif not in_str:
            if ch == '{':
                brace_count += 1
            elif ch == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = idx + 1
                    break
    block = text[start:end]
    # strip leading number and colon, e.g. "14: {"
    colon_idx = block.find(':')
    inner = block[colon_idx+1:].strip()
    return inner

# Extract original blocks
orig_blocks = {}
for i in range(1, 23):
    b = extract_struct_block(orig_text, i)
    if b:
        orig_blocks[i] = b

# New structure blocks
new_struct_14 = """{
        'pt-BR': {
          name: 'Globo Pálido (Segmentos Interno GPi e Externo GPe)',
          category: 'NÚCLEOS DA BASE',
          functionText: 'Principal núcleo eferente dos gânglios da base, regulação do tônus postural e controle inibitório sobre o tálamo motor (via direta vs indireta).',
          clinicalText: 'Distonia primária, atetose, discinesias induzidas por L-DOPA e alvo preferencial de Estimulação Cerebral Profunda (DBS) no Parkinson.',
          neurotransmitter: 'GABAérgico inibitório com Substância P (GPi) ou Encefalina (GPe)',
          audioScript: 'O Globo Pálido divide-se em segmento interno e externo. O GPi atua como o freio inibitório primário dos gânglios da base sobre o tálamo motor, modulando a postura e a precisão motora.'
        },
        'en-GB': {
          name: 'Globus Pallidus (Internal GPi & External GPe Segments)',
          category: 'BASAL GANGLIA',
          functionText: 'Primary output nucleus of the basal ganglia, postural tone regulation, and tonic inhibitory gating over the motor thalamus.',
          clinicalText: 'Primary dystonia, athetosis, L-DOPA-induced dyskinesias, and optimal surgical target for Deep Brain Stimulation (DBS) in Parkinson’s disease.',
          neurotransmitter: 'Inhibitory GABAergic transmission, Substance P (GPi), and Enkephalin (GPe)',
          audioScript: 'The Globus Pallidus comprises internal and external segments. GPi serves as the primary inhibitory brake of the basal ganglia upon the motor thalamus, refining posture and smooth motor execution.'
        },
        'it-IT': {
          name: 'Globo Pallido (Segmenti Interno GPi ed Esterno GPe)',
          category: 'NUCLEI DELLA BASE',
          functionText: 'Principale nucleo efferente dei gangli della base, regolazione del tono posturale e controllo inibitorio sul talamo motorio.',
          clinicalText: 'Distonia primaria, atetosi, discinesie da levodopa e bersaglio per la stimolazione cerebrale profonda (DBS) nel Parkinson.',
          neurotransmitter: 'GABAergico inibitorio con Sostanza P ed Encefalina',
          audioScript: 'Il Globo Pallido costituisce il freno inibitorio fondamentale dei gangli della base, regolando la precisione dei movimenti e la postura corporea.'
        },
        'uk-UA': {
          name: 'Бліда куля (Внутрішній GPi та зовнішній GPe сегменти)',
          category: 'БАЗАЛЬНІ ЯДРА',
          functionText: 'Головне вихідне ядро базальних гангліїв, регуляція м’язового тонусу та тонічне гальмування рухового таламуса.',
          clinicalText: 'Первинна дистонія, атетоз, леводопа-індуковані дискінезії та мішень для глибокої стимуляції мозку (DBS) при паркінсонізмі.',
          neurotransmitter: 'ГАМК-гальмування, речовина P та енкефалін',
          audioScript: 'Бліда куля ділиться на внутрішній та зовнішній сегменти, діючи як первинне гальмо рухових команд на шляху до таламуса.'
        },
        'es-ES': {
          name: 'Globo Pálido (Segmentos Interno GPi y Externo GPe)',
          category: 'NÚCLEOS DE LA BASE',
          functionText: 'Principal núcleo eferente de los ganglios basales, regulación del tono postural y freno inhibidor sobre el tálamo motor.',
          clinicalText: 'Distonía primaria, atetosis, discinesias por levodopa y diana para estimulación cerebral profunda (DBS) en Parkinson.',
          neurotransmitter: 'GABAérgico inhibitorio, Sustancia P y Encefalina',
          audioScript: 'El Globo Pálido regula la postura y la fluidez del movimiento actuando como el freno inhibidor de los ganglios basales sobre el tálamo.'
        }
      }"""

new_struct_15 = """{
        'pt-BR': {
          name: 'Corpo Caloso (Esplênio, Tronco, Joelho e Rostro)',
          category: 'SUBSTÂNCIA BRANCA',
          functionText: 'Maior comissura inter-hemisférica (~200 milhões de axônios mielinizados), transferência de informações e integração bilateral.',
          clinicalText: 'Síndrome da desconexão inter-hemisférica, apraxia da mão esquerda, agenesia de corpo caloso e calosotomia para epilepsia intratável.',
          neurotransmitter: 'L-Glutamato excitatório nas projeções axonais córtico-corticais',
          audioScript: 'O Corpo Caloso é a colossal ponte de substância branca que une os dois hemisférios cerebrais com mais de duzentos milhões de fibras axonais mielinizadas.'
        },
        'en-GB': {
          name: 'Corpus Callosum (Splenium, Body, Genu & Rostrum)',
          category: 'WHITE MATTER',
          functionText: 'Principal interhemispheric commissure (~200 million myelinated axons), interhemispheric transfer of sensorimotor and cognitive data.',
          clinicalText: 'Alien hand syndrome, callosal disconnection syndrome, agenesis of the corpus callosum, and therapeutic corpus callosotomy.',
          neurotransmitter: 'Excitatory L-Glutamate in corticocortical commissural projections',
          audioScript: 'The Corpus Callosum is the colossal white-matter bridge uniting the cerebral hemispheres with over two hundred million densely packed myelinated fibres.'
        },
        'it-IT': {
          name: 'Corpo Calloso (Splenio, Tronco, Ginocchio e Rostro)',
          category: 'SOSTANZA BIANCA',
          functionText: 'Principale commessura interemisferica con oltre 200 milioni di fibre mielinizzate per l integrazione tra i due emisferi.',
          clinicalText: 'Sindrome da disconnessione callosale, mano aliena, agenesia del corpo calloso e callosotomia chirurgica.',
          neurotransmitter: 'L-Glutammato eccitatorio nelle fibre commessurali',
          audioScript: 'Il Corpo Calloso collega i due emisferi cerebrali consentendo la condivisione istantanea di memorie, abilità e percezioni.'
        },
        'uk-UA': {
          name: 'Мозолисте тіло (Валик, стовбур, коліно та дзьоб)',
          category: 'БІЛА РЕЧОВИНА',
          functionText: 'Головна міжпівкульна комісура (понад 200 мільйонів мієлінізованих аксонів), синхронізація роботи правої та лівої півкуль.',
          clinicalText: 'Синдром розщепленого мозку (міжпівкульної дисконексії), синдром чужої руки та агенезія мозолистого тіла.',
          neurotransmitter: 'Глутамат у комісуральних шляхах',
          audioScript: 'Мозолисте тіло — це найпотужніший міст білої речовини, що об’єднує обидві півкулі мозку в єдиний злагоджений центр.'
        },
        'es-ES': {
          name: 'Cuerpo Calloso (Esplenio, Tronco, Rodilla y Rostro)',
          category: 'SUSTANCIA BLANCA',
          functionText: 'Mayor comisura interhemisférica (~200 millones de axones mielinizados) para la transferencia de información bilateral.',
          clinicalText: 'Síndrome de desconexión callosa, síndrome de la mano alienígena y agenesia del cuerpo calloso.',
          neurotransmitter: 'L-Glutamato excitador en proyecciones comisurales',
          audioScript: 'El Cuerpo Calloso es el puente de sustancia blanca más voluminoso del encéfalo, coordinando ambos hemisferios cerebrales.'
        }
      }"""

new_struct_18 = """{
        'pt-BR': {
          name: 'Quiasma Óptico e Tratos Ópticos',
          category: 'VIA VISUAL',
          functionText: 'Decussação seletiva das fibras retinianas nasais (53% dos axônios do NC II) para garantir a visão binocular estereoscópica e tridimensional.',
          clinicalText: 'Hemianopsia bitemporal clássica por compressão de adenoma hipofisário no quiasma, neurite óptica desmielinizante na Esclerose Múltipla.',
          neurotransmitter: 'L-Glutamato excitatório nos axônios das células ganglionares da retina',
          audioScript: 'No Quiasma Óptico, as fibras originadas nas hemirretinas nasais cruzam para o lado oposto, permitindo que cada hemisfério cerebral enxergue o hemicampo visual contralateral completo.'
        },
        'en-GB': {
          name: 'Optic Chiasm & Optic Tracts',
          category: 'VISUAL PATHWAY',
          functionText: 'Selective hemidecussation of nasal retinal fibres (53% of CN II axons) establishing stereoscopic binocular vision.',
          clinicalText: 'Bitemporal hemianopia from pituitary macroadenoma compression; optic neuritis in multiple sclerosis.',
          neurotransmitter: 'Excitatory L-Glutamate in retinal ganglion cell axons',
          audioScript: 'At the Optic Chiasm, fibres originating in the nasal hemiretinae cross the midline, allowing each cerebral hemisphere to reconstruct the complete contralateral visual hemifield.'
        },
        'it-IT': {
          name: 'Chiasma Ottico e Tratti Ottici',
          category: 'VIA VISIVA',
          functionText: 'Decussazione selettiva delle fibre retiniche nasali per la visione binoculare e stereoscopica.',
          clinicalText: 'Emianopsia bitemporale per adenoma ipofisario e neurite ottica nella sclerosi multipla.',
          neurotransmitter: 'L-Glutammato dalle cellule gangliari retiniche',
          audioScript: 'Nel Chiasma Ottico le fibre nasali della retina si incrociano, permettendo al cervello di fondere le due immagini in una visione tridimensionale.'
        },
        'uk-UA': {
          name: 'Зорове перехрестя (Хіазма) та зорові тракти',
          category: 'ЗОРОВИЙ ШЛЯХ',
          functionText: 'Селективне перехрещення назальних волокон сітківки для забезпечення бінокулярного об’ємного зору.',
          clinicalText: 'Бітемпоральна гетеронімна геміанопсія при стисненні аденомою гіпофіза; неврит зорового нерва при розсіяному склерозі.',
          neurotransmitter: 'Глутамат в аксонах гангліонарних клітин',
          audioScript: 'У зоровому перехресті волокна від носових половин сітківки переходять на протилежний бік, створюючи об ємне тривимірне сприйняття світу.'
        },
        'es-ES': {
          name: 'Quiasma Óptico y Tractos Ópticos',
          category: 'VÍA VISUAL',
          functionText: 'Decusación selectiva de las fibras retinianas nasales para garantizar la visión binocular estereoscópica.',
          clinicalText: 'Hemianopsia bitemporal por compresión de adenomas hipofisarios y neuritis óptica en esclerosis múltiple.',
          neurotransmitter: 'L-Glutamato excitador en axones de las células ganglionares',
          audioScript: 'En el Quiasma Óptico las fibras nasales de la retina cruzan la línea media, permitiendo una visión estereoscópica coordinada.'
        }
      }"""

new_struct_19 = """{
        'pt-BR': {
          name: 'Sistema Ventricular Completo (Laterais, III, Aqueduto e IV Ventrículo)',
          category: 'SISTEMA LIQUÓRICO',
          functionText: 'Produção diária de ~500 mL de líquor pelos plexos corióideos, circulação crânio-caudal, flutuabilidade mecânica e drenagem glinfática.',
          clinicalText: 'Hidrocefalia obstrutiva por estenose do aqueduto de Sylvius, hidrocefalia de pressão normal (HPN: tríade de Hakim-Adams) e meningites.',
          neurotransmitter: 'Homeostase iônica liquórica (Na+, K+, Cl- e Clivagem de Neuropeptídeos)',
          audioScript: 'O Sistema Ventricular constitui a rede de câmaras internas preenchidas por líquor, garantindo a proteção mecânica, o amortecimento gravitacional e a limpeza metabólica do SNC.'
        },
        'en-GB': {
          name: 'Ventricular System (Lateral, Third, Aqueduct & Fourth Ventricles)',
          category: 'VENTRICULAR & CSF SYSTEM',
          functionText: 'Synthesis of ~500 mL/day of cerebrospinal fluid (CSF) by choroid plexuses, craniocaudal bulk flow, buoyant cushioning, and glymphatic clearance.',
          clinicalText: 'Non-communicating hydrocephalus from aqueductal stenosis; normal pressure hydrocephalus (Hakim-Adams triad); ventricular shunt failure.',
          neurotransmitter: 'Ionic cerebrospinal homeostasis (Na+, K+, Cl- transport) and glymphatic neuropeptide exchange',
          audioScript: 'The Ventricular System is the internal hydraulic chamber network lined by ependyma and choroid plexuses, producing cerebrospinal fluid that cushions the brain and clears metabolic waste.'
        },
        'it-IT': {
          name: 'Sistema Ventricolare Completo (Laterali, III, Acquedotto e IV Ventricolo)',
          category: 'SISTEMA LIQUORALE',
          functionText: 'Produzione di circa 500 mL al giorno di liquor dai plessi corioidei, protezione meccanica e drenaggio glinfatico.',
          clinicalText: 'Idrocefalo ostruttivo da stenosi dell acquedotto di Silvio, idrocefalo normoteso e meningiti.',
          neurotransmitter: 'Omeostasi idroelettrolitica del liquor',
          audioScript: 'Il Sistema Ventricolare fa circolare il liquido cefalorachidiano che protegge il cervello dai traumi e ne rimuove i cataboliti metabolici.'
        },
        'uk-UA': {
          name: 'Шлуночкова система (Бічні, III, водопровід та IV шлуночок)',
          category: 'ЛІКВОРНА СИСТЕМА',
          functionText: 'Продукція ~500 мл ліквору на добу судинними сплетеннями, амортизація та глімфатичне очищення мозку.',
          clinicalText: 'Оклюзійна гідроцефалія при стенозі сильвієвого водопроводу; нормотензивна гідроцефалія (тріада Хакіма-Адамса).',
          neurotransmitter: 'Іонний гомеостаз ліквору та нейропептиди',
          audioScript: 'Шлуночкова система утворює внутрішнє гідравлічне русло мозку, забезпечуючи механічний захист та видалення токсичних метаболітів.'
        },
        'es-ES': {
          name: 'Sistema Ventricular Completo (Laterales, III, Acueducto y IV Ventrículo)',
          category: 'SISTEMA LIQUORAL',
          functionText: 'Producción de ~500 mL diarios de LCR por los plexos coroideos, flotabilidad mecánica y aclaramiento glinfático.',
          clinicalText: 'Hidrocefalia obstructiva por estenosis del acueducto e hidrocefalia normotensiva (tríada de Hakim-Adams).',
          neurotransmitter: 'Homeostasis iónica del líquido cefalorraquídeo',
          audioScript: 'El Sistema Ventricular distribuye el líquido cefalorraquídeo amortiguando el encéfalo y depurando los desechos metabólicos.'
        }
      }"""

new_struct_23 = """{
        'pt-BR': {
          name: 'Nervos Cranianos (I ao XII: Olfatório ao Hipoglosso)',
          category: 'NERVOS CRANIANOS',
          functionText: 'Doze pares de nervos que emergem do encéfalo e tronco encefálico para inervação sensitiva especial, motora somática e parassimpática da cabeça e pescoço.',
          clinicalText: 'Paralisia de Bell (NC VII), nevralgia do trigêmeo (NC V), oftalmoplegias (NC III/IV/VI) e síndrome bulbar progressiva na ELA.',
          neurotransmitter: 'Acetilcolina motora e parassimpática, Glutamato e Substância P sensitivos',
          audioScript: 'Os doze pares de nervos cranianos constituem as pontes diretas de comando sensorial, mímico, mastigatório e autônomo entre o tronco encefálico e todos os órgãos dos sentidos.'
        },
        'en-GB': {
          name: 'Cranial Nerves (I to XII: Olfactory to Hypoglossal)',
          category: 'CRANIAL NERVES',
          functionText: 'Twelve pairs of peripheral cranial nerves carrying special sensory, somatic motor, and parasympathetic visceral innervation to the head and neck.',
          clinicalText: 'Bell’s palsy (CN VII), trigeminal neuralgia (CN V), cranial oculomotor nerve palsies (CN III/IV/VI), and bulbar amyotrophic lateral sclerosis.',
          neurotransmitter: 'Somatic and parasympathetic Acetylcholine, Glutamate, and Substance P',
          audioScript: 'The twelve pairs of cranial nerves mediate vision, audition, facial expression, mastication, swallowing, and vagal autonomic regulation directly from the brainstem.'
        },
        'it-IT': {
          name: 'Nervi Cranici (I-XII: dall Olfattivo all Ipoglosso)',
          category: 'NERVI CRANICI',
          functionText: 'Dodici paia di nervi che emergono dall encefalo e dal tronco per la sensibilità speciale, motilità e parasimpatico cranico.',
          clinicalText: 'Paralisi di Bell (VII), nevralgia del trigemino (V) e paralisi oculomotorie (III, IV, VI).',
          neurotransmitter: 'Acetilcolina motoria e Glutammato sensitivo',
          audioScript: 'I dodici nervi cranici controllano i sensi speciali, la mimica facciale, la deglutizione e gli organi viscerali.'
        },
        'uk-UA': {
          name: 'Черепні нерви (I–XII: від нюхового до під’язикового)',
          category: 'ЧЕРЕПНІ НЕРВИ',
          functionText: 'Дванадцять пар нервів, що іннервують органи чуття, мімічні м’язи, гортань, язик та внутрішні органи.',
          clinicalText: 'Параліч Белла (VII), невралгія трійчастого нерва (V), окорухові порушення та бульбарний синдром при БАС.',
          neurotransmitter: 'Ацетилхолін та глутамат',
          audioScript: 'Дванадцять пар черепних нервів керують зором, слухом, мімікою обличчя, ковтанням та парасимпатичними рефлексами.'
        },
        'es-ES': {
          name: 'Nervios Craneales (I al XII: Olfatorio al Hipogloso)',
          category: 'NERVIOS CRANEALES',
          functionText: 'Doce pares craneales para la inervación sensorial, motora somática y parasimpática de la cabeza, cuello y vísceras.',
          clinicalText: 'Parálisis facial de Bell (NC VII), neuralgia del trigémino (NC V) y oftalmoplejías (NC III/IV/VI).',
          neurotransmitter: 'Acetilcolina motora y Glutamato sensitivo',
          audioScript: 'Los doce pares de nervios craneales conectan el tronco encefálico con los órganos de los sentidos, la cara y el aparato fonador.'
        }
      }"""

new_struct_27 = """{
        'pt-BR': {
          name: 'SNP — Plexo Cervical (C1–C4) e Nervo Frênico (C3–C5)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Inervação motora diafragmática vital via Nervo Frênico (C3–C5), alça cervical e sensibilidade do pescoço e nuca.',
          clinicalText: 'Paralisia diafragmática por lesão medular alta (C1–C3) exigindo ventilação mecânica, nevralgia occipital e soluço intratável.',
          neurotransmitter: 'Acetilcolina na placa motora e Glutamato sensorial',
          audioScript: 'O Plexo Cervical e o Nervo Frênico emergem das raízes cervicais superiores, conduzindo o comando motor essencial para o diafragma e a respiração.'
        },
        'en-GB': {
          name: 'PNS — Cervical Plexus (C1–C4) & Phrenic Nerve (C3–C5)',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Vital motor innervation to the thoracic diaphragm via the Phrenic Nerve (C3–C5), ansa cervicalis, and sensory innervation of neck and occiput.',
          clinicalText: 'Diaphragmatic paralysis following high cervical spinal cord injury (C1–C3); occipital neuralgia; intractable singultus.',
          neurotransmitter: 'Neuromuscular Acetylcholine and sensory Glutamate',
          audioScript: 'The Cervical Plexus and Phrenic Nerve descend through the neck and thoracic cavity to sustain pulmonary ventilation by contracting the diaphragm.'
        },
        'it-IT': {
          name: 'SNP — Plesso Cervicale (C1–C4) e Nervo Frenico (C3–C5)',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)' ,
          functionText: 'Innervazione motoria del diaframma tramite il nervo frenico (C3–C5) e sensibilità cutanea del collo.',
          clinicalText: 'Paralisi diaframmatica da lesione cervicale alta, nevralgia occipitale e insufficienza respiratoria.',
          neurotransmitter: 'Acetilcolina neuromuscolare',
          audioScript: 'Il Plesso Cervicale genera il nervo frenico, fondamentale per contrarre il diaframma e permettere la respirazione polmonare.'
        },
        'uk-UA': {
          name: 'ПНС — Шийне сплетення (C1–C4) та діафрагмальний нерв (C3–C5)',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Життєво важлива моторна іннервація діафрагми через діафрагмальний нерв (C3–C5) та чутливість шиї.',
          clinicalText: 'Параліч діафрагми при високій травмі шийного відділу (C1–C3); потилична невралгія.',
          neurotransmitter: 'Ацетилхолін нервово-м’язових синапсів',
          audioScript: 'Шийне сплетення та діафрагмальний нерв посилають імпульси до діафрагми, забезпечуючи кожен вдих і видих.'
        },
        'es-ES': {
          name: 'SNP — Plexo Cervical (C1–C4) y Nervio Frénico (C3–C5)',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Inervación motora vital del diafragma mediante el nervio frénico (C3–C5) y sensibilidad de la nuca y cuello.',
          clinicalText: 'Parálisis diafragmática por lesión cervical alta, neuralgia occipital y disnea.',
          neurotransmitter: 'Acetilcolina neuromuscular',
          audioScript: 'El Plexo Cervical origina el nervio frénico, que desciende hacia el diafragma garantizando la respiración pulmonar.'
        }
      }"""

new_struct_28 = """{
        'pt-BR': {
          name: 'SNP — Plexo Braquial (C5–T1) e Nervos Mediano, Ulnar, Radial e Axilar',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Complexo de raízes, troncos, divisões e fascículos que comandam toda a motricidade e sensibilidade do membro superior.',
          clinicalText: 'Paralisia obstétrica de Erb-Duchenne (C5–C6), paralisia de Klumpke (C8–T1) e Síndrome do Túnel do Carpo no nervo mediano.',
          neurotransmitter: 'Acetilcolina motora, Substância P e CGRP sensoriais',
          audioScript: 'O Plexo Braquial distribui-se das raízes C5 a T1 pelos troncos e fascículos axilares para originar os nervos mediano, ulnar e radial para o braço e mão.'
        },
        'en-GB': {
          name: 'PNS — Brachial Plexus (C5–T1) & Upper Limb Nerves',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Somatic sensorimotor network of roots, trunks, divisions, and cords innervating the shoulder, arm, forearm, and hand.',
          clinicalText: 'Erb-Duchenne palsy (upper trunk C5–C6), Klumpke palsy (lower trunk C8–T1), and carpal tunnel syndrome.',
          neurotransmitter: 'Somatic motor Acetylcholine, Substance P, and CGRP',
          audioScript: 'The Brachial Plexus emerges from the cervical enlargement to supply fine motor control and tactile sensitivity to the entire upper limb.'
        },
        'it-IT': {
          name: 'SNP — Plesso Brachiale (C5–T1) e Nervi dell Arto Superiore',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Rete nervosa che controlla la motilità fine della mano, la forza del braccio e la sensibilità dell arto superiore.',
          clinicalText: 'Paralisi di Erb-Duchenne, paralisi di Klumpke e sindrome del tunnel carpale.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Plesso Brachiale coordina i movimenti delle braccia e delle dita tramite i nervi mediano, radiale e ulnare.'
        },
        'uk-UA': {
          name: 'ПНС — Плечове сплетення (C5–T1) та нерви верхньої кінцівки',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Складне сплетення стовбурів та пучків, що забезпечує точні рухи кисті, пальців та чутливість руки.',
          clinicalText: 'Параліч Ерба-Дюшенна (C5–C6), параліч Дежерін-Клюмпке (C8–T1) та синдром зап’ястного каналу.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Плечове сплетення розгалужується на серединний, ліктьовий та променевий нерви, керуючи кожним рухом руки.'
        },
        'es-ES': {
          name: 'SNP — Plexo Braquial (C5–T1) y Nervios del Miembro Superior',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Red de troncos y fascículos que inerva motora y sensitivamente el hombro, brazo, antebrazo y mano.',
          clinicalText: 'Parálisis de Erb-Duchenne (C5–C6), parálisis de Klumpke (C8–T1) y síndrome del túnel carpiano.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Plexo Braquial origina los nervios mediano, radial y cubital para gobernar la motricidad fina de la mano y el brazo.'
        }
      }"""

new_struct_29 = """{
        'pt-BR': {
          name: 'SNP Autônomo — Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Tronco simpático paravertebral com 22 gânglios que distribuem a resposta adrenérgica de luta ou fuga e os 12 nervos intercostais.',
          clinicalText: 'Síndrome de Horner por lesão do gânglio estrelado/T1, neuralgia pós-herpética intercostal e hiperidrose.',
          neurotransmitter: 'Noradrenalina pós-ganglionar e Acetilcolina pré-ganglionar',
          audioScript: 'A Cadeia Simpática Paravertebral percorre os dois lados da coluna vertebral, orquestrando respostas de alerta, vasoconstrição e taquicardia.'
        },
        'en-GB': {
          name: 'PNS — Paravertebral Sympathetic Trunk & Intercostal Nerves (T1–L2)',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Bilateral sympathetic chain (22 ganglia) mediating systemic fight-or-flight adrenergic responses accompanied by 12 intercostal nerves.',
          clinicalText: 'Horner’s syndrome (ptosis, miosis, anhidrosis), post-herpetic intercostal neuralgia, and complex regional pain syndrome.',
          neurotransmitter: 'Postganglionic Noradrenaline and preganglionic Acetylcholine',
          audioScript: 'The Paravertebral Sympathetic Chain runs parallel to the spine, dispatching sympathetic vasomotor and visceral acceleration commands.'
        },
        'it-IT': {
          name: 'SNP Autonomo — Catena Simpatica Paravertebrale e Nervi Intercostali',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Tronco simpatico bilaterale con gangli paravertebrali per la risposta di attacco o fuga e nervi intercostali toracici.',
          clinicalText: 'Sindrome di Horner per lesione del ganglio stellato e nevralgia post-erpetica intercostale.',
          neurotransmitter: 'Noradrenalina e Acetilcolina',
          audioScript: 'La Catena Simpatica Paravertebrale controlla le reazioni di emergenza, la frequenza cardiaca e il tono dei vasi sanguigni.'
        },
        'uk-UA': {
          name: 'ПНС — Симпатичний стовбур та міжреберні нерви (T1–L2)',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Паравертебральний симпатичний ланцюг із 22 гангліями (реакція стресу, спазм судин) та 12 пар міжреберних нервів.',
          clinicalText: 'Синдром Горнера при ураженні зірчастого вузла; постгерпетична міжреберна невралгія.',
          neurotransmitter: 'Норадреналін та ацетилхолін',
          audioScript: 'Симпатичний стовбур вздовж хребта регулює судинний тонус, артеріальний тиск та адаптацію до навантажень.'
        },
        'es-ES': {
          name: 'SNP Autónomo — Cadena Simpática Paravertebral y Nervios Intercostales',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Cadena ganglionar paravertebral que comanda las respuestas de lucha o huida y los nervios intercostales del tórax.',
          clinicalText: 'Síndrome de Horner por lesión del ganglio estrellado y neuralgia intercostal.',
          neurotransmitter: 'Noradrenalina y Acetilcolina',
          audioScript: 'La Cadena Simpática Paravertebral distribuye el tono adrenérgico hacia el corazón, vasos y vísceras en situaciones de alerta.'
        }
      }"""

new_struct_30 = """{
        'pt-BR': {
          name: 'SNP Autônomo — Nervo Vago (NC X) e Eixo Parassimpático Cranio-Sacral',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Décimo par craniano responsável por 75% da inervação parassimpática (bradicardia, peristaltismo digestivo e eixo intestino-cérebro).',
          clinicalText: 'Síncope vasovagal, gastroparesia diabética e disfonia por paralisia do nervo laríngeo recorrente.',
          neurotransmitter: 'Acetilcolina em receptores muscarínicos M2 e M3',
          audioScript: 'O Nervo Vago é o grande maestro do sistema parassimpático. Emergindo do bulbo, ele viaja até o coração, pulmões e trato gastrointestinal para promover repouso e homeostase.'
        },
        'en-GB': {
          name: 'PNS — Vagus Nerve (CN X) & Parasympathetic Craniosacral Axis',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Tenth cranial nerve delivering ~75% of all parasympathetic output: vagal bradycardia, peristalsis, and the gut-brain axis.',
          clinicalText: 'Vasovagal syncope, vagal gastroparesis, and vocal cord paralysis from recurrent laryngeal nerve damage.',
          neurotransmitter: 'Acetylcholine acting on muscarinic M2 and M3 receptors',
          audioScript: 'The Vagus Nerve descends from the medulla to the thoracic and abdominal viscera, orchestrating calm, digestive secretion, and cardiac decelerations.'
        },
        'it-IT': {
          name: 'SNP Autonomo — Nervo Vago (NC X) e Sistema Parasimpatico',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Decimo nervo cranico per il controllo del battito cardiaco, della digestione e della modulazione antinfiammatoria.',
          clinicalText: 'Sincope vasovagale, gastroparesi e disfonia da paralisi del nervo laringeo ricorrente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Nervo Vago collega il tronco encefalico con cuore, polmoni e stomaco, favorendo il riposo e la digestione.'
        },
        'uk-UA': {
          name: 'ПНС — Блукаючий нерв (NC X) та парасимпатична система',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Десятий черепний нерв, що забезпечує 75% парасимпатичних волокон: уповільнення серцебиття, перистальтика ШКТ.',
          clinicalText: 'Вазовагальна непритомність, гастропарез та парез голосових зв язок при пошкодженні зворотного нерва.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Блукаючий нерв спускається від довгастого мозку до серця та внутрішніх органів, відновлюючи ресурси організму.'
        },
        'es-ES': {
          name: 'SNP Autónomo — Nervio Vago (NC X) y Eje Parasimpático',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Décimo par craneal responsable del 75% de la inervación parasimpática: bradicardia, digestión y eje intestino-cerebro.',
          clinicalText: 'Síncope vasovagal, gastroparesia y disfonía por lesión del nervio laríngeo recurrente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Nervio Vago conecta el bulbo con el corazón y el tracto digestivo, coordinando el reposo y la recuperación física.'
        }
      }"""

new_struct_31 = """{
        'pt-BR': {
          name: 'SNP — Plexo Lombossacral (L1–S4), Nervo Femoral e Grande Nervo Ciático (Isquiático)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Origina o Nervo Ciático (o maior do corpo humano) e o Nervo Femoral, comandando a marcha, postura e sensibilidade dos membros inferiores.',
          clinicalText: 'Ciatalgia por hérnia discal L4–L5/L5–S1, síndrome do piriforme e pé caído por lesão do nervo fibular comum.',
          neurotransmitter: 'Acetilcolina motora somática e Glutamato sensorial',
          audioScript: 'Da região lombossacral emergem o Nervo Femoral e o imponente Nervo Ciático — o mais longo e calibroso nervo do corpo humano, essencial para a marcha e locomoção.'
        },
        'en-GB': {
          name: 'PNS — Lumbosacral Plexus (L1–S4), Femoral & Sciatic Nerves',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Gives rise to the Sciatic Nerve (largest in human body) and Femoral Nerve, governing bipedal locomotion, gait, and leg sensation.',
          clinicalText: 'Sciatica from L4–L5/L5–S1 disc herniation, piriformis syndrome, and foot drop from common peroneal nerve injury.',
          neurotransmitter: 'Somatic motor Acetylcholine and sensory Glutamate',
          audioScript: 'The Lumbosacral Plexus converges into the massive Sciatic Nerve, descending into the thigh and leg to govern bipedal standing and locomotion.'
        },
        'it-IT': {
          name: 'SNP — Plesso Lombosacrale (L1–S4) e Nervo Sciatico',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Origina il nervo femorale e il nervo sciatico (il più grande del corpo), controllando il cammino e le gambe.',
          clinicalText: 'Sciatalgia da ernia del disco lombare, sindrome del piriforme e paralisi del piede cadente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Plesso Lombosacrale genera il grande nervo sciatico, fondamentale per la deambulazione e la sensibilità delle gambe.'
        },
        'uk-UA': {
          name: 'ПНС — Попереково-крижове сплетення (L1–S4) та сідничний нерв',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Формує стегновий та сідничний нерв (найбільший нерв тіла людини), керуючи ходою, поставою та кінцівками.',
          clinicalText: 'Ішіас (сіднична невралгія) при грижах дисків L4–S1; синдром відвислої стопи.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Попереково-крижове сплетення формує величний сідничний нерв, що забезпечує прямоходіння та рухливість стопи.'
        },
        'es-ES': {
          name: 'SNP — Plexo Lumbosacro (L1–S4) y Nervio Ciático',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Origina el Nervio Ciático (el mayor del cuerpo) y el Nervio Femoral, permitiendo la marcha y la postura bípeda.',
          clinicalText: 'Ciática por hernia discal L4–S1, síndrome piramidal y pie caído por lesión del nervio peroneo.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Plexo Lumbosacro origina el nervio ciático para garantizar la bipedestación, la marcha y la fuerza de las piernas.'
        }
      }"""

final_structs = {}
# 1..13
for i in range(1, 14):
    final_structs[i] = orig_blocks[i]
# 14
final_structs[14] = new_struct_14
# 15
final_structs[15] = new_struct_15
# 16: Thalamus (was orig_blocks[14])
final_structs[16] = orig_blocks[14]
# 17: Hypothalamus (was orig_blocks[15])
final_structs[17] = orig_blocks[15]
# 18: Optic Chiasm
final_structs[18] = new_struct_18
# 19: Ventricular System
final_structs[19] = new_struct_19
# 20: Midbrain & SN (was orig_blocks[17])
final_structs[20] = orig_blocks[17]
# 21: Pons (was orig_blocks[18])
final_structs[21] = orig_blocks[18]
# 22: Medulla (was orig_blocks[19])
final_structs[22] = orig_blocks[19]
# 23: Cranial Nerves
final_structs[23] = new_struct_23
# 24: Cerebellum (was orig_blocks[20])
final_structs[24] = orig_blocks[20]
# 25: Spinal Cervical (was orig_blocks[21])
final_structs[25] = orig_blocks[21]
# 26: Spinal Lumbar (was orig_blocks[22])
final_structs[26] = orig_blocks[22]
# 27..31
final_structs[27] = new_struct_27
final_structs[28] = new_struct_28
final_structs[29] = new_struct_29
final_structs[30] = new_struct_30
final_structs[31] = new_struct_31

structs_text = "    structures: {\n"
for i in range(1, 32):
    structs_text += f"      {i}: {final_structs[i]}"
    if i < 31:
        structs_text += ",\n"
    else:
        structs_text += "\n"
structs_text += "    },"

# Code to ID mapping & Helper methods
methods_code = """
    // Mapeamento bidirecional Código -> ID para garantir correspondência exata
    codeToIdMap: {
      'WB_CNS': 1,
      'DLPFC_LEFT': 2,
      'BROCA_LEFT': 3,
      'M1_LEFT': 4,
      'S1_LEFT': 5,
      'WERNICKE_LEFT': 6,
      'V1_CALCARINE': 7,
      'A1_LEFT': 8,
      'INSULA_LEFT': 9,
      'PARIETAL_LEFT': 10,
      'HIPPOCAMPUS': 11,
      'AMYGDALA': 12,
      'STRIATUM': 13,
      'GLOBUS_PALLIDUS': 14,
      'CORPUS_CALLOSUM': 15,
      'THALAMUS': 16,
      'HYPOTHALAMUS_PITUITARY': 17,
      'HYPOTHALAMUS': 17,
      'OPTIC_CHIASM': 18,
      'VENTRICULAR_SYSTEM': 19,
      'MIDBRAIN_SN': 20,
      'PONS_VAROLII': 21,
      'MEDULLA_OBLONGATA': 22,
      'CRANIAL_NERVES': 23,
      'CEREBELLUM_FOLIA': 24,
      'CEREBELLUM': 24,
      'SPINAL_CERVICAL_THORACIC': 25,
      'SPINAL_CORD_CERVICAL': 25,
      'SPINAL_LUMBAR_CAUDA': 26,
      'SPINAL_CORD_LUMBOSACRAL': 26,
      'PNS_CERVICAL_PHRENIC': 27,
      'PNS_BRACHIAL_PLEXUS': 28,
      'BRACHIAL_PLEXUS': 28,
      'PNS_SYMPATHETIC_CHAIN': 29,
      'PNS_VAGUS_PARASYMPATHETIC': 30,
      'PNS_LUMBOSACRAL_SCIATIC': 31,
      'SCIATIC_LUMBOSACRAL': 31
    },

    // Obtém texto localizado de elemento da UI
    t(key, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      if (this.ui[l] && this.ui[l][key]) {
        return this.ui[l][key];
      }
      return (this.ui['pt-BR'] && this.ui['pt-BR'][key]) || key;
    },

    // Obtém estrutura anatômica traduzida por ID numérico (1..31) ou por código de string
    getStructure(idOrCode, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      let id = idOrCode;
      if (typeof idOrCode === 'string') {
        if (this.codeToIdMap[idOrCode]) {
          id = this.codeToIdMap[idOrCode];
        } else if (!isNaN(parseInt(idOrCode, 10))) {
          id = parseInt(idOrCode, 10);
        }
      }
      const item = this.structures[id];
      if (item && (item[l] || item['pt-BR'])) {
        return item[l] || item['pt-BR'];
      }
      // Fallback para banco de dados unificado
      if (window.MOZOK_DATABASE && typeof window.MOZOK_DATABASE.getStructureById === 'function') {
        const s = window.MOZOK_DATABASE.getStructureById(id);
        if (s) {
          return {
            name: s.name || s.estrutura,
            category: s.category || s.categoria,
            functionText: Array.isArray(s.funcoes) ? s.funcoes.join(' • ') : (s.functionText || s.descricao || ''),
            clinicalText: Array.isArray(s.doencas) ? s.doencas.join('; ') : (s.clinicalText || ''),
            neurotransmitter: Array.isArray(s.neurotransmissores) ? s.neurotransmissores.join(', ') : (s.neurotransmitter || ''),
            audioScript: s.audioScript
          };
        }
      }
      return null;
    },

    // Obtém patologia traduzida
    getPathology(code, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      const item = this.pathologies[code];
      if (item && (item[l] || item['pt-BR'])) {
        return item[l] || item['pt-BR'];
      }
      if (window.MOZOK_DATABASE && typeof window.MOZOK_DATABASE.getPathologyById === 'function') {
        const p = window.MOZOK_DATABASE.getPathologyById(code);
        if (p) return p;
      }
      return null;
    },

    // Troca de idioma global
    setLanguage(langCode) {
      if (!['pt-BR', 'en-GB', 'it-IT', 'uk-UA', 'es-ES'].includes(langCode)) {
        langCode = 'pt-BR';
      }
      this.currentLang = langCode;

      // Dispara evento global
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('mozokLanguageChanged', { detail: { lang: langCode } });
        window.dispatchEvent(event);
      }
    }
  };

  window.MOZOK_I18N = MOZOK_I18N;

})(window);
"""

# Extract pathologies block
path_start = orig_text.find('pathologies: {')
func_t_start = orig_text.find('// Obtém texto localizado', path_start)
if func_t_start == -1:
    func_t_start = orig_text.find('t(key)', path_start)
pathologies_block = orig_text[path_start:func_t_start].strip()
if pathologies_block.endswith(','):
    pathologies_block = pathologies_block[:-1].strip()

header = """// [PT-BR]: Módulo de Internacionalização (i18n) do MOZOK em 5 Idiomas (Português, Inglês Britânico, Italiano, Ucraniano Cirílico e Espanhol).
// [EN-GB]: Internationalisation (i18n) Module for MOZOK across 5 Languages (Portuguese, British English, Italian, Ukrainian Cyrillic, and Spanish).
// [AI-CTX]: @llm-context: Multi-language registry for all UI components, 31 CNS & PNS structures, 6 pathology simulation modes, and AI voice scripts.
//           @llm-invariant: Strict British English orthography (neuroanatomy, modelling, colour, organisation, centre, fibres, signalling, behaviour) and strict Ukrainian Cyrillic.

(function (window) {
  'use strict';

  const MOZOK_I18N = {
    currentLang: 'pt-BR',

"""

full_content = header + "    " + ui_block + ",\n\n" + structs_text + "\n\n    " + pathologies_block + ",\n" + methods_code

with open('web/js/mozok-i18n.js', 'w', encoding='utf-8') as f:
    f.write(full_content)

print(f"Successfully generated web/js/mozok-i18n.js ({len(full_content)} bytes)")
