# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.

require 'securerandom'

def secure_token
  token_file = Rails.root.join('.secret')
  if File.exist?(token_file)
    # Use the existing token.
    File.read(token_file).chomp
  else
    # Generate a new token and store it in token_file.
    token = SecureRandom.hex(64)
    File.write(token_file, token)
    token
  end
end

Alaya::Application.config.secret_key_base = secure_token

#Alaya::Application.config.secret_key_base = 'd46f362781b30e33f5b1a90a448ec846bbef00cf6411145b2be45edbc1ac73745a6c4ee571a8fc2fe3e007c4e4a3522237ac5683487cbdb467f3eeebe43fde7e'
