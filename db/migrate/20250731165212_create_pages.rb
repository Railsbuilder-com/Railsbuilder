class CreatePages < ActiveRecord::Migration[7.0]
  def change
    create_table :pages do |t|
      t.references :website, null: false, foreign_key: true
      t.string :name, null: false
      t.string :slug, null: false
      t.string :title
      t.text :meta_description
      t.boolean :published, default: false
      t.json :seo_settings, default: {}

      t.timestamps
    end

    add_index :pages, [ :website_id, :slug ], unique: true
  end
end
