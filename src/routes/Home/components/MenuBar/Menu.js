import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Group } from './MenuGroup'
import { Button } from './MenuButton'
import './Menu.scss'

export const Menu = ({}) => (
  <div className="dropchop-menu-left">
    <Group
      icon="plus"
      className="menu-import"
    >
      <Button
        operation="upload"
        tooltip="Upload from your computer (.geojson)"
        icon="upload"
      />
      <Button
        operation="load-url"
        tooltip="Import file from a URL"
        icon="link"
      />
      <Button
        operation="load-gist"
        tooltip="Import files from Gist"
        icon="github"
      />
      <Button
        operation="load-overpass"
        tooltip="Query the Overpass API"
        icon="terminal"
      />
      <Button
        operation="load-arcgis"
        tooltip="Query an ArcGIS Server Feature Service"
        icon="globe"
      />
      <Button
        operation="load-custom-base"
        tooltip="Add custom Mapbox basemap"
        icon="map-o"
      />
      <Button
        operation="location"
        tooltip="Add your location as a layer"
        icon="crosshairs"
      />
    </Group>
    <Group
      icon="floppy-o"
    >
      <Button
        operation="save-geojson"
        tooltip="Save as GeoJSON"
        icon="file-code-o"
      />
      <Button
        operation="save-topojson"
        tooltip="Save as TopoJSON"
        icon="object-ungroup"
      />
      <Button
        operation="save-shapefile"
        tooltip="Save as Shapefile"
        icon="file"
      />
    </Group>
    <Button
      operationdata-operation="info"
      tooltip="Learn more about dropchop"
      icon="info"
      className="dropchop-info"
    />
   </div>
)
