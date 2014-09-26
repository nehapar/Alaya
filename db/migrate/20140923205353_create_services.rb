class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
      t.integer :provider_id
      t.string :service

      t.timestamps
    end
  end
end
