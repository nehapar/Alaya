class Certification < ActiveRecord::Base
	belongs_to :provider
	validates :provider_id, presence: true
	validates :certification, presence: true
end
