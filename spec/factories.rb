FactoryGirl.define do
  factory :provider do
    name     "Thiago Melo"
    email    "thiago.lc.melo@gmail.com"
    password "foobar"
    password_confirmation "foobar"
    expertise "Some ones, not remarkable"
    permission 6
  end
end