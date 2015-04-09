class ChangeTimeToTimeIdToProviderSchedules < ActiveRecord::Migration
  def change
    rename_column :provider_schedules, :time, :timeid
  end
end
