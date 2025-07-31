class PagesController < ApplicationController
  before_action :set_website
  before_action :set_page, only: [ :show, :edit, :update, :destroy ]

  def show
    @components = @page.page_components.includes(:component).order(:position)
  end

  def new
    @page = @website.pages.build
  end

  def create
    @page = @website.pages.build(page_params)

    if @page.save
      redirect_to [ @website, @page ], notice: "Side blev oprettet!"
    else
      render :new
    end
  end

  def edit
    @available_components = Component.all
    @page_components = @page.page_components.includes(:component).order(:position)
  end

  def update
    if @page.update(page_params)
      redirect_to [ @website, @page ], notice: "Side blev opdateret!"
    else
      render :edit
    end
  end

  def destroy
    @page.destroy
    redirect_to @website, notice: "Side blev slettet!"
  end

  private

  def set_website
    @website = Website.find(params[:website_id])
  end

  def set_page
    @page = @website.pages.find(params[:id])
  end

  def page_params
    params.require(:page).permit(:name, :title, :meta_description)
  end
end
