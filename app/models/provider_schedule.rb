class ProviderSchedule < ActiveRecord::Base
  validates :provider_id, presence: true
  validates :time, presence: true
  validates :unavailable, :inclusion => {:in => [true, false]}
  
  belongs_to :provider
end
