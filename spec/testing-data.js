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