require 'spec_helper'

describe Provider do

  before { @provider = Provider.new(name: "Example Provider", email: "provider@example.com", 
    password: "foobar", password_confirmation: "foobar", permission: 1, 
  	expertise: "Massage Therapist, DONA Certified Childbirth Doula", phone: "999 123-4567",
  	abstract: "Kashika is a Massage Therapist and Dona Certified Birth Doula and as an experienced Doula, 
  	Kashika has attended many births including non- medicated natural, medicated natural, VBAC and cesareans births. 
  	She believes that labor and delivery should be as wonderful as it can be and Relaxing using Massage Therapy. 
  	Her goal for each birth is to help the experience be the best that it can be for the whole family and most especially the mother.",
  	about: "Hi I am a DONA Certified Birth Doula, and a Massage Therapist and birth is my passion, I have had five births 
  	of my own, all vaginal and the most recent was in 2011, this birth was done in the most natural way without using Epidural. 
  	I am a vegan vegeterian and have been living a holistic natural life for over 15 years. I am happy to become your Doula and 
  	share with you some of the experiences I have learned and techniques used to comfort you along the way. I am a Graduate From National 
  	Holistic Massage Therapy School that includes Prenatal Massage.",
  	speciality: "My Goal is to support you in having the natural birth experience that you desire. The day you give birth is one of the 
  	most enjoyable days of your life. Your day should be nurtured, respected and empowered. Your ideal of birth is what should happen, 
  	I hope you have a positive birth day and I will be privileged to be supporting you. Services include but are not limited to:") }

  subject { @provider }

  it { should respond_to(:name) }
  it { should respond_to(:email) }
  it { should respond_to(:password_digest) }
  it { should respond_to(:password) }
  it { should respond_to(:password_confirmation) }
  it { should respond_to(:permission) }
  it { should respond_to(:expertise) }
  it { should respond_to(:phone) }
  it { should respond_to(:abstract) }
  it { should respond_to(:about) }
  it { should respond_to(:speciality) }

  it { should be_valid }

  describe "when name is not present" do
    before { @provider.name = " " }
    it { should_not be_valid }
  end

  describe "when email is not present" do
    before { @provider.email = " " }
    it { should_not be_valid }
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

  describe "when email address is already taken" do
    before do
      provider_with_same_email = @provider.dup
      provider_with_same_email.email = @provider.email.upcase
      provider_with_same_email.save
    end

    it { should_not be_valid }
  end

  describe "when password is not present" do
    before do
      @provider = Provider.new(name: "Example Provider", email: "provider@example.com",
                       password: " ", password_confirmation: " ")
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