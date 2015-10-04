[![Build Status](https://travis-ci.org/cugos/dropchop.svg?branch=master)](https://travis-ci.org/cugos/dropchop)

[![Codeship Status for cugos/dropchop](https://codeship.com/projects/5371c9b0-02a9-0133-3603-2eafb47e949a/status?branch=master)](https://codeship.com/projects/88973)

# Dropchop

**You drop. We chop.**

![Dropchop Logo](assets/drop-n-chop-logo.png)

Dropchop is a browser-based GIS powered by [Mapbox.js](http://mapbox.com/mapbox.js) and [Turf.js](http://turfjs.org). The need for small-scale GIS operations comes up quite frequently in our work, especially for those without much time. Dropchop aims to empower your spatial data by removing complexity. This project is currently a proof-of-concept and explores [three hypotheses](https://github.com/cugos/dropchop/wiki/Dropchop-Inspiration):

1. **GIS can be data-first, not operation-first.**
2. **GIS doesn't always require a server.**
3. **GIS is open.**

![buffer > buffer > union](assets/dc-readme.gif)

# Who?

All of this work is made possible by [CUGOS](http://cugos.org), an open-source geo community based in Seattle.

# Contribute!

[Project installation](https://github.com/cugos/dropchop/wiki/Installing-the-Project) can be found in the wiki.

If you're interested in any of the above, please help out! Submit ideas as [issues](https://github.com/cugos/dropchop/issues), work on [bugs](https://github.com/cugos/dropchop/labels/bug), add new [features](https://github.com/cugos/dropchop/labels/enhancement). Here's to [our contributors](https://github.com/cugos/drop-n-chop/graphs/contributors)!

Things are moving very quickly with the project right now. We are still continuing to build out and refactor the architecture of the application. If you want to read more about our decision-making process take a look at some of our meeting notes. [04/11/2015](https://github.com/cugos/dropchop/wiki/Meeting-Notes---04-11-2015), [05/10/2015](https://github.com/cugos/dropchop/wiki/Meeting-Notes-05-10-2015). 

*Once you drop the chop don't stop.*

## Triggers

Triggers are the engine of Dropchops codebase. We are using jQuery's `trigger()` as our publication/subscription service throughout the code, which allows us to "publish" actions across `dropchop` that can be picked up by any "subscriber" throughout the code. For example, we use this one quite a bit:

```javascript
$(dc).trigger('file:added', [layer]);
```

The above publishes the `file:added` action which other pieces of the code are listening for. We can pick up this trigger in `layers.dropchop.js` by writing:

```javascript
$(dc).on('file:added', addFileToLayers);

addFileToLayers = function(event, layer) {
    // do something with layer
}
```

The `addFileToLayers()` function will run with the `event` parameter first, every time, and then any options that are passed in the original array from the trigger. In the above case, an array of one element `layer` is passed as receiving information.

Below is a list of triggers that exist within `dropchop` that can be picked up anywhere when fired.

Operations

* `operation:geo:TURF-OPERATION` 
* `operation:file:FILE-OPERATION`

Layers

* `file:added`
* `layer:duplicate`
* `layer:remove`
* `layer:removed`
* `layer:show`
* `layer:hide`
* `layer:selected`
* `layer:unselected`
* `layer:added`
* `layer:rename`
* `layer:renamed`

Forms

* `form:geo`
* `form:file`