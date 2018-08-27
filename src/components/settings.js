import React, { Component } from "react";
import { Checkbox, Segment, Button, Form } from "semantic-ui-react";
import Store from "electron-store";

const { getCurrentWindow } = require("electron").remote;

const store = new Store();

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectOnStart: store.get("connectOnStart", false)
    };
    console.log(store.get("connectOnStart", false));
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event, data) {
    const target = event.target;
    let value = data.type === "checkbox" ? data.checked : target.value;

    const name = data.name || target.name;
    console.log(name, value);
    this.setState({
      [name]: value
    });

    store.set(name, value);
  }

  removeAllData() {
    store.clear();
    getCurrentWindow().reload();
  }

  render() {
    return (
      <React.Fragment>
        <Segment>
          <Form>
            <Form.Field>
              <Checkbox
                toggle
                checked={this.state.connectOnStart}
                onChange={this.handleInputChange}
                name="connectOnStart"
                label="Connect on application start"
              />
            </Form.Field>
            <Form.Field>
              <Button fluid onClick={this.removeAllData} negative>
                REMOVE ALL DATA
              </Button>
            </Form.Field>
          </Form>
        </Segment>

        <div className="ui ignored info message">
          <p>PS: I never used OBS for streaming.</p>
          <p>
            I'm still working on key combination support. For now, this version
            only supports <span className="ui label">control</span>
            <span className="ui label">shift</span> and
            <span className="ui label">alt</span> key modifiers. Also, press
            modifier keys first while recording shortcut.
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default Settings;
