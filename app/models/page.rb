class Page < ApplicationRecord
  belongs_to :website
  has_many :page_components, -> { order(:position) }, dependent: :destroy
  has_many :components, through: :page_components
  
  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :website_id }
  
  before_validation :generate_slug
  
  private
  
  def generate_slug
    self.slug = name.parameterize if name.present?
  end
end
