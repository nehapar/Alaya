class ChangeAvailableToUnavailableToProviderSchedules < ActiveRecord::Migration
  def change
    rename_column :provider_schedules, :available, :unavailable
  end
end
