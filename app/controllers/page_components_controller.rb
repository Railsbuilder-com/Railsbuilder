class PageComponentsController < ApplicationController
  before_action :set_website_and_page
  
  def create
    @component = Component.find(params[:component_id])
    @page_component = @page.page_components.build(
      component: @component,
      position: next_position,
      content: default_content_for(@component.component_type),
      styles: default_styles
    )
    
    if @page_component.save
      render json: { 
        success: true, 
        html: render_component_html(@page_component),
        id: @page_component.id 
      }
    else
      render json: { success: false, errors: @page_component.errors }
    end
  end
  
  def update
    @page_component = @page.page_components.find(params[:id])
    
    if @page_component.update(page_component_params)
      render json: { success: true }
    else
      render json: { success: false, errors: @page_component.errors }
    end
  end
  
  def destroy
    @page_component = @page.page_components.find(params[:id])
    @page_component.destroy
    
    render json: { success: true }
  end
  
  def reorder
    params[:positions].each do |id, position|
      @page.page_components.find(id).update(position: position)
    end
    
    render json: { success: true }
  end
  
  private
  
  def set_website_and_page
    @website = Website.find(params[:website_id])
    @page = @website.pages.find(params[:page_id])
  end
  
  def next_position
    (@page.page_components.maximum(:position) || 0) + 1
  end
  
  def default_content_for(component_type)
    case component_type
    when 'text'
      { text: 'Klik for at redigere tekst' }
    when 'image'
      { src: '/placeholder-image.jpg', alt: 'Billede' }
    when 'button'
      { text: 'Klik her', link: '#' }
    when 'header'
      { title: 'Overskrift', subtitle: 'Undertekst' }
    else
      {}
    end
  end
  
  def default_styles
    {
      margin: '10px 0',
      padding: '10px',
      backgroundColor: 'transparent'
    }
  end
  
  def render_component_html(page_component)
    render_to_string(
      partial: 'page_components/component',
      locals: { page_component: page_component }
    )
  end
  
  def page_component_params
    params.require(:page_component).permit(:position, content: {}, styles: {})
  end
end
