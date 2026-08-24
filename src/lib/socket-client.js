"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[socket] connected", socket.id);
      setConnected(true);
    });
    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected:", reason);
      setConnected(false);
    });
    socket.on("connect_error", (err) => {
      console.log("[socket] connect_error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socketRef, connected };
}
