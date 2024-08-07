import { isNullOrUndefined } from "@word-impostor/common/utils";
import { useState } from "react";

function App() {
  const [counter, setCounter] = useState(0);

  const handleButtonClick = () => {
    if (isNullOrUndefined(7)) {
      return;
    }

    setCounter(x => x + 1);
  };

  return (
    <>
      <h1 className='underline font-tabular'>Hello world {counter}</h1>
      <button onClick={handleButtonClick}>Counter ++</button>
      <p>Env: {import.meta.env.VITE_WEBAPP_COMMON_ENV}</p>
    </>
  );
}

export default App;
