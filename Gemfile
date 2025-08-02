source "https://rubygems.org"

ruby "3.3.0"

# Core
gem "bootsnap", require: false
gem "cssbundling-rails"
gem "image_processing"
gem "importmap-rails"
gem "jbuilder"
gem "kamal", require: false
gem "pg"
gem "propshaft"
gem "puma", ">= 5.0"
gem "rails", "~> 8.0.2"
gem "redis"
gem "solid_cache"
gem "solid_cable"
gem "solid_queue"
gem "stimulus-rails"
gem "thruster", require: false
gem "turbo-rails"

# Platform-specifik
gem "tzinfo-data", platforms: %i[windows jruby]

# Development & Test
group :development, :test do
  gem "brakeman", require: false
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "rubocop-rails-omakase", require: false
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
