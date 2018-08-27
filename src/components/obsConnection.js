import React, { Component } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import Store from "electron-store";
import Stats from "./stats";
import Noty from "noty";

const store = new Store();

class ObsConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ip: store.get("obs.ip", ""),
      port: store.get("obs.port", ""),
      password: store.get("obs.password")
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    store.set(`obs.${name}`, value);
  }

  submitButtonClasses() {
    if (this.props.connecting) return "loading";
    else if (this.props.connected) return "red";
    else return "green";
  }

  render() {
    return (
      <React.Fragment>
        <Form className="obs-form" onSubmit={this.props.handleSubmit}>
          <Form.Field>
            <Input
              name="ip"
              label="IP"
              placeholder="localhost"
              value={this.state.ip}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              name="port"
              label="Port"
              placeholder="4444"
              value={this.state.port}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              name="password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Button
            disabled={this.props.connecting}
            className={this.submitButtonClasses()}
            type="submit"
          >
            {this.props.connected ? "Disconnect" : "Connect"}
          </Button>
        </Form>

        {this.props.connected ? (
          <Stats
            heartbeat={this.props.heartbeat}
            streamStats={this.props.streamStats}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default ObsConnection;
