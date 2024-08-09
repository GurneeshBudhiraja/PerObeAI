import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const { id } = useParams();
  useEffect(() => {
    console.log(id);
  }, [id]);
  
  return <div>Chat</div>;
}

export default Chat;
