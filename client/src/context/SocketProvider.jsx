import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { UseAuth } from './Auth'
const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [auth] = UseAuth();
  const id = auth?.user?._id

  useEffect(() => {
    const newSocket = io(`wss://echoapp.vercel.app`, {
      query: { id },
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    })
    setSocket(newSocket)
    return () => newSocket.close()

  }, [id])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
