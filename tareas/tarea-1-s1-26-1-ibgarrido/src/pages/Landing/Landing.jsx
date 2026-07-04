import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import Navbar from "../../components/Navbar/Navbar";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing__aurora" aria-hidden="true" />
      <Navbar userProfile={null} />

      <main className="landing__hero">
        <p className="landing__eyebrow">Edicion 2026</p>
        <h1 className="landing__title">DCCPalooza</h1>
        <h2 className="landing__title2">Lolla Sound Market</h2>
        <p className="landing__subtitle">
          En 2027 tu eres quien gestiona la contratación de artistas para el Lolla Sound Market, el evento de música más grande del mundo.
        </p>

        <div className="landing__genres" aria-label="Generos destacados">
          <span>Indie</span>
          <span>Alternative Rock</span>
          <span>Electro</span>
          <span>Pop</span>
          <span>Hip-Hop</span>
          <span>Jazz</span>
          <span>Folk</span>
          <span>Metal</span>
          <span>Reggae</span>
        </div>
      </main>
    </div>
  );
}
