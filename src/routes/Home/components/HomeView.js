import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Map } from './Map'
import { LayerList } from './LayerList/LayerList'
import { GeoOperations } from './GeoOperations/GeoOperations'
import { Menu } from './MenuBar/Menu'
import './HomeView.scss'

export const HomeView = () => (
  <div>
    <Menu />
    <LayerList layers={
      [
        { key:"41", name:"east", layerType:"polygon" },
        { key:"47", name:"geometrycollection", layerType:"geom" },
        { key:"52", name:"props", layerType:"featurecollection" },
        { key:"55", name:"race-route", layerType:"featurecollection" },
        { key:"57", name:"routes", layerType:"featurecollection" },
        { key:"60", name:"sf", layerType:"polygon" },
        { key:"62", name:"water-fountains", layerType:"featurecollection" },
      ]
    }/>
    <GeoOperations />
    <Map />
  </div>
)

export default HomeView
