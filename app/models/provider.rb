class Provider < ActiveRecord::Base
	has_many :appointments, dependent: :destroy
	has_many :services, dependent: :destroy
	has_many :certifications, dependent: :destroy
	has_many :areas, dependent: :destroy
	has_many :reviews, dependent: :destroy
	has_many :specialties, dependent: :destroy
	has_many :clients, :through => :appointments
	has_many :provider_schedules, dependent: :destroy
	
	before_save { self.email = email.downcase }
	
	validates :first_name, presence: true, length: { maximum: 50 }
	validates :last_name, presence: true, length: { maximum: 50 }
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: true
	validates :admin, presence: true
	#validates :profile, presence: true
	has_secure_password
	validates :password, presence: true, length: {minimum: 6}, on: :create
	validates :password, length: {minimum: 6}, on: :update, allow_blank: true
	
	def Provider.new_remember_token
		SecureRandom.urlsafe_base64
	end

	# Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = Provider.new_remember_token
    update_attribute(:remember_token, Provider.digest(remember_token))
  end
  
  # Forgets a user.
  def forget
    update_attribute(:remember_token, nil)
  end

	def Provider.digest(token)
		Digest::SHA1.hexdigest(token.to_s)
	end
	
	after_save :reload_routes

	def reload_routes
		ProvidersController.reload
	end

	def without_secure_info
    return self.slice(:picture_path, :first_name, :last_name, :expertise, :email, :phone, :abstract, :about, :admin, :specialty_text, :service_text, :policies)
  end
  
  def send_password_reset
	  generate_token(:password_reset_token)
	  self.password_reset_sent_at = Time.zone.now
	  save!
	  #UserMailer.new.password_recovery(self).deliver
	  UserMailer.new.password_recovery_email(self)
	end
	
	# this method return if the provider is available for some specific
	# time received as param, this is for APPOINTMENTS
	#
	# @params: [timeid] a string in with the shape YYYY_MM_DD_W_HH:MM where W is the week
  #          day, sunday = 0
	#
	# @author: Thiago Melo
	# @version: 2015-04-10
	def time_available(timeid)
		timeval = DateTime.strptime(timeid,"%Y_%m_%d_%w_%H_%M")
		time_ini = timeval - 20.minute
		time_end = timeval + 80.minute
		
		appointment = self.appointments.where('time_start >= ? and time_end <= ?', time_ini, time_end).first
		
		if appointment.nil?
			time_ini = timeval - 50.minute
			time_end = timeval + 50.minute
			appointment = self.appointments.where('time_start >= ? and time_end <= ?', time_ini, time_end).first
			if appointment.nil?
				return true
			end
			return false
		end
		return false
	end
	
	# this method return if the provider is available for some specific
	# time received as param
	#
	# @params: [timeid] a string in with the shape YYYY_MM_DD_W_HH:MM where W is the week
  #          day, sunday = 0
	#
	# @author: Thiago Melo
	# @version: 2015-03-21
	def time_unavailable(timeid)
		slot = ProviderSchedule.where("provider_id = ? and timeid = ?", self.id, timeid).first
		if !slot.nil?
			return slot.unavailable
		else
			return false
		end
	end
	
	# this method toggle a specifica time availability
	#
	# @params: [timeid] a string in with the shape W_HH:MM where W is the week
  #          day, sunday = 0
	#
	# @author: Thiago Melo
	# @version: 2015-03-21
	def toggle_time(timeid)
		slot = ProviderSchedule.where("provider_id = ? and timeid = ?", self.id, timeid).first
    if !slot.nil?
      slot.toggle :unavailable
    else
      slot = ProviderSchedule.new
      slot.provider_id = self.id
      slot.timeid = timeid
      slot.unavailable = true
      slot.time = Date.strptime(timeid,"%Y_%m_%d_%w_%H_%M")
    end
    slot.save
	end
	
	# this method sets a timeid slot to available or unavailable
	#
	# @params: [timeid] a string in with the shape W_HH:MM where W is the week
  #          day, sunday = 0
  #          [unavailable] a boolean
	#
	# @author: Thiago Melo
	# @version: 2015-03-21
	def set_time_unavailable(timeid, unavailable)
		slot = ProviderSchedule.where("provider_id = ? and timeid = ?", self.id, timeid).first
    if slot.nil?
      slot = ProviderSchedule.new
      slot.provider_id = self.id
      slot.timeid = timeid
      slot.time = Time.strptime(timeid,"%Y_%m_%d_%w_%H_%M")
    end
    slot.unavailable = unavailable
    slot.save
	end
	
	def generate_token(column)
	  begin
	    self[column] = SecureRandom.urlsafe_base64
	  end while Provider.exists?(column => self[column])
	end
	
	private
		def create_remember_token
			self.remember_token = Provider.digest(Provider.new_remember_token)
		end
end
