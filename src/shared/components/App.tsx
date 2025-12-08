import MainContainer from "@client/pages/MainContainer";
import React, { useEffect, useState } from "react";

const App = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return <>{mounted && <MainContainer />}</>;
};

export default App;
