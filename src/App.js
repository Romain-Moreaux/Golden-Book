import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import axios from "axios";
import MessageList from "./MessageList";
import Login from "./Login";
import Message from "./Message";

const GETS_MESSAGES = "https://livredor-api.herokuapp.com/messages";
const POST_LOGIN = "https://livredor-api.herokuapp.com/login";
const POST_MESSAGE = "https://livredor-api.herokuapp.com/message";

class App extends React.Component {
  state = {
    loading: false,
    messages: [],
    login: { username: "", password: "" },
    user: {},
    message: ""
  };

  handleSubmit = event => {
    console.log(this.state.login);
    this.postLogin();
    event.preventDefault();
  };

  handleMessageSubmit = event => {
    this.postMessage();
    event.preventDefault();
  };

  handleUsernameChange = event => {
    let refLogin = { ...this.state.login };
    let refUsername = { ...this.state.login.username };
    refUsername = event.target.value;
    refLogin.username = refUsername;
    this.setState({ login: refLogin });
  };

  handlePasswordChange = event => {
    let refLogin = { ...this.state.login };
    let refPassword = { ...this.state.login.password };
    refPassword = event.target.value;
    refLogin.password = refPassword;
    this.setState({ login: refLogin });
  };

  handleMessageChange = event => {
    console.log(event.target.value);
    let refMessage = { ...this.state.message };
    refMessage = event.target.value;
    this.setState({ message: refMessage });
  };

  getDatas = async () => {
    let url = GETS_MESSAGES;
    try {
      const response = await axios.get(url);
      this.setState({
        messages: response.data,
        loading: this.state.loading && false
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  postLogin = async () => {
    let url = POST_LOGIN;
    try {
      const response = await axios.post(url, {
        username: this.state.login.username,
        password: this.state.login.password
      });

      let refUser = { ...this.state.user };

      refUser = {
        token: response.data.token,
        username: response.data.username,
        isLogged: true
      };

      this.setState({ user: refUser });
    } catch (error) {
      console.log(error.message);
    }
  };

  postMessage = async () => {
    let url = POST_MESSAGE;
    try {
      const response = await axios.post(
        url,
        { content: this.state.message },
        { headers: { Authorization: "Bearer " + this.state.user.token } }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount = () => {
    this.getDatas();
  };

  delayRequest(cb, delay) {
    console.log("delay");

    this.setState({ loading: true }, () => {
      window.setTimeout(cb, delay);
    });
  }

  render() {
    console.log(this.state);

    return (
      <Router>
        <div className="App">
          <h1>Livre d'or</h1>
          <button
            onClick={() => {
              this.delayRequest(this.getDatas, 500);
            }}
            type="button"
          >
            Refresh
          </button>
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                this.state.loading ? (
                  <div className="loader">...Loading</div>
                ) : (
                  <MessageList {...props} messages={this.state.messages} />
                )
              }
            />
            <Route
              path="/login"
              render={props => (
                <React.Fragment>
                  <Login
                    {...props}
                    handleSubmit={this.handleSubmit}
                    handleUsernameChange={this.handleUsernameChange}
                    handlePasswordChange={this.handlePasswordChange}
                  />

                  {this.state.user.isLogged && <Redirect to="/" />}
                </React.Fragment>
              )}
            />
          </Switch>
          {this.state.user.isLogged && (
            <Message
              handleSubmit={this.handleMessageSubmit}
              handleMessageChange={this.handleMessageChange}
            />
          )}
          <p>
            You need to <Link to="/login">Login</Link> to add a message
          </p>
        </div>
      </Router>
    );
  }
}

export default App;
