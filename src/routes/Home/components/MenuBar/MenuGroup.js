import React from 'react'
import FontAwesome from 'react-fontawesome'
import './Menu.scss'

export const Group = ({icon, className, children}) => (
  <div className={"menu-action menu-collapse " + className}>
    <FontAwesome name={ icon } />
    <div className="menu-collapse-inner">
      { children }
    </div>
  </div>
)
