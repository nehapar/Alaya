class ChangeAgainExpertiseToAllowNullToProviders < ActiveRecord::Migration
  def change
    change_column :providers, :expertise, :string, :null => true
  end
end
