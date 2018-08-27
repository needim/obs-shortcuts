import React, { Component } from "react";
import Store from "electron-store";
import Shortcut from "./Shortcut";
import {
  Segment,
  Dimmer,
  Icon,
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  Divider,
  Table
} from "semantic-ui-react";
import Noty from "noty";

const store = new Store();

class Shortcuts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      keys: "",
      hold: false,
      object: "",
      objectType: "",
      action: "",
      shortcuts: store.get("shortcuts", [])
    };

    this.recStart = this.recStart.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.saveShortcut = this.saveShortcut.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event, data) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;

    value = data.value || value;

    const name = data.name || target.name;
    this.setState({
      [name]: value
    });
  }

  recStart(e) {
    e.preventDefault();
    this.setState({
      recording: true
    });

    Mousetrap.record(sequence => {
      this.setState({
        recording: false,
        keys: sequence
      });
    });
    return false;
  }

  saveShortcut(e) {
    e.preventDefault();

    if (!this.state.keys || !this.state.object || !this.state.action) {
      new Noty({
        type: "error",
        text: "Please provide shortcut & object & action."
      }).show();
      return;
    }

    // @todo - validation

    let shortcuts = store.get("shortcuts", []);

    const parts = this.state.object.split("^^^^");
    const ID = store.get("lastid", -1) + 1;

    const newelement = {
      id: ID,
      keys: this.state.keys,
      hold: this.state.hold,
      object: parts[1],
      objectType: parts[0],
      action: this.state.action
    };

    shortcuts.push(newelement);

    this.setState({ shortcuts });

    store.set("shortcuts", shortcuts);
    store.set("lastid", ID);
  }

  handleRemove(id) {
    const shortcuts = store.get("shortcuts", []).filter(s => s.id !== id);
    this.setState({
      shortcuts
    });
    store.set("shortcuts", shortcuts);
  }

  render() {
    return (
      <React.Fragment>
        <Segment className="shortcut-create-area">
          <Dimmer active={this.props.connected !== true}>
            <div className="content">
              <h2 className="ui inverted icon header">
                <Icon name="exclamation" />
                <b>You need to connect OBS before creating new shortcuts.</b>
              </h2>
            </div>
          </Dimmer>

          <Form.Field>
            <Input
              name="keys"
              onChange={this.handleInputChange}
              value={this.state.keys}
              action={{
                content: "REC",
                onClick: this.recStart,
                className: this.state.recording ? "loading red" : "red"
              }}
              actionPosition="left"
              placeholder="<- Press record to capture keys"
            />
            <Checkbox
              onChange={this.handleInputChange}
              name="hold"
              id="hold-checkbox"
              label="Hold"
              toggle
            />
          </Form.Field>

          <Form.Field>
            <Select
              name="object"
              onChange={this.handleInputChange}
              className="fluid"
              placeholder="Select a Scene / Source"
              options={store.get("sceneHierarchy", [])}
            />
          </Form.Field>

          <Form.Field>
            <Select
              name="action"
              onChange={this.handleInputChange}
              className="fluid"
              placeholder="Select an Action"
              options={[
                { key: 1, value: "enable", text: "Enable" },
                { key: 2, value: "disable", text: "Disable" }
              ]}
            />
          </Form.Field>

          <Form.Field>
            <Button onClick={this.saveShortcut} className="green">
              Save
            </Button>
          </Form.Field>
        </Segment>

        <Divider horizontal>YOUR SHORTCUTS</Divider>

        <Segment>
          <Table basic="very" celled unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Shortcut</Table.HeaderCell>
                <Table.HeaderCell>Resource</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.HeaderCell className="center aligned">
                  Remove
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.shortcuts.map(row => (
                <Shortcut
                  key={row.id}
                  obj={row}
                  handleRemove={this.handleRemove}
                />
              ))}
            </Table.Body>
          </Table>
        </Segment>
      </React.Fragment>
    );
  }
}

export default Shortcuts;
