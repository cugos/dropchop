import React from 'react'
import FontAwesome from 'react-fontawesome'
import './Menu.scss'

export const Button = ({operation, tooltip, icon, className}) => (
  <button className={"menu-action " + className} data-operation={ operation } data-tooltip={ tooltip }>
    <FontAwesome name={ icon } />
  </button>
)
