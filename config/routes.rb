Rails.application.routes.draw do
  get 'home/main'
  root :to => 'home#main'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
