# Don't build on deploy branch (note: This will still cause the build to
# be listed as a failure)
test $CI_BRANCH = 'gh-pages' && exit 0 || echo "Testing branch '${CI_BRANCH}'"

# By default we use the Node.js version set in your package.json or 0.10.25
# You can use nvm to install any Node.js version.
# i.e.: nvm install 0.10.25
nvm install 0.10.25
nvm use 0.10.25
npm install

# Install grunt-cli for running your tests or other tasks
npm install grunt-cli
gem install sass
