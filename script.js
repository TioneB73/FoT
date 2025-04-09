document.addEventListener('DOMContentLoaded', function() {
    /**
     * Initialize the app when document is ready
     */
    
    // Initialize Showdown converter for Markdown rendering
    const converter = new showdown.Converter({
        ghCompatibleHeaderId: true,
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        emoji: true
    });
    converter.setFlavor('github');

    // --- DOM Elements ---
    // Form elements
    const folderNameInput = document.getElementById('folder-name');
    const folderList = document.getElementById('folder-list'); 
    const folderStatusDiv = document.getElementById('folder-status');
    const dateInput = document.getElementById('date');
    const folderLinkInput = document.getElementById('folder-link');
    const promptInput = document.getElementById('prompt');
    const promptStatusDiv = document.getElementById('prompt-status');
    const gpt4RealizationInput = document.getElementById('gpt4-realization');
    const grokRealizationInput = document.getElementById('grok-realization');
    const midjourneyPromptInput = document.getElementById('midjourney-prompt');
    const commentInput = document.getElementById('comment');

    // Image preview grid elements
    const gptImagePreviewsGrid = document.getElementById('gpt-image-previews');
    const grokImagePreviewsGrid = document.getElementById('grok-image-previews');
    const midjourneyImagePreviewsGrid = document.getElementById('midjourney-image-previews');

    // Markdown preview elements
    const markdownRaw = document.getElementById('markdown-raw');
    const markdownPreview = document.getElementById('markdown-preview');

    // Button elements
    const copyMarkdownButton = document.getElementById('copy-markdown-button');
    const sendDiscordButton = document.getElementById('send-discord-button');
    const sendTelegramButton = document.getElementById('send-telegram-button');
    const sendToDiscordWebhook = document.getElementById('send-to-discord-webhook');
    const exportMetadataButton = document.getElementById('export-metadata');

    // Toggle buttons
    const togglePromptCreatorBtn = document.getElementById('toggle-prompt-creator');
    const promptCreatorContent = document.getElementById('prompt-creator-content');
    const toggleImageManagerBtn = document.getElementById('toggle-image-manager');
    const imageManagerContent = document.getElementById('image-manager-content');

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Theme selector
    const themeSelect = document.getElementById('theme-select');

    // Metadata display elements
    const parsedDateElement = document.getElementById('parsed-date');
    const parsedTitleElement = document.getElementById('parsed-title');
    const parsedSlugElement = document.getElementById('parsed-slug');

    // --- Global State ---
    let currentFolderName = '';
    let currentFormattedDate = '';
    let baseMediaPath = 'https://tioneb73.github.io/FoT/Done/';
    let folderMetadata = {
        date: '',
        title: '',
        slug: '',
        timestamp: ''
    };

    // --- IMAGE STORE ---
    // Store images in memory during the session
    const imageStore = {
        images: [],
        nextId: 1
    };
    
    // --- VISUAL SUGGESTIONS ---
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

    // --- PROMPT TEMPLATES ---
    // Collection of prompt templates categorized by type
    const promptTemplates = {
        philosophical: [
            "What would Earth tell us if it could speak for {time}?",
            "If {natural_element} had consciousness, what would be its greatest wish?",
            "Imagine a world where humans and {natural_element} could communicate. What's the first conversation?",
            "What does humanity owe to {natural_element}?",
            "Is the beauty of {natural_element} a privilege or a right for future generations?",
            "How would our ancestors judge our stewardship of {natural_element}?",
            "What is the moral weight of a single {natural_element}?",
            "If you could hear the thoughts of {natural_element}, what wisdom would it share?"
        ],
        poetic: [
            "Write a dream told by a {natural_element}.",
            "Compose a letter from the last {endangered_species} to humanity.",
            "Describe the moment when {natural_element} first noticed humans were changing.",
            "A whisper from {natural_element} to those who listen carefully.",
            "The secret language between {natural_element} and the moon.",
            "A lullaby sung by {natural_element} to soothe the world.",
            "The autobiography of a {natural_element} who witnessed a century of change.",
            "A love letter to {natural_element} from someone who understands its value."
        ],
        thoughtful: [
            "Describe the last {natural_event} on a polluted world.",
            "How might {natural_element} evolve to survive in a world dominated by technology?",
            "The memory of {natural_element} in a world that forgot its importance.",
            "Imagine being the guardian of the last pristine {natural_element}. What is your daily routine?",
            "What stories would {natural_element} tell about the time before humans?",
            "How does {natural_element} measure time differently than humans do?",
            "The silent revolution of {natural_element} against human expectation.",
            "What happens in the space between human progress and {natural_element}'s patience?"
        ],
        speculative: [
            "In a world where {natural_element} determines social status, how does society reorganize?",
            "What technology might we develop if inspired directly by {natural_element}?",
            "Describe a civilization that evolved to live in harmony with {natural_element} instead of exploiting it.",
            "What if {natural_element} could send warnings from the future?",
            "Design a ritual for honoring {natural_element} that could realistically be adopted globally.",
            "How might {endangered_species} perceive human attempts to save them?",
            "If {natural_element} could vote in our elections, what policies would it prioritize?",
            "What would a divine intervention look like if it came to protect {natural_element}?"
        ]
    };

    // Environmental elements that can be used in the templates
    const replacements = {
        natural_element: [
            "the ocean", "ancient forests", "glaciers", "coral reefs", "rivers", 
            "mountains", "soil", "air", "the atmosphere", "rainforests", 
            "wetlands", "the Arctic", "deserts", "grasslands", "tundra",
            "mangroves", "the ozone layer", "clouds", "fresh water", "sunlight"
        ],
        endangered_species: [
            "blue whale", "giant panda", "snow leopard", "sea turtle", "tiger", 
            "rhinoceros", "orangutan", "gorilla", "polar bear", "monarch butterfly",
            "elephant", "honeybee", "vaquita", "Sumatran rhino", "Amur leopard"
        ],
        natural_event: [
            "sunrise", "rainfall", "snowfall", "spring bloom", "autumn", 
            "migration", "pollination", "germination", "hibernation", "tide", 
            "season", "moonrise", "eclipse", "bird song", "silence"
        ],
        time: [
            "a day", "a century", "a millennium", "its lifetime", "the future",
            "our children's lifetime", "seven generations", "our brief history",
            "a single moment", "eternity"
        ]
    };

    // --- Theme Management ---
    // Load saved theme from localStorage
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('fotBroadcasterTheme');
        if (savedTheme) {
            document.body.className = savedTheme;
            themeSelect.value = savedTheme;
        }
    }

    // Set theme when selector changes
    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            document.body.className = selectedTheme;
            localStorage.setItem('fotBroadcasterTheme', selectedTheme);
        });
    }

    // --- Tab Management ---
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Find the parent container to scope tab switching
                const parent = button.closest('.section-card');
                if (!parent) return;
                
                // Get tabs within this section
                const sectionTabs = parent.querySelectorAll('.tab-btn');
                const sectionPanes = parent.querySelectorAll('.tab-pane');
                
                // Remove active class from all buttons and panes in this section
                sectionTabs.forEach(btn => btn.classList.remove('active'));
                sectionPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Activate corresponding pane
                const tabId = button.getAttribute('data-tab');
                const tabPane = document.getElementById(`tab-${tabId}`);
                if (tabPane) {
                    tabPane.classList.add('active');
                }
            });
        });
    }

    // Setup toggle buttons
    if (togglePromptCreatorBtn && promptCreatorContent) {
        togglePromptCreatorBtn.addEventListener('click', () => {
            const isHidden = promptCreatorContent.classList.toggle('hidden');
            const icon = togglePromptCreatorBtn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
            }
        });
    }

    if (toggleImageManagerBtn && imageManagerContent) {
        toggleImageManagerBtn.addEventListener('click', () => {
            const isHidden = imageManagerContent.classList.toggle('hidden');
            const icon = toggleImageManagerBtn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
            }
        });
    }

    // --- Folder Management Functions ---
    async function fetchAndPopulateFolders() {
        if (!folderNameInput || !folderList || !folderStatusDiv) return;
        
        folderNameInput.placeholder = "Loading folders...";
        folderNameInput.disabled = true; 
        folderStatusDiv.textContent = `Fetching folder list...`;
        folderStatusDiv.className = 'status-message';

        try {
            const response = await fetch(baseMediaPath + 'index.json?t=' + Date.now()); 
            if (!response.ok) {
                throw new Error(`HTTP error fetching index.json! Status: ${response.status}`);
            }
            // Directly parse the JSON response which should be an array of folder names
            const fetchedFolderNames = await response.json();

            if (!Array.isArray(fetchedFolderNames)) {
                throw new Error("index.json did not contain a valid JSON array.");
            }

            // Sort folder names, newest first based on YYMMDD prefix
            // Filter out any non-string or incorrectly formatted entries just in case
            const validFolderNames = fetchedFolderNames
                .filter(name => typeof name === 'string' && name.match(/^\d{6}-/))
                .sort((a, b) => b.localeCompare(a)); 

            // Clear existing options and populate datalist
            folderList.innerHTML = '';
            validFolderNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                folderList.appendChild(option);
            });

            if (validFolderNames.length > 0) {
                folderStatusDiv.textContent = `Loaded ${validFolderNames.length} folders. Select one.`;
                folderStatusDiv.className = 'status-message success';
                folderNameInput.placeholder = "Select or type a folder name";
            } else {
                folderStatusDiv.textContent = 'No valid folders found in index.json (expected YYMMDD-...).';
                folderStatusDiv.className = 'status-message error';
                folderNameInput.placeholder = "Could not load folders";
            }

        } catch (error) {
            console.error('Error fetching or parsing folder list:', error);
            folderStatusDiv.textContent = `Error loading folder list: ${error.message}`;
            folderStatusDiv.className = 'status-message error';
            folderNameInput.placeholder = "Error loading folders";
        } finally {
            folderNameInput.disabled = false; 
        }
    }

    /** Fetches index.json from a specific folder and loads matching images */
    async function loadModelImages(folderName, modelPrefix, previewGridElement) {
        if (!previewGridElement) return;
        
        const folderPath = `${baseMediaPath}${folderName}/`;
        const indexUrl = `${folderPath}index.json?t=${Date.now()}`; 

        // Clear previous images and show loading state
        previewGridElement.innerHTML = '<div class="loading-placeholder">Loading...</div>';

        try {
            const response = await fetch(indexUrl);
            if (!response.ok) {
                throw new Error(`HTTP error fetching ${indexUrl}! Status: ${response.status}`);
            }
            const fileList = await response.json();

            if (!Array.isArray(fileList)) {
                throw new Error(`index.json in ${folderName} is not a valid JSON array.`);
            }

            // Filter for images matching the prefix and common extensions
            const imageFiles = fileList.filter(filename =>
                typeof filename === 'string' &&
                filename.toLowerCase().startsWith(modelPrefix.toLowerCase()) &&
                /\.(png|jpg|jpeg|gif|webp)$/i.test(filename)
            );

            // Clear loading placeholder
            previewGridElement.innerHTML = '';

            if (imageFiles.length === 0) {
                previewGridElement.innerHTML = `<div class="error-placeholder">No images found matching '${modelPrefix}*.{png/jpg/jpeg/gif/webp}'</div>`;
            } else {
                imageFiles.forEach(filename => {
                    const img = document.createElement('img');
                    const imgSrc = `${folderPath}${filename}`;
                    img.src = imgSrc;
                    img.alt = `${modelPrefix} image: ${filename}`;
                    img.title = filename; 
                    img.onerror = () => {
                        img.style.display = 'none'; 
                        console.error(`Failed to load image: ${imgSrc}`);
                        if (!previewGridElement.querySelector('.error-placeholder')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-placeholder';
                            errorDiv.textContent = 'Some images failed to load.';
                            previewGridElement.appendChild(errorDiv);
                        }
                        updatePreview(); 
                    };
                    img.onload = () => {
                        updatePreview(); 
                    };
                    
                    // Add lightbox effect on click
                    img.addEventListener('click', () => {
                        openImageLightbox(imgSrc, filename);
                    });
                    
                    previewGridElement.appendChild(img);
                });
            }

        } catch (error) {
            console.error(`Error loading images for ${modelPrefix}:`, error);
            previewGridElement.innerHTML = `<div class="error-placeholder">Error loading image list: ${error.message}</div>`;
        } finally {
            updatePreview(); 
        }
    }

    // Function to create a simple lightbox for images
    function openImageLightbox(src, title) {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.backgroundColor = 'rgba(0,0,0,0.9)';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.padding = '20px';
        lightbox.style.zIndex = '1000';
        lightbox.style.opacity = '0';
        lightbox.style.transition = 'opacity 0.3s ease';
        
        // Create image element
        const img = document.createElement('img');
        img.src = src;
        img.alt = title;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.border = '2px solid white';
        img.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
        
        // Create caption
        const caption = document.createElement('div');
        caption.textContent = title;
        caption.style.position = 'absolute';
        caption.style.bottom = '10%';
        caption.style.left = '0';
        caption.style.right = '0';
        caption.style.textAlign = 'center';
        caption.style.color = 'white';
        caption.style.padding = '10px';
        caption.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.cursor = 'pointer';
        
        // Add closing event
        lightbox.addEventListener('click', () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        });
        
        // Append elements
        lightbox.appendChild(img);
        lightbox.appendChild(caption);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Trigger animation
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }

    /** Parses date and other metadata from folder name (YYMMDD-...) */
    function parseFolderMetadata(folderName) {
        // Reset metadata object
        folderMetadata = {
            date: '',
            title: '',
            slug: '',
            timestamp: new Date().toISOString()
        };
        
        // Parse date
        const dateMatch = folderName.match(/^(\d{2})(\d{2})(\d{2})/);
        if (dateMatch) {
            const year = `20${dateMatch[1]}`; 
            const month = dateMatch[2];
            const day = dateMatch[3];
            currentFormattedDate = `${year}-${month}-${day}`;
            folderMetadata.date = currentFormattedDate;
            
            // Extract title and slug
            const remainingParts = folderName.substring(7); // Skip the YYMMDD- part
            let title = '';
            let slug = '';
            
            // Check if the format is like "YYMMDD-Title-slug"
            const parts = remainingParts.split('-');
            if (parts.length >= 1) {
                // First part after date is the title (might be multiple parts)
                title = parts[0].replace(/_/g, ' ');
                // Use everything as the slug
                slug = remainingParts;
            }
            
            folderMetadata.title = title || folderName;
            folderMetadata.slug = slug || folderName;
            
            // Update UI
            if (dateInput) dateInput.value = currentFormattedDate;
            if (folderLinkInput) folderLinkInput.value = `${baseMediaPath}${folderName}/`;
            
            // Update metadata display
            if (parsedDateElement) parsedDateElement.textContent = folderMetadata.date;
            if (parsedTitleElement) parsedTitleElement.textContent = folderMetadata.title;
            if (parsedSlugElement) parsedSlugElement.textContent = folderMetadata.slug;
            
            if (folderStatusDiv) {
                folderStatusDiv.textContent = `Folder metadata parsed successfully`;
                folderStatusDiv.className = 'status-message success';
            }
            return true;
        } else {
            if (dateInput) dateInput.value = '';
            if (folderLinkInput) folderLinkInput.value = '';
            currentFormattedDate = '';
            
            // Clear metadata display
            if (parsedDateElement) parsedDateElement.textContent = '-';
            if (parsedTitleElement) parsedTitleElement.textContent = '-';
            if (parsedSlugElement) parsedSlugElement.textContent = '-';
            
            if (folderStatusDiv) {
                folderStatusDiv.textContent = 'Cannot parse date from folder name (expected YYMMDD format at start).';
                folderStatusDiv.className = 'status-message error';
            }
            return false;
        }
    }

    /** Fetches Prompt.txt and updates the input field */
    async function loadPrompt(folderName) {
        if (!promptInput || !promptStatusDiv) return;
        
        const promptPath = `${baseMediaPath}${folderName}/Prompt.txt`;
        promptStatusDiv.textContent = `Fetching ${promptPath}...`;
        promptStatusDiv.className = 'status-message';
        promptInput.value = ''; 
        promptInput.placeholder = 'Loading...';

        try {
            const response = await fetch(promptPath);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const text = await response.text();
            promptInput.value = text;
            promptStatusDiv.textContent = 'Prompt.txt loaded successfully.';
            promptStatusDiv.className = 'status-message success';
            promptInput.placeholder = '';
        } catch (error) {
            console.error('Error loading Prompt.txt:', error);
            promptInput.value = '';
            promptInput.placeholder = 'Waiting for Prompt.txt...';
            promptStatusDiv.textContent = `Error loading Prompt.txt: ${error.message}. Please ensure the file exists and the folder name is correct.`;
            promptStatusDiv.className = 'status-message error';
        } finally {
            updatePreview(); 
        }
    }

    /** Updates the Markdown preview */
    function updatePreview() {
        if (!markdownRaw || !markdownPreview) return;
        
        const prompt = promptInput ? promptInput.value : '';
        const gpt4Realization = gpt4RealizationInput ? gpt4RealizationInput.value : '';
        const grokRealization = grokRealizationInput ? grokRealizationInput.value : '';
        const midjourneyPrompt = midjourneyPromptInput ? midjourneyPromptInput.value : '';
        const comment = commentInput ? commentInput.value : '';
        const folderLink = folderLinkInput ? folderLinkInput.value : '';

        // --- Get Image Sources from Grids ---
        const getImageUrlsFromGrid = (gridElement) => {
            if (!gridElement) return [];
            return Array.from(gridElement.querySelectorAll('img'))
                .filter(img => img.style.display !== 'none' && img.src && img.src !== '#' && !img.src.endsWith('#')) 
                .map(img => img.src); 
        };

        const gptImageSources = getImageUrlsFromGrid(gptImagePreviewsGrid);
        const grokImageSources = getImageUrlsFromGrid(grokImagePreviewsGrid);
        const midjourneyImageSources = getImageUrlsFromGrid(midjourneyImagePreviewsGrid);

        // --- Construct Markdown ---
        let markdownContent = `
# FoT Daily Broadcast 🛰️ - ${currentFormattedDate || 'YYYY-MM-DD'}

## 📝 Prompt Used
\`\`\`
${prompt || '*Waiting for Prompt.txt...*'}
\`\`\`

## 🤖 Model Realizations

### GPT-4
${gpt4Realization ? `\`\`\`\n${gpt4Realization}\n\`\`\`` : '*No realization provided*'}
`;
        // Add GPT images
        if (gptImageSources.length > 0) {
            gptImageSources.forEach(src => {
                markdownContent += `\n![GPT Output](${src})`;
            });
        } else {
            markdownContent += `\n*No GPT images loaded*`;
        }

        markdownContent += `

### Grok
${grokRealization ? `\`\`\`\n${grokRealization}\n\`\`\`` : '*No realization provided*'}
`;
        // Add Grok images
        if (grokImageSources.length > 0) {
            grokImageSources.forEach(src => {
                markdownContent += `\n![Grok Output](${src})`;
            });
        } else {
            markdownContent += `\n*No Grok images loaded*`;
        }

        markdownContent += `

### Midjourney
**Prompt:**
\`\`\`
${midjourneyPrompt || '*No prompt provided*'}
\`\`\`
`;
        // Add Midjourney images
        if (midjourneyImageSources.length > 0) {
            markdownContent += '\n**Image(s):**';
            midjourneyImageSources.forEach(src => {
                markdownContent += `\n![Midjourney Output](${src})`;
            });
        } else {
            markdownContent += '\n*No Midjourney images loaded*';
        }

        markdownContent += `

## 📂 Media Folder
${folderLink ? `[${folderLink}](${folderLink})` : '*Enter folder name to generate link*'}
`;
        if (comment) {
            markdownContent += `\n\n## 💬 Comment\n${comment}`;
        }

        // Update raw markdown view and HTML preview
        markdownRaw.textContent = markdownContent.trim(); 
        markdownPreview.innerHTML = converter.makeHtml(markdownContent.trim());
    }

    /** Copies text to clipboard */
    async function copyToClipboard(text, button) {
        const originalText = button.innerHTML;
        try {
            await navigator.clipboard.writeText(text);
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            button.innerHTML = '<i class="fas fa-times"></i> Failed!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    }

    /** Exports metadata as JSON file */
    function exportMetadataJson() {
        if (!currentFolderName) {
            alert('Please select a folder first');
            return;
        }
        
        // Add current data to metadata
        folderMetadata.folderName = currentFolderName;
        folderMetadata.prompt = promptInput ? promptInput.value : '';
        folderMetadata.gpt4Realization = gpt4RealizationInput ? gpt4RealizationInput.value : '';
        folderMetadata.grokRealization = grokRealizationInput ? grokRealizationInput.value : '';
        folderMetadata.midjourneyPrompt = midjourneyPromptInput ? midjourneyPromptInput.value : '';
        folderMetadata.comment = commentInput ? commentInput.value : '';
        folderMetadata.exportTimestamp = new Date().toISOString();
        
        // Convert to JSON string
        const jsonStr = JSON.stringify(folderMetadata, null, 2);
        
        // Create and download file
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFolderName}_metadata.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- IMAGE MANAGER FUNCTIONS ---

    /**
     * Add an image to the in-memory store
     * @param {File} file - The image file to add
     * @param {string} category - Optional category (gpt, grok, midjourney)
     * @return {Promise<Object>} - The stored image object with URL
     */
    async function addImage(file, category = '') {
        return new Promise((resolve, reject) => {
            // Check if it's an image file
            if (!file.type.startsWith('image/')) {
                reject(new Error('Not a valid image file'));
                return;
            }
            
            // Create a FileReader to read the image
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Create an image object with metadata
                const imageObj = {
                    id: imageStore.nextId++,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    category: category || guessCategory(file.name),
                    dataUrl: event.target.result,
                    dateAdded: new Date().toISOString(),
                    selected: false
                };
                
                // Add to store
                imageStore.images.push(imageObj);
                
                // Resolve with the new image object
                resolve(imageObj);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read image file'));
            };
            
            // Read the file as a data URL
            reader.readAsDataURL(file);
        });
    }

    /**
     * Guess the category based on the filename
     * @param {string} filename - The filename to analyze
     * @return {string} - The guessed category
     */
    function guessCategory(filename) {
        const lowerName = filename.toLowerCase();
        
        if (lowerName.startsWith('gpt')) return 'gpt';
        if (lowerName.startsWith('grok')) return 'grok';
        if (lowerName.startsWith('midjourney')) return 'midjourney';
        
        return '';
    }

    /**
     * Delete an image from the store
     * @param {number} id - The ID of the image to delete
     * @return {boolean} - Success status
     */
    function deleteImage(id) {
        const initialLength = imageStore.images.length;
        imageStore.images = imageStore.images.filter(img => img.id !== id);
        return imageStore.images.length < initialLength;
    }

    /**
     * Rename an image in the store
     * @param {number} id - The ID of the image to rename
     * @param {string} newName - The new name for the image
     * @return {Object|null} - The updated image or null if not found
     */
    function renameImage(id, newName) {
        const image = imageStore.images.find(img => img.id === id);
        
        if (image) {
            image.name = newName;
            return image;
        }
        
        return null;
    }

    /**
     * Get all images, optionally filtered by category
     * @param {string} category - Optional category filter
     * @return {Array} - Array of matching images
     */
    function getImages(category = '') {
        if (!category) return [...imageStore.images];
        return imageStore.images.filter(img => img.category === category);
    }

    /**
     * Toggle selection status for an image
     * @param {number} id - The ID of the image to toggle
     * @return {boolean} - The new selection status
     */
    function toggleImageSelection(id) {
        const image = imageStore.images.find(img => img.id === id);
        
        if (image) {
            image.selected = !image.selected;
            return image.selected;
        }
        
        return false;
    }

    /**
     * Set category for an image
     * @param {number} id - The ID of the image
     * @param {string} category - The category to set
     * @return {Object|null} - The updated image or null if not found
     */
    function setImageCategory(id, category) {
        const image = imageStore.images.find(img => img.id === id);
        
        if (image) {
            image.category = category;
            return image;
        }
        
        return null;
    }

    /**
     * Clear all images from the store
     */
    function clearAllImages() {
        imageStore.images = [];
        console.log('All images cleared from memory');
    }

    /**
     * Render the image manager UI with current images
     * @param {string} containerId - The ID of the container element
     */
    function renderImageManager(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Get category tabs and content
        const imageManagerSection = container.closest('.image-manager-section');
        if (!imageManagerSection) return;
        
        const tabs = imageManagerSection.querySelector('.image-category-tabs');
        const content = container;
        
        if (!tabs || !content) return;
        
        // Clear existing content
        content.innerHTML = '';
        
        // Get the active category
        const activeTab = tabs.querySelector('.tab-btn.active');
        const activeCategory = activeTab ? activeTab.dataset.category : '';
        
        // Get images for the active category
        const images = activeCategory === 'all' ? getImages() : getImages(activeCategory);
        
        // Show message if no images
        if (images.length === 0) {
            const noImagesMsg = document.createElement('div');
            noImagesMsg.className = 'no-images-message';
            noImagesMsg.innerHTML = `<i class="fas fa-photo-video"></i><p>No images available${activeCategory ? ` in ${activeCategory}` : ''}. Upload some!</p>`;
            content.appendChild(noImagesMsg);
            return;
        }
        
        // Create image grid
        const imageGrid = document.createElement('div');
        imageGrid.className = 'image-grid';
        content.appendChild(imageGrid);
        
        // Add each image
        images.forEach(image => {
            const imageCard = createImageCard(image);
            imageGrid.appendChild(imageCard);
        });
    }

    /**
     * Creates an image card element for the gallery
     * @param {Object} image - The image object
     * @return {HTMLElement} - The image card element
     */
    function createImageCard(image) {
        const card = document.createElement('div');
        card.className = `image-card ${image.selected ? 'selected' : ''}`;
        card.dataset.id = image.id;
        
        // Image thumbnail
        const thumbnail = document.createElement('div');
        thumbnail.className = 'image-thumbnail';
        thumbnail.style.backgroundImage = `url('${image.dataUrl}')`;
        card.appendChild(thumbnail);
        
        // Image info
        const info = document.createElement('div');
        info.className = 'image-info';
        
        // Image name
        const nameContainer = document.createElement('div');
        nameContainer.className = 'image-name-container';
        
        const name = document.createElement('span');
        name.className = 'image-name';
        name.textContent = image.name;
        name.title = image.name;
        nameContainer.appendChild(name);
        
        info.appendChild(nameContainer);
        
        // Category badge
        if (image.category) {
            const badge = document.createElement('span');
            badge.className = `category-badge ${image.category}`;
            badge.textContent = image.category;
            info.appendChild(badge);
        }
        
        card.appendChild(info);
        
        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'image-actions';
        
        // Select/Attach button
        const selectBtn = document.createElement('button');
        selectBtn.className = 'image-action-btn select-btn';
        selectBtn.title = image.selected ? 'Deselect' : 'Select/Attach';
        selectBtn.innerHTML = image.selected ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-paperclip"></i>';
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newStatus = toggleImageSelection(image.id);
            selectBtn.innerHTML = newStatus ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-paperclip"></i>';
            selectBtn.title = newStatus ? 'Deselect' : 'Select/Attach';
            card.classList.toggle('selected', newStatus);
            
            // Trigger custom event to notify of selection change
            const event = new CustomEvent('image-selection-changed', { 
                detail: { imageId: image.id, selected: newStatus }
            });
            document.dispatchEvent(event);
        });
        
        // Rename button
        const renameBtn = document.createElement('button');
        renameBtn.className = 'image-action-btn rename-btn';
        renameBtn.title = 'Rename';
        renameBtn.innerHTML = '<i class="fas fa-edit"></i>';
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newName = prompt('Enter new name for image:', image.name);
            if (newName && newName.trim() !== '') {
                const updatedImage = renameImage(image.id, newName.trim());
                if (updatedImage) {
                    name.textContent = updatedImage.name;
                    name.title = updatedImage.name;
                }
            }
        });
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'image-action-btn delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${image.name}"?`)) {
                if (deleteImage(image.id)) {
                    card.classList.add('deleting');
                    setTimeout(() => {
                        card.remove();
                        
                        // Check if gallery is now empty
                        const gallery = document.querySelector('.image-grid');
                        if (gallery && gallery.children.length === 0) {
                            renderImageManager('image-manager');
                        }
                        
                        // Update previews after deleting
                        updateImagePreviews();
                        updatePreview();
                    }, 300);
                }
            }
        });
        
        actions.appendChild(selectBtn);
        actions.appendChild(renameBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
        
        // Make the whole card clickable for selection
        card.addEventListener('click', () => {
            selectBtn.click();
        });
        
        return card;
    }

    /**
     * Update all Image Preview sections with local images
     */
    function updateImagePreviews() {
        // Update GPT images
        updateCategoryPreview('gpt', 'gpt-image-previews');
        
        // Update Grok images
        updateCategoryPreview('grok', 'grok-image-previews');
        
        // Update Midjourney images  
        updateCategoryPreview('midjourney', 'midjourney-image-previews');
        
        // Update markdown preview
        updatePreview();
    }

    /**
     * Helper function to update a specific category preview
     */
    function updateCategoryPreview(category, previewGridId) {
        const previewGrid = document.getElementById(previewGridId);
        if (!previewGrid) return;
        
        // Get all images for this category
        const categoryImages = getImages(category);
        
        // Clear existing preview grid of local images
        Array.from(previewGrid.querySelectorAll('[data-local="true"]')).forEach(el => el.remove());
        
        // Add new local images to preview grid
        categoryImages.forEach(image => {
            // Skip if this image is already in the grid
            if (previewGrid.querySelector(`[data-id="${image.id}"]`)) return;
            
            const img = document.createElement('img');
            img.src = image.dataUrl;
            img.alt = `${category} image: ${image.name}`;
            img.title = image.name;
            img.dataset.id = image.id;
            img.dataset.local = 'true';
            
            // Add lightbox effect on click
            img.addEventListener('click', () => {
                openImageLightbox(image.dataUrl, image.name);
            });
            
            previewGrid.appendChild(img);
        });
    }

    /**
     * Initialize image manager with event listeners
     */
    function initImageManager() {
        // Setup upload button
        const uploadBtn = document.getElementById('upload-images-btn');
        const fileInput = document.getElementById('image-file-input');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    const uploadStatus = document.getElementById('upload-status');
                    
                    if (uploadStatus) {
                        uploadStatus.textContent = `Uploading ${e.target.files.length} file(s)...`;
                        uploadStatus.className = 'status-message';
                    }
                    
                    let successCount = 0;
                    
                    for (const file of e.target.files) {
                        try {
                            // Try to guess category from the upload context
                            const activeCategoryTab = document.querySelector('.image-category-tabs .tab-btn.active');
                            const category = activeCategoryTab && activeCategoryTab.dataset.category !== 'all' ? 
                                            activeCategoryTab.dataset.category : '';
                            
                            await addImage(file, category);
                            successCount++;
                        } catch (error) {
                            console.error('Error adding image:', error);
                        }
                    }
                    
                    if (uploadStatus) {
                        if (successCount > 0) {
                            uploadStatus.textContent = `Successfully added ${successCount} image(s).`;
                            uploadStatus.className = 'status-message success';
                        } else {
                            uploadStatus.textContent = 'Failed to add images. Make sure they are valid image files.';
                            uploadStatus.className = 'status-message error';
                        }
                        
                        // Clear after a few seconds
                        setTimeout(() => {
                            uploadStatus.textContent = '';
                            uploadStatus.className = 'status-message';
                        }, 5000);
                    }
                    
                    // Clear the file input
                    fileInput.value = '';
                    
                    // Refresh the image manager display
                    renderImageManager('image-manager');
                }
            });
        }
        
        // Setup category tabs
        const categoryTabs = document.querySelectorAll('.image-category-tabs .tab-btn');
        
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Re-render the image manager
                renderImageManager('image-manager');
            });
        });
        
        // Setup clear all button
        const clearAllBtn = document.getElementById('clear-all-images-btn');
        
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all images? This cannot be undone.')) {
                    clearAllImages();
                    renderImageManager('image-manager');
                    updateImagePreviews();
                }
            });
        }
        
        // Setup model attachment buttons
        const attachToGptBtn = document.getElementById('attach-to-gpt-btn');
        const attachToGrokBtn = document.getElementById('attach-to-grok-btn');
        const attachToMidjourneyBtn = document.getElementById('attach-to-midjourney-btn');
        
        const attachToCategory = (category) => {
            const selectedImages = imageStore.images.filter(img => img.selected);
            
            if (selectedImages.length === 0) {
                alert('No images selected. Please select at least one image to attach.');
                return;
            }
            
            // Set the category for all selected images
            selectedImages.forEach(img => {
                setImageCategory(img.id, category);
            });
            
            // Re-render the image manager
            renderImageManager('image-manager');
            
            // Update the preview grids
            updateImagePreviews();
        };
        
        if (attachToGptBtn) {
            attachToGptBtn.addEventListener('click', () => attachToCategory('gpt'));
        }
        
        if (attachToGrokBtn) {
            attachToGrokBtn.addEventListener('click', () => attachToCategory('grok'));
        }
        
        if (attachToMidjourneyBtn) {
            attachToMidjourneyBtn.addEventListener('click', () => attachToCategory('midjourney'));
        }
        
        // Initial render
        renderImageManager('image-manager');
    }

    // --- PROMPT VISUAL SUGGESTIONS FUNCTIONS ---

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
        const suggestions = analyzeTextForVisuals(promptText);
        
        // Create and add badges
        suggestions.forEach(suggestion => {
            const badge = createVisualBadge(suggestion);
            badgesContainer.appendChild(badge);
        });
    }

    // --- PROMPT CREATOR FUNCTIONS ---

    /**
     * Randomly selects an item from an array
     */
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Fills template placeholders with random appropriate values
     */
    function fillTemplate(template) {
        let filledTemplate = template;
        
        // Find all placeholders in the format {placeholder_name}
        const placeholders = template.match(/{([^}]+)}/g) || [];
        
        // Replace each placeholder with a random value from corresponding category
        placeholders.forEach(placeholder => {
            const key = placeholder.replace(/{|}/g, ''); // Remove { and }
            if (replacements[key]) {
                filledTemplate = filledTemplate.replace(placeholder, getRandomItem(replacements[key]));
            }
        });
        
        return filledTemplate;
    }

    /**
     * Generates creative prompts with an underlying "Save the Planet" theme
     */
    function generatePrompts(count = 2) {
        const prompts = [];
        const usedCategories = new Set(); // Track used categories to ensure variety
        
        // Helper function to get a random category
        const getRandomCategory = () => {
            const categories = Object.keys(promptTemplates);
            // Get unused category first if possible
            const unusedCategories = categories.filter(cat => !usedCategories.has(cat));
            if (unusedCategories.length > 0) {
                const category = getRandomItem(unusedCategories);
                usedCategories.add(category);
                return category;
            }
            // If all categories used, clear and start over
            usedCategories.clear();
            const category = getRandomItem(categories);
            usedCategories.add(category);
            return category;
        };
        
        // Generate the requested number of prompts
        for (let i = 0; i < count; i++) {
            const category = getRandomCategory();
            const template = getRandomItem(promptTemplates[category]);
            const prompt = fillTemplate(template);
            prompts.push({
                text: prompt,
                category: category
            });
        }
        
        return prompts;
    }

    /**
     * Apply typing animation to text elements
     */
    function applyTypingAnimation(element, delay = 0) {
        setTimeout(() => {
            element.classList.add('typing-animation');
        }, delay);
    }

    // --- Initialize Prompt Creator ---
    function initPromptCreator() {
        const generateBtn = document.getElementById('generate-prompt-btn');
        const promptsContainer = document.getElementById('generated-prompts');
        
        if (generateBtn && promptsContainer) {
            generateBtn.addEventListener('click', () => {
                const prompts = generatePrompts(2);
                
                // Clear previous prompts
                promptsContainer.innerHTML = '';
                
                // Add new prompts with animation and visual suggestions
                prompts.forEach((prompt, index) => {
                    const promptEl = document.createElement('div');
                    promptEl.className = 'generated-prompt';
                    promptEl.dataset.index = index;
                    promptEl.dataset.category = prompt.category;
                    
                    // Create prompt text element
                    const promptText = document.createElement('p');
                    promptText.className = 'prompt-text';
                    promptText.textContent = prompt.text;
                    
                    // Create copy button
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'btn btn-secondary btn-small';
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Use';
                    copyBtn.title = 'Copy to main prompt field';
                    copyBtn.addEventListener('click', () => {
                        // Copy to main prompt field if it exists
                        const mainPromptField = document.getElementById('prompt');
                        if (mainPromptField) {
                            mainPromptField.value = prompt.text;
                            mainPromptField.dispatchEvent(new Event('input')); // Trigger input event
                            
                            // Visual feedback
                            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                            setTimeout(() => {
                                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Use';
                            }, 2000);
                        }
                    });
                    
                    // Append elements to prompt
                    promptEl.appendChild(promptText);
                    promptEl.appendChild(copyBtn);
                    promptsContainer.appendChild(promptEl);
                    
                    // Add visual suggestions badges
                    addVisualSuggestionsToBadges(promptEl, prompt.text);
                    
                    // Apply animation
                    promptEl.style.animationDelay = `${index * 0.2}s`;
                    applyTypingAnimation(promptText, 500 + index * 300);
                });
            });
        }
    }

    // --- MAIN INIT FUNCTION ---
    function initApp() {
        // Init theme
        loadSavedTheme();
        
        // Init image manager
        initImageManager();
        
        // Init prompt creator
        initPromptCreator();
        
        // Fetch folders
        fetchAndPopulateFolders();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial preview
        updatePreview();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Load data when folder name input value changes
        if (folderNameInput) {
            folderNameInput.addEventListener('change', () => {
                currentFolderName = folderNameInput.value.trim();
                // Clear previous image previews immediately
                if (gptImagePreviewsGrid) gptImagePreviewsGrid.innerHTML = '';
                if (grokImagePreviewsGrid) grokImagePreviewsGrid.innerHTML = '';
                if (midjourneyImagePreviewsGrid) midjourneyImagePreviewsGrid.innerHTML = '';

                if (currentFolderName) {
                    if (parseFolderMetadata(currentFolderName)) {
                        loadPrompt(currentFolderName);
                        // Load images for each model type into their respective grids
                        if (gptImagePreviewsGrid) loadModelImages(currentFolderName, 'gpt', gptImagePreviewsGrid);
                        if (grokImagePreviewsGrid) loadModelImages(currentFolderName, 'grok', grokImagePreviewsGrid);
                        if (midjourneyImagePreviewsGrid) loadModelImages(currentFolderName, 'midjourney', midjourneyImagePreviewsGrid);
                    } else {
                        // Clear potentially loaded data if date parsing failed
                        if (promptInput) {
                            promptInput.value = '';
                            promptInput.placeholder = 'Waiting for Prompt.txt...';
                        }
                        if (promptStatusDiv) promptStatusDiv.textContent = '';
                    }
                } else {
                    // Clear fields if folder name is empty
                    if (dateInput) dateInput.value = '';
                    if (folderLinkInput) folderLinkInput.value = '';
                    currentFormattedDate = '';
                    if (promptInput) {
                        promptInput.value = '';
                        promptInput.placeholder = 'Waiting for Prompt.txt...';
                    }
                    if (promptStatusDiv) promptStatusDiv.textContent = '';
                    if (folderStatusDiv) folderStatusDiv.textContent = '';
                }
                updatePreview(); 
            });
        }

        // Update preview on input for text fields
        if (promptInput) promptInput.addEventListener('input', updatePreview);
        if (gpt4RealizationInput) gpt4RealizationInput.addEventListener('input', updatePreview);
        if (grokRealizationInput) grokRealizationInput.addEventListener('input', updatePreview);
        if (midjourneyPromptInput) midjourneyPromptInput.addEventListener('input', updatePreview);
        if (commentInput) commentInput.addEventListener('input', updatePreview);

        // Action buttons
        if (copyMarkdownButton) {
            copyMarkdownButton.addEventListener('click', (e) => {
                copyToClipboard(markdownRaw.textContent, e.currentTarget);
            });
        }

        if (sendDiscordButton) {
            sendDiscordButton.addEventListener('click', (e) => {
                copyToClipboard(markdownRaw.textContent, e.currentTarget);
            });
        }

        if (sendTelegramButton) {
            sendTelegramButton.addEventListener('click', (e) => {
                copyToClipboard(markdownRaw.textContent, e.currentTarget);
            });
        }

        if (sendToDiscordWebhook) {
            sendToDiscordWebhook.addEventListener('click', () => {
                const markdown = markdownRaw.textContent;

               const payload = {
                content: `📂 **${currentFolderName}** – FoT Daily Broadcast`,
                embeds: [
                  {
                   title: "🧠 Grok Output",
                  image: {
                  url: `${baseMediaPath}${currentFolderName}/grok.jpg`
               },
              footer: {
               text: `From folder: ${currentFolderName}`
              }
            }
         ]
      };


                fetch('https://discord.com/api/webhooks/1358806590278336563/_8iIu-FjgMiW3pJkeZNwuBOkglmkmU2cUn0zS5KqT4AlLnca9g0kV8ZjQx7x2H-FkJtN', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(response => {
                    if (response.ok) {
                        alert('Markdown post sent to Discord!');
                    } else {
                        alert('Failed to send to Discord. Check your webhook or formatting.');
                    }
                });
            });
        }

        // Export metadata button
        if (exportMetadataButton) {
            exportMetadataButton.addEventListener('click', exportMetadataJson);
        }

        // Easter egg animation
        const logoSatellite = document.querySelector('.logo-satellite');
        if (logoSatellite) {
            logoSatellite.addEventListener('click', () => {
                const easterEggMessages = [
                    "Broadcasting from orbit!",
                    "Signal strong and clear!",
                    "To infinity and beyond!",
                    "Exploring the AI universe!",
                    "Finding patterns in chaos!",
                    "Observing from above!",
                    "E.T. phone home!"
                ];
                
                const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
                
                const easterEgg = document.createElement('div');
                easterEgg.textContent = randomMessage;
                easterEgg.style.position = 'fixed';
                easterEgg.style.top = '50%';
                easterEgg.style.left = '50%';
                easterEgg.style.transform = 'translate(-50%, -50%)';
                easterEgg.style.padding = '20px';
                easterEgg.style.backgroundColor = 'var(--accent-color)';
                easterEgg.style.color = 'white';
                easterEgg.style.borderRadius = 'var(--border-radius)';
                easterEgg.style.boxShadow = 'var(--box-shadow)';
                easterEgg.style.zIndex = '1000';
                easterEgg.style.opacity = '0';
                easterEgg.style.transition = 'opacity 0.3s ease';
                
                document.body.appendChild(easterEgg);
                
                // Animate
                setTimeout(() => { easterEgg.style.opacity = '1'; }, 10);
                setTimeout(() => { 
                    easterEgg.style.opacity = '0'; 
                    setTimeout(() => { document.body.removeChild(easterEgg); }, 300);
                }, 3000);
            });
        }
    }

    // Initialize the app
    initApp();
});
