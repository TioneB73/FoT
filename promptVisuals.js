/**
 * FoT Prompt Visuals
 * Provides visual suggestions for prompts based on content analysis
 */

// Map of keywords to visual elements (emojis and colors)
const visualSuggestions = {
  // Ocean and water-related
  ocean: { emoji: '🌊', color: '#1e88e5', name: 'ocean' },
  sea: { emoji: '🌊', color: '#1e88e5', name: 'sea' },
  water: { emoji: '💧', color: '#90caf9', name: 'water' },
  river: { emoji: '🏞️', color: '#4fc3f7', name: 'river' },
  lake: { emoji: '🏞️', color: '#29b6f6', name: 'lake' },
  
  // Land features
  mountain: { emoji: '⛰️', color: '#795548', name: 'mountain' },
  mountains: { emoji: '🏔️', color: '#8d6e63', name: 'mountains' },
  forest: { emoji: '🌲', color: '#43a047', name: 'forest' },
  trees: { emoji: '🌳', color: '#388e3c', name: 'trees' },
  tree: { emoji: '🌳', color: '#388e3c', name: 'tree' },
  rainforest: { emoji: '🌴', color: '#2e7d32', name: 'rainforest' },
  desert: { emoji: '🏜️', color: '#ffd54f', name: 'desert' },
  soil: { emoji: '🏝️', color: '#a1887f', name: 'soil' },
  land: { emoji: '⛰️', color: '#8d6e63', name: 'land' },
  
  // Sky and atmosphere
  air: { emoji: '💨', color: '#b3e5fc', name: 'air' },
  atmosphere: { emoji: '🌫️', color: '#e1f5fe', name: 'atmosphere' },
  clouds: { emoji: '☁️', color: '#eceff1', name: 'clouds' },
  sky: { emoji: '🌤️', color: '#03a9f4', name: 'sky' },
  ozone: { emoji: '🌐', color: '#bbdefb', name: 'ozone' },
  
  // Climate elements
  glacier: { emoji: '🧊', color: '#b3e5fc', name: 'glacier' },
  ice: { emoji: '❄️', color: '#e1f5fe', name: 'ice' },
  snow: { emoji: '❄️', color: '#eceff1', name: 'snow' },
  rain: { emoji: '🌧️', color: '#4fc3f7', name: 'rain' },
  
  // Ecosystems
  coral: { emoji: '🐚', color: '#ff7043', name: 'coral' },
  reefs: { emoji: '🐠', color: '#ff5722', name: 'reefs' },
  wetlands: { emoji: '🦆', color: '#8bc34a', name: 'wetlands' },
  arctic: { emoji: '🥶', color: '#b3e5fc', name: 'arctic' },
  tundra: { emoji: '🏔️', color: '#cfd8dc', name: 'tundra' },
  grasslands: { emoji: '🌾', color: '#cddc39', name: 'grasslands' },
  mangroves: { emoji: '🌴', color: '#7cb342', name: 'mangroves' },
  
  // Light and energy
  sunlight: { emoji: '☀️', color: '#fdd835', name: 'sunlight' },
  sun: { emoji: '☀️', color: '#fdd835', name: 'sun' },
  moon: { emoji: '🌙', color: '#9e9e9e', name: 'moon' },
  stars: { emoji: '✨', color: '#ffd54f', name: 'stars' },
  
  // Wildlife
  wildlife: { emoji: '🦓', color: '#795548', name: 'wildlife' },
  animals: { emoji: '🐾', color: '#795548', name: 'animals' },
  bird: { emoji: '🦅', color: '#757575', name: 'bird' },
  birds: { emoji: '🦢', color: '#757575', name: 'birds' },
  whale: { emoji: '🐋', color: '#0277bd', name: 'whale' },
  tiger: { emoji: '🐯', color: '#ff9800', name: 'tiger' },
  panda: { emoji: '🐼', color: '#424242', name: 'panda' },
  elephant: { emoji: '🐘', color: '#9e9e9e', name: 'elephant' },
  
  // Natural events
  sunrise: { emoji: '🌅', color: '#ff9800', name: 'sunrise' },
  sunset: { emoji: '🌇', color: '#ff5722', name: 'sunset' },
  storm: { emoji: '⛈️', color: '#546e7a', name: 'storm' },
  
  // Time elements
  future: { emoji: '🔮', color: '#7e57c2', name: 'future' },
  past: { emoji: '⏳', color: '#a1887f', name: 'past' },
  eternity: { emoji: '♾️', color: '#7986cb', name: 'eternity' },
  
  // Abstract concepts
  nature: { emoji: '🌿', color: '#4caf50', name: 'nature' },
  earth: { emoji: '🌍', color: '#2196f3', name: 'earth' },
  planet: { emoji: '🌎', color: '#1976d2', name: 'planet' },
  humanity: { emoji: '👨‍👩‍👧‍👦', color: '#ff5252', name: 'humanity' },
  humans: { emoji: '👥', color: '#ec407a', name: 'humans' },
  beauty: { emoji: '🌷', color: '#ec407a', name: 'beauty' },
  dream: { emoji: '💭', color: '#b39ddb', name: 'dream' },
  dreams: { emoji: '💭', color: '#b39ddb', name: 'dreams' }
};

/**
 * Analyzes text content and returns appropriate visual suggestions
 * @param {string} text - The text to analyze
 * @return {Array} - Array of matching visual suggestions
 */
function analyzeTextForVisuals(text) {
  if (!text) return [];
  
  // Convert to lowercase and remove punctuation for better matching
  const cleanedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  const words = cleanedText.split(/\s+/);
  
  // Find matches from our visual suggestions dictionary
  const matches = [];
  const seenKeys = new Set(); // To avoid duplicate matches
  
  words.forEach(word => {
    if (visualSuggestions[word] && !seenKeys.has(word)) {
      matches.push(visualSuggestions[word]);
      seenKeys.add(word);
    }
  });
  
  // If no direct matches, try partial matching for key concepts
  if (matches.length === 0) {
    const allKeys = Object.keys(visualSuggestions);
    
    // First check if any key is contained in the text
    for (const key of allKeys) {
      if (cleanedText.includes(key) && !seenKeys.has(key)) {
        matches.push(visualSuggestions[key]);
        seenKeys.add(key);
        
        // Limit to 3 suggestions
        if (matches.length >= 3) break;
      }
    }
    
    // If still no matches, add some generic nature-related visuals
    if (matches.length === 0) {
      matches.push(visualSuggestions.earth);
      matches.push(visualSuggestions.nature);
    }
  }
  
  // Limit to top 3 matches
  return matches.slice(0, 3);
}

/**
 * Creates a visual badge element based on the given visual suggestion
 * @param {Object} visualSuggestion - The visual suggestion object
 * @return {HTMLElement} - The visual badge element
 */
function createVisualBadge(visualSuggestion) {
  const badge = document.createElement('div');
  badge.className = 'visual-badge';
  badge.title = visualSuggestion.name;
  badge.style.backgroundColor = visualSuggestion.color + '20'; // Add some transparency
  badge.style.color = visualSuggestion.color;
  badge.style.border = `1px solid ${visualSuggestion.color}40`;
  badge.textContent = visualSuggestion.emoji;
  
  return badge;
}

/**
 * Adds visual suggestion badges to a prompt element
 * @param {HTMLElement} promptElement - The prompt element to add badges to
 * @param {string} promptText - The text of the prompt
 */
function addVisualSuggestionsToBadges(promptElement, promptText) {
  // Get existing badges container or create a new one
  let badgesContainer = promptElement.querySelector('.visual-badges-container');
  
  if (!badgesContainer) {
    badgesContainer = document.createElement('div');
    badgesContainer.className = 'visual-badges-container';
    promptElement.appendChild(badgesContainer);
  } else {
    // Clear existing badges
    badgesContainer.innerHTML = '';
  }
  
  // Get visual suggestions for the prompt text
  const visualSuggestions = analyzeTextForVisuals(promptText);
  
  // Create and add badges
  visualSuggestions.forEach(suggestion => {
    const badge = createVisualBadge(suggestion);
    badgesContainer.appendChild(badge);
  });
}

// Export functions
export {
  analyzeTextForVisuals,
  addVisualSuggestionsToBadges
};