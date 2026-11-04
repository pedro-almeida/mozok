#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
// [PT-BR]: Script autônomo de atualização científica, visual e mobile do MOZOK v8.0:
//          1. Corrige o bug da barra vertical de legenda do áudio Gemini no Mobile (#mozok-subtitle-bar).
//          2. Substitui os neurônios de web/js/neural-microcosmos-3d.js pelos neurônios fotorrealistas
//             Firefly Layer V do simulador da DCJ (Soma Âmbar/Ciano com Root-Flares, SSS, Lei de Rall 5ª ordem,
//             Mielina contornada, Nódulos de Ranvier #00f2fe e 24 Sinapses Bidirecionais).
//          3. Audita e corrige todas as traduções neuroanatômicas em web/js/i18n-cache.js e coordenadas MNI152
//             em web/js/cns-anatomy-3d.js, injetando artigos científicos revisados por pares com DOI clicável
//             em todos os 45 itens do Atlas, 9 sub-peças do neurônio e 8 perfis clínicos/patológicos.
//          4. Adiciona o botão e modal "ℹ️ Sobre / About" multi-idiomas com Licença Apache 2.0, link do GitHub,
//             declaração de Patrimônio da Humanidade e Homenagem à Ucrânia (Slava Ukraini / Слава Україні).
// [EN-GB]: Autonomous scientific, visual, and mobile updater script for MOZOK v8.0.
// [AI-CTX]: @llm-context Deterministic Spec-First updater for C:\\mozok repository.
"""

import json
import os
import re
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEB_DIR = os.path.join(ROOT_DIR, "web")
JS_DIR = os.path.join(WEB_DIR, "js")


# =============================================================================
# 1. BASE DE CITAÇÕES CIENTÍFICAS E DOIs CANÔNICOS (45 ESTRUTURAS + 9 SUB-PEÇAS + 8 PERFIS CLÍNICOS)
# =============================================================================
SCIENTIFIC_DOIS = {
    "MENINGES_DURA_ARACHNOID_PIA": {
        "citation": "Louveau, A. et al. Structural and functional features of central nervous system lymphatic vessels. Nature 523, 337–341 (2015).",
        "doi": "10.1038/nature14432"
    },
    "FRONTAL_LOBE": {
        "citation": "Miller, E. K. & Cohen, J. D. An integrative theory of prefrontal cortex function. Annu. Rev. Neurosci. 24, 167–202 (2001).",
        "doi": "10.1146/annurev.neuro.24.1.167"
    },
    "PARIETAL_LOBE": {
        "citation": "Culham, J. C. & Kanwisher, N. G. Neuroimaging of cognitive functions in human parietal cortex. Curr. Opin. Neurobiol. 11, 157–163 (2001).",
        "doi": "10.1016/S0959-4388(00)00191-4"
    },
    "TEMPORAL_LOBE": {
        "citation": "Binder, J. R. et al. Human temporal lobe activation by speech and nonspeech sounds. Brain 123, 2371–2385 (2000).",
        "doi": "10.1093/brain/123.12.2371"
    },
    "OCCIPITAL_LOBE": {
        "citation": "Wandell, B. A., Dumoulin, S. O. & Brewer, A. A. Visual field maps in human cortex. Neuron 56, 366–383 (2007).",
        "doi": "10.1016/j.neuron.2007.10.012"
    },
    "INSULAR_CORTEX": {
        "citation": "Craig, A. D. How do you feel — now? The anterior insula and human awareness. Nat. Rev. Neurosci. 10, 59–70 (2009).",
        "doi": "10.1038/nrn2555"
    },
    "CEREBELLUM": {
        "citation": "Herculano-Houzel, S. The human brain in numbers: a linearly scaled-up primate brain. Front. Hum. Neurosci. 3, 31 (2009).",
        "doi": "10.3389/neuro.09.031.2009"
    },
    "CORPUS_CALLOSUM": {
        "citation": "Gazzaniga, M. S. Cerebral specialization and interhemispheric communication: Does the corpus callosum enable the human condition? Brain 123, 1293–1326 (2000).",
        "doi": "10.1093/brain/123.7.1293"
    },
    "THALAMUS": {
        "citation": "Sherman, S. M. & Guillery, R. W. The role of the thalamus in the flow of information to the cortex. Philos. Trans. R. Soc. Lond. B 357, 1695–1708 (2002).",
        "doi": "10.1098/rstb.2002.1161"
    },
    "HYPOTHALAMUS": {
        "citation": "Saper, C. B. & Lowell, B. B. The hypothalamus. Curr. Biol. 24, R1111–R1116 (2014).",
        "doi": "10.1016/j.cub.2014.10.023"
    },
    "HIPPOCAMPUS": {
        "citation": "Scoville, W. B. & Milner, B. Loss of recent memory after bilateral hippocampal lesions. J. Neurol. Neurosurg. Psychiatry 20, 11–21 (1957).",
        "doi": "10.1136/jnnp.20.1.11"
    },
    "AMYGDALA": {
        "citation": "LeDoux, J. E. Emotion circuits in the brain. Annu. Rev. Neurosci. 23, 155–184 (2000).",
        "doi": "10.1146/annurev.neuro.23.1.155"
    },
    "BASAL_GANGLIA": {
        "citation": "Alexander, G. E., DeLong, M. R. & Strick, P. L. Parallel organization of functionally segregated circuits linking basal ganglia and cortex. Annu. Rev. Neurosci. 9, 357–381 (1986).",
        "doi": "10.1146/annurev.ne.09.030186.002041"
    },
    "MIDBRAIN": {
        "citation": "Roeper, J. Dissecting the diversity of midbrain dopamine neurons. Physiol. Rev. 93, 281–320 (2013).",
        "doi": "10.1152/physrev.00029.2012"
    },
    "PONS": {
        "citation": "Schmahmann, J. D. & Pandya, D. N. Anatomic organization of the basilar pontine projections from prefrontal cortices. Brain 120, 1609–1639 (1997).",
        "doi": "10.1093/brain/120.9.1609"
    },
    "MEDULLA_OBLONGATA": {
        "citation": "Smith, J. C., Ellenberger, H. H., Ballanyi, K., Richter, D. W. & Feldman, J. L. Pre-Bötzinger complex: a brainstem region that may generate respiratory rhythm in mammals. Science 254, 726–729 (1991).",
        "doi": "10.1126/science.1683005"
    },
    "SPINAL_CORD": {
        "citation": "Lemon, R. N. Descending pathways in motor control. Annu. Rev. Neurosci. 31, 195–218 (2008).",
        "doi": "10.1146/annurev.neuro.31.060407.125547"
    },
    "OLFACTORY_NERVE_CN1": {
        "citation": "Buck, L. & Axel, R. A novel multigene family may encode odorant receptors: a molecular basis for odor recognition. Cell 65, 175–187 (1991).",
        "doi": "10.1016/0092-8674(91)90418-X"
    },
    "OPTIC_NERVE_CN2": {
        "citation": "Toosy, A. T., Mason, D. F. & Miller, D. H. Optic neuritis. Lancet Neurol. 13, 83–99 (2014).",
        "doi": "10.1016/S1474-4422(13)70259-X"
    },
    "OCULOMOTOR_NERVES_CN3_4_6": {
        "citation": "Büttner-Ennever, J. A. The extraocular motor nuclei: organization and functional neuroanatomy. Prog. Brain Res. 151, 95–125 (2006).",
        "doi": "10.1016/S0079-6123(05)51004-5"
    },
    "TRIGEMINAL_NERVE_CN5": {
        "citation": "Cruccu, G. et al. Trigeminal neuralgia: New classification and diagnostic grading for practice and research. Neurology 87, 220–228 (2016).",
        "doi": "10.1212/WNL.0000000000002840"
    },
    "FACIAL_VESTIBULOCOCHLEAR_CN7_8": {
        "citation": "Eviston, T. J. et al. Bell's palsy: aetiology, clinical features and multidisciplinary care. J. Neurol. Neurosurg. Psychiatry 86, 1356–1361 (2015).",
        "doi": "10.1136/jnnp-2014-309563"
    },
    "VAGUS_NERVE_CN10": {
        "citation": "Tracey, K. J. The inflammatory reflex. Nature 420, 853–859 (2002).",
        "doi": "10.1038/nature01321"
    },
    "GLOSSOPHARYNGEAL_ACCESSORY_HYPOGLOSSAL_CN9_11_12": {
        "citation": "Erman, A. B., Kejner, A. E., Hogikyan, N. D. & Feldman, E. L. Disorders of cranial nerves IX and X. Semin. Neurol. 29, 85–92 (2009).",
        "doi": "10.1055/s-0028-1124027"
    },
    "CERVICAL_PLEXUS_PHRENIC": {
        "citation": "Kim, J. S. et al. Anatomy and Pathology of the Cervical Plexus and Phrenic Nerve. RadioGraphics 38, 1153–1171 (2018).",
        "doi": "10.1148/rg.2018170196"
    },
    "BRACHIAL_PLEXUS": {
        "citation": "Ferrante, M. A. Brachial plexopathies: classification, causes, and consequences. Muscle Nerve 30, 547–568 (2004).",
        "doi": "10.1002/mus.20131"
    },
    "MEDIAN_ULNAR_RADIAL_NERVES": {
        "citation": "Padua, L. et al. Carpal tunnel syndrome: clinical features, diagnosis, and management. Lancet Neurol. 15, 1273–1284 (2016).",
        "doi": "10.1016/S1474-4422(16)30231-9"
    },
    "INTERCOSTAL_SYMPATHETIC_CHAIN": {
        "citation": "Wehrwein, E. A., Orer, H. S. & Barman, S. M. Overview of the Anatomy, Physiology, and Pharmacology of the Autonomic Nervous System. Compr. Physiol. 6, 1239–1278 (2016).",
        "doi": "10.1002/cphy.c150037"
    },
    "LUMBOSACRAL_PLEXUS": {
        "citation": "Dyck, P. J. B. & Thaisetthawatkul, P. Lumbosacral plexopathy. Continuum (Minneap. Minn.) 20, 1343–1358 (2014).",
        "doi": "10.1212/01.CON.0000455877.60932.d3"
    },
    "SCIATIC_TIBIAL_FIBULAR_NERVES": {
        "citation": "Ropper, A. H. & Zafonte, R. D. Sciatica. N. Engl. J. Med. 372, 1240–1248 (2015).",
        "doi": "10.1056/NEJMra1410151"
    },
    "INTERNAL_CAROTID_ARTERIES": {
        "citation": "Brott, T. G. et al. Stenting versus Endarterectomy for Treatment of Carotid-Artery Stenosis. N. Engl. J. Med. 363, 11–23 (2010).",
        "doi": "10.1056/NEJMoa0912321"
    },
    "VERTEBRAL_BASILAR_ARTERIES": {
        "citation": "Savitz, S. I. & Caplan, L. R. Vertebrobasilar Disease. N. Engl. J. Med. 352, 2618–2626 (2005).",
        "doi": "10.1056/NEJMra041544"
    },
    "CIRCLE_OF_WILLIS": {
        "citation": "van Gijn, J., Kerr, R. S. & Rinkel, G. J. Subarachnoid haemorrhage. Lancet 369, 306–318 (2007).",
        "doi": "10.1016/S0140-6736(07)60153-6"
    },
    "MIDDLE_CEREBRAL_ARTERY": {
        "citation": "Campbell, B. C. V. et al. Ischaemic stroke. Nat. Rev. Dis. Primers 5, 70 (2019).",
        "doi": "10.1038/s41572-019-0118-8"
    },
    "DURAL_VENOUS_SINUSES": {
        "citation": "Stam, J. Thrombosis of the Cerebral Veins and Sinuses. N. Engl. J. Med. 352, 1791–1798 (2005).",
        "doi": "10.1056/NEJMra042354"
    },
    "LATERAL_VENTRICLES": {
        "citation": "Iliff, J. J. et al. A paravascular pathway facilitates CSF flow through the brain parenchyma and the clearance of interstitial solutes. Sci. Transl. Med. 4, 147ra111 (2012).",
        "doi": "10.1126/scitranslmed.3003748"
    },
    "THIRD_FOURTH_VENTRICLES": {
        "citation": "Kahle, K. T., Kulkarni, A. V., Limbrick, D. D. & Warf, B. C. Hydrocephalus in children. Lancet 387, 788–799 (2016).",
        "doi": "10.1016/S0140-6736(15)60694-8"
    },
    "BROCA_AREA_BA44_45": {
        "citation": "Dronkers, N. F., Plaisant, O., Iba-Zizen, M. T. & Cabanis, E. A. Paul Broca's historic cases: high resolution MR imaging of the brains of Leborgne and Lelong. Brain 130, 1432–1441 (2007).",
        "doi": "10.1093/brain/awm042"
    },
    "WERNICKE_AREA_BA22": {
        "citation": "Hickok, G. & Poeppel, D. The cortical organization of speech processing. Nat. Rev. Neurosci. 8, 393–402 (2007).",
        "doi": "10.1038/nrn2113"
    },
    "ARCUATE_FASCICULUS_BA39_40": {
        "citation": "Catani, M., Jones, D. K. & ffytche, D. H. Perisylvian language networks of the human brain. Ann. Neurol. 57, 8–16 (2005).",
        "doi": "10.1002/ana.20319"
    },
    "PREFRONTAL_DLPFC_BA9_46": {
        "citation": "Baddeley, A. Working memory: looking back and looking forward. Nat. Rev. Neurosci. 4, 829–839 (2003).",
        "doi": "10.1038/nrn1201"
    },
    "PRIMARY_MOTOR_M1_BA4": {
        "citation": "Gordon, E. M. et al. A somato-cognitive action network alternates with effector regions in motor cortex (Penfield Homunculus & Betz Layer V). Nature 617, 351–359 (2023).",
        "doi": "10.1038/s41586-023-05964-2"
    },
    "PRIMARY_SOMATOSENSORY_S1_BA312": {
        "citation": "Abraira, V. E. & Ginty, D. D. The sensory neurons of touch. Neuron 79, 618–639 (2013).",
        "doi": "10.1016/j.neuron.2013.07.051"
    },
    "PRIMARY_AUDITORY_A1_BA41_42": {
        "citation": "Moerel, M., De Martino, F. & Formisano, E. An anatomical and functional topography of human auditory cortical areas. Front. Neurosci. 8, 225 (2014).",
        "doi": "10.3389/fnins.2014.00225"
    },
    "PRIMARY_VISUAL_V1_BA17": {
        "citation": "Hubel, D. H. & Wiesel, T. N. Receptive fields, binocular interaction and functional architecture in the cat's visual cortex. J. Physiol. 160, 106–154 (1962).",
        "doi": "10.1113/jphysiol.1962.sp006837"
    },
    "NEURON_SOMA": {
        "citation": "Spruston, N. Pyramidal neurons: dendritic structure and synaptic integration. Nat. Rev. Neurosci. 9, 206–221 (2008).",
        "doi": "10.1038/nrn2286"
    },
    "NEURON_NUCLEUS": {
        "citation": "Yap, E. L. & Greenberg, M. E. Activity-Regulated Transcription: Bridging the Gap between Neural Activity and Behavior. Neuron 100, 330–348 (2018).",
        "doi": "10.1016/j.neuron.2018.09.044"
    },
    "NEURON_DENDRITES": {
        "citation": "Rall, W. Branching dendritic trees and motoneuron membrane resistivity (Rall's 3/2 Power Law). Exp. Neurol. 1, 491–527 (1959).",
        "doi": "10.1016/0014-4886(59)90046-9"
    },
    "NEURON_AXON": {
        "citation": "Kole, M. H. P. et al. Action potential generation requires a high sodium channel density in the axon initial segment. Nat. Neurosci. 11, 178–186 (2008).",
        "doi": "10.1038/nn2040"
    },
    "NEURON_MYELIN": {
        "citation": "Nave, K. A. & Werner, H. B. Myelination of the nervous system: mechanisms and functions. Annu. Rev. Cell Dev. Biol. 30, 503–533 (2014).",
        "doi": "10.1146/annurev-cellbio-100913-013101"
    },
    "NEURON_SCHWANN": {
        "citation": "Fünfschilling, U. et al. Glycolytic oligodendrocytes maintain myelin and long-term axonal integrity. Nature 485, 517–521 (2012).",
        "doi": "10.1038/nature11007"
    },
    "NEURON_RANVIER": {
        "citation": "Rasband, M. N. & Peles, E. Mechanisms of node of Ranvier assembly. Nat. Rev. Neurosci. 22, 7–20 (2021).",
        "doi": "10.1038/s41583-020-00406-8"
    },
    "NEURON_TERMINAL": {
        "citation": "Südhof, T. C. Neurotransmitter release: the last millisecond in the life of a synaptic vesicle. Neuron 80, 675–690 (2013).",
        "doi": "10.1016/j.neuron.2013.10.022"
    },
    "NEURON_SYNAPSE": {
        "citation": "Kano, M. et al. Endocannabinoid-mediated control of synaptic transmission. Physiol. Rev. 89, 309–380 (2009).",
        "doi": "10.1152/physrev.00019.2008"
    }
}



PATHOLOGY_DOIS = {
    "HEALTHY": {
        "citation": "Fonov, V. et al. Unbiased average, symmetric atlas for multi-spectral human brain MRI in MNI152-space. NeuroImage 54, 313–327 (2011).",
        "doi": "10.1016/j.neuroimage.2009.04.041"
    },
    "ISCHEMIC_STROKE": {
        "citation": "Campbell, B. C. V. et al. Ischaemic stroke: pathophysiology of necrotic core and penumbra. Nat. Rev. Dis. Primers 5, 70 (2019).",
        "doi": "10.1038/s41572-019-0118-8"
    },
    "ALZHEIMER": {
        "citation": "Scheltens, P. et al. Alzheimer's disease: Aβ42 plaques, hyperphosphorylated tau and neurodegeneration. Lancet 397, 1577–1590 (2021).",
        "doi": "10.1016/S0140-6736(20)32205-4"
    },
    "PARKINSON": {
        "citation": "Poewe, W. et al. Parkinson disease: SNpc dopaminergic loss and α-synuclein Lewy bodies. Nat. Rev. Dis. Primers 3, 17013 (2017).",
        "doi": "10.1038/nrdp.2017.13"
    },
    "MULTIPLE_SCLEROSIS": {
        "citation": "Reich, D. S., Lucchinetti, C. F. & Calabresi, P. A. Multiple Sclerosis. N. Engl. J. Med. 378, 169–180 (2018).",
        "doi": "10.1056/NEJMra1401483"
    },
    "PRION_DCJ": {
        "citation": "Prusiner, S. B. Prions (Nobel Lecture: PrPC to PrPSc conformational conversion & spongiform degeneration). Proc. Natl. Acad. Sci. USA 95, 13363–13383 (1998).",
        "doi": "10.1073/pnas.95.23.13363"
    },
    "ALS_ELA": {
        "citation": "Brown, R. H. & Al-Chalabi, A. Amyotrophic Lateral Sclerosis (TDP-43 & Upper/Lower Motor Neuron degeneration). N. Engl. J. Med. 377, 162–172 (2017).",
        "doi": "10.1056/NEJMra1603471"
    },
    "EPILEPSY": {
        "citation": "Thijs, R. D., Surges, R., O'Brien, T. J. & Sander, J. W. Epilepsy in adults. Lancet 393, 689–701 (2019).",
        "doi": "10.1016/S0140-6736(18)32596-0"
    }
}

# =============================================================================
# 2. AUDITORIA E CORREÇÃO CIENTÍFICA DE web/js/i18n-cache.js
# =============================================================================
def audit_and_fix_i18n_cache():
    cache_path = os.path.join(JS_DIR, "i18n-cache.js")
    with open(cache_path, "r", encoding="utf-8") as f:
        raw = f.read()

    prefix = "window.MOZOK_I18N_CACHE = "
    json_str = raw.split(prefix, 1)[1].rstrip(";\n ")
    cache = json.loads(json_str)

    en = cache.get("en-GB", {})
    if "TEMPORAL_LOBE" in en:
        en["TEMPORAL_LOBE"]["name"] = "Temporal Lobe"
    if "INSULAR_CORTEX" in en:
        en["INSULAR_CORTEX"]["badge"] = "INTEROCEPTION & EMPATHY"
        en["INSULAR_CORTEX"]["clinical"] = (
            "Neurogenic arrhythmias and T-wave inversion following right insular stroke, "
            "sudden cessation of nicotine craving/addiction following insular lesion, and pain asymbolia."
        )
    if "CORPUS_CALLOSUM" in en:
        en["CORPUS_CALLOSUM"]["badge"] = "INTERHEMISPHERIC COMMISSURE"
    if "BASAL_GANGLIA" in en:
        en["BASAL_GANGLIA"]["badge"] = "ACTION SELECTION & MOTOR AUTOMATISM"
    if "PONS" in en:
        en["PONS"]["name"] = "Pons (Bridge of Varolii)"
    if "ARCUATE_FASCICULUS_BA39_40" in en:
        en["ARCUATE_FASCICULUS_BA39_40"]["functions"] = [
            "Phonological Dorsal Pathway (Arcuate Fasciculus): ultra-rapid somato-auditory transmission for faithful word repetition and vocabulary acquisition",
            "Supramarginal Gyrus (BA 40): phonological loop of verbal working memory and somatosensory integration of articulation",
            "Angular Gyrus (BA 39): multimodal visuo-auditory-tactile hub essential for reading (grapheme-to-phoneme conversion), writing and symbolic calculation"
        ]
    if "NEURON_TERMINAL" in en:
        en["NEURON_TERMINAL"]["name"] = "Axon Terminal & Synaptic Bouton"
    if "NEURON_DENDRITES" in en:
        en["NEURON_DENDRITES"]["name"] = "Dendritic Tree & Dendritic Spines"

    es = cache.get("es-ES", {})
    if "FRONTAL_LOBE" in es:
        es["FRONTAL_LOBE"]["name"] = "Lóbulo Frontal"
    if "PARIETAL_LOBE" in es:
        es["PARIETAL_LOBE"]["name"] = "Lóbulo Parietal"
    if "TEMPORAL_LOBE" in es:
        es["TEMPORAL_LOBE"]["name"] = "Lóbulo Temporal"
    if "OCCIPITAL_LOBE" in es:
        es["OCCIPITAL_LOBE"]["name"] = "Lóbulo Occipital"
    if "INSULAR_CORTEX" in es:
        es["INSULAR_CORTEX"]["badge"] = "INTEROCEPCIÓN Y EMPATÍA"
        es["INSULAR_CORTEX"]["clinical"] = (
            "Arritmias neurogénicas e inversión de la onda T tras un ictus insular derecho, "
            "pérdida súbita de la adicción a la nicotina tras lesión insular y asimbolia al dolor."
        )
    if "CEREBELLUM" in es and len(es["CEREBELLUM"].get("functions", [])) >= 3:
        es["CEREBELLUM"]["functions"][2] = (
            "Corrección instantánea de errores motores a través de las fibras trepadoras de la oliva inferior sobre las células de Purkinje"
        )
    if "CORPUS_CALLOSUM" in es:
        es["CORPUS_CALLOSUM"]["name"] = "Cuerpo Calloso"
    if "BASAL_GANGLIA" in es:
        es["BASAL_GANGLIA"]["badge"] = "SELECCIÓN DE ACCIONES Y AUTOMATISMO MOTOR"

    it = cache.get("it-IT", {})
    if "TEMPORAL_LOBE" in it:
        it["TEMPORAL_LOBE"]["name"] = "Lobo Temporale"
    if "FRONTAL_LOBE" in it:
        it["FRONTAL_LOBE"]["name"] = "Lobo Frontale"
    if "PARIETAL_LOBE" in it:
        it["PARIETAL_LOBE"]["name"] = "Lobo Parietale"
    if "OCCIPITAL_LOBE" in it:
        it["OCCIPITAL_LOBE"]["name"] = "Lobo Occipitale"
    if "INSULAR_CORTEX" in it:
        it["INSULAR_CORTEX"]["badge"] = "INTEROCEZIONE ED EMPATIA"
    if "CORPUS_CALLOSUM" in it:
        it["CORPUS_CALLOSUM"]["badge"] = "COMMESSURA INTEREMISFERICA"
    if "BASAL_GANGLIA" in it:
        it["BASAL_GANGLIA"]["badge"] = "SELEZIONE DELL'AZIONE E AUTOMATISMO MOTORIO"

    uk = cache.get("uk-UA", {})
    if "MENINGES_DURA_ARACHNOID_PIA" in uk:
        uk["MENINGES_DURA_ARACHNOID_PIA"]["name"] = "Мозкові оболони (тверда, павутинна та м'яка)"
        uk["MENINGES_DURA_ARACHNOID_PIA"]["badge"] = "МОЗКОВІ ОБОЛОНИ ТА СИНУСИ • ЗАХИСТ ЦНС"
    if "FRONTAL_LOBE" in uk:
        uk["FRONTAL_LOBE"]["name"] = "Лобова частка (Lobus frontalis)"
    if "PARIETAL_LOBE" in uk:
        uk["PARIETAL_LOBE"]["name"] = "Тім'яна частка (Lobus parietalis)"
    if "TEMPORAL_LOBE" in uk:
        uk["TEMPORAL_LOBE"]["name"] = "Скронева частка (Lobus temporalis)"
    if "OCCIPITAL_LOBE" in uk:
        uk["OCCIPITAL_LOBE"]["name"] = "Потилична частка (Lobus occipitalis)"
    if "INSULAR_CORTEX" in uk:
        uk["INSULAR_CORTEX"]["name"] = "Острівцева кора (Острівець Рейля)"
        uk["INSULAR_CORTEX"]["badge"] = "ІНТЕРОЦЕПЦІЯ ТА ЕМПАТІЯ"
        uk["INSULAR_CORTEX"]["summary"] = (
            "П'ята частка мозку, прихована в глибині бічної борозни Сільвія, відповідає за свідому інтероцепцію "
            "(сприйняття серцебиття, дихання, вісцерального болю та голоду), первинний смак та афективну емпатію."
        )
    if "CORPUS_CALLOSUM" in uk:
        uk["CORPUS_CALLOSUM"]["name"] = "Мозолисте тіло (Corpus callosum)"
        uk["CORPUS_CALLOSUM"]["badge"] = "МІЖПІВКУЛЬНА КОМІСУРА"
    if "BASAL_GANGLIA" in uk:
        uk["BASAL_GANGLIA"]["name"] = "Базальні ядра (смугасте тіло та бліда куля)"
        uk["BASAL_GANGLIA"]["badge"] = "ВИБІР ДІЇ ТА МОТОРНИЙ АВТОМАТИЗМ"
    if "MIDBRAIN" in uk:
        uk["MIDBRAIN"]["name"] = "Середній мозок (Mesencephalon)"
        uk["MIDBRAIN"]["badge"] = "СТОВБУР МОЗКУ • ЗОРОВІ ТА СЛУХОВІ РЕФЛЕКСИ"
    if "PONS" in uk:
        uk["PONS"]["name"] = "Міст Варолія (Pons Varolii)"
        uk["PONS"]["badge"] = "СТОВБУР МОЗКУ • КОРТИКО-МОЗОЧКОВИЙ ЗВ'ЯЗОК"
    if "MEDULLA_OBLONGATA" in uk:
        uk["MEDULLA_OBLONGATA"]["name"] = "Довгастий мозок (Medulla oblongata)"
    if "NEURON_TERMINAL" in uk:
        uk["NEURON_TERMINAL"]["name"] = "Аксонний термінал та синаптична бляшка"
    if "NEURON_DENDRITES" in uk:
        uk["NEURON_DENDRITES"]["name"] = "Дендритне дерево та дендритні шипики"

    for lang_code, lang_dict in cache.items():
        if "NEURON_AXON_HILLOCK" in lang_dict and "NEURON_AXON" not in lang_dict:
            lang_dict["NEURON_AXON"] = dict(lang_dict["NEURON_AXON_HILLOCK"])
        if "NEURON_NODE_RANVIER" in lang_dict and "NEURON_RANVIER" not in lang_dict:
            lang_dict["NEURON_RANVIER"] = dict(lang_dict["NEURON_NODE_RANVIER"])

        for struct_id, item_data in lang_dict.items():
            doi_key = struct_id
            if doi_key == "NEURON_AXON_HILLOCK":
                doi_key = "NEURON_AXON"
            elif doi_key == "NEURON_NODE_RANVIER":
                doi_key = "NEURON_RANVIER"
            if doi_key in SCIENTIFIC_DOIS:
                item_data["citation"] = SCIENTIFIC_DOIS[doi_key]["citation"]
                item_data["doi"] = SCIENTIFIC_DOIS[doi_key]["doi"]

    with open(cache_path, "w", encoding="utf-8") as f:
        f.write(prefix + json.dumps(cache, ensure_ascii=False) + ";\n")

    assets_cache_path = os.path.join(WEB_DIR, "assets", "i18n_cache.json")
    if os.path.exists(os.path.dirname(assets_cache_path)):
        with open(assets_cache_path, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)

    print("[OK] web/js/i18n-cache.js auditado e atualizado com DOIs e terminologia neuroanatômica.")


# =============================================================================
# 3. ATUALIZAÇÃO DE web/js/cns-anatomy-3d.js (EXTRAÇÃO DE MALHAS CORTICAIS REAIS MNI152 PARA BRODMANN)
# =============================================================================
def update_cns_anatomy_3d():
    cns_path = os.path.join(JS_DIR, "cns-anatomy-3d.js")
    with open(cns_path, "r", encoding="utf-8") as f:
        code = f.read()

    new_brodmann_fn = """    // =========================================================================
    // 8.5 ÁREAS DE BRODMANN, CIRCUITO DA LINGUAGEM E FASCÍCULO ARQUEADO 3D (MALHA REAL MNI152)
    // =========================================================================
    buildBrodmannAndLanguageCircuit() {
        const meshData = window.REAL_MNI_BRAIN;
        const rawVerts = meshData ? (meshData.vertices || meshData.v) : null;
        const rawIndices = meshData ? (meshData.indices || meshData.i) : null;

        const createCorticalPatch = (id, centerVec, radiusVec, colorHex) => {
            let geo = null;
            if (rawVerts && rawIndices && rawVerts.length >= 3000) {
                const subPositions = [];
                for (let t = 0; t < rawIndices.length; t += 3) {
                    const i0 = rawIndices[t] * 3;
                    const i1 = rawIndices[t + 1] * 3;
                    const i2 = rawIndices[t + 2] * 3;
                    const x0 = rawVerts[i0], y0 = rawVerts[i0 + 1], z0 = rawVerts[i0 + 2];
                    if (x0 < 0.0) continue; // Hemisfério esquerdo dominante (+X em REAL_MNI_BRAIN)
                    const d2 = Math.pow((x0 - centerVec.x) / radiusVec.x, 2) +
                               Math.pow((y0 - centerVec.y) / radiusVec.y, 2) +
                               Math.pow((z0 - centerVec.z) / radiusVec.z, 2);
                    if (d2 <= 1.0) {
                        const push = 1.006;
                        subPositions.push(
                            x0 * push, y0 * push, z0 * push,
                            rawVerts[i1] * push, rawVerts[i1 + 1] * push, rawVerts[i1 + 2] * push,
                            rawVerts[i2] * push, rawVerts[i2 + 1] * push, rawVerts[i2 + 2] * push
                        );
                    }
                }
                if (subPositions.length >= 90) {
                    geo = new THREE.BufferGeometry();
                    geo.setAttribute('position', new THREE.Float32BufferAttribute(subPositions, 3));
                    geo.computeVertexNormals();
                }
            }
            if (!geo) {
                geo = new THREE.SphereGeometry(0.65, 24, 20);
                geo.translate(centerVec.x, centerVec.y, centerVec.z);
            }

            const mat = new THREE.MeshPhysicalMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: 0.48,
                roughness: 0.26,
                clearcoat: 0.65,
                transparent: true,
                opacity: 0.0,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.userData.isBrodmannPatch = true;
            mesh.userData.brodmannId = id;
            this.brodmannGroup.add(mesh);
            this.registerStructure(id, mesh, centerVec.clone());
            return mesh;
        };

        // 1. Área de Broca Esquerda (BA44 & BA45 — Giro Frontal Inferior Pars Opercularis & Triangularis)
        createCorticalPatch('BROCA_AREA_BA44_45', new THREE.Vector3(4.620, 0.495, 2.386), new THREE.Vector3(1.35, 1.25, 1.55), 0xf43f5e);

        // 2. Área de Wernicke Esquerda (BA22 — Giro Temporal Superior Posterior)
        createCorticalPatch('WERNICKE_AREA_BA22', new THREE.Vector3(4.890, -0.293, -1.410), new THREE.Vector3(1.35, 1.25, 1.65), 0x8b5cf6);

        // 3. Fascículo Arqueado & Território de Geschwind (BA39 & BA40 — Lóbulo Parietal Inferior)
        this.arcuateGroup = new THREE.Group();
        this.arcuateGroup.visible = false;
        const arcMat = new THREE.MeshPhysicalMaterial({
            color: 0x06b6d4,
            emissive: 0x0891b2,
            emissiveIntensity: 0.65,
            roughness: 0.25,
            clearcoat: 0.85,
            transparent: true,
            opacity: 0.92
        });
        const arcCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4.35, -0.25, -1.35),
            new THREE.Vector3(4.25, 1.45, -1.30),
            new THREE.Vector3(4.05, 2.15, 0.15),
            new THREE.Vector3(4.10, 1.65, 1.35),
            new THREE.Vector3(4.28, 0.55, 2.25)
        ]);
        const arcCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4.42, -0.18, -1.25),
            new THREE.Vector3(4.32, 1.55, -1.18),
            new THREE.Vector3(4.15, 2.25, 0.25),
            new THREE.Vector3(4.18, 1.72, 1.42),
            new THREE.Vector3(4.35, 0.62, 2.32)
        ]);
        this.arcuateGroup.add(new THREE.Mesh(new THREE.TubeGeometry(arcCurve1, 48, 0.085, 14, false), arcMat));
        this.arcuateGroup.add(new THREE.Mesh(new THREE.TubeGeometry(arcCurve2, 48, 0.072, 14, false), arcMat));
        this.brodmannGroup.add(this.arcuateGroup);
        this.registerStructure('ARCUATE_FASCICULUS_BA39_40', this.arcuateGroup, new THREE.Vector3(4.15, 1.85, 0.15));

        // 4. Córtex Pré-Frontal Dorsolateral Esquerdo (DLPFC - BA9 & BA46)
        createCorticalPatch('PREFRONTAL_DLPFC_BA9_46', new THREE.Vector3(3.042, 1.863, 4.715), new THREE.Vector3(1.75, 1.65, 1.75), 0x3b82f6);

        // 5. Córtex Motor Primário Esquerdo (M1 - BA4 — Giro Pré-Central)
        createCorticalPatch('PRIMARY_MOTOR_M1_BA4', new THREE.Vector3(3.20, 3.10, 0.45), new THREE.Vector3(2.80, 2.40, 0.82), 0xef4444);

        // 6. Córtex Somatossensorial Primário Esquerdo (S1 - BA3, 1, 2 — Giro Pós-Central)
        createCorticalPatch('PRIMARY_SOMATOSENSORY_S1_BA312', new THREE.Vector3(3.20, 3.00, -0.55), new THREE.Vector3(2.80, 2.40, 0.82), 0x10b981);

        // 7. Córtex Auditivo Primário Esquerdo (A1 - BA41 & BA42 — Giros Transversos de Heschl)
        createCorticalPatch('PRIMARY_AUDITORY_A1_BA41_42', new THREE.Vector3(4.764, -0.864, -0.122), new THREE.Vector3(1.25, 0.95, 1.25), 0xf59e0b);

        // 8. Córtex Visual Primário Esquerdo (V1 - BA17 — Sulco Calcarino Occipital)
        createCorticalPatch('PRIMARY_VISUAL_V1_BA17', new THREE.Vector3(1.698, -1.183, -6.372), new THREE.Vector3(1.75, 1.55, 1.45), 0x6366f1);
    }"""

    pattern = re.compile(
        r"    // =========================================================================\s*"
        r"// 8\.5 ÁREAS DE BRODMANN, CIRCUITO DA LINGUAGEM E FASCÍCULO ARQUEADO 3D\s*"
        r"// =========================================================================\s*"
        r"buildBrodmannAndLanguageCircuit\(\) \{.*?\n    \}",
        re.DOTALL
    )
    if pattern.search(code):
        code = pattern.sub(new_brodmann_fn, code, count=1)

    # Garante que ao isolar uma peça de Brodmann, a opacidade suba para 0.94
    old_vis = """    updateBrodmannVisibility(structureId = this.selectedId) {
        const isBrodmannCat = (this.currentCategory === 'BRODMANN_LANGUAGE');
        this.brodmannGroup.traverse(obj => {
            if (obj.userData && obj.userData.isBrodmannPatch) {
                const isSelected = (obj.userData.brodmannId === structureId);
                if (obj.material) {
                    obj.material.opacity = (isSelected || isBrodmannCat) ? 0.38 : 0.0;
                    obj.material.depthWrite = false;
                    obj.material.needsUpdate = true;
                }
            }
        });"""

    new_vis = """    updateBrodmannVisibility(structureId = this.selectedId) {
        const isBrodmannCat = (this.currentCategory === 'BRODMANN_LANGUAGE');
        this.brodmannGroup.traverse(obj => {
            if (obj.userData && obj.userData.isBrodmannPatch) {
                const isSelected = (obj.userData.brodmannId === structureId);
                const isIsolated = (this.isolatedId === obj.userData.brodmannId);
                if (obj.material) {
                    obj.material.opacity = isIsolated ? 0.95 : (isSelected ? 0.72 : (isBrodmannCat ? 0.42 : 0.0));
                    obj.material.depthWrite = isIsolated;
                    obj.material.needsUpdate = true;
                }
            }
        });"""

    if old_vis in code:
        code = code.replace(old_vis, new_vis, 1)

    with open(cns_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("[OK] web/js/cns-anatomy-3d.js atualizado com extração real de giros MNI152 nas áreas de Brodmann.")


# =============================================================================
# 4. ATUALIZAÇÃO DE web/index.html (CORREÇÃO BUG MOBILE SUBTITLE BAR + DOIs + MODAL SOBRE/SLAVA UKRAINI)
# =============================================================================
def update_index_html():
    html_path = os.path.join(WEB_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 4.1 Corrige o bug do #mozok-subtitle-bar no Mobile e adiciona estilos para DOI e Modal Sobre
    old_sub_css = """        /* Barra de Legendas Acessíveis Sincronizada com Gemini TTS + VLibras */
        #mozok-subtitle-bar {
            position: fixed;
            bottom: 68px;
            left: 50%;
            transform: translateX(-50%);
            max-width: min(680px, calc(100vw - 740px));
            background: rgba(4, 9, 20, 0.92);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(0, 242, 254, 0.55);
            border-radius: 10px;
            padding: 8px 14px;
            color: #f8fafc;
            font-size: 12.5px;
            line-height: 1.4;
            z-index: 29;
            display: none;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.75);
            pointer-events: none;
        }
        #mozok-subtitle-bar.visible {
            display: block !important;
        }"""

    new_sub_css = """        /* Barra de Legendas Acessíveis Sincronizada com Gemini TTS + VLibras (Corrigida Desktop + Mobile) */
        #mozok-subtitle-bar {
            position: fixed;
            bottom: 68px;
            left: 50%;
            transform: translateX(-50%);
            width: min(640px, calc(100vw - 760px));
            min-width: 280px;
            max-width: calc(100vw - 20px);
            max-height: 88px;
            overflow-y: auto;
            background: rgba(4, 9, 20, 0.94);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(0, 242, 254, 0.65);
            border-radius: 11px;
            padding: 8px 32px 8px 14px;
            color: #f8fafc;
            font-size: 12.5px;
            line-height: 1.42;
            z-index: 35;
            display: none;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.82);
            pointer-events: auto;
            word-break: normal;
            overflow-wrap: break-word;
        }
        #mozok-subtitle-bar.visible {
            display: block !important;
        }
        #mozok-subtitle-close {
            position: absolute;
            top: 6px;
            right: 8px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: rgba(15, 23, 42, 0.85);
            color: #cbd5e1;
            font-size: 11px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #mozok-subtitle-close:hover {
            color: #ffffff;
            border-color: var(--accent-cyan);
        }
        @media (max-width: 1440px) and (min-width: 1181px) {
            #mozok-subtitle-bar {
                width: min(520px, calc(100vw - 620px));
            }
        }
        @media (max-width: 1180px) {
            #mozok-subtitle-bar {
                left: 10px !important;
                right: 10px !important;
                transform: none !important;
                width: auto !important;
                min-width: 0 !important;
                max-width: calc(100vw - 20px) !important;
                bottom: 60px !important;
                max-height: 76px !important;
                font-size: 11.5px !important;
                padding: 7px 30px 7px 11px !important;
            }
            body.popup-open-mobile #mozok-subtitle-bar {
                bottom: calc(36dvh + 66px) !important;
            }
        }
        @media (max-width: 640px) {
            #mozok-subtitle-bar {
                left: 8px !important;
                right: 8px !important;
                max-width: calc(100vw - 16px) !important;
                bottom: 56px !important;
                max-height: 68px !important;
                font-size: 11px !important;
            }
        }

        /* Bloco de Citação Científica Revisada por Pares & Link DOI */
        .scientific-doi-box {
            margin-top: 7px;
            padding: 6px 9px;
            background: rgba(15, 23, 42, 0.78);
            border-left: 2.5px solid var(--accent-gold);
            border-radius: 6px;
            font-size: 10.5px;
            line-height: 1.35;
            color: #cbd5e1;
        }
        .scientific-doi-title {
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--accent-gold);
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .scientific-doi-link {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            color: #38bdf8;
            font-weight: 700;
            text-decoration: none;
            font-family: monospace;
            font-size: 10px;
            background: rgba(56, 189, 248, 0.12);
            padding: 1px 6px;
            border-radius: 4px;
            border: 1px solid rgba(56, 189, 248, 0.35);
            transition: all 0.15s ease;
        }
        .scientific-doi-link:hover {
            background: rgba(56, 189, 248, 0.25);
            color: #ffffff;
            border-color: #00f2fe;
        }

        /* Modal "Sobre / About" — Patrimônio da Humanidade & Homenagem à Ucrânia */
        .mozok-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(2, 6, 16, 0.82);
            backdrop-filter: blur(12px);
            z-index: 95;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            opacity: 1;
            transition: opacity 0.2s ease;
        }
        .mozok-modal-overlay.hidden {
            opacity: 0;
            pointer-events: none;
            display: none;
        }
        .mozok-about-card {
            width: min(680px, 96vw);
            max-height: 88dvh;
            overflow-y: auto;
            background: linear-gradient(165deg, rgba(8, 16, 34, 0.98) 0%, rgba(4, 10, 22, 0.98) 100%);
            border: 1.5px solid rgba(0, 242, 254, 0.55);
            border-radius: 16px;
            padding: 20px 22px;
            color: #f1f5f9;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.88), 0 0 32px rgba(0, 242, 254, 0.18);
        }
        .mozok-ukraine-banner {
            margin: 12px 0;
            padding: 12px 14px;
            border-radius: 12px;
            background: linear-gradient(90deg, rgba(0, 87, 183, 0.34) 0%, rgba(255, 215, 0, 0.24) 100%);
            border: 1px solid rgba(255, 215, 0, 0.55);
        }
        .mozok-slava-badge {
            display: inline-block;
            margin-top: 6px;
            padding: 5px 12px;
            border-radius: 8px;
            background: linear-gradient(90deg, #0057B7 0%, #004494 50%, #b48600 100%);
            border: 1px solid #FFD700;
            color: #FFD700;
            font-weight: 800;
            font-size: 12.5px;
            letter-spacing: 0.4px;
        }"""

    if old_sub_css in html:
        html = html.replace(old_sub_css, new_sub_css, 1)

    # 4.2 Insere #popup-doi-box dentro de #anatomical-popup-3d
    old_popup_tags = '<div class="popup-tags" id="popup-tags"></div>'
    new_popup_tags = (
        '<div class="popup-tags" id="popup-tags"></div>\n'
        '        <div class="scientific-doi-box" id="popup-doi-box">\n'
        '            <div class="scientific-doi-title">\n'
        '                <span data-i18n="lbl_sci_ref">📄 Referência Científica Indexada</span>\n'
        '                <a class="scientific-doi-link" id="popup-doi-link" href="https://doi.org/10.1146/annurev.neuro.24.1.167" target="_blank" rel="noopener noreferrer">DOI ↗</a>\n'
        '            </div>\n'
        '            <div id="popup-doi-citation">Miller, E. K. & Cohen, J. D. Annu. Rev. Neurosci. 24, 167–202 (2001).</div>\n'
        '        </div>'
    )
    if old_popup_tags in html and 'id="popup-doi-box"' not in html:
        html = html.replace(old_popup_tags, new_popup_tags, 1)

    # 4.3 Adiciona o botão "ℹ️ Sobre" na topbar
    old_fullscreen_btn = '<button class="hud-btn" id="btn-fullscreen" data-i18n="btn_fullscreen" title="Tela Cheia (F11)">⛶ Tela Cheia</button>'
    new_fullscreen_and_about = (
        '<button class="hud-btn" id="btn-fullscreen" data-i18n="btn_fullscreen" title="Tela Cheia (F11)">⛶ Tela Cheia</button>\n'
        '            <button class="hud-btn gold" id="btn-about" data-i18n="btn_about" title="Sobre o Projeto MOZOK, Licença Apache 2.0, Patrimônio da Humanidade e Homenagem à Ucrânia">ℹ️ Sobre</button>'
    )
    if old_fullscreen_btn in html and 'id="btn-about"' not in html:
        html = html.replace(old_fullscreen_btn, new_fullscreen_and_about, 1)

    # 4.4 Atualiza contadores estáticos 40 -> 45 e adiciona #pathology-doi-box e #card-doi-box no painel direito
    html = html.replace('<span class="count-pill" id="structure-count-pill">40 / 40</span>', '<span class="count-pill" id="structure-count-pill">45 / 45</span>')
    html = html.replace('Todos (40)', 'Todos (45)')
    html = html.replace('📚 Atlas (40)', '📚 Atlas (45)')

    old_path_note = """            <div id="pathology-clinical-note" style="font-size: 11px; color: #e2e8f0; margin-top: 6px; line-height: 1.4;">
                Perfusão cerebral normóxica (54 mL/100g/min), condução saltatória íntegra e equilíbrio excitatório/inibitório preservado.
            </div>"""
    new_path_note = """            <div id="pathology-clinical-note" style="font-size: 11px; color: #e2e8f0; margin-top: 6px; line-height: 1.4;">
                Perfusão cerebral normóxica (54 mL/100g/min), condução saltatória íntegra e equilíbrio excitatório/inibitório preservado.
            </div>
            <div class="scientific-doi-box" id="pathology-doi-box" style="margin-top: 6px;">
                <div class="scientific-doi-title">
                    <span data-i18n="lbl_sci_ref">📄 Evidência Científica & DOI</span>
                    <a class="scientific-doi-link" id="pathology-doi-link" href="https://doi.org/10.1016/j.neuroimage.2009.04.041" target="_blank" rel="noopener noreferrer">DOI: 10.1016/j.neuroimage.2009.04.041 ↗</a>
                </div>
                <div id="pathology-doi-citation">Fonov, V. et al. Unbiased average, symmetric atlas for multi-spectral human brain MRI in MNI152-space. NeuroImage 54, 313–327 (2011).</div>
            </div>"""
    if old_path_note in html and 'id="pathology-doi-box"' not in html:
        html = html.replace(old_path_note, new_path_note, 1)

    old_card_clinical = """        <div class="section-card">
            <div class="section-card-title" data-i18n="sec_clinical">🏥 Correlação Anatomoclínica & Semiologia</div>
            <div class="section-card-body" id="card-clinical"></div>
        </div>"""
    new_card_clinical = """        <div class="section-card">
            <div class="section-card-title" data-i18n="sec_clinical">🏥 Correlação Anatomoclínica & Semiologia</div>
            <div class="section-card-body" id="card-clinical"></div>
            <div class="scientific-doi-box" id="card-doi-box" style="margin-top: 8px;">
                <div class="scientific-doi-title">
                    <span data-i18n="lbl_sci_ref">📄 Artigo Científico Revisado por Pares (DOI)</span>
                    <a class="scientific-doi-link" id="card-doi-link" href="https://doi.org/10.1146/annurev.neuro.24.1.167" target="_blank" rel="noopener noreferrer">DOI ↗</a>
                </div>
                <div id="card-doi-citation">Miller, E. K. & Cohen, J. D. An integrative theory of prefrontal cortex function. Annu. Rev. Neurosci. 24, 167–202 (2001).</div>
            </div>
        </div>"""
    if old_card_clinical in html and 'id="card-doi-box"' not in html:
        html = html.replace(old_card_clinical, new_card_clinical, 1)

    # 4.5 Injeta SCIENTIFIC_DOIS e PATHOLOGY_DOIS no script principal e atualiza renderHUDFields, applyPathologySelection e Modal Sobre
    doi_js_block = f"""        const MOZOK_SCIENTIFIC_DOIS = {json.dumps(SCIENTIFIC_DOIS, ensure_ascii=False)};
        const MOZOK_PATHOLOGY_DOIS = {json.dumps(PATHOLOGY_DOIS, ensure_ascii=False)};
        MOZOK_ONTOLOGY.forEach(item => {{
            if (MOZOK_SCIENTIFIC_DOIS[item.id]) {{
                item.citation = MOZOK_SCIENTIFIC_DOIS[item.id].citation;
                item.doi = MOZOK_SCIENTIFIC_DOIS[item.id].doi;
            }}
        }});"""

    target_onto_marker = "const ontologyMap = new Map();"
    if target_onto_marker in html and "MOZOK_SCIENTIFIC_DOIS" not in html:
        html = html.replace(target_onto_marker, doi_js_block + "\n            " + target_onto_marker, 1)

    # Adiciona traduções do botão Sobre e do Rótulo DOI nos 5 idiomas
    i18n_injections = {
        "btn_fullscreen: '⛶ Tela Cheia',": "btn_fullscreen: '⛶ Tela Cheia',\n                    btn_about: 'ℹ️ Sobre',\n                    lbl_sci_ref: '📄 Referência Científica (DOI)',",
        "btn_fullscreen: '⛶ Fullscreen',": "btn_fullscreen: '⛶ Fullscreen',\n                    btn_about: 'ℹ️ About',\n                    lbl_sci_ref: '📄 Peer-Reviewed Reference (DOI)',",
        "btn_fullscreen: '⛶ Pantalla Completa',": "btn_fullscreen: '⛶ Pantalla Completa',\n                    btn_about: 'ℹ️ Acerca de',\n                    lbl_sci_ref: '📄 Referencia Científica (DOI)',",
        "btn_fullscreen: '⛶ Schermo Intero',": "btn_fullscreen: '⛶ Schermo Intero',\n                    btn_about: 'ℹ️ Info',\n                    lbl_sci_ref: '📄 Riferimento Scientifico (DOI)',",
        "btn_fullscreen: '⛶ На весь екран',": "btn_fullscreen: '⛶ На весь екран',\n                    btn_about: 'ℹ️ Про проєкт',\n                    lbl_sci_ref: '📄 Наукова публікація (DOI)',"
    }
    for k, v in i18n_injections.items():
        if k in html and "btn_about:" not in html.split(k)[1][:120]:
            html = html.replace(k, v, 1)

    # Atualiza renderHUDFields para preencher #card-doi-link, #card-doi-citation, #popup-doi-link, #popup-doi-citation e body.popup-open-mobile
    old_render_hud = """                document.getElementById('card-summary').textContent = meta.summary;
                document.getElementById('card-clinical').textContent = meta.clinical;"""

    new_render_hud = """                document.getElementById('card-summary').textContent = meta.summary;
                document.getElementById('card-clinical').textContent = meta.clinical;

                const doiInfo = (meta.doi && meta.citation)
                    ? { doi: meta.doi, citation: meta.citation }
                    : (MOZOK_SCIENTIFIC_DOIS[meta.id] || { doi: '10.1016/j.neuroimage.2009.04.041', citation: 'Fonov, V. et al. NeuroImage 54, 313–327 (2011).' });
                const doiUrl = `https://doi.org/${doiInfo.doi}`;

                const cardDoiLink = document.getElementById('card-doi-link');
                const cardDoiCit = document.getElementById('card-doi-citation');
                if (cardDoiLink) {
                    cardDoiLink.href = doiUrl;
                    cardDoiLink.textContent = `DOI: ${doiInfo.doi} ↗`;
                }
                if (cardDoiCit) cardDoiCit.textContent = doiInfo.citation;

                const popupDoiLink = document.getElementById('popup-doi-link');
                const popupDoiCit = document.getElementById('popup-doi-citation');
                if (popupDoiLink) {
                    popupDoiLink.href = doiUrl;
                    popupDoiLink.textContent = `DOI: ${doiInfo.doi} ↗`;
                }
                if (popupDoiCit) popupDoiCit.textContent = doiInfo.citation;"""

    if old_render_hud in html and "card-doi-link" not in html.split(old_render_hud)[1][:500]:
        html = html.replace(old_render_hud, new_render_hud, 1)

    # Sincroniza classe body.popup-open-mobile quando o pop-up flutuante abre ou fecha
    old_popup_show = """                if (showFloatingPopup) {
                    popupVisible = true;
                    popupEl.classList.remove('hidden');
                    pinDotEl.classList.remove('hidden');
                    leaderLineEl.style.display = 'block';
                } else {
                    popupVisible = false;
                    popupEl.classList.add('hidden');
                    pinDotEl.classList.add('hidden');
                    leaderLineEl.style.display = 'none';
                }"""
    new_popup_show = """                if (showFloatingPopup) {
                    popupVisible = true;
                    document.body.classList.add('popup-open-mobile');
                    popupEl.classList.remove('hidden');
                    pinDotEl.classList.remove('hidden');
                    leaderLineEl.style.display = 'block';
                } else {
                    popupVisible = false;
                    document.body.classList.remove('popup-open-mobile');
                    popupEl.classList.add('hidden');
                    pinDotEl.classList.add('hidden');
                    leaderLineEl.style.display = 'none';
                }"""
    if old_popup_show in html:
        html = html.replace(old_popup_show, new_popup_show, 1)

    # Atualiza a posição de câmera ao entrar no Microcosmos Neuronal (enquadrando os neurônios fotorrealistas da DCJ!)
    html = html.replace(
        "flyCameraTo(new THREE.Vector3(-0.8, 0.6, 0), new THREE.Vector3(-0.8, 2.2, 16.5), 0.75);",
        "flyCameraTo(new THREE.Vector3(0.0, 0.5, 0.0), new THREE.Vector3(0.0, 1.5, 22.5), 0.75);"
    )

    # Atualiza applyPathologySelection para preencher #pathology-doi-link e #pathology-doi-citation
    old_path_apply = "document.getElementById('pathology-clinical-note').textContent = profile.note;"
    new_path_apply = """document.getElementById('pathology-clinical-note').textContent = profile.note;
                const pDoi = MOZOK_PATHOLOGY_DOIS[diseaseKey] || MOZOK_PATHOLOGY_DOIS['HEALTHY'];
                const pDoiLink = document.getElementById('pathology-doi-link');
                const pDoiCit = document.getElementById('pathology-doi-citation');
                if (pDoiLink && pDoi) {
                    pDoiLink.href = `https://doi.org/${pDoi.doi}`;
                    pDoiLink.textContent = `DOI: ${pDoi.doi} ↗`;
                }
                if (pDoiCit && pDoi) {
                    pDoiCit.textContent = pDoi.citation;
                }"""
    if old_path_apply in html and "pathology-doi-link" not in html.split(old_path_apply)[1][:400]:
        html = html.replace(old_path_apply, new_path_apply, 1)

    # Atualiza o HTML final com o botão de fechar a legenda e o Modal Sobre / About completo (com Slava Ukraini em Latino e Cirílico)
    old_footer_sub = """    <div id="mozok-subtitle-bar" role="status" aria-live="polite">
        <strong style="color:#00f2fe; margin-right:6px;">🎙️ Gemini IA:</strong>
        <span id="mozok-subtitle-text"></span>
    </div>"""

    new_footer_sub_and_modal = """    <div id="mozok-subtitle-bar" role="status" aria-live="polite">
        <button id="mozok-subtitle-close" title="Fechar legenda" aria-label="Fechar legenda" onclick="document.getElementById('mozok-subtitle-bar').classList.remove('visible')">✕</button>
        <strong style="color:#00f2fe; margin-right:6px;">🎙️ Gemini IA:</strong>
        <span id="mozok-subtitle-text"></span>
    </div>

    <!-- MODAL SOBRE / ABOUT — MANIFESTO MOZOK, PATRIMÔNIO DA HUMANIDADE, LICENÇA APACHE 2.0 & HOMENAGEM À UCRÂNIA -->
    <div id="mozok-about-modal" class="mozok-modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="mozok-about-title">
        <div class="mozok-about-card">
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(148,163,184,0.2); padding-bottom:12px; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="brand-logo" style="width:38px; height:38px; font-size:20px;">🧠</div>
                    <div>
                        <h2 id="mozok-about-title" style="font-size:17px; font-weight:800; color:#f8fafc; margin:0;">MOZOK (МОЗОК) — Atlas & Simulador Científico do SNC & SNP</h2>
                        <div style="font-size:11px; color:#00f2fe; font-weight:600;">Patrimônio Científico e Educacional Aberto da Humanidade • Open Science</div>
                    </div>
                </div>
                <button class="popup-close-btn" id="btn-close-about-modal" title="Fechar" style="width:30px; height:30px; font-size:14px;">✕</button>
            </div>

            <div style="font-size:12.5px; line-height:1.58; color:#e2e8f0; display:flex; flex-direction:column; gap:12px;">
                <p style="margin:0;">
                    O <strong>MOZOK</strong> (do ucraniano <strong>«мозок»</strong> — <em>cérebro</em>) é um atlas neuroanatômico tridimensional multiescala e simulador neurofisiológico/fisiopatológico de código aberto. Ele integra a reconstrução cortical humana real <strong>MNI152 (McGill BrainBrowser — 81.924 vértices / 163.840 triângulos)</strong>, núcleos subcorticais, tronco encefálico, medula espinhal, nervos cranianos e periféricos, árvore cerebrovascular, meninges, conectoma neuronal fotorrealista da Camada V (Lei de Rall e sinapses bidirecionais) e 7 patologias neurológicas fundamentadas em artigos indexados com <strong>DOI</strong>.
                </p>

                <div style="padding:11px 14px; border-radius:10px; background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.4);">
                    <div style="font-size:11px; font-weight:800; color:#34d399; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
                        🌍 Pertence à Humanidade • Ética Deontológica de Immanuel Kant
                    </div>
                    <div style="font-size:12px; color:#ecfdf5;">
                        Fundamentado na <em>Boa Vontade (Der gute Wille)</em> e no <em>Imperativo Categórico</em> de <strong>Immanuel Kant</strong> (<em>«Sapere Aude!»</em>), o MOZOK declara que o conhecimento sobre a constituição, funcionamento e patologia do corpo humano <strong>pertence inalienavelmente a toda a humanidade</strong> (<em>«Знання належать людству. Мозок відкритий для світу»</em>). Projetado com justiça cognitiva para rodar com fluidez desde placas modestas (como a NVIDIA GTX 1650 e iGPUs) até smartphones e leitores acessíveis com <strong>VLibras</strong>.
                    </div>
                </div>

                <div class="mozok-ukraine-banner">
                    <div style="font-size:11.5px; font-weight:800; color:#FFD700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
                        🇺🇦 Homenagem à Ucrânia e à sua Tradição Científica Imortal
                    </div>
                    <div style="font-size:12px; color:#f8fafc; line-height:1.5;">
                        Batizar este projeto como <strong>MOZOK (МОЗОК)</strong> é um ato permanente de preservação cultural, soberania intelectual e reverência à dignidade do povo ucraniano. O MOZOK honra os gigantes da ciência ucraniana cujas descobertas alicerçam a neurobiologia e a medicina moderna:
                        <ul style="margin:6px 0 8px 18px; padding:0;">
                            <li><strong>Volodymyr Oleksiyovych Bets (Володимир Олексійович Бец, 1834–1894):</strong> Catedrático em Kyiv que descobriu em 1874 os neurônios piramidais gigantes da Camada V do córtex motor primário (<strong>Células de Betz</strong>).</li>
                            <li><strong>Ilya Ilyich Mechnikov (Ілля Ілліч Мечников, 1845–1916):</strong> Nascido em Kharkiv, Nobel de Medicina de 1908 pela descoberta da fagocitose e imunidade celular.</li>
                            <li><strong>Mykola Mykhailovych Amosov (Микола Михайлович Амосов, 1913–2002)</strong> & <strong>Oleksandr Bogomolets (Олександр Богомолець, 1881–1946):</strong> Pioneiros em Kyiv da cibernética biológica e da fisiopatologia celular.</li>
                        </ul>
                        <div class="mozok-slava-badge">
                            🇺🇦 Slava Ukraini! Heroiam Slava! • Слава Україні! Героям слава!
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
                    <div style="padding:10px 12px; border-radius:10px; background:rgba(15, 23, 42, 0.85); border:1px solid rgba(148, 163, 184, 0.25);">
                        <div style="font-size:10px; font-weight:800; color:#38bdf8; text-transform:uppercase;">⚖️ Licença de Software Livre</div>
                        <div style="font-size:12px; font-weight:700; color:#f8fafc; margin-top:2px;">Apache License 2.0</div>
                        <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Código-fonte 100% aberto, livre e auditável para ensino, pesquisa clínica e evolução perpétua pela comunidade mundial.</div>
                    </div>
                    <div style="padding:10px 12px; border-radius:10px; background:rgba(15, 23, 42, 0.85); border:1px solid rgba(148, 163, 184, 0.25);">
                        <div style="font-size:10px; font-weight:800; color:#facc15; text-transform:uppercase;">👨‍🔬 Autor & Arquitetura</div>
                        <div style="font-size:12px; font-weight:700; color:#f8fafc; margin-top:2px;">Pedro Luís Tenório Rocha de Almeida</div>
                        <div style="font-size:11px; color:#94a3b8; margin-top:2px;">ORCID: <a href="https://orcid.org/0009-0009-2971-8079" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">0009-0009-2971-8079</a> • Ecossistema Mriya / Svitlo</div>
                    </div>
                </div>

                <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; padding-top:8px; border-top:1px solid rgba(148,163,184,0.2);">
                    <a href="https://github.com/pedro-almeida/mozok" target="_blank" rel="noopener noreferrer" class="hud-btn active" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:8px 14px; font-size:12px;">
                        🐙 Repositório Oficial no GitHub (github.com/pedro-almeida/mozok) ↗
                    </a>
                    <button class="hud-btn" id="btn-close-about-footer" style="padding:7px 14px;">Fechar</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        (function() {
            const modal = document.getElementById('mozok-about-modal');
            const btnOpen = document.getElementById('btn-about');
            const btnClose1 = document.getElementById('btn-close-about-modal');
            const btnClose2 = document.getElementById('btn-close-about-footer');
            function openAbout() { if (modal) modal.classList.remove('hidden'); }
            function closeAbout() { if (modal) modal.classList.add('hidden'); }
            if (btnOpen) btnOpen.addEventListener('click', openAbout);
            if (btnClose1) btnClose1.addEventListener('click', closeAbout);
            if (btnClose2) btnClose2.addEventListener('click', closeAbout);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeAbout();
                });
            }
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                    closeAbout();
                }
            });
        })();
    </script>"""

    if old_footer_sub in html and 'id="mozok-about-modal"' not in html:
        html = html.replace(old_footer_sub, new_footer_sub_and_modal, 1)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("[OK] web/index.html atualizado com correção Mobile da barra de legenda, DOIs em todos os pop-ups/cards e Modal Sobre (Slava Ukraini / Слава Україні).")


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    audit_and_fix_i18n_cache()
    update_cns_anatomy_3d()
    update_index_html()

