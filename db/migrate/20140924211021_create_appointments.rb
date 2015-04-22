class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.integer :provider_id
      t.integer :client_id
      t.datetime :time_start
      t.datetime :time_end
      t.integer :accepted

      t.timestamps
    end
    add_index :appointments, [:provider_id, :created_at]
  end
end
