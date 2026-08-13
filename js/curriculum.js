/**
 * English Mastery Coach (Start -> B2) Curriculum Database
 * 13 Parts | 100 Stages | 8-Skill Integrated Data Model with Dynamic Content Generators
 */

const CURRICULUM_DATA = {
  parts: [
    {
      id: 1,
      title: "PART 1: Foundations",
      stagesCount: 8,
      level: "A1 (Beginner)",
      description: "Understand basic sentence building blocks, word order, and parts of speech.",
      stages: [
        {
          id: 1,
          globalStage: 1,
          title: "What is a sentence?",
          goal: "Identify subject, verb, and basic word order to produce clear simple statements.",
          skills: {
            grammar: {
              title: "Subject + Verb & Word Order",
              concept: "A complete sentence in English requires a Subject (who or what) and a Verb (the action or state). Standard English word order starts with the subject followed by the verb.",
              exampleSets: [
                [
                  { en: "Birds fly.", note: "Subject: Birds | Verb: fly" },
                  { en: "The sun shines.", note: "Subject: The sun | Verb: shines" },
                  { en: "Children play.", note: "Subject: Children | Verb: play" }
                ],
                [
                  { en: "Stars shine.", note: "Subject: Stars | Verb: shine" },
                  { en: "Dogs bark.", note: "Subject: Dogs | Verb: bark" },
                  { en: "Rain falls.", note: "Subject: Rain | Verb: falls" }
                ],
                [
                  { en: "Water flows.", note: "Subject: Water | Verb: flows" },
                  { en: "Flowers bloom.", note: "Subject: Flowers | Verb: bloom" },
                  { en: "Wind blows.", note: "Subject: Wind | Verb: blows" }
                ]
              ]
            },
            vocabulary: {
              title: "Everyday Core Verbs & Nouns",
              vocabBanks: [
                [
                  { word: "bird", meaning: "A feathered creature that flies", ipa: "/bɜːd/", collocation: "birds fly / birds sing" },
                  { word: "sun", meaning: "The star that gives light to Earth", ipa: "/sʌn/", collocation: "the sun shines / rise" },
                  { word: "rain", meaning: "Water falling from clouds", ipa: "/reɪn/", collocation: "heavy rain / rain falls" }
                ],
                [
                  { word: "star", meaning: "A luminous astronomical object in the night sky", ipa: "/stɑː/", collocation: "bright star / stars shine" },
                  { word: "river", meaning: "A natural flowing watercourse", ipa: "/ˈrɪv.ə/", collocation: "river flows / cross a river" },
                  { word: "wind", meaning: "Perceptible natural movement of air", ipa: "/wɪnd/", collocation: "strong wind / wind blows" }
                ],
                [
                  { word: "flower", meaning: "The seed-bearing part of a plant", ipa: "/ˈflaʊ.ə/", collocation: "wild flower / flowers bloom" },
                  { word: "ocean", meaning: "A very large expanse of sea", ipa: "/ˈəʊ.ʃən/", collocation: "deep ocean / blue ocean" },
                  { word: "forest", meaning: "A large area covered chiefly with trees", ipa: "/ˈfɒr.ɪst/", collocation: "dense forest / green forest" }
                ]
              ]
            },
            pronunciation: {
              title: "British English Vowels & Word Stress",
              pronunciationSets: [
                {
                  targetSound: "/ɜː/ & /ɔː/ Pure Vowel Length",
                  ipaFocus: "/bɜːd/, /sʌn/, /wɔːk/",
                  rules: "In Standard Southern British (SSB / Received Pronunciation), long vowels like /ɜː/ in 'bird' and /ɔː/ in 'walk' are elongated without rhotic 'r' sounds.",
                  audioPrompts: ["bird /bɜːd/", "sun /sʌn/", "walk /wɔːk/"]
                },
                {
                  targetSound: "/ɑː/ Non-Rhotic Palm Vowel",
                  ipaFocus: "/kɑː/, /pɑːk/, /stɑː/",
                  rules: "In RP, post-vocalic 'r' is silent in 'car' and 'park', expanding into a deep, open back vowel /ɑː/.",
                  audioPrompts: ["car /kɑː/", "park /pɑːk/", "star /stɑː/"]
                },
                {
                  targetSound: "Weak Schwa /ə/ Reduction",
                  ipaFocus: "/ˈrɪv.ə/, /ˈflaʊ.ə/, /ət/",
                  rules: "Unstressed final syllables in British English reduce to a neutral Schwa /ə/. Jaw and lips remain completely relaxed.",
                  audioPrompts: ["river /ˈrɪv.ə/", "flower /ˈflaʊ.ə/", "at the office /ət ðə ˈɒfɪs/"]
                }
              ]
            },
            listening: {
              title: "Simple Sentence Recognition",
              transcript: "Look at the sky. Birds fly high when the sun shines.",
              question: "What happens when the sun shines?",
              options: ["Birds fly high", "It rains heavily", "Night begins"],
              answer: 0
            },
            reading: {
              title: "Foundation Reading Passage",
              passageSets: [
                {
                  passage: "English sentences have a subject and a verb. The subject performs the action. For example, 'Cats sleep' is a complete sentence.",
                  checkQuestion: "What two main parts are required in a basic English sentence?",
                  answer: "Subject and Verb"
                },
                {
                  passage: "The sun rises every morning in the east. Birds sing in the trees as a new day begins.",
                  checkQuestion: "Where do birds sing as a new day begins?",
                  answer: "In the trees"
                },
                {
                  passage: "Rivers flow downwards toward the sea. Water brings life to plants, animals, and people everywhere.",
                  checkQuestion: "Where do rivers flow towards?",
                  answer: "Toward the sea"
                }
              ]
            },
            speaking: {
              title: "Spontaneous Production Drill",
              prompt: "Say three simple 2-word or 3-word sentences describing natural actions (e.g., 'Dogs bark.', 'Water flows.').",
              shadowingSentence: "She works with him at the office every day, and he helps her.",
              shadowingIPA: "/ʃiː wɜːks wɪð ɪm ət ðə ˈɒfɪs ˈevri deɪ, ən hiː helps ə/"
            },
            writing: {
              title: "Sentence Construction Exercise",
              prompt: "Write 3 complete simple sentences about your daily surroundings using Subject + Verb word order.",
              sampleAnswer: "The sun rises. People walk. Time passes."
            },
            communication: {
              title: "Basic Personal Statement",
              prompt: "Answer: What do you do every morning?",
              suggestedAnswer: "I wake up. I drink tea."
            }
          },
          exerciseSets: [
            [
              {
                id: "p1s1_ex1_set1",
                type: "fill_blank",
                question: "Complete the sentence: The sun _______ bright in the morning.",
                options: ["shines", "shine", "shining"],
                correctIndex: 0,
                explanation: "Singular subject 'The sun' requires third-person singular verb 'shines'."
              },
              {
                id: "p1s1_ex2_set1",
                type: "unscramble",
                words: ["fly", "high", "Birds"],
                correctSentence: "Birds fly high",
                explanation: "Subject (Birds) comes before the verb (fly)."
              }
            ],
            [
              {
                id: "p1s1_ex1_set2",
                type: "fill_blank",
                question: "Complete the sentence: Heavy rain _______ from the dark clouds.",
                options: ["falls", "fall", "falling"],
                correctIndex: 0,
                explanation: "Uncountable subject 'Heavy rain' takes third-person singular verb 'falls'."
              },
              {
                id: "p1s1_ex2_set2",
                type: "unscramble",
                words: ["brightly", "shine", "Stars"],
                correctSentence: "Stars shine brightly",
                explanation: "Subject (Stars) + Verb (shine) + Adverb (brightly)."
              }
            ],
            [
              {
                id: "p1s1_ex1_set3",
                type: "fill_blank",
                question: "Complete the sentence: The cold wind _______ softly tonight.",
                options: ["blows", "blow", "blowing"],
                correctIndex: 0,
                explanation: "Singular subject 'The cold wind' takes third-person singular verb 'blows'."
              },
              {
                id: "p1s1_ex2_set3",
                type: "unscramble",
                words: ["downwards", "flow", "Rivers"],
                correctSentence: "Rivers flow downwards",
                explanation: "Subject (Rivers) + Verb (flow) + Directional adverb (downwards)."
              }
            ]
          ]
        },
        {
          id: 2,
          globalStage: 2,
          title: "Nouns",
          goal: "Identify and use proper, common, concrete, and abstract nouns accurately.",
          skills: {
            grammar: {
              title: "Nouns (People, Places, Things, Ideas)",
              concept: "Nouns name entities. Common nouns (city, doctor) use lowercase; Proper nouns (London, Dr. Smith) are capitalized.",
              exampleSets: [
                [
                  { en: "London is a large city.", note: "London = Proper noun, city = Common noun" },
                  { en: "Happiness comes from peace.", note: "Happiness & peace = Abstract nouns" }
                ]
              ]
            },
            vocabulary: {
              vocabBanks: [
                [
                  { word: "capital", ipa: "/ˈkæp.ɪ.təl/", meaning: "Chief city of a country" },
                  { word: "citizen", ipa: "/ˈsɪt.ɪ.zən/", meaning: "Inhabitant of a town or state" }
                ]
              ]
            },
            pronunciation: {
              pronunciationSets: [
                {
                  targetSound: "First Syllable Noun Stress",
                  ipaFocus: "/ˈkæp.ɪ.təl/, /ˈsɪt.ɪ.zən/",
                  rules: "Most two-syllable and three-syllable English nouns place stress on the first syllable."
                }
              ]
            },
            speaking: { prompt: "Name 3 proper nouns and 3 common nouns in your room right now." },
            writing: { prompt: "Write 2 sentences incorporating at least one abstract noun like 'knowledge' or 'freedom'." }
          },
          exerciseSets: [
            [
              {
                id: "p1s2_ex1_set1",
                type: "fill_blank",
                question: "Which word must be capitalized? 'She visited _______ last summer.'",
                options: ["london", "London", "the City"],
                correctIndex: 1,
                explanation: "Proper nouns representing specific city names are always capitalized."
              }
            ]
          ]
        },
        { id: 3, globalStage: 3, title: "Pronouns", goal: "Replace nouns with personal, subject, and object pronouns fluently." },
        { id: 4, globalStage: 4, title: "Verbs", goal: "Master action vs. state verbs and the essential verb 'to be'." },
        { id: 5, globalStage: 5, title: "Adjectives & Adverbs", goal: "Modify nouns with adjectives and actions with adverbs." },
        { id: 6, globalStage: 6, title: "Prepositions & Conjunctions", goal: "Connect elements using basic spatial, temporal, and logical connectors." },
        { id: 7, globalStage: 7, title: "The 8 Parts of Speech - Integration", goal: "Recognize how all 8 word classes work together in complete sentences." },
        { id: 8, globalStage: 8, title: "Foundation Checkpoint", goal: "Demonstrate A1 Foundation mastery across all 8 skill areas." }
      ]
    },
    {
      id: 2,
      title: "PART 2: Core Sentence Patterns",
      stagesCount: 7,
      level: "A1+ / A2",
      description: "Master the 6 main structural sentence patterns in English.",
      stages: [
        {
          id: 1,
          globalStage: 9,
          title: "Subject + Verb (SV)",
          goal: "Build intransitive verb statements with proper sentence stress.",
          skills: {
            grammar: {
              concept: "Intransitive verbs do not require a direct object to complete their meaning.",
              exampleSets: [[{ en: "The snow fell.", note: "Subject: The snow | Verb: fell" }]]
            },
            vocabulary: { vocabBanks: [[{ word: "fall", ipa: "/fɔːl/", meaning: "Drop downwards" }]] },
            pronunciation: { pronunciationSets: [{ ipaFocus: "/ðə ˈsnəʊ ˈfel/", rules: "Sentence Stress & Rhythm" }] },
            speaking: { prompt: "Describe three things in nature that happen automatically using S+V." }
          },
          exerciseSets: [[{ id: "p2s1_ex1_set1", type: "fill_blank", question: "The snow _______ during the quiet night.", options: ["fell", "falling", "falls down"], correctIndex: 0 }]]
        },
        { id: 2, globalStage: 10, title: "Subject + Verb + Object (SVO)", goal: "Form active sentences using transitive verbs and direct objects." },
        { id: 3, globalStage: 11, title: "Subject + Be + Complement (SVC)", goal: "Express state, identity, and qualities using subject complements." },
        { id: 4, globalStage: 12, title: "Subject + Verb + Indirect Object + Object (SVIOD O)", goal: "Express transfer, giving, and telling patterns accurately." },
        { id: 5, globalStage: 13, title: "Object + Complement (SVOC)", goal: "Describe changes in status or opinion (They appointed him director)." },
        { id: 6, globalStage: 14, title: "There + Be Patterns", goal: "Introduce existence of objects and situations naturally." },
        { id: 7, globalStage: 15, title: "Sentence Expansion & Pattern Mastery", goal: "Confidently expand basic clause structures into detailed sentences." }
      ]
    },
    {
      id: 3,
      title: "PART 3: Nouns, Pronouns & Determiners",
      stagesCount: 7,
      level: "A2",
      description: "Master countable/uncountable distinctions, determiners, possessives, and agreement.",
      stages: [
        { id: 1, globalStage: 16, title: "Singular & Plural Nouns", goal: "Master regular and irregular plural forms with correct pronunciation (/s/, /z/, /ɪz/)." },
        { id: 2, globalStage: 17, title: "Countable & Uncountable Nouns", goal: "Distinguish countable units from uncountable masses." },
        { id: 3, globalStage: 18, title: "Personal & Reflexive Pronouns", goal: "Use pronouns correctly without confusing subject, object, and self-referential forms." },
        { id: 4, globalStage: 19, title: "Possessives", goal: "Control possessive nouns ('s) and possessive adjectives/pronouns (my/mine)." },
        { id: 5, globalStage: 20, title: "Articles (A / An / The)", goal: "Master indefinite vs. definite article usage and zero article rules." },
        { id: 6, globalStage: 21, title: "Determiners & Quantifiers", goal: "Use much, many, few, little, some, any, and all accurately." },
        { id: 7, globalStage: 22, title: "Integration & Agreement", goal: "Ensure flawless subject-verb-determiner agreement across complex phrases." }
      ]
    },
    {
      id: 4,
      title: "PART 4: Verbs, Auxiliaries, Questions & Negatives",
      stagesCount: 8,
      level: "A2",
      description: "Master auxiliary verb systems (be, have, do), WH-questions, and negative forms.",
      stages: [
        { id: 1, globalStage: 23, title: "Be", goal: "Master 'be' as both main verb and auxiliary across present and past." },
        { id: 2, globalStage: 24, title: "Have", goal: "Control 'have' for possession and auxiliary function." },
        { id: 3, globalStage: 25, title: "Do", goal: "Use 'do/does/did' effortlessly for emphasis, negatives, and questions." },
        { id: 4, globalStage: 26, title: "Main Verbs", goal: "Distinguish dynamic action verbs from state verbs." },
        { id: 5, globalStage: 27, title: "Auxiliary Verbs", goal: "Combine auxiliary verbs smoothly in multi-verb structures." },
        { id: 6, globalStage: 28, title: "Questions", goal: "Form Yes/No, WH-, subject/object, and indirect questions with inversion." },
        { id: 7, globalStage: 29, title: "Negatives", goal: "Form precise negative statements and contracted negative speech." },
        { id: 8, globalStage: 30, title: "Mixed Sentence Control", goal: "Seamlessly switch between statements, questions, and negatives in conversation." }
      ]
    },
    {
      id: 5,
      title: "PART 5: Tenses",
      stagesCount: 8,
      level: "A2 / B1",
      description: "Control present, past, and future tenses, aspects, and temporal contrasts.",
      stages: [
        {
          id: 1,
          globalStage: 31,
          title: "Present Simple",
          goal: "Express daily routines, habits, general truths, and permanent states.",
          skills: {
            grammar: {
              concept: "Use Present Simple for repeated actions and permanent facts. Add -s/-es for 3rd person singular (he, she, it).",
              exampleSets: [
                [
                  { en: "I work in London.", note: "General state" },
                  { en: "She starts work at 9:00 AM.", note: "Daily routine (3rd person singular)" }
                ]
              ]
            },
            vocabulary: {
              vocabBanks: [
                [
                  { word: "routine", ipa: "/ruːˈtiːn/", collocation: "daily routine / follow a routine" },
                  { word: "commute", ipa: "/kəˈmjuːt/", collocation: "commute to work / daily commute" }
                ]
              ]
            },
            pronunciation: {
              pronunciationSets: [
                {
                  targetSound: "3rd Person Endings /s/, /z/, /ɪz/",
                  ipaFocus: "walks /wɔːks/, lives /lɪvz/, teaches /ˈtiː.tʃɪz/",
                  rules: "Voiceless final sounds take /s/; voiced sounds take /z/; sibilants take /ɪz/."
                }
              ]
            },
            speaking: { prompt: "Describe your daily routine from morning to evening using 4-5 sentences." },
            writing: { prompt: "Write a short paragraph about a colleague or friend's daily work schedule." }
          },
          exerciseSets: [
            [
              {
                id: "p5s1_ex1_set1",
                type: "fill_blank",
                question: "He _______ to work by train every morning.",
                options: ["travels", "travel", "travelling"],
                correctIndex: 0,
                explanation: "Subject 'He' requires third-person singular verb 'travels'."
              }
            ]
          ]
        },
        { id: 2, globalStage: 32, title: "Present Continuous", goal: "Describe actions happening right now and temporary situations." },
        { id: 3, globalStage: 33, title: "Past Simple", goal: "Narrate completed past actions using regular (-ed) and irregular past forms." },
        { id: 4, globalStage: 34, title: "Past Continuous", goal: "Set past backgrounds and describe interrupted actions." },
        { id: 5, globalStage: 35, title: "Future Forms", goal: "Distinguish 'will' vs. 'going to' vs. Present Continuous for future." },
        { id: 6, globalStage: 36, title: "Present Perfect", goal: "Connect past actions to present result/experience." },
        { id: 7, globalStage: 37, title: "Past Perfect", goal: "Establish clear chronological sequence between two past events." },
        { id: 8, globalStage: 38, title: "Tense Contrasts & Real Communication", goal: "Fluidly shift between tenses while telling stories." }
      ]
    },
    { id: 6, title: "PART 6: Adjectives, Adverbs & Comparison", stagesCount: 6, level: "B1", description: "Master descriptive precision, comparatives, and superlatives.", stages: [] },
    { id: 7, title: "PART 7: Prepositions & Conjunctions", stagesCount: 6, level: "B1", description: "Master spatial, temporal, and dependent prepositions.", stages: [] },
    { id: 8, title: "PART 8: Phrases & Clauses", stagesCount: 8, level: "B1 / B1+", description: "Build complex sentences using clauses.", stages: [] },
    { id: 9, title: "PART 9: Vocabulary & Word Formation", stagesCount: 8, level: "B1+", description: "Expand active vocabulary.", stages: [] },
    { id: 10, title: "PART 10: B1 Communication", stagesCount: 8, level: "B1 Mastery", description: "Develop independent communication.", stages: [] },
    { id: 11, title: "PART 11: B1+ Development", stagesCount: 8, level: "B1+ / Entry B2", description: "Build answer length and argumentation.", stages: [] },
    {
      id: 12,
      title: "PART 12: B2 Grammar & Communication",
      stagesCount: 10,
      level: "B2 Upper-Intermediate",
      description: "Master complex grammatical structures (Conditionals, Passive, Reported Speech).",
      stages: [
        {
          id: 1,
          globalStage: 83,
          title: "Conditionals",
          goal: "Master zero, first, second, third, and mixed conditionals.",
          skills: {
            grammar: {
              concept: "Conditionals express outcomes based on conditions. 1st conditional = real future; 2nd = hypothetical present; 3rd = hypothetical past.",
              exampleSets: [
                [
                  { en: "If governments fail to act, pollution will increase.", note: "1st Conditional (Real Future)" },
                  { en: "If I had studied harder in school, I would have a different career today.", note: "Mixed Conditional" }
                ]
              ]
            },
            vocabulary: {
              vocabBanks: [
                [
                  { word: "consequence", ipa: "/ˈkɒn.sɪ.kwəns/", collocation: "inevitable consequence" },
                  { word: "hypothetical", ipa: "/ˌhaɪ.pəˈθet.ɪ.kəl/", collocation: "hypothetical scenario" }
                ]
              ]
            },
            pronunciation: {
              pronunciationSets: [
                {
                  targetSound: "Weak Forms in Auxiliaries",
                  ipaFocus: "If I'd studied... /ɪf aɪəd ˈstʌd.id/",
                  rules: "Contractions like 'I'd' and 'would've' (/wʊdəv/) are essential for natural British spoken rhythm in conditionals."
                }
              ]
            },
            speaking: { prompt: "What would you do if you were granted three wishes?" }
          },
          exerciseSets: [
            [
              {
                id: "p12s1_ex1_set1",
                type: "fill_blank",
                question: "If we _______ (start) the project earlier, we would be finished by now.",
                options: ["had started", "started", "have started"],
                correctIndex: 0,
                explanation: "Mixed conditional requires past perfect 'had started' for past action affecting present."
              }
            ]
          ]
        }
      ]
    },
    { id: 13, title: "PART 13: B2 Speaking & Writing Mastery", stagesCount: 8, level: "B2 Mastery", description: "Achieve spontaneous B2 speaking fluency and formal writing.", stages: [] }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CURRICULUM_DATA };
}
