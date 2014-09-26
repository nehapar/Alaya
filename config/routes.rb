Alaya::Application.routes.draw do
  
  get "clients/new"
  
  resources :providers
  resources :sessions, only: [:new, :create, :destroy]
  resources :clients
  
  match 'show_client',  :to => 'clients#show_client', via: 'get'
  match 'edit_client',  :to => 'clients#edit', via: 'get'
  match 'csignup',  :to => 'clients#new', via: 'get'
  match 'csignin', :to => 'sessions#new', via: 'get'
  match 'csignout', :to => 'sessions#destroy', via: 'delete'

  root :to => 'web_site#index'
  match 'profile_list', :to => 'providers#profile_list', via: 'get'
  match 'profile_detail', :to => 'providers#profile_detail', via: 'get'
  match 'profile_edit', :to => 'providers#profile_edit', via: 'get'

  match 'appointments_ajax', :to => 'providers#appointments_ajax', via: 'get'
  match 'csignin_ajax', :to => 'clients#csignin_ajax', via: 'get'
  match 'csignup_ajax', :to => 'clients#csignup_ajax', via: 'get'
  match 'update_info_ajax', :to => 'clients#update_info_ajax', via: 'get'
  match 'request_appointment_ajax', :to => 'clients#request_appointment_ajax', via: 'get'
  
  match 'signup', :to => 'providers#new', via: 'get'
  match 'signin', :to => 'sessions#new', via: 'get'
  match 'signout', :to => 'sessions#destroy', via: 'delete'

  match 'provider_update_personal', :to => 'providers#update_personal', via: 'post'
  match 'provider_update_password', :to => 'providers#update_password', via: 'post'
  match 'provider_update_about', :to => 'providers#update_about', via: 'post'
  match 'provider_update_specialities', :to => 'providers#update_specialities', via: 'post'
  match 'provider_update_policies', :to => 'providers#update_policies', via: 'post'

  # static pages working
  match 'profile_list_static', :to => 'web_site#profile_list', via: 'get'
  match 'kashika_jackson', :to => 'web_site#kashika_jackson', via: 'get'

  match 'partners', :to => 'web_site#partners', via: 'get'
  match 'about', :to => 'web_site#about', via: 'get'
  match 'contact', :to => 'web_site#contact', via: 'get'
  match 'faq', :to => 'web_site#faq', via: 'get'

  match 'signup', :to => 'providers#new', via: 'get'

  get "web_site/index"
  get "web_site/profile_list"
  get "web_site/profile_detail"
  get "web_site/partners"
  get "web_site/about"
  get "web_site/contact"
  get "web_site/faq"
  #get "providers/new"
  get "providers/profile_list"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
