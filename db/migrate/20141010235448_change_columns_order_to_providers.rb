class ChangeColumnsOrderToProviders < ActiveRecord::Migration
  def up
    change_table :providers do |t|
      t.change :last_name, :string, after: :first_name
      t.change :email, :string, after: :last_name
      t.change :password_digest, :string, after: :email
      t.change :remember_token, :string, after: :password_digest
      t.change :phone, :string, after: :remember_token
      t.change :expertise, :string, after: :phone
      t.change :abstract, :string, after: :expertise
      t.change :about, :string, after: :abstract
      t.change :service_text, :string, after: :about
      t.change :specialty_text, :string, after: :service_text
      t.change :policies, :string, after: :specialty_text
      t.change :picture_path, :string, after: :policies
      t.change :profile, :string, after: :picture_path
      t.change :active, :integer, after: :profile
      t.change :admin, :integer, after: :active
      t.change :created_at, :datetime, after: :admin
      t.change :updated_at, :datetime, after: :created_at
    end
  end
end
