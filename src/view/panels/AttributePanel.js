import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import Speed from '../component/speed.js';

export default class AttributePanel extends React.Component {
  constructor(config) {
    super(config);
    this.state = {
      name: '',
      length: ''
    };
  }


  componentDidMount() {
    const thing = window.globalState.selectthing;
    if (thing) {
      const data = window.globalState.schema.objects[thing.userData.name];
      this.formatAttr(data);
    }
    window.globalState.addEventListener('selectchange', (e) => {
      const object = window.globalState.schema.objects[e.mesh.userData.name];
      this.formatAttr(object);
    });
  }

  formatAttr(data) {
    this.object = data;
    const role = data.role;
    const movement = role.movement;
    const name = data.name;
    this.refs.speed && this.refs.speed.clear();
    this.setState({
      name: name,
      role: role,
      category: role.category,
      movement: movement || {},
      appearance: role.appearance || {}
    });

  }

  changeForm(data) {
    const {movement, appearance} = this.state;

    movement.max_acceleration = (data.max_acceleration);
    movement.max_turn = (data.max_turn);
    appearance.length = (data.length);
    appearance.width = (data.width);
    appearance.height = (data.height);

    movement.auto = !!data.auto;
    this.object.role.strategy = data.auto ? 'adaptive' : 'basic';
    this.object.role.movement = movement;
    this.object.role.appearance = appearance;
    this.object.name = data.name;
    this.object.role.category = data.category;
    this.object.role.model = data.model;
    window.globalState.history.modifyObject(this.object);
    this.setState({
      name: data.name,
      category: data.category,
      movement, appearance,
      role: this.object.role
    });
  }

  onSpeedChange(v, type) {
    const {movement} = this.state;
    movement.max_speed = v;
    this.setState({
      movement
    });
    this.object.role.movement = movement;
    window.globalState.history.modifyObject(this.object);
  }

  onSpeedPChange(v, type) {
    const {role} = this.state;
    role.offset = v;
    this.setState({
      role
    });
    this.object.role = role;
    window.globalState.history.modifyObject(this.object);
  }

  onAdaptiveLineChange(value) {
    this.object.adaptive_line = value;
    window.globalState.history.modifyObject(this.object);
  }

  //渲染属性
  renderAttr() {
    const {movement, appearance, role} = this.state;
    const strategyAuto = role.strategy === 'adaptive';
    return <div className="attrList attributePanel">
      <Form onChange={this.changeForm.bind(this)}>
        <Form.Item label="名称">
          <Input name="name" readOnly={true} value={this.state.name}/>
        </Form.Item>
        <Form.Item label="分类">
          <Input name="category" readOnly={true} value={this.state.category || 'UNKNOWN'}/>
        </Form.Item>
        <Form.Item label="model">
          <Input name="model" readOnly={true} value={role.model || 'UNKNOWN'}/>
        </Form.Item>
        <Form.Item label="长宽高(m)(只能输入数值型)">
          <Input style={{width: '70px'}} htmlType="number" min={0} name="length" value={appearance.length}/>
          <Input style={{width: '70px'}} htmlType="number" min={0} name="width" value={appearance.width}/>
          <Input style={{width: '70px'}} htmlType="number" min={0} name="height" value={appearance.height}/>
        </Form.Item>
        <Form.Item label="最大加速度(m/s^2)(只能输入数值型)">
          {
            this.state.category === 'UNKNOWN' ?
              <Input name="max_acceleration" min={0} max={50} placeholder="只能输入数值型" readOnly={true} htmlType="number"
                     value={0}/> :
              <Input name="max_acceleration" min={0} max={50} placeholder="只能输入数值型" htmlType="number"
                     value={movement.max_acceleration || 0}/>
          }
        </Form.Item>
        <Form.Item label="最大角速度(rad/s)">
          {
            this.state.category === 'UNKNOWN' ?
              <Input name="max_turn" min={0} max={50} readOnly={true} placeholder="只能输入数值型" htmlType="number"
                     value={0}/> :
              <Input name="max_turn" min={0} max={50} placeholder="只能输入数值型" htmlType="number"
                     value={movement.max_turn || 0}/>
          }

        </Form.Item>
        <Speed
          ref="speed"
          speed={movement.max_speed}
          unknow={this.state.category === 'UNKNOWN'}
          formLayout={{
            labelAlign: 'top',
            wrapperCol: {span: 20},
            labelCol: {span: 5}
          }}
          defaultSpeeds={movement.defaultSpeeds}
          onChange={this.onSpeedChange.bind(this)}/>
        <Form.Item label="速度追踪">
          <Switch style={{width: 100}} name="auto" checked={strategyAuto} disabled={true} checkedChildren="开启"
                  unCheckedChildren="关闭"/>
        </Form.Item>
        {strategyAuto ?
          <React.Fragment>
            <Speed
              ref="speedp"
              label="速度偏移值"
              speed={role.offset}
              formLayout={{
                labelAlign: 'top',
                wrapperCol: {span: 20},
                labelCol: {span: 5}
              }}
              defaultSpeeds={role.offset}
              onChange={this.onSpeedPChange.bind(this)}/>
          </React.Fragment> : ''
        }
      </Form>

    </div>;
  }

  render() {
    if (this.state.name && this.state.name !== 'xg' && this.object.role.name !== 'gplus') {
      return this.renderAttr();
    } else {
      return '';
    }
  }
}
