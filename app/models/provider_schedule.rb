class ProviderSchedule < ActiveRecord::Base
  validates :provider_id, presence: true
  validates :time, presence: true
  validates :available, :inclusion => {:in => [true, false]}
  
  belongs_to :provider
end
