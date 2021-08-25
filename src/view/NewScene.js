import React from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/Modal';
import Form from 'antd/lib/form';
const FormItem = Form.Item;
import Input from 'antd/lib/input';
import Upload from 'antd/lib/upload';
export default class NewScene extends React.Component {
    state={
      now: '',
      visible: false
    }
    componentDidMount() {}

    //保存
    onOk(value, err) {
      if (value.name && value.mapVersion) {
        this.onClose();
        this.props.addNew(value);
      }
    }

    //关闭
    onClose() {
      this.setState({ visible: false });
    }

    changeState(obj) {
      this.setState(obj);
    }

    addNew() {
      this.setState({ visible: true });
    }

    render() {
      const formItemLayout = {
        labelCol: {
          fixedSpan: 5
        },
        wrapperCol: {
          span: 24
        }
      };
      return (
        <div className="new-scene">
          <div className="scene-img">
            <img src="https://img.alicdn.com/tfs/TB1ltoLGKSSBuNjy0FlXXbBpVXa-181-168.png" />
          </div>
          <div className="scene-des">暂未创建场景</div>
          <div className="form-area" >
            <Button type="primary" size="large" onClick={this.addNew.bind(this)}>新建场景</Button>
            <Upload
              action="//upload-server.alibaba.net/upload.do"
              autoUpload={false}
              ref={this.saveUploaderRef}
              listType="text"
            >
              <Button size="large" >本地上传</Button>
            </Upload>
          </div>
          <Modal title="新建场景"
            visible={this.state.visible}
            footer={false}
            style={{ width: '350px' }}
            onOk={this.onClose.bind(this, 'okClick')}
            onClose={this.onClose.bind(this)}>
            <Form style={{ width: '60%' }} {...formItemLayout}>
              <FormItem label="名称" required>
                <Input name="name" placeholder="名称"/>
              </FormItem>
              <FormItem label="地图版本" required>
                <Input name="mapVersion" placeholder="版本"/>
              </FormItem>
              <FormItem label=" ">
                <Form.Submit type="primary" onClick={this.onOk.bind(this)}>确定</Form.Submit>
              </FormItem>
            </Form>
          </Modal>
        </div>
      );
    }
}