class Website < ApplicationRecord
  has_many :pages, dependent: :destroy
  has_many :components, through: :pages   # behold associationen!

  validates :name,    presence: true
  validates :domain,  presence: true, uniqueness: true

  # Parsede data med sikkerhed
  def components_payload
    components_data || {}                 # kommer nu som Hash pga. jsonb
  end

  # Array til view’et
  def stored_components
    components_payload["components"] || []
  end
end
