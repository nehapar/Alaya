class AddActiveToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :active, :integer
  end
end
