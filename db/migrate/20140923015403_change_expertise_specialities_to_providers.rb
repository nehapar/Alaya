class ChangeExpertiseSpecialitiesToProviders < ActiveRecord::Migration
  def change
    change_column :providers, :expertise, :string, :null => false
  end
end
