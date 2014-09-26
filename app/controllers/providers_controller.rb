class ProvidersController < ApplicationController
  def new
  	@provider = Provider.new
  end

  def show
  	@provider = Provider.find(params[:id])
  	redirect_to :controller => 'providers', :action => 'profile_detail', :id => @provider.id
  end

  def profile_list
  	@providers = Provider.where("active = 1").find(:all)
  end

  def profile_detail
  	@provider = Provider.find(params[:id])
  end

  def update_personal
	@provider = current_provider
	if @provider.update_attributes(provider_personal)
      redirect_to :controller => 'providers', :action => 'profile_edit', :id => @provider.id
    else
      render 'profil_edit'
    end
  end

  def update
  	@provider = Provider.find(params[:id])
    if @provider.update_attributes(provider_params)
      redirect_to :controller => 'providers', :action => 'profile_edit', :id => @provider.id
    else
      render 'profil_edit'
    end
  end

  def create
    @provider = Provider.new(provider_minimum_params)
    @provider.permission = 6
    if @provider.save
      redirect_to :controller => 'providers', :action => 'profile_edit', :id => @provider.id
    else
      render 'new'
    end
  end

  def profile_edit
  	@provider = Provider.find(params[:id])
  end

  def appointments_ajax
    @provider = Provider.find(params[:id])
    @appointments = @provider.appointments.where("start >= '" + params[:start] + "' AND end <= '" + params[:end] + "'")
    container = { "appointments" => @appointments, "status" => "success"}
    render :json => container.to_json
    #respond_to do |format|
    #  format.html { render :layout => false }
    #  format.json { render :json => @appointments, status: :success }
    #end
    #render json: @provider.appointments
  end

  private

    def provider_minimum_params
      params.require(:provider).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end

    def provider_params
      params.require(:provider).permit(:first_name, :last_name, :email, :phone, :about, :specialities, :policies)
    end

    def provider_personal
      params.require(:provider).permit(:first_name, :last_name, :email, :expertise)	
    end
end
