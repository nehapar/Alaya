class AddTimeToProviderSchedules < ActiveRecord::Migration
  def change
    add_column :provider_schedules, :time, :datetime
  end
end
