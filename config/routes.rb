CareForMe::Application.routes.draw do
  
  get "password_resets/new"
  get "clients/new"
  
  resources :providers
  resources :sessions, only: [:new, :create, :destroy]
  resources :clients
  resources :password_resets
  
  root :to => 'web_site#index'
  
  # appointments control
  match 'appointment_detail', :to => 'providers#appointment_detail_ajax' , via: 'get'
  match 'accept_appointment', :to => 'providers#accept_appointment_ajax' , via: 'get'
  match 'deny_appointment', :to => 'providers#deny_appointment_ajax' , via: 'get'
  match 'reschedule_appointment', :to => 'providers#reschedule_appointment_ajax' , via: 'get'
  
  match 'provider_appointments', :to => 'providers#provider_appointments_ajax' , via: 'get'
  
  
  
  # clients
  match 'c_profile_edit', :to => 'clients#profile_edit' , via: 'get'
  match 'csignup',  :to => 'clients#new', via: 'get'
  match 'create_client',  :to => 'clients#create', via: 'get'
  match 'csignup_helper',  :to => 'clients#signup_helper', via: 'get'
  match 'client_update_personal', :to => 'clients#update_personal' , via: 'patch'
  match 'client_update_password', :to => 'clients#update_password' , via: 'patch'
  match 'csignin_ajax', :to => 'clients#csignin_ajax', via: 'get'
  match 'csignup_ajax', :to => 'clients#csignup_ajax', via: 'get'
  match 'update_info_ajax', :to => 'clients#update_info_ajax', via: 'get'
  match 'request_appointment_ajax', :to => 'clients#request_appointment_ajax', via: 'get'
  match 'get_clients_ajax', :to => 'clients#get_clients_ajax', via: 'get'
  match 'get_client_information_ajax', :to => 'clients#get_client_information_ajax', via: 'get'
  match 'client_delete_appointment_ajax', :to => 'clients#delete_appointment_ajax', via: 'get'
  match 'update_client_information', :to => 'clients#update_client_information_ajax', via: 'get'
  match 'client_simple_info', :to => 'clients#client_simple_info_ajax', via: 'get'
  match 'client_dashboard', :to => 'clients#dashboard' , via: 'get'
  match 'reschedule_request_by_client', :to => 'clients#reschedule_request_by_client_ajax' , via: 'get'
  match 'cancel_appointment_by_client', :to => 'clients#cancel_appointment_by_client_ajax' , via: 'get'
  
  # providers
  
  match 'update_provider_information', :to => 'providers#update_provider_information_ajax', via: 'post'
  match 'provider_simple_info', :to => 'providers#provider_simple_info_ajax', via: 'get'
  match 'profile_list', :to => 'providers#profile_list', via: 'get'
  match 'profile_detail', :to => 'providers#profile_detail', via: 'get'
  #match 'profile_edit', :to => 'providers#profile_edit' , via: 'get'
  match 'provider_dashboard', :to => 'providers#dashboard' , via: 'get'
  match 'upload_provider_picture', :to => 'providers#upload_picture_ajax', via: 'post'
  match 'provider_info', :to => 'providers#provider_info_ajax', via: 'get'
  match 'provider_reviews', :to => 'providers#provider_reviews_ajax', via: 'get'
  match 'provider_specialties', :to => 'providers#provider_specialties_ajax', via: 'get'
  match 'update_specialty_text', :to => 'providers#update_specialty_text_ajax', via: 'get'
  match 'provider_services', :to => 'providers#provider_services_ajax', via: 'get'
  match 'update_service_text', :to => 'providers#update_service_text_ajax', via: 'get'
  match 'update_policies_text', :to => 'providers#update_policies_text_ajax', via: 'get'
  match 'provider_certifications', :to => 'providers#provider_certifications_ajax', via: 'get'
  match 'provider_areas', :to => 'providers#provider_areas_ajax', via: 'get'
  match 'update_provider_info', :to => 'providers#update_provider_info_ajax', via: 'get'
  match 'change_provider_password', :to => 'providers#change_provider_password_ajax', via: 'get'
  match 'self_change_provider_password', :to => 'providers#self_change_provider_password_ajax', via: 'get'
  match 'appointments_ajax', :to => 'providers#appointments_ajax', via: 'get'
  match 'signup', :to => 'providers#new', via: 'get'
  match 'admin', :to => 'providers#admin', via: 'get'
  match 'admin_delete_appointment', :to => 'providers#admin', via: 'delete'
  match 'provider_update_picture', :to => 'providers#update_picture', via: 'patch'
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
  match 'filter_provider_ajax', :to => 'providers#filter_provider_ajax', via: 'get'
  match 'signup', :to => 'providers#new', via: 'get'
  match 'toogle_provider_time_availability', :to => 'providers#toogle_provider_time_availability_ajax', via: 'get'
  match 'provider_time_availability', :to => 'providers#provider_time_availability_ajax', via: 'get'
  
  #sessions
  
  match 'csignin', :to => 'sessions#new', via: 'get'
  match 'csignout', :to => 'sessions#destroy', via: 'delete'
  match 'signin', :to => 'sessions#new', via: 'get'
  match 'signout', :to => 'sessions#destroy', via: 'delete'
  #match 'password_recovery', :to => 'sessions#password_recovery_ajax', via: 'get'
  
  # web site
  match 'profile_list_static', :to => 'web_site#profile_list', via: 'get'
  match 'partners', :to => 'web_site#partners', via: 'get'
  match 'about', :to => 'web_site#about', via: 'get'
  match 'contact', :to => 'web_site#contact', via: 'get'
  match 'faq', :to => 'web_site#faq', via: 'get'
  match 'contact_message', :to => 'web_site#contact_message', via: 'get'
  match 'provider_intention_note', :to => 'web_site#provider_intention_note_ajax', via: 'get'
  
  
  get "web_site/index"
  get "web_site/profile_list"
  get "web_site/profile_detail"
  get "web_site/partners"
  get "web_site/about"
  get "web_site/contact"
  get "web_site/faq"
  
  # password recovery
  match 'password_recovery', :to => 'password_resets#new', via: 'get'
  match 'password_recovery_edit', :to => 'password_resets#edit', via: 'get'
  match 'client_confirmation', :to => 'password_resets#email_confirmation', via: 'get'
  
  ProvidersController.load
  ClientsController.load

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
