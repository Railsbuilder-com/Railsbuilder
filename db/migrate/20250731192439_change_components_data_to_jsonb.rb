class ChangeComponentsDataToJsonb < ActiveRecord::Migration[8.0]
  def up
    change_column :websites, :components_data, :jsonb, default: {}, using: 'components_data::jsonb'
  end
  
  def down
    change_column :websites, :components_data, :text
  end
end
