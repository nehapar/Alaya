module SessionsHelper
	def sign_in(provider)
    #remember_token = Provider.new_remember_token
    #cookies.permanent[:remember_token] = remember_token
    #provider.update_attribute(:remember_token, Provider.digest(remember_token))
    #self.current_provider = provider
    session[:user_id] = provider.id
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
    #remember_token = Provider.digest(cookies[:remember_token])
    #@current_provider ||= Provider.find_by(remember_token: remember_token)
    if (user_id = session[:user_id])
      @current_provider ||= Provider.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      provider = Provider.find_by(id: user_id)
      if provider && provider.authenticated?(cookies[:remember_token])
        sign_in provider
        @current_provider = provider
      end
    end
  end

  def sign_out
    forget(current_provider)
    session.delete(:user_id)
    @current_provider = nil
    
    #current_provider.update_attribute(:remember_token, Provider.digest(Provider.new_remember_token))
    #cookies.delete(:remember_token)
    #self.current_provider = nil
  end

  def csign_in(client)
    #remember_token = Client.new_remember_token
    #cookies.permanent[:remember_token] = remember_token
    #client.update_attribute(:remember_token, Client.digest(remember_token))
    #self.current_client = client
    session[:user_id] = client.id
  end
  
  def csigned_in?
    !current_client.nil?
  end
  
  def current_client=(client)
    @current_client = client
  end
  
  def current_client
    #remember_token = Client.digest(cookies[:remember_token])
    #@current_client ||= Client.find_by(remember_token: remember_token)
    if (user_id = session[:user_id])
      @current_client ||= Client.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      client = Client.find_by(id: user_id)
      if client && client.authenticated?(cookies[:remember_token])
        csign_in client
        @current_client = client
      end
    end
  end

  def csign_out
    forget(current_client)
    session.delete(:user_id)
    @current_client = nil
    
    #current_client.update_attribute(:remember_token, Client.digest(Client.new_remember_token))
    #cookies.delete(:remember_token)
    #self.current_client = nil
  end
  
  # Remembers a user in a persistent session.
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end
  
  # Forgets a persistent session.
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end
end
