import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Rules from "@/pages/Rules";

import { AnimatePresence } from "framer-motion";
import { PageWrapper } from "./PageWrapper";

export function AppRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/rules" element={<PageWrapper><Rules /></PageWrapper>} />
        <Route path="/game" element={<PageWrapper><Game /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
