class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.integer :provider_id
      t.integer :client_id
      t.datetime :start
      t.datetime :end
      t.integer :accepted

      t.timestamps
    end
    add_index :appointments, [:provider_id, :created_at]
  end
end
