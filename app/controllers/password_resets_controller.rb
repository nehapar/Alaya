class PasswordResetsController < ApplicationController
  
  def new
  end
  
  def create
    user = Client.find_by_email(params[:email])
    if user.nil?
      user = Provider.find_by_email(params[:email])
    end
    user.send_password_reset if user
    redirect_to signin_path,  :flash => { :success => "Please, check your mailbox within a few minutes." }
  end
  
  def edit
    @user = Client.find_by_password_reset_token(params[:id])
    if @user.nil?
      @user = Provider.find_by_password_reset_token(params[:id])
    end
  end
  
  def update
    client = true
    @user = Client.find_by_password_reset_token(params[:id])
    if @user.nil?
      @user = Provider.find_by_password_reset_token(params[:id])
      client = false
    end
    if @user.password_reset_sent_at < 2.hours.ago
      redirect_to new_password_reset_path, :alert => "Password reset has expired."
    elsif @user.update_attributes(client ? client_update_password : provider_update_password)
      redirect_to signin_path, :flash => { :success => "Password has been reset!" }
    else
      render :edit
    end
  end
  
  def email_confirmation
    client = true
    @user = Client.find_by_password_reset_token(params[:id])
    if @user.nil?
      @user = Provider.find_by_password_reset_token(params[:id])
      client = false
    end
    if @user.presence and @user.active == 0
      @user.active = 1
      @user.save!
      
      if client
        csign_in @user
        redirect_to profile_list_path#, :flash => { :success => "Welcome to CareForMe! Start by booking some appointment right now!" }
      else
        sign_in @user
        redirect_to provider_dashboard_path#, :flash => { :success => "Welcome to CareForMe! Start by booking some appointment right now!" }
      end
    else
      redirect_to root_url
    end
  end
  
  private
    
    def client_update_password
      params.require(:client).permit(:password, :password_confirmation)
    end
    
    def provider_update_password
      params.require(:provider).permit(:password, :password_confirmation)
    end
end
