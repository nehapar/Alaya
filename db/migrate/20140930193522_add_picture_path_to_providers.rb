class AddPicturePathToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :picture_path, :string
  end
end
