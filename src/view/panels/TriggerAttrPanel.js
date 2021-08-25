import React from 'react';
import Tab from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';

export default class TriggerPanel extends React.Component {
  state = {
    visible: false,
    trigger: {}
  }
  object = {};
  triggerTypes = [
    {label: '任意障碍物', value: 'any'},
    {label: '指定障碍物', value: 'other'}
  ];

  constructor(cfg) {
    super(cfg);
  }

  componentDidMount() {
    this.listenPanelChecked();
  }

  listenPanelChecked() {
    window.globalState.addEventListener('selectTriggerArea', (e) => {
      const trigger = window.globalState.schema.triggers[e.object.name];
      this.object = e.object;
      this.setState({
        visible: true,
        trigger: trigger
      });
    });
    window.globalState.addEventListener('deselect', () => {
      this.setState({
        visible: false,
        trigger: {}
      });
    });
    window.globalState.addEventListener('chooseThing', e => {
      const object = e.object;
      let {trigger, binding} = this.state;
      window.globalState.viewer.viewport.binding = false;
      if (!trigger.agents) trigger.agents = [];
      trigger.agents.push(object.userData.name);
      binding = false;
      this.setState({
        trigger, binding
      });
    });
  }

  onTriggerTypeChange(value) {
    const {trigger} = this.state;
    if (value === 'any') {
      trigger.agents = value;
    } else {
      trigger.agents = [];
    }
    window.globalState.history.modifyTrigger(trigger);
    this.setState({trigger});
  }

  renderTriggers() {
    const triggers = [];
    window.globalState.triggers.map(item => {
      let className = '';
      if (this.state.trigger.name === item.name) {
        className = 'active';
      }
      triggers.push(<div key={item.name} className={className} onClick={() => {
        this.changeTrigger(item.name)
      }}>{item.name}</div>);
    });
    return [triggers];
  }

  //改变当前trigger
  changeTrigger(name) {
    const triggers = window.globalState.triggers;
    let trigger;
    for (const x in triggers) {
      if (triggers[x].name === name) {
        trigger = triggers[x];
      }
    }
    const object = window.globalState.schema.triggers[trigger.userData.name];
    this.setState({trigger: object});
    window.globalState.viewer.viewport.trigger.selectObject(trigger);
  }

  addBind() {
    window.globalState.viewer.viewport.binding = true;
    this.setState({
      binding: true
    });
  }

  deleteAgent(index) {
    const {trigger} = this.state;
    trigger.agents.splice(index, 1);
    this.setState({trigger});
  }

  //绑定关系，物体触发器才有此属性
  renderBinding() {
    const trigger = this.state.trigger;
    let triggerType;
    if (trigger.desc !== 'percept_trigger') {
      return ''
    }
    if (this.state.trigger.agents === 'any') {
      triggerType = 'any';
    } else {
      triggerType = 'other';
    }
    return <div className="binding-trigger">
      <Select
        autoWidth={true}
        value={triggerType}
        onChange={this.onTriggerTypeChange.bind(this)}
        dataSource={this.triggerTypes}/>
      {
        triggerType === 'any' ? '' :
          <React.Fragment>
            <Button type="primary" className={this.state.binding ? 'binding binding-button' : 'binding-button'}
                    onClick={this.addBind.bind(this)}>绑定障碍物</Button>
            <div className="trigger-agents">
              {trigger.agents && trigger.agents !== 'any' && trigger.agents.map((item, index) => {
                return <div key={index}><span>{item}</span><span className="delete-trigger-agent" onClick={e => {
                  this.deleteAgent(index)
                }}>-</span></div>;
              })}
            </div>
          </React.Fragment>
      }
    </div>;
  }

  render() {
    const trigger = this.state.trigger;
    return (<div className={this.state.visible ? 'rightbar ' : 'rightbar shrink'}>
      <Tab>
        <Tab.Item title="属性">
          <div className="trigger-attr">
            <div className="trigger-name">{trigger.name}</div>
            <div className="trigger-type">{trigger.desc}</div>
            {this.renderBinding()}
          </div>
        </Tab.Item>
        <Tab.Item title="触发器列表">
          <div className="triggers-list">
            {this.renderTriggers()}
          </div>
        </Tab.Item>
      </Tab>
    </div>);
  }
}
