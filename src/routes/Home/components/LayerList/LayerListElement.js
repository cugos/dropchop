import React from 'react'
import './LayerListElement.scss'

export const LayerListElement = ({stamp, name, layerType}) => (
  <li className="layer-element" data-stamp={ stamp }>
    <div className="layer-name">{ name }</div>
    <input className="layer-toggle" type="checkbox" />
    <span className={ "layer-type-image sprite sprite-layer-" + layerType }></span>
    <button title="More Options" className="layer-action layer-dropdown">
      <i className="fa fa-ellipsis-h"></i>
    </button>
  </li>
)
