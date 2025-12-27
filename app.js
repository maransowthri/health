// HealthPath - Main Application Logic

// State Management
const state = {
    currentStep: 0,
    answers: {},
    healthPlan: null
};

// LocalStorage Keys
const STORAGE_KEYS = {
    ANSWERS: 'healthpath_answers',
    HEALTH_PLAN: 'healthpath_plan'
};

// LocalStorage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(state.answers));
        if (state.healthPlan) {
            localStorage.setItem(STORAGE_KEYS.HEALTH_PLAN, JSON.stringify(state.healthPlan));
        }
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
        const savedPlan = localStorage.getItem(STORAGE_KEYS.HEALTH_PLAN);
        
        if (savedAnswers) {
            state.answers = JSON.parse(savedAnswers);
        }
        if (savedPlan) {
            state.healthPlan = JSON.parse(savedPlan);
        }
        return Object.keys(state.answers).length > 0;
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return false;
    }
}

function clearLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEYS.ANSWERS);
        localStorage.removeItem(STORAGE_KEYS.HEALTH_PLAN);
        state.answers = {};
        state.healthPlan = null;
    } catch (e) {
        console.warn('Failed to clear localStorage:', e);
    }
}

// Questions Configuration
const questions = [
    {
        id: 'basicInfo',
        title: 'Tell us about yourself',
        subtitle: 'This helps us personalize your plan',
        type: 'multiInput',
        fields: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age', unit: 'years', min: 13, max: 100 },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
            { id: 'height', label: 'Height', type: 'number', placeholder: 'Enter height', unit: 'cm', min: 100, max: 250 },
            { id: 'weight', label: 'Current Weight', type: 'number', placeholder: 'Enter weight', unit: 'kg', min: 30, max: 300 }
        ]
    },
    {
        id: 'goal',
        title: 'What\'s your primary health goal?',
        subtitle: 'Select the goal that matters most to you right now',
        type: 'singleChoice',
        options: [
            { id: 'loseWeight', label: 'Lose Weight', description: 'Burn fat and achieve a leaner body', icon: 'trending-down' },
            { id: 'gainWeight', label: 'Gain Weight', description: 'Build muscle mass and bulk up', icon: 'trending-up' },
            { id: 'buildMuscle', label: 'Build Muscle', description: 'Increase strength and muscle definition', icon: 'dumbbell' },
            { id: 'improveSleep', label: 'Improve Sleep', description: 'Get better quality rest', icon: 'moon' },
            { id: 'increaseEnergy', label: 'Increase Energy', description: 'Feel more energized throughout the day', icon: 'zap' },
            { id: 'overallHealth', label: 'Overall Health', description: 'Maintain and improve general wellness', icon: 'heart' }
        ]
    },
    {
        id: 'activityLevel',
        title: 'What\'s your current activity level?',
        subtitle: 'Be honest - this helps us create a realistic plan',
        type: 'singleChoice',
        options: [
            { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise, desk job', icon: 'armchair' },
            { id: 'lightlyActive', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', icon: 'footprints' },
            { id: 'moderatelyActive', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', icon: 'bike' },
            { id: 'veryActive', label: 'Very Active', description: 'Hard exercise 6-7 days/week', icon: 'flame' },
            { id: 'athlete', label: 'Athlete', description: 'Intense training, physical job', icon: 'trophy' }
        ]
    },
    {
        id: 'sleepInfo',
        title: 'Tell us about your sleep',
        subtitle: 'Sleep is crucial for health and recovery',
        type: 'multiInput',
        fields: [
            { id: 'sleepHours', label: 'Average sleep per night', type: 'range', min: 3, max: 12, step: 0.5, unit: 'hours', default: 7 },
            { id: 'sleepQuality', label: 'Sleep quality', type: 'select', options: ['Poor - Wake up tired', 'Fair - Sometimes restful', 'Good - Usually restful', 'Excellent - Always refreshed'] },
            { id: 'sleepIssues', label: 'Sleep challenges (if any)', type: 'select', options: ['None', 'Trouble falling asleep', 'Waking up at night', 'Waking up too early', 'Snoring/Sleep apnea'] }
        ]
    },
    {
        id: 'dietInfo',
        title: 'What are your dietary preferences?',
        subtitle: 'We\'ll tailor meal recommendations to your lifestyle',
        type: 'multiChoice',
        options: [
            { id: 'noRestrictions', label: 'No Restrictions', description: 'I eat everything', icon: 'utensils' },
            { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish', icon: 'leaf' },
            { id: 'vegan', label: 'Vegan', description: 'No animal products', icon: 'carrot' },
            { id: 'glutenFree', label: 'Gluten-Free', description: 'Avoid gluten', icon: 'wheat-off' },
            { id: 'dairyFree', label: 'Dairy-Free', description: 'No dairy products', icon: 'milk-off' },
            { id: 'lowCarb', label: 'Low Carb', description: 'Limit carbohydrates', icon: 'cookie' },
            { id: 'highProtein', label: 'High Protein', description: 'Focus on protein intake', icon: 'beef' }
        ]
    },
    {
        id: 'lifestyle',
        title: 'A few more details about your lifestyle',
        subtitle: 'This helps us make practical recommendations',
        type: 'multiInput',
        fields: [
            { id: 'workSchedule', label: 'Work schedule', type: 'select', options: ['Regular 9-5', 'Shift work', 'Remote/Flexible', 'Freelance/Variable', 'Not working'] },
            { id: 'cookingTime', label: 'Time available for cooking per day', type: 'select', options: ['Less than 30 minutes', '30-60 minutes', '1-2 hours', 'More than 2 hours'] },
            { id: 'budget', label: 'Monthly budget for health/fitness', type: 'select', options: ['Minimal ($0-50)', 'Moderate ($50-150)', 'Comfortable ($150-300)', 'Flexible ($300+)'] },
            { id: 'injuries', label: 'Any injuries or health conditions?', type: 'text', placeholder: 'e.g., knee pain, back issues, or "None"' }
        ]
    }
];

// DOM Elements
const elements = {
    welcomeScreen: document.getElementById('welcomeScreen'),
    questionnaireScreen: document.getElementById('questionnaireScreen'),
    loadingScreen: document.getElementById('loadingScreen'),
    resultsScreen: document.getElementById('resultsScreen'),
    errorScreen: document.getElementById('errorScreen'),
    startBtn: document.getElementById('startBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    retryBtn: document.getElementById('retryBtn'),
    restartBtn: document.getElementById('restartBtn'),
    printBtn: document.getElementById('printBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    questionContainer: document.getElementById('questionContainer'),
    tabContent: document.getElementById('tabContent'),
    loadingMessage: document.getElementById('loadingMessage'),
    errorMessage: document.getElementById('errorMessage')
};

// Initialize Application
function init() {
    lucide.createIcons();
    bindEvents();
    
    // Load saved data and show appropriate screen
    const hasSavedData = loadFromLocalStorage();
    if (hasSavedData) {
        showResumePrompt();
    }
}

// Show resume prompt if saved data exists
function showResumePrompt() {
    const resumeModal = document.createElement('div');
    resumeModal.id = 'resumeModal';
    resumeModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
    resumeModal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i data-lucide="history" class="w-7 h-7 text-emerald-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Welcome Back!</h3>
            <p class="text-gray-600 text-center mb-6">We found your previous progress. Would you like to continue where you left off?</p>
            <div class="flex gap-3">
                <button id="startFreshBtn" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Start Fresh
                </button>
                <button id="resumeBtn" class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:shadow-lg transition-all">
                    Continue
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(resumeModal);
    lucide.createIcons();
    
    document.getElementById('startFreshBtn').addEventListener('click', () => {
        clearLocalStorage();
        resumeModal.remove();
    });
    
    document.getElementById('resumeBtn').addEventListener('click', () => {
        resumeModal.remove();
        if (state.healthPlan) {
            // If we have a saved plan, show results directly
            showScreen('resultsScreen');
            renderTabContent('overview');
        } else {
            // Otherwise start questionnaire with saved answers
            startQuestionnaire();
        }
    });
}

// Event Bindings
function bindEvents() {
    elements.startBtn.addEventListener('click', startQuestionnaire);
    elements.prevBtn.addEventListener('click', previousQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.retryBtn.addEventListener('click', () => generateHealthPlan());
    elements.restartBtn.addEventListener('click', restartApp);
    elements.printBtn.addEventListener('click', () => window.print());
    elements.downloadBtn.addEventListener('click', downloadPDF);
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderTabContent(e.currentTarget.dataset.tab);
        });
    });
}

// Screen Management
function showScreen(screenId) {
    const screens = ['welcomeScreen', 'questionnaireScreen', 'loadingScreen', 'resultsScreen', 'errorScreen'];
    screens.forEach(id => {
        elements[id].classList.add('hidden');
    });
    elements[screenId].classList.remove('hidden');
    
    // Show restart button on appropriate screens
    if (['resultsScreen', 'errorScreen'].includes(screenId)) {
        elements.restartBtn.classList.remove('hidden');
    } else {
        elements.restartBtn.classList.add('hidden');
    }
}

// Questionnaire Logic
function startQuestionnaire() {
    state.currentStep = 0;
    showScreen('questionnaireScreen');
    renderQuestion();
}

function renderQuestion() {
    const question = questions[state.currentStep];
    updateProgress();
    
    let html = `
        <h2 class="text-2xl font-bold text-gray-900 mb-2">${question.title}</h2>
        <p class="text-gray-600 mb-6">${question.subtitle}</p>
    `;
    
    switch (question.type) {
        case 'multiInput':
            html += renderMultiInput(question);
            break;
        case 'singleChoice':
            html += renderSingleChoice(question);
            break;
        case 'multiChoice':
            html += renderMultiChoice(question);
            break;
    }
    
    elements.questionContainer.innerHTML = html;
    lucide.createIcons();
    bindQuestionEvents(question);
    
    // Restore previous answers
    restoreAnswers(question);
    
    // Update navigation buttons
    elements.prevBtn.disabled = state.currentStep === 0;
    elements.nextBtn.textContent = state.currentStep === questions.length - 1 ? 'Continue' : 'Next';
    
    // Re-render icons in next button
    elements.nextBtn.innerHTML = state.currentStep === questions.length - 1 
        ? 'Continue <i data-lucide="arrow-right" class="w-4 h-4"></i>'
        : 'Next <i data-lucide="arrow-right" class="w-4 h-4"></i>';
    lucide.createIcons();
}

function renderMultiInput(question) {
    let html = '<div class="space-y-4">';
    
    question.fields.forEach(field => {
        html += `<div class="field-group">`;
        html += `<label class="block text-sm font-medium text-gray-700 mb-2">${field.label}</label>`;
        
        if (field.type === 'number') {
            html += `
                <div class="flex items-center gap-3">
                    <input type="number" id="${field.id}" class="custom-input flex-1" 
                           placeholder="${field.placeholder}" min="${field.min}" max="${field.max}">
                    <span class="text-gray-500 font-medium">${field.unit}</span>
                </div>
            `;
        } else if (field.type === 'select') {
            html += `<select id="${field.id}" class="custom-input">`;
            html += `<option value="">Select an option</option>`;
            field.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += `</select>`;
        } else if (field.type === 'range') {
            const defaultVal = field.default || field.min;
            html += `
                <div class="range-container">
                    <input type="range" id="${field.id}" class="custom-range" 
                           min="${field.min}" max="${field.max}" step="${field.step}" value="${defaultVal}">
                    <div class="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${field.min} ${field.unit}</span>
                        <span id="${field.id}Value" class="font-semibold text-emerald-600">${defaultVal} ${field.unit}</span>
                        <span>${field.max} ${field.unit}</span>
                    </div>
                </div>
            `;
        } else if (field.type === 'text') {
            html += `
                <input type="text" id="${field.id}" class="custom-input" placeholder="${field.placeholder}">
            `;
        }
        
        html += `</div>`;
    });
    
    html += '</div>';
    return html;
}

function renderSingleChoice(question) {
    let html = '<div class="grid gap-3">';
    
    question.options.forEach(option => {
        html += `
            <div class="option-card" data-value="${option.id}">
                <div class="radio-circle"></div>
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i data-lucide="${option.icon}" class="w-5 h-5 text-emerald-600"></i>
                </div>
                <div class="flex-1">
                    <div class="font-semibold text-gray-800">${option.label}</div>
                    <div class="text-sm text-gray-500">${option.description}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderMultiChoice(question) {
    let html = '<div class="grid gap-3 md:grid-cols-2">';
    
    question.options.forEach(option => {
        html += `
            <div class="checkbox-card" data-value="${option.id}">
                <div class="checkbox-box">
                    <i data-lucide="check" class="w-4 h-4 text-white hidden"></i>
                </div>
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i data-lucide="${option.icon}" class="w-5 h-5 text-emerald-600"></i>
                </div>
                <div class="flex-1">
                    <div class="font-semibold text-gray-800">${option.label}</div>
                    <div class="text-sm text-gray-500">${option.description}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function bindQuestionEvents(question) {
    if (question.type === 'singleChoice') {
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.answers[question.id] = card.dataset.value;
                saveToLocalStorage();
            });
        });
    } else if (question.type === 'multiChoice') {
        document.querySelectorAll('.checkbox-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                const checkIcon = card.querySelector('.checkbox-box svg') || card.querySelector('.checkbox-box i');
                if (checkIcon) {
                    checkIcon.classList.toggle('hidden');
                }
                
                // Update answers
                const selected = Array.from(document.querySelectorAll('.checkbox-card.selected'))
                    .map(c => c.dataset.value);
                state.answers[question.id] = selected;
                saveToLocalStorage();
            });
        });
    } else if (question.type === 'multiInput') {
        question.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('change', () => {
                    if (!state.answers[question.id]) {
                        state.answers[question.id] = {};
                    }
                    state.answers[question.id][field.id] = input.value;
                    saveToLocalStorage();
                });
                
                // Handle range input display
                if (field.type === 'range') {
                    input.addEventListener('input', () => {
                        document.getElementById(`${field.id}Value`).textContent = `${input.value} ${field.unit}`;
                        if (!state.answers[question.id]) {
                            state.answers[question.id] = {};
                        }
                        state.answers[question.id][field.id] = input.value;
                        saveToLocalStorage();
                    });
                }
            }
        });
    }
}

function restoreAnswers(question) {
    const answer = state.answers[question.id];
    if (!answer) return;
    
    if (question.type === 'singleChoice') {
        const card = document.querySelector(`.option-card[data-value="${answer}"]`);
        if (card) card.classList.add('selected');
    } else if (question.type === 'multiChoice') {
        answer.forEach(val => {
            const card = document.querySelector(`.checkbox-card[data-value="${val}"]`);
            if (card) {
                card.classList.add('selected');
                const checkIcon = card.querySelector('.checkbox-box svg') || card.querySelector('.checkbox-box i');
                if (checkIcon) {
                    checkIcon.classList.remove('hidden');
                }
            }
        });
    } else if (question.type === 'multiInput') {
        question.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && answer[field.id]) {
                input.value = answer[field.id];
                if (field.type === 'range') {
                    document.getElementById(`${field.id}Value`).textContent = `${answer[field.id]} ${field.unit}`;
                }
            }
        });
    }
}

function updateProgress() {
    const progress = ((state.currentStep + 1) / questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressText.textContent = `Step ${state.currentStep + 1} of ${questions.length}`;
}

function validateCurrentQuestion() {
    const question = questions[state.currentStep];
    
    if (question.type === 'singleChoice') {
        return !!state.answers[question.id];
    } else if (question.type === 'multiChoice') {
        return state.answers[question.id] && state.answers[question.id].length > 0;
    } else if (question.type === 'multiInput') {
        const answers = state.answers[question.id] || {};
        return question.fields.every(field => {
            if (field.type === 'range') return true; // Range always has a value
            return !!answers[field.id];
        });
    }
    return false;
}

function previousQuestion() {
    if (state.currentStep > 0) {
        state.currentStep--;
        renderQuestion();
    }
}

function nextQuestion() {
    // Save current answers for multiInput
    const question = questions[state.currentStep];
    if (question.type === 'multiInput') {
        if (!state.answers[question.id]) {
            state.answers[question.id] = {};
        }
        question.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                state.answers[question.id][field.id] = input.value;
            }
        });
        saveToLocalStorage();
    }
    
    if (!validateCurrentQuestion()) {
        alert('Please complete all fields before continuing.');
        return;
    }
    
    if (state.currentStep < questions.length - 1) {
        state.currentStep++;
        renderQuestion();
    } else {
        // Generate health plan directly
        generateHealthPlan();
    }
}

// OpenAI Integration via Netlify Function
async function generateHealthPlan() {
    showScreen('loadingScreen');
    
    const loadingMessages = [
        'Analyzing your profile...',
        'Calculating nutritional needs...',
        'Designing workout routines...',
        'Creating meal plans...',
        'Optimizing sleep schedule...',
        'Selecting home equipment...',
        'Finalizing your personalized plan...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        elements.loadingMessage.textContent = loadingMessages[messageIndex];
    }, 2000);
    
    try {
        const prompt = buildPrompt();
        const response = await callNetlifyFunction(prompt);
        
        clearInterval(messageInterval);
        
        state.healthPlan = parseResponse(response);
        saveToLocalStorage();
        showScreen('resultsScreen');
        renderTabContent('overview');
        
    } catch (error) {
        clearInterval(messageInterval);
        console.error('Error:', error);
        elements.errorMessage.textContent = error.message || 'Unable to generate your health plan. Please try again.';
        showScreen('errorScreen');
    }
}

function buildPrompt() {
    const { basicInfo, goal, activityLevel, sleepInfo, dietInfo, lifestyle } = state.answers;
    
    const goalLabels = {
        loseWeight: 'lose weight',
        gainWeight: 'gain weight and build mass',
        buildMuscle: 'build muscle and strength',
        improveSleep: 'improve sleep quality',
        increaseEnergy: 'increase daily energy levels',
        overallHealth: 'improve overall health and wellness'
    };
    
    const activityLabels = {
        sedentary: 'sedentary (little to no exercise)',
        lightlyActive: 'lightly active (1-3 days/week)',
        moderatelyActive: 'moderately active (3-5 days/week)',
        veryActive: 'very active (6-7 days/week)',
        athlete: 'athlete level (intense daily training)'
    };
    
    return `You are a professional health and fitness coach. Create a comprehensive, personalized weekly health plan for a person with the following profile:

**Personal Information:**
- Age: ${basicInfo.age} years
- Gender: ${basicInfo.gender}
- Height: ${basicInfo.height} cm
- Current Weight: ${basicInfo.weight} kg
- Primary Goal: ${goalLabels[goal] || goal}
- Activity Level: ${activityLabels[activityLevel] || activityLevel}

**Sleep Profile:**
- Average sleep: ${sleepInfo.sleepHours} hours/night
- Sleep quality: ${sleepInfo.sleepQuality}
- Sleep issues: ${sleepInfo.sleepIssues}

**Dietary Preferences:**
${dietInfo.join(', ') || 'No specific restrictions'}

**Lifestyle:**
- Work schedule: ${lifestyle.workSchedule}
- Time for cooking: ${lifestyle.cookingTime}
- Budget: ${lifestyle.budget}
- Health conditions/injuries: ${lifestyle.injuries || 'None'}

**Important Context:**
- All activities will be done AT HOME
- Equipment recommendations should be for home use
- Meals should be easy to prepare at home

Please provide a detailed response in the following JSON format:

{
  "overview": {
    "summary": "Brief personalized summary of the plan",
    "bmi": "calculated BMI",
    "bmiCategory": "underweight/normal/overweight/obese",
    "dailyCalories": "recommended daily calorie intake",
    "proteinGoal": "daily protein goal in grams",
    "waterIntake": "daily water intake in liters",
    "keyFocus": ["list of 3-4 key focus areas"]
  },
  "workout": {
    "weeklyPlan": [
      {
        "day": "Monday",
        "focus": "e.g., Upper Body",
        "duration": "e.g., 30-45 mins",
        "exercises": [
          {"name": "Exercise name", "sets": "3", "reps": "12", "notes": "Any form tips"}
        ],
        "restDay": false
      }
    ],
    "warmup": "General warmup routine",
    "cooldown": "General cooldown routine",
    "progressionTips": ["Tips for progressing over time"]
  },
  "diet": {
    "guidelines": ["Key dietary guidelines"],
    "mealPlan": {
      "breakfast": [{"name": "Meal name", "description": "Brief description", "calories": "approx calories", "time": "suggested time"}],
      "lunch": [{"name": "Meal name", "description": "Brief description", "calories": "approx calories", "time": "suggested time"}],
      "dinner": [{"name": "Meal name", "description": "Brief description", "calories": "approx calories", "time": "suggested time"}],
      "snacks": [{"name": "Snack name", "description": "Brief description", "calories": "approx calories"}]
    },
    "hydration": "Hydration tips",
    "supplements": ["Any recommended supplements with reasons"]
  },
  "sleep": {
    "targetHours": "recommended sleep hours",
    "bedtime": "suggested bedtime",
    "wakeTime": "suggested wake time",
    "routine": {
      "evening": ["Evening routine steps"],
      "morning": ["Morning routine steps"]
    },
    "tips": ["Sleep improvement tips"],
    "avoidBefore": ["Things to avoid before bed"]
  },
  "equipment": [
    {
      "name": "Equipment name",
      "priority": "essential/recommended/optional",
      "priceRange": "approximate price range",
      "reason": "Why this is recommended"
    }
  ],
  "weeklySchedule": [
    {
      "day": "Monday",
      "schedule": [
        {"time": "6:00 AM", "activity": "Wake up + morning routine"},
        {"time": "6:30 AM", "activity": "Workout"},
        {"time": "8:00 AM", "activity": "Breakfast"}
      ]
    }
  ]
}

Make sure all recommendations are:
1. Safe and appropriate for home exercise
2. Realistic given their time and budget constraints
3. Progressive (can be built upon over time)
4. Aligned with their specific goal
5. Account for any mentioned injuries/conditions

Respond ONLY with the JSON object, no additional text.`;
}

async function callNetlifyFunction(prompt) {
    const response = await fetch('/.netlify/functions/generate-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });
    
    // Check if response is JSON (function exists) or HTML (404 page)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server not configured. Please run with "netlify dev" locally or deploy to Netlify.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Failed to generate health plan');
    }
    
    return data.content;
}

function parseResponse(response) {
    try {
        // Remove markdown code blocks if present
        let cleaned = response.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.slice(0, -3);
        }
        
        return JSON.parse(cleaned.trim());
    } catch (error) {
        console.error('Parse error:', error);
        throw new Error('Failed to parse the health plan. Please try again.');
    }
}

// Results Rendering
function renderTabContent(tab) {
    const plan = state.healthPlan;
    if (!plan) return;
    
    let html = '';
    
    switch (tab) {
        case 'overview':
            html = renderOverview(plan.overview);
            break;
        case 'workout':
            html = renderWorkout(plan.workout);
            break;
        case 'diet':
            html = renderDiet(plan.diet);
            break;
        case 'sleep':
            html = renderSleep(plan.sleep);
            break;
        case 'equipment':
            html = renderEquipment(plan.equipment);
            break;
        case 'weekly':
            html = renderWeeklySchedule(plan.weeklySchedule);
            break;
    }
    
    elements.tabContent.innerHTML = html;
    lucide.createIcons();
}

function renderOverview(overview) {
    return `
        <div class="text-center mb-8">
            <p class="text-lg text-gray-700">${overview.summary}</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4 mb-8">
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 text-center border border-emerald-100">
                <div class="text-3xl font-bold text-emerald-600">${overview.bmi}</div>
                <div class="text-sm text-gray-600 mt-1">BMI (${overview.bmiCategory})</div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border border-blue-100">
                <div class="text-3xl font-bold text-blue-600">${overview.dailyCalories}</div>
                <div class="text-sm text-gray-600 mt-1">Daily Calories</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-100">
                <div class="text-3xl font-bold text-purple-600">${overview.proteinGoal}g</div>
                <div class="text-sm text-gray-600 mt-1">Daily Protein</div>
            </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
            <div class="result-card">
                <h4><i data-lucide="droplets" class="w-5 h-5"></i> Daily Water Intake</h4>
                <p class="text-2xl font-bold text-emerald-600">${overview.waterIntake}</p>
            </div>
            <div class="result-card">
                <h4><i data-lucide="target" class="w-5 h-5"></i> Key Focus Areas</h4>
                <ul>
                    ${overview.keyFocus.map(focus => `<li>${focus}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderWorkout(workout) {
    let html = `
        <div class="result-card mb-6">
            <h4><i data-lucide="flame" class="w-5 h-5"></i> Warm-up Routine</h4>
            <p>${workout.warmup}</p>
        </div>
    `;
    
    html += '<div class="space-y-4">';
    workout.weeklyPlan.forEach(day => {
        if (day.restDay) {
            html += `
                <div class="day-card bg-gray-50">
                    <div class="day-header">
                        <i data-lucide="coffee" class="w-6 h-6 text-gray-400"></i>
                        <span class="day-name text-gray-500">${day.day}</span>
                        <span class="ml-auto text-sm text-gray-400">Rest Day</span>
                    </div>
                    <p class="text-gray-500">Recovery and light stretching recommended</p>
                </div>
            `;
        } else {
            html += `
                <div class="day-card">
                    <div class="day-header">
                        <i data-lucide="dumbbell" class="w-6 h-6 text-emerald-600"></i>
                        <span class="day-name">${day.day}</span>
                        <span class="ml-auto text-sm text-gray-500">${day.focus} • ${day.duration}</span>
                    </div>
                    <div class="space-y-2">
                        ${day.exercises.map(ex => `
                            <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4 text-emerald-600"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="font-medium text-gray-800">${ex.name}</div>
                                    <div class="text-sm text-gray-500">${ex.sets} sets × ${ex.reps} reps ${ex.notes ? `• ${ex.notes}` : ''}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    html += '</div>';
    
    html += `
        <div class="result-card mt-6">
            <h4><i data-lucide="snowflake" class="w-5 h-5"></i> Cool-down Routine</h4>
            <p>${workout.cooldown}</p>
        </div>
        
        <div class="result-card mt-4">
            <h4><i data-lucide="trending-up" class="w-5 h-5"></i> Progression Tips</h4>
            <ul>
                ${workout.progressionTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
    
    return html;
}

function renderDiet(diet) {
    let html = `
        <div class="result-card mb-6">
            <h4><i data-lucide="book-open" class="w-5 h-5"></i> Dietary Guidelines</h4>
            <ul>
                ${diet.guidelines.map(g => `<li>${g}</li>`).join('')}
            </ul>
        </div>
        
        <h3 class="text-lg font-bold text-gray-800 mb-4">Daily Meal Plan</h3>
    `;
    
    // Breakfast
    html += `<div class="mb-6">
        <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <i data-lucide="sunrise" class="w-4 h-4 text-amber-600"></i>
            </span>
            Breakfast Options
        </h4>
        <div class="grid gap-3">
            ${diet.mealPlan.breakfast.map(meal => `
                <div class="meal-card">
                    <div class="meal-header">
                        <div class="meal-icon breakfast"><i data-lucide="coffee" class="w-5 h-5"></i></div>
                        <div>
                            <div class="meal-name">${meal.name}</div>
                            <div class="meal-time">${meal.time} • ~${meal.calories} cal</div>
                        </div>
                    </div>
                    <p class="meal-content">${meal.description}</p>
                </div>
            `).join('')}
        </div>
    </div>`;
    
    // Lunch
    html += `<div class="mb-6">
        <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i data-lucide="sun" class="w-4 h-4 text-blue-600"></i>
            </span>
            Lunch Options
        </h4>
        <div class="grid gap-3">
            ${diet.mealPlan.lunch.map(meal => `
                <div class="meal-card">
                    <div class="meal-header">
                        <div class="meal-icon lunch"><i data-lucide="salad" class="w-5 h-5"></i></div>
                        <div>
                            <div class="meal-name">${meal.name}</div>
                            <div class="meal-time">${meal.time} • ~${meal.calories} cal</div>
                        </div>
                    </div>
                    <p class="meal-content">${meal.description}</p>
                </div>
            `).join('')}
        </div>
    </div>`;
    
    // Dinner
    html += `<div class="mb-6">
        <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <i data-lucide="moon" class="w-4 h-4 text-pink-600"></i>
            </span>
            Dinner Options
        </h4>
        <div class="grid gap-3">
            ${diet.mealPlan.dinner.map(meal => `
                <div class="meal-card">
                    <div class="meal-header">
                        <div class="meal-icon dinner"><i data-lucide="utensils" class="w-5 h-5"></i></div>
                        <div>
                            <div class="meal-name">${meal.name}</div>
                            <div class="meal-time">${meal.time} • ~${meal.calories} cal</div>
                        </div>
                    </div>
                    <p class="meal-content">${meal.description}</p>
                </div>
            `).join('')}
        </div>
    </div>`;
    
    // Snacks
    html += `<div class="mb-6">
        <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i data-lucide="apple" class="w-4 h-4 text-green-600"></i>
            </span>
            Healthy Snacks
        </h4>
        <div class="grid md:grid-cols-2 gap-3">
            ${diet.mealPlan.snacks.map(snack => `
                <div class="meal-card">
                    <div class="meal-header">
                        <div class="meal-icon snack"><i data-lucide="cookie" class="w-5 h-5"></i></div>
                        <div>
                            <div class="meal-name">${snack.name}</div>
                            <div class="meal-time">~${snack.calories} cal</div>
                        </div>
                    </div>
                    <p class="meal-content">${snack.description}</p>
                </div>
            `).join('')}
        </div>
    </div>`;
    
    html += `
        <div class="result-card">
            <h4><i data-lucide="droplets" class="w-5 h-5"></i> Hydration</h4>
            <p>${diet.hydration}</p>
        </div>
    `;
    
    if (diet.supplements && diet.supplements.length > 0) {
        html += `
            <div class="result-card mt-4">
                <h4><i data-lucide="pill" class="w-5 h-5"></i> Recommended Supplements</h4>
                <ul>
                    ${diet.supplements.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    return html;
}

function renderSleep(sleep) {
    return `
        <div class="grid md:grid-cols-3 gap-4 mb-8">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center border border-indigo-100">
                <i data-lucide="clock" class="w-8 h-8 text-indigo-600 mx-auto mb-2"></i>
                <div class="text-2xl font-bold text-indigo-600">${sleep.targetHours}</div>
                <div class="text-sm text-gray-600">Target Sleep</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-100">
                <i data-lucide="moon" class="w-8 h-8 text-purple-600 mx-auto mb-2"></i>
                <div class="text-2xl font-bold text-purple-600">${sleep.bedtime}</div>
                <div class="text-sm text-gray-600">Bedtime</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-amber-100">
                <i data-lucide="sunrise" class="w-8 h-8 text-amber-600 mx-auto mb-2"></i>
                <div class="text-2xl font-bold text-amber-600">${sleep.wakeTime}</div>
                <div class="text-sm text-gray-600">Wake Time</div>
            </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
            <div class="result-card">
                <h4><i data-lucide="moon" class="w-5 h-5"></i> Evening Routine</h4>
                <ul>
                    ${sleep.routine.evening.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
            <div class="result-card">
                <h4><i data-lucide="sun" class="w-5 h-5"></i> Morning Routine</h4>
                <ul>
                    ${sleep.routine.morning.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="result-card mt-6">
            <h4><i data-lucide="lightbulb" class="w-5 h-5"></i> Sleep Improvement Tips</h4>
            <ul>
                ${sleep.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        <div class="bg-red-50 border border-red-100 rounded-2xl p-6 mt-6">
            <h4 class="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-5 h-5"></i>
                Avoid Before Bed
            </h4>
            <ul class="space-y-2">
                ${sleep.avoidBefore.map(item => `
                    <li class="flex items-center gap-2 text-red-600">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        ${item}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function renderEquipment(equipment) {
    const priorityOrder = { essential: 1, recommended: 2, optional: 3 };
    const sorted = [...equipment].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    let html = `
        <p class="text-gray-600 mb-6">Based on your goals and budget, here's the recommended home equipment:</p>
        <div class="space-y-4">
    `;
    
    sorted.forEach(item => {
        const icons = {
            essential: 'alert-circle',
            recommended: 'star',
            optional: 'plus-circle'
        };
        
        html += `
            <div class="equipment-card">
                <div class="equipment-icon">
                    <i data-lucide="package" class="w-6 h-6"></i>
                </div>
                <div class="equipment-info flex-1">
                    <h4>${item.name}</h4>
                    <p>${item.reason}</p>
                    <p class="text-emerald-600 font-medium mt-1">${item.priceRange}</p>
                </div>
                <span class="priority-badge ${item.priority}">
                    <i data-lucide="${icons[item.priority]}" class="w-3 h-3 inline mr-1"></i>
                    ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <h4 class="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <i data-lucide="info" class="w-5 h-5"></i>
                Shopping Tips
            </h4>
            <ul class="text-emerald-700 space-y-1">
                <li>• Start with essential items first</li>
                <li>• Check for sales and discounts online</li>
                <li>• Consider second-hand options for larger equipment</li>
                <li>• Invest in quality for items you'll use daily</li>
            </ul>
        </div>
    `;
    
    return html;
}

function renderWeeklySchedule(weeklySchedule) {
    let html = '<div class="space-y-4">';
    
    weeklySchedule.forEach(day => {
        html += `
            <div class="day-card">
                <div class="day-header">
                    <i data-lucide="calendar" class="w-6 h-6 text-emerald-600"></i>
                    <span class="day-name">${day.day}</span>
                </div>
                <div class="space-y-2">
                    ${day.schedule.map(item => `
                        <div class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="text-sm font-mono text-emerald-600 w-20">${item.time}</div>
                            <div class="text-gray-700">${item.activity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Utility Functions
function restartApp() {
    clearLocalStorage();
    state.currentStep = 0;
    showScreen('welcomeScreen');
}

function downloadPDF() {
    const plan = state.healthPlan;
    if (!plan) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;
    
    // Helper function to add text with word wrap
    function addText(text, fontSize = 10, isBold = false) {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, contentWidth);
        
        lines.forEach(line => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += fontSize * 0.5;
        });
        y += 2;
    }
    
    // Helper function to add section header
    function addSection(title) {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        y += 5;
        doc.setFillColor(16, 185, 129);
        doc.rect(margin, y - 5, contentWidth, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 3, y + 2);
        doc.setTextColor(0, 0, 0);
        y += 12;
    }
    
    // Title
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('HealthPath', margin, 18);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Personalized Health Plan', margin, 28);
    doc.setTextColor(0, 0, 0);
    y = 45;
    
    // Overview Section
    addSection('OVERVIEW');
    addText(plan.overview.summary, 10);
    y += 3;
    addText(`BMI: ${plan.overview.bmi} (${plan.overview.bmiCategory})`, 10, true);
    addText(`Daily Calories: ${plan.overview.dailyCalories}`, 10);
    addText(`Protein Goal: ${plan.overview.proteinGoal}g`, 10);
    addText(`Water Intake: ${plan.overview.waterIntake}`, 10);
    
    // Workout Section
    addSection('WORKOUT PLAN');
    addText(`Warm-up: ${plan.workout.warmup}`, 9);
    y += 2;
    plan.workout.weeklyPlan.forEach(day => {
        if (day.restDay) {
            addText(`${day.day}: Rest Day`, 10, true);
        } else {
            addText(`${day.day}: ${day.focus} (${day.duration})`, 10, true);
            day.exercises.forEach(ex => {
                addText(`  • ${ex.name}: ${ex.sets} sets x ${ex.reps} reps`, 9);
            });
        }
        y += 2;
    });
    addText(`Cool-down: ${plan.workout.cooldown}`, 9);
    
    // Diet Section
    addSection('DIET PLAN');
    addText('Guidelines:', 10, true);
    plan.diet.guidelines.forEach(g => {
        addText(`  • ${g}`, 9);
    });
    y += 3;
    
    addText('Breakfast Options:', 10, true);
    plan.diet.mealPlan.breakfast.forEach(meal => {
        addText(`  • ${meal.name} (~${meal.calories} cal) - ${meal.description}`, 9);
    });
    
    addText('Lunch Options:', 10, true);
    plan.diet.mealPlan.lunch.forEach(meal => {
        addText(`  • ${meal.name} (~${meal.calories} cal) - ${meal.description}`, 9);
    });
    
    addText('Dinner Options:', 10, true);
    plan.diet.mealPlan.dinner.forEach(meal => {
        addText(`  • ${meal.name} (~${meal.calories} cal) - ${meal.description}`, 9);
    });
    
    addText('Snacks:', 10, true);
    plan.diet.mealPlan.snacks.forEach(snack => {
        addText(`  • ${snack.name} (~${snack.calories} cal)`, 9);
    });
    
    // Sleep Section
    addSection('SLEEP SCHEDULE');
    addText(`Target Sleep: ${plan.sleep.targetHours}`, 10, true);
    addText(`Bedtime: ${plan.sleep.bedtime}`, 10);
    addText(`Wake Time: ${plan.sleep.wakeTime}`, 10);
    y += 2;
    addText('Evening Routine:', 10, true);
    plan.sleep.routine.evening.forEach(step => {
        addText(`  • ${step}`, 9);
    });
    addText('Morning Routine:', 10, true);
    plan.sleep.routine.morning.forEach(step => {
        addText(`  • ${step}`, 9);
    });
    
    // Equipment Section
    addSection('RECOMMENDED EQUIPMENT');
    plan.equipment.forEach(item => {
        addText(`${item.name} [${item.priority.toUpperCase()}]`, 10, true);
        addText(`  ${item.reason}`, 9);
        addText(`  Price: ${item.priceRange}`, 9);
        y += 2;
    });
    
    // Weekly Schedule
    addSection('WEEKLY SCHEDULE');
    plan.weeklySchedule.forEach(day => {
        addText(day.day, 10, true);
        day.schedule.forEach(item => {
            addText(`  ${item.time} - ${item.activity}`, 9);
        });
        y += 2;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by HealthPath - Your Personal Health Journey', margin, 285);
    
    // Save the PDF
    doc.save('healthpath-plan.pdf');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
