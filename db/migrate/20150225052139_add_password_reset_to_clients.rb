class AddPasswordResetToClients < ActiveRecord::Migration
  def change
    add_column :clients, :password_reset_token, :string
    add_column :clients, :password_reset_sent_at, :datetime
  end
end
