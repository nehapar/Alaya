class AddAppointmentTypeToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :appointment_type, :integer, default: 0
  end
end
