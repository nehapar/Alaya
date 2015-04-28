class ChangeBigFieldsToTextToProviders < ActiveRecord::Migration
  def change
    change_column :providers, :expertise, :text
    change_column :providers, :abstract, :text
    change_column :providers, :about, :text
    change_column :providers, :specialty_text, :text
    change_column :providers, :policies, :text
    change_column :providers, :service_text, :text
  end
end
