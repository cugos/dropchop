# Before this script is run, Codeship should set the environment variable
# $GH_TOKEN to a valid Github Access Token with 'public_repo' access.

echo "Configuring git..."
git config --global user.email "codeship@cugos.org"
git config --global user.name "Codeship CI"
git remote set-url origin https://${GH_TOKEN}@github.com/cugos/dropchop.git
echo "Running gh-pages..."
grunt deploy
echo "Successfully deployed to gh-pages"
