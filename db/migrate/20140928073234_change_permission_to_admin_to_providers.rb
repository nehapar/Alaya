class ChangePermissionToAdminToProviders < ActiveRecord::Migration
  def change
  	rename_column :providers, :permission, :admin
  end
end
