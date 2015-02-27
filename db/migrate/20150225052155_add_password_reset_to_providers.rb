class AddPasswordResetToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :password_reset_token, :string
    add_column :providers, :password_reset_sent_at, :datetime
  end
end
