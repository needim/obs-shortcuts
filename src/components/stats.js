import React, { Component } from "react";
import { Table, Header, Label } from "semantic-ui-react";

class Stats extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table basic="very" celled unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <h4>Streaming</h4>
            </Table.Cell>
            <Table.Cell>
              {this.props.heartbeat.streaming ? (
                <Label color="green">YES</Label>
              ) : (
                <Label color="red">NO</Label>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <h4>Recording</h4>
            </Table.Cell>
            <Table.Cell>
              {this.props.heartbeat.recording ? (
                <Label color="green">YES</Label>
              ) : (
                <Label color="red">NO</Label>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <h4>Current Scene</h4>
            </Table.Cell>
            <Table.Cell>
              <strong>{this.props.heartbeat.currentScene}</strong>
            </Table.Cell>
          </Table.Row>
          {this.props.heartbeat.streaming ? (
            <React.Fragment>
              <Table.Row>
                <Table.Cell>
                  <h4>Stream Time</h4>
                </Table.Cell>
                <Table.Cell>
                  <strong>{this.props.streamStats.streamTimecode}</strong>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h4>Dropped Frames</h4>
                </Table.Cell>
                <Table.Cell>
                  <strong>{this.props.streamStats.numDroppedFrames}</strong>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h4>Kbits Per Second</h4>
                </Table.Cell>
                <Table.Cell>
                  <strong>{this.props.streamStats.kbitsPerSec}</strong>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h4>Bytes Per Second</h4>
                </Table.Cell>
                <Table.Cell>
                  <strong>{this.props.streamStats.bytesPerSec}</strong>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h4>FPS</h4>
                </Table.Cell>
                <Table.Cell>
                  <strong>{this.props.streamStats.fps}</strong>
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default Stats;
