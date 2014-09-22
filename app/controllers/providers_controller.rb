class ProvidersController < ApplicationController
  def new

  end

  def profile_list
  	@providers = Provider.find(:all)
  end

  def profile_detail
  	@provider = Provider.find_by(name: params[:name])
  end
end
