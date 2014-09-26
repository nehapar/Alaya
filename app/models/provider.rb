class Provider < ActiveRecord::Base
	has_many :appointments, dependent: :destroy
  before_save { self.email = email.downcase }
	validates :first_name, presence: true, length: { maximum: 50 }
	validates :last_name, presence: true, length: { maximum: 50 }
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  	validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: true
	validates :permission, presence: true
	has_secure_password
	validates :password, length: { minimum: 6 }
	
	def Provider.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def Provider.digest(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private

    def create_remember_token
      self.remember_token = Provider.digest(Provider.new_remember_token)
    end
end
