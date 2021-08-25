import React from 'react';
import Form from 'antd/lib/form';

const FormItem = Form.Item;
export default class CrossLine extends React.Component {
  state = {
    start: {
      x: null,
      y: null,
      z: null
    },
    end: {
      x: null,
      y: null,
      z: null
    }
  }
  props = {
    start: false,
    end: false
  }

  constructor() {
    super();
    this.initLine();
    this.formatProps(this.props);
    this.initEvents();
  }

  componentDidMount() {
  }

  initLine() {
    //新增线
    this.drawTool = window.globalState.watchMap.pigeonMap.drawTool;
    this.line = window.globalState.watchMap.pigeonMap.drawTool.line.addLine({
      coord: [0, 0, 0]
    });
  }

  initEvents() {
    window.globalState.addEventListener('click', (e) => {
      // const coord = e.coord;
      if (this.selecting) {
        this.state[this.selecting] = e.coord;
        this.setState(this.state);
      }
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.formatProps(props);
  }

  formatProps(props) {
    if (!props.start || !props.end) return;
    const start = props.start;
    const end = props.end;
    if (!end || !start) return false;
    this.setState({
      start,
      end
    });
  }

  selectPoint(index) {
    this.selecting = index;
    this.toggleCrossMouse();
  }

  /**
   * 切换鼠标样式
   */
  toggleCrossMouse() {
    const studio = document.querySelector('.m-studio');
    if (studio.className !== 'm-studio crosshair') {
      studio.className = 'm-studio crosshair';
    } else {
      studio.className = 'm-studio';
    }
  }

  updateLine() {
    const {
      start,
      end
    } = this.state;
    if (!start || !end) return;
    const points = [start, end];
    this.drawTool.line.updateLine(this.line, points);
  }

  render() {
    const {
      start
    } = this.state;
    const formLayout = this.props.formLayout || {
      wrapperCol: {
        span: 20
      },
      labelCol: {
        span: 7
      }
    };
    // this.updateLine()
    return (
      <Form {...formLayout}>
        <FormItem label="起点:">
          <i onClick={() => {
            this.selectPoint('start');
          }} className="et-icon icon-view">
          </i>
          <span>{start.x},{start.y},{start.z}</span>
        </FormItem>
        <FormItem
          label="终点:">
          <i onClick={() => {
            this.selectPoint('end');
          }} className="et-icon icon-view">
          </i>
          <span>{start.x},{start.y},{start.z}</span>
        </FormItem>
      </Form>
    );
  }
}
