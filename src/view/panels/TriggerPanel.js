import React from 'react';
export default class TriggerPanel extends React.Component {
    state={
      triggers: [{
        desc: 'director_trigger',
        shape: 'polygon',
        points: [],
        name: '场景触发器'
      }
      // , {
      //   desc: 'percept_trigger',
      //   shape: 'polygon',
      //   name: '物体触发器',
      //   agents: 'any',
      //   points: [],
      //   perceptible: true
      // }
      ],
      nowTrigger: ''
    }

    triggerObject='';//当前做的trigger

    constructor(config) {
      super(config);
    }

    componentDidMount(cfg) {
      window.globalState.addEventListener('deselect', e => {//去掉鼠标手势
        this.removeCrossMouse();
        this.setState({
          nowTrigger: ''
        });
        if (this.triggerObject) {
          this.triggerObject.hoverPoint && (window.globalState.watchMap.pigeonMap.remove(this.triggerObject.hoverPoint));
          delete this.triggerObject.hoverPoint;
          window.globalState.viewer.viewport.trigger.updateLine(this.triggerObject);
          this.triggerObject = null;
        }
        window.globalState.dispatchEvent({
          type: 'exitTrigger',
        });
      });
      //添加点
      window.globalState.addEventListener('click', e => {
        if (this.state.nowTrigger) {//绘制逻辑
          if (!this.triggerObject) {
            this.triggerObject = window.globalState.viewer.viewport.trigger.addNewTrigger(this.state.nowTrigger);
          }
          window.globalState.dispatchEvent({
            type: 'addTriggerPoint',
            trigger: this.state.nowTrigger,
            coord: e.coord,
            object: this.triggerObject
          });
        }
      });
      //鼠标移动的时候更新
      window.globalState.addEventListener('mousemove', e => {
        if (!this.triggerObject) return;
        window.globalState.dispatchEvent({
          type: 'triggerMousemove',
          coord: e.coord,
          object: this.triggerObject
        });
      });
    }


    //进入绘制模式
    enterTrigger(trigger) {
      this.setState({
        nowTrigger: JSON.parse(JSON.stringify(trigger))
      });
      this.addCrossMouse();
      window.globalState.dispatchEvent({
        type: 'enterTrigger',
        trigger: trigger
      });
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

    //渲染trigger
    renderItems() {
      const triggers = this.state.triggers;
      const nowTrigger = this.state.nowTrigger;
      const items = [];
      triggers.map((item, index) => {
        let className = 'side-item';
        if (item.desc === nowTrigger.desc) {
          className += ' active';
        }
        items.push(<div key={index} className={className} onClick={(e) => {this.enterTrigger(item, e)}}>
          {item.name}
        </div>);
      });

      return items;
    }

    render() {

      return (
        <div style={{ width: !this.props.visible ? '0px' : '200px' }} className="sidePanel">
          <div className="side-panel-title">触发器</div>
          {this.renderItems()}
        </div>
      );
    }
}
