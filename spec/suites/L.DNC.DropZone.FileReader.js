describe("L.DNC.DropZone.FileReader", function () {
    var map;


    beforeEach(function () {
        map = new L.Map(document.createElement('div')).setView([0, 0], 15);
    });

    describe("initialization", function () {
        var fakeOptions = { 'foo': 'bar', 'baz': 'biz' };
        var fileReader = null;
        var _console = {};

        beforeEach(function () {
            _console.debug = console.debug;
            console.debug = function(){};
            fileReader = new L.DNC.DropZone.FileReader( map, fakeOptions );
        });

        afterEach(function(){
            console.debug = _console.debug;
        });

        it("fileReader instance is activated correctly", function () {
            expect(fileReader instanceof L.DNC.DropZone.FileReader).to.equal(true);
        });

        it("fileReader instance has passed options", function () {
            expect(fileReader.options).to.eql(fakeOptions);
        });

        it("fileReader has ref to same mapping ref", function () {
            expect(fileReader._map).to.eql(map);
        });

    });

    describe("enabled fires", function () {
        var fileReader = null;
        filereader_enabled_dispatched = false;
        map_filereader_enabled_dispatched = false;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );

            fileReader.on( "enabled", function(e){
                filereader_enabled_dispatched = true;
            });

            map.on( "dropzone:enabled", function(e){
                map_filereader_enabled_dispatched = true;
            });

            fileReader.enable();

        });

        it("fileReader instance throws enabled", function () {
            expect(filereader_enabled_dispatched).to.equal(true);
        });

        it("map instance throws enabled", function () {
            expect(map_filereader_enabled_dispatched).to.equal(true);
        });

    });

    describe("enable DOES NOT fire", function () {
        // TODO: mock these with sinon spies
        it("enable will not fire if already enabled",function(){
           expect(true).to.equal(true);
        });
    });

    describe("disabled fires", function () {
        var fileReader = null;
        filereader_disabled_dispatched = false;
        map_filereader_disabled_dispatched = false;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );

            fileReader.on( "disabled", function(e){
                filereader_disabled_dispatched = true;
            });

            map.on( "dropzone:disabled", function(e){
                map_filereader_disabled_dispatched = true;
            });

            // first enable to disable
            fileReader.enable();
            fileReader.disable();

        });

        it("fileReader instance throws disabled", function () {
            expect(filereader_disabled_dispatched).to.equal(true);
        });

        it("map instance throws disabled", function () {
            expect(map_filereader_disabled_dispatched).to.equal(true);
        });

    });

    describe("disabled DOES NOT fire", function () {
        // TODO: mock these with sinon spies
        it("disable will not fire if already disabled",function(){
            expect(true).to.equal(true);
        });
    });

    describe("addHooks not called without map ref", function () {
        var fileReader = null;
        var mockDomEvent = null;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );
            fileReader._map = null; // determines that listeners are never created

            mockDomEvent = sinon.mock(L.DomEvent);
            mockDomEvent.expects("on").never();

            fileReader.addHooks();

        });

        afterEach(function(){
            mockDomEvent.restore();
        });


        it("L.DomEvent.on never called", function () {
            expect(mockDomEvent.verify()).to.equal(true);
        });

    });

    describe("addHooks called", function () {
        var fileReader = null;
        var mockDomEvent = null;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );

            mockDomEvent = sinon.mock(L.DomEvent);
            mockDomEvent.expects("on").atLeast(3);

            fileReader.addHooks();

        });

        afterEach(function(){
            mockDomEvent.restore();
        });


        it("L.DomEvent.on called", function () {
            expect(mockDomEvent.verify()).to.equal(true);
        });

    });

    describe("removeHooks not called without map ref", function () {
        var fileReader = null;
        var mockDomEvent = null;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );
            fileReader._map = null; // determines that listeners are never created

            mockDomEvent = sinon.mock(L.DomEvent);
            mockDomEvent.expects("off").never();

            fileReader.removeHooks();

        });

        afterEach(function(){
            mockDomEvent.restore();
        });


        it("L.DomEvent.off never called", function () {
            expect(mockDomEvent.verify()).to.equal(true);
        });

    });

    describe("removeHooks called", function () {
        var fileReader = null;
        var mockDomEvent = null;

        beforeEach(function () {
            fileReader = new L.DNC.DropZone.FileReader( map, {} );

            mockDomEvent = sinon.mock(L.DomEvent);
            mockDomEvent.expects("off").atLeast(3);

            fileReader.removeHooks();

        });

        afterEach(function(){
            mockDomEvent.restore();
        });


        it("L.DomEvent.off called", function () {
            expect(mockDomEvent.verify()).to.equal(true);
        });

    });

});
