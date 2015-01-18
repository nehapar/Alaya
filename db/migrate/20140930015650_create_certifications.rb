class CreateCertifications < ActiveRecord::Migration
  def change
    create_table :certifications do |t|
      t.integer :provider_id
      t.string :certification

      t.timestamps
    end
  end
end
