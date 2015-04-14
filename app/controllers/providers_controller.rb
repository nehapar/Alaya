class ProvidersController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  
  def self.load
	  CareForMe::Application.routes.draw do
  	  Provider.where("admin = 0").each do |provider|
  		  get "/#{provider.profile}", :to => "providers#profile_detail", defaults: { id: provider.id }
  	  end
  	end
  end
  
  def self.reload
    CareForMe::Application.routes_reloader.reload!
  end
  
  def new
  	@provider = Provider.new
  	@provider.email = params[:email]
  end

  def show
  	@provider = Provider.find(params[:id])
  	redirect_to :controller => 'providers', :action => 'profile_detail'
  end

  def profile_list
  	@providers = Provider.where("active = 1")#.find(:all)
  end

  def profile_detail
    if params[:go].present?
      if params[:go] == "next"
        provider = Provider.where("admin = 0").where("id > ?", params[:id]).first
        provider ||= Provider.first
        redirect_to eval(provider.profile + "_path")
      else
        provider = Provider.where("admin = 0").where("id < ?", params[:id]).last
        provider ||= Provider.last
        redirect_to eval(provider.profile + "_path")
      end
    else
	    @provider = Provider.find(params[:id])
	  end
  end

  def update_personal
  	@provider = current_provider
  	if @provider.update_attributes(provider_personal)
      flash.now[:success] = 'Personal information updated.'
    else
	    @provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
    end
    redirect_to provider_dashboard
  end

  def update_about
    @provider = current_provider
	  if @provider.update_attributes(provider_about)
      flash.now[:success] = 'About information updated.'
    else
	    @provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
    end
    redirect_to provider_dashboard
  end

  def update_specialty_text
    @provider = current_provider
	  if @provider.update_attributes(provider_specialty_text)
      flash.now[:success] = 'Specialty text information updated.'
    else
	    @provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
    end
    redirect_to provider_dashboard
  end
  
  def update_service_text
    @provider = current_provider
	  if @provider.update_attributes(provider_service_text)
      flash.now[:success] = 'Service text information updated.'
    else
	    @provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
    end
    redirect_to provider_dashboard
  end
  
  def update_policies
    @provider = current_provider
	  if @provider.update_attributes(provider_policies)
      flash.now[:success] = 'Policies information updated.'
    else
	    @provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
    end
    redirect_to provider_dashboard
  end
  
  def update_picture
    @provider = current_provider
    uploaded_io = params[:provider][:picture]
    
    filename = uploaded_io.original_filename
    extension = filename.split('.').last.downcase
    tmp_file = "#{Rails.root}/public/assets/img/profile_pic/#{@provider.profile}.#{extension}"
    id = 0
    while File.exists?(tmp_file) do
      tmp_file = "#{Rails.root}/public/assets/img/profile_pic/#{@provider.profile}_#{id}.#{extension}"        
      id += 1
    end
    File.open(tmp_file, 'wb') do |f|
      f.write uploaded_io.read
    end
    
    @provider.picture_path = "../assets/img/profile_pic/" + tmp_file.split('/').last
    
    if @provider.save
      flash.now[:success] = 'Picture uploaded.'
    else
      @provider.errors.full_messages.each do |message|
        flash.now[:danger] = 'Error: ' + message
      end
    end
    redirect_to provider_dashboard
  end

  def update
  	@provider = Provider.find(params[:id])
    if @provider.update_attributes(provider_params)
      redirect_to :controller => 'providers', :action => 'dashboard', :id => @provider.id
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
    @provider.generate_token(:password_reset_token)
    if @provider.save
      flash.now[:success] = "Welcome to CareForMe! Please check your email for validation."
  	  UserMailer.welcome_provider_email(@provider)
  	  redirect_to signin_path, :flash => { :success => "Welcome to CareForMe! Please check your email for validation." } #profile_list_path #csignup_helper_path
    else
  	  if Provider.where("email = '" + @provider.email + "'").length > 0
  		  flash.now[:error] = 'Email already registered. Have you forgot your password?'
  	  else
  	    flash.now[:error] = 'It was not possible to create your user.'
  	  end
      render 'new'
    end
  end

  # this method provides info to the provider's view
  def dashboard
    if signed_in?
  	  @provider = current_provider
    else
      redirect_to root_url
    end
    
    @pending_appointments = @provider.appointments.where("accepted = 0").where(['start >= ?', DateTime.now]).order("start asc")
    @confirmed_appointments = @provider.appointments.where("accepted = 1").where(['start >= ?', DateTime.now]).order("start asc")
    @past_appointments = @provider.appointments.where(['start < ?', DateTime.now]).order("start desc")
    @denied_appointments = @provider.appointments.where("accepted = 2").where(['start >= ?', DateTime.now]).order("start desc")
    
    require 'date'
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
  	      container = { "services" => provider.services, "status" => "success"}
  	    else
  		  container = { "services" => nil, "status" => "fail"}
  	    end
  	    render :json => container.to_json
  	  else
  	    provider.errors.full_messages.each do |message|
  	      flash.now[:danger] = 'Error: ' + message
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
	      container = { "services" => provider.services, "status" => "success"}
	    else
		  container = { "services" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def provider_services_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    container = { "services" => provider.services, "status" => "success"}
  	  else
  	    container = { "services" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_service_text_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  provider.service_text = params[:service_text]
  	  if provider.save
  	    container = { "services" => provider.services, "status" => "success"}
  	  else
  	    container = { "services" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
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
  	      container = { "specialties" => provider.specialties, "status" => "success"}
  	    else
  		    container = { "specialties" => nil, "status" => "fail"}
  	    end
  	    render :json => container.to_json
  	  else
  	    provider.errors.full_messages.each do |message|
  	      flash.now[:danger] = 'Error: ' + message
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
  	      container = { "specialties" => provider.specialties, "status" => "success"}
  	    else
  		  container = { "specialties" => nil, "status" => "fail"}
  	    end
  	    render :json => container.to_json
  	  else
  	    provider.errors.full_messages.each do |message|
  	      flash.now[:danger] = 'Error: ' + message
  	    end
  	  end
    else
	    redirect_to root_url
    end
  end
  
  def provider_specialties_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    container = { "specialties" => provider.specialties, "status" => "success"}
  	  else
  	    container = { "specialties" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_specialty_text_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  provider.specialty_text = params[:specialty_text]
  	  if provider.save
  	    container = { "specialties" => provider.specialties, "status" => "success"}
  	  else
  	    container = { "specialties" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
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
	      container = { "certifications" => provider.certifications, "status" => "success"}
	    else
		  container = { "certifications" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
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
	      container = { "certifications" => provider.certifications, "status" => "success"}
	    else
		  container = { "certifications" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def provider_certifications_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    container = { "certifications" => provider.certifications, "status" => "success"}
  	  else
  	    container = { "certifications" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_certification_text_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  provider.certification_text = params[:certification_text]
  	  if provider.save
  	    container = { "certifications" => provider.certifications, "status" => "success"}
  	  else
  	    container = { "certifications" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_policies_text_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  provider.policies = params[:policies]
  	  if provider.save
  	    container = { "status" => "success"}
  	  else
  	    container = { "status" => "fail"}
  	  end
  	  render :json => container.to_json
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
	      container = { "areas" => provider.areas, "status" => "success"}
	    else
		  container = { "areas" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
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
	      container = { "areas" => provider.areas, "status" => "success"}
	    else
		  container = { "areas" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
	    end
	  end
    else
	  redirect_to root_url
    end
  end
  
  def provider_areas_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    container = { "areas" => provider.areas, "status" => "success"}
  	  else
  	    container = { "areas" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_area_text_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  provider.area_text = params[:area_text]
  	  if provider.save
  	    container = { "areas" => provider.areas, "status" => "success"}
  	  else
  	    container = { "areas" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
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
	      container = { "reviews" => provider.reviews, "status" => "success"}
	    else
		  container = { "reviews" => nil, "status" => "fail"}
	    end
	    render :json => container.to_json
	  else
	    provider.errors.full_messages.each do |message|
	      flash.now[:danger] = 'Error: ' + message
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
  	      container = { "reviews" => provider.reviews, "status" => "success"}
  	    else
  		    container = { "reviews" => nil, "status" => "fail"}
  	    end
  	    render :json => container.to_json
  	  else
  	    provider.errors.full_messages.each do |message|
  	      flash.now[:danger] = 'Error: ' + message
  	    end
  	  end
    else
	    redirect_to root_url
    end
  end
  
  def provider_reviews_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    container = { "reviews" => provider.reviews, "status" => "success"}
  	  else
  	    container = { "reviews" => nil, "status" => "fail"}
  	  end
  	  render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def change_provider_password_ajax
    if is_admin?
  	  provider = Provider.find(params[:provider_id])
  	  if !provider.nil?
  	    if provider.update_attributes(provider_update_password)
  	      container = { "status" => "success"}
  	    else
  		    container = { "status" => "fail"}
  	    end
  	  else
  	    container = { "status" => "fail"}
  	  end
    else
	    container = { "status" => "fail"}
    end
    render :json => container.to_json
  end
  
  def self_change_provider_password_ajax
    provider = Provider.find(params[:provider_id])
    if !provider.nil?
      if signed_in? and current_provider.id == provider.id and provider.authenticate(params[:provider][:old_password])
  	    if provider.update_attributes(provider_update_password)
  	      container = { "status" => "success" }
  	    else
  		    container = { "status" => "fail" }
  	    end
  	  else
  	    container = { "status" => "fail" }
  	  end
    else
	    container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def appointments_ajax
    @provider = Provider.find(params[:id])
    @appointments = @provider.appointments.where("start >= '" + params[:start] + "' AND end <= '" + params[:end] + "'")
    if csigned_in?
      appointments = current_client.appointments.where("start >= '" + params[:start] + "' AND end <= '" + params[:end] + "'")
      @appointments = @appointments.push(*appointments)
    end
    
    container = { "appointments" => @appointments, "status" => "success"}
    render :json => container.to_json
  end
  
  def filter_provider_ajax
    filter = params[:filter]
    results = Array.new
    
    categories = ["Areas", "Services", "Specialties"]
    
    #--- services
    services = Service.where("service like '%#{filter}%'").order("service")
    services.each do |s|
      if results.length > 0
        has_result = false
        results.each do |r|
          if r[:text] == s.service
            has_result = true
            r[:id] = "#{r[:id]}|#{s.provider_id}"
          end
        end
        if !has_result
          result = { :id => s.provider_id, :text => s.service, :category => "Services" }
          results.push(result)
        end
      else
        result = { :id => s.provider_id, :text => s.service, :category => "Services" }
        results.push(result)
      end
    end
    
    #--- specialties
    specialties = Specialty.where("specialty like '%#{filter}%'").order("specialty")
    specialties.each do |s|
      if results.length > 0
        has_result = false
        results.each do |r|
          if r[:text] == s.specialty
            has_result = true
            r[:id] = "#{r[:id]}|#{s.provider_id}"
          end
        end
        if !has_result
          result = { :id => s.provider_id, :text => s.specialty, :category => "Specialties" }
          results.push(result)
        end
      else
        result = { :id => s.provider_id, :text => s.specialty, :category => "Specialties" }
        results.push(result)
      end
    end
    
    #--- areas
    areas = Area.where("area like '%#{filter}%'").order("area")
    areas.each do |a|
      if results.length > 0
        has_result = false
        results.each do |r|
          if r[:text] == a.area
            has_result = true
            r[:id] = "#{r[:id]}|#{a.provider_id}"
          end
        end
        if !has_result
          result = { :id => a.provider_id, :text => a.area, :category => "Areas" }
          results.push(result)
        end
      else
        result = { :id => a.provider_id, :text => a.area, :category => "Areas" }
        results.push(result)
      end
    end
    if results.length > 0
      container = { "results" => results, "status" => "success", "categories" => categories }
    else
      container = { "results" => nil, "status" => "fail", "categories" => nil }
    end
    render :json => container.to_json
  end
  
  def provider_info_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
      provider = Provider.find(params[:provider_id])
      if !provider.nil?
        slots_unavailable = provider.provider_schedules.where(:unavailable => true)
        container = { "provider" => provider.without_secure_info, "specialties" => provider.specialties, "status" => "success", "slots_unavailable" => slots_unavailable, "current_week" => (Date.today + 1.week).strftime('%U').to_i, "current_year" => Date.today.strftime('%Y').to_i }
      else
        container = { "provider" => nil, "status" => "fail" }
      end
    else
      container = { "provider" => nil, "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def upload_picture_ajax
    if is_admin? || (signed_in? && current_provider.id == Integer(params[:provider_id]))
  	  provider = Provider.find(params[:provider_id])
      if !provider.nil?
        uploaded_io = params[:image]
        filename = uploaded_io.original_filename
        extension = filename.split('.').last.downcase
        tmp_file = "#{Rails.root}/public/assets/img/profile_pic/#{provider.profile}.#{extension}"
        id = 0
        while File.exists?(tmp_file) do
          tmp_file = "#{Rails.root}/public/assets/img/profile_pic/#{provider.profile}_#{id}.#{extension}"        
          id += 1
        end
        File.open(tmp_file, 'wb') do |f|
          f.write uploaded_io.read
        end
        provider.picture_path = "../assets/img/profile_pic/" + tmp_file.split('/').last
        if provider.save
          container = { "provider_id" => provider.id, "status" => "success"}
        else
          container = { "status" => "fail", "error" => provider.errors.full_messages}
        end
      else
        container = { "status" => "fail", "error" => provider.errors.full_messages}
      end
      render :json => container.to_json
    else
	    redirect_to root_url
    end
  end
  
  def update_provider_info_ajax
    if !signed_in? || !is_admin?
      redirect_to root_url
    end
    provider = Provider.find(params[:provider_id])
    if provider.update_attributes(provider_personal_update)
      container = { "provider_id" => provider.id, "status" => "success"}
    else
      container = { "status" => "fail", "error" => provider.errors.full_messages}
    end
    render :json => container.to_json
  end

  def update_provider_information_ajax
    if is_admin? or (signed_in? && current_provider.id == Integer(params[:provider_id]))
      provider = Provider.find(params[:provider_id])
      if provider.update_attributes(provider_params_by_provider)
        container = { "status" => "success" }
        render :json => container.to_json
      else
        container = { "status" => "fail" }
        render :json => container.to_json
      end
    else
      redirect_to root_url
    end
  end
  
  def provider_simple_info_ajax
    if is_admin? or (signed_in? && current_provider.id == Integer(params[:provider_id]))
      provider = Provider.find(params[:provider_id])
      if !provider.nil?
        container = { "provider" => provider.without_secure_info, "status" => "success" }
        render :json => container.to_json
      else
        container = { "status" => "fail" }
        render :json => container.to_json
      end
    else
      redirect_to root_url
    end
  end
  
  
  # this method toggle the provider's state
  def toggle_provider_state_ajax
    if is_admin?
      provider = Provider.find(params[:provider_id])
      if !provider.nil?
        provider.active = params[:active] == "true"
        provider.save
        container = { "status" => "success" }
      else
        container = { "status" => "fail" }
      end
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end

  #--------------------------------------------------------------------------------------
  # appointments methods
  
  def appointment_detail_ajax
    appointment = Appointment.find(params[:appointment_id])
    if !appointment.nil?
      if is_admin? or (signed_in? && current_provider.id == appointment.provider_id) or (csigned_in? && current_client.id == appointment.client_id)
        container = { "appointment" => appointment, "client" => appointment.client.clean_for_ajax, "provider" => appointment.provider.without_secure_info, "status" => "success", "date" => appointment.get_start }
      else
        container = { "status" => "fail" }
      end
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def accept_appointment_ajax
    appointment = Appointment.find(params[:appointment_id])
    if !appointment.nil?
      if is_admin? or (signed_in? && current_provider.id == appointment.provider_id)
        appointment.accepted = 1
        if appointment.save
          UserMailer.appointment_accepted_email(appointment)
          container = { "status" => "success" }
        else
          container = { "status" => "fail" }
        end
      else
        container = { "status" => "fail" }
      end
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def deny_appointment_ajax
    appointment = Appointment.find(params[:appointment_id])
    if !appointment.nil?
      if is_admin? or (signed_in? && current_provider.id == appointment.provider_id)
        appointment.accepted = 2
        # something must be done with params[:deny_explanation]
        if appointment.save
          UserMailer.appointment_denied_email(appointment, params[:deny_explanation])
          container = { "status" => "success" }
        else
          container = { "status" => "fail" }
        end
      else
        container = { "status" => "fail" }
      end
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def reschedule_appointment_ajax
    appointment = Appointment.find(params[:appointment_id])
    if !appointment.nil?
      if is_admin? or (signed_in? && current_provider.id == appointment.provider_id)
        appointment.accepted = 2
        # something must be done with params[:reschedule_explanation]
        if appointment.save
          
          
          
          container = { "status" => "success" }
        else
          container = { "status" => "fail" }
        end
      else
        container = { "status" => "fail" }
      end
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  def provider_appointments_ajax
    if is_admin? or (signed_in? && current_provider.id == Integer(params[:provider_id]))
      if is_admin? and params[:provider_id] == "0"
        #appointments = Appointment.where("accepted = 0 or accepted = 1").where(['start >= ?', DateTime.now]).order("start desc")
        appointments = Appointment.where(['start >= ?', DateTime.now]).order("start desc")
      elsif is_admin?
        #appointments = Appointment.where("provider_id = #{params[:provider_id]}").where("accepted = 0 or accepted = 1").where(['start >= ?', DateTime.now]).order("start desc")
        appointments = Appointment.where("provider_id = #{params[:provider_id]}").where(['start >= ?', DateTime.now]).order("start desc")
      elsif signed_in?
        #appointments = current_provider.appointments.where("accepted = 0 or accepted = 1").where(['start >= ?', DateTime.now]).order("start desc")
        appointments = current_provider.appointments.where(['start >= ?', DateTime.now]).order("start desc")
      end
      full_clients = Hash.new
      full_providers = Hash.new
      clients = Hash.new
      dates = Hash.new
      appointments.each_with_index do |appointment, index|
        clients[index] = appointment.client.first_name + " " + appointment.client.last_name
        full_clients[index] = appointment.client.clean_for_ajax
        full_providers[index] = appointment.provider.without_secure_info
        dates[index] = appointment.get_start
      end
      container = { "status" => "success", "appointments" => appointments.order(start: :asc), "clients" => clients, "dates" => dates, "full_clients" => full_clients, "full_providers" => full_providers }
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  # this method toggle the provider time availability in a specific timeid
  #
  # there is a very important thing:
  #
  # IT TOGGLES THE TIME SPECIFIED AND THE NEXT HALF HOUR
  # 
  # BESIDES THAT, IF THE SECOND LAST HALF HOUR IS UNAVAILABLE, SO THE 
  # IMMEDIATE HALF HOUR BEFOR THESE TIME BECOME UNAVAILABLE TOO
  #
  # @params: [provider_id] 
  #          [timeid] a string in with the shape YYYY_MM_DD_W_HH:MM where W is the week
  #          day, sunday = 0
  #
  # @author: Thiago Melo
  # @version: 2015-03-21
  def toogle_provider_time_availability_ajax
    if is_admin? or (signed_in? and current_provider.id == Integer(params[:provider_id]))
      timeid = params[:timeid]
      next_time = nextTimeCellID(timeid)
      prev_time = prevTimeCellID(timeid)
      prev_prev_time = prevTimeCellID(prev_time)
      next_next_time = nextTimeCellID(next_time)
      
      provider = is_admin? ? Provider.find(params[:provider_id]) : current_provider
      
      if provider.time_unavailable(timeid)
        provider.set_time_unavailable(timeid, false)
        provider.set_time_unavailable(next_time, false)
      else
        provider.set_time_unavailable(timeid, true)
        if provider.time_unavailable(prev_prev_time)
          provider.set_time_unavailable(prev_time, true)
        end
        if provider.time_unavailable(next_next_time)
          provider.set_time_unavailable(next_time, true)
        end
      end
      container = { "status" => "success" }
    else
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  # these method return the time availability for a provider
  #
  # @params: [provider_id] the corresponding provider's id
  #          [start] usually, the first day of the week
  #          [end] usually the last day of the week
  #
  # @author: Thiago Melo
  # @version: 2015-03-21
  def provider_time_availability_ajax
    begin
      time_start = Time.at((params[:start].to_f)/1000).change({ hour: 0, min: 0, sec: 0 })
      time_end = Time.at((params[:end].to_f)/1000).change({ hour: 23, min: 59, sec: 59 })
      
      provider = Provider.find(params[:provider_id])
      slots_unavailable = provider.provider_schedules.where("time >= ? and time <= ? and unavailable = ?", time_start, time_end, true)
      container = { "status" => "success", "slots_unavailable" => slots_unavailable }
    rescue
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
  
  
  # this function should return the appointments and schedule for a provider
  # between to dates including
  #
  # @params: [provider_id] the corresponding provider's id
  #          [start] the start date
  #          [end] the end date
  #
  # @author: Thiago Melo
  # @version: 2015-04-05
  def provider_schedules_appointments_ajax
    time_start = Time.at((params[:start].to_f)/1000).change({ hour: 0, min: 0, sec: 0 })
    time_end = Time.at((params[:end].to_f)/1000).change({ hour: 23, min: 59, sec: 59 })
    
    schedules = ProviderSchedule.where("provider_id = ? and time >= ? and time <= ?", params[:provider_id], time_start, time_end)
    
    appointments = Appointment.where("provider_id = ? and start >= ? and end <= ?", params[:provider_id], time_start, time_end)
    
    if !is_admin? and !(signed_in? and current_provider.id == Integer(params[:provider_id]))
      appointments.each_with_index do |appointment, index|
        appointments[index] = appointment.safe
      end
    end
    
    container = { "status" => "success", "appointments" => appointments, "schedules" => schedules }
    render :json => container.to_json
  end
  

  #--------------------------------------------------------------------------------------
  # admin methods

  def admin
    if !signed_in? || !is_admin?
      redirect_to root_url
      return
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
    
    
    @pending_appointments = Appointment.where("accepted = 0").where(['start >= ?', DateTime.now]).order("start asc")
    @confirmed_appointments = Appointment.where("accepted = 1").where(['start >= ?', DateTime.now]).order("start asc")
    @past_appointments = Appointment.where(['start < ?', DateTime.now]).order("start desc")
    @denied_appointments = Appointment.where("accepted = 2").where(['start >= ?', DateTime.now]).order("start desc")
    
    @providers = Provider.where("admin = 0").order("first_name, last_name ASC")
    #@providers = Provider.order("first_name, last_name ASC")
  end

  def appointment_detail
    if !signed_in? || !is_admin?
      redirect_to root_url
    end
    @appointment = Appointment.find(params[:id])
  end
  
  
  
  #############################################################################
  ################## YOU CAN KNOW THAT THERE IS SOME ##########################
  ## PROBLEM WHEN YOU FIND SOMETHING LIKE THIS, YES, THIS IS A PROBLEM ########
  ########################## REMOVE THIS ######################################
  
  def create_new_admin
    @provider = Provider.new
  end
  
  def save_new_admin
    @provider = Provider.new(provider_minimum_params)
    @provider.admin = 1
    @provider.active = 1
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
    @provider.generate_token(:password_reset_token)
    if @provider.save
      redirect_to signin_path, :flash => { :success => "Now you are a very POWERFUL admin. A great power comes with a great responsibility!" } #profile_list_path #csignup_helper_path
    else
  	  if Provider.where("email = '" + @provider.email + "'").length > 0
  		  flash.now[:error] = 'Email already registered. Have you forgot your password?'
  	  else
  	    flash.now[:error] = 'It was not possible to create your user.'
  	  end
      render 'new'
    end
  end
  
  #############################################################################
  #############################################################################
  #############################################################################

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
    
    def provider_personal_update
      params.require(:provider).permit(:first_name, :last_name, :email, :expertise, :abstract, :about, :phone, :admin)	
    end
    
    def provider_params_by_provider
      params.require(:provider).permit(:first_name, :last_name, :email, :phone, :expertise, :about, :abstract)
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
    
    def provider_update_password
      params.require(:provider).permit(:password, :password_confirmation)
    end
end