import React from 'react';
import AttributePanel from './AttributePanel';
import MovePanel from './MovePanel';
import Tab from 'antd/lib/tabs';
import ThingsList from './ThingsList';
import Icon from 'antd/lib/icon';

export default class ThingPanel extends React.Component {
  state = {
    type: 'thing',
    visible: false
  }

  constructor(cfg) {
    super(cfg);
  }

  componentDidMount() {
    this.listenPanelChecked();
  }

  listenPanelChecked() {
    window.globalState.addEventListener('configXG', () => {
      this.setState({
        type: 'XG'
      });
    });
    window.globalState.addEventListener('configRoles', () => {
      this.setState({
        type: 'thing'
      });
    });
    window.globalState.addEventListener('deselect', (e) => {
      this.setState({
        visible: false
      });
    });
    window.globalState.addEventListener('selectchange', (e) => {
      this.setState({
        visible: true
      });
    });
  }

  clickRightBarIcon() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (<div className={this.state.visible ? 'rightbar ' : 'rightbar shrink'}>
      <Icon onClick={this.clickRightBarIcon.bind(this)} size="small" type="arrow-double-left"
            className="right-bar-icon"/>
      <Tab>
        <Tab.Item title="路径编辑">
          <MovePanel/>
        </Tab.Item>
        <Tab.Item title="属性编辑">
          <AttributePanel/>
        </Tab.Item>
        <Tab.Item title="元素">
          <ThingsList/>
        </Tab.Item>
      </Tab>
    </div>);
  }
}
