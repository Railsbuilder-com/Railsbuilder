(() => {
  'use strict';
  
  // State Management
  const state = {
    isPreviewMode: false,
    componentsData: [],
    isDragging: false
  };
  
  // DOM Elements Cache
  const elements = {
    pageCanvas: null,
    pageContent: null,
    dropZone: null,
    previewBtn: null,
    saveBtn: null,
    saveForm: null,
    componentTemplates: null
  };
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    // Cache DOM elements
    cacheElements();
    
    // Initialize existing components
    initializeExistingComponents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup drag and drop
    setupDragAndDrop();
    
    console.log('✅ Website builder initialized');
  }
  
  function cacheElements() {
    elements.pageCanvas = document.getElementById('page-canvas');
    elements.pageContent = document.getElementById('page-content');
    elements.dropZone = document.getElementById('drop-zone');
    elements.previewBtn = document.getElementById('preview-btn');
    elements.saveBtn = document.getElementById('save-btn');
    elements.saveForm = document.getElementById('save-form');
    elements.componentTemplates = document.getElementById('component-templates');
  }
  
  function setupEventListeners() {
    // Preview toggle
    elements.previewBtn?.addEventListener('click', togglePreview);
    
    // Save form
    elements.saveForm?.addEventListener('submit', handleSave);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Component clicks for focus
    document.addEventListener('click', handleComponentClick);
  }
  
  function setupDragAndDrop() {
    // Component items
    document.querySelectorAll('.component-item').forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });
    
    // Canvas drop events
    elements.pageCanvas?.addEventListener('dragover', handleDragOver);
    elements.pageCanvas?.addEventListener('dragleave', handleDragLeave);
    elements.pageCanvas?.addEventListener('drop', handleDrop);
  }
  
  function handleDragStart(e) {
    state.isDragging = true;
    e.dataTransfer.setData('text/plain', this.dataset.componentType);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    this.style.opacity = '0.5';
  }
  
  function handleDragEnd(e) {
    state.isDragging = false;
    this.style.opacity = '';
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    if (!this.classList.contains('drag-over')) {
      this.classList.add('drag-over');
      this.style.borderColor = '#3b82f6';
      this.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
    }
  }
  
  function handleDragLeave(e) {
    if (!this.contains(e.relatedTarget)) {
      this.classList.remove('drag-over');
      this.style.borderColor = '';
      this.style.backgroundColor = '';
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    
    // Remove drag styling
    this.classList.remove('drag-over');
    this.style.borderColor = '';
    this.style.backgroundColor = '';
    
    const componentType = e.dataTransfer.getData('text/plain');
    if (componentType) {
      addComponent(componentType);
      hideDropZone();
      
      // Show success feedback
      showToast('Component added successfully!', 'success');
    }
  }
  
  function addComponent(type) {
    const template = elements.componentTemplates?.querySelector(`[data-type="${type}"]`);
    if (!template) return;
    
    const clone = template.cloneNode(true);
    const componentId = generateId();
    
    // Configure component
    clone.setAttribute('data-component-id', componentId);
    clone.classList.add('group', 'relative', 'border-2', 'border-transparent', 'hover:border-blue-200', 'transition-all', 'duration-200', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
    clone.setAttribute('tabindex', '0');
    
    // Store component data
    const componentData = {
      id: componentId,
      type: type,
      content: getDefaultContent(type),
      order: state.componentsData.length
    };
    state.componentsData.push(componentData);
    
    // Setup controls
    setupComponentControls(clone, type, componentId);
    
    // Add to page
    if (elements.dropZone && !elements.dropZone.classList.contains('hidden')) {
      elements.pageContent.insertBefore(clone, elements.dropZone);
    } else {
      elements.pageContent.appendChild(clone);
    }
    
    // Focus new component
    setTimeout(() => clone.focus(), 100);
  }
  
  function setupComponentControls(component, type, componentId) {
    const editBtn = component.querySelector('.edit-btn');
    const deleteBtn = component.querySelector('.delete-btn');
    
    editBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      editComponent(component, type, componentId);
    });
    
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteComponent(component, componentId);
    });
  }
  
  function editComponent(component, type, componentId) {
    switch(type) {
      case 'header':
        editHeader(component, componentId);
        break;
      case 'paragraph':
        editParagraph(component, componentId);
        break;
      case 'image':
        editImage(component, componentId);
        break;
      case 'video':
        editVideo(component, componentId);
        break;
    }
  }
  
  function editHeader(component, componentId) {
    const heading = component.querySelector('h1');
    const currentText = heading.textContent;
    
    const modal = createEditModal('Edit Heading', currentText, (newText) => {
      if (newText.trim()) {
        heading.textContent = newText.trim();
        updateComponentData(componentId, 'content', newText.trim());
        showToast('Heading updated!', 'success');
      }
    });
    
    document.body.appendChild(modal);
  }
  
  function editParagraph(component, componentId) {
    const paragraph = component.querySelector('p');
    const currentText = paragraph.textContent;
    
    const modal = createEditModal('Edit Text', currentText, (newText) => {
      if (newText.trim()) {
        paragraph.textContent = newText.trim();
        updateComponentData(componentId, 'content', newText.trim());
        showToast('Text updated!', 'success');
      }
    }, true); // multiline
    
    document.body.appendChild(modal);
  }
  
  function editImage(component, componentId) {
    const modal = createImageModal((imageUrl) => {
      if (imageUrl.trim()) {
        const container = component.querySelector('.p-6 > div');
        container.innerHTML = `<img src="${imageUrl.trim()}" alt="Uploaded image" class="w-full h-auto rounded-xl shadow-lg">`;
        updateComponentData(componentId, 'content', imageUrl.trim());
        showToast('Image updated!', 'success');
      }
    });
    
    document.body.appendChild(modal);
  }
  
  function editVideo(component, componentId) {
    const modal = createVideoModal((videoUrl) => {
      if (videoUrl.trim()) {
        const container = component.querySelector('.p-6 > div');
        const embedHtml = generateVideoEmbed(videoUrl.trim());
        container.innerHTML = embedHtml;
        updateComponentData(componentId, 'content', videoUrl.trim());
        showToast('Video updated!', 'success');
      }
    });
    
    document.body.appendChild(modal);
  }
  
  function createEditModal(title, currentValue, onSave, multiline = false) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    const inputType = multiline ? 'textarea' : 'input';
    const inputClass = multiline ? 'w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none' : 'w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    const inputAttrs = multiline ? 'rows="4"' : 'type="text"';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <h3 class="text-xl font-bold text-slate-800 mb-4">${title}</h3>
        <${inputType} ${inputAttrs} class="${inputClass}" value="${currentValue}" placeholder="Enter ${title.toLowerCase()}...">${multiline ? currentValue : ''}</${inputType}>
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button class="cancel-btn px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
          <button class="save-btn px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Save</button>
        </div>
      </div>
    `;
    
    const input = modal.querySelector(inputType);
    const saveBtn = modal.querySelector('.save-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    // Focus input
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
    
    // Event listeners
    saveBtn.addEventListener('click', () => {
      onSave(input.value);
      modal.remove();
    });
    
    cancelBtn.addEventListener('click', () => modal.remove());
    
    // ESC to close
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
      if (e.key === 'Enter' && !multiline) {
        onSave(input.value);
        modal.remove();
      }
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  function createImageModal(onSave) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-slate-800 mb-4">Add Image</h3>
        <input type="url" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter image URL...">
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button class="cancel-btn px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
          <button class="save-btn px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Add Image</button>
        </div>
      </div>
    `;
    
    const input = modal.querySelector('input');
    const saveBtn = modal.querySelector('.save-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    setTimeout(() => input.focus(), 100);
    
    saveBtn.addEventListener('click', () => {
      onSave(input.value);
      modal.remove();
    });
    
    cancelBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
      if (e.key === 'Enter') {
        onSave(input.value);
        modal.remove();
      }
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  function createVideoModal(onSave) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-slate-800 mb-4">Add Video</h3>
        <input type="url" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter YouTube, Vimeo, or video URL...">
        <p class="text-sm text-slate-600 mt-2">Supports YouTube, Vimeo, and direct video files</p>
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button class="cancel-btn px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
          <button class="save-btn px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Add Video</button>
        </div>
      </div>
    `;
    
    const input = modal.querySelector('input');
    const saveBtn = modal.querySelector('.save-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    setTimeout(() => input.focus(), 100);
    
    saveBtn.addEventListener('click', () => {
      onSave(input.value);
      modal.remove();
    });
    
    cancelBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
      if (e.key === 'Enter') {
        onSave(input.value);
        modal.remove();
      }
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  function generateVideoEmbed(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-xl"></iframe>`;
    } else if (url.includes('vimeo.com')) {
      const videoId = extractVimeoId(url);
      return `<iframe width="100%" height="315" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen class="rounded-xl"></iframe>`;
    } else {
      return `<video width="100%" height="315" controls class="rounded-xl"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
  }
  
  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  function extractVimeoId(url) {
    const regExp = /vimeo.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
  
  function deleteComponent(component, componentId) {
    const modal = createConfirmModal(
      'Delete Component',
      'Are you sure you want to delete this component? This action cannot be undone.',
      () => {
        removeComponentData(componentId);
        component.remove();
        checkDropZoneVisibility();
        showToast('Component deleted', 'success');
      }
    );
    
    document.body.appendChild(modal);
  }
  
  function createConfirmModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800">${title}</h3>
        </div>
        <p class="text-slate-600 mb-6">${message}</p>
        <div class="flex items-center justify-end space-x-3">
          <button class="cancel-btn px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
          <button class="confirm-btn px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    `;
    
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    confirmBtn.addEventListener('click', () => {
      onConfirm();
      modal.remove();
    });
    
    cancelBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  function initializeExistingComponents() {
    const existingComponents = document.querySelectorAll('.page-component[data-component-id]');
    
    existingComponents.forEach((component, index) => {
      const componentId = component.dataset.componentId;
      const componentType = component.dataset.type;
      const content = getComponentContent(component, componentType);
      
      // Add to state
      state.componentsData.push({
        id: componentId,
        type: componentType,
        content: content,
        order: index
      });
      
      // Setup controls
      setupComponentControls(component, componentType, componentId);
      
      // Make focusable
      component.setAttribute('tabindex', '0');
    });
    
    // Hide drop zone if we have components
    if (state.componentsData.length > 0) {
      hideDropZone();
    }
  }
  
  function getComponentContent(component, type) {
    switch(type) {
      case 'header':
        const heading = component.querySelector('h1');
        return heading ? heading.textContent : 'Your Heading Here';
      case 'paragraph':
        const paragraph = component.querySelector('p');
        return paragraph ? paragraph.textContent : 'This is example text.';
      case 'image':
        const img = component.querySelector('img');
        return img ? img.src : '';
      case 'video':
        const iframe = component.querySelector('iframe');
        const video = component.querySelector('video source');
        if (iframe && iframe.src.includes('youtube')) {
          const videoId = iframe.src.split('/embed/')[1]?.split('?')[0];
          return `https://www.youtube.com/watch?v=${videoId}`;
        } else if (iframe && iframe.src.includes('vimeo')) {
          const videoId = iframe.src.split('/video/')[1];
          return `https://vimeo.com/${videoId}`;
        } else if (video) {
          return video.src;
        }
        return '';
      default:
        return '';
    }
  }
  
  function updateComponentData(componentId, field, value) {
    const componentIndex = state.componentsData.findIndex(comp => comp.id === componentId);
    if (componentIndex !== -1) {
      state.componentsData[componentIndex][field] = value;
    }
  }
  
  function removeComponentData(componentId) {
    state.componentsData = state.componentsData.filter(comp => comp.id !== componentId);
    // Update order for remaining components
    state.componentsData.forEach((comp, index) => {
      comp.order = index;
    });
  }
  
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  function getDefaultContent(type) {
    const defaults = {
      header: 'Your Heading Here',
      paragraph: 'This is example text. Click \'Edit\' to change it.',
      image: '',
      video: '',
      container: '',
      columns: ''
    };
    return defaults[type] || '';
  }
  
  function hideDropZone() {
    elements.dropZone?.classList.add('hidden');
  }
  
  function showDropZone() {
    elements.dropZone?.classList.remove('hidden');
  }
  
  function checkDropZoneVisibility() {
    const allComponents = document.querySelectorAll('.page-component[data-component-id]');
    if (allComponents.length === 0) {
      showDropZone();
    }
  }
  
  function togglePreview() {
    state.isPreviewMode = !state.isPreviewMode;
    document.body.classList.toggle('preview-mode', state.isPreviewMode);
    
    const btn = elements.previewBtn;
    if (state.isPreviewMode) {
      btn.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        Edit
      `;
      btn.className = 'inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5';
    } else {
      btn.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Preview
      `;
      btn.className = 'inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5';
    }
  }
  
  function handleSave(e) {
    e.preventDefault();
    saveWebsiteData();
  }
  
  function saveWebsiteData(isAutoSave = false) {
    const websiteData = {
      components: state.componentsData,
      timestamp: new Date().toISOString()
    };
    
    const btn = elements.saveBtn;
    const originalText = btn.innerHTML;
    
    if (!isAutoSave) {
      btn.innerHTML = `
        <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Saving...
      `;
      btn.disabled = true;
    }
    
    const websiteId = elements.pageCanvas?.dataset.websiteId;
    const pageId = elements.pageCanvas?.dataset.pageId;
    
    fetch('/websites/' + websiteId + '/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: websiteId,
        page_id: pageId,
        website_data: websiteData
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.success) {
        if (!isAutoSave) {
          showToast('Website saved successfully!', 'success');
          btn.innerHTML = originalText;
          btn.disabled = false;
        } else {
          showAutoSaveIndicator();
        }
      } else {
        throw new Error(data.error || 'Save failed');
      }
    })
    .catch(error => {
      console.error('Save error:', error);
      if (!isAutoSave) {
        showToast('Error saving: ' + error.message, 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }
  
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-2xl z-50 transform translate-x-full transition-all duration-300 backdrop-blur-sm border`;
    
    const colors = {
      success: 'bg-green-500/90 text-white border-green-400',
      error: 'bg-red-500/90 text-white border-red-400',
      info: 'bg-blue-500/90 text-white border-blue-400'
    };
    
    toast.className += ` ${colors[type] || colors.info}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
  
  function showAutoSaveIndicator() {
    let indicator = document.getElementById('auto-save-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'auto-save-indicator';
      indicator.className = 'fixed bottom-4 right-4 bg-slate-800/90 text-white px-4 py-2 rounded-lg text-sm opacity-0 transition-all duration-300 backdrop-blur-sm border border-slate-700';
      document.body.appendChild(indicator);
    }
    
    indicator.textContent = `Saved ${new Date().toLocaleTimeString()}`;
    indicator.classList.remove('opacity-0');
    
    setTimeout(() => {
      indicator.classList.add('opacity-0');
    }, 2000);
  }
  
  function handleKeyboardShortcuts(e) {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveWebsiteData();
    }
    
    // Ctrl+P or Cmd+P to toggle preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      togglePreview();
    }
    
    // Delete key to remove focused component
    if (e.key === 'Delete' && document.activeElement?.classList.contains('page-component')) {
      const componentId = document.activeElement.dataset.componentId;
      if (componentId) {
        deleteComponent(document.activeElement, componentId);
      }
    }
    
    // ESC to unfocus
    if (e.key === 'Escape') {
      document.activeElement?.blur();
    }
  }
  
  function handleComponentClick(e) {
    const component = e.target.closest('.page-component');
    if (component && component.dataset.componentId) {
      component.focus();
    }
  }
  
  // Auto-save every 30 seconds
  setInterval(() => {
    if (state.componentsData.length > 0) {
      saveWebsiteData(true);
    }
  }, 30000);
  
  // Add CSS for preview mode
  const style = document.createElement('style');
  style.textContent = `
    .preview-mode .component-controls { display: none !important; }
    .preview-mode .page-component { border-color: transparent !important; }
    .preview-mode .page-component:hover { border-color: transparent !important; box-shadow: none !important; }
    .preview-mode .page-component:focus { outline: none !important; box-shadow: none !important; }
    .drag-over { 
      border-color: #3b82f6 !important; 
      background-color: rgba(59, 130, 246, 0.05) !important; 
    }
    .page-component:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
  
})();
