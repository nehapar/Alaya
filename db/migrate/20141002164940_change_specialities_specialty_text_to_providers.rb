class ChangeSpecialitiesSpecialtyTextToProviders < ActiveRecord::Migration
  def change
    rename_column :providers, :specialities, :specialty_text
  end
end
