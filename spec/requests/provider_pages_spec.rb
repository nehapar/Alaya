require 'spec_helper'

describe "ProviderPages" do
  subject { page }

  describe "profile page" do
    let(:provider) { FactoryGirl.create(:provider) }
    before { visit prOfile_detail_path(provider) }

    it { should have_content(provider.name) }
    it { should have_title(provider.name) }
  end

  describe "signup page" do
    before { visit signup_path }

    it { should have_content('Sign Up') }
    it { should have_title(full_title('Sign Up')) }
  end
end