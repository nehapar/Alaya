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
      redirect_to contact_path, :success => "Your message has been sent. Thank you so much."
    rescue
      redirect_to contact_path, :danger => "Sorry, we have a problem, your message has not been sent."
    end
    
    
  end
end
