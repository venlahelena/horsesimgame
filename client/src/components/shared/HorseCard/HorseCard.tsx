import React from "react";
import "./HorseCard.css";

interface HorseCardProps {
  horse: any;
  showPrice?: boolean;
  canBuy?: boolean;
  canSell?: boolean;
  onBuy?: () => void;
  onSell?: () => void;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const HorseCard: React.FC<HorseCardProps> = ({
  horse,
  showPrice = false,
  canBuy = false,
  canSell = false,
  onBuy,
  onSell,
  children,
  onClick,
  className,
}) => (
  <div className={`horse-card ${className ?? ""}`} onClick={onClick}>
    <div className="horse-name">{horse.name}</div>
    <div className="horse-meta">
      {horse.breed} · {horse.age} y/o · {horse.gender}
    </div>
    <div className="horse-stats">
      <div>Speed: {horse.stats?.speed ?? "?"}</div>
      <div>Stamina: {horse.stats?.stamina ?? "?"}</div>
      <div>Agility: {horse.stats?.agility ?? "?"}</div>
    </div>
    {showPrice && horse.price && (
      <div className="horse-price">${horse.price}</div>
    )}
    {canBuy && <button className="horse-action" onClick={onBuy}>Buy</button>}
    {canSell && <button className="horse-action" onClick={onSell}>Sell</button>}
    {children}
  </div>
);

export default HorseCard;