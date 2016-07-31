# Contributing

## Table of Contents
* [Introduction](CONTRIBUTING.md#introduction)
* [Collaborating](CONTRIBUTING.md#collaboring)
* [Prerequisites](CONTRIBUTING.md#prerequisites)
* [Writing Code](CONTRIBUTING.md#writing-code)
  * [Triggers](CONTRIBUTING.md#triggers)
  * [Adding a Turf function](CONTRIBUTING.md#adding-a-turf-function)
  * [General Code Style](CONTRIBUTING.md#general-code-style)
  * [For Loops](CONTRIBUTING.md#for-loops)
* [Documentation](CONTRIBUTING.md#documentation)
* [Deployment](CONTRIBUTING.md#deployment)
  * [How do I get codeship to work?](CONTRIBUTING.md#how-do-i-get-codeship-to-work)

## Introduction

This document is to help you get started on your journey to fixing bugs and adding new functionality to Dropchop.  Beginners are very welcome.

## Collaborating

Dropchop relies entirely Github for project collaboration. If you have a question, comment, or idea, feel free to make an [issue](https://github.com/cugos/dropchop/issues). If you want to get started on adding a feature or fixing a bug, [fork](https://github.com/cugos/dropchop#fork-destination-box) the repo, change some code, and submit a [pull request]()

## Prerequisites

* It is assumed that you have Dropchop installed. For more information on the installation procedure, see [INSTALLATION.md](INSTALLATION.md).
* It's probably helpful to have some familiarity with [pull requests](https://help.github.com/articles/using-pull-requests) and [issues](https://guides.github.com/features/issues/).
* Dropchop is written almost entirely in JavaScript. For a comprehensive manual on modern JavaScript, see [Mozilla's JavaScript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript). If you are unfamiliar with JavaScript, you can still help by contributing documentation and submitting bugs/ideas. If you are keen to learn _(no better time than the present!)_, here are some of our favorite JavaScript beginner's tutorials:
  * [JavaScript For Cats](http://jsforcats.com/)
  * [NodeSchool](http://nodeschool.io/) (see [JavaScripting](https://github.com/sethvincent/javascripting))
  * [Code Academy](https://www.codecademy.com/learn/javascript)

## Writing Code

### Triggers

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

**Operations**

* `operation:geo:TURF-OPERATION`
* `operation:file:FILE-OPERATION`

**Layers**

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
* `layerlist:added`

**Forms**

* `form:geo`
* `form:file`

### Adding a Turf function

**These instructions assume you are adding a Turf operation that returns NEW GEOMETRY** If you plan to add a Turf operation that returns something other than geometry, such as [`count`](http://turfjs.org/static/docs/module-turf_count.html), please look at [this issue thread](https://github.com/cugos/drop-n-chop/issues/80) first.

Turf functions are their own geoprocesses within this application. Since each spatial operation requires different data types, parameters, and options, each Turf option must be specified individually.

#### 1. Find the operation in Turf docs
Too add a new operation, find its relevant page in the Turf documentation. Here is [`buffer`](http://turfjs.org/static/docs/module-turf_buffer.html) for example.

#### 2. Add operation info and parameters
We need to open [`/src/js/operations/Geo.js`](https://github.com/cugos/drop-n-chop/blob/master/src/js/ops.geo.dropchop.js) and add a new object that describes the particular operation you want. Below is an example of `buffer`:

```javascript
buffer: {
    maxFeatures: 1,
    description: 'Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.',
    parameters: [
        {
            name: 'distance',
            description: 'Distance to draw the buffer.',
            type: 'number',
            default: 10
        },
        {
            name: 'unit',
            type: 'select',
            description: '',
            options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
            default: 'miles'
        }
    ]
},
```

Notice that there are two parameters, `distance` and `unit`. Each of these is optional according to Turf's documentation. Distance can be any number, but Unit can only be a particular set of options. Make sure if you want the user to only choose certain options to use `type: 'select'` and list your `options` accordingly. `createsLayer` represents whether the operation returns a layer that should be placed on the map.

A greater list of possibly operation configurations can be seen below:

```javascript
operationName: {
    minFeatures: 1, // Validation: Minimum number of layers that this operation requires
    maxFeatures: 2, // Validation: Maximum number of layers that this operation requires
    description: 'Do something', // Form: Textual description of operation
    disableForm: false, // Skip input form
    parameters: [ // Form: Fields for input form
        {
            description: 'First field.', // Textual description of input field
            type: 'text', // Type of input field (corresponds to HTML input types)
            extra: 'maxlength=3', // Any extra string to be placed in input field tag element
            default: 'blah', // Default value for field
        }
    ]
}
```

#### 3. Add the new operation to appropriate menu
To add the task to the menu, open [`/src/js/controller/AppController.js`](https://github.com/cugos/drop-n-chop/blob/master/src/js/controller/AppController.js). On [this line](https://github.com/cugos/drop-n-chop/blob/master/src/js/controller/AppController.js#L24) you will see an array of different items. Add your new item here. **Be sure it is named exactly the same as the turf operation!**

#### 4. Save & run `grunt`
You should now be able to rebuild the application and test out your new operation. Make sure you have some test data to work with. You can find some in the [`test` folder](https://github.com/cugos/drop-n-chop/tree/master/test). If these files aren't working, making quick features at [geojson.io](http://geojson.io/) typically works well.

If things aren't working, make sure to check out your console for javascript errors. If you are unable to solve the issue feel free to [submit a ticket](https://github.com/cugos/drop-n-chop/issues) on the repository issues! Please include the error that you are receiving, the operation you are trying to add, and the data that you were testing with.

#### 5. Test!
In order to make sure our operations are running as expected you should write some tests. MORE TO COME HERE!



### General Code Style

```javascript
var ourStyleGuide = {
    /*
    **
    ** This comment relates to a block of code. It's usually written
    ** above a function.
    **
    */
    fooBar: function ( pow, whamo ) {  // Spaces between 'function' and parenthesis, spaces between args and parenthesis

        // A double slashed comment above a line explains following line's purpose
        console.log("Doing something");  // Double slashed comment after command clarifies functionality

        // TODO: Comments like these are used to comment on needs for refactor or raise questions
    }
}
```

### For Loops

```javascript
// when working with objects
for ( var x in y ) { ... }

// when working with arrays
for ( var x; x < y.length; x++ ) { ... }
```

## Documentation

When you've created a feature and you're about to submit a pull request, please add the following documentation:
  * Related instructions to the [README.md](README.md) file explaining how to use the new feature.
  * A comment of the change to the [CHANGELOG.md](CHANGELOG.md).

This is likely only necessary for Features and not Bugs, but varies on a case-by-case basis.

We use a lot of animated screen captures when describing features and bugs in pull requests or documentation. On Windows and OSX, some of us use [LICEcap](http://www.cockos.com/licecap/) to create these screen capture GIFs.


## Deployment

We are using codeship.io to deploy Dropchop to the `gh-pages` branch of this repository. Since everything is happening on the front-end of this project (no server-side stuff) we can use Github pages to host all of the static assets. Take a look at the [`.codeship`](https://github.com/cugos/dropchop/tree/master/.codeship) directory that breaks down how we test, setup, and deploy the project using a temporary server linked to our Github account.

[![Codeship Status for cugos/dropchop](https://codeship.com/projects/5371c9b0-02a9-0133-3603-2eafb47e949a/status?branch=master)](https://codeship.com/projects/88973)

The image above should be green, which signifies that the tests and deployment have passed and executed properly on codeship.io's end.

### How do I get codeship to work?

The really neat thing about codeship is that it runs on every pull request, no matter what. What we've done is set it up that when someone merges a branch into `master` codeship detects this and runs automatically. Pushing to `master` leads to a direct push to the `gh-pages` branch without you needing to do a thing.
