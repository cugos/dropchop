describe("L.DNC.GeoExecute", function () {
    var menu;
    var ops;
    var _console = {};

    beforeEach(function () {
        ops = {
            geo: new L.DNC.Geo(),
            geox: new L.DNC.GeoExecute()
        };


        _console.debug = console.debug;
        console.debug = function(){};
    });

    afterEach(function () {
        console.debug = _console.debug;
    });

    /*
    **
    ** BUFFER TEST
    **
    */
    describe("buffer", function () {

        it("min attributes", function () {
            var formData = {
                action: 'buffer',
                parameters: [10, 'miles'],
            };

            var inputLayers = [{
                info: {
                    name: "union1.geojson",
                    overlay: true
                },
                layer: {
                    _geojson: window.testingData.polygon
                }
            }];

            var layer = ops.geox.execute( formData.action, formData.parameters, ops.geo[formData.action], inputLayers);
            expect(layer.name).to.equal("buffer_union1.geojson");
            var expected = {
              "type":"Feature",
              "geometry":{
                "type":"Polygon",
                "coordinates":[
                  [ [ -122.33714103698729, 47.49517658129525 ],
                    [ -122.36539575073533, 47.49795942770375 ],
                    [ -122.39256465167946, 47.50620102370241 ],
                    [ -122.4176036541929, 47.51958464937894 ],
                    [ -122.43955052345109, 47.53759597950422 ],
                    [ -122.45756185357637, 47.5595428487624 ],
                    [ -122.47094547925289, 47.58458185127583 ],
                    [ -122.47918707525155, 47.61175075221996 ],
                    [ -122.48196992166005, 47.64000546596801 ],
                    [ -122.48196992166005, 47.640583778456666 ],
                    [ -122.47918707525155, 47.66883849220471 ],
                    [ -122.47094547925289, 47.69600739314885 ],
                    [ -122.45756185357637, 47.72104639566228 ],
                    [ -122.43955052345109, 47.74299326492046 ],
                    [ -122.4176036541929, 47.76100459504573 ],
                    [ -122.39256465167946, 47.774388220722265 ],
                    [ -122.36539575073533, 47.78262981672093 ],
                    [ -122.33714103698729, 47.78541266312943 ],
                    [ -122.33593940734862, 47.78541266312943 ],
                    [ -122.30768469360058, 47.78262981672093 ],
                    [ -122.28051579265644, 47.774388220722265 ],
                    [ -122.255476790143, 47.76100459504573 ],
                    [ -122.23352992088482, 47.74299326492046 ],
                    [ -122.21551859075954, 47.72104639566228 ],
                    [ -122.20213496508302, 47.69600739314885 ],
                    [ -122.19389336908436, 47.66883849220471 ],
                    [ -122.19111052267586, 47.640583778456666 ],
                    [ -122.19111052267586, 47.64000546596801 ],
                    [ -122.19389336908436, 47.61175075221996 ],
                    [ -122.20213496508302, 47.58458185127583 ],
                    [ -122.21551859075954, 47.5595428487624 ],
                    [ -122.23352992088482, 47.53759597950422 ],
                    [ -122.255476790143, 47.51958464937894 ],
                    [ -122.28051579265644, 47.50620102370241 ],
                    [ -122.30768469360058, 47.49795942770375 ],
                    [ -122.33593940734862, 47.49517658129525 ],
                    [ -122.33714103698729, 47.49517658129525 ]
                  ]
                ]
              },
              "properties":{ }
            };
            expect(layer.geometry).to.eql( expected );
        });
    });

    /*
    **
    ** TIN TEST
    **
    */
    describe("tin", function () {

        it("min attributes", function () {
            var formData = {
                action: 'tin',
                parameters: ['foo'],
            };

            var inputLayers = [{
                info: {
                    name: "points.geojson",
                    overlay: true
                },
                layer: {
                    _geojson: window.testingData.fc_points
                }
            }];

            var layer = ops.geox.execute( formData.action, formData.parameters, ops.geo[formData.action], inputLayers);
            expect(layer.name).to.equal("tin_points.geojson");
            var expected = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                6.6796875,
                                25.799891182088334
                            ],
                            [
                                24.960937499999996,
                                44.84029065139799
                            ],
                            [
                                29.8828125,
                                32.54681317351517
                            ],
                            [
                                6.6796875,
                                25.799891182088334
                            ]
                        ]
                    ]
                },

                "properties": {
                    "a": "baz",
                    "b": "bar",
                    "c": "bax"
                }
            };
            expect( layer.geometry ).to.eql( expected );
        });
    });






    
});
