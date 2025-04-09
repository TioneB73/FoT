/**
 * FoT Image Folder Manager
 * Handles in-memory image management for the FoT Broadcaster
 */

// Store images in memory during the session
const imageStore = {
  images: [],
  nextId: 1
};

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
  const tabs = container.closest('.image-manager-section').querySelector('.image-category-tabs');
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
 * Initialize the image manager with event listeners
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
  
  // Setup toggle button for the image manager section
  const toggleBtn = document.getElementById('toggle-image-manager');
  const content = document.getElementById('image-manager-content');
  
  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = content.classList.toggle('hidden');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isHidden ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
      }
    });
  }
  
  // Setup clear all button
  const clearAllBtn = document.getElementById('clear-all-images-btn');
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all images? This cannot be undone.')) {
        clearAllImages();
        renderImageManager('image-manager');
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
    
    // Trigger an event to update main markdown preview
    document.getElementById('prompt').dispatchEvent(new Event('input'));
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

// Function to update all Image Preview sections with local images
function updateImagePreviews() {
  // Update GPT images
  updateCategoryPreview('gpt', 'gpt-image-previews');
  
  // Update Grok images
  updateCategoryPreview('grok', 'grok-image-previews');
  
  // Update Midjourney images  
  updateCategoryPreview('midjourney', 'midjourney-image-previews');
}

// Helper function to update a specific category preview
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
      if (typeof openImageLightbox === 'function') {
        openImageLightbox(image.dataUrl, image.name);
      }
    });
    
    previewGrid.appendChild(img);
  });
}

// Export functions
export {
  addImage,
  deleteImage,
  renameImage,
  getImages,
  clearAllImages,
  toggleImageSelection,
  setImageCategory,
  initImageManager,
  updateImagePreviews
};