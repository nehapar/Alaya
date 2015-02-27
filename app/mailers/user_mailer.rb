class UserMailer < ActionMailer::Base
  default from: "thiago.alaya@gmail.com" #"admin@careforme.co"
  
  def password_recovery(user)
    @user = user
    # I am overriding the 'to' default
    mail(to: @user.email, subject: 'Password recovery')
  end
  
  def simple_mail_deliver(to_name, to, subject, text, html, tags)
    require 'mandrill'
    mandrill = Mandrill::API.new '0tRCw5a7xObbw2GseSnHaQ'
    default_from = "admin@careforme.co"
    default_from_name = "CareForMe Team"
    default_reply_to = "contact@careforme.co"
    begin
      message = {
        "tags"=>tags,
        "important"=>false,
        "subject"=>subject,
        "text"=>text,
        "html"=>html,
        "from_email"=>default_from,
        "headers"=>{"Reply-To"=>default_reply_to},
        "from_name"=>default_from_name,
        "merge_language"=>"mailchimp",
        "inline_css"=>nil,
        "auto_html"=>true,
        "to"=>
          [{"name"=>to_name,
              "type"=>"to",
              "email"=>to}],
        "metadata"=>{"website"=>"careforme.co"},
        "preserve_recipients"=>nil,
      }
      async = false
      ip_pool = "Main Pool"
      result = mandrill.messages.send message, async, ip_pool
    rescue Mandrill::Error => e
        # Mandrill errors are thrown as exceptions
        puts "A mandrill error occurred: #{e.class} - #{e.message}"
        # A mandrill error occurred: Mandrill::UnknownSubaccountError - No subaccount exists with the id 'customer-123'    
        raise
    end
  end
  
  def password_recovery_email (user)
    html = <<-HTML_END
    <p>Dear #{user.first_name},</p>
    <p>If you requested a new password, please, access the following address:</p>
    <p>#{default_url}/password_recovery_edit?id=#{user.password_reset_token}</p>
    <p>If you did not request your password to be reset, just ignore this email and your password will continue to stay the same.</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{user.first_name},
    
    If you requested a new password, please, access the following address:
    
    #{default_url}/password_recovery_edit?id=#{user.password_reset_token}
    
    If you did not request your password to be reset, just ignore this email and your password will continue to stay the same.
    
    Regards,
    
    CareForMe Team
    TEXT_END
    simple_mail_deliver(user.first_name, user.email, "Password recovery", text, html, ["password-resets"])
  end
  
  def welcome_client_email (user)
    html = <<-HTML_END
    <p>Dear #{user.first_name},</p>
    <p>Welcome to CareForMe!</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{user.first_name},
    
    Welcome to CareForMe!
    
    Regards,
    
    CareForMe Team
    TEXT_END
    simple_mail_deliver(user.first_name, user.email, "Welcome", text, html, ["welcome-client"])
  end
  
  def welcome_provider_email (user)
    html = <<-HTML_END
    <p>Dear #{user.first_name},</p>
    <p>Welcome to CareForMe!</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{user.first_name},
    
    Welcome to CareForMe!
    
    Regards,
    
    CareForMe Team
    TEXT_END
    simple_mail_deliver(user.first_name, user.email, "Welcome", text, html, ["welcome-provider"])
  end
  
  def default_url
    return "http://alaya-c9-thiagomelo.c9.io"
  end
end
