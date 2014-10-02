class Area < ActiveRecord::Base
	belongs_to :provider
	validates :provider_id, presence: true
	validates :area, presence: true
end
