class AddIndexToProvidersEmail < ActiveRecord::Migration
  def change
  	add_index :providers, :email, unique: true
  end
end
