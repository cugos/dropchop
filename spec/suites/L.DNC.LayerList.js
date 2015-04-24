describe("L.DNC.LayerList > ", function () {
    var map;

    beforeEach(function () {
        map =  new L.Map(document.createElement('div')).setView([0, 0],3);

        var dropzoneEl = document.createElement('div');
        dropzoneEl.setAttribute('id','dropzone');
        document.body.appendChild(dropzoneEl);
    });

    afterEach(function(){
    });


    describe("initialize > ", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("LayerList.initialize options and members setup correctly > ", function () {
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

        it("LayerList intialized correctly > ", function () {
            expect(layerlist instanceof L.DNC.LayerList).to.equal(true);
        });

    });

    describe("_initLayout > ", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("LayerList._initLayout creates expected DOM elements > ", function () {
            layerlist._initLayout();
            expect(layerlist._container.getAttribute('class')).to.equal('json-layer-list');
            expect(layerlist._container.getAttribute('id')).to.equal('layer-list');
            expect(layerlist.layerContainer.children.length).to.equal(1);
            expect(layerlist.layerContainer.firstElementChild.getAttribute('id')).to.equal('layer-list');
        });

    });

    describe("onAdd > ", function () {
        var layerlist;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
        });

        afterEach(function(){

        });

        it("LayerList.onAdd returns the expected DOM elements > ", function () {
            var container = layerlist.onAdd();
            expect(container.getAttribute('class')).to.equal('json-layer-list');
            expect(container.getAttribute('id')).to.equal('layer-list');
        });

    });

    describe("onAdd > ", function () {
        var layerlist;
        var layerListSpy;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layerListSpy = sinon.spy(L.DNC.LayerList.prototype, "_addItem" );
        });

        afterEach(function(){
            layerListSpy.restore();
        });

        it("LayerList.onAdd returns the expected DOM elements > ", function () {
            var container = layerlist.onAdd();
            expect(container.getAttribute('class')).to.equal('json-layer-list');
            expect(container.getAttribute('id')).to.equal('layer-list');
        });

        /*
        **
        **  on initialize _update will be called, but this._layers will be empty
        **  and so this._addItem should never be called
        **
        */
        it("LayerList.onAdd with empty this._layers should not call this._addItem > ", function () {
            var container = layerlist.onAdd();
            expect(layerListSpy.called).to.equal(false);
        });

    });


    describe("addTo > ", function () {
        var layerlist;
        var fakeContainerEl = L.DomUtil.create('ul', "json-layer-list");

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );

            // we already have tests for this.remove and this.onAdd
            // so mock it here to return dummy DOM elem or do nothing
            // no reason to retest nested calls
            sinon.stub(L.DNC.LayerList.prototype, "onAdd", function(){
                return fakeContainerEl
            });
            sinon.stub(L.DNC.LayerList.prototype, "remove", function(){
            });
        });

        afterEach(function(){
            L.DNC.LayerList.prototype.onAdd.restore();
            L.DNC.LayerList.prototype.remove.restore();
        });

        it("LayerList.addTo returns correct instance of layerList > ", function () {
            var layerListInstance = layerlist.addTo(map);
            expect(layerListInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(layerListInstance._map).to.eql(map);
            expect(layerListInstance._container).to.eql(fakeContainerEl);
        });

    });

    describe("remove > ", function () {
        var layerlist;
        var mockOnRemove;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );

            // add an onRemove function for testing purposes
            L.DNC.LayerList.prototype.onRemove = function(){};
            mockOnRemove = sinon.spy(L.DNC.LayerList.prototype,"onRemove");

        });

        afterEach(function(){
            mockOnRemove.restore();
        });

        it("LayerList.remove returns instance on empty this._map ref > ", function () {
            var layerListInstance = layerlist.remove();
            expect(layerListInstance).to.eql(layerlist);
        });

        it("LayerList.remove calls this.onRemove lifecycle hook if it exists > ", function () {
            layerlist._map = map;
            layerlist._initLayout();
            layerlist.remove();
            expect(mockOnRemove.called).to.equal(true);
        });

        it("LayerList.remove returns instance with deleted this._map ref and empty container DOMC > ", function () {
            layerlist._map = map;
            layerlist._initLayout();
            layerlist.remove();
            console.log( "[ MAP ]: ", layerlist._map );
            expect(layerlist._map).to.equal(null);
            expect(layerlist._container).to.equal(null);
        });

    });

    describe("addLayerToList > ", function () {
        var layer;
        var layerlist;
        var mappySpy;
        var geojsonSpy;
        var updateSpy;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );

            // LayerList._update will be tested separately so mock it here
            updateSpy = sinon.spy(L.DNC.LayerList.prototype, "_update");
            // add a spy to know when branching on zoomToExtentonAdd runs
            mappySpy = sinon.spy(map, "fitBounds");
            // add a spy to know when L.GeoJSON.setZIndex is called in autoZIndex branching
            geojsonSpy = sinon.spy(L.GeoJSON.prototype, "setZIndex");
        });

        afterEach(function(){
            L.DNC.LayerList.prototype._update.restore();
            mappySpy.restore();
            geojsonSpy.restore();
            updateSpy.restore();
        });

        it("LayerList.addLayerToList when options.autoZIndex is false > ", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = false;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayerToList( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test",
                overlay: true
            });
            expect(layerlist._lastZIndex).to.equal(0);
            expect(geojsonSpy.called).to.equal(false);
            expect(updateSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(true);

        });

        it("LayerList.addLayerToList when options.autoZIndex is true > ", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = true;
            layerlist.addLayerToList( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test",
                overlay: true
            });
            expect(layerlist._lastZIndex).to.equal(1);
            expect(geojsonSpy.called).to.equal(true);
            expect(updateSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(true);
        });

        it("LayerList.addLayerToList when options.zoomToExtentOnAdd is false > ", function () {
            layerlist._map = map;
            layerlist.options.autoZIndex = true;
            layerlist.options.zoomToExtentOnAdd = false;
            layerlist.addLayerToList( layer, "test", true );
            var lookupId = L.stamp( layer );

            // assertions
            expect(layerlist._layers[lookupId]).to.eql({
                layer: layer,
                name: "test",
                overlay: true
            });
            expect(layerlist._lastZIndex).to.equal(1);
            expect(geojsonSpy.called).to.equal(true);
            expect(updateSpy.called).to.equal(true);
            expect(mappySpy.called).to.equal(false);
        });


    });

    describe("removeLayerFromList > ", function () {
        var layer;
        var layerlist;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
        });

        afterEach(function(){
        });

        it("LayerList.removeLayerFromList removes the cached layer and returns LayerList instance > ", function () {
            var lookupId = L.stamp( layer );
            layerlist._layers[ lookupId ] = { foo: 'bar' };
            var returnedInstance = layerlist.removeLayerFromList(layer);

            // assertions
            expect(returnedInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(typeof returnedInstance._layers[ lookupId ]).to.equal("undefined");
        });

    });

    describe("_updated > ", function () {
        var layer;
        var layerlist;
        var mockAddLayer;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );

            // LayerList._addItem will have it's own tests, so mock up here
            sinon.stub(L.DNC.LayerList.prototype,"_addItem",function(){ return true; });
            // to test if this._map.hasLayer branching works, mock these up
            mockAddLayer = sinon.spy(map,'addLayer', function(){return true;});
        });

        afterEach(function(){
            mockAddLayer.restore();
            L.DNC.LayerList.prototype._addItem.restore();
        });

        it("LayerList._updated when this._container is falsy > ", function () {
            layerlist._map = map;
            var lookupId = L.stamp(layer);
            layerlist._layers[ lookupId ] = {
                layer: layer,
                name: "test",
                overlay: true
            }
            layerlist._container = null;
            sinon.stub(map,'hasLayer', function(){ return true; });
            var returnedInstance = layerlist._update();

            // assertions
            expect(returnedInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(mockAddLayer.called).to.equal(false);
            map.hasLayer.restore();
        });

        it("LayerList._updated when this._container is truthy with no this._layers > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement('div');
            sinon.stub(map,'hasLayer', function(){ return true; });
            var returnedInstance = layerlist._update();

            // assertions
            expect(mockAddLayer.called).to.equal(false);
            map.hasLayer.restore();
        });

        it("LayerList._updated when this._map already has that layer > ", function () {
            layerlist._map = map;
            var lookupId = L.stamp(layer);
            layerlist._layers[ lookupId ] = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._container = document.createElement('div');
            sinon.stub(map,'hasLayer', function(){ return true; });
            var returnedInstance = layerlist._update();

            // assertions
            expect(returnedInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(mockAddLayer.called).to.equal(false);
            map.hasLayer.restore();
        });

        it("LayerList._updated when this._map DOES NOT already have that layer > ", function () {
            layerlist._map = map;
            var lookupId = L.stamp(layer);
            layerlist._layers[ lookupId ] = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._container = document.createElement('div');
            sinon.stub(map,'hasLayer', function(){ return false; });
            var returnedInstance = layerlist._update();

            // assertions
            expect(returnedInstance instanceof L.DNC.LayerList).to.equal(true);
            expect(mockAddLayer.called).to.equal(true);
            map.hasLayer.restore();
        });

    });


    describe("_addItem > ", function () {
        /*
        **  an example of the HTML hierarchy we testing
            <li class="layer-element {{ layer-name }}">
                <input class="layer-toggle" type="checkbox" data-id="{{ layer-id }}" />
                <div class="layer-name" data-id="{{ layer-id }}">{{ layer-name }}</div>
            </li>
        **
        */
        var layerlist;
        var layer;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            sinon.stub(L.DNC.LayerList.prototype, "_handleLayerChange", function(){});
            sinon.stub(L.DNC.LayerList.prototype, "_handleLayerClick", function(){});
        });

        afterEach(function(){
            L.DNC.LayerList.prototype._handleLayerChange.restore();
            L.DNC.LayerList.prototype._handleLayerClick.restore();
        });

        it("LayerList._addItem creates correct /li/ element > ", function () {
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );

            var listItem = layerlist._container.querySelectorAll(".layer-element");
            expect( listItem.length).to.equal(1);
            expect( listItem[0].className).to.equal( "layer-element test" );
            expect( listItem[0].children.length).to.equal( 2 );
        });

        it("LayerList._addItem creates correct /input/ element > ", function () {
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );

            var input = layerlist._container.querySelectorAll("input");
            expect( input.length).to.equal(1);
            expect( input[0].className).to.equal( "layer-toggle" );
            expect( input[0].getAttribute( 'data-id' )).to.equal( ''+lookupId );
            expect( input[0].getAttribute( 'checked' )).to.equal( ''+true );
            expect( input[0].children.length).to.equal( 0 );
        });

        it("LayerList._addItem creates correct /div/ element > ", function () {
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );

            var el = layerlist._container.querySelectorAll("div");
            expect( el.length).to.equal(1);
            expect( el[0].className).to.equal( "layer-name" );
            expect( el[0].getAttribute( 'data-id' )).to.equal( ''+lookupId );
            expect( el[0].textContent ).to.equal( "test" );
            expect( el[0].children.length).to.equal( 0 );
        });

    });

    describe("_handleLayerChanged > ", function () {
        var layerlist;
        var layer;
        var mockAddLayer;
        var mockRemoveLayer;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            mockAddLayer = sinon.spy(map, "addLayer" );
            mockRemoveLayer = sinon.spy(map, "removeLayer" );
        });

        afterEach(function(){
            mockAddLayer.restore();
            mockRemoveLayer.restore();
        });

        it("LayerList._handleLayerChanged if el.checked > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );
            var el = layerlist._container.querySelectorAll("input")[0];
            layerlist._handleLayerChange( obj, { target: el } );

            // assertions
            expect(layerlist._map.hasLayer( obj.layer )).to.equal(true);
            expect(mockAddLayer.called).to.equal(true);
            expect(mockRemoveLayer.called).to.equal(false);

        });

        it("LayerList._handleLayerChanged if not el.checked and this._map.hasLayer is false > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );
            var el = layerlist._container.querySelectorAll("input")[0];
            el.checked = false;
            layerlist._handleLayerChange( obj, { target: el } );

            // assertions
            expect(layerlist._map.hasLayer( obj.layer )).to.equal(false); // because it was never there to begin with
            expect(mockAddLayer.called).to.equal(false);
            expect(mockRemoveLayer.called).to.equal(false);
        });

        it("LayerList._handleLayerChanged if not el.checked and this._map.hasLayer is true > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );
            var el = layerlist._container.querySelectorAll("input")[0];
            el.checked = false;
            map.addLayer( obj.layer );
            layerlist._handleLayerChange( obj, { target: el } );

            // assertions
            expect(layerlist._map.hasLayer( obj.layer )).to.equal(false); // because it was removed
            expect(mockAddLayer.callCount).to.equal(2); // 1st when we called addLayer in this test on line#539
            expect(mockRemoveLayer.called).to.equal(true);
        });

    });

    describe("_handleLayerClick > ", function () {
        var layerlist;
        var layer;
        var mockSelectAdd;
        var mockSelectRemove;

        beforeEach(function () {
            layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } );
            layer = L.geoJson( window.testingData.polygon );
            mockSelectAdd = sinon.spy(layerlist.selection, "add");
            mockSelectRemove = sinon.spy(layerlist.selection, "remove");
        });

        afterEach(function(){
            mockSelectAdd.restore();
            mockSelectRemove.restore();
        });

        it("LayerList._handleLayerClick if the target is NOT selected > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );
            var el = layerlist._container.querySelectorAll(".layer-name")[0];
            layerlist._handleLayerClick( obj, { currentTarget: el } );
            var elPostEvent = layerlist._container.querySelectorAll(".layer-name")[0];

            // assertions
            expect(mockSelectAdd.called).to.equal(true);
            expect(mockSelectRemove.called).to.equal(false);
            expect(elPostEvent.className.indexOf("selected") !== -1).to.equal(true);
        });

        it("LayerList._handleLayerClick if the target is already selected > ", function () {
            layerlist._map = map;
            layerlist._container = document.createElement("div");
            layerlist._container.className = "test";
            var lookupId = L.stamp( layer );
            var obj = {
                layer: layer,
                name: "test",
                overlay: true
            };
            layerlist._addItem( obj );
            var el = layerlist._container.querySelectorAll(".layer-name")[0];
            el.className = el.className + "selected";
            layerlist._handleLayerClick( obj, { currentTarget: el } );
            var elPostEvent = layerlist._container.querySelectorAll(".layer-name")[0];

            // assertions
            expect(mockSelectAdd.called).to.equal(false);
            expect(mockSelectRemove.called).to.equal(true);
            expect(elPostEvent.className.indexOf("selected") === -1).to.equal(true);
        });

    });

});