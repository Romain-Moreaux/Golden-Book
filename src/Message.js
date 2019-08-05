import React from "react";

function Message(props) {
  console.log(props);

  return (
    <form onSubmit={props.handleSubmit}>
      <input
        placeholder="message"
        type="text"
        value={props.message}
        onChange={props.handleMessageChange}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default Message;
