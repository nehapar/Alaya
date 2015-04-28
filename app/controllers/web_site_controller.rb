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
  
  def search_zip
    if params[:zip_code].present?
      is_bay_area = false
      ba_zips = bayAreaZipCodes
      ba_zips.each do |zip|
        if zip == params[:zip_code]
          is_bay_area = true
        end
      end
      @zip_code = ZipCode.new(zip: params[:zip_code])
      @zip_code.save
      if is_bay_area
        redirect_to profile_list_path
      end
    else
      redirect_to profile_list_path
    end
  end
  
  def alert_me_when_launch
    zip_code = ZipCode.find(params[:zip_code][:id])
    zip_code.update_attributes(zip_code_params)
  end
  
  def contact_message
    begin
      UserMailer.contact_message_email(params[:name], params[:email], params[:message])
      redirect_to contact_path, :flash => { "success" => "Your message has been sent. Thank you so much for contacting us." }
    rescue
      redirect_to contact_path, :flash => { "danger" => "Sorry, we have a problem, your message has not been sent." }
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
  
  private
    def zip_code_params
      params.require(:zip_code).permit(:email)
    end
end
