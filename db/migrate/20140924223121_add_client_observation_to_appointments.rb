class AddClientObservationToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :client_observation, :string
  end
end
