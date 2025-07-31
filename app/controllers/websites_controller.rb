class WebsitesController < ApplicationController
  before_action :set_website, only: [:show, :edit, :update, :destroy]
  
  def index
    @websites = Website.all
  end
  
  def show
    @pages = @website.pages
  end
  
  def new
    @website = Website.new
  end
  
  def save
    website = Website.find(params[:id])
    
    if params[:website_data].present?
      # Gem component data som JSON string
      website.update(components_data: params[:website_data])
      
      render json: { success: true, message: "Website saved successfully!" }
    else
      render json: { success: false, error: "No data to save" }
    end
  rescue => e
    render json: { success: false, error: e.message }
  end

  def create
    @website = Website.new(website_params)
    
    if @website.save
      # Opret en default side
      @website.pages.create!(name: "Forside", slug: "index")
      redirect_to @website, notice: 'Website blev oprettet!'
    else
      render :new
    end
  end
  
  def edit
    @website    = Website.find(params[:id])
    @page       = @website.pages.first
    @components = @website.stored_components
  end  
  
  def update
    if @website.update(website_params)
      redirect_to @website, notice: 'Website blev opdateret!'
    else
      render :edit
    end
  end
  
  def destroy
    @website.destroy
    redirect_to websites_path, notice: 'Website blev slettet!'
  end
  
  private
  
  def set_website
    @website = Website.find(params[:id])
  end
  
  def website_params
    params.require(:website).permit(:name, :domain, :description)
  end
end
