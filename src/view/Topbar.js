import React from 'react';

export default class App extends React.Component {
  state = {
    showModel: false,
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  onDrag(id) {
    window._dragingItem = id;
  }

  showModelWarehouse() {
    this.setState({
      showModel: true,
    });
  }

  render() {
    return '';
    /**
     (<div className='topbar'>
     <div className='topbar-title'> Matrix-Studio</div>
     <div className='menus'>
     <div className="menu-item active">编辑场景</div>
     <div className="menu-item-split"></div>
     <div className="menu-item " onClick={this.showModelWarehouse}>模型仓库</div>
     <div className="menu-item-split"></div>
     <a href="/task/task-list" target="_blank"><div className="menu-item ">场景管理</div></a>
     <div className="menu-item-split"></div>
     <a href="/case/custom-case"  target="_blank"><div className="menu-item">任务管理</div></a>
     </div>
     </div>/)
     **/
  }
}
