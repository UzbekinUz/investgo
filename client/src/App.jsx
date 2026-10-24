import { useState } from 'react';
import Hero from './sections/Hero.jsx';
import StockChart from './sections/StockChart.jsx';
import Partner from './sections/Partner.jsx';
import Calculator from './sections/Calculator.jsx';
import Market from './sections/Market.jsx';
import Ask from './sections/Ask.jsx';
import { Tiers, Curriculum } from './sections/Plans.jsx';
import Trust from './sections/Trust.jsx';
import Join from './sections/Join.jsx';

export default function App() {
  const [plan, setPlan] = useState('free');
  return (
    <main>
      <Hero />
      <StockChart />
      <Partner />
      <Calculator />
      <Market />
      <Ask />
      <Tiers onPick={setPlan} />
      <Curriculum />
      <Trust />
      <Join plan={plan} setPlan={setPlan} />
    </main>
  );
}
