class AddPoliciesToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :policies, :string
  end
end
