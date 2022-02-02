import './App.css';
import socket from './utilities/socketConnection';
import React, { Component } from 'react'
import Widget from './Widget';

class App extends Component {
  constructor() {
    super()
    this.state = {
      performanceData: {}
    }
  }

  componentDidMount() {
    socket.on('data', (data) => {
      console.log('Data on Mount: ', data)
      // Set state here to re-render app based on performance data (every 1 second)
      // We need to make a copy of current state so we can mutate it
      const currentState = ({...this.state.performanceData})
      console.log('THis currentState: ', currentState)
      // currentState is an object, so we can use macaddress as key
      currentState[data.macAddress] = data;

      this.setState({
        performanceData: currentState
      })
    })
  }

  render() {
  console.log('This perf data: ', this.state.performanceData)
  let widgets = []
  const data = this.state.performanceData
  // Grab each maching by property
  Object.entries(data).forEach(([key, value]) => {
    widgets.push(<Widget key={key} data={value}/>)
  })
  console.log('This is the data: ', data)
  console.log('These are my widgets', widgets)
  return (
    <div className="App">
      {widgets}
    </div>
  );
  }
}

export default App;
