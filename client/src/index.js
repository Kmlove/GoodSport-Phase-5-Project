import React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./CSS/index.css";
import { SportsNewsProviderWrapper } from "./context/sportsNews";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <SportsNewsProviderWrapper>
            <App />
        </SportsNewsProviderWrapper>
    </BrowserRouter>
);
