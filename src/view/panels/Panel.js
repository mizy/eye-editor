import React from 'react';
export default class Panel extends React.Component {
  componentDidMount() {}

  render() {
    const { children, style, title } = this.props;
    return <div style={style} className="panel" >
      {
        title ? <div className="panel-title-bar">
          <h3 className="panel-title">{title}</h3>
        </div> : ''
      }
      <div className="panel-content">
        {children}
      </div>
    </div>;
  }
}