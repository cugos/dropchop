describe("L.DNC.DropZone > ", function () {
    var map;

    beforeEach(function () {
        map = new L.Map(document.createElement('div')).setView([0, 0], 15);
    });

    describe("initialize options > ", function () {
        var fakeOptions = { 'foo': 'bar', 'baz': 'biz' };
        var dropzone = null;

        beforeEach(function () {
            dropzone = new L.DNC.DropZone( map, fakeOptions );
        });

        it("dropzone instance is activated correctly > ", function () {
            expect(dropzone instanceof L.DNC.DropZone).to.equal(true);
        });

        it("dropzone instance options correctly set > ", function () {
            expect(dropzone.options).to.eql(fakeOptions);
        });

        it("dropzone instance has fileReader ref activated correctly > ", function () {
            expect(dropzone.fileReader instanceof L.DNC.DropZone.FileReader).to.equal(true);
        });
    });

});
