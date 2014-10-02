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
  match 'profile_edit', :to => 'providers#profile_edit' , via: 'get'
  #match 'profiles/:username', :to => 'providers#profile_detail' , via: 'get'
  
  match 'appointments_ajax', :to => 'providers#appointments_ajax', via: 'get'
  match 'csignin_ajax', :to => 'clients#csignin_ajax', via: 'get'
  match 'csignup_ajax', :to => 'clients#csignup_ajax', via: 'get'
  match 'update_info_ajax', :to => 'clients#update_info_ajax', via: 'get'
  match 'request_appointment_ajax', :to => 'clients#request_appointment_ajax', via: 'get'
  match 'get_clients_ajax', :to => 'clients#get_clients_ajax', via: 'get'
  match 'get_client_information_ajax', :to => 'clients#get_client_information_ajax', via: 'get'
  
  match 'signup', :to => 'providers#new', via: 'get'
  match 'signin', :to => 'sessions#new', via: 'get'
  match 'signout', :to => 'sessions#destroy', via: 'delete'
  match 'admin', :to => 'providers#admin', via: 'get'
  match 'admin_delete_appointment', :to => 'providers#admin', via: 'delete'

  match 'provider_update_personal', :to => 'providers#update_personal', via: 'patch'
  match 'provider_update_password', :to => 'providers#update_password', via: 'patch'
  match 'provider_update_about', :to => 'providers#update_about', via: 'patch'
  match 'provider_update_specialty_text', :to => 'providers#update_specialty_text', via: 'patch'
  match 'provider_update_service_text', :to => 'providers#update_service_text', via: 'patch'
  match 'provider_update_policies', :to => 'providers#update_policies', via: 'patch'
  match 'add_service_ajax', :to => 'providers#add_service_ajax', via: 'get'
  match 'add_specialty_ajax', :to => 'providers#add_specialty_ajax', via: 'get'
  match 'add_certification_ajax', :to => 'providers#add_certification_ajax', via: 'get'
  match 'add_area_ajax', :to => 'providers#add_area_ajax', via: 'get'
  match 'add_review_ajax', :to => 'providers#add_review_ajax', via: 'get'
  match 'delete_service_ajax', :to => 'providers#delete_service_ajax', via: 'get'
  match 'delete_specialty_ajax', :to => 'providers#delete_specialty_ajax', via: 'get'
  match 'delete_certification_ajax', :to => 'providers#delete_certification_ajax', via: 'get'
  match 'delete_area_ajax', :to => 'providers#delete_area_ajax', via: 'get'
  match 'delete_review_ajax', :to => 'providers#delete_review_ajax', via: 'get'
  
  
  match 'appointment_detail', :to => 'providers#appointment_detail', via: 'get'

  # static pages working
  match 'profile_list_static', :to => 'web_site#profile_list', via: 'get'
  #match 'kashika_jackson', :to => 'web_site#kashika_jackson', via: 'get'

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
  
  ProvidersController.load

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
  #     end5
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
