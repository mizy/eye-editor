import React from 'react';
import Tab from 'antd/lib/tabs';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Traffic from '../component/traffic';

export default class TrafficPanel extends React.Component {
  state = {
    visible: false,
    traffic: {},
    agentSource: {}
  }
  object = {};//3d对象实例

  constructor(cfg) {
    super(cfg);
  }

  componentDidMount() {
    this.listenPanelChecked();
  }

  listenPanelChecked() {
    window.globalState.addEventListener('selectAgentSource', (e) => {
      // const agentSource = window.globalState.schema.agentSources[e.agentSource.name];
      this.setState({
        visible: true,
        agentSource: e.agentSource
      });
    });
    window.globalState.addEventListener('selectTrafficArea', (e) => {
    });
    window.globalState.addEventListener('deselect', (e) => {
      if (e.object) this.setState({
        visible: false,
        traffic: {}
      });
    });
  }

  changeForm(data) {
    const {agentSource} = this.state;
    agentSource.roles = ['man', 'car', 'motor', 'other'];
    agentSource.percent = [data.man, data.car, data.motor, data.other];
    window.globalState.history.modifyAgentSource(agentSource);
    this.setState({
      agentSource
    });
  }

  renderForm() {
    const agentSource = this.state.agentSource;
    const percent = agentSource.percent || {};
    const style = {width: 180};
    const formDom = <Form onChange={this.changeForm.bind(this)}>
      <Form.Item label="名称">
        <Input style={style} name="name" readOnly value={agentSource.name}/>
      </Form.Item>
      <div>行为分布</div>

    </Form>;
    return formDom;
  }

  /**
   * 起始区域改变
   */
  changeStartArea(data) {
    const {agentSource} = this.state;
    agentSource.initareas = data;
    window.globalState.history.modifyAgentSource(agentSource);
    this.setState({agentSource});
  }

  /**
   * 终点区域改变
   */
  changeEndArea(data) {
    const {agentSource} = this.state;
    agentSource.goalareas = data;
    window.globalState.history.modifyAgentSource(agentSource);
    this.setState({agentSource});
  }

  render() {
    const {agentSource} = this.state;
    return (<div className={this.state.visible ? 'rightbar ' : 'rightbar shrink'}>
      <Tab>
        <Tab.Item title="配置">
          <Traffic title="起始区域配置" traffics={agentSource.initareas || []} onChange={this.changeStartArea.bind(this)}/>
          <Traffic title="终点区域配置" traffics={agentSource.goalareas || []} onChange={this.changeEndArea.bind(this)}/>
        </Tab.Item>
        <Tab.Item title="属性">
          <div className="traffic-attr">
            {this.renderForm()}
          </div>
        </Tab.Item>
      </Tab>
    </div>);
  }
}
