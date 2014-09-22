class AddPasswordDigestToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :password_digest, :string
  end
end
