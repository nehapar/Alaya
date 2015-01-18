class CreateProviders < ActiveRecord::Migration
  def change
    create_table :providers do |t|
      t.string :name
      t.string :email
      t.integer :permission
      t.string :expertise
      t.string :phone
      t.string :abstract
      t.string :about
      t.string :speciality

      t.timestamps
    end
  end
end
