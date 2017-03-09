import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Map } from './Map'
import { LayerList } from './LayerList/LayerList'
import { GeoOperations } from './GeoOperations/GeoOperations'
import { Menu } from './MenuBar/Menu'
import { ModalForm } from './ModalForm'
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
    <ModalForm>
        <form className="dropchop-form-file:load-url" id="dropchop-form" data="load-url">
            <h2 className="dropchop-form-title">load-url</h2>
            <p className="dropchop-form-description">Import file from a URL</p>
            <div className="dropchop-form-parameter">
                <label className="dropchop-form-parameter-label">
                    url<input type="text" name="url" value="http://" />
                    <p className="dropchop-form-parameter-description">URL</p>
                </label>
            </div>
            <button className="dropchop-btn dropchop-btn-green dropchop-form-submit" for="load-url">Execute</button>
            <button className="dropchop-btn dropchop-btn-cancel dropchop-form-cancel" type="button">Cancel</button>
        </form>
    </ModalForm>
  </div>
)

export default HomeView
