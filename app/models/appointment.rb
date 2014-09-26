class Appointment < ActiveRecord::Base
	belongs_to :provider
	default_scope -> { order('start ASC') }
	validates :provider_id, presence: true
	validates :client_id, presence: true
	validates :start, presence: true
	validates :end, presence: true
	validates :accepted, presence: true
end
