# Installation

These install instructions have only been tested on Mac, updates and comments for Windows are in the works. If you have problems installing dropchop, please let us know [here](https://github.com/cugos/dropchop/issues/94).

1. **Python** - following steps require [Python](https://python.org/). Current Macintosh systems include Python, Windows users may need to install it. Windows testing was with Python 2.7.5, 32-bit.
1. **Node & `npm`** - install [Node](https://nodejs.org/) from their website package. This includes `npm` (Node Package Manager).
1. **Git** - install [Git](http://git-scm.com/), our version control language that allows us to record a history of every change made to the code base.
1. [**Fork** the project](https://help.github.com/articles/fork-a-repo/) on github into your own repository
1. **Clone project** - open terminal and navigation (`cd`) to where you want the project to exist in your computer. Then grab the URL to clone your forked version of the project and run `git clone https://github.com/YOUR-USERNAME/dropchop.git`. Once that has successfully been created, you can `cd dropchop` to the directory.
1. **Initialize dependencies** by running `npm install` (this may require `sudo npm install` for the proper permissions). This will install all of the necessary dependencies.
1. **Gulp** - This is our task runner, which allows us to combine and minify our javascript. Gulp can be installed globally on your computer by running `npm install -g gulp`, which gives you access to the command line interface.
1. **Prepare vendor JS** - Run `gulp build:prod` to prepare all vendor scripts and assets.
1. **Build your project** - To build your project, run `gulp` to build from source and it will run a local server at `localhost:8888`, which is watching for changes. You should see something like this:
``` bash
$ gulp
[16:01:46] Using gulpfile ~/dropchop/gulpfile.js
[16:01:46] Starting 'lint'...
[16:01:46] Starting 'js_dropchop'...
[16:01:46] Starting 'html'...
[16:01:46] Starting 'sass'...
[16:01:46] Starting 'assets'...
[16:01:46] Starting 'connect'...
[16:01:46] Finished 'connect' after 19 ms
[16:01:46] Starting 'watch'...
[16:01:46] Finished 'watch' after 24 ms
[16:01:46] Server started http://localhost:8888
[16:01:46] Finished 'html' after 200 ms
[16:01:46] Finished 'sass' after 253 ms
[16:01:47] Finished 'lint' after 1.21 s
[16:01:47] Finished 'assets' after 1.18 s
[16:01:47] Finished 'js_dropchop' after 1.19 s
[16:01:47] Starting 'js'...
[16:01:47] Finished 'js' after 4.15 μs
[16:01:47] Starting 'build'...
[16:01:47] Finished 'build' after 4.77 μs
[16:01:47] Starting 'default'...
[16:01:47] Finished 'default' after 3.3 μs
```

Your version of the project has been built successfully. Congrats! Head to [localhost:8888](http://0.0.0.0:8888) in your browser to see it in action.
