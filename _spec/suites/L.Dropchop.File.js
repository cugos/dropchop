describe("L.Dropchop.FileExecute Operations", function(){

    var menu;
    var ops;
    var exampleData = true;

    describe('Save as a geojson', function () {
        // TODO: test for geojson save
    });

    describe('Save as a shapefile', function () {
        // TODO: test for shapefile save
    });

    describe('load from url', function () {
        var xhr, requests, getRequest, _addJsonAsLayer, fakeThis;

        beforeEach(function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];
            xhr.onCreate = function (req) { requests.push(req); };

            fakeThis = {
                _addJsonAsLayer: function () {},
                getRequest: function () {}
            };
            _addJsonAsLayer = sinon.stub(fakeThis, '_addJsonAsLayer');
            getRequest = sinon.stub(fakeThis, 'getRequest');

            console.debug = sinon.stub(console, "debug");
            console.error = sinon.stub(console, "error");
        });

        afterEach(function () {
            xhr.restore();
            _addJsonAsLayer.restore();
            getRequest.restore();
            console.debug.restore();
            console.error.restore();
        });

        it('makes request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, null
            );

            expect(getRequest.calledOnce).to.equal(true);

            // Ensure that getRequest is called with a URL and callback
            var args = getRequest.firstCall.args;
            expect(args.length).to.equal(2);
            expect(args[0]).to.equal('http://foo.com/blah.geojson');
            expect(typeof args[1]).to.equal('function');
        });

        it('callback logs bad request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, null
            );

            // Ensure that when callback gets a non-200 response, error is logged
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 500;
            ajaxCallback(xhr)

            expect(console.error.calledOnce).to.equal(true);
            expect(console.error.firstCall.args).to.eql(['Request failed. Returned status of 500']);
        });

        it('callback creates layer from good request', function () {
            var fakeCallback = function(){};
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, fakeCallback
            );

            // Ensure that when callback gets a 200 response, adds data as layer
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 200;
            xhr.responseURL = 'http://foo.com/blah.geojson';
            xhr.responseText = "some geojson data goes here";
            ajaxCallback.bind(fakeThis)(xhr)

            expect(_addJsonAsLayer.calledOnce).to.equal(true);
            expect(_addJsonAsLayer.firstCall.args).to.eql(['some geojson data goes here', 'blah.geojson', fakeCallback]);
        });

    });

    describe('load from gist', function () {
        var xhr, requests, getRequest, _addJsonAsLayer, fakeThis;

        beforeEach(function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];
            xhr.onCreate = function (req) { requests.push(req); };

            fakeThis = {
                _addJsonAsLayer: function () {},
                getRequest: function () {}
            };
            _addJsonAsLayer = sinon.stub(fakeThis, '_addJsonAsLayer');
            getRequest = sinon.stub(fakeThis, 'getRequest');

            console.debug = sinon.stub(console, "debug");
            console.error = sinon.stub(console, "error");
        });

        afterEach(function () {
            xhr.restore();
            _addJsonAsLayer.restore();
            getRequest.restore();
            console.debug.restore();
            console.error.restore();
        });

        it('makes request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from gist', ['1234'], null, null, null
            );

            expect(getRequest.calledOnce).to.equal(true);

            // Ensure that getRequest is called with a URL and callback
            var args = getRequest.firstCall.args;
            expect(args.length).to.equal(2);
            expect(args[0]).to.equal('https://api.github.com/gists/1234');
            expect(typeof args[1]).to.equal('function');
        });

        it('callback logs bad request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from gist', ['1234'], null, null, null
            );

            // Ensure that when callback gets a non-200 response, error is logged
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 500;
            ajaxCallback(xhr)

            expect(console.error.calledOnce).to.equal(true);
            expect(console.error.firstCall.args).to.eql(['Request failed. Returned status of 500']);
        });

        it('callback creates layer from good request', function () {
            var fakeCallback = function(){};
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from gist', ['1234'], null, null, fakeCallback
            );

            // Ensure that when callback gets a 200 response, adds data as layer
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 200;
            xhr.responseURL = 'https://api.github.com/gists/1234';
            xhr.responseText = "{\"files\": {\"foo.js\": {\"content\": \"some geojson data goes here\", \"filename\": \"foo.js\"}}}";
            // xhr.responseText = "some geojson data goes here";
            ajaxCallback.bind(fakeThis)(xhr);

            expect(_addJsonAsLayer.calledOnce).to.equal(true);
            expect(_addJsonAsLayer.firstCall.args).to.eql(['some geojson data goes here', 'foo.js', fakeCallback]);
        });
    });

    describe('getRequest', function () {
        var xhr, requests, getRequest, _addJsonAsLayer, fakeThis;

        beforeEach(function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];
            xhr.onCreate = function (req) { requests.push(req); };
        });

        afterEach(function () {
            xhr.restore();
        });

        it('requests provided url, calls callback', function () {
            var callback = sinon.spy();
            L.Dropchop.FileExecute.prototype.getRequest('http://google.com', callback);

            expect(requests.length).to.equal(1);
            expect(requests[0].url).to.equal('http://google.com');
            // expect(callback.called).to.equal(true);  // TODO: We should assert that the callback is called with proper results data. This seems to fail for some reason.
        });

    });

    describe('_addJsonAsLayer', function () {

        var callback, notification;
        beforeEach(function () {
            callback = sinon.stub();
        });

        it("calls callback properly", function () {
            L.Dropchop.FileExecute.prototype._addJsonAsLayer('{}', 'filename.json', callback);
            expect(callback.calledOnce).to.equal(true);
            expect(callback.firstCall.args).to.eql(
                [{ add: [{ geojson: {}, name: 'filename.json' }] }]
            );
        });

        it("notifies on failure", function () {
            var fakeThis = {notification: {add: sinon.stub()}};
            console.error = sinon.stub(console, "error");
            L.Dropchop.FileExecute.prototype._addJsonAsLayer.bind(fakeThis)('bad json', 'filename.json', callback);
            expect(console.error.called).to.equal(true);
            console.error.restore();
            expect(callback.calledOnce).to.equal(false);
            expect(fakeThis.notification.add.called).to.equal(true);
            expect(fakeThis.notification.add.firstCall.args).to.eql([{
                text: 'Failed to add filename.json',
                type: 'alert',
                time: 2500
            }]);
        });

        it("uncollects single-length featurecollections", function () {
            var fakeThis = L.Dropchop.FileExecute.prototype;
            fakeThis.notification = {add: sinon.stub()};
            var featurecollection = "{\"type\":\"FeatureCollection\",\"features\":[{\"foo\":\"bar\"}]}";
            L.Dropchop.FileExecute.prototype._addJsonAsLayer.bind(fakeThis)(featurecollection, 'filename.json', callback);
            expect(callback.calledOnce).to.equal(true);
            expect(callback.firstCall.args).to.eql(
                [{ add: [{ geojson: {foo: "bar"}, name: 'filename.json' }] }]
            );
        });
    });
});