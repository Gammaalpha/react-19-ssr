import MainContainer from "@client/components/MainContainer";
import React, { useEffect, useState } from "react";

const App = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <MainContainer />;
};

export default App;
