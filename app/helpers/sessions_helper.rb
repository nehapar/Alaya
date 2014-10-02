module SessionsHelper
	def sign_in(provider)
    remember_token = Provider.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    provider.update_attribute(:remember_token, Provider.digest(remember_token))
    self.current_provider = provider
  end
  
  def signed_in?
    !current_provider.nil?
  end

  def is_admin?
    signed_in? && current_provider.admin == 1
  end
  
  def current_provider=(provider)
    @current_provider = provider
  end
  
  def current_provider
    remember_token = Provider.digest(cookies[:remember_token])
    @current_provider ||= Provider.find_by(remember_token: remember_token)
  end

  def sign_out
    current_provider.update_attribute(:remember_token, Provider.digest(Provider.new_remember_token))
    cookies.delete(:remember_token)
    self.current_provider = nil
  end

  def csign_in(client)
    remember_token = Client.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    client.update_attribute(:remember_token, Client.digest(remember_token))
    self.current_client = client
  end
  
  def csigned_in?
    !current_client.nil?
  end
  
  def current_client=(client)
    @current_client = client
  end
  
  def current_client
    remember_token = Client.digest(cookies[:remember_token])
    @current_client ||= Client.find_by(remember_token: remember_token)
  end

  def csign_out
    current_client.update_attribute(:remember_token, Client.digest(Client.new_remember_token))
    cookies.delete(:remember_token)
    self.current_client = nil
  end
end
