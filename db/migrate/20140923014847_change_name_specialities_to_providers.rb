class ChangeNameSpecialitiesToProviders < ActiveRecord::Migration
  def change
  	rename_column :providers, :name, :first_name
  end
end
