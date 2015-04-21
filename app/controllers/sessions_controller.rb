class SessionsController < ApplicationController
  
  def new
  end

  def create
  	provider = Provider.find_by(email: params[:session][:email].downcase)
    client = Client.find_by(email: params[:session][:email].downcase)

    if provider && provider.authenticate(params[:session][:password])
      sign_in provider
      params[:session][:remember_me] == '1' ? remember(provider) : forget(provider)
      if is_admin?
        redirect_to admin_path
        return
      else
        redirect_to provider_dashboard_path # eval(provider.profile + '_path')
        return
      end
    elsif client && client.authenticate(params[:session][:password]) && client.active == 1
      csign_in client
      params[:session][:remember_me] == '1' ? remember(client) : forget(client)
      if client.appointments.where(['start >= ? and (accepted = 0 or accepted = 1)', DateTime.now]).length > 0
        redirect_to eval(client.profile + '_path')
        return
      else
        redirect_to profile_list_path
        return
      end
    elsif client && client.authenticate(params[:session][:password]) && client.active == 0
      flash.now[:error] = 'Please, activate your profile through the link in your email.' # Not quite right!
      render 'new'
    else
      flash.now[:error] = 'Invalid email/password combination' # Not quite right!
      render 'new'
    end
  end

  def destroy
    if signed_in?
  	  sign_out
    elsif csigned_in?
      csign_out
    end
    redirect_to root_url
  end
  
  def password_recovery_ajax
    user = Provider.find_by(email: params[:email])
    if user.nil?
      user = Client.find_by(email: params[:email])
    end
    if !user.nil?
      #UserMailer.password_recovery(user).deliver
      password_recovery_email(user)
      container = { "status" => "success" }
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
end
