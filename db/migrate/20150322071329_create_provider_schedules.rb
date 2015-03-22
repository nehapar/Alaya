class CreateProviderSchedules < ActiveRecord::Migration
  def change
    create_table :provider_schedules do |t|
      t.integer :provider_id
      t.string :time # yes, string... trust on me
      t.boolean :available

      t.timestamps
    end
  end
end
