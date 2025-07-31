class PageComponent < ApplicationRecord
  belongs_to :page
  belongs_to :component

  validates :position, presence: true, uniqueness: { scope: :page_id }

  # Gem content og styling i JSON format
  serialize :content, JSON
  serialize :styles, JSON
end
