class CreatePageComponents < ActiveRecord::Migration[7.0]
  def change
    create_table :page_components do |t|
      t.references :page, null: false, foreign_key: true
      t.references :component, null: false, foreign_key: true
      t.integer :position, null: false, default: 0
      t.json :content, default: {}
      t.json :styles, default: {}
      t.boolean :visible, default: true

      t.timestamps
    end

    add_index :page_components, [ :page_id, :position ]
  end
end
