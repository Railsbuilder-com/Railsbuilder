class CreateWebsites < ActiveRecord::Migration[7.0]
  def change
    create_table :websites do |t|
      t.string :name, null: false
      t.string :domain, null: false
      t.text :description
      t.boolean :published, default: false
      t.json :settings, default: {}

      t.timestamps
    end

    add_index :websites, :domain, unique: true
  end
end
