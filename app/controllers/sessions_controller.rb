class SessionsController < ApplicationController
  def new
  end

  def create
  	provider = Provider.find_by(email: params[:session][:email].downcase)
    client = Client.find_by(email: params[:session][:email].downcase)

    if provider && provider.authenticate(params[:session][:password])
      sign_in provider
      if is_admin?
        redirect_to admin_path
      else
        redirect_to eval(provider.profile + '_path')
      end
    elsif client && client.authenticate(params[:session][:password])
      csign_in client
      redirect_to client
    else
      flash[:error] = 'Invalid email/password combination' # Not quite right!
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
end
