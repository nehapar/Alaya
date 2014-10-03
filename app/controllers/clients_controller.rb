class ClientsController < ApplicationController

  def self.load
	Alaya::Application.routes.draw do
	  Client.where("active = 1").each do |client|
		get "/#{client.profile}", :to => "clients#profile_detail", defaults: { id: client.id }
	  end
	end
  end
  
  def self.reload
    Alaya::Application.routes_reloader.reload!
  end

  def new
  	@client = Client.new
  	@client.email = params[:email]
  end
  
  def create
    @client = Client.new(client_params)
    @client.active = 1
    if @client.last_name.include? "'"
      @client.profile = @client.first_name.downcase + "_" + @client.last_name.downcase.gsub("'","")
    else
      @client.profile = @client.first_name.downcase + "_" + @client.last_name.downcase
    end
    if @client.profile.include? " "
      @client.profile = @client.profile.gsub(" ","_")
    end
    if @client.profile.include? "-"
      @client.profile = @client.profile.gsub("-","_")
    end
    id = 0
    profile = @client.profile
    while Client.where("profile = '#{@client.profile}'").length > 0 do
      @client.profile = "#{profile}_#{id}"        
      id += 1
    end    
    if @client.save
	  flash[:success] = "Welcome to Alaya!"
	  csign_in @client
      redirect_to csignup_helper_path
    else
      flash[:error] = 'Sorry, it was not possible to register you.'
      render 'new'
    end
  end
  
  def signup_helper
	if csigned_in?
	  redirect_to eval(current_client.profile + "_path")
	else
	  redirect_to root_url
	end
  end
  
  def profile_detail
    if csigned_in? && current_client.id == params[:id]
	  @client = Client.find(params[:id])
	else
	  redirect_to root_url
	end
  end

  def profile_edit
    if csigned_in?
  	  @client = current_client
    else
      redirect_to root_url
    end
  end
  
  def update_personal
    @client = current_client
	if @client.update_attributes(client_information)
      flash[:success] = 'Information updated.'
    else
	  @client.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    #redirect_to c_profile_edit_path
    redirect_to eval(current_client.profile + "_path")
  end
  
  def update_password
    @client = current_client
    if @client && @client.authenticate(params[:client][:password_old])
	  if @client.update_attributes(client_update_password)
        flash[:success] = 'Password updated.'
      else
	    @client.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
      end
    else
      flash[:danger] = 'Error: wrong old password.'
    end
    redirect_to eval(current_client.profile + "_path")
  end

  #---------------------------------------------------------------------

  def csignin_ajax
    client = Client.find_by(email: params[:email].downcase)
    if client && client.authenticate(params[:password])
      csign_in client
      container = { "client" => client, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
      render :json => container.to_json
    else
      container = { "client" => nil, "status" => "fail"}
      render :json => container.to_json
    end
  end

  def csignup_ajax
    client = Client.find_by(email: params[:email].downcase)
    if client.nil?
      client = Client.new(client_params)
      if client.save
        csign_in client
        container = { "client" => client, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
        render :json => container.to_json
      else
        container = { "client" => nil, "status" => "fail"}
        render :json => container.to_json
      end
    elsif
      container = { "client" => nil, "status" => "email_exists"}
      render :json => container.to_json
    end
  end

  def update_info_ajax
    if csigned_in?
      client = Client.find(current_client.id)
      client.phone = params[:phone]
      client.address = params[:address]
      client.weeks_pregnant = params[:weeks_pregnant]
      if client.save
        container = { "client" => client, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
        render :json => container.to_json
      else
        container = { "client" => nil, "status" => "fail"}
        render :json => container.to_json
      end
    else
      container = { "client" => nil, "status" => "fail"}
      render :json => container.to_json      
    end
  end

  def request_appointment_ajax
    appointments = Appointment.new(appointment_params)
    if appointments.save
      container = { "status" => "success"}
      render :json => container.to_json
    else
      container = { "appointments" => appointments.errors, "status" => "fail"}
      render :json => container.to_json
    end
  end

  def get_clients_ajax
    if is_admin?
      clients = Client.all.order("first_name, last_name")
      container = { "clients" => clients, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
      render :json => container.to_json
    else
      csign_out
      sign_out
      redirect_to root_url
    end
  end

  def get_client_information_ajax
    if is_admin?
      client = Client.find(params[:id])
      container = { "client" => client, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
      render :json => container.to_json
    else
      csign_out
      sign_out
      redirect_to root_url
    end
  end

  private

    def client_params
      params.require(:client).permit(:first_name, :last_name, :email, :phone, :address, :weeks_pregnant, :password, :password_confirmation)
    end
    
    def client_information
      params.require(:client).permit(:first_name, :last_name, :email, :phone, :address, :weeks_pregnant)	
    end
    
    def client_update_password
      params.require(:client).permit(:password, :password_confirmation)
    end
    
    def appointment_params
      params.require(:appointment).permit(:provider_id, :client_id, :start, :end, :client_observation, :accepted)
    end

    def client_update_ajax_params
      params.permit(:phone, :address, :weeks_pregnant)
    end

end
