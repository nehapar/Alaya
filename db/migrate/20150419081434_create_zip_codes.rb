class CreateZipCodes < ActiveRecord::Migration
  def change
    create_table :zip_codes do |t|
      t.string :zip

      t.timestamps
    end
  end
end
