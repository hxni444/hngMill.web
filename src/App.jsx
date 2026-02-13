import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Order from './pages/Order';
import About from './pages/About';
import CookingGuide from './pages/CookingGuide';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="order" element={<Order />} />
          <Route path="about" element={<About />} />
          <Route path="about" element={<About />} />
          <Route path="cooking-guide/rice-powder" element={<CookingGuide />} />
          {/* <Route path="estimate" element={<Estimate />} /> */}
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
