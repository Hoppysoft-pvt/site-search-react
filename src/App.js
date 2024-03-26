import React from 'react';
import SearchBar from './lib';

function App() {
  return (
    <SearchBar
      indexId={"tpjaoe"}
      apiKey={"hs_rfj8ed3295i33lj1"}
      onTypeSearch={true}
      targetURL={"url"}
      primaryText={"title"}
      secondaryText={"text"}
    />
  );
}

export default App;
