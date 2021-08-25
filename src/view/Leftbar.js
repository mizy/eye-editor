import React from 'react';
import RolesPanel from './panels/RolesPanel';
import FunctionPanel from './panels/FunctionPanel';
import XGPanel from './panels/XGPanel';
import TriggerPanel from './panels/TriggerPanel';
import TrafficFlowPanel from './panels/TrafficFlowPanel';
export default class App extends React.Component {
    state={
      now: ''
    }
    componentDidMount() {}

    changeState(obj) {
      this.setState(obj);
    }

    render() {
      const now = this.state.now;
      return (
        <div className="leftbar">
          <FunctionPanel leftbar={this}/>
          <RolesPanel visible={now === 'roles'} />
          <XGPanel visible={now === 'XG'} />
          <TriggerPanel visible={now === 'trigger'} />
          <TrafficFlowPanel visible={now === 'trafficFlow'} />
        </div>
      );
    }
}