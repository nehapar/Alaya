class CreateAreas < ActiveRecord::Migration
  def change
    create_table :areas do |t|
      t.integer :provider_id
      t.string :area
      t.string :area

      t.timestamps
    end
  end
end
