class Provider < ActiveRecord::Base
	has_many :appointments, dependent: :destroy
	has_many :services, dependent: :destroy
	has_many :certifications, dependent: :destroy
	has_many :areas, dependent: :destroy
	has_many :reviews, dependent: :destroy
	has_many :specialties, dependent: :destroy
	has_many :clients, :through => :appointments
	
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
	  #UserMailer.password_recovery(self).deliver
	  UserMailer.password_recovery_email(self)
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
