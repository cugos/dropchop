describe("L.Dropchop.AppController", function () {

    describe("initialize", function () {
        var map_div;
        var sidebar_div;

        beforeEach(function () {
            map_div = document.createElement('div');
            map_div.id = "map";
            document.body.appendChild(map_div);

            sidebar_div = document.createElement('div');
            sidebar_div.id = "sidebar";
            document.body.appendChild(sidebar_div);
        });

        afterEach(function () {
            document.body.removeChild(map_div);
            document.body.removeChild(sidebar_div);
        });

        it("calls _handleGetParams", function () {
            sinon.spy(L.Dropchop.AppController.prototype, "_handleGetParams");

            var app = new L.Dropchop.AppController();
            expect(app._handleGetParams.calledOnce).to.be.true;

            L.Dropchop.AppController.prototype._handleGetParams.restore();
        });

    });

    describe("_getJsonFromUrl", function () {

        afterEach(function () {
            window.history.pushState(null, null, '/');
        });

        it("propery retrieves GET params", function () {
            // Set URL
            var url = '/?url=http://google.com&gist=1234&gist=456&url=http%3A%2F%2Fdropchop.io'
            window.history.pushState(null, null, url);

            expect(L.Dropchop.AppController.prototype._getJsonFromUrl()).to.eql(
                {
                    url: ['http://google.com', 'http://dropchop.io'],
                    gist: ['1234', '456']
                }
            );
        });
    });

    describe("_handleGetParams", function () {
        var app;
        var map_div;
        var sidebar_div;

        beforeEach(function () {
            map_div = document.createElement('div');
            map_div.id = "map";
            document.body.appendChild(map_div);

            sidebar_div = document.createElement('div');
            sidebar_div.id = "sidebar";
            document.body.appendChild(sidebar_div);
            app = new L.Dropchop.AppController();
        });

        afterEach(function () {
            document.body.removeChild(map_div);
            document.body.removeChild(sidebar_div);
            window.history.pushState(null, null, '/');
        });

        it("calls appropriate operations", function () {
            var stub = sinon.stub(app, '_getJsonFromUrl').returns({
                url: ['http://foo.com', 'http://bar.com'],
                gist: ['abcd']
            });

            var mock = sinon.mock(app.fileOpsConfig.executor);
            mock.expects('execute').withArgs('load from url', ['http://foo.com'], null, null);
            mock.expects('execute').withArgs('load from url', ['http://bar.com'], null, null);
            mock.expects('execute').withArgs('load from gist', ['abcd'], null, null);

            app._handleGetParams();

            mock.restore();
            stub.restore();
        });
    });
});
