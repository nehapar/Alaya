class ChangeReviewToTextToReviews < ActiveRecord::Migration
  def change
    change_column :reviews, :review, :text
  end
end
