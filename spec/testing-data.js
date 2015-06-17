(function() {

    window.testingData = {

        "polygon" :     {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -122.33714103698729,
                                    47.64000546596801
                                ],
                                [
                                    -122.33714103698729,
                                    47.640583778456666
                                ],
                                [
                                    -122.33593940734862,
                                    47.640583778456666
                                ],
                                [
                                    -122.33593940734862,
                                    47.64000546596801
                                ],
                                [
                                    -122.33714103698729,
                                    47.64000546596801
                                ]
                            ]
                        ]
                    }
                }
            ]
        } ,

        "fc_points": 
		    {
		      "type": "FeatureCollection",
		      "features": [
		        {
		          "type": "Feature",
		          "properties": {
		            "marker-color": "#7e7e7e",
		            "marker-size": "medium",
		            "marker-symbol": "",
		            "foo": "baz"
		          },
		          "geometry": {
		            "type": "Point",
		            "coordinates": [
		              6.6796875,
		              25.799891182088334
		            ]
		          }
		        },
		        {
		          "type": "Feature",
		          "properties": {
		            "marker-color": "#7e7e7e",
		            "marker-size": "medium",
		            "marker-symbol": "",
		            "foo": "bar"
		          },
		          "geometry": {
		            "type": "Point",
		            "coordinates": [
		              24.960937499999996,
		              44.84029065139799
		            ]
		          }
		        },
		        {
		          "type": "Feature",
		          "properties": {
		            "marker-color": "#7e7e7e",
		            "marker-size": "medium",
		            "marker-symbol": "",
		            "foo": "bax"
		          },
		          "geometry": {
		            "type": "Point",
		            "coordinates": [
		              29.8828125,
		              32.54681317351517
		            ]
		          }
		        }
		      ]
		} ,

		"line": {
 			"type": "Feature",
  			"properties": {},
  			"geometry": {
    			"type": "LineString",
			    "coordinates": [
			      	[-76.091308, 18.427501],
			      	[-76.695556, 18.729501],
			      	[-76.552734, 19.40443],
			      	[-74.61914, 19.134789],
			      	[-73.652343, 20.07657],
			      	[-73.157958, 20.210656]
			    ]
  			}
		},

        "line_2": {"type":"Feature","properties":{"stroke":"#555555","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[-10.546875,23.88583769986199],[-11.6015625,59.5343180010956],[83.3203125,33.43144133557529],[53.4375,77.8418477505252],[4.5703125,77.07878389624943],[-79.453125,50.064191736659104],[-121.640625,58.81374171570782],[-125.15625000000001,41.244772343082076],[-106.5234375,37.16031654673677],[-106.5234375,28.613459424004414],[-87.5390625,31.05293398570514],[-91.40625,20.632784250388028],[-76.2890625,21.94304553343818],[-78.046875,6.315298538330033]]}},

        "point_1": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              -81.650390625,
              38.34165619279595
            ]
          }
        },

        "point_2": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              -83.935546875,
              35.96022296929667
            ]
          }
        }

    }

})();