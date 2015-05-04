class UserMailer < ActionMailer::Base
  default from: "thiago.alaya@gmail.com" #"admin@careforme.co"
  
  def password_recovery(user)
    @user = user
    # I am overriding the 'to' default
    mail(to: @user.email, subject: 'Password recovery')
  end
  
  def simple_mail_deliver(to_name, to, subject, text, html, tags, from = nil, from_name = nil, reply_to = nil)
    require 'mandrill'
    mandrill = Mandrill::API.new 'zd221qsTtG-5nif9P7TKwQ'
    default_from = from.presence || "admin@careforme.co"
    default_from_name = from_name.presence || "CareForMe Team"
    default_reply_to = reply_to.presence || "contact@careforme.co"
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
        "metadata"=>{"website"=>"CareForMe.co"},
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
  
  def simple_template_email(template, to_name, to, subject, text, html, tags, from = nil, from_name = nil, reply_to = nil, hash)
    require 'mandrill'
    mandrill = Mandrill::API.new 'zd221qsTtG-5nif9P7TKwQ'
    default_from = from.presence || "admin@careforme.co"
    default_from_name = from_name.presence || "CareForMe Team"
    default_reply_to = reply_to.presence || "contact@careforme.co"
    
    begin
      template_name = template
      #template_content = hash
      template_content = [{"content"=>"example content", "name"=>"example name"}]
      message = {
        "tags" => tags,
        "important" => false,
        "subject" => subject,
        "text" => text,
        "html" => html,
        "from_email" => default_from,
        "headers" => { "Reply-To" => default_reply_to },
        "from_name" => default_from_name,
        "merge_language" => "mailchimp",
        "inline_css" => nil,
        "auto_html" => true,
        "to"=>
          [{"name" => to_name,
              "type" => "to",
              "email" => to}],
        "metadata" => { "website" => "CareForMe.co" },
        "merge_vars" => [
          {
            "rcpt" => to,
            "vars" => hash
          }
        ]
      }
      async = false
      ip_pool = "Main Pool"
      result = mandrill.messages.send_template template_name, template_content, message, async, ip_pool
      puts result
          # [{"_id"=>"abc123abc123abc123abc123abc123",
          #     "status"=>"sent",
          #     "email"=>"recipient.email@example.com",
          #     "reject_reason"=>"hard-bounce"}]
      
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
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{user.first_name}" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/password_recovery_edit?id=#{user.password_reset_token}"
      }
    ]
    simple_template_email("V2forgot-password", user.first_name, user.email, "Password recovery", text, html, ["password-resets"], nil, nil, nil, hash)
  end
  
  def welcome_client_email (user)
    
    html = <<-HTML_END
    <p>Dear,</p>
    <p>Welcome to CareForMe!</p>
    <p>To confirm your register, please, access the following address:</p>
    <p>#{default_url}/client_confirmation?id=#{user.password_reset_token}</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear,
    
    Welcome to CareForMe!
    
    To confirm your register, please, access the following address:
    
    #{default_url}/client_confirmation?id=#{user.password_reset_token}
    
    Regards,
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "" 
      },
      { 
        "name" => "lname" , 
        "content" => "" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/client_confirmation?id=#{user.password_reset_token}"
      }
    ]
    simple_template_email("V4SignUp-Template", "", user.email, "Welcome", text, html, ["welcome-client"], nil, nil, nil, hash)
  end
  
  def welcome_client_email_bkp (user)
    
    html = <<-HTML_END
    <p>Dear #{user.first_name},</p>
    <p>Welcome to CareForMe!</p>
    <p>To confirm your register, please, access the following address:</p>
    <p>#{default_url}/client_confirmation?id=#{user.password_reset_token}</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{user.first_name},
    
    Welcome to CareForMe!
    
    To confirm your register, please, access the following address:
    
    #{default_url}/client_confirmation?id=#{user.password_reset_token}
    
    Regards,
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{user.first_name}" 
      },
      { 
        "name" => "lname" , 
        "content" => "#{user.last_name}" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/client_confirmation?id=#{user.password_reset_token}"
      }
    ]
    simple_template_email("V4SignUp-Template", user.first_name, user.email, "Welcome", text, html, ["welcome-client"], nil, nil, nil, hash)
  end
  
  # this method should send a email to de providers after her signup
  #
  # @params: [provider] an ActiveRecord with the provider
  #
  # @author: Thiago Melo
  # @version: 2015-04-04
  #
  def welcome_provider_email (user)
    html = <<-HTML_END
    <p>Dear #{user.first_name},</p>
    <p>Welcome to CareForMe!</p>
    <p>To confirm your register, please, access the following address:</p>
    <p>#{default_url}/provider_confirmation?id=#{user.password_reset_token}</p>
    <p></p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{user.first_name},
    
    Welcome to CareForMe!
    
    To confirm your register, please, access the following address:
    
    #{default_url}/provider_confirmation?id=#{user.password_reset_token}
    
    Regards,
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{user.first_name}" 
      },
      { 
        "name" => "lname" , 
        "content" => "#{user.last_name}" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/provider_confirmation?id=#{user.password_reset_token}"
      }
    ]
    simple_template_email("V4SignUp-Partner-Template", user.first_name, user.email, "Welcome", text, html, ["welcome-provider"], nil, nil, nil, hash)
  end
  
  def appointment_booked_email (appointment)
    html = <<-HTML_END
    <p>Dear #{appointment.client.first_name},</p>
    <p>Your booking request has been sent! Thank you for choose CareForMe.</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Dear #{appointment.client.first_name},
    
    Your booking request has been sent! Thank you for choose CareForMe.
    
    Regards,
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{appointment.client.first_name}" 
      }
    ]
    simple_template_email("V3Acknowledgement-Template", appointment.client.first_name, appointment.client.email, "Booking request", text, html, ["booking-request-client"], nil, nil, nil, hash)
    
    appointment_date = (appointment.time_start + 20.minutes).strftime("%A, %B %d, %Y")
    appointment_time = (appointment.time_start + 20.minutes).strftime("%I:%M %p")
    html = <<-HTML_END
    <p>Hi,</p>
    <p>A booking request has been arraived.</p>
    <p>Its information is:</p>
    <br><br>
    <p>Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}</p>
    <p>Expertise: #{appointment.provider.expertise}</p>
    <p>Phone: #{appointment.provider.phone}</p>
    <p>Email: #{appointment.provider.email}</p>
    <br><br>
    <p>Client: #{appointment.client.first_name} #{appointment.client.last_name}</p>
    <p>Phone: #{appointment.client.phone}</p>
    <p>Email: #{appointment.client.email}</p>
    <p>Weeks: #{appointment.client.weeks_pregnant}</p>
    <br><br>
    <p>Appointment details:</p>
    <p>Date: #{appointment_date}</p> 
    <p>Time: #{appointment_time}</p>
    <p>Location: #{appointment.client.address}</p>
    <p>Observation: #{appointment.client_observation}</p>
    <br>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi,
    
    A booking request has been arraived.
    
    Its information is:
    
    Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}
    Expertise: #{appointment.provider.expertise}
    Phone: #{appointment.provider.phone}
    Email: #{appointment.provider.email}
    
    Client: #{appointment.client.first_name} #{appointment.client.last_name}
    Phone: #{appointment.client.phone}
    Email: #{appointment.client.email}
    Weeks: #{appointment.client.weeks_pregnant}
    
    Appointment details:
    Date: #{appointment_date}
    Time: #{appointment_time}
    Location: #{appointment.client.address}
    Observation: #{appointment.client_observation}
    
    Regards,
    CareForMe Team
    TEXT_END
    #simple_mail_deliver(appointment.provider.first_name, appointment.provider.email, "Booking request", text, html, ["booking-request-provider"])
    simple_mail_deliver("Neha", "neha@careforme.co", "Booking request - #{appointment.provider.first_name} #{appointment.provider.last_name} - #{appointment_date}", text, html, ["booking-request-provider"])
    #simple_mail_deliver("Thiago Melo", "thiago.alaya@gmail.com", "Booking request - #{appointment.provider.first_name} #{appointment.provider.last_name} - #{appointment_date}", text, html, ["booking-request-provider"])
    simple_mail_deliver("Neha", "neha.alaya@gmail.com", "Booking request - #{appointment.provider.first_name} #{appointment.provider.last_name} - #{appointment_date}", text, html, ["booking-request-provider"])
  end
  
  def appointment_accepted_email (appointment)
    
    appointment_date = (appointment.time_start + 20.minutes).strftime("%A, %B %d, %Y")
    appointment_time = (appointment.time_start + 20.minutes).strftime("%I:%M %p")
    
    html = <<-HTML_END
    <p>Hi #{appointment.client.first_name},</p>
    <p>Your appointment is confirmed. Please find the details below.</p>
    <p>Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}</p>
    <p>Date: #{appointment_date}</p> 
    <p>Time: #{appointment_time}</p>
    <p>Location: #{appointment.client.address}</p>
    <p>We understand things happen and plans change. In case there is any change in your schedule and you need to cancel, please refer to your provider's policy section for the cancellation policy.</p>
    <p>Thanks</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi #{appointment.client.first_name},
    
    Your appointment is confirmed. Please find the details below.
    
    Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}
    
    Date: #{appointment_date} 
    
    Time: #{appointment_time} 
    
    Location: #{appointment.client.address} 
    
    We understand things happen and plans change. In case there is any change in your schedule and you need to cancel, please refer to your provider's policy section for the cancellation policy.
    
    Thanks
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name", 
        "content" => "#{appointment.client.first_name}" 
      },
      { 
        "name" => "provider", 
        "content" => "#{appointment.provider.first_name} #{appointment.provider.last_name}" 
      },
      { 
        "name" => "date",
        "content" => "#{appointment_date}"
      },
      { 
        "name" => "time",
        "content" => "#{appointment_time}"
      },
      { 
        "name" => "location",
        "content" => "#{appointment.client.address}"
      }
    ]
    simple_template_email("Confirmation-template", appointment.client.first_name, appointment.client.email, "Appointment accepted", text, html, ["appointment-accpeted"], nil, nil, nil, hash)
  end
  
  def contact_message_email (name, email, message)
    default_to = "tapan.alaya@gmail.com"
    message_html = message
    message_html.gsub!(/\n/, '<br/>')
    html = <<-HTML_END
    <p><b>Name:</b> #{name}</p>
    <p><b>Email:</b> #{email}</p>
    <p><b>Message:</b></p>
    <p>#{message_html}</p>
    HTML_END
    text = <<-TEXT_END
    Name: #{name}
    
    Email: #{email}
    
    Message:
    
    #{message}
    TEXT_END
    simple_mail_deliver("Website contact", default_to, "Contact through website", text, html, ["contact"], nil, nil, email)
  end
  
  # it sends a message to admin about someone intending to become a
  # a provider
  #
  # @params: [email] is the person's email
  # @author: Thiago Melo
  # @version: 2015-03-14
  def sendNoteToBecomePartner (email)
    (to_name, to, subject, text, html, tags, from = nil, from_name = nil, reply_to = nil)
    
    html = <<-HTML_END
    <p>Hi Neha,</p>
    <p>This person is intending to become a provider.</p>
    <p>Can you contact her please?</p>
    <p><b>Email:</b> #{email}</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi Neha,
    
    This person is intending to become a provider.
    
    Can you contact her please?
    
    Email: #{email}
    
    Regards,
    
    CareForMe Team
    TEXT_END
    
    simple_mail_deliver("Neha", "neha@careforme.co", "Booking request - #{DateTime.now}", text, html, ["intention-note"])
    simple_mail_deliver("Neha", "neha.alaya@gmail.com", "Booking request - #{DateTime.now}", text, html, ["intention-note"])
    #simple_mail_deliver("Thiago Melo", "thiago.alaya@gmail.com", "Booking request - #{DateTime.now}", text, html, ["intention-note"])
  end
  
  # ***** right now: only the admin is been mailed *************
  # it send emails for the client, provider and admin
  # dua to a client's willing in reschedule
  #
  # @params: [appointment] is the object corresponding to the appointment
  #           to be rescheduled
  #          [reschedule_message] is the message sent bt the client
  #
  # @author: Thiago Melo
  # @version: 2015-03-16
  def sendRescheduleRequest (appointment, reschedule_message)
    appointment_date = (appointment.time_start + 20.minutes).strftime("%A, %B %d, %Y")
    appointment_time = (appointment.time_start + 20.minutes).strftime("%I:%M %p")
    
    html = <<-HTML_END
    <p>Hi Neha,</p>
    <p>This person is intending to reschedue an appointment:</p>
    <br><br>
    <p>Client: #{appointment.client.first_name} #{appointment.client.last_name}</p>
    <p>Phone: #{appointment.client.phone}</p>
    <p>Email: #{appointment.client.email}</p>
    <p>Weeks: #{appointment.client.weeks_pregnant}</p>
    <br><br>
    <p>This is her message:</p>
    <p>----------------------------------------------------------</p>
    <p>#{reschedule_message}</p>
    <p>----------------------------------------------------------</p>
    <br><br>
    <p>Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}</p>
    <p>Expertise: #{appointment.provider.expertise}</p>
    <p>Phone: #{appointment.provider.phone}</p>
    <p>Email: #{appointment.provider.email}</p>
    <br><br>
    <p>Appointment details:</p>
    <p>Date: #{appointment_date}</p> 
    <p>Time: #{appointment_time}</p>
    <p>Location: #{appointment.client.address}</p>
    <p>Observation: #{appointment.client_observation}</p>
    <br>
    <p>Can you contact her please?</p>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi Neha,

    This person is intending to reschedue an appointment:

    
    Client: #{appointment.client.first_name} #{appointment.client.last_name}

    Phone: #{appointment.client.phone}

    Email: #{appointment.client.email}

    Weeks: #{appointment.client.weeks_pregnant}
  
    
    This is her message:
    ----------------------------------------------------------
    
    #{reschedule_message}
    
    ----------------------------------------------------------
    
    Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}

    Expertise: #{appointment.provider.expertise}

    Phone: #{appointment.provider.phone}

    Email: #{appointment.provider.email}

    
    Appointment details:

    Date: #{appointment_date}
 
    Time: #{appointment_time}

    Location: #{appointment.client.address}

    Observation: #{appointment.client_observation}

    
    Can you contact her please?

    Regards,

    CareForMe Team
    TEXT_END
    
    simple_mail_deliver("Neha", "neha@careforme.co", "Reschedule request - #{DateTime.now}", text, html, ["reschedule-request"])
    simple_mail_deliver("Neha", "neha.alaya@gmail.com", "Reschedule request - #{DateTime.now}", text, html, ["reschedule-request"])
    simple_mail_deliver("Thiago Melo", "thiago.alaya@gmail.com", "Reschedule request - #{DateTime.now}", text, html, ["reschedule-request"])
  end
  
  # ***** right now: only the admin and the client are been mailed *************
  # this method should send emails for the client, the provider and the admin
  # lettng then know about a booking canceled
  # 
  # @params: [appointment] is the object corresponding to the appointment
  #           that has been canceled
  #
  # @author: Thiago Melo
  # @version: 2015-03-14
  def sendCancelingBooking(appointment)
    appointment_date = (appointment.time_start + 20.minutes).strftime("%A, %B %d, %Y")
    appointment_time = (appointment.time_start + 20.minutes).strftime("%I:%M %p")
    
    html = <<-HTML_END
    <p>Hi #{appointment.client.first_name},</p>
    <p>Your appointment with #{appointment.provider.first_name} #{appointment.provider.last_name} on #{appointment_date} at #{appointment_time}  has been canceled</p>
    <p>Need to reschedule? <a href="#{default_url}/profile_list">Click</a> here to book another appointment!</p>
    <p>Thanks</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi #{appointment.client.first_name},
    
    Your appointment with #{appointment.provider.first_name} #{appointment.provider.last_name} on #{appointment_date} at #{appointment_time}  has been canceled
    
    Need to reschedule? Access our website to book another appointment!
    
    #{default_url}/profile_list
    
    Thanks
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{appointment.client.first_name}" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/profile_list"
      },
      { 
        "name" => "date",
        "content" => "#{appointment_date}"
      },
      { 
        "name" => "time",
        "content" => "#{appointment_time}"
      },
      { 
        "name" => "provider",
        "content" => "#{appointment.provider.first_name} #{appointment.provider.last_name}"
      }
    ]
    simple_template_email("Cancellation-Template", appointment.client.first_name, appointment.client.email, 
      "Canceling booking", text, html, ["canceling-appointment-client"], nil, nil, reply_to = nil, hash)
      
    
    html = <<-HTML_END
    <p>Hi Neha,</p>
    <p>This person has canceled her appointment:</p>
    <br><br>
    <p>Client: #{appointment.client.first_name} #{appointment.client.last_name}</p>
    <p>Phone: #{appointment.client.phone}</p>
    <p>Email: #{appointment.client.email}</p>
    <p>Weeks: #{appointment.client.weeks_pregnant}</p>
    <br><br>
    <p>Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}</p>
    <p>Expertise: #{appointment.provider.expertise}</p>
    <p>Phone: #{appointment.provider.phone}</p>
    <p>Email: #{appointment.provider.email}</p>
    <br><br>
    <p>Appointment details:</p>
    <p>Date: #{appointment_date}</p> 
    <p>Time: #{appointment_time}</p>
    <p>Location: #{appointment.client.address}</p>
    <p>Observation: #{appointment.client_observation}</p>
    <br>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi Neha,

    This person has canceled her appointment:

    
    Client: #{appointment.client.first_name} #{appointment.client.last_name}

    Phone: #{appointment.client.phone}

    Email: #{appointment.client.email}

    Weeks: #{appointment.client.weeks_pregnant}
  
    
    Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}

    Expertise: #{appointment.provider.expertise}

    Phone: #{appointment.provider.phone}

    Email: #{appointment.provider.email}

    
    Appointment details:

    Date: #{appointment_date}
 
    Time: #{appointment_time}

    Location: #{appointment.client.address}

    Observation: #{appointment.client_observation}

    
    Regards,

    CareForMe Team
    TEXT_END
    
    simple_mail_deliver("Neha", "neha@careforme.co", "Canceling appointment (client) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment-client"])
    simple_mail_deliver("Neha", "neha.alaya@gmail.com", "Canceling appointment (client) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment-client"])
    simple_mail_deliver("Thiago Melo", "thiago.alaya@gmail.com", "Canceling appointment (client) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment-client"])
  end
  
  
  # this method should perform the canceling requested by the
  # provider
  #
  # @params: [appointment] an object containing the corresponding appointment
  #          [explanation] the provider explanation
  #
  # @author: Thiago Melo
  # @version: 2015-03-16
  def appointment_denied_email (appointment, explanation)
    
    appointment_date = (appointment.time_start + 20.minutes).strftime("%A, %B %d, %Y")
    appointment_time = (appointment.time_start + 20.minutes).strftime("%I:%M %p")
    
    html = <<-HTML_END
    <p>Hi #{appointment.client.first_name},</p>
    <p>Your appointment with #{appointment.provider.first_name} #{appointment.provider.last_name} on #{appointment_date} at #{appointment_time}  has been canceled</p>
    <p>The practitioner has left the following message for you:</p>
    <p><b>#{explanation}</b></p>
    <p>Need to reschedule? <a href="#{default_url}/profile_list">Click</a> here to book another appointment!</p>
    <p>Thanks</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi #{appointment.client.first_name},
    
    Your appointment with #{appointment.provider.first_name} #{appointment.provider.last_name} on #{appointment_date} at #{appointment_time}  has been canceled
    
    The practitioner has left the following message for you:
    
    #{explanation}
    
    Need to reschedule? Access our website to book another appointment!
    
    #{default_url}/profile_list
    
    Thanks
    
    CareForMe Team
    TEXT_END
    
    hash = [
      { 
        "name" => "name" , 
        "content" => "#{appointment.client.first_name}" 
      },
      { 
        "name" => "link" , 
        "content" => "#{default_url}/profile_list"
      },
      { 
        "name" => "date",
        "content" => "#{appointment_date}"
      },
      { 
        "name" => "time",
        "content" => "#{appointment_time}"
      },
      { 
        "name" => "provider",
        "content" => "#{appointment.provider.first_name} #{appointment.provider.last_name}"
      },
      { 
        "name" => "explanation",
        "content" => "#{explanation}"
      }
    ]
    simple_template_email("Cancellation-Template-provider", appointment.client.first_name, appointment.client.email, 
      "Canceling booking", text, html, ["canceling-appointment-provider"], nil, nil, reply_to = nil, hash)
      
    
    html = <<-HTML_END
    <p>Hi Neha,</p>
    <p>This provider has canceled her appointment:</p>
    <br><br>
    <p>Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}</p>
    <p>Expertise: #{appointment.provider.expertise}</p>
    <p>Phone: #{appointment.provider.phone}</p>
    <p>Email: #{appointment.provider.email}</p>
    <br><br>
    <p>It is his/her explanation</p>
    <p>----------------------------------------------------------</p>
    <p>#{explanation}</p>
    <p>----------------------------------------------------------</p>
    <br><br>
    <p>Client: #{appointment.client.first_name} #{appointment.client.last_name}</p>
    <p>Phone: #{appointment.client.phone}</p>
    <p>Email: #{appointment.client.email}</p>
    <p>Weeks: #{appointment.client.weeks_pregnant}</p>
    <br><br>
    <p>Appointment details:</p>
    <p>Date: #{appointment_date}</p> 
    <p>Time: #{appointment_time}</p>
    <p>Location: #{appointment.client.address}</p>
    <p>Observation: #{appointment.client_observation}</p>
    <br>
    <p>Regards,</p>
    <p>CareForMe Team</p>
    HTML_END
    text = <<-TEXT_END
    Hi Neha,

    This provider has canceled her appointment:
    
    Practitioner: #{appointment.provider.first_name} #{appointment.provider.last_name}

    Expertise: #{appointment.provider.expertise}

    Phone: #{appointment.provider.phone}

    Email: #{appointment.provider.email}
    
    It is his/her explanation
    ----------------------------------------------------------
    #{explanation}
    ----------------------------------------------------------


    Client: #{appointment.client.first_name} #{appointment.client.last_name}

    Phone: #{appointment.client.phone}

    Email: #{appointment.client.email}

    Weeks: #{appointment.client.weeks_pregnant}
    
    
    Appointment details:

    Date: #{appointment_date}
 
    Time: #{appointment_time}

    Location: #{appointment.client.address}

    Observation: #{appointment.client_observation}

    
    Regards,

    CareForMe Team
    TEXT_END
    
    simple_mail_deliver("Neha", "neha@careforme.co", "Canceling appointment (provider) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment"])
    simple_mail_deliver("Neha", "neha.alaya@gmail.com", "Canceling appointment (provider) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment"])
    simple_mail_deliver("Thiago Melo", "thiago.alaya@gmail.com", "Canceling appointment (provider) - #{DateTime.now.strftime("%A, %B %d, %Y - %I:%M %p")}", text, html, ["canceling-appointment"])
    
  end
  
  def default_url
    #return "http://alaya-c9-thiagomelo.c9.io"
    return "http://careforme.co"
  end
end
