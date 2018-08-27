import React from "react";
import { render } from "react-dom";
import ObsConnection from "./components/obsConnection";
import Shortcuts from "./components/shortcuts";
import Settings from "./components/settings";
import { Tab, Icon, Menu } from "semantic-ui-react";
import OBSWebSocket from "obs-websocket-js";
import Store from "electron-store";
const { ipcRenderer } = require("electron");
import Noty from "noty";

import "./styles/app.css";

const obs = new OBSWebSocket();
const store = new Store();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sceneHierarchy: [],
      shortcuts: [],
      connecting: false,
      connected: false,
      panes: [],
      heartbeat: {
        streaming: false,
        recording: false,
        currentScene: "none"
      },
      streamStats: {
        bytesPerSec: 0,
        fps: 0,
        kbitsPerSec: 0,
        numDroppedFrames: 0,
        numTotalFrames: 0,
        streamTimecode: ""
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Noty.overrideDefaults({
      layout: "topRight",
      container: "#notification",
      killer: true,
      timeout: 3500,
      progressBar: true,
      theme: "sunset",
      closeWith: ["click"],
      animation: {
        open: "animated faster slideInUp",
        close: "animated faster slideOutDown"
      }
    });

    const panes = [
      {
        menuItem: <Menu.Item key="obs-connection">OBS Connection</Menu.Item>,
        render: () => (
          <Tab.Pane>
            <ObsConnection
              handleSubmit={this.handleSubmit}
              connecting={this.state.connecting}
              connected={this.state.connected}
              heartbeat={this.state.heartbeat}
              streamStats={this.state.streamStats}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: (
          <Menu.Item key="shortcuts">
            <Icon name="keyboard outline" />
            Shortcuts
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <Shortcuts
              connected={this.state.connected}
              sceneHierarchy={this.state.sceneHierarchy}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: (
          <Menu.Item key="settings">
            <Icon name="sliders horizontal" />
            Settings
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <Settings />
          </Tab.Pane>
        )
      }
    ];
    this.setState({ panes });

    ipcRenderer.on("keyboard-command", (_event, arg) => {
      let parts = arg.split("^^^^");
      if (parts[0] === "keydown") {
        this.callActionDown(parts[1]);
      } else {
        this.callActionUp(parts[1]);
      }
    });

    if (
      store.get("connectOnStart", false) &&
      store.get("obs.ip", false) &&
      store.get("obs.port", false)
    ) {
      this.handleSubmit();
    }
  }

  onHeartbeat(data) {
    this.setState({
      heartbeat: {
        streaming: data.streaming,
        recording: data.recording,
        currentScene: data.currentScene
      }
    });
  }

  onStreamStatus(data) {
    this.setState({
      streamStats: {
        streamTimecode: data.streamTimecode,
        bytesPerSec: data.bytesPerSec,
        fps: data.fps.toString().substr(0, 6),
        kbitsPerSec: data.kbitsPerSec,
        numDroppedFrames: data.numDroppedFrames,
        numTotalFrames: data.numTotalFrames
      }
    });
  }

  handleSubmit(event) {
    event && event.preventDefault();

    if (!this.state.connected) {
      this.setState({
        connecting: true
      });

      obs
        .connect({
          address: `${store.get("obs.ip")}:${store.get("obs.port")}`,
          password: store.get("obs.password")
        })
        .then(() => {
          return obs.getSceneList();
        })
        .then(data => {
          let list = [];
          data.scenes.forEach(scene => {
            list.push({
              key: scene.name,
              value: "scene^^^^" + scene.name,
              text: scene.name
            });
            scene.sources.forEach(source => {
              list.push({
                key: source.name,
                value: "source^^^^" + source.name,
                text: "---- " + source.name
              });
            });
          });

          store.set("sceneHierarchy", list);

          this.setState({
            sceneHierarchy: list,
            connecting: false,
            connected: true
          });

          obs.SetHeartbeat({
            enable: true
          });

          obs.on("Heartbeat", data => {
            this.onHeartbeat(data);
          });

          obs.on("StreamStatus", data => {
            this.onStreamStatus(data);
          });
        })
        .catch(err => {
          new Noty({
            type: "error",
            text: "Connection attemp failed. Please check your credentials."
          }).show();
          this.setState({
            connecting: false,
            connected: false
          });
        });
    } else {
      obs.disconnect();
      this.setState({
        connecting: false,
        connected: false
      });
    }
  }

  callActionDown(shortcut) {
    if (!this.state.connected) return;

    let ALL_SHORTCUTS = store.get("shortcuts") || [];
    ALL_SHORTCUTS.forEach(sc => {
      if (sc.keys.join("") === shortcut) {
        switch (sc.objectType) {
          case "source":
            obs.SetSceneItemProperties({
              item: sc.object,
              visible: sc.action === "enable"
            });
            break;
          case "scene":
            obs.setCurrentScene({ "scene-name": sc.object });
            break;
          default:
        }
      }
    });
  }

  callActionUp(shortcut) {
    if (!this.state.connected) return;

    let ALL_SHORTCUTS = store.get("shortcuts") || [];
    ALL_SHORTCUTS.forEach(sc => {
      if (sc.keys.join("") === shortcut && sc.hold) {
        switch (sc.objectType) {
          case "source":
            obs.SetSceneItemProperties({
              item: sc.object,
              visible: sc.action !== "enable"
            });
            break;
          case "scene":
            // todo - we need to store previous scene to change back, but I'm not sure if there is a usecase for that
            break;
          default:
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="notification" />
        <Tab panes={this.state.panes} />
      </React.Fragment>
    );
  }
}

// Create your own root div in the body element before rendering into it
let root = document.createElement("div");

// Add id 'root' and append the div to body element
root.id = "root";
document.body.appendChild(root);

// Render the application into the DOM, the div inside index.html
render(<App />, document.getElementById("root"));
