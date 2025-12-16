/**
 * Quiz Module
 * Dayner D&D Lore Website
 * Generates lore-based quiz questions from all lore files
 */

const QuizModule = (function() {
  let quizPanel = null;
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let totalQuestions = 10;
  let quizActive = false;
  let loreData = null;
  let isLoading = false;

  // Base path for fetching lore files (must match server structure)
  const LORE_BASE_PATH = 'Lore/DND/';

  // All lore file paths organized by category
  const LORE_FILES = {
    modernCharacters: {
      basePath: 'Character Lore/Modern Characters/',
      files: [
        'King Tarvin Braeden IV.md', 'Queen Maera Braeden.md', 'Lord-Marshal Caelric Ironward.md',
        'Lady Envoy Myrelle.md', 'Bridge-Warden Elara Thornguard.md', 'Captain Mira Blackshore.md',
        'Warden Hella Stonebrow.md', 'Bramwell Stone.md', 'Cleric Veyner Drosk.md',
        'Lord Adrian Silwynn.md', 'Captain Darren Glaze.md', 'Captain Gareth Wystan.md',
        'Captain Hilda Stonebreaker.md', 'Trader Korgin Deepdelve.md', 'Guildmaster Brogar Flamevein.md',
        'Father Aldric Mourning.md', 'High Chamberlain Aldous Fenn.md', 'Knight-Commander Cedric Hallam.md',
        'Consul Alistair Bryne.md', 'Marshal Corin Ashfeld.md', 'Commander Brynn Ashworth.md',
        'Portreeve Garrett Dunholm.md', 'Lord-Governor Callum Westmarch.md', 'Magistrate Vorn Hallas.md',
        'Fleet-Captain Isolde Merrick.md', 'Fenris Thorne.md', 'Aelindra Mistwalker.md',
        'Serath Valen.md', 'Kira Stoneheart.md', 'Hestia Vael.md', 'Elder Maeven Shawl.md',
        'Harbormaster Edric Salthollow.md', 'Father-Commander Aldous Valorian.md', 'High Archon Lysanthe Kilmora.md',
        'Chris Meudec.md', 'Scrit.md'
      ]
    },
    historicCharacters: {
      basePath: 'Character Lore/Historic Characters/',
      files: [
        'Balthazar The Great Wizard.md',
        'General Arach Tharne.md', 'General Yon Garathorn.md', 'Grand Inquisitor Pellaro.md',
        'High Thane Broldir Flameforged.md', 'Imperial Warmaster Dravarian.md',
        'Legate Sienna Valtoris.md', 'Pirate Queen Aris Steel-Eye.md',
        'Princess Araleth Oakheath.md', 'Sea Lord Helmar Lynth.md'
      ]
    },
    beastsCreatures: {
      basePath: 'Character Lore/Beasts & Creatures/',
      files: [
        'Bagi the Brass Tempest.md', 'The Spehlina.md'
      ]
    },
    kingdoms: {
      Braewood: {
        capital: ['Capital/Braewood City.md'],
        large: ['Large Cities/Eaveton.md', 'Large Cities/Mortling Stronghold.md', 'Large Cities/Phine.md'],
        medium: ['Medium City/Barge.md', 'Medium City/Kadena.md', 'Medium City/Sheyton.md', 'Medium City/Strane.md'],
        towns: ['Town/Ardismouth.md', 'Town/Borugham.md', 'Town/Cleamond.md', 'Town/Gitstin.md', 'Town/Osegas.md', 'Town/Yotherdon.md'],
        villages: ['Village/Adaham.md', 'Village/Dalo.md', 'Village/Frore.md', 'Village/Ioxyhull.md', 'Village/Rens.md', 'Village/Vorton.md']
      },
      Islefield: {
        capital: ['Capital/Islefield City.md'],
        large: ['Large Cities/Rye.md']
      },
      Kluimont: {
        capital: ['Capital/Kluimont City.md'],
        large: ['Large Cities/Eimgend.md']
      },
      Lavalto: {
        large: ['Large Cities/Darewaeton.md']
      }
    }
  };

  // Historic battles data from Historic Battles.md
  const HISTORIC_BATTLES = [
    { name: 'Battle of Iron Break', year: '650 C.C.', victor: 'Tharnic Empire', loser: 'Dwarven Rebels', keyFigure: 'General Arach Tharne', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Siege of Treadfast Hold', year: '715 C.C.', victor: 'Dwarven Coalition', loser: 'Tharnic Empire', keyFigure: 'High Thane Broldir Flameforged', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Hammerfall Uprising', year: '720 C.C.', victor: 'Allied Coalition', loser: 'Tharnic Empire', keyFigure: 'Imperial Warmaster Dravarian', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Last Stand at Barash Gorge', year: '728 C.C.', victor: 'Rebels', loser: 'Tharnic Empire', keyFigure: 'Grand Inquisitor Pellaro', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Naval Battle of Sunken Crags', year: '802 C.C.', victor: 'Sea Lord Helmar Lynth', loser: 'Pirate Queen Aris', keyFigure: 'Sea Lord Helmar Lynth', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Battle of Red Wheat', year: '915 C.C.', victor: 'Islefield', loser: 'Braewood', keyFigure: 'Sir Aldarion Evensong', path: 'General Lore of Dayner/History/Historic Battles.md' },
    { name: 'Skirmish of Dwarven Watch', year: '962 C.C.', victor: 'Clanlord Fandrin Ironflare', loser: 'Mercenaries', keyFigure: 'Clanlord Fandrin Ironflare', path: 'General Lore of Dayner/History/Historic Battles.md' }
  ];

  // Historic events from Ancient History.md
  const HISTORIC_EVENTS = [
    { event: 'Fall of the Tharnic Empire', year: '730 C.C.', description: 'collapse of the empire', path: 'General Lore of Dayner/History/Ancient History.md' },
    { event: 'War of the Sundered Chains', year: '710-730 C.C.', description: 'dwarven rebellion against slavery', path: 'General Lore of Dayner/History/Ancient History.md' },
    { event: 'Famine of Gray Harvest', year: '740-760 C.C.', description: 'great famine after the war', path: 'General Lore of Dayner/History/Ancient History.md' },
    { event: 'Formation of Islefield', year: '760-800 C.C.', description: 'elven families unite southern fiefs', path: 'General Lore of Dayner/History/Ancient History.md' },
    { event: 'Formation of Braewood', year: '780-840 C.C.', description: 'Braeden family establishes domain', path: 'General Lore of Dayner/History/Ancient History.md' },
    { event: 'Formation of Kluimont', year: '800-900 C.C.', description: 'coastal lords unify maritime routes', path: 'General Lore of Dayner/History/Ancient History.md' }
  ];

  // Historic characters
  const HISTORIC_CHARACTERS = [
    { name: 'Bagi the Brass Tempest', race: 'Brass Dragon', faction: 'Kluimont (Bound)', role: 'Ancient guardian', era: '~1200 years old', path: 'Character Lore/Beasts & Creatures/Bagi the Brass Tempest.md' },
    { name: 'Balthazar the Great Wizard', race: 'Human (Transcended)', faction: 'Islefield', role: 'Ancient wizard', era: 'Over 1000 years old', path: 'Character Lore/Historic Characters/Balthazar The Great Wizard.md' },
    { name: 'General Arach Tharne', race: 'Human', faction: 'Tharnic Empire', role: 'Brutal commander', era: '650 C.C.', path: 'Character Lore/Historic Characters/General Arach Tharne.md' },
    { name: 'General Yon Garathorn', race: 'Human', faction: 'Braewood', role: 'Defensive strategist', era: '1080-1160 C.C.', path: 'Character Lore/Historic Characters/General Yon Garathorn.md' },
    { name: 'High Thane Broldir Flameforged', race: 'Dwarf', faction: 'Dwarven Coalition', role: 'Rebel leader', era: '710-730 C.C.', path: 'Character Lore/Historic Characters/High Thane Broldir Flameforged.md' },
    { name: 'Grand Inquisitor Pellaro', race: 'Human', faction: 'Tharnic Empire', role: 'Imperial zealot', era: '728 C.C.', path: 'Character Lore/Historic Characters/Grand Inquisitor Pellaro.md' },
    { name: 'Imperial Warmaster Dravarian', race: 'Human', faction: 'Tharnic Empire', role: 'Military commander', era: '720 C.C.', path: 'Character Lore/Historic Characters/Imperial Warmaster Dravarian.md' },
    { name: 'Legate Sienna Valtoris', race: 'Human', faction: 'Tharnic Empire', role: 'Fortress commander', era: '715 C.C.', path: 'Character Lore/Historic Characters/Legate Sienna Valtoris.md' },
    { name: 'Princess Araleth Oakheath', race: 'Elf', faction: 'Allied Coalition', role: 'Elven envoy', era: '690-770 C.C.', path: 'Character Lore/Historic Characters/Princess Araleth Oakheath.md' },
    { name: 'Sea Lord Helmar Lynth', race: 'Human', faction: 'Kluimont', role: 'Naval commander', era: '770-830 C.C.', path: 'Character Lore/Historic Characters/Sea Lord Helmar Lynth.md' },
    { name: 'Pirate Queen Aris Steel-Eye', race: 'Human', faction: 'Reef Confederacy', role: 'Pirate leader', era: '~802 C.C.', path: 'Character Lore/Historic Characters/Pirate Queen Aris Steel-Eye.md' }
  ];

  // Beasts and Creatures
  const BEASTS_CREATURES = [
    { name: 'Bagi the Brass Tempest', race: 'Brass Dragon', faction: 'Kluimont (Bound)', role: 'Ancient Guardian', era: '~1200 years old', path: 'Character Lore/Beasts & Creatures/Bagi the Brass Tempest.md' },
    { name: 'The Spehlina', race: 'Corrupted Elemental', faction: 'Lavalto Lake', role: 'Lake Monster', era: 'Ancient (corrupted ~40 years ago)', path: 'Character Lore/Beasts & Creatures/The Spehlina.md' }
  ];

  async function init() {
    createQuizPanel();
    const quizBtn = document.getElementById('quiz-btn');
    if (quizBtn) quizBtn.addEventListener('click', show);
  }

  async function loadLoreData() {
    if (loreData || isLoading) return loreData;
    isLoading = true;
    
    loreData = {
      characters: [],
      historicCharacters: HISTORIC_CHARACTERS,
      beastsCreatures: BEASTS_CREATURES,
      settlements: [],
      kingdoms: [],
      battles: HISTORIC_BATTLES,
      events: HISTORIC_EVENTS
    };

    // Load modern characters
    for (const file of LORE_FILES.modernCharacters.files) {
      try {
        const response = await fetch(LORE_BASE_PATH + LORE_FILES.modernCharacters.basePath + encodeURIComponent(file));
        if (response.ok) {
          const content = await response.text();
          const charData = parseCharacterFile(content, file);
          if (charData) {
            charData.path = LORE_FILES.modernCharacters.basePath + file;
            charData.era = 'Modern';
            loreData.characters.push(charData);
          }
        }
      } catch (e) { /* Skip */ }
    }

    // Load settlements
    for (const [kingdom, categories] of Object.entries(LORE_FILES.kingdoms)) {
      const basePath = `Kingdoms/${kingdom}/`;
      for (const [category, files] of Object.entries(categories)) {
        for (const file of files) {
          try {
            const response = await fetch(LORE_BASE_PATH + basePath + file.replace(/ /g, '%20'));
            if (response.ok) {
              const name = file.split('/').pop().replace('.md', '');
              const settlementData = { 
                name, 
                kingdom, 
                type: getCategoryLabel(category),
                path: basePath + file
              };
              loreData.settlements.push(settlementData);
            }
          } catch (e) { /* Skip */ }
        }
      }
    }

    // Kingdom data
    loreData.kingdoms = [
      { name: 'Braewood', ruler: 'King Tarvin Braeden IV', specialty: 'largest army', race: 'Human majority', capital: 'Braewood City', path: 'Kingdoms/Braewood/Braewood.md' },
      { name: 'Islefield', ruler: 'High King Aleron Oakheath III', specialty: 'trade and diplomacy', race: 'Elven-led', capital: 'Islefield City', path: 'Kingdoms/Islefield/Islefield.md' },
      { name: 'Kluimont', ruler: 'Archmage Orineth', specialty: 'arcane magic', race: 'Secretive', capital: 'Kluimont City', path: 'Kingdoms/Kluimont/Kluimont.md' },
      { name: 'Lavalto', ruler: 'Lord Adrian Silwynn', specialty: 'vampire-ruled', race: 'Undead/Vampire', capital: 'Darewaeton', path: 'Kingdoms/Lavalto/Lavalto.md' }
    ];

    isLoading = false;
    return loreData;
  }

  function parseCharacterFile(content, filename) {
    const name = filename.replace('.md', '');
    const data = { name, title: '', race: '', location: '', age: '' };
    
    const titleMatch = content.match(/\*\*Title\*\*\s*\|\s*([^\n|]+)/i);
    const raceMatch = content.match(/\*\*Race\*\*\s*\|\s*([^\n|]+)/i);
    const locationMatch = content.match(/\*\*Location\*\*\s*\|\s*([^\n|]+)/i);
    const ageMatch = content.match(/\*\*Age\*\*\s*\|\s*([^\n|]+)/i);
    
    if (titleMatch) data.title = titleMatch[1].trim();
    if (raceMatch) data.race = raceMatch[1].trim();
    if (locationMatch) data.location = locationMatch[1].trim().split(',')[0].trim();
    if (ageMatch) data.age = ageMatch[1].trim();
    
    return (data.title || data.race || data.location) ? data : null;
  }

  function getCategoryLabel(category) {
    const labels = { capital: 'Capital', large: 'Large City', medium: 'Medium City', towns: 'Town', villages: 'Village' };
    return labels[category] || category;
  }

  function createQuizPanel() {
    quizPanel = document.createElement('div');
    quizPanel.className = 'quiz-panel';
    quizPanel.id = 'quiz-panel';
    quizPanel.innerHTML = `
      <div class="quiz-header">
        <h2><i class="fas fa-question-circle"></i> Lore Quiz</h2>
        <button class="quiz-close" id="quiz-close" aria-label="Close quiz"><i class="fas fa-times"></i></button>
      </div>
      <div class="quiz-content">
        <div class="quiz-start" id="quiz-start">
          <div class="quiz-intro">
            <i class="fas fa-scroll quiz-icon"></i>
            <h3>Test Your Knowledge</h3>
            <p>Characters, kingdoms, battles, and history!</p>
          </div>
          <div class="quiz-difficulty">
            <label>Questions:</label>
            <select id="quiz-question-count">
              <option value="5">Quick (5)</option>
              <option value="10" selected>Standard (10)</option>
              <option value="15">Extended (15)</option>
            </select>
          </div>
          <button class="quiz-start-btn" id="quiz-start-btn"><i class="fas fa-play"></i> Begin Quiz</button>
        </div>
        <div class="quiz-loading" id="quiz-loading" style="display: none;"><i class="fas fa-spinner fa-spin"></i><p>Loading lore...</p></div>
        <div class="quiz-question" id="quiz-question" style="display: none;">
          <div class="quiz-progress"><div class="quiz-progress-bar" id="quiz-progress-bar"></div></div>
          <div class="quiz-score-display"><span id="quiz-current-score">0</span> / <span id="quiz-question-num">1</span></div>
          <div class="quiz-category" id="quiz-category">Characters</div>
          <div class="quiz-question-text" id="quiz-question-text"></div>
          <div class="quiz-options" id="quiz-options"></div>
          <div class="quiz-feedback" id="quiz-feedback"></div>
          <button class="quiz-next-btn" id="quiz-next-btn" style="display: none;"><i class="fas fa-arrow-right"></i> Next</button>
        </div>
        <div class="quiz-results" id="quiz-results" style="display: none;">
          <div class="quiz-results-icon" id="quiz-results-icon"><i class="fas fa-trophy"></i></div>
          <h3 id="quiz-results-title">Quiz Complete!</h3>
          <div class="quiz-final-score"><span id="quiz-final-score">0</span> / <span id="quiz-total-questions">10</span></div>
          <div class="quiz-results-actions">
            <button class="quiz-retry-btn" id="quiz-retry-btn"><i class="fas fa-redo"></i> Try Again</button>
            <button class="quiz-close-btn" id="quiz-close-results"><i class="fas fa-times"></i> Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(quizPanel);

    document.getElementById('quiz-close').addEventListener('click', hide);
    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
    document.getElementById('quiz-next-btn').addEventListener('click', nextQuestion);
    document.getElementById('quiz-retry-btn').addEventListener('click', () => {
      document.getElementById('quiz-results').style.display = 'none';
      document.getElementById('quiz-start').style.display = 'block';
    });
    document.getElementById('quiz-close-results').addEventListener('click', hide);
  }

  function show() {
    if (!quizPanel) createQuizPanel();
    quizPanel.classList.add('active');
    resetQuiz();
  }

  function hide() {
    if (quizPanel) quizPanel.classList.remove('active');
  }

  function resetQuiz() {
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    quizActive = false;
    document.getElementById('quiz-start').style.display = 'block';
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-loading').style.display = 'none';
  }

  async function startQuiz() {
    totalQuestions = parseInt(document.getElementById('quiz-question-count').value);
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-loading').style.display = 'block';
    
    await loadLoreData();
    
    document.getElementById('quiz-loading').style.display = 'none';
    currentQuestions = generateQuestions(totalQuestions);
    currentQuestionIndex = 0;
    score = 0;
    quizActive = true;
    document.getElementById('quiz-question').style.display = 'block';
    document.getElementById('quiz-total-questions').textContent = totalQuestions;
    showQuestion();
  }

  function generateQuestions(count) {
    const questions = [];
    const generators = [
      generateCharacterRaceQuestion,
      generateCharacterTitleQuestion,
      generateKingdomRulerQuestion,
      generateSettlementKingdomQuestion,
      generateKingdomSpecialtyQuestion,
      generateSettlementTypeQuestion,
      generateBattleVictorQuestion,
      generateBattleYearQuestion,
      generateBattleKeyFigureQuestion,
      generateKingdomCapitalQuestion,
      generateHistoricEventQuestion,
      generateHistoricCharacterFactionQuestion,
      generateHistoricCharacterRoleQuestion
    ];
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let question = null;
      while (!question && attempts < 20) {
        const generator = generators[Math.floor(Math.random() * generators.length)];
        question = generator();
        attempts++;
      }
      if (question) questions.push(question);
    }
    return questions;
  }

  // Modern character questions
  function generateCharacterRaceQuestion() {
    const chars = loreData.characters.filter(c => c.race);
    if (chars.length < 4) return null;
    const char = randomItem(chars);
    const races = ['Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling', 'Tiefling', 'Vampire'];
    const wrongAnswers = races.filter(r => r !== char.race).sort(() => Math.random() - 0.5).slice(0, 3);
    return { question: `What race is ${char.name}?`, correct: char.race, options: shuffleArray([char.race, ...wrongAnswers]), category: 'Characters', sourcePath: char.path, sourceName: char.name };
  }

  function generateCharacterTitleQuestion() {
    const chars = loreData.characters.filter(c => c.title);
    if (chars.length < 4) return null;
    const char = randomItem(chars);
    const wrongAnswers = chars.filter(c => c.name !== char.name).map(c => c.title).filter(Boolean).sort(() => Math.random() - 0.5).slice(0, 3);
    if (wrongAnswers.length < 3) return null;
    return { question: `What is ${char.name}'s title?`, correct: char.title, options: shuffleArray([char.title, ...wrongAnswers]), category: 'Characters', sourcePath: char.path, sourceName: char.name };
  }

  // Kingdom questions
  function generateKingdomRulerQuestion() {
    const kingdom = randomItem(loreData.kingdoms);
    const wrongAnswers = loreData.kingdoms.filter(k => k.name !== kingdom.name).map(k => k.ruler);
    return { question: `Who rules ${kingdom.name}?`, correct: kingdom.ruler, options: shuffleArray([kingdom.ruler, ...wrongAnswers]), category: 'Kingdoms', sourcePath: kingdom.path, sourceName: kingdom.name };
  }

  function generateKingdomSpecialtyQuestion() {
    const kingdom = randomItem(loreData.kingdoms);
    const wrongAnswers = loreData.kingdoms.filter(k => k.name !== kingdom.name).map(k => k.specialty);
    return { question: `What is ${kingdom.name} known for?`, correct: kingdom.specialty, options: shuffleArray([kingdom.specialty, ...wrongAnswers]), category: 'Kingdoms', sourcePath: kingdom.path, sourceName: kingdom.name };
  }

  function generateKingdomCapitalQuestion() {
    const kingdom = randomItem(loreData.kingdoms);
    const wrongAnswers = loreData.kingdoms.filter(k => k.name !== kingdom.name).map(k => k.capital);
    return { question: `What is the capital of ${kingdom.name}?`, correct: kingdom.capital, options: shuffleArray([kingdom.capital, ...wrongAnswers]), category: 'Kingdoms', sourcePath: kingdom.path, sourceName: kingdom.name };
  }

  // Settlement questions
  function generateSettlementKingdomQuestion() {
    if (loreData.settlements.length < 4) return null;
    const settlement = randomItem(loreData.settlements);
    const kingdoms = loreData.kingdoms.map(k => k.name);
    const wrongAnswers = kingdoms.filter(k => k !== settlement.kingdom);
    return { question: `Which kingdom is ${settlement.name} in?`, correct: settlement.kingdom, options: shuffleArray([settlement.kingdom, ...wrongAnswers]), category: 'Settlements', sourcePath: settlement.path, sourceName: settlement.name };
  }

  function generateSettlementTypeQuestion() {
    if (loreData.settlements.length < 4) return null;
    const settlement = randomItem(loreData.settlements);
    const types = ['Capital', 'Large City', 'Medium City', 'Town', 'Village'];
    const wrongAnswers = types.filter(t => t !== settlement.type).slice(0, 3);
    return { question: `What type of settlement is ${settlement.name}?`, correct: settlement.type, options: shuffleArray([settlement.type, ...wrongAnswers]), category: 'Settlements', sourcePath: settlement.path, sourceName: settlement.name };
  }

  // Battle questions
  function generateBattleVictorQuestion() {
    const battle = randomItem(loreData.battles);
    const allVictors = loreData.battles.map(b => b.victor);
    let wrongAnswers = [...new Set(allVictors.filter(v => v !== battle.victor))];
    if (wrongAnswers.length < 3) wrongAnswers.push('Kluimont Forces', 'Orcish Clans', 'Elven Alliance');
    return { question: `Who won the ${battle.name}?`, correct: battle.victor, options: shuffleArray([battle.victor, ...wrongAnswers.slice(0, 3)]), category: 'History', sourcePath: battle.path, sourceName: 'Historic Battles' };
  }

  function generateBattleYearQuestion() {
    const battle = randomItem(loreData.battles);
    const allYears = loreData.battles.map(b => b.year);
    const wrongAnswers = [...new Set(allYears.filter(y => y !== battle.year))].slice(0, 3);
    return { question: `When did the ${battle.name} occur?`, correct: battle.year, options: shuffleArray([battle.year, ...wrongAnswers]), category: 'History', sourcePath: battle.path, sourceName: 'Historic Battles' };
  }

  function generateBattleKeyFigureQuestion() {
    const battle = randomItem(loreData.battles);
    const allFigures = loreData.battles.map(b => b.keyFigure);
    const wrongAnswers = [...new Set(allFigures.filter(f => f !== battle.keyFigure))].slice(0, 3);
    return { question: `Who was a key figure in the ${battle.name}?`, correct: battle.keyFigure, options: shuffleArray([battle.keyFigure, ...wrongAnswers]), category: 'History', sourcePath: battle.path, sourceName: 'Historic Battles' };
  }

  // Historic event questions
  function generateHistoricEventQuestion() {
    const event = randomItem(loreData.events);
    const allYears = loreData.events.map(e => e.year);
    const wrongAnswers = [...new Set(allYears.filter(y => y !== event.year))].slice(0, 3);
    return { question: `When did the ${event.event} happen?`, correct: event.year, options: shuffleArray([event.year, ...wrongAnswers]), category: 'History', sourcePath: event.path, sourceName: 'Ancient History' };
  }

  // Historic character questions
  function generateHistoricCharacterFactionQuestion() {
    const char = randomItem(loreData.historicCharacters);
    const allFactions = [...new Set(loreData.historicCharacters.map(c => c.faction))];
    const wrongAnswers = allFactions.filter(f => f !== char.faction).slice(0, 3);
    if (wrongAnswers.length < 3) wrongAnswers.push('Braewood', 'Islefield', 'Neutral');
    return { question: `Which faction did ${char.name} belong to?`, correct: char.faction, options: shuffleArray([char.faction, ...wrongAnswers.slice(0, 3)]), category: 'Historic Characters', sourcePath: char.path, sourceName: char.name };
  }

  function generateHistoricCharacterRoleQuestion() {
    const char = randomItem(loreData.historicCharacters);
    const allRoles = [...new Set(loreData.historicCharacters.map(c => c.role))];
    const wrongAnswers = allRoles.filter(r => r !== char.role).slice(0, 3);
    if (wrongAnswers.length < 3) wrongAnswers.push('Merchant', 'Scholar', 'Diplomat');
    return { question: `What was ${char.name}'s role?`, correct: char.role, options: shuffleArray([char.role, ...wrongAnswers.slice(0, 3)]), category: 'Historic Characters', sourcePath: char.path, sourceName: char.name };
  }

  function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('quiz-progress-bar').style.width = `${(currentQuestionIndex / totalQuestions) * 100}%`;
    document.getElementById('quiz-question-num').textContent = currentQuestionIndex + 1;
    document.getElementById('quiz-current-score').textContent = score;
    document.getElementById('quiz-category').textContent = question.category;
    document.getElementById('quiz-question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = question.options.map((option, index) => `
      <button class="quiz-option" data-answer="${escapeHtml(option)}">
        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text">${escapeHtml(option)}</span>
      </button>
    `).join('');

    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => btn.addEventListener('click', () => selectAnswer(btn)));
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-next-btn').style.display = 'none';
  }

  function selectAnswer(button) {
    if (!quizActive) return;
    const selectedAnswer = button.dataset.answer;
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === question.correct) btn.classList.add('correct');
      else if (btn === button && !isCorrect) btn.classList.add('incorrect');
    });

    if (isCorrect) {
      score++;
      document.getElementById('quiz-current-score').textContent = score;
    }

    const feedback = document.getElementById('quiz-feedback');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    const sourceLink = `<a href="#" class="quiz-source-link" data-path="${escapeHtml(question.sourcePath)}">${escapeHtml(question.sourceName)}</a>`;
    feedback.innerHTML = isCorrect 
      ? `<i class="fas fa-check-circle"></i> Correct! See: ${sourceLink}`
      : `<i class="fas fa-times-circle"></i> ${escapeHtml(question.correct)} — See: ${sourceLink}`;
    feedback.style.display = 'block';

    const sourceLink2 = feedback.querySelector('.quiz-source-link');
    if (sourceLink2) {
      sourceLink2.addEventListener('click', (e) => {
        e.preventDefault();
        const path = e.target.dataset.path;
        hide();
        setTimeout(() => { if (typeof window.loadContent === 'function') window.loadContent(path); }, 100);
      });
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.innerHTML = currentQuestionIndex < totalQuestions - 1 ? '<i class="fas fa-arrow-right"></i> Next' : '<i class="fas fa-flag-checkered"></i> Results';
    nextBtn.style.display = 'block';
  }

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= totalQuestions) showResults();
    else showQuestion();
  }

  function showResults() {
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    document.getElementById('quiz-final-score').textContent = score;
    document.getElementById('quiz-total-questions').textContent = totalQuestions;
    
    const percentage = (score / totalQuestions) * 100;
    const resultsIcon = document.getElementById('quiz-results-icon');
    const resultsTitle = document.getElementById('quiz-results-title');
    
    if (percentage === 100) { resultsIcon.innerHTML = '<i class="fas fa-crown"></i>'; resultsTitle.textContent = 'Perfect!'; }
    else if (percentage >= 80) { resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>'; resultsTitle.textContent = 'Excellent!'; }
    else if (percentage >= 60) { resultsIcon.innerHTML = '<i class="fas fa-medal"></i>'; resultsTitle.textContent = 'Good Job!'; }
    else { resultsIcon.innerHTML = '<i class="fas fa-book"></i>'; resultsTitle.textContent = 'Keep Learning!'; }
    
    quizActive = false;
  }

  function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffleArray(arr) { const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } return s; }
  function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  return { init, show, hide };
})();

document.addEventListener('DOMContentLoaded', () => QuizModule.init());
