CareForMe::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true
  
  config.action_mailer.default_url_options = { :host => "http://careforme-c9-thiagolcmelo.c9.io" }
  
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.raise_delivery_errors = true
  #config.action_mailer.default_options = {
  #  :reply_to => 'thiago.CareForMe@gmail.com'
  #},
  
  config.action_mailer.smtp_settings = {
    :user_name => 'thiago.alaya@gmail.com',
    :password => 'eaacps123',
    :address => "smtp.gmail.com",
    :domain => "gmail.com",
    :enable_starttls_auto => true,
    :authentication => "plain",
    :port => 587,
  }
  
  #config.action_mailer.delivery_method = :smtp
  #config.action_mailer.smtp_settings = {
  #  :user_name => 'tapan.CareForMe@gmail.com',
  #  :password => '0tRCw5a7xObbw2GseSnHaQ',
  #  :address => "smtp.mandrillapp.com",
  #  :domain => "CareForMe.co",
  #  :enable_starttls_auto => true,
  #  :authentication => "plain",
  #  :port => 587,
  #}
end
