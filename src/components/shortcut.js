import React, { Component } from "react";
import { Table, Button, Icon, Label } from "semantic-ui-react";

class Shortcut extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table.Row>
        <Table.Cell>
          <h3>
            {this.props.obj.keys}
            {this.props.obj.hold ? (
              <Label size="mini" style={{ float: "right", marginTop: 4 }}>
                HOLD
              </Label>
            ) : (
              ""
            )}
          </h3>
        </Table.Cell>
        <Table.Cell>{this.props.obj.object}</Table.Cell>
        <Table.Cell>{this.props.obj.action}</Table.Cell>
        <Table.Cell className="center aligned">
          <Button
            icon
            onClick={() => this.props.handleRemove(this.props.obj.id)}
          >
            <Icon name="trash" />
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Shortcut;
