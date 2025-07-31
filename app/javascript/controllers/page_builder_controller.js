// app/javascript/controllers/page_builder_controller.js
import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["canvas", "componentLibrary", "settingsPanel", "settingsContent"]
  
  connect() {
    this.initializeDragAndDrop()
    this.initializeSortable()
    this.bindEvents()
  }
  
  initializeDragAndDrop() {
    // Gør komponenter i biblioteket draggable
    this.componentLibraryTarget.querySelectorAll('.component-item').forEach(item => {
      item.draggable = true
      
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
          componentType: item.dataset.componentType,
          componentId: item.dataset.componentId
        }))
      })
    })
    
    // Gør canvas til en drop zone
    this.canvasTarget.addEventListener('dragover', (e) => {
      e.preventDefault()
      this.canvasTarget.classList.add('drag-over')
    })
    
    this.canvasTarget.addEventListener('dragleave', (e) => {
      if (!this.canvasTarget.contains(e.relatedTarget)) {
        this.canvasTarget.classList.remove('drag-over')
      }
    })
    
    this.canvasTarget.addEventListener('drop', (e) => {
      e.preventDefault()
      this.canvasTarget.classList.remove('drag-over')
      
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      this.addComponent(data.componentId)
    })
  }
  
  initializeSortable() {
    // Gør eksisterende komponenter sortable
    new Sortable(this.canvasTarget, {
      animation: 150,
      handle: '.page-component',
      onEnd: (evt) => {
        this.updateComponentPositions()
      }
    })
  }
  
  bindEvents() {
    // Bind edit og delete knapper
    this.canvasTarget.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-component')) {
        e.preventDefault()
        const componentEl = e.target.closest('.page-component')
        this.editComponent(componentEl)
      }
      
      if (e.target.classList.contains('delete-component')) {
        e.preventDefault()
        const componentEl = e.target.closest('.page-component')
        this.deleteComponent(componentEl)
      }
    })
  }
  
  async addComponent(componentId) {
    const websiteId = this.canvasTarget.dataset.websiteId
    const pageId = this.canvasTarget.dataset.pageId
    
    try {
      const response = await fetch(`/websites/${websiteId}/pages/${pageId}/page_components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          component_id: componentId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Tilføj den nye komponent til canvas
        const dropZone = this.canvasTarget.querySelector('#drop-zone')
        dropZone.insertAdjacentHTML('beforebegin', data.html)
      } else {
        alert('Fejl ved tilføjelse af komponent')
      }
    } catch (error) {
      console.error('Error adding component:', error)
      alert('Der opstod en fejl')
    }
  }
  
  editComponent(componentEl) {
    const componentId = componentEl.dataset.componentId
    
    // Vis indstillinger panel
    this.settingsPanelTarget.classList.remove('hidden')
    
    // Indlæs komponent data og vis redigeringsform
    this.loadComponentSettings(componentId)
  }
  
  async loadComponentSettings(componentId) {
    // Her kan du indlæse komponentens nuværende indstillinger
    // og vise en form til redigering
    
    const settingsForm = `
      <form id="component-settings-form" data-component-id="${componentId}">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Tekst:</label>
          <input type="text" name="content[text]" class="w-full border rounded px-3 py-2">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Baggrundsfarve:</label>
          <input type="color" name="styles[backgroundColor]" class="w-full border rounded px-3 py-2">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Margin:</label>
          <input type="text" name="styles[margin]" placeholder="10px 0" class="w-full border rounded px-3 py-2">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Padding:</label>
          <input type="text" name="styles[padding]" placeholder="10px" class="w-full border rounded px-3 py-2">
        </div>
        
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Gem ændringer
        </button>
      </form>
    `
    
    this.settingsContentTarget.innerHTML = settingsForm
    
    // Bind form submit
    const form = document.getElementById('component-settings-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.saveComponentSettings(form)
    })
  }
  
  async saveComponentSettings(form) {
    const componentId = form.dataset.componentId
    const websiteId = this.canvasTarget.dataset.websiteId
    const pageId = this.canvasTarget.dataset.pageId
    
    const formData = new FormData(form)
    const data = {}
    
    // Konverter FormData til nested object
    for (let [key, value] of formData.entries()) {
      const keys = key.split(/[\[\]]/).filter(k => k)
      let current = data
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
    }
    
    try {
      const response = await fetch(`/websites/${websiteId}/pages/${pageId}/page_components/${componentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ page_component: data })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Genindlæs siden for at vise ændringerne
        window.location.reload()
      } else {
        alert('Fejl ved gem af ændringer')
      }
    } catch (error) {
      console.error('Error saving component:', error)
      alert('Der opstod en fejl')
    }
  }
  
  async deleteComponent(componentEl) {
    if (!confirm('Er du sikker på at du vil slette denne komponent?')) {
      return
    }
    
    const componentId = componentEl.dataset.componentId
    const websiteId = this.canvasTarget.dataset.websiteId
    const pageId = this.canvasTarget.dataset.pageId
    
    try {
      const response = await fetch(`/websites/${websiteId}/pages/${pageId}/page_components/${componentId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        componentEl.remove()
      } else {
        alert('Fejl ved sletning af komponent')
      }
    } catch (error) {
      console.error('Error deleting component:', error)
      alert('Der opstod en fejl')
    }
  }
  
  async updateComponentPositions() {
    const components = this.canvasTarget.querySelectorAll('.page-component')
    const positions = {}
    
    components.forEach((component, index) => {
      positions[component.dataset.componentId] = index + 1
    })
    
    const websiteId = this.canvasTarget.dataset.websiteId
    const pageId = this.canvasTarget.dataset.pageId
    
    try {
      await fetch(`/websites/${websiteId}/pages/${pageId}/page_components/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ positions })
      })
    } catch (error) {
      console.error('Error updating positions:', error)
    }
  }
}

// app/javascript/controllers/application.js
import { Application } from "@hotwired/stimulus"
import PageBuilderController from "./page_builder_controller"

const application = Application.start()
application.register("page-builder", PageBuilderController)

export { application }

// app/helpers/application_helper.rb (Ruby helper method)
module ApplicationHelper
  def inline_styles(styles_hash)
    return '' unless styles_hash.is_a?(Hash)
    
    styles_hash.map do |property, value|
      property = property.to_s.camelize(:lower)
      "#{property}: #{value};"
    end.join(' ')
  end
end
