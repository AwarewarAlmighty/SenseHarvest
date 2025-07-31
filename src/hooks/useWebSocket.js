import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url) {
  const [data, setData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setData(json);
      } catch (err) {
        console.error("Invalid JSON from WebSocket:", err);
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, [url]);

  return data;
}
