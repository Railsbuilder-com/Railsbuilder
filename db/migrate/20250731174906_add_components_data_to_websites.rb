class AddComponentsDataToWebsites < ActiveRecord::Migration[7.0]
  def change
    add_column :websites, :components_data, :json, default: {}
  end
end
