import React from 'react';
import Icon from 'antd/lib/icon';

/**
 * 1.  成人
movement：最大速度0.3m/s；最大加速度0.1m/s；最大角速度0.3rad/s
appearance： 半径0.1，高1.7
  1.  小孩
movement：最大速度0.1m/s；最大加速度0.07m/s；最大角速度0.3rad/s
appearance： 半径0.05，高1.0
  1.  轿车
movement：最大速度10m/s；最大加速度5m/s；最大角速度2rad/s
appearance： 长4.983，宽1.862，高1.449
  1.  suv
movement：最大速度12m/s；最大加速度6.7m/s；最大角速度2rad/s
appearance： 长4.629，宽1.88，高1.653
  1.  电动车
movement：最大速度5.5m/s；最大加速度2.6m/s；最大角速度2rad/s
appearance： 长1.8，宽0.7，高1.6
  1.  电动车
movement：最大速度4.0m/s；最大加速度1.5m/s；最大角速度2rad/s
appearance： 长1.5，宽0.7，高1.5

 */
const roles = require('./roles');
export default class RolesPanel extends React.Component {
  constructor(cfg) {
    super(cfg);
    this.state = {
      nowFlag: 'VEHICLE',
      roles: roles,
    };
    this.flags = {
      'VEHICLE': '机动车',
      'BICYCLE': '非机动车',
      'PEDESTRIAN': '人',
      'other': '其他'
    };
  }
  listenEvents() {

  }
  componentDidMount() {
    const me = this;
    $.ajax({
      url: 'https://oss-et-lab-web-online.oss-cn-shanghai.aliyuncs.com/config/8/prod.js',
      dataType: 'jsonp',
      jsonpCallback: '_callback',
      success: function (data) {
        me.setState({ roles: data });
      }
    });
  }

  //拖动时
  onDrag(data) {
    const role = JSON.parse(JSON.stringify(data));
    const name = role.name + (Math.random() * new Date().getTime()).toFixed(0);
    role.name = role.name + (Math.random() * new Date().getTime()).toFixed(0);
    role.appearance.name += (Math.random() * new Date().getTime()).toFixed(0);
    role.movement.name += (Math.random() * new Date().getTime()).toFixed(0);
    window.globalState.dispatchEvent({
      type: 'dragItem',
      data: role
    });
    window.globalState._dragItem = {//初始化
      role: role,
      name: name,
      goal: {//默认单点
        type: 'path',
        script: []
      },
      startPointType: 'single'
    };
  }

  //渲染角色
  renderRoles(carFlag) {
    const { roles } = this.state;
    const data = [];
    for (const x in roles) {
      if (x === carFlag) {
        for (const y in roles[x]) {
          data.push(
            <div key={y} className="draggableItem" draggable onDrag={() => this.onDrag(roles[x][y])} >
              <img src={roles[x][y].img}/>
              <span>{roles[x][y].name}</span>
            </div>
          );
        }
      }
    }
    return data;
  }

  //切换
  changeTab(flag) {
    if (this.state.nowFlag === flag) {
      flag = '';
    }
    this.setState({
      nowFlag: flag
    });
  }

  //渲染项目
  renderItem() {
    const data = [];
    for (const x in this.flags) {
      let className = 'slideItem';
      if (x === this.state.nowFlag) {
        className += ' active';
      }

      data.push(<div className={className} key={x} onClick={() => {this.changeTab(x)}}>
        <div className="itemTitle"><span>{this.flags[x]}</span><Icon type="arrow-down" size="xs"/></div>
        <div className="itemContent">
          {this.renderRoles(x)}
        </div>
      </div>);
    }
    data.reverse();
    return data;
  }

  render() {

    return (
      <div style={{ width: !this.props.visible ? '0px' : '200px' }} className="sidePanel rolesPanel">
        {this.renderItem()}
      </div>
    );
  }
}
