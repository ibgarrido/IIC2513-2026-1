import React from "react";
import "./ArtistCard.css";

export default function ArtistCard({ artist, onOpenModal }) {
  return (
    <div className="market__card">
      <img src={artist.image_url} alt={artist.name} className="market__cardImage" />
      <h3 className="market__cardTitle">{artist.name}</h3>
      <p className="market__priceTag">{artist.price.toLocaleString("es-CL")} DCCoins</p>
      <button className="market__cardButton" onClick={() => onOpenModal(artist)}>
        Examinar
      </button>
    </div>
  );
}
