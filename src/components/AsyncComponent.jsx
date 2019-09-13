import React from 'react'

export default function AsyncComponent(component) {
    return class ReallyComponent extends React.Component {
        constructor(props){
            
            super(props)
            this.state = {
                reallyComponent: null
            }
        }
        
        async componentDidMount() {
            var {default:rComponent} = await component()            
            this.setState({
                reallyComponent:rComponent
            })
        }

        render() {
            const C = this.state.reallyComponent
            if(C) return <C {...this.props}/>
            return null
        }
    }
}