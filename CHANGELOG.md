### 0.2.2

* Upgrade to turf.js v3.0 (specifically 3.0.14)
* Update `CONTRIBUTING.md` to reflect new `src/js` structure

### 0.2.1

* Create `window.onbeforeunload` to prevent from navigating away from the page. This isn't a "smart" unload function, in that it does not look for "changes" or "saves".
* Upated README

### 0.2.0

* FEATURE: custom Mapbox basemap https://github.com/cugos/dropchop/pull/259

### 0.1.2

* BUG: Toggle all layers checkbox was working opposite to expectations. Fixed in https://github.com/cugos/dropchop/pull/256
* update path to topojson client library https://github.com/cugos/dropchop/pull/256
* Remove `mapbox.js` bundle in this repo and link straight to CDN in `index.html` as well as Karma configuration file

### 0.1.1

* FEATURE: Upload shapefiles! (via [@jczaplew](https://github.com/jczaplew))
* FEATURE: enabled "sticky" option on `dc.notify()` so the user needs to close the notification instead of it disappearing automatically
* error utility, `dc.util.error(message)`
* update URI when layers are added/removed from URLs, [#204](https://github.com/cugos/dropchop/issues/204)
* BUG: show all overpass tag properties as top-level properties in the geojson, [#185](https://github.com/cugos/dropchop/issues/185)
* BUG: fix some linting issues, [#199](https://github.com/cugos/dropchop/issues/199)
* BUG: State preservation with URL-loaded layers (via [@jczaplew](https://github.com/jczaplew))

# 0.1.0

* Dropchop was born again, but this time not as a Leaflet plugin!

# 0.0

* Dropchop was born.
