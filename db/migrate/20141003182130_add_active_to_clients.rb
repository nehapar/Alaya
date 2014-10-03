class AddActiveToClients < ActiveRecord::Migration
  def change
    add_column :clients, :active, :integer
  end
end
