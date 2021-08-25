import React from 'react';
import ThingPanel from './panels/ThingPanel';
import TriggerAttrPanel from './panels/TriggerAttrPanel';
import TrafficAttrPanel from './panels/TrafficAttrPanel';
export default class Rightbar extends React.Component {
    state={
      type: 'thing',
      visible: true
    }
    constructor(cfg) {
      super(cfg);
    }

  
    render() { 
      return (
        <React.Fragment>
          <ThingPanel />
          <TrafficAttrPanel />
          <TriggerAttrPanel />
        </React.Fragment>
      );
    }
}