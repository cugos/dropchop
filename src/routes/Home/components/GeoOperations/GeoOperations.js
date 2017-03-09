import React from 'react'

export const GeoOperations = ({}) => (
  <div className="operations-geo">
    <button className="operation operation-geo operation-inactive" data-operation="along"
    disabled="disabled">
    <h4>along</h4>

    <p>Takes a line and returns a point at a specified distance along the
    line.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="bezier" disabled="disabled">
    <h4>bezier</h4>

    <p>Takes a line and returns a curved version by applying a Bezier spline
    algorithm.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="buffer" disabled="disabled">
    <h4>buffer</h4>

    <p>Calculates a buffer for input features for a given radius. Units supported are
    miles, kilometers, and degrees.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="center" disabled=
    "disabled">
    <h4>center</h4>

    <p>Creates a point in the center of the feature.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="centroid" disabled=
    "disabled">
    <h4>centroid</h4>

    <p>Creates a point in the centroid of the features.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="destination" disabled=
    "disabled">
    <h4>destination</h4>

    <p>Takes a Point and calculates the location of a destination point given a
    distance in degrees, radians, miles, or kilometers; and bearing in degrees. This
    uses the Haversine formula to account for global
    curvature.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="envelope" disabled="disabled">
    <h4>envelope</h4>

    <p>Takes any number of features and returns a rectangular Polygon that encompasses
    all vertices.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="explode" disabled=
    "disabled">
    <h4>explode</h4>

    <p>Takes a feature or set of features and returns all positions as
    points.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="sample" disabled="disabled">
    <h4>sample</h4>

    <p>Takes a FeatureCollection and returns a FeatureCollection with given number of
    features at random.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="simplify" disabled=
    "disabled">
    <h4>simplify</h4>

    <p>Takes a LineString or Polygon and returns a simplified version. Internally uses
    simplify-js to perform simplification.</p></button><button className=
    "operation operation-geo operation-inactive" data-operation="tin" disabled=
    "disabled">
    <h4>tin</h4>

    <p>Triangulated irregular network, interpolation method</p></button><button className=
    "operation operation-geo operation-inactive" disabled="disabled" data-operation=
    "midpoint">
    <h4>midpoint</h4>

    <p>Takes two points and returns a point midway between
    them.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="union" disabled="disabled">
    <h4>union</h4>

    <p>Takes two polygons and returns a combined polygon. If the input polygons are not
    contiguous, this function returns a MultiPolygon
    feature.</p></button><button className="operation operation-geo operation-inactive"
    data-operation="within" disabled="disabled">
    <h4>within</h4>

    <p>Takes a set of points and a set of polygons and returns the points that fall
    within the polygons. First input should be the points.</p></button>
  </div>
)
