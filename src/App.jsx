import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/custom/Header.jsx";
import Hero from "./components/custom/Hero.jsx";
import CreateTrip from "./components/routes/plan-a-trip/CreateTrip.jsx";
import Mytrips from "./components/routes/my-trips/[tripId]/Mytrips.jsx";
import { useEffect, useRef, useState } from "react";
import Footer from "./components/custom/Footer.jsx";
import Alltrips from "./components/routes/all-trips/Alltrips.jsx";
import gsap from "gsap";
import ProgressBar from "./components/constants/ProgressBar.jsx";
import { useRefContext } from "./Context/RefContext/RefContext.jsx";
import TripDetailsPage from './components/routes/plan-a-trip/TripDetailsPage';

function App() {
  const location = useLocation();

  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const createTripPageRef = useRef(null);
  const footerRef = useRef(null);
  const { locationInfoRef } = useRefContext();

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "elastic.out(1,1)" } });

    // Header
    timeline.from(headerRef.current, { delay: 0.5, opacity: 0, y: -100 });

    // Footer
    timeline.from(footerRef.current, { opacity: 0, y: 100 });

    return () => {
      timeline.kill();
    };
  }, [location.pathname]);

  return (
    <>
      <ProgressBar />
      <div className="app tracking-tighter min-w-[320px]">
        <Header headerRef={headerRef} />
        <div className="container max-w-[1024px] w-full min-w-[320px] h-auto">
          <Routes>
            <Route path="/" element={<Hero heroRef={heroRef} />} />
            <Route
              path="/plan-a-trip"
              element={<CreateTrip createTripPageRef={createTripPageRef} />}
            />
            <Route
              path="/my-trips/:tripId"
              element={<Mytrips />}
            />
            <Route
              path="/all-trips"
              element={<Alltrips />}
            />
            <Route path="/trip-details" element={<TripDetailsPage />} />
          </Routes>
        </div>
        <Footer footerRef={footerRef} />
      </div>
    </>
  );
}

export default App;
