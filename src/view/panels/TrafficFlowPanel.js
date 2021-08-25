import React from 'react';
import Icon from 'antd/lib/icon';
export default class trafficFlowPanel extends React.Component {
    state={
      agentSources: [],
      agentSource: {}
    }

    constructor(config) {
      super(config);
    }

    componentDidMount(cfg) {
        
      window.globalState.addEventListener('deselect', (e) => {
        if (e.object) this.setState({
          agentSource: {}
        });
      });
      window.globalState.addEventListener('loadSchema', (e) => {
        this.setState({
          agentSources: window.globalState.schema.agentSources || []
        });
      });
    }


    //进入绘制模式
    selectItem(object) {
      window.globalState.dispatchEvent({
        type: 'deselect',
      });
      this.setState({ agentSource: object });
      window.globalState.dispatchEvent({
        type: 'selectAgentSource',
        agentSource: object
      });
    }

    //渲染trigger
    renderItems() {
      const agentSources = this.state.agentSources;
      const now = this.state.agentSource;
      const items = [];
      let i = 0;
      for (const x in agentSources) {
        const item = agentSources[x];
        let className = 'side-item';
        if (item.name === now.name) {
          className += ' active';
        }
        i++;
        items.push(<div key={x} className={className} onClick={(e) => {this.selectItem(item, e)}}>
                    交通流{i}
          <Icon onClick={(e) => {e.stopPropagation();this.deleteItem(x)}} type="ashbin" size="small" style={{ float: 'right', cursor: 'pointer' }} />
        </div>);
      }
      return items;
    }

    //删除交通流
    deleteItem(index) {
      const { agentSources } = this.state;
      window.globalState.history.removeAgentSource(agentSources);
      delete agentSources[index];
      this.setState({ agentSources });
      agentSources.initareas.map(item => {
        const trafficArea = window.globalState.trafficAreas[item.name];
        window.globalState.viewer.viewport.deleteItemTraffic(trafficArea);
      });
      agentSources.goalareas.map(item => {
        const trafficArea = window.globalState.trafficAreas[item.name];
        window.globalState.viewer.viewport.deleteItemTraffic(trafficArea);
      });
      window.globalState.dispatchEvent({
        type: 'deselect', object: 'make rightbar close'
      });
      return false;
    }

    //添加交通流
    addItem() {
      const { agentSources } = this.state;
      const agentSource = {
        name: 'as_' + (new Date().getTime() * Math.random()).toFixed(0),
        initareas: [],
        goalareas: [],
        roles: [],
        percent: [],
        numbers: 1
      };
      agentSources[agentSource.name] = (agentSource);
      this.setState({ agentSources });
      window.globalState.history.modifyAgentSource(agentSource);
    }

    render() {
      const visible = this.props.visible;
      return (
        <div style={{ width: !visible ? '0px' : '200px' }} className="sidePanel">
          <div className="side-panel-title">交通流
            <Icon onClick={this.addItem.bind(this)} style={{ marginLeft: '100px', cursor: 'pointer' }} type="add" size="small"/></div>
          {this.renderItems()}
        </div>
      );
    }
}