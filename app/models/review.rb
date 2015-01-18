class Review < ActiveRecord::Base
	belongs_to :provider
	validates :provider_id, presence: true
	validates :review, presence: true
	validates :author, presence: true
end
