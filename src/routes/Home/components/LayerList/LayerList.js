import React from 'react'
import { LayerListElement } from './LayerListElement'

// TODO: Continue to break up into components
export const LayerList = ({layers}) => (
  <ol className="layerlist">
    <li className="layer-help" style={{display: "none"}}>Welcome to <strong>dropchop</strong>! Here you can drag and drop files and they will show up in the layer list below.
      <br />
      <br />To the left you can upload and save your files or <a href="/?gist=09129c20ec020b83bf85">add example data</a> or the <a href="/?gist=d066b572e8a8ad2b6d16">US States</a>.
      <br />
      <br />To the right you'll notice some geospatial operations that become available based on selecting specific layers.</li>
    <li className="layer-toggleAll" style={{display: "list-item"}}>
      <label>
        <input id="allCheckboxes" type="checkbox" checked="" />Toggle all layers
      </label>
    </li>
    { layers.map(({key, name, layerType}) => (
      <LayerListElement
        key={key}
        name={name}
        layerType={layerType}
      />
    ))}
  </ol>
)
