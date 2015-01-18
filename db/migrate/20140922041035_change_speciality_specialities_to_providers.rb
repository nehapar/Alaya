class ChangeSpecialitySpecialitiesToProviders < ActiveRecord::Migration
  def change
  	rename_column :providers, :speciality, :specialities
  end
end
