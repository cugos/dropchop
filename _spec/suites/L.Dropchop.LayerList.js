describe("L.Dropchop.LayerList", function () {
    var map;

    beforeEach(function () {
        map =  new L.Map(document.createElement('div')).setView([0, 0],3);

        var dropzoneEl = document.createElement('div');
        dropzoneEl.setAttribute('id','dropzone');
        document.body.appendChild(dropzoneEl);
    });

    describe("initialize", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("options and members setup correctly", function () {
            // options
            expect(layerlist.options.layerContainerId).to.equal('dropzone');
            expect(layerlist.options.autoZIndex).to.equal(true);
            expect(layerlist.options.zoomToExtentOnAdd).to.equal(true);
            // members
            expect(layerlist._handlingClick).to.equal(false);
            expect(layerlist._lastZIndex).to.equal(0);
            expect(layerlist._layers).to.eql({});
            expect(typeof layerlist.selection).to.equal("object");
            expect(layerlist.layerContainer.getAttribute('id')).to.equal('dropzone');
        });

        it("intialized correctly", function () {
            expect(layerlist instanceof L.Dropchop.LayerList).to.equal(true);
        });

    });

    describe("_buildDomElement", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("creates expected DOM elements", function () {
            var el = layerlist._buildDomElement();
            expect(el.getAttribute('class')).to.equal('json-layer-list');
            expect(el.getAttribute('id')).to.equal('layer-list');
            // expect(layerlist.layerContainer.children.length).to.equal(1);
            // expect(layerlist.layerContainer.firstElementChild.getAttribute('id')).to.equal('layer-list');
        });

    });

    describe("addLayer", function () {
        var name = "test";
        var layer;
        var layerlist;
        var mappySpy;
        var geojsonSpy;
        var domElement;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            domElement = layerlist._buildListItemDomElement({ name: name, layer: layer });

            // add a spy to know when branching on zoomToExtentonAdd runs
            mappySpy = sinon.spy(map, "fitBounds");
            // add a spy to know when L.GeoJSON.setZIndex is called in autoZIndex branching
            geojsonSpy = sinon.spy(L.GeoJSON.prototype, "setZIndex");
        });

        afterEach(function(){
            mappySpy.restore();
            geojsonSpy.restore();
        });

        it("options.autoZIndex is false", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = false;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayer( layer, name, true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId].domElement.outerHTML).to.eql(domElement.outerHTML);
            delete layerlist._layers[lookupId].domElement; // NOTE: Comparing DOM Element object always fails

            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: name,
            });
            expect(layerlist._lastZIndex).to.equal(0);
            expect(geojsonSpy.called).to.equal(false);
            expect(mappySpy.called).to.equal(true);

        });

        it("options.autoZIndex is true", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayer( layer, name, true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId].domElement.outerHTML).to.eql(domElement.outerHTML);
            delete layerlist._layers[lookupId].domElement; // NOTE: Comparing DOM Element object always fails

            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: name,
            });
            expect(layerlist._lastZIndex).to.equal(1);
            expect(geojsonSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(true);
        });

        it("options.zoomToExtentOnAdd is false", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = false;
            layerlist.addLayer( layer, name, true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId].domElement.outerHTML).to.eql(domElement.outerHTML);
            delete layerlist._layers[lookupId].domElement; // NOTE: Comparing DOM Element object always fails

            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: name,
            });
            expect(layerlist._lastZIndex).to.equal(1);
            expect(geojsonSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(false);
        });


    });

    describe("removeLayer", function () {
        var layer;
        var layerlist;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            layerlist.addLayer(layer);
        });

        it("removes the cached layer and returns LayerList instance", function () {
            var lookupId = L.stamp( layer );
            expect(typeof layerlist._layers[ lookupId ]).to.not.equal("undefined");
            var returnedInstance = layerlist.removeLayer(layer);

            // assertions
            expect(returnedInstance instanceof L.Dropchop.LayerList).to.equal(true);
            expect(typeof returnedInstance._layers[ lookupId ]).to.equal("undefined");
        });

    });

    describe("_handleLayerChanged", function () {
        var layerlist;
        var layer;
        var domElement;
        var mockMapAddLayer;
        var mockMapRemoveLayer;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            layerlist.domElement = document.createElement("div");
            layerlist.domElement.className = "test";
            layerlist.addLayer( layer, "test" );  // Adds to layerlist & map

            domElement = layerlist._buildListItemDomElement({layer: layer, name: "test"});

            mockMapAddLayer = sinon.spy(map, "addLayer" );
            mockMapRemoveLayer = sinon.spy(map, "removeLayer" );
        });

        afterEach(function(){
            mockMapAddLayer.restore();
            mockMapRemoveLayer.restore();
        });

        it("adds checked layer to map and layerlist", function () {
            delete layerlist._map._layers[layer._leaflet_id];  // Rm from map

            var el = layerlist.domElement.querySelectorAll("input")[0];
            el.checked = true;
            layerlist._handleLayerChange(
                { layer: layer, name: "test", domElement: domElement },
                { currentTarget: el }
            );

            // assertions
            expect(layerlist._map.hasLayer( layer )).to.equal(true);
            expect(mockMapAddLayer.callCount).to.equal(2);  // TODO: I don't know why this is 2 and not 1...
            expect(mockMapRemoveLayer.called).to.equal(false);
        });

        it("doesn't add unchecked layer to map", function () {
            delete layerlist._map._layers[layer._leaflet_id];  // Rm from map

            var el = layerlist.domElement.querySelectorAll("input")[0];
            el.checked = false;
            layerlist._handleLayerChange(
                { layer: layer, name: "test", domElement: domElement },
                { currentTarget: el }
            );

            // assertions
            expect(layerlist._map.hasLayer( layer )).to.equal(false); // because it was never there to begin with
            expect(mockMapAddLayer.called).to.equal(false);
            expect(mockMapRemoveLayer.called).to.equal(false);
        });

        it("removes unchecked layer from map", function () {
            var el = layerlist.domElement.querySelectorAll("input")[0];
            el.checked = false;
            layerlist._handleLayerChange(
                { layer: layer, name: "test", domElement: domElement },
                { currentTarget: el }
            );

            // assertions
            expect(layerlist._map.hasLayer( layer )).to.equal(false); // because it was removed
            expect(mockMapAddLayer.called).to.equal(false);
            expect(mockMapRemoveLayer.callCount).to.equal(2);  // TODO: I don't know why this is 2 and not 1...
        });

    });

    describe("_handleLayerClick", function () {
        var layerlist;
        var layer;
        var mockSelectAdd;
        var mockSelectRemove;

        beforeEach(function () {
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            mockSelectAdd = sinon.spy(layerlist.selection, "add");
            mockSelectRemove = sinon.spy(layerlist.selection, "remove");
        });

        afterEach(function(){
            mockSelectAdd.restore();
            mockSelectRemove.restore();
        });

        it("if the currentTarget is NOT selected", function () {
            layerlist._map = map;
            layerlist.domElement = document.createElement("div");
            layerlist.domElement.className = "test";

            layerlist.addLayer( layer, "test" );
            var el = layerlist.domElement.querySelectorAll(".layer-name")[0];
            layerlist._handleLayerClick( { layer: layer, name: "test" }, { currentTarget: el } );
            var elPostEvent = layerlist.domElement.querySelectorAll(".layer-name")[0];

            // assertions
            expect(mockSelectAdd.called).to.equal(true);
            expect(mockSelectRemove.called).to.equal(false);
            expect(elPostEvent.className.indexOf("selected") !== -1).to.equal(true);
        });

        it("if the currentTarget is already selected", function () {
            layerlist._map = map;
            layerlist.domElement = document.createElement("div");
            layerlist.domElement.className = "test";

            layerlist.addLayer( layer, "test" );
            var el = layerlist.domElement.querySelectorAll(".layer-name")[0];
            el.className = el.className + " selected";
            layerlist._handleLayerClick( { layer: layer, name: "test" }, { currentTarget: el } );
            var elPostEvent = layerlist.domElement.querySelectorAll(".layer-name")[0];

            // assertions
            expect(mockSelectAdd.called).to.equal(true);
            expect(mockSelectRemove.called).to.equal(false);
            expect(elPostEvent.className.indexOf("selected") !== 1).to.equal(true);
        });

    });
    describe("_handleLayerClick", function () {
        var layers;

        beforeEach(function () {
            var leftovers = document.getElementsByClassName('layer-name');
            for (var i = leftovers.length; i > 0; i--) {
                var element = leftovers[i-1];
                element.parentNode.removeChild(element);
                delete element;
            };

            layers = [];
            layerlist = new L.Dropchop.LayerList( map, { layerContainerId: 'dropzone' } );

            // Populate layerlist
            for (var i = 1; i < 4; i++) {
                layer = L.geoJson( window.testingData.polygon );
                obj = layerlist.addLayer(layer, 'layer' + i);
                layers.push(obj);
            };
        });

        it("selects single layer on layerclick", function () {
            layerlist._handleLayerClick(layers[0], {
                currentTarget: layers[0].domElement.getElementsByClassName('layer-name')[0],
            });
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[0]);

            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layerlist.selection.list).to.not.contain(layers[1]);

            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layerlist.selection.list).to.not.contain(layers[2]);
        });

        it("selects multiple layers on layerclick with metaKey", function () {
            layerlist._handleLayerClick(layers[0], {
                currentTarget: layers[0].domElement.getElementsByClassName('layer-name')[0],
            });
            layerlist._handleLayerClick(layers[2], {
                currentTarget: layers[2].domElement.getElementsByClassName('layer-name')[0],
                metaKey: true
            });
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[0]);

            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layerlist.selection.list).to.not.contain(layers[1]);

            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[2]);
        });

        it("selects all layers between selected layer and layerclick with shiftKey", function () {
            layerlist._handleLayerClick(layers[0], {
                currentTarget: layers[0].domElement.getElementsByClassName('layer-name')[0],
            });

            layerlist._handleLayerClick(layers[2], {
                currentTarget: layers[2].domElement.getElementsByClassName('layer-name')[0],
                shiftKey: true
            });
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[0]);

            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[1]);

            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layerlist.selection.list).to.contain(layers[2]);
        });

        it("checking unselected layer does not affect selected layer", function () {
            layerlist.selection.add(layers[0]);
            layerlist.selection.add(layers[1]);
            layers[0].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[1].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = false;
            layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked = false;
            layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked = false;

            // Ensure proper setup
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);

            // Change setup
            layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked = true;
            layers[2].domElement.getElementsByClassName('layer-toggle')[0].onchange(
                { currentTarget: layers[0].domElement.getElementsByClassName('layer-toggle')[0], }
            );

            // Ensure layers adjust properly
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);

        });

        it("checking one selected layer checks other unchecked selected layers", function () {
            layerlist.selection.add(layers[0]);
            layerlist.selection.add(layers[2]);
            layers[0].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[2].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = false;
            layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked = false;
            layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked = false;

            // Ensure proper setup
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);

            // Change setup
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = true;
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].onchange(
                { currentTarget: layers[0].domElement.getElementsByClassName('layer-toggle')[0], }
            );

            // Ensure layers adjust properly
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
        });

        it("unchecking one selected layer unchecks other checked selected layers", function () {
            layerlist.selection.add(layers[0]);
            layerlist.selection.add(layers[2]);
            layers[0].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[2].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');

            // Ensure proper setup
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);

            // Change setup
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = false;
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].onchange(
                { currentTarget: layers[0].domElement.getElementsByClassName('layer-toggle')[0], }
            );

            // Ensure layers adjust properly
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
        });

        it("checking one selected layer does not uncheck already checked selected layer", function () {
            layerlist.selection.add(layers[0]);
            layerlist.selection.add(layers[1]);
            layers[0].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[1].domElement.getElementsByClassName('layer-name')[0].classList.add('selected');
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = false;

            // Ensure proper setup
            expect(layers[0].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[1].domElement.getElementsByClassName('layer-name')[0].className).to.contain('selected');
            expect(layers[2].domElement.getElementsByClassName('layer-name')[0].className).to.not.contain('selected');
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(false);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);

            // Change setup
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked = true;
            layers[0].domElement.getElementsByClassName('layer-toggle')[0].onchange(
                { currentTarget: layers[0].domElement.getElementsByClassName('layer-toggle')[0], }
            );

            // Ensure layers adjust properly
            expect(layers[0].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[1].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
            expect(layers[2].domElement.getElementsByClassName('layer-toggle')[0].checked).to.equal(true);
        });
    });

});
