class ChangeActiveToProviders < ActiveRecord::Migration
  def change
  	change_column :providers, :active, :integer
  end
end
