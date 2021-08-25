import React from 'react';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

require('./traffic.less');
export default class Traffic extends React.Component {
  state = {
    list: [],
    now: {}
  }
  nowObject = false//当前绘制的区域
  componentDidMount() {
    if (this.props.traffics)
      this.setState({list: this.props.traffics});
    //添加点
    window.globalState.addEventListener('click', e => {
      if (this.nowObject) {//选中态
        window.globalState.dispatchEvent({
          type: 'addTrafficPoint',
          coord: e.coord,
          object: this.nowObject
        });
      }
    });
    //添加点
    window.globalState.addEventListener('mouseover', e => {
      if (this.nowObject) {//选中态
        window.globalState.dispatchEvent({
          type: 'trafficMousemove',
          coord: e.coord,
          object: this.nowObject
        });
      }
    });

    //完成绘制
    window.globalState.addEventListener('deselect', e => {//去掉鼠标手势
      this.removeCrossMouse();
      const {now} = this.state;
      if (this.nowObject)
        this.onChange(now, this.nowObject);
      this.setState({
        now: {}
      });
      if (this.nowObject) {
        this.nowObject.hoverPoint && (window.globalState.watchMap.pigeonMap.remove(this.nowObject.hoverPoint));
        delete this.nowObject.hoverPoint;
        window.globalState.viewer.viewport.trafficArea.updateLine(this.nowObject);
        window.globalState.viewer.viewport.trafficArea.leaveObject(this.nowObject);
        this.nowObject = null;
      }
      window.globalState.dispatchEvent({
        type: 'exitTraffic',
      });
    });
    window.globalState.addEventListener('modifyTrafficArea', e => {//去掉鼠标手势
      const {data, object} = e;
      if (data.name)
        this.onChange(data, object);
    });
  }

  onChange(now, nowObject) {
    const points = [];
    nowObject.points.map(item => {
      points.push(item.parent.position);
    });
    this.state.list.map(item => {
      if (item.name === now.name) {
        item.points = points;
      }
    });
    this.setState({list: this.state.list});
    this.props.onChange(this.state.list);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({list: props.traffics});
  }

  //渲染区域
  renderList() {
    const list = [];
    const {now} = this.state;
    this.state.list.map((item, index) => {
      list.push(
        <li className={item.name === now.name ? 'active' : ''} onClick={() => {
          this.chooseTraffic(item)
        }} key={index}>区域{index}
          <Icon onClick={(e) => {
            e.stopPropagation();
            this.deleteItem(index)
          }} type="ashbin" size="small" style={{float: 'right', cursor: 'pointer'}}/>
        </li>
      );
    });
    return list;
  }

  //删除区域
  deleteItem(index) {
    const {list} = this.state;
    const item = list[index];
    const object = window.globalState.trafficAreas[item.name];
    window.globalState.viewer.viewport.trafficArea.deleteTraffic(object);
    window.globalState.viewer.viewport.trafficArea.selecting = null;
    list.splice(index, 1);
    this.setState({
      list
    });
  }

  chooseTraffic(item) {
    if (this.state.now.name === item.name) {//取消选中
      return;
    }
    const itemObject = window.globalState.trafficAreas[item.name];
    window.globalState.viewer.viewport.trafficArea.selectObject(itemObject);
    window.globalState.viewer.viewport.trafficArea.leaveObject(this.nowObject);
    this.setState({
      now: item
    });
  }

  //添加区域
  addItem() {
    const item = {
      type: 'polygon',
      points: [],
      name: 'traffic' + (new Date().getTime() * Math.random()).toFixed(0)
    };
    this.state.list.push(item);
    this.setState({
      list: this.state.list
    });

    if (!window.globalState.trafficAreas[item.name]) {
      //新增item
      window.globalState.trafficAreas[item.name] =
        window.globalState.viewer.viewport.trafficArea.addNewTraffic(item);
    }
    this.chooseTraffic(item);
    this.nowObject = window.globalState.trafficAreas[item.name];
    this.addCrossMouse();
  }


  //添加鼠标样式
  addCrossMouse() {
    const studio = document.querySelector('.m-studio');
    studio.className = 'm-studio crosshair';
  }

  //移除鼠标样式
  removeCrossMouse() {
    const studio = document.querySelector('.m-studio');
    studio.className = 'm-studio ';
  }

  render() {
    const {title} = this.props;
    return (
      <div className="traffic-config">
        <div className="tc-title">
          {title}
        </div>
        <ul>
          {this.renderList()}
        </ul>
        <Button onClick={this.addItem.bind(this)} type="primary" className="tc-button">+ 新增区域</Button>
      </div>
    );
  }
}
