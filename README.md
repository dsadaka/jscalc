# jscalc
## React-Rails Calculator 

This project runs ReactJS and uses webpack which requires nodejs 6 and yarn If you’d rather not setup the development environment, you may watch a video of this calculator in action at 

https://youtu.be/nOShx9eZxq8

The following dev station setup instructions are for Ubuntu linux.  For MAC you will need to use brew instead of apt-get
Fortunately, brew installs the latest nodejs so it's a few less steps.

#### I.  Setup ReactJS environment
If you don't have nodejs 6 installed follow the instructions at. You can skip steps 6 - 16.  Webpack is included in Rails and we don't need Selenium

https://gist.github.com/kolosek/b166b4ba2ddcc293d06bfc9f4cdd1689#file-ubuntu-install-nodejs-npm-sh


#### II. Ruby 2.4.1 
This project uses rvm though you could use your own ruby version manager.  If using rvm be sure Ruby 2.4.1 is installed by doing
```
rvm install ruby-2.4.1
```

#### III. Clone repository jscalc
```
$ cd your_dev_directory
$ git clone git@github.com:/dsadaka/jscalc
$ cd jscalc
```

These files are in the top-level of the repo, they tell rvm which Ruby and the gemset name to use
```
  .ruby-version is 2.4.1  
  .ruby-gemset is jscalc
```

if using rvm, and you have ruby 2.4.1 installed, you should see the following when you cd jscalc
```
ruby-2.4.1 - #gemset created /home/dsadaka/.rvm/gems/ruby-2.4.1@jscalc
ruby-2.4.1 - #generating jscalc wrappers..........
```

#### IV. Finish repo setup
Be sure bundler and foreman are installed, if not install with
```
gem install bundler
gem install foreman
# Now bundle up!
bundle install
yarn install
# Optionally you may need the following two commands
rails webpacker:install
rails webpacker:install:react
```

#### V. To start webserver on port 3000
```bash
foreman start -f Procfile.dev -p 3000
```
#### VI. Load browser and go to:  http://localhost:3000
test... test... test...
#### VII. When done, press [Ctrl]-[C] in webserver terminal to exit