class ProvidersController < ApplicationController
  
  def self.load
	Alaya::Application.routes.draw do
	  Provider.where("admin = 0").each do |provider|
		get "/#{provider.profile}", :to => "providers#profile_detail", defaults: { id: provider.id }
	  end
	end
  end
  
  def self.reload
    Alaya::Application.routes_reloader.reload!
  end
  
  def new
  	@provider = Provider.new
  end

  def show
  	@provider = Provider.find(params[:id])
  	redirect_to :controller => 'providers', :action => 'profile_detail'
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
      flash[:success] = 'Personal information updated.'
    else
	  @provider.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    redirect_to profile_edit_path
  end

  def update_about
    @provider = current_provider
	if @provider.update_attributes(provider_about)
      flash[:success] = 'About information updated.'
    else
	  @provider.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    redirect_to profile_edit_path
  end

  def update_specialty_text
    @provider = current_provider
	if @provider.update_attributes(provider_specialty_text)
      flash[:success] = 'Specialty text information updated.'
    else
	  @provider.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    redirect_to profile_edit_path
  end
  
  def update_service_text
    @provider = current_provider
	if @provider.update_attributes(provider_service_text)
      flash[:success] = 'Service text information updated.'
    else
	  @provider.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    redirect_to profile_edit_path
  end
  
  def update_policies
    @provider = current_provider
	if @provider.update_attributes(provider_policies)
      flash[:success] = 'Policies information updated.'
    else
	  @provider.errors.full_messages.each do |message|
	    flash[:danger] = 'Error: ' + message
	  end
    end
    redirect_to profile_edit_path
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
    @provider.admin = 0
    @provider.active = 0
    if @provider.last_name.include? "'"
      @provider.profile = @provider.first_name.downcase + "_" + @provider.last_name.downcase.gsub("'","")
    else
      @provider.profile = @provider.first_name.downcase + "_" + @provider.last_name.downcase
    end
    
    if @provider.profile.include? " "
      @provider.profile = @provider.profile.gsub(" ","_")
    end
    
    if @provider.profile.include? "-"
      @provider.profile = @provider.profile.gsub("-","_")
    end
    
    if @provider.save
	  sign_in @provider
      #redirect_to provider
      redirect_to :controller => 'providers', :action => 'profile_edit'
    else
	  if Provider.where("email = '" + @provider.email + "'").length > 0
		flash[:error] = 'Email already registered. Have you forgot your password?'
	  else
	    flash[:error] = 'It was not possible to create your user.'
	  end
      render 'new'
    end
  end

  def profile_edit
    if signed_in?
  	  @provider = current_provider
    else
      redirect_to root_url
    end
  end

  #--------------------------------------------------------------------------------------
  # ajax methods

  def add_service_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    service = Service.new
	    service.provider_id = provider.id
	    service.service = params[:service]
	    if service.save
	      container = { "services" => provider.services.all, "status" => "success"}
	    else
		  container = { "services" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def delete_service_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    service = Service.find(params[:service_id])
	    if service.destroy
	      container = { "services" => provider.services.all, "status" => "success"}
	    else
		  container = { "services" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def add_specialty_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    specialty = Specialty.new
	    specialty.provider_id = provider.id
	    specialty.specialty = params[:specialty]
	    if specialty.save
	      container = { "specialties" => provider.specialties.all, "status" => "success"}
	    else
		  container = { "specialties" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def delete_specialty_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    specialty = Specialty.find(params[:specialty_id])
	    if specialty.destroy
	      container = { "specialties" => provider.specialties.all, "status" => "success"}
	    else
		  container = { "specialties" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def add_certification_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    certification = Certification.new
	    certification.provider_id = provider.id
	    certification.certification = params[:certification]
	    if certification.save
	      container = { "certifications" => provider.certifications.all, "status" => "success"}
	    else
		  container = { "certifications" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def delete_certification_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    certification = Certification.find(params[:certification_id])
	    if certification.destroy
	      container = { "certifications" => provider.certifications.all, "status" => "success"}
	    else
		  container = { "certifications" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def add_area_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    area = Area.new
	    area.provider_id = provider.id
	    area.area = params[:area]
	    if area.save
	      container = { "areas" => provider.areas.all, "status" => "success"}
	    else
		  container = { "areas" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def delete_area_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    area = Area.find(params[:area_id])
	    if area.destroy
	      container = { "areas" => provider.areas.all, "status" => "success"}
	    else
		  container = { "areas" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def add_review_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    review = Review.new
	    review.provider_id = provider.id
	    review.review = params[:review]
	    review.author = params[:author]
	    if review.save
	      container = { "reviews" => provider.reviews.all, "status" => "success"}
	    else
		  container = { "reviews" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def delete_review_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
	  provider = Provider.find(params[:provider_id])
	  if !provider.nil?
	    review = Review.find(params[:review_id])
	    if review.destroy
	      container = { "reviews" => provider.reviews.all, "status" => "success"}
	    else
		  container = { "reviews" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end

  def appointments_ajax
    @provider = Provider.find(params[:id])
    @appointments = @provider.appointments.where("start >= '" + params[:start] + "' AND end <= '" + params[:end] + "'")
    container = { "appointments" => @appointments, "status" => "success"}
    render :json => container.to_json
  end

  #--------------------------------------------------------------------------------------
  # admin methods

  def admin
    if !signed_in? || !is_admin?
      csign_out
      redirect_to root_url
    end

    @alert = nil

    if params.has_key?(:accept_appointment_id)
      appointment = Appointment.find(params[:accept_appointment_id])
      appointment.accepted = 1
      if appointment.save
        @alert = {"strong" => "Success!", "type" => "success", "message" => "Appointment accepted."}
      else
        @alert = {"strong" => "Error!", "type" => "danger", "message" => "Appointment not accepted."}
      end
    elsif params.has_key?(:deny_appointment_id)
	  appointment = Appointment.find(params[:deny_appointment_id])
	  if appointment.destroy
	    @alert = {"strong" => "Success!", "type" => "success", "message" => "Appointment denied and deleted."}
	  else
	    @alert = {"strong" => "Error!", "type" => "danger", "message" => "It was not possible to deny and delete the appointment."}
	  end
    end

    @admin = current_provider 
    @appointments_not_accepted = Appointment.where("accepted = 0")
    @providers = Provider.where("admin = 0").order("first_name, last_name ASC")
  end

  def appointment_detail
    if !signed_in? || !is_admin?
      csign_out
      redirect_to root_url
    end
    @appointment = Appointment.find(params[:id])
  end

  #--------------------------------------------------------------------------------------

  private

    def provider_minimum_params
      params.require(:provider).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end

    def provider_params
      params.require(:provider).permit(:first_name, :last_name, :email, :phone, :about, :specialty_text, :policies)
    end

    def provider_personal
      params.require(:provider).permit(:first_name, :last_name, :email, :expertise, :abstract, :phone)	
    end
    
    def provider_about
      params.require(:provider).permit(:about)	
    end
    
    def provider_specialty_text
      params.require(:provider).permit(:specialty_text)	
    end
    
    def provider_service_text
      params.require(:provider).permit(:service_text)	
    end
    
    def provider_policies
      params.require(:provider).permit(:policies)	
    end
end
