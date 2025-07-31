class CreateComponents < ActiveRecord::Migration[7.0]
  def change
    create_table :components do |t|
      t.string :name, null: false
      t.string :component_type, null: false
      t.text :description
      t.json :default_content, default: {}
      t.json :default_styles, default: {}
      t.boolean :active, default: true
      
      t.timestamps
    end
    
    add_index :components, :component_type
  end
end
