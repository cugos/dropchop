# Post-build Deployment Script
# Upon a successful build in the 'release branch', this script will set up Git
# and the Grunt gh-pages command.
#
# This script requires:
#   - that grunt-gh-pages be installed and configured: https://github.com/tschaub/grunt-gh-pages
#   - a 'GH_TOKEN' environment variable representing a Github OAuth token with
#     'public_repo' permissions be added. Note: Best practice is to store this
#     as a non-visible variable within the Travis online settings rather than
#     within .travis.yml
#   - a 'RELEASE_BRANCH' environment variable representing the name of the
#     branch to watch for commits. Can be added online or within .travis.yml
#

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "${BRANCH}" != "${RELEASE_BRANCH}" ]; then
    echo "In branch '${BRANCH}', not '${RELEASE_BRANCH}'. Not deploying."
    exit 0;
fi

echo "Configuring git..."
git config --global user.email "travis@cugos.org"
git config --global user.name "Travis CI"
git remote set-url origin https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git

echo "Running gh-pages..."
grunt gh-pages || exit

echo "Successfully deployed to gh-pages"
