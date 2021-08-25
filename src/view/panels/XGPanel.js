import React from 'react';
export default class RolesPanel extends React.Component {
    state={
      goVersion: '',
      mapVersion: ''
    }

    componentDidMount(cfg) {

    }

    onDrag() {
      window.globalState.dispatchEvent({
        type: 'dragXG',
        data: 'xg'
      });
      //有xg,则使用已有的数据
      if (window.globalState.schema.objects['xg']) {
        window.globalState._dragItem = window.globalState.schema.objects['xg'];
      } else {
        window.globalState._dragItem = {
          name: 'xg',
          role: {
            name: 'gplus',
            movement: {},
            appearance: {},
          },
          startPointType: 'single',
          goal: {//默认单点
            type: 'single',
            script: []
          }
        };
      }
    }

    changeMapVersion(value) {
      window.globalState.schema.mapVersion = value;
      this.setState({
        mapVersion: value
      });
    }

    changeVersion(value) {
      window.globalState.schema.goVersion = value;
      this.setState({
        goVersion: value
      });
    }

    render() {
      if (this.props.visible) {
        window.globalState.dispatchEvent({
          type: 'configXG'
        });
      }
      return (
        <div style={{ width: !this.props.visible ? '0px' : '200px' }} className="sidePanel">
          <div className="side-panel-title">自动驾驶算法</div>
          <div className="item-xg" >
            <img draggable onDrag={this.onDrag.bind(this)} src="//gw.alicdn.com/tfs/TB1QomrANTpK1RjSZR0XXbEwXXa-1730-1121.png_500x500.jpg_.webp"/>
            <span>运M</span>
          </div>
        </div>
      );
    }
}
