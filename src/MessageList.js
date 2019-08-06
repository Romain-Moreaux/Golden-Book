import React from "react";

function MessageList(props) {
  const messages = props.messages;

  const messageList = messages.map(msg => {
    return <li key={msg.id}>{msg.content}</li>;
  });

  return (
    <React.Fragment>
      <button onClick={props.refreshList} type="button">
        Refresh
      </button>
      <ul>{messageList}</ul>
    </React.Fragment>
  );
}

export default MessageList;
