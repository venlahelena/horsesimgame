import { useMarketHorses } from "../../hooks/useMarketHorses";
import HorseCard from "../../components/shared/HorseCard/HorseCard";
import "./MarketView.css";

const MarketView = () => {
  const { horses, loading, error, buyHorse } = useMarketHorses();

  const handleBuy = (horseId: string) => {
    const buyerId = "688dcb3c64c4f5ee41791990"; // TODO: use actual user ID
    buyHorse(horseId, buyerId);
  };

  if (loading) return <p>Loading market horses…</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <div className="market-grid">
      {horses.map((horse) => (
        <HorseCard
          key={horse._id}
          horse={horse}
          showPrice
          canBuy
          onBuy={() => handleBuy(horse._id)}
        />
      ))}
    </div>
  );
};

export default MarketView;