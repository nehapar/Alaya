class AddRememberTokenToProviders < ActiveRecord::Migration
  def change
  	add_column :providers, :remember_token, :string
    add_index  :providers, :remember_token
  end
end
