class PublicSitesController < ApplicationController
  layout "public"

  def show
    @website = Website.find_by!(domain: params[:domain], published: true)
    @page = @website.pages.find_by!(slug: "index", published: true)
    @components = @page.page_components.includes(:component).order(:position)
  rescue ActiveRecord::RecordNotFound
    render file: "#{Rails.root}/public/404.html", status: :not_found
  end

  def page
    @website = Website.find_by!(domain: params[:domain], published: true)
    @page = @website.pages.find_by!(slug: params[:slug], published: true)
    @components = @page.page_components.includes(:component).order(:position)
  rescue ActiveRecord::RecordNotFound
    render file: "#{Rails.root}/public/404.html", status: :not_found
  end
end
