class Appointment < ActiveRecord::Base
	belongs_to :provider
	belongs_to :client
	#default_scope -> { order('start ASC') }
	validates :provider_id, presence: true
	validates :client_id, presence: true
	validates :time_start, presence: true
	validates :time_end, presence: true
	validates :accepted, presence: true
	
	def get_start
		return (self.time_start + 20.minutes).strftime("%H:%M:%S - %A, %B %dth, %Y")
	end
	
	def get_start_adjusted
		return (self.time_start + 20.minutes)
	end
	
	def safe
		return self.slice(:time_start, :time_end)
	end
end
