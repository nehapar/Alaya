class WebSiteController < ApplicationController
  def index
  end

  def profile_list
  end

  def partners
  end

  def profile_detail
  end

  def faq
  end

  def contact
  end

  def about
  end
  
  def contact_message
    begin
      UserMailer.contact_message_email(params[:name], params[:email], params[:message])
      redirect_to contact_path, :flash => { :success => "Your message has been sent. Thank you so much for contact us." }
    rescue
      redirect_to contact_path, :flash => { :danger => "Sorry, we have a problem, your message has not been sent." }
    end
  end
  
  #------------------- ajax methods
  
  # send someone's intention to become a provider to the admin
  # @params 
  #   get: [email]
  def provider_intention_note_ajax
    begin
      UserMailer.sendNoteToBecomePartner(params[:email])
      container = { "status" => "success" }
    rescue
      container = { "status" => "fail" }
    end
    render :json => container.to_json
  end
end
