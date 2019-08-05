import React from "react";

function MessageList(props) {
  console.log(props);

  const messages = props.messages;

  const messageList = messages.map(msg => {
    return <li key={msg.id}>{msg.content}</li>;
  });

  return <ul>{messageList}</ul>;
}

export default MessageList;
