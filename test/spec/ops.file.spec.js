describe('ops.file.dropchop.js', function() {

    var ops = {id: '#dropchop'};
    dc = {};

    beforeEach(function() {
        var dropchopElem = document.createElement('div');
        dropchopElem.id = 'dropchop';
        document.body.appendChild(dropchopElem);
        dc = dropchop;
        dc.init(ops);
        dc.layers.list = {};
    });

    afterEach(function() {
        document.body.innerHTML = '';
    });


    describe('dc.ops.file["load-arcgis"]', function() {

        it('dc.ops.file["load-arcgis"].checkJsonp', function() {
            var corsResponse = ['', '', 'CORS'];
            var jsonpResponse = ['', '', 'JSONP'];
            var defaultResponse = ['','',''];
            expect(dc.ops.file['load-arcgis'].checkJsonp).to.be.a('function');
            expect(dc.ops.file['load-arcgis'].checkJsonp(corsResponse)).to.equal(true);
            expect(dc.ops.file['load-arcgis'].checkJsonp(defaultResponse)).to.equal(true);
            expect(dc.ops.file['load-arcgis'].checkJsonp(jsonpResponse)).to.equal(false);
        });
    });
});
