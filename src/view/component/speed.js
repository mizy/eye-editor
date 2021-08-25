import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const list = [
  {
    value: 'single',
    label: '单值'
  }, {
    value: 'area',
    label: '区间'
  }, {
    value: 'multi',
    label: '离散'
  }
];

export default class Speed extends React.Component {
  state = {
    now: '',
    typeValue: 'single',
    speeds: [],
    unknow: false
  }
  props = {
    label: '速度(m/s):',
    speed: null,
    onChange: () => {
    }
  }

  componentDidMount() {
    this.formatProps(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.formatProps(props);
  }

  formatProps(props) {
    const speed = props.speed;
    let unknow = props.unknow;
    this.setState({
      unknow
    })
    let typeValue = '';
    if (Array.isArray(speed)) {
      typeValue = 'multi';
      this.setState({speeds: speed});
    } else if (typeof(speed) === 'object') {
      typeValue = 'area';
      this.setState({maxSpeed: speed.max, minSpeed: speed.min});
    } else {
      typeValue = 'single';
      this.setState({speed});
    }
    this.setState({
      defaultSpeeds: props.defaultSpeeds,
      typeValue
    });
  }

  changeState(obj) {
    this.setState(obj);
  }

  clear() {
    this.setState({
      speed: '',
      speeds: [],
      maxSpeed: '',
      minSpeed: ''
    });
  }

  onTypeChange(type) {
    let value;
    if (type === 'single') {
      value = this.state.speed;

    } else if (type === 'multi') {
      if (this.state.speeds.length > 0) {
        value = this.state.speeds;
      } else if (this.props.defaultSpeeds) {
        value = this.props.defaultSpeeds;
      }
    } else {
      if (typeof(this.state.minSpeed) !== 'undefined' && typeof(this.state.maxSpeed) !== 'undefined') {
        value = {min: this.state.minSpeed, max: this.state.maxSpeed};
      }
    }
    this.setState({
      typeValue: type
    });
    if (typeof(value) === 'undefined') {
      return
    }
    this.props.onChange && this.props.onChange(value, this.state.typeValue);
  }

  changeSingle(v) {
    this.setState({speed: v});
    this.props.onChange && this.props.onChange(v, this.state.typeValue);
  }

  changeAreaMin(v) {
    this.setState({minSpeed: v});
    this.props.onChange && this.props.onChange({min: v, max: this.state.maxSpeed}, this.state.typeValue);
  }

  changeAreaMax(v) {
    this.setState({maxSpeed: v});
    this.props.onChange && this.props.onChange({min: this.state.minSpeed, max: v}, this.state.typeValue);
  }

  renderSpeed() {
    const label = this.props.label || '速度(m/s):';
    if (this.state.typeValue === 'single') {
      return <FormItem label={label + '只能输入数值类型'}>
        <Input
          name="speed" style={{width: '80px'}}
          htmlType="number"
          min={0}
          max={50}
          readOnly={this.state.unknow}
          value={this.state.unknow ? 0 : this.state.speed}
          onChange={this.changeSingle.bind(this)}/>
      </FormItem>;
    } else if (this.state.typeValue === 'area') {
      return <FormItem label={label + '只能输入数值类型'}>
        <Input name="minSpeed" style={{width: '60px'}} min={0}
               max={50} htmlType="number" value={this.state.minSpeed || 0}
               onChange={this.changeAreaMin.bind(this)}/>
        <Input name="maxSpeed" min={0}
               max={50} style={{width: '60px', marginLeft: '10px'}} htmlType="number" value={this.state.maxSpeed || 0}
               onChange={this.changeAreaMax.bind(this)}/>
      </FormItem>;
    } else {
      const speeds = this.state.speeds;
      const dom = [];
      for (const x in speeds) {
        dom.push(
          <div className="speed-item" key={x}>
            <Input
              style={{width: '80px', marginRight: '5px', marginBottom: '5px'}}
              min={0}
              max={50} htmlType="number"
              onChange={(s, e) => {
                this.changeSpeeds(s, x)
              }} name="max_speed" value={speeds[x]}/>
            <Button size="small" onClick={e => {
              this.deleteSpeeds(x)
            }}>-</Button>
          </div>
        );
      }
      return <FormItem label={label}><Button size="small" type="primary" onClick={e => this.addSpeeds()}>+</Button>{dom}
      </FormItem>;
    }
  }

  changeSpeeds(s, index) {
    const {speeds} = this.state;
    speeds[index] = s;
    this.setState({
      speeds
    });
    this.props.onChange && this.props.onChange(speeds, this.state.typeValue);
  }

  addSpeeds() {
    const {speeds} = this.state;
    speeds.push(0);
    this.setState({
      speeds
    });
    this.props.onChange && this.props.onChange(speeds, this.state.typeValue);
  }

  deleteSpeeds(x) {
    const {speeds} = this.state;
    speeds.splice(x, 1);
    this.setState({speeds});
  }

  render() {
    return (<div><FormItem label="数值类型:">
      <RadioGroup dataSource={list} value={this.state.unknow ? 'single' : this.state.typeValue}
                  disabled={this.state.unknow} onChange={this.onTypeChange.bind(this)}/>
    </FormItem>
      {this.renderSpeed()}
    </div>);
  }
}
