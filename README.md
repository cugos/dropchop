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

#### Open Street Map

#### Gist

#### ArcGIS Server Feature Service

Data from ArcGIS Server or ArcGIS Online [Feature Layers](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Layer_Table/02r3000000zr000000/) can be added directly to Dropchop via the Query an ArcGIS Feature Service button. 

*** GIF goes here ***

##### Parameters
1. Feature Service - is the URL for an ArcGIS Server or ArcGIS Online Feature Layer REST endpoint. Only layers of type `Feature Layer` are supported.
2. Where - is a legal SQL query `where` clause used to filter the feature service. To retrieve all features, use `1=1`. 
3. Request Type - can be Cross-Origin Resource Sharing (CORS) or JSONP. CORS requires both the client and server to support Cross-Origin Requests. If you receive Cross Origin Request Blocked errors, try switching to JSONP. [Click here to learn more about CORS](http://enable-cors.org/).
4. Limit To Map - will query for features only within the current map view extent.

##### Limitations
* Query results to Feature Service REST endpoints may be limited by the server. The default limit is 1,000 features.
* Although uncommon is it possible that some Feature Service endpoints are not queryable. This is set by the server administrator.

##### How to Find Feature Services
Many organizations and local, state and federal governments use ArcGIS Server software to host web maps. Use the Network tab of your browser's developer tools to discover URLs of web map layers. Often you can browse the entire directory of an ArcGIS Server host at the `arcgis/rest/services` root URL. [See example](http://sampleserver6.arcgisonline.com/arcgis/rest/services). 

You might also explore the [sources](https://github.com/openaddresses/openaddresses/tree/master/sources) of the [OpenAddresses](http://openaddresses.io/) project. Many of the address sources point to ArcGIS Server feature services. [See example](https://github.com/openaddresses/openaddresses/blob/master/sources/us/wa/san_juan.json#L12).

#### User Location

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
