import { useState } from "react";
import { useEffect, useRef } from "react";

function App() {
  const [data, setData] = useState("");
  const IntervelRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();

    IntervelRef.current = setInterval(async () => {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:3000/home", {
            method: "GET",
            signal: controller.signal,
          });

          const dataReceived = await response.json();

          setData(JSON.stringify(dataReceived));
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, 1000);

    return () => {
      controller.abort();
      clearInterval(IntervelRef.current);
    };
  }, [data]);

  return (
    <>
      <div>App</div>
      <p>{data}</p>
    </>
  );
}

export default App;
