import React, { useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js'; // Import the Pusher library
import { UseAuth } from './Auth';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
  const [channel , setChannel ] = useState();
  const [auth] = UseAuth();
  const id = auth?.user?._id;

  useEffect(() => {
    var pusher = new Pusher('8c00edbe6c29c7691cf8', {
      cluster: 'ap2',
      encrypted: true,
    });

    var newChannel  = pusher.subscribe(`private-${id}`); // Subscribe to the user's private channel
    setChannel(newChannel);

    return () => {
      newChannel.disconnect(); // Disconnect from the Pusher channel when unmounting
    };
  }, [id]);

  return (
    <SocketContext.Provider value={channel}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

