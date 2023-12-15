import React, { useEffect, useState } from "react";

const SportsNewsContext = React.createContext();

function SportsNewsProvider({ children, value }) {
  return (
    <SportsNewsContext.Provider value={value}>
      {children}
    </SportsNewsContext.Provider>
  );
};

function SportsNewsProviderWrapper ({children}) {
  const [sportsNewsArticles, setSportsNewsArticles] = useState([]);

  useEffect(() => {
    fetch(
      `https://newsdata.io/api/1/news?apikey=${process.env.REACT_APP_NEWS_API_KEY_2}&q=sports&country=us&language=en&category=sports`
    )
      .then((res) => res.json())
      .then((data) => setSportsNewsArticles(data.results));
  }, []);

  const randomIndex = Math.floor(Math.random() * sportsNewsArticles.length);
  const randomNewsArticle = sportsNewsArticles[randomIndex];

  return (
    <SportsNewsProvider value={randomNewsArticle}>
      {children}
    </SportsNewsProvider>
  );
};

export { SportsNewsContext, SportsNewsProviderWrapper };
