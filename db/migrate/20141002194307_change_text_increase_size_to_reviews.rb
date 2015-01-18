class ChangeTextIncreaseSizeToReviews < ActiveRecord::Migration
  def change
    change_column :reviews, :review, :text, :limit => nil
  end
end
