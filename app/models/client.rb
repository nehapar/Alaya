class Client < ActiveRecord::Base
  has_many :appointments, dependent: :destroy
  has_many :providers, :through => :appointments

  before_save { self.email = email.downcase }
  validates :first_name,  presence: true, length: { maximum: 50 }
  validates :last_name,  presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: {minimum: 6}, on: :create
  validates :password, length: {minimum: 6}, on: :update, allow_blank: true

  def Client.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def Client.digest(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  after_save :reload_routes

  def reload_routes
    ClientsController.reload
  end
  
  def clean_for_ajax
    return self.slice(:id, :first_name, :last_name, :phone, :address, :weeks_pregnant, :profile)
  end
  
  def create_adjusts
    self.active = 1
    if self.last_name.include? "'"
      self.profile = self.first_name.downcase + "_" + self.last_name.downcase.gsub("'","")
    else
      self.profile = self.first_name.downcase + "_" + self.last_name.downcase
    end
    if self.profile.include? " "
      self.profile = self.profile.gsub(" ","_")
    end
    if self.profile.include? "-"
      self.profile = self.profile.gsub("-","_")
    end
    id = 0
    profile = self.profile
    while Client.where("profile = '#{self.profile}'").length > 0 do
      self.profile = "#{profile}_#{id}"        
      id += 1
    end
  end

  private

    def create_remember_token
      self.remember_token = Client.digest(Client.new_remember_token)
    end
end

