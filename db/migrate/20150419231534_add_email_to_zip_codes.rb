class AddEmailToZipCodes < ActiveRecord::Migration
  def change
    add_column :zip_codes, :email, :string
  end
end
