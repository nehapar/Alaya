class ChangeUsernameProfileToProviders < ActiveRecord::Migration
  def change
    rename_column :providers, :username, :profile
  end
end
