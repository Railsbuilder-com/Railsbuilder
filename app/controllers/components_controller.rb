class ComponentsController < ApplicationController
  def index
    @components = Component.all.group_by(&:component_type)
  end

  def show
    @component = Component.find(params[:id])
    render json: @component
  end
end
