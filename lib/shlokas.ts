export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaning_en: string;
  meaning_hi: string;
  keywords_en: string[];
  keywords_hi: string[];
  theme: string;
}

export const shlokas: Shloka[] = [
  // Anxiety, fear, overthinking
  {
    id: "2.14",
    chapter: 2,
    verse: 14,
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत।।",
    transliteration: "mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ\nāgamāpāyino ’nityās tāns titikṣhasva bhārata",
    meaning_en: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, O scion of Bharata, and one must learn to tolerate them without being disturbed.",
    meaning_hi: "हे कुन्तीपुत्र! इन्द्रियों और उनके विषयों के संयोग से उत्पन्न होने वाले सुख और दुख, सर्दी और गर्मी की तरह अस्थायी हैं। ये आते और जाते रहते हैं; इसलिए हे भरतवंशी! तुम्हें इन्हें बिना विचलित हुए सहन करना चाहिए।",
    keywords_en: ["anxiety", "fear", "overthinking", "temporary", "distress", "tolerate", "disturbed", "change", "feelings", "emotions", "cycles"],
    keywords_hi: ["डर", "चिंता", "अस्थायी", "दुख", "सहन", "विचलित", "अशांति", "overthinking", "tension"],
    theme: "Anxiety, fear, overthinking"
  },
  {
    id: "2.47",
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmani",
    meaning_en: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    meaning_hi: "तुम्हारा कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए कर्मों के फल की चिंता मत करो और अकर्मण्यता (कर्म न करने) से भी मत जुड़ो।",
    keywords_en: ["anxiety", "failure", "results", "outcomes", "overthinking", "results", "worry", "duty", "action", "attachment", "expectations", "future"],
    keywords_hi: ["चिंता", "भविष्य", "फल", "परिणाम", "कर्म", "अपेक्षा", "overthinking", "failure", "tension"],
    theme: "Anxiety, fear, overthinking"
  },
  {
    id: "2.56",
    chapter: 2,
    verse: 56,
    sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते।।",
    transliteration: "duḥkheṣhv-anudvigna-manāḥ sukheṣhu vigata-spṛihaḥ\nvīta-rāga-bhaya-krodhaḥ sthita-dhīr munir uchyate",
    meaning_en: "One whose mind remains undisturbed amidst misery, who does not crave for pleasure, and who is free from attachment, fear, and anger, is called a sage of steady wisdom.",
    meaning_hi: "जिसका मन दुखों के बीच भी अविचलित रहता है, जो सुखों की लालसा नहीं करता, और जो लगाव, भय तथा क्रोध से मुक्त है, वह स्थिर बुद्धि वाला मुनि कहलाता है।",
    keywords_en: ["anxiety", "fear", "anger", "peace", "misery", "crave", "attachment", "steady", "calm", "panic", "fearful"],
    keywords_hi: ["डर", "क्रोध", "गुस्सा", "दुख", "शांति", "लगाव", "भय", "अशांति", "panic", "dar"],
    theme: "Anxiety, fear, overthinking"
  },
  {
    id: "2.58",
    chapter: 2,
    verse: 58,
    sanskrit: "यदा संहरते चायं कूर्मोऽङ्गानीव सर्वशः।\nइन्द्रियाणीन्द्रियार्थेभ्यस्तस्य प्रज्ञा प्रतिष्ठिता।।",
    transliteration: "yadā sanharate chāyaṁ kūrmo ’ṅgānīva sarvaśhaḥ\nindriyāṇīndriyārthebhyas tasya prajñā pratiṣhṭhitā",
    meaning_en: "One who is able to withdraw his senses from sense objects, as the tortoise draws its limbs within the shell, is firmly fixed in perfect consciousness.",
    meaning_hi: "जिस प्रकार कछुआ अपने अंगों को हर ओर से अपने खोल के भीतर समेट लेता है, उसी प्रकार जब कोई व्यक्ति अपनी इन्द्रियों को उनके विषयों से हटा लेता है, तब उसकी बुद्धि स्थिर हो जाती है।",
    keywords_en: ["withdraw", "focus", "distraction", "senses", "overstimulation", "overthinking", "anxiety", "peace"],
    keywords_hi: ["ध्यान", "भटकाव", "शांति", "इन्द्रिय", "एकाग्रता", "distraction", "focus"],
    theme: "Anxiety, fear, overthinking"
  },
  
  // Grief, loss, death
  {
    id: "2.19",
    chapter: 2,
    verse: 19,
    sanskrit: "य एनं वेत्ति हन्तारं यश्चैनं मन्यते हतम्।\nउभौ तौ न विजानीतो नायं हन्ति न हन्यते।।",
    transliteration: "ya enaṁ vetti hantāraṁ yaśh chainaṁ manyate hatam\nubhau tau na vijānīto nāyaṁ hanti na hanyate",
    meaning_en: "Neither he who thinks the living entity the slayer nor he who thinks it slain is in knowledge, for the self slays not nor is slain.",
    meaning_hi: "जो इसे (आत्मा को) मारने वाला समझता है और जो इसे मरा हुआ मानता है, दोनों ही अज्ञानी हैं; क्योंकि यह आत्मा न तो किसी को मारता है और न ही मारा जाता है।",
    keywords_en: ["grief", "loss", "death", "soul", "eternal", "mourning", "pain", "passing", "die"],
    keywords_hi: ["शोक", "मृत्यु", "आत्मा", "दुख", "मौत", "दर्द", "loss", "death"],
    theme: "Grief, loss, death"
  },
  {
    id: "2.20",
    chapter: 2,
    verse: 20,
    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे।।",
    transliteration: "na jāyate mriyate vā kadāchin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śhāśhvato ’yaṁ purāṇo\nna hanyate hanyamāne śharīre",
    meaning_en: "For the soul there is neither birth nor death at any time. He has not come into being, does not come into being, and will not come into being. He is unborn, eternal, ever-existing and primeval. He is not slain when the body is slain.",
    meaning_hi: "आत्मा के लिए किसी भी समय न तो जन्म है और न मृत्यु। यह न तो कभी उत्पन्न हुआ है, न होता है और न ही होगा। यह अजन्मा, नित्य, शाश्वत और पुरातन है। शरीर के मारे जाने पर भी यह नहीं मारा जाता।",
    keywords_en: ["grief", "loss", "death", "soul", "birth", "eternal", "mourning", "hurt", "die"],
    keywords_hi: ["शोक", "मृत्यु", "जन्म", "आत्मा", "नित्य", "मौत", "death", "loss"],
    theme: "Grief, loss, death"
  },
  {
    id: "2.22",
    chapter: 2,
    verse: 22,
    sanskrit: "वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णा-\nन्यन्यानि संयाति नवानि देही।।",
    transliteration: "vāsānsi jīrṇāni yathā vihāya\nnavāni gṛihṇāti naro ’parāṇi\ntathā śharīrāṇi vihāya jīrṇān-\nyanyāni sanyāti navāni dehī",
    meaning_en: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    meaning_hi: "जैसे मनुष्य पुराने वस्त्रों को त्याग कर नए वस्त्र धारण करता है, वैसे ही आत्मा पुराने, व्यर्थ शरीरों को त्याग कर नए भौतिक शरीरों को स्वीकार करती है।",
    keywords_en: ["grief", "loss", "death", "change", "body", "clothes", "mourning", "passing"],
    keywords_hi: ["शोक", "वस्त्र", "शरीर", "परिवर्तन", "दुख", "मौत", "death"],
    theme: "Grief, loss, death"
  },
  {
    id: "2.23",
    chapter: 2,
    verse: 23,
    sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।\nन चैनं क्लेदयन्त्यापो न शोषयति मारुतः।।",
    transliteration: "nainaṁ chhindanti śhastrāṇi nainaṁ dahati pāvakaḥ\nna chainaṁ kledayantyāpo na śhoṣhayati mārutaḥ",
    meaning_en: "The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind.",
    meaning_hi: "इस आत्मा को कोई शस्त्र काट नहीं सकता, न ही आग इसे जला सकती है, न जल इसे भिगो सकता है और न ही हवा इसे सुखा सकती है।",
    keywords_en: ["grief", "loss", "death", "indestructible", "eternal", "soul"],
    keywords_hi: ["शोक", "शस्त्र", "अविनाशी", "आत्मा", "दुख", "शाश्वत"],
    theme: "Grief, loss, death"
  },

  // Career, purpose, confusion
  {
    id: "3.8",
    chapter: 3,
    verse: 8,
    sanskrit: "नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः।\nशरीरयात्रापि च ते न प्रसिद्धयेदकर्मणः।।",
    transliteration: "niyataṁ kuru karma tvaṁ karma jyāyo hyakarmaṇaḥ\nśharīra-yātrāpi cha te na prasiddhyed akarmaṇaḥ",
    meaning_en: "Perform your prescribed duty, for doing so is better than not working. One cannot even maintain one's physical body without work.",
    meaning_hi: "अपने नियत कर्मों को करो, क्योंकि कर्म न करने की अपेक्षा कर्म करना श्रेष्ठ है। काम किए बिना तो शरीर का निर्वाह भी संभव नहीं हो सकता।",
    keywords_en: ["career", "job", "purpose", "work", "duty", "lazy", "confusion", "stuck", "direction"],
    keywords_hi: ["करियर", "काम", "कर्तव्य", "नौकरी", "भ्रम", "आलस", "career", "job", "stuck"],
    theme: "Career, purpose, confusion"
  },
  {
    id: "3.19",
    chapter: 3,
    verse: 19,
    sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः।।",
    transliteration: "tasmād asaktaḥ satataṁ kāryaṁ karma samāchara\nasakto hyācharan karma param āpnoti pūruṣhaḥ",
    meaning_en: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.",
    meaning_hi: "इसलिए, कर्म के फलों में आसक्त हुए बिना निरंतर अपने कर्तव्य का पालन करो। अनासक्त होकर कर्म करने वाला मनुष्य सर्वोच्च लक्ष्य को प्राप्त करता है।",
    keywords_en: ["career", "motivation", "action", "work", "duty", "attachment", "success"],
    keywords_hi: ["करियर", "प्रेरणा", "कर्म", "कर्तव्य", "सफलता", "काम", "motivation"],
    theme: "Career, purpose, confusion"
  },
  {
    id: "3.35",
    chapter: 3,
    verse: 35,
    sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः।।",
    transliteration: "śhreyān swa-dharmo viguṇaḥ para-dharmāt svanuṣhṭhitāt\nswa-dharme nidhanaṁ śhreyaḥ para-dharmo bhayāvahaḥ",
    meaning_en: "It is far better to discharge one's prescribed duties, even though faultily, than another's duties perfectly. Destruction in the course of performing one's own duty is better than engaging in another's duties, for to follow another's path is dangerous.",
    meaning_hi: "दूसरों के कर्तव्य को भली-भांति पूर्ण करने की अपेक्षा अपना कर्तव्य (स्वधर्म) त्रुटिपूर्ण ढंग से करना भी श्रेष्ठ है। अपने धर्म का पालन करते हुए मरना भी उत्तम है, परन्तु दूसरों के मार्ग का अनुसरण करना हमेशा संकटपूर्ण होता है।",
    keywords_en: ["career", "purpose", "confusion", "comparison", "path", "duty", "imitation", "authentic", "stuck", "lost"],
    keywords_hi: ["करियर", "उद्देश्य", "रास्ता", "दूसरों", "स्वधर्म", "तुलना", "भ्रम", "lost", "path"],
    theme: "Career, purpose, confusion"
  },
  {
    id: "18.46",
    chapter: 18,
    verse: 46,
    sanskrit: "यतः प्रवृत्तिर्भूतानां येन सर्वमिदं ततम्।\nस्वकर्मणा तमभ्यर्च्य सिद्धिं विन्दति मानवः।।",
    transliteration: "yataḥ pravṛittir bhūtānāṁ yena sarvam idaṁ tatam\nsva-karmaṇā tam abhyarchya siddhiṁ vindati mānavaḥ",
    meaning_en: "By worship of the Lord, who is the source of all beings and who is all-pervading, a man can attain perfection through performing his own work.",
    meaning_hi: "जिससे सभी प्राणियों की उत्पत्ति हुई है और जिससे यह सम्पूर्ण ब्रह्मांड व्याप्त है, उसकी अपने कर्मों द्वारा पूजा करके मनुष्य पूर्णता (सिद्धि) को प्राप्त कर सकता है।",
    keywords_en: ["career", "purpose", "perfection", "work", "spirituality", "dedication"],
    keywords_hi: ["करियर", "सिद्धि", "पूर्णता", "कर्म", "समर्पण", "उद्देश्य"],
    theme: "Career, purpose, confusion"
  },

  // Anger, ego, jealousy
  {
    id: "2.63",
    chapter: 2,
    verse: 63,
    sanskrit: "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति।।",
    transliteration: "krodhād bhavati sammohaḥ sammohāt smṛiti-vibhramaḥ\nsmṛiti-bhranśhād buddhi-nāśho buddhi-nāśhāt praṇaśhyati",
    meaning_en: "From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool.",
    meaning_hi: "क्रोध से पूरा मोह (भ्रम) उत्पन्न होता है, और मोह से स्मरण शक्ति भ्रमित हो जाती है। जब स्मरण शक्ति भ्रमित होती है, तब बुद्धि नष्ट हो जाती है, और बुद्धि नष्ट होने पर मनुष्य का पतन हो जाता है।",
    keywords_en: ["anger", "ego", "jealousy", "delusion", "memory", "intelligence", "fall", "rage", "mad"],
    keywords_hi: ["क्रोध", "गुस्सा", "अहंकार", "बुद्धि", "पतन", "भ्रम", "anger", "gussa"],
    theme: "Anger, ego, jealousy"
  },
  {
    id: "16.21",
    chapter: 16,
    verse: 21,
    sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्।।",
    transliteration: "tri-vidhaṁ narakasyedaṁ dvāraṁ nāśhanam ātmanaḥ\nkāmaḥ krodhas tathā lobhas tasmād etat trayaṁ tyajet",
    meaning_en: "There are three gates leading to this hell—lust, anger and greed. Every sane man should give these up, for they lead to the degradation of the soul.",
    meaning_hi: "काम (वासना), क्रोध और लोभ—ये नरक के तीन द्वार हैं जो आत्मा का पतन करते हैं। इसलिए प्रत्येक समझदार व्यक्ति को इन तीनों को त्याग देना चाहिए।",
    keywords_en: ["anger", "greed", "lust", "desire", "hell", "degradation", "ego", "rage"],
    keywords_hi: ["क्रोध", "गुस्सा", "लोभ", "लालच", "वासना", "पतन", "anger", "greed"],
    theme: "Anger, ego, jealousy"
  },

  // Relationships, attachment, love
  {
    id: "2.62",
    chapter: 2,
    verse: 62,
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते।।",
    transliteration: "dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho ’bhijāyate",
    meaning_en: "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.",
    meaning_hi: "इन्द्रियों के विषयों (सुखों) का चिंतन करते हुए मनुष्य में उन विषयों के प्रति जुड़ाव (आसक्ति) पैदा हो जाता है। उस आसक्ति से कामना (लालसा) उत्पन्न होती है, और कामना से क्रोध जन्म लेता है।",
    keywords_en: ["relationships", "attachment", "love", "expectations", "desire", "heartbreak", "cravings"],
    keywords_hi: ["रिश्ते", "लगाव", "प्यार", "इच्छा", "आसक्ति", "उम्मीदें", "relationship", "love", "pyar"],
    theme: "Relationships, attachment, love"
  },
  {
    id: "2.71",
    chapter: 2,
    verse: 71,
    sanskrit: "विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः।\nनिर्ममो निरहङ्कारः स शान्तिमधिगच्छति।।",
    transliteration: "vihāya kāmān yaḥ sarvān pumānśh charati niḥspṛihaḥ\nnirmamo nirahaṅkāraḥ sa śhāntim adhigachchhati",
    meaning_en: "A person who has given up all desires for sense gratification, who lives free from desires, who has given up all sense of proprietorship and is devoid of false ego—he alone can attain real peace.",
    meaning_hi: "जो व्यक्ति इन्द्रिय-सुखों की सभी लालसाओं को त्याग देता है, जो कामनाओं से मुक्त होकर रहता है, जिसने स्वामित्व की भावना और मिथ्या अहंकार को छोड़ दिया है - वही सच्ची शांति प्राप्त कर सकता है।",
    keywords_en: ["relationships", "attachment", "love", "peace", "ego", "desire", "breakaway", "free", "harmony"],
    keywords_hi: ["रिश्ते", "शांति", "अहंकार", "मुक्त", "प्यार", "लगाव", "release", "let go"],
    theme: "Relationships, attachment, love"
  },

  // Self-doubt, confidence
  {
    id: "6.5",
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः।।",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hyātmano bandhur ātmaiva ripur ātmanaḥ",
    meaning_en: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    meaning_hi: "मनुष्य को अपने मन की सहायता से अपना उद्धार करना चाहिए, और अपने को पतन की ओर नहीं जाने देना चाहिए। क्योंकि मन ही इस आत्मा का मित्र है, और मन ही इसका शत्रु भी है।",
    keywords_en: ["self-doubt", "confidence", "mind", "enemy", "friend", "worth", "insecure", "weak", "power"],
    keywords_hi: ["आत्मविश्वास", "संदेह", "मन", "मित्र", "शत्रु", "कमजोर", "doubt", "confidence"],
    theme: "Self-doubt, confidence"
  },
  {
    id: "6.6",
    chapter: 6,
    verse: 6,
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः।\nअनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत्।।",
    transliteration: "bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ\nanātmanas tu śhatrutve vartetātmaiva śhatru-vat",
    meaning_en: "For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy.",
    meaning_hi: "जिसने अपने मन पर विजय प्राप्त कर ली है, उसके लिए मन सर्वश्रेष्ठ मित्र है; परन्तु जो ऐसा नहीं कर पाया, उसके लिए उसका अपना मन ही उसका सबसे बड़ा शत्रु बना रहता है।",
    keywords_en: ["self-doubt", "confidence", "conquer", "mind", "control", "focus", "worth", "enemy", "friend"],
    keywords_hi: ["विजय", "आत्मविश्वास", "मन", "नियंत्रण", "संदेह", "शत्रु", "overcome"],
    theme: "Self-doubt, confidence"
  },

  // Failure, results, outcomes
  {
    id: "4.18",
    chapter: 4,
    verse: 18,
    sanskrit: "कर्मण्यकर्म यः पश्येदकर्मणि च कर्म यः।\nस बुद्धिमान्मनुष्येषु स युक्तः कृत्स्नकर्मकृत्।।",
    transliteration: "karmaṇyakarma yaḥ paśhyed akarmaṇi cha karma yaḥ\nsa buddhimān manuṣhyeṣhu sa yuktaḥ kṛitsna-karma-kṛit",
    meaning_en: "One who sees inaction in action, and action in inaction, is intelligent among men, and he is in the transcendental position, although engaged in all sorts of activities.",
    meaning_hi: "जो मनुष्य कर्म में अकर्म देखता है, और अकर्म में कर्म देखता है, वह सभी मनुष्यों में बुद्धिमान है, और सभी प्रकार के कर्मों में लगे रहने पर भी वह एक योगी की स्थिति में रहता है।",
    keywords_en: ["failure", "results", "outcomes", "action", "inaction", "smart", "understanding", "karma"],
    keywords_hi: ["असफलता", "कर्म", "अकर्म", "परिणाम", "बुद्धिमान", "failure", "result"],
    theme: "Failure, results, outcomes"
  },

  // Decision making, dilemma
  {
    id: "18.63",
    chapter: 18,
    verse: 63,
    sanskrit: "इति ते ज्ञानमाख्यातं गुह्याद्गुह्यतरं मया।\nविमृश्यैतदशेषेण यथेच्छसि तथा कुरु।।",
    transliteration: "iti te jñānam ākhyātaṁ guhyād guhyataraṁ mayā\nvimṛiśhyaitad aśheṣheṇa yathechchhasi tathā kuru",
    meaning_en: "Thus I have explained to you knowledge still more confidential. Deliberate on this fully, and then do what you wish to do.",
    meaning_hi: "इस प्रकार मैंने तुम्हें वह ज्ञान बता दिया है जो रहस्यपूर्ण से भी अधिक रहस्यपूर्ण है। इस पर पूरी तरह से विचार करो, और फिर जैसा तुम चाहते हो, वैसा करो।",
    keywords_en: ["decision", "dilemma", "choice", "confusion", "crossroads", "freewill", "wisely", "deliberate"],
    keywords_hi: ["निर्णय", "दुविधा", "विकल्प", "भ्रम", "विचार", "स्वतंत्रता", "decision", "choice"],
    theme: "Decision making, dilemma"
  },

  // Motivation, action
  {
    id: "11.33",
    chapter: 11,
    verse: 33,
    sanskrit: "तस्मात्त्वमुत्तिष्ठ यशो लभस्व\nजित्वा शत्रून्भुङ्क्ष्व राज्यं समृद्धम्।\nमयैवैते निहताः पूर्वमेव\nनिमित्तमात्रं भव सव्यसाचिन्।।",
    transliteration: "tasmāt tvam uttiṣhṭha yaśho labhasva\njitvā śhatrūn bhuṅkṣhva rājyaṁ samṛiddham\nmayaivaite nihatāḥ pūrvam eva\nnimitta-mātraṁ bhava savya-sāchin",
    meaning_en: "Therefore, get up. Prepare to fight and win glory. Conquer your enemies and enjoy a flourishing kingdom. They are already put to death by My arrangement, and you, O Savyasachi, can be but an instrument in the fight.",
    meaning_hi: "इसलिए उठो! युद्ध के लिए तैयार होओ और यश प्राप्त करो। अपने शत्रुओं पर विजय प्राप्त करो और समृद्ध राज्य का आनंद लो। मेरी व्यवस्था से ये लोग पहले ही मारे जा चुके हैं; हे सव्यसाची (अर्जुन), तुम तो केवल एक साधन मात्र बनो।",
    keywords_en: ["motivation", "action", "stand", "fight", "instrument", "glory", "lazy", "depressed"],
    keywords_hi: ["प्रेरणा", "उठो", "निमित्त", "यश", "कर्म", "आलस", "motivation"],
    theme: "Motivation, action"
  },

  // Loneliness, depression
  {
    id: "6.30",
    chapter: 6,
    verse: 30,
    sanskrit: "यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति।\nतस्याहं न प्रणश्यामि स च मे न प्रणश्यति।।",
    transliteration: "yo māṁ paśhyati sarvatra sarvaṁ cha mayi paśhyati\ntasyāhaṁ na praṇaśhyāmi sa cha me na praṇaśhyati",
    meaning_en: "For one who sees Me everywhere and sees everything in Me, I am never lost, nor is he ever lost to Me.",
    meaning_hi: "जो मुझे सब जगह देखता है और सब कुछ मुझमें देखता है, उसके लिए मैं कभी अदृश्य नहीं होता, और वह मेरे लिए कभी अदृश्य नहीं होता।",
    keywords_en: ["loneliness", "depression", "alone", "lost", "nobody", "support", "everywhere", "presence"],
    keywords_hi: ["अकेलापन", "डिप्रेशन", "निराशा", "अदृश्य", "सब जगह", "उदास", "alone", "lonely"],
    theme: "Loneliness, depression"
  },
  {
    id: "9.22",
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्।।",
    transliteration: "ananyāśh chintayanto māṁ ye janāḥ paryupāsate\nteṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmyaham",
    meaning_en: "But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have.",
    meaning_hi: "लेकिन जो लोग अनन्य भक्ति भाव से मेरा ध्यान करते हुए हमेशा मेरी उपासना करते हैं—उन नित्य लगे रहने वाले भक्तों को जो उनके पास नहीं है, वह मैं प्रदान करता हूँ, और जो उनके पास है, उसकी मैं रक्षा करता हूँ।",
    keywords_en: ["loneliness", "depression", "devotion", "care", "preserve", "lack", "support", "alone", "protection"],
    keywords_hi: ["अकेलापन", "रक्षा", "उपासना", "सहायता", "सुरक्षा", "उदास", "alone", "depressed"],
    theme: "Loneliness, depression"
  },
  
  // Discipline
  {
    id: "6.17",
    chapter: 6,
    verse: 17,
    sanskrit: "युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा।।",
    transliteration: "yuktāhāra-vihārasya yukta-cheṣhṭasya karmasu\nyukta-svapnāvabodhasya yogo bhavati duḥkha-hā",
    meaning_en: "He who is regulated in his habits of eating, sleeping, recreation and work can mitigate all material pains by practicing the yoga system.",
    meaning_hi: "जो खाने, सोने, आमोद-प्रमोद तथा काम करने की आदतों में नियमित रहता है, वह योगाभ्यास द्वारा समस्त भौतिक क्लेशों को नष्ट कर सकता है।",
    keywords_en: ["discipline", "routine", "habits", "health", "balance", "lazy", "control", "consistency", "sluggish"],
    keywords_hi: ["अनुशासन", "आदत", "नियम", "संतुलन", "आलस", "control", "discipline", "balance"],
    theme: "Discipline"
  },
  {
    id: "2.64",
    chapter: 2,
    verse: 64,
    sanskrit: "रागद्वेषवियुक्तैस्तु विषयानिन्द्रियैश्चरन्।\nआत्मवश्यैर्विधेयात्मा प्रसादमधिगच्छति।।",
    transliteration: "rāga-dveṣha-viyuktais tu viṣhayān indriyaiśh charan\nātma-vaśhyair vidheyātmā prasādam adhigachchhati",
    meaning_en: "But a person free from all attachment and aversion and able to control his senses through regulative principles of freedom can obtain the complete mercy of the Lord.",
    meaning_hi: "किन्तु जो सभी राग और द्वेष से मुक्त है और स्वतंत्रता के नियमों द्वारा अपनी इन्द्रियों को वश में करने में समर्थ है, वह भगवान की पूर्ण कृपा प्राप्त कर सकता है।",
    keywords_en: ["discipline", "control", "temptation", "addiction", "restraint", "desire", "urge", "mastery"],
    keywords_hi: ["नियंत्रण", "संयम", "इच्छा", "लत", "addiction", "kontrol", "temptation"],
    theme: "Discipline"
  },
  {
    id: "3.7",
    chapter: 3,
    verse: 7,
    sanskrit: "यस्त्विन्द्रियाणि मनसा नियम्यारभतेऽर्जुन।\nकर्मेन्द्रियैः कर्मयोगमसक्तः स विशिष्यते।।",
    transliteration: "yas tvindriyāṇi manasā niyamyārabhate ’rjuna\nkarmendriyaiḥ karma-yogam asaktaḥ sa viśhiṣhyate",
    meaning_en: "On the other hand, if a sincere person tries to control the active senses by the mind and begins karma-yoga (in Kṛṣṇa consciousness) without attachment, he is by far superior.",
    meaning_hi: "दूसरी ओर, यदि कोई निष्ठावान व्यक्ति अपने मन द्वारा कर्मेन्द्रियों को नियंत्रित करने का प्रयास करता है और बिना किसी आसक्ति के कर्मयोग शुरू करता है, तो वह कहीं अधिक श्रेष्ठ है।",
    keywords_en: ["discipline", "mindset", "superior", "restraint", "work", "sincere", "effort"],
    keywords_hi: ["प्रयास", "मन", "नियंत्रण", "श्रेष्ठ", "कर्म", "effort", "control"],
    theme: "Discipline"
  },
  {
    id: "17.16",
    chapter: 17,
    verse: 16,
    sanskrit: "मनः प्रसादः सौम्यत्वं मौनमात्मविनिग्रहः।\nभावसंशुद्धिरित्येतत्तपो मानसमुच्यते।।",
    transliteration: "manaḥ-prasādaḥ saumyatvaṁ maunam ātma-vinigrahaḥ\nbhāva-sanśhuddhir ity etat tapo mānasam uchyate",
    meaning_en: "And satisfaction, simplicity, gravity, self-control and purification of one's existence are the austerities of the mind.",
    meaning_hi: "तथा संतोष, सरलता, गम्भीरता, आत्म-संयम और जीवन की शुद्धि—ये मन की तपस्याएँ हैं।",
    keywords_en: ["discipline", "simplicity", "satisfaction", "mind", "purity", "self-control", "austerity"],
    keywords_hi: ["संतोष", "तपस्या", "संयम", "मन", "शुद्धि", "simplicity", "self-control"],
    theme: "Discipline"
  },
  {
    id: "6.36",
    chapter: 6,
    verse: 36,
    sanskrit: "असंयतात्मना योगो दुष्प्राप इति मे मतिः।\nवश्यात्मना तु यतता शक्योऽवाप्तुमुपायतः।।",
    transliteration: "asaṁyatātmanā yogo duṣhprāpa iti me matiḥ\nvaśhyātmanā tu yatatā śhakyo ’vāptum upāyataḥ",
    meaning_en: "For one whose mind is unbridled, self-realization is difficult work. But he whose mind is controlled and who strives by appropriate means is assured of success. That is My opinion.",
    meaning_hi: "जिसका मन अनियंत्रित है, उसके लिए आत्म-साक्षात्कार कठिन है। परन्तु जिसका मन नियंत्रित है और जो उचित साधनों से प्रयास करता है, उसकी सफलता निश्चित है। ऐसा मेरा मत है।",
    keywords_en: ["discipline", "success", "uncontrolled", "struggle", "mind", "effort", "failure", "unstable"],
    keywords_hi: ["सफलता", "अनियंत्रित", "प्रयास", "कठिन", "मन", "struggle", "unstable", "success"],
    theme: "Discipline"
  },

  // Focus
  {
    id: "6.34",
    chapter: 6,
    verse: 34,
    sanskrit: "चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम्।\nतस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम्।।",
    transliteration: "chañchalaṁ hi manaḥ kṛiṣhṇa pramāthi balavad dṛiḍham\ntasyāhaṁ nigrahaṁ manye vāyor iva su-duṣhkaram",
    meaning_en: "The mind is restless, turbulent, obstinate and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind.",
    meaning_hi: "हे कृष्ण! मन चंचल, उग्र, जिद्दी और बहुत बलवान है। मुझे लगता है कि इसे वश में करना हवा को नियंत्रित करने से भी अधिक कठिन है।",
    keywords_en: ["focus", "restless", "turbulent", "mind", "adhd", "distracted", "scattered", "unfocused"],
    keywords_hi: ["चंचल", "मन", "ध्यान", "भटकाव", "कठिन", "distracted", "focus", "restless"],
    theme: "Focus"
  },
  {
    id: "6.35",
    chapter: 6,
    verse: 35,
    sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।।",
    transliteration: "asaṁśhayaṁ mahā-bāho mano durnigrahaṁ chalam\nabhyāsena tu kaunteya vairāgyeṇa cha gṛihyate",
    meaning_en: "Lord Krishna said: O mighty-armed son of Kunti, it is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment.",
    meaning_hi: "भगवान कृष्ण ने कहा: हे महाबाहु कुन्तीपुत्र! चंचल मन को वश में करना निस्संदेह बहुत कठिन है, परन्तु उचित अभ्यास और वैराग्य से ऐसा संभव है।",
    keywords_en: ["focus", "practice", "consistency", "difficult", "mind", "training", "habit", "study"],
    keywords_hi: ["अभ्यास", "मन", "वैराग्य", "संभव", "कठिन", "practice", "focus", "habit"],
    theme: "Focus"
  },
  {
    id: "2.41",
    chapter: 2,
    verse: 41,
    sanskrit: "व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन।\nबहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम्।।",
    transliteration: "vyavasāyātmikā buddhir ekeha kuru-nandana\nbahu-śhākhā hyanantāśh cha buddhayo ’vyavasāyinām",
    meaning_en: "Those who are on this path are resolute in purpose, and their aim is one. O beloved child of the Kurus, the intelligence of those who are irresolute is many-branched.",
    meaning_hi: "जो लोग इस मार्ग पर हैं, वे अपने उद्देश्य में दृढ़ होते हैं, और उनका लक्ष्य एक होता है। हे कुरुनंदन! जो लोग दृढ़-प्रतिज्ञ नहीं हैं, उनकी बुद्धि कई शाखाओं वाली होती है।",
    keywords_en: ["focus", "purpose", "resolute", "aim", "scattered", "confused", "direction", "multitasking", "goals"],
    keywords_hi: ["उद्देश्य", "लक्ष्य", "दृढ़", "बुद्धि", "भटकाव", "goals", "aim", "focus"],
    theme: "Focus"
  },
  {
    id: "6.25",
    chapter: 6,
    verse: 25,
    sanskrit: "शनैः शनैरुपरमेद्बुद्ध्या धृतिगृहीतया।\nआत्मसंस्थं मनः कृत्वा न किञ्चिदपि चिन्तयेत्।।",
    transliteration: "śhanaiḥ śhanair uparamed buddhyā dhṛiti-gṛihītayā\nātma-sansthaṁ manaḥ kṛitvā na kiñchid api chintayet",
    meaning_en: "Gradually, step by step, one should become situated in trance by means of intelligence sustained by full conviction, and thus the mind should be fixed on the Self alone and should think of nothing else.",
    meaning_hi: "धीरे-धीरे, पूर्ण विश्वास से टिकी हुई बुद्धि के द्वारा समाधि में स्थित होना चाहिए, और इस प्रकार मन को केवल आत्मा में ही स्थिर करना चाहिए और अन्य कुछ नहीं सोचना चाहिए।",
    keywords_en: ["focus", "gradual", "step-by-step", "meditation", "thoughts", "racing", "mind", "calm"],
    keywords_hi: ["धीरे-धीरे", "बुद्धि", "आत्मा", "विचार", "ध्यान", "meditation", "calm", "focus"],
    theme: "Focus"
  },

  // Detachment
  {
    id: "5.10",
    chapter: 5,
    verse: 10,
    sanskrit: "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः।\nलिप्यते न स पापेन पद्मपत्रमिवाम्भसा।।",
    transliteration: "brahmaṇyādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ\nlipyate na sa pāpena padma-patram ivāmbhasā",
    meaning_en: "One who performs his duty without attachment, surrendering the results unto the Supreme Lord, is unaffected by sinful action, as the lotus leaf is untouched by water.",
    meaning_hi: "जो व्यक्ति बिना आसक्ति के अपना कर्तव्य करता है और परिणामों को परमेश्वर को समर्पित कर देता है, वह पाप कर्मों से उसी प्रकार अछूता रहता है जैसे कमल का पत्ता जल से अछूता रहता है।",
    keywords_en: ["detachment", "unaffected", "lotus", "surrender", "results", "letting go", "toxic", "drama"],
    keywords_hi: ["आसक्ति", "कमल", "समर्पित", "अछूता", "पाप", "let go", "toxic", "detachment"],
    theme: "Detachment"
  },
  {
    id: "13.9",
    chapter: 13,
    verse: 9,
    sanskrit: "असक्तिरनभिष्वङ्गः पुत्रदारगृहादिषु।\nनित्यं च समचित्तत्वमिष्टानिष्टोपपत्तिषु।।",
    transliteration: "asaktir anabhiṣhvaṅgaḥ putra-dāra-gṛihādiṣhu\nnityaṁ cha sama-chittatvam iṣhṭāniṣhṭopapattiṣhu",
    meaning_en: "Detachment, freedom from entanglement with children, wife, home and the rest; even-mindedness amid pleasant and unpleasant events...",
    meaning_hi: "वैराग्य, बच्चों, पत्नी, घर आदि के मोह से मुक्ति; और सुखद तथा दुखद घटनाओं के बीच समान भावना बनाए रखना...",
    keywords_en: ["detachment", "family", "entanglement", "expectations", "independence", "boundaries", "equanimity"],
    keywords_hi: ["वैराग्य", "मोह", "मुक्ति", "समान", "परिजन", "expectations", "boundaries"],
    theme: "Detachment"
  },
  {
    id: "5.12",
    chapter: 5,
    verse: 12,
    sanskrit: "युक्तः कर्मफलं त्यक्त्वा शान्तिमाप्नोति नैष्ठिकीम्।\nअयुक्तः कामकारेण फले सक्तो निबध्यते।।",
    transliteration: "yuktaḥ karma-phalaṁ tyaktvā śhāntim āpnoti naiṣhṭhikīm\nayuktaḥ kāma-kāreṇa phale sakto nibadhyate",
    meaning_en: "The steadily devoted soul attains unadulterated peace because he offers the result of all activities to Me; whereas a person who is not in union with the Divine, who is greedy for the fruits of his labor, becomes entangled.",
    meaning_hi: "निरन्तर भक्ति में लगा हुआ साधक विशुद्ध शांति प्राप्त करता है क्योंकि वह सभी कर्मों का फल मुझे (ईश्वर को) अर्पित करता है; जबकि जो व्यक्ति भगवान से जुड़ा नहीं है और अपने कर्मों के फलों का लालची है, वह उलझ जाता है।",
    keywords_en: ["detachment", "peace", "greedy", "entangled", "fruits", "labor", "reward", "obsession"],
    keywords_hi: ["शांति", "लालची", "उलझन", "आसक्ति", "फल", "reward", "obsession", "peace"],
    theme: "Detachment"
  },
  {
    id: "2.48",
    chapter: 2,
    verse: 48,
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच్యते।।",
    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate",
    meaning_en: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
    meaning_hi: "हे अर्जुन! सफलता या असफलता की सभी आसक्ति को त्याग कर, समभाव में रहते हुए अपना कर्तव्य करो। ऐसी समता ही योग कहलाती है।",
    keywords_en: ["detachment", "equable", "failure", "success", "equanimity", "pressure", "expectations"],
    keywords_hi: ["समभाव", "सफलता", "असफलता", "योग", "आसक्ति", "pressure", "failure", "success"],
    theme: "Detachment"
  },

  // Leadership
  {
    id: "3.21",
    chapter: 3,
    verse: 21,
    sanskrit: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते।।",
    transliteration: "yad yad ācharati śhreṣhṭhas tat tad evetaro janaḥ\nsa yat pramāṇaṁ kurute lokas tad anuvartate",
    meaning_en: "Whatever action a great man performs, common men follow. And whatever standards he sets by exemplary acts, all the world pursues.",
    meaning_hi: "महान व्यक्ति जो भी आचरण करता है, सामान्य लोग उसी का अनुसरण करते हैं। और वह अपने आदर्श कार्यों से जो भी मानक तय करता है, पूरा संसार उसी पर चलता है।",
    keywords_en: ["leadership", "example", "influence", "role model", "responsibility", "boss", "manager", "pressure"],
    keywords_hi: ["नेतृत्व", "आदर्श", "अनुसरण", "प्रभाव", "ज़िम्मेदारी", "manager", "leader", "responsibility"],
    theme: "Leadership"
  },
  {
    id: "18.43",
    chapter: 18,
    verse: 43,
    sanskrit: "शौर्यं तेजो धृतिर्दाक्ष्यं युद्धे चाप्यपलायनम्।\nदानमीश्वरभावश्च क्षात्रं कर्म स्वभावजम्।।",
    transliteration: "śhauryaṁ tejo dhṛitir dākṣhyaṁ yuddhe chāpy apalāyanam\ndānam īśhvara-bhāvaśh cha kṣhātraṁ karma svabhāva-jam",
    meaning_en: "Heroism, power, determination, resourcefulness, courage in battle, generosity and leadership are the natural qualities of work for the ksatriyas (leaders/warriors).",
    meaning_hi: "वीरता, तेज, संकल्प, साधन-सम्पन्नता, युद्ध में न भागने का साहस, उदारता और नेतृत्व क्षमता—ये क्षत्रियों (नेताओं/योद्धाओं) के स्वाभाविक कर्म गुण हैं।",
    keywords_en: ["leadership", "courage", "generosity", "power", "heroism", "brave", "coward", "manager", "weak"],
    keywords_hi: ["वीरता", "नेतृत्व", "साहस", "उदारता", "क्षमता", "brave", "leader", "courage"],
    theme: "Leadership"
  },
  {
    id: "3.25",
    chapter: 3,
    verse: 25,
    sanskrit: "सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत।\nकुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसङ्ग्रहम्।।",
    transliteration: "saktāḥ karmaṇy avidvāṁso yathā kurvanti bhārata\nkuryād vidvāns tathāsaktaśh chikīrṣhur loka-saṅgraham",
    meaning_en: "As the ignorant perform their duties with attachment to results, the learned may similarly act, but without attachment, for the sake of leading people on the right path.",
    meaning_hi: "हे भरत! जिस प्रकार अज्ञानी लोग फलों की आसक्ति के साथ अपना कर्तव्य करते हैं, उसी प्रकार विद्वान लोग भी कर्म कर सकते हैं, किन्तु बिना आसक्ति के, ताकि लोगों को सही मार्ग पर ले जाया जा सके।",
    keywords_en: ["leadership", "guide", "mentor", "wise", "ignorant", "responsibility", "society", "influence"],
    keywords_hi: ["मार्गदर्शन", "विद्वान", "समाज", "ज़िम्मेदारी", "mentor", "guide", "lead"],
    theme: "Leadership"
  },
  {
    id: "18.5",
    chapter: 18,
    verse: 5,
    sanskrit: "यज्ञदानतपःकर्म न त्याज्यं कार्यमेव तत्।\nयज्ञो दानं तपश्चैव पावनानि मनीषिणाम्।।",
    transliteration: "yajña-dāna-tapaḥ-karma na tyājyaṁ kāryam eva tat\nyajño dānaṁ tapaśh chaiva pāvanāni manīṣhiṇām",
    meaning_en: "Acts of sacrifice, charity and penance are not to be given up; they must be performed. Indeed, sacrifice, charity and penance purify even the great souls.",
    meaning_hi: "यज्ञ, दान और तपस्या के कर्मों का त्याग नहीं किया जाना चाहिए; इन्हें अवश्य किया जाना चाहिए। वास्तव में, यज्ञ, दान और तपस्या महान आत्माओं को भी पवित्र करते हैं।",
    keywords_en: ["leadership", "charity", "sacrifice", "duty", "giving", "responsibility", "pure", "community"],
    keywords_hi: ["यज्ञ", "दान", "पवित्र", "समाज", "कर्तव्य", "charity", "sacrifice", "give"],
    theme: "Leadership"
  },

  // Confusion
  {
    id: "2.7",
    chapter: 2,
    verse: 7,
    sanskrit: "कार्पण्यदोषोपहतस्वभावः\nपृच्छामि त्वां धर्मसम्मूढचेताः।\nयच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे\nशिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्।।",
    transliteration: "kārpaṇya-doṣhopahata-svabhāvaḥ\npṛichchhāmi tvāṁ dharma-sammūḍha-chetāḥ\nyach chhreyaḥ syān niśhchitaṁ brūhi tan me\nśhiṣhyas te ’haṁ śhādhi māṁ tvāṁ prapannam",
    meaning_en: "Now I am confused about my duty and have lost all composure because of miserly weakness. In this condition I am asking You to tell me for certain what is best for me. Now I am Your disciple, and a soul surrendered unto You. Please instruct me.",
    meaning_hi: "अब मैं अपने कर्तव्य के विषय में भ्रमित हूँ और दुर्बलता के कारण अपना सारा धैर्य खो चुका हूँ। इस स्थिति में, मैं आपसे प्रार्थना करता हूँ कि निश्चित रूप से बताएँ कि मेरे लिए क्या श्रेयस्कर है। अब मैं आपका शिष्य हूँ और आपकी शरण में हूँ। कृपया मुझे शिक्षा दें।",
    keywords_en: ["confusion", "stuck", "lost", "guidance", "weakness", "help", "crossroads", "what to do"],
    keywords_hi: ["भ्रम", "उलझन", "कनफ्यूज", "मार्गदर्शन", "दुर्बलता", "shiksha", "confusion", "stuck", "pareshani"],
    theme: "Confusion"
  },
  {
    id: "18.73",
    chapter: 18,
    verse: 73,
    sanskrit: "नष्टो मोहः स्मृतिर्लब्धा त्वत्प्रसादान्मयाच्युत।\nस्थितोऽस्मि गतसन्देहः करिष्ये वचनं तव।।",
    transliteration: "naṣhṭo mohaḥ smṛitir labdhā tvat-prasādān mayāchyuta\nsthito ’smi gata-sandehaḥ kariṣhye vachanaṁ tava",
    meaning_en: "Arjuna said: My dear Krishna, O infallible one, my illusion is now gone. I have regained my memory by Your mercy. I am now firm and free from doubt and am prepared to act according to Your instructions.",
    meaning_hi: "अर्जुन ने कहा: हे अच्युत (कृष्ण)! मेरी मोह (भ्रांति) अब नष्ट हो गई है। आपकी कृपा से मुझे स्मृति वापस मिल गई है। अब मैं दृढ़ हूँ, संदेह से मुक्त हूँ, और आपके निर्देशों के अनुसार कार्य करने के लिए तैयार हूँ।",
    keywords_en: ["confusion", "clarity", "doubt", "ready", "decision", "firm", "resolved", "understood"],
    keywords_hi: ["भ्रांति", "स्पष्ट", "संदेह", "तैयार", "निर्देश", "clarity", "doubt", "resolved"],
    theme: "Confusion"
  },
  {
    id: "3.2",
    chapter: 3,
    verse: 2,
    sanskrit: "व्यामिश्रेणेव वाक्येन बुद्धिं मोहयसीव मे।\nतदेकं वद निश्चित्य येन श्रेयोऽहमाप्नुयाम्।।",
    transliteration: "vyāmiśhreṇeva vākyena buddhiṁ mohayasīva me\ntad ekaṁ vada niśhchitya yena śhreyo ’ham āpnuyām",
    meaning_en: "My intelligence is bewildered by your equivocal instructions. Therefore, please tell me decisively which will be most beneficial for me.",
    meaning_hi: "आपके अनेकार्थक (मिले-जुले) वचनों से मेरी बुद्धि भ्रमित हो रही है। इसलिए, कृपया निश्चित रूप से कोई एक बात बताएँ जो मेरे लिए सर्वाधिक कल्याणकारी हो।",
    keywords_en: ["confusion", "overwhelmed", "mixed signals", "advice", "decisive", "bewildered", "lost"],
    keywords_hi: ["भ्रमित", "कल्याणकारी", "निश्चित", "कनफ्यूज", "confused", "lost", "advice", "pareshani"],
    theme: "Confusion"
  },
  {
    id: "4.16",
    chapter: 4,
    verse: 16,
    sanskrit: "किं कर्म किमकर्मेति कवयोऽप्यत्र मोहिताः।\nतत्ते कर्म प्रवक्ष्यामि यज्ज्ञात्वा मोक्ष्यसेऽशुभात्।।",
    transliteration: "kiṁ karma kim akarmeti kavayo ’py atra mohitāḥ\ntat te karma pravakṣhyāmi yaj jñātvā mokṣhyase ’śhubhāt",
    meaning_en: "Even the intelligent are bewildered in determining what is action and what is inaction. Now I shall explain to you what action is, knowing which you shall be liberated from all misfortune.",
    meaning_hi: "क्या कर्म है और क्या अकर्म, यह तय करने में बुद्धिमान लोग भी भ्रमित हो जाते हैं। अब मैं तुम्हें समझाऊंगा कि कर्म क्या है, जिसे जानकर तुम सभी अशुभ (मुसीबतों) से मुक्त हो जाओगे।",
    keywords_en: ["confusion", "action", "inaction", "misfortune", "smart", "intelligent", "complex", "stuck"],
    keywords_hi: ["अशुभ", "मुसीबत", "तय", "कर्म", "अकर्म", "stuck", "complex", "what to do"],
    theme: "Confusion"
  },

  // Inner Peace
  {
    id: "5.29",
    chapter: 5,
    verse: 29,
    sanskrit: "भोक्तारं यज्ञतपसां सर्वलोकमहेश्वरम्।\nसुहृदं सर्वभूतानां ज्ञात्वा मां शान्तिमृच्छति।।",
    transliteration: "bhoktāraṁ yajña-tapasāṁ sarva-loka-maheśhvaram\nsuhṛidaṁ sarva-bhūtānāṁ jñātvā māṁ śhāntim ṛichchhati",
    meaning_en: "A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries.",
    meaning_hi: "जो व्यक्ति मुझे सभी यज्ञों और तपस्याओं का अंतिम भोक्ता, सभी लोकों का परम ईश्वर, तथा सभी प्राणियों का हितैषी और शुभचिन्तक मानता है, वह समस्त भौतिक दुखों से शांति प्राप्त करता है।",
    keywords_en: ["inner peace", "miseries", "calm", "well-wisher", "universe", "comfort", "safe", "relief"],
    keywords_hi: ["शांति", "हितैषी", "परम", "दुख", "सुकून", "calm", "safe", "peace"],
    theme: "Inner Peace"
  },
  {
    id: "2.70",
    chapter: 2,
    verse: 70,
    sanskrit: "आपूर्यमाणमचलप्रतिष्ठं\nसमुद्रमापः प्रविशन्ति यद्वत्।\nतद्वत्कामा यं प्रविशन्ति सर्वे\nस शान्तिमाप्नोति न कामकामी।।",
    transliteration: "āpūryamāṇam achala-pratiṣhṭhaṁ\nsamudram āpaḥ praviśhanti yadvat\ntadvat kāmā yaṁ praviśhanti sarve\nsa śhāntim āpnoti na kāma-kāmī",
    meaning_en: "A person who is not disturbed by the incessant flow of desires—that enter like rivers into the ocean, which is ever being filled but is always still—can alone achieve peace, and not the man who strives to satisfy such desires.",
    meaning_hi: "जो व्यक्ति इच्छाओं के निरंतर प्रवाह से विचलित नहीं होता—जैसे नदियाँ समुद्र में प्रवेश करती हैं, जो हमेशा भरता रहता है परन्तु हमेशा स्थिर रहता है—केवल वही शांति प्राप्त कर सकता है, न कि वह मनुष्य जो अपनी इच्छाओं को पूरा करने के लिए भागता रहता है।",
    keywords_en: ["inner peace", "desires", "stillness", "ocean", "disturbed", "chasing", "calm", "content"],
    keywords_hi: ["स्थिर", "समुद्र", "शांति", "इच्छाओं", "भागदौड़", "content", "stillness", "peace"],
    theme: "Inner Peace"
  },
  {
    id: "12.12",
    chapter: 12,
    verse: 12,
    sanskrit: "श्रेयो हि ज्ञानमभ्यासाज्ज्ञानाद्ध्यानं विशिष्यते।\nध्यानात्कर्मफलत्यागस्त्यागाच्छान्तिरनन्तरम्।।",
    transliteration: "śhreyo hi jñānam abhyāsāj jñānād dhyānaṁ viśhiṣhyate\ndhyānāt karma-phala-tyāgas tyāgāch chhāntir anantaram",
    meaning_en: "If you cannot take to this practice, then engage yourself in the cultivation of knowledge. Better than knowledge, however, is meditation, and better than meditation is renunciation of the fruits of action, for by such renunciation one can attain peace of mind.",
    meaning_hi: "यदि तुम यह अभ्यास नहीं कर सकते, तो ज्ञान की प्राप्ति में लग जाओ। ज्ञान से श्रेष्ठ ध्यान है, और ध्यान से श्रेष्ठ है कर्मों के फलों का त्याग, क्योंकि ऐसे त्याग से मन की असीम शांति प्राप्त की जा सकती है।",
    keywords_en: ["inner peace", "meditation", "knowledge", "renunciation", "fruits", "mind", "calm", "relax"],
    keywords_hi: ["मन", "शांति", "ध्यान", "ज्ञान", "त्याग", "relax", "calm", "peace"],
    theme: "Inner Peace"
  },
  {
    id: "18.66",
    chapter: 18,
    verse: 66,
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः।।",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śharaṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣhayiṣhyāmi mā śhuchaḥ",
    meaning_en: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    meaning_hi: "सभी प्रकार के धर्मों का परित्याग करो और केवल मेरी शरण में आओ। मैं तुम्हें सभी पापों से मुक्त कर दूँगा। डरो मत।",
    keywords_en: ["inner peace", "surrender", "fear", "sin", "deliverance", "safety", "forgiveness", "burden"],
    keywords_hi: ["शरण", "डर", "पाप", "मुक्त", "माफी", "burden", "fear", "peace"],
    theme: "Inner Peace"
  },
  {
    id: "18.62",
    chapter: 18,
    verse: 62,
    sanskrit: "तमेव शरणं गच्छ सर्वभावेन भारत।\nतत्प्रसादात्परां शान्तिं स्थानं प्राप्स्यसि शाश्वतम्।।",
    transliteration: "tam eva śharaṇaṁ gachchha sarva-bhāvena bhārata\ntat-prasādāt parāṁ śhāntiṁ sthānaṁ prāpsyasi śhāśhvatam",
    meaning_en: "O scion of Bharata, surrender unto Him utterly. By His grace you will attain transcendental peace and the supreme and eternal abode.",
    meaning_hi: "हे भरतवंशी! पूरी तरह से केवल उन्हीं (भगवान) की शरण में जाओ। उनकी कृपा से तुम परम शांति और सर्वोच्च एवं शाश्वत धाम (स्थान) प्राप्त करोगे।",
    keywords_en: ["inner peace", "grace", "eternal", "abode", "surrender", "supreme peace", "calm"],
    keywords_hi: ["शाश्वत", "परम शांति", "कृपा", "शरण", "calm", "eternal", "peace"],
    theme: "Inner Peace"
  }
];

// Helper dictionaries
const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't",
  'mein', 'mera', 'meri', 'mujhe', 'mere', 'hai', 'ki', 'ko', 'se', 'tha', 'thi', 'the', 'ka', 'ke', 'aur', 'par', 'hi', 'bhi', 'kya', 'kaise', 'kyun', 'kab', 'kahan', 'woh', 'yeh', 'un', 'unhe', 'unka', 'uski', 'uska', 'iske', 'iski', 'hu', 'hoon', 'ho', 'bahut', 'rahi', 'raha', 'feel', 'feeling'
]);

const synonymMap: Record<string, string[]> = {
  "stuck": ["confused", "lost", "directionless", "crossroads"],
  "anxiety": ["stress", "tension", "overthinking", "worry", "panic", "pareshan"],
  "anger": ["frustration", "rage", "irritated", "gussa", "mad", "angry"],
  "fear": ["scared", "afraid", "dar", "terrified"],
  "grief": ["sad", "depressed", "dukhi", "loss", "mourning"]
};

// Emotion priority words
const highEmotionThemes = new Set(["lost", "scared", "angry", "tired", "pressure"]);

export function findRelevantShlokas(userProblem: string, language: 'en' | 'hi'): Shloka[] {
  // 1. Normalize input
  const normalizedInput = userProblem.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, '');
  
  // 2. Token handling (length >= 3, no stopwords)
  const tokens = Array.from(new Set(
    normalizedInput.split(/\s+/).filter(word => word.length >= 3 && !stopWords.has(word))
  ));

  // Inverse synonym lookup (maps a token or its synonym natively back to the full group)
  const tokenSynonymGroups: string[][] = [];
  tokens.forEach(token => {
    let group: string[] = [token];
    Object.entries(synonymMap).forEach(([key, syns]) => {
      if (key === token || syns.includes(token)) {
        group = [...group, key, ...syns];
      }
    });
    tokenSynonymGroups.push(group);
  });

  const hasEmotionWord = tokens.some(t => highEmotionThemes.has(t)) || 
                         tokenSynonymGroups.flat().some(t => highEmotionThemes.has(t));

  // 3 & 6. Final Scoring System
  const scoredShlokas = shlokas.map(shloka => {
    let score = 0;
    const keywordList = [...shloka.keywords_en, ...shloka.keywords_hi].map(k => k.toLowerCase());
    
    // Evaluate each meaningful token
    tokens.forEach((token, idx) => {
      let bestMatchScore = 0;
      const synonymGroup = tokenSynonymGroups[idx];

      for (const kw of keywordList) {
        if (kw === token) {
          bestMatchScore = Math.max(bestMatchScore, 3); // Exact match
        } else if (synonymGroup.includes(kw)) {
          bestMatchScore = Math.max(bestMatchScore, 2); // Hinglish/Translated/Synonym match
        } else if (kw.includes(token) || token.includes(kw)) {
          bestMatchScore = Math.max(bestMatchScore, 1); // Partial match
        }
      }
      
      score += bestMatchScore;
    });

    // 5. Emotion prioritization (+2 boost)
    if (score > 0 && hasEmotionWord) {
      // Check if this specific shloka relates to those hard themes
      const belongsToEmotion = keywordList.some(k => 
         highEmotionThemes.has(k) || tokenSynonymGroups.flat().includes(k)
      );
      if (belongsToEmotion) {
        score += 2;
      }
    }

    return { shloka, score };
  });

  // Filters out 0 scores
  const validScores = scoredShlokas.filter(s => s.score > 0);
  
  // Rank all shlokas top to bottom
  validScores.sort((a, b) => b.score - a.score);

  // 7. Fallback condition
  if (validScores.length === 0) {
    return getUniversalShlokas();
  }

  return validScores.slice(0, 3).map(i => i.shloka);
}

function getUniversalShlokas(): Shloka[] {
  // Universal fallback: 2.47, 6.5, 18.66
  const ids = ["2.47", "6.5", "18.66"];
  return ids.map(id => shlokas.find(s => s.id === id)!).filter(Boolean).slice(0, 3);
}
