import React from 'react';
export default class FunctionPanel extends React.Component {
    state={
      menus: [{
        icon: 'cheliangleixing',
        id: 'roles'
      }, {
        icon: 'iconfontzhizuobiaozhun023150',
        id: 'XG'
      }, {
        icon: 'hongfaqi',
        id: 'trigger'
      }
      // ,{
      //   icon: 'daoluyongdu',
      //   id: 'trafficFlow'
      // }
      ],
      now: ''
    }
     
    componentDidMount() {}

    changePanel(item) {
      const { leftbar } = this.props;
      let now = false;
      if (this.state.now !== item.id) {
        now = item.id;
      }
      leftbar.setState({
        now: now
      });
      this.setState({
        now: now
      });
    }

    
    render() {
      const now = this.state.now;
      return <div className="functionPanel">
        {
          this.state.menus.map(item => {
            return <div className={now === item.id ? 'active' : ''} key={item.id} onClick={() => this.changePanel(item)} ><i className={'icon-' + item.icon + ' et-icon'} /></div>;
          })
        }
      </div>;
    }
}