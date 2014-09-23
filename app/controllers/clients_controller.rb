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

  private

    def client_params
      params.require(:client).permit(:first_name, :last_name, :email, :phone, :address, :weeks_pregnant, :password, :password_confirmation)
    end
end
