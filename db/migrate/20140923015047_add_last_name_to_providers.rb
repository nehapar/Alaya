class AddLastNameToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :last_name, :string
  end
end
