import React from 'react';

export default class ThingsList extends React.Component {
  state = {}

  componentDidMount() {
    window.globalState.addEventListener('addThing', (e) => {
      this.setState({
        things: window.globalState.things,
      });
    });
    window.globalState.addEventListener('removeThing', (e) => {
      this.setState({
        things: window.globalState.things,
      });
    });
    window.globalState.addEventListener('selectchange', (e) => {
      this.setState({
        thing: e.mesh
      });
    });
  }

  selectThing(thing) {
    window.globalState.dispatchEvent({
      type: 'selectchange',
      mesh: thing,
      pre: window.globalState.selectthing
    });
  }

  render() {
    const thing = this.state.thing || {};
    const things = this.state.things || window.globalState.things;
    const ul = [];
    const xg = window.globalState.history.XG;
    if (xg)
      ul.push(<li key={xg.uuid} className={thing.uuid === xg.uuid ? 'active' : ''} onClick={() => {
        this.selectThing(xg)
      }}>{xg.userData.name}</li>);
    for (const x in things) {
      ul.push(<li className={thing.uuid === things[x].uuid ? 'active' : ''} key={things[x].uuid} onClick={() => {
        this.selectThing(things[x])
      }}>{things[x].userData.name}</li>);
    }
    return <div className="things-panel">
      <ul className="things-list">{ul}</ul>
    </div>;
  }

}
