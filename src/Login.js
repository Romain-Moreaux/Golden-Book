import React from "react";
import { Link } from "react-router-dom";

function Login(props) {
  return (
    <React.Fragment>
      <Link to="/">&lt;-- Go back</Link>
      <form onSubmit={props.handleSubmit}>
        <input
          placeholder="username"
          type="text"
          value={props.username}
          onChange={props.handleUsernameChange}
          required
        />
        <input
          placeholder="password"
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </React.Fragment>
  );
}

export default Login;
