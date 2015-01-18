class ChangeColumnsOrderAgainToProviders < ActiveRecord::Migration
  def change
    change_column :providers, :last_name, :string, after: :first_name
  end
end
