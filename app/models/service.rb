class Service < ActiveRecord::Base
	belongs_to :provider
	validates :provider_id, presence: true
	validates :service, presence: true
end
