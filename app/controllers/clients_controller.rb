class ClientsController < ApplicationController

  # It creates routes for the clients home pages
  # There are callers for this method on Client model, in order to generate
  # new routes after a client sign up.
  # There are callers on the routes file, at config/routes.rb
  def self.load
	Alaya::Application.routes.draw do
	  Client.where("active = 1").each do |client|
		get "/#{client.profile}", :to => "clients#profile_detail", defaults: { id: client.id }
	  end
	end
  end
  
  # It reloads routes for the clients home pages
  def self.reload
    Alaya::Application.routes_reloader.reload!
  end

  # This method provides an empty Client object for a view with the same name
  def new
  	@client = Client.new
  	@client.email = params[:email]
  end
  
  # It creates a client
  def create
    @client = Client.new(client_params)
    @client.create_adjusts
    if @client.save
  	  flash[:success] = "Welcome to Alaya!"
  	  csign_in @client
  	  # for any reason, the sign up process is not finished at this point
  	  # so, it forces a redirect to another method that takes care of
  	  # finilize the job
  	  # !!!!!!!!!!!!! Need to be fixed !!!!!!!!!!!!!
      redirect_to csignup_helper_path
    else
      flash[:error] = 'Sorry, it was not possible to register you.'
      render 'new'
    end
  end
  
  # It finalizes the sign in after a sign up
  # !!!!!!!!!!!!! Need to be fixed !!!!!!!!!!!!!
  def signup_helper
  	if csigned_in?
  	  redirect_to eval(current_client.profile + "_path")
  	else
  	  redirect_to root_url
  	end
  end
  
  # This method check if who is requesting some client home page is
  # the client itself by checking if the session params match
  # if does not match, so redirects to home page
  def profile_detail
    if csigned_in? && current_client.id == params[:id]
      @client = Client.find(params[:id])
    else
      # destroy the session if there is some
      # if someclient is trying to visualize someothers information
      # to she deserves to be removed
      if csigned_in?
        csign_out
      end
      redirect_to root_url
    end
  end

  # the method is no longer in use, once that all the edit procedure is made
  # on the client home page itself
  # but it is left here for be used by admin
  def profile_edit
    if csigned_in?
  	  @client = current_client
    else
      redirect_to root_url
    end
  end
  
  # It updates the personal information, specified in client_information
  def update_personal
    @client = current_client
    if @client.update_attributes(client_information)
      flash[:success] = 'Information updated.'
    else
      @client.errors.full_messages.each do |message|
        flash[:danger] = 'Error: ' + message
      end
    end
    redirect_to eval(current_client.profile + "_path")
  end
  
  # It updates the client password
  def update_password
    @client = current_client
    # tries to authenticate with the old password
    if @client && @client.authenticate(params[:client][:password_old])
      # so update to the new one
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
  # Ajax methods
  
  # Many of them are suffering of a huge security problem
  # the encrypted password is been send to the browser

  # it is used when the client try to sign in while booking
  def csignin_ajax
    client = Client.find_by(email: params[:email].downcase)
    if client && client.authenticate(params[:password])
      csign_in client
      container = { "client" => client.clean_for_ajax, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
      render :json => container.to_json
    else
      container = { "client" => nil, "status" => "fail"}
      render :json => container.to_json
    end
  end

  # it is used to sign up on the provider's booking window
  def csignup_ajax
    client = Client.find_by(email: params[:email].downcase)
    if client.nil?
      client = Client.new(client_params)
      client.create_adjusts
      if client.save
        csign_in client
        container = { "client" => client.clean_for_ajax, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
        render :json => container.to_json
      else
        container = { "client" => nil, "status" => "fail"}
        render :json => container.to_json
      end
    else
      container = { "client" => nil, "status" => "email_exists"}
      render :json => container.to_json
    end
  end

  # before booking, if the client is already registered, but some information
  # is missing, to it is used to update it
  def update_info_ajax
    if csigned_in?
      client = Client.find(current_client.id)
      # for any reason it is not working as the other methods that
      # use a update_attributes method
      # !!!!!! NEED TO BE FIXED !!!!!!
      #client.phone = params[:phone]
      #client.address = params[:address]
      #client.weeks_pregnant = params[:weeks_pregnant]
      #if client.save
      if client.update_attributes(client_update_params)
        container = { "client" => client.clean_for_ajax, "status" => "success"} # :only => [ :id, :name ] <- please, remember this
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

  # this performs the final action of create an appointment request
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

  # this is used under admin's page to get all the clients names
  def get_clients_ajax
    # only admins can perform
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

  # this is used under admin's home page, 
  # returns whole information about an client
  def get_client_information_ajax
    # only admins can perform
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
  
  # this can be performed only by admins and by the underlying provider
  # this is not in use yet
  def delete_appointment_ajax
    appointment = Appointment.find(params[:appointment_id])
    if !appointment.nil?
      if is_admin? or (csigned_in? && appointment.client.id == current_client.id)
        if appointment.destroy
          container = { "status" => "success"}
        else
          container = { "status" => "fail"}
        end
      else
        container = { "status" => "not_allowed"}
      end
    else
      container = { "status" => "not_found"}
    end
    render :json => container.to_json
  end

  private
    # these methods are used to check if a post request is providing
    # all the parameters need for the underlying task
    
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

    def client_update_params
      params.require(:client).permit(:phone, :address, :weeks_pregnant)
    end
end
