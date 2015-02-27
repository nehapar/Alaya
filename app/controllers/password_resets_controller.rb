class PasswordResetsController < ApplicationController
  
  def new
  end
  
  def create
    user = Client.find_by_email(params[:email])
    if user.nil?
      user = Provider.find_by_email(params[:email])
    end
    user.send_password_reset if user
    redirect_to signin_path, :notice => "Please, check your mailbox within a few minutes."
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
      redirect_to signin_path, :notice => "Password has been reset!"
    else
      render :edit
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
