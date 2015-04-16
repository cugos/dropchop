[![Build Status](https://travis-ci.org/cugos/drop-n-chop.svg?branch=leaflet-plugin)](https://travis-ci.org/cugos/drop-n-chop)

# Drop 'n Chop

**You drop. We chop.**

Drop 'n Chop tests the idea that GIS operations can be done in the browser, without a server. This application is currently a proof of concept testing the capabilities of a user uploading files, executing GIS operations, creating new spatial data layers, and downloading the new data. Here's an example of it running a `buffer` and `union` operation in the same process.

![buffer union sf east!](assets/dropnchop_union.gif)

### Wait, how are you doing spatial operations on the web?

Well now, that's a fantastic question. We're using [Turf.js](https://github.com/Turfjs/turf), a javascript library that can run spatial operations on GeoJSON objects and returns new objects for usage.

### Haven't we been able to drag and drop files into the browser for, like, forever?

Sure have! What happens when you drag and drop a file into your browser typically involves a server to handle the files. This project attempts to bypass the need for a server by using the [HTML5 File Reader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) implementation to handle the file and convert into a usable object for Turf.

### If I believe the above, will this do everything for me?

No! Right now this project is an implementation of some of Turf's geoprocessing functions and doesn't really allow for much user interaction yet. If you're interested in expanding the functionality, let's talk in [the issues](https://github.com/cugos/drop-n-chop/issues).

### Hm.

That's good enough for us! You should stay tuned for any developments. Maybe we can make a completely self-contained GIS in the browser using concepts like this.

### What's on the horizon?

We're not much of a metaphor group here at [CUGOS](http://cugos.org/), but if you're watching the sunset just remember that it's rising somewhere else.

### What's on the roadmap?

Again, metaphors aren't our thing but we're looking at the following:

* Convert `.shp` files to `.json` in the browser, without a server.
* Allow the user to specify which Turf functions they'd like to run against their files.
* Discuss the versatility of `<a href="data: ...">` as the main download constructor.
* Develop an alpha prototype that allows users to upload multiple files, choose which they'd like to edit, and do some sweet GIS stuff, without downloading a single piece of software or writing any code.

# Setup

Working on Drop-n-Chop requires a few tools. We are using [Grunt](http://gruntjs.com/) for our task running and build process. You can install the Grunt CLI with `npm`:

```
npm install -g grunt-cli
```

Once that has been installed successfully, you can clone the repository or your own fork and `cd` into the directory.

```
git clone git@github.com:YOUR-GITHUB-USERNAME/drop-n-chop.git
cd drop-n-chop
```

Install development dependencies with `npm`

```
npm install
```

Run a local server with a development (not minified) version of the code:

```
grunt
```

Run a local server with a production (minified) version of the code:

```
grunt prod
```

You should now be able to access the application at `http://localhost:8000`. While the development server is running, any changes to files within `src/` will cause appropriate linting/compiling/testing to occur.
