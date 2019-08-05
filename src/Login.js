import React from "react";

function Login(props) {
  return (
    <React.Fragment>
      <a href="/">&lt;-- Go back</a>
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
