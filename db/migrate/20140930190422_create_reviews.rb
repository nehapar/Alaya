class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.integer :provider_id
      t.string :review
      t.string :author

      t.timestamps
    end
  end
end
