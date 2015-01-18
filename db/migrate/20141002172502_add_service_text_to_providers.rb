class AddServiceTextToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :service_text, :string
  end
end
