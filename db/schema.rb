# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_31_192439) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "components", force: :cascade do |t|
    t.string "name", null: false
    t.string "component_type", null: false
    t.text "description"
    t.json "default_content", default: {}
    t.json "default_styles", default: {}
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["component_type"], name: "index_components_on_component_type"
  end

  create_table "page_components", force: :cascade do |t|
    t.bigint "page_id", null: false
    t.bigint "component_id", null: false
    t.integer "position", default: 0, null: false
    t.json "content", default: {}
    t.json "styles", default: {}
    t.boolean "visible", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["component_id"], name: "index_page_components_on_component_id"
    t.index ["page_id", "position"], name: "index_page_components_on_page_id_and_position"
    t.index ["page_id"], name: "index_page_components_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.bigint "website_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.string "title"
    t.text "meta_description"
    t.boolean "published", default: false
    t.json "seo_settings", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["website_id", "slug"], name: "index_pages_on_website_id_and_slug", unique: true
    t.index ["website_id"], name: "index_pages_on_website_id"
  end

  create_table "websites", force: :cascade do |t|
    t.string "name", null: false
    t.string "domain", null: false
    t.text "description"
    t.boolean "published", default: false
    t.json "settings", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "components_data", default: {}
    t.index ["domain"], name: "index_websites_on_domain", unique: true
  end

  add_foreign_key "page_components", "components"
  add_foreign_key "page_components", "pages"
  add_foreign_key "pages", "websites"
end
