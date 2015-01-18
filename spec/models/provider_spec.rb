require 'spec_helper'

describe Provider do
  
  before do
    @provider = Provider.new(
      first_name: "Fulana",
      last_name: "de Tal",
      email: "fulana@domain.com",
      password: "fulana",
      password_confirmation: "fulana",
      phone: "1 707 616-8371",
      expertise: "main skill or label",
      abstract: "a brief text to be shown at profile list",
      about: "a huge text to be shown at profile page",
      service_text: "a text describing services",
      specialty_text: "a text describing specialties",
      policies: "a text describing policies and rules",
      picture_path: "../some_path/some_other_path/fulana_de_tal.jpg",
      profile: "fulana_de_tal",
      active: 1,
      admin: 0
    )
  end
  
  it { should respond_to(:first_name) }
  it { should respond_to(:last_name) }
  it { should respond_to(:email) }
  it { should respond_to(:profile) }
  it { should respond_to(:admin) }
  it { should respond_to(:password_digest) }
  it { should respond_to(:password) }
  it { should respond_to(:password_confirmation) }
  
  it { should be_valid }
  
  subject { @provider }
  
  describe "when first_name is not present" do
    before { @provider.first_name = " " }
    it {should_not be_valid  }
  end
  
  describe "when last_name is not present" do
    before { @provider.last_name = " " }
    it {should_not be_valid  }
  end
  
  describe "when email is not present" do
    before { @provider.email = " " }
    it {should_not be_valid  }
  end
  
  describe "when email format is invalid" do
    it "should be invalid" do
      addresses = %w[provider@foo,com provider_at_foo.org example.provider@foo.
                     foo@bar_baz.com foo@bar+baz.com]
      addresses.each do |invalid_address|
        @provider.email = invalid_address
        expect(@provider).not_to be_valid
      end
    end
  end

  describe "when email format is valid" do
    it "should be valid" do
      addresses = %w[provider@foo.COM A_US-ER@f.b.org frst.lst@foo.jp a+b@baz.cn]
      addresses.each do |valid_address|
        @provider.email = valid_address
        expect(@provider).to be_valid
      end
    end
  end
  
  describe "when profile is not present" do
    before { @provider.profile = " " }
    it {should_not be_valid  }
  end
  
  describe "when email address is already taken" do
    before do
      provider_with_same_email = @provider.dup
      provider_with_same_email.save
    end
    it { should_not be_valid }
  end
  
  describe "when admin is not present" do
    before { @provider.admin = " " }
    it {should_not be_valid  }
  end
  
  describe "when password is not present" do
    before do
      @provider = Provider.new(
        first_name: "Fulana",
        last_name: "de Tal",
        email: "fulana@domain.com",
        password: " ",
        password_confirmation: " ",
        phone: "1 707 616-8371",
        expertise: "main skill or label",
        abstract: "a brief text to be shown at profile list",
        about: "a huge text to be shown at profile page",
        service_text: "a text describing services",
        specialty_text: "a text describing specialties",
        policies: "a text describing policies and rules",
        picture_path: "../some_path/some_other_path/fulana_de_tal.jpg",
        profile: "fulana_de_tal",
        active: 1,
        admin: 0
      )
    end
    it { should_not be_valid }
  end
  
  describe "when password doesn't match confirmation" do
    before { @provider.password_confirmation = "mismatch" }
    it { should_not be_valid }
  end
  
  describe "with a password that's too short" do
    before { @provider.password = @provider.password_confirmation = "a" * 5 }
    it { should be_invalid }
  end
  
  describe "return value of authenticate method" do
    before { @provider.save }
    let(:found_provider) { Provider.find_by(email: @provider.email) }
  
    describe "with valid password" do
      it { should eq found_provider.authenticate(@provider.password) }
    end
  
    describe "with invalid password" do
      let(:provider_for_invalid_password) { found_provider.authenticate("invalid") }
  
      it { should_not eq provider_for_invalid_password }
      specify { expect(provider_for_invalid_password).to be_false }
    end
  end
end