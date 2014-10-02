class ClientsController < ApplicationController

  def new
  	@client = Client.new
  	@client.email = params[:email]
  end

  def show
    @client = Client.find(params[:id])
    redirect_to :controller => 'clients', :action => 'show_client', :id => @client.id
  end

  def show_client
    @client = Client.find(params[:id])
  end  

  def create
    @client = Client.new(client_params)
    if @client.save
      flash[:success] = "Welcome to Alaya!"
      redirect_to show_client_path(id: @client.id)
    else
      flash[:error] = 'Sorry, it was not possible to register you.'
      render 'new'
    end
  end

  def edit
    @client = Client.find(params[:id])
  end

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

    def appointment_params
      params.require(:appointment).permit(:provider_id, :client_id, :start, :end, :client_observation, :accepted)
    end

    def client_update_ajax_params
      params.permit(:phone, :address, :weeks_pregnant)
    end
end