export default class DataLoader {
  constructor(cfg) {
    this.pigeonMap = window.globalState.watchMap.pigeonMap;
    this.thing = window.globalState.viewer.viewport.thing;
    this.point = window.globalState.viewer.viewport.point;
    this.area = window.globalState.viewer.viewport.area;
    this.line = window.globalState.viewer.viewport.line;
    this.trigger = window.globalState.viewer.viewport.trigger;
    this.trafficArea = window.globalState.viewer.viewport.trafficArea;
  }

  /**
   * 加载yaml
   */
  loadData(data) {
    this.clear();
    this.parseDataToScene(data);
  }

  //情空所有的studio对象
  clear() {
    const things = window.globalState.things;
    things.map(item => {
      this.pigeonMap && this.pigeonMap.remove(item);
    });
  }

  //解析yaml的agent到场景里
  parseDataToScene(data) {
    if (!data.objects) return;
    const objects = data.objects;
    for (const x in objects) {
      const data = objects[x];
      const position = data.initlocation[0];
      this.thing.addThing(data, position, (mesh) => {
        this.point.addPoints(data, mesh);
        this.area.addAreas(data, mesh);
        if (data.role.name !== 'gplus')
          this.line.update(mesh);
      });
      if (data.role.name === 'gplus') {//地图重新配置
        window.globalState.watchMap.setCenter([position.x, position.y]);
      }

    }
    for (const x in data.triggers) {
      const trigger = data.triggers[x];
      if (!trigger.desc) trigger.desc = trigger.type;
      const object = this.trigger.addTrigger(trigger);
      trigger.points.map(coord => {
        this.trigger.addPoint({coord, object});
      });
      this.trigger.updateLine(object);
    }
    this.parseAgentSource(data.agentSources);
  }

  parseAgentSource(agentSources) {
    let areas = [];
    for (const x in agentSources) {
      areas = areas.concat(agentSources[x].initareas);
      areas = areas.concat(agentSources[x].goalareas);
    }
    areas.map(item => {
      const trafficObject = this.trafficArea.addNewTraffic(item);
      item.points.map(point => {
        this.trafficArea.addPoint({
          coord: point,
          object: trafficObject
        });
      });
      this.trafficArea.updateLine(trafficObject);
      window.globalState.trafficAreas[item.name] = trafficObject;
    });
  }
}
