class Component < ApplicationRecord
  has_many :page_components, dependent: :destroy
  has_many :pages, through: :page_components

  validates :name, presence: true
  validates :component_type, presence: true

  COMPONENT_TYPES = %w[text image button header footer].freeze

  validates :component_type, inclusion: { in: COMPONENT_TYPES }
end
