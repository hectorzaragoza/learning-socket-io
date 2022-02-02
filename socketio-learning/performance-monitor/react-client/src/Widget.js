import React , { Component } from 'react'
import Cpu from './Cpu'
import Mem from './Mem'
import Info from './Info'
import './widget.css'

class Widget extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { freeMem, totMem, usedMem, memUsage, osType, upTime, cpuModel, numCores, cpuSpeed, cpuLoad, macAddress, isActive } = this.props.data
        const cpuWidgetId = `cpu-widget-${macAddress}`
        const memWidgetId = `mem-widget-${macAddress}`
        const cpu = {cpuLoad, cpuWidgetId} 
        const mem = {usedMem, memUsage, freeMem, totMem, memWidgetId}
        const info = {macAddress, osType, cpuModel, numCores, cpuSpeed, upTime}
        let notActiveDiv = ''
        if(!isActive) {
            notActiveDiv = <div className="not-active">Offline</div>
        }

        

        return (
            <div className="widget col-sm-12">
                {notActiveDiv}
                <Cpu cpuData={cpu}/>
                <Mem memData={mem}/>
                <Info infoData={info}/>
            </div>
            
        )
    }
}

export default Widget