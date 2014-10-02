class CreateSpecialties < ActiveRecord::Migration
  def change
    create_table :specialties do |t|
      t.integer :provider_id
      t.string :specialty

      t.timestamps
    end
  end
end
