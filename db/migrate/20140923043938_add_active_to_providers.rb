class AddActiveToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :active, :boolean
  end
end
