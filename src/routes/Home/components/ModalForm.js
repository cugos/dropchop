import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import { store } from '../index';
import { Provider } from 'react-redux'
import './ModalForm.scss'

export class ModalForm extends Component {
    // Design Inspration: https://www.youtube.com/watch?v=WGjv-p9jYf0
    componentDidMount() {
        this.modalTarget = document.createElement('div')
        this.modalTarget.className = 'dropchop-form'
        document.body.appendChild(this.modalTarget)
        this._render()
    }

    componentWillUpdate() {
        this._render()
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.modalTarget)
        document.body.removeChild(this.modalTarget)
    }

    _render() {
        ReactDOM.render(
            <div>{this.props.children}</div>,
            this.modalTarget
        )
    }

    render() {
        return <noscript />;
    }
}
