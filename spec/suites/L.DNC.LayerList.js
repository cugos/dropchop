describe("L.DNC.LayerList", function () {
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
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("LayerList.initialize options and members setup correctly", function () {
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

        it("LayerList intialized correctly", function () {
            expect(layerlist instanceof L.DNC.LayerList).to.equal(true);
        });

    });

    describe("_buildDomElement", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
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
        var layer;
        var layerlist;
        var mappySpy;
        var geojsonSpy;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );

            // add a spy to know when branching on zoomToExtentonAdd runs
            mappySpy = sinon.spy(map, "fitBounds");
            // add a spy to know when L.GeoJSON.setZIndex is called in autoZIndex branching
            geojsonSpy = sinon.spy(L.GeoJSON.prototype, "setZIndex");
        });

        afterEach(function(){
            mappySpy.restore();
            geojsonSpy.restore();
        });

        it("LayerList.addLayer when options.autoZIndex is false", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = false;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayer( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test"
            });
            expect(layerlist._lastZIndex).to.equal(0);
            expect(geojsonSpy.called).to.equal(false);
            expect(mappySpy.called).to.equal(true);

        });

        it("LayerList.addLayer when options.autoZIndex is true", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayer( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test",
            });
            expect(layerlist._lastZIndex).to.equal(1);
            expect(geojsonSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(true);
        });

        it("LayerList.addLayer when options.zoomToExtentOnAdd is false", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = false;
            layerlist.addLayer( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test",
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
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
        });

        afterEach(function(){
        });

        it("LayerList.removeLayer removes the cached layer and returns LayerList instance", function () {
            var lookupId = L.stamp( layer );
            layerlist._layers[ lookupId ] = { foo: 'bar' };
            var returnedInstance = layerlist.removeLayer(layer);

            // assertions
            expect(returnedInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(typeof returnedInstance._layers[ lookupId ]).to.equal("undefined");
        });

    });

    describe("_handleLayerChanged", function () {
        var layerlist;
        var layer;
        var mockMapAddLayer;
        var mockMapRemoveLayer;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            layerlist.domElement = document.createElement("div");
            layerlist.domElement.className = "test";
            layerlist.addLayer( layer, "test" );  // Adds to layerlist & map

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
            layerlist._handleLayerChange( { layer: layer, name: "test" }, { target: el } );

            // assertions
            expect(layerlist._map.hasLayer( layer )).to.equal(true);
            expect(mockMapAddLayer.callCount).to.equal(2);  // TODO: I don't know why this is 2 and not 1...
            expect(mockMapRemoveLayer.called).to.equal(false);
        });

        it("doesn't add unchecked layer to map", function () {
            delete layerlist._map._layers[layer._leaflet_id];  // Rm from map

            var el = layerlist.domElement.querySelectorAll("input")[0];
            el.checked = false;
            layerlist._handleLayerChange( { layer: layer, name: "test" }, { target: el } );

            // assertions
            expect(layerlist._map.hasLayer( layer )).to.equal(false); // because it was never there to begin with
            expect(mockMapAddLayer.called).to.equal(false);
            expect(mockMapRemoveLayer.called).to.equal(false);
        });

        it("removes unchecked layer from map", function () {
            var el = layerlist.domElement.querySelectorAll("input")[0];
            el.checked = false;
            layerlist._handleLayerChange( { layer: layer, name: "test" }, { target: el } );

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
            layerlist = new L.DNC.LayerList( map, { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            mockSelectAdd = sinon.spy(layerlist.selection, "add");
            mockSelectRemove = sinon.spy(layerlist.selection, "remove");
        });

        afterEach(function(){
            mockSelectAdd.restore();
            mockSelectRemove.restore();
        });

        it("LayerList._handleLayerClick if the target is NOT selected", function () {
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

        it("LayerList._handleLayerClick if the target is already selected", function () {
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

});
