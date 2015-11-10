# dropchop
[![Build Status](https://travis-ci.org/cugos/dropchop.svg?branch=master)](https://travis-ci.org/cugos/dropchop) [![Codeship Status for cugos/dropchop](https://codeship.com/projects/5371c9b0-02a9-0133-3603-2eafb47e949a/status?branch=master)](https://codeship.com/projects/88973)

**You drop. We chop.**

Dropchop is a browser-based GIS powered by [Mapbox.js](http://mapbox.com/mapbox.js) and [Turf.js](http://turfjs.org). The need for small-scale GIS operations comes up quite frequently in our work, especially for those without much time. Dropchop aims to empower your spatial data by removing complexity. This project is currently a proof-of-concept and explores [three hypotheses](https://github.com/cugos/dropchop/wiki/Dropchop-Inspiration):

1. **GIS can be data-first, not operation-first.**
2. **GIS doesn't always require a server.**
3. **GIS is open.**

![buffer > buffer > union](assets/dropchop-0.1.0-readme.gif)

## User's Manual

### Adding Data

#### Upload

#### URL

#### OpenStreetMap

#### Gist

#### ArcGIS Server Feature Service

#### User Location  
  ![user location](assets/dc-readme-location.gif)  

### Exporting Data

#### GeoJSON

#### TopoJSON

#### Shapefile



### Keyboard Shortcuts

Dropchop is built with a limited set of keyboard shortcuts:

Keystroke | Action
---: | ---
<kbd>cmd</kbd> + <kbd>a</kbd>, <kbd>ctrl</kbd> + <kbd>a</kbd> | Select All
<kbd>cmd</kbd> + <kbd>backspace</kbd>, <kbd>ctrl</kbd> + <kbd>backspace</kbd> | Deselect All
<kbd>cmd</kbd> + <kbd>+</kbd>, <kbd>ctrl</kbd> + <kbd>+</kbd> | Check All
<kbd>cmd</kbd> + <kbd>-</kbd>, <kbd>ctrl</kbd> + <kbd>-</kbd> | Uncheck All
<kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>k</kbd> | Delete selected layers

![](assets/readme-keyboard-shortcuts.gif)

## Who?

All of this work is made possible by [CUGOS](http://cugos.org), an open-source geo community based in Seattle.



## Contribute!

Information on contributing to Dropchop (including project installation instructions) can be found in the [CONTRIBUTING.md file](CONTRIBUTING.md). Dropchop is now officially in `0.1`, which means progress is stable and contributions are welcomed with open arms. For starters, take a look at how we are using ["triggers"](CONTRIBUTING.md#triggers) to execute commands across the code base.

If you're interested in any of the above, please help out! Submit ideas as [issues](https://github.com/cugos/dropchop/issues), work on [bugs](https://github.com/cugos/dropchop/labels/bug), add new [features](https://github.com/cugos/dropchop/labels/enhancement). Here's to [our contributors](https://github.com/cugos/dropchop/graphs/contributors)!

Things are moving very quickly with the project right now. We are still continuing to build out and refactor the architecture of the application. If you want to read more about our decision-making process take a look at some of our meeting notes. [04/11/2015](https://github.com/cugos/dropchop/wiki/Meeting-Notes---04-11-2015), [05/10/2015](https://github.com/cugos/dropchop/wiki/Meeting-Notes-05-10-2015).


---

*Once you drop the chop don't stop.*

![](assets/drop-n-chop-logo.png)
