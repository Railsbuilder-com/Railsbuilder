Rails.application.routes.draw do
  root 'websites#index'
  
  resources :websites do
    member do
      get :data   # Ny route for at hente website data
      post :save  # Din eksisterende save route
    end
    
    resources :pages do
      resources :page_components, except: [:show, :new, :edit] do
        collection do
          patch :reorder
        end
      end
    end
  end
  
  resources :components, only: [:index, :show]
  
  # API routes for AJAX calls
  namespace :api do
    namespace :v1 do
      resources :components, only: [:index, :show]
      resources :page_components, only: [:create, :update, :destroy]
    end
  end
  
  # Public website routes (for viewing published sites)
  # Disse skal være til sidst for at undgå konflikter
  get ':domain', to: 'public_sites#show', constraints: { domain: /[^\/]+/ }
  get ':domain/:slug', to: 'public_sites#page', constraints: { domain: /[^\/]+/, slug: /[^\/]+/ }
end
