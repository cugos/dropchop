# Don't build on deploy branch (note: This will still cause the build to
# be listed as a failure)
test $CI_BRANCH = 'gh-pages' && exit 0 || echo "Testing branch '${CI_BRANCH}'"

# install all of our dependencies
npm install