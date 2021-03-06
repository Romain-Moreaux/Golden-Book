// Packages
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

// Components
import MessageList from "./MessageList";
import Login from "./Login";
import Message from "./Message";

// Const
const ROOT = "https://livredor-api.herokuapp.com/";
const GET_MESSAGES = ROOT + "messages";
const POST_LOGIN = ROOT + "login";
const POST_MESSAGE = ROOT + "message";

class App extends React.Component {
  state = {
    loading: false,
    messages: [],
    submit: {},
    user: this.isLogged()
  };

  /*
    @Param `object`, `string`
    @exec `class method`
  */
  handleSubmit = (event, type) => {
    event.preventDefault();
    if (type === "login") this.postLogin();
    else if (type === "message") this.postMessage();
  };

  /*
    @Param `object`, `string`
    @exec `setState()`
  */
  handleChange = (event, type) => {
    let refSubmit = { ...this.state.submit };
    let refType = { ...this.state.submit[type] };
    refType = event.target.value;
    refSubmit[type] = refType;
    this.setState({ submit: refSubmit });
  };

  /*
    @exec `API request`
    @exec `setState()`
  */
  getMessages = async () => {
    try {
      const response = await axios.get(GET_MESSAGES);
      this.setState({
        messages: response.data,
        loading: this.state.loading && false
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /*
    @exec `API request`
    @exec `setState()`
  */
  postLogin = async () => {
    try {
      // store response in variable
      const response = await axios.post(POST_LOGIN, {
        username: this.state.submit.username,
        password: this.state.submit.password
      });

      // Generate Cookies
      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("username", response.data.username, { expires: 7 });

      // Call SetState for re-Render
      this.setState({
        user: {
          token: response.data.token,
          username: response.data.username
        },
        submit: {}
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  /*
    @exec `API method`
    @return `Object` or `null`
  */
  isLogged() {
    const TOKEN = Cookies.getJSON("token");
    const USERNAME = Cookies.getJSON("username");

    if (TOKEN && USERNAME) return { username: USERNAME, token: TOKEN };
    else return null;
  }

  logOut() {
    Cookies.remove("token");
    Cookies.remove("username");
    this.setState({ user: {} });
  }

  /*
    @exec `API request`
    @exec `setState()`
  */
  postMessage = async () => {
    try {
      await axios.post(
        POST_MESSAGE,
        { content: this.state.submit.message },
        { headers: { Authorization: "Bearer " + this.state.user.token } }
      );
      this.setState({ submit: {} });
    } catch (error) {
      console.log(error.message);
    }
  };

  /*
    @exec `Class method`
  */
  componentDidMount = () => {
    this.getMessages();
  };

  /*
    @param `callback`, `number`
    @exec `setState()`
  */
  delayRequest(cb, delay) {
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
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                this.state.loading ? (
                  // loading
                  <div className="loader">...Loading</div>
                ) : (
                  // Not Loading
                  <React.Fragment>
                    <MessageList
                      {...props}
                      messages={this.state.messages}
                      refreshList={() => {
                        this.delayRequest(this.getMessages, 500);
                      }}
                    />
                    {this.isLogged() ? (
                      // User is logged
                      <React.Fragment>
                        <Message
                          handleSubmit={e => {
                            this.handleSubmit(e, "message");
                          }}
                          handleMessageChange={e => {
                            this.handleChange(e, "message");
                          }}
                        />
                        <p>
                          Logged in as
                          {this.state.user.username
                            ? this.state.user.username
                            : null}
                          &nbsp;
                          <button
                            onClick={() => {
                              this.logOut();
                            }}
                          >
                            Logout
                          </button>
                        </p>
                      </React.Fragment>
                    ) : (
                      //User not logged
                      <p>
                        You need to <Link to="/login">Login</Link> to add a
                        message
                      </p>
                    )}
                  </React.Fragment>
                )
              }
            />
            <Route
              path="/login"
              render={props => (
                <React.Fragment>
                  <Login
                    {...props}
                    handleSubmit={e => {
                      this.handleSubmit(e, "login");
                    }}
                    handleUsernameChange={e => {
                      this.handleChange(e, "username");
                    }}
                    handlePasswordChange={e => {
                      this.handleChange(e, "password");
                    }}
                  />

                  {this.isLogged() && <Redirect to="/" />}
                </React.Fragment>
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
