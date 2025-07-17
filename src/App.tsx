import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Forget from './pages/Forget';
import SelectTrain from './pages/SelectTrain';
import Payment from './pages/Payment';
import ETicket from './pages/ETicket';
import TripDetails from './pages/TripDetails';
import Promotions from './pages/Promotions';
import Account from './pages/Account';
import Notifications from './pages/Notifications';
import Tickets from './pages/Tickets';
import Reward from './pages/Reward';
import PromotionsList from './pages/PromotionsList';
import Referral from './pages/Referral';
import Cards from './pages/Cards';
import Review from './pages/Review';
import AddInternationalCard from './pages/AddInternationalCard';
import AddDomesticCard from './pages/AddDomesticCard';
import AtmDomesticConfirm from './pages/AtmDomesticConfirm';
import Settings from './pages/Settings';
import SupportCenter from './pages/SupportCenter';
import Feedback from './pages/Feedback';
import Main from './pages/Main';
import SearchResults from './pages/SearchResults';
import SelectSeat from './pages/SelectSeat';
import FAQCategory from './pages/FAQCategory';
import PassengerInfo from './pages/PassengerInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/select-train" element={<SelectTrain />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/e-ticket" element={<ETicket />} />
        <Route path="/trip-details" element={<TripDetails />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotions-list" element={<PromotionsList />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/account" element={<Account />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/review" element={<Review />} />
        <Route path="/add-international-card" element={<AddInternationalCard />} />
        <Route path="/add-domestic-card" element={<AddDomesticCard />} />
        <Route path="/atm-domestic-confirm" element={<AtmDomesticConfirm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support-center" element={<SupportCenter />} />
        <Route path="/faq/:id" element={<FAQCategory />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/main" element={<Main />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/select-seat" element={<SelectSeat />} />
        <Route path="/passenger-info" element={<PassengerInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
