class Specialty < ActiveRecord::Base
	belongs_to :provider
	validates :provider_id, presence: true
	validates :specialty, presence: true
end
