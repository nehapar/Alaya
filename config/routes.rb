Alaya::Application.routes.draw do
  root :to => 'web_site#index'
  match 'profile_list', :to => 'web_site#profile_list', via: 'get'
  match 'profile_detail', :to => 'web_site#profile_detail', via: 'get'
  match 'partners', :to => 'web_site#partners', via: 'get'
  match 'about', :to => 'web_site#about', via: 'get'
  match 'contact', :to => 'web_site#contact', via: 'get'
  match 'faq', :to => 'web_site#faq', via: 'get'

  get "web_site/index"
  get "web_site/profile_list"
  get "web_site/profile_detail"
  get "web_site/partners"
  get "web_site/about"
  get "web_site/contact"
  get "web_site/faq"


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
