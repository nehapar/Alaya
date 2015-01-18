class AddUsernameToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :username, :string
  end
end
