"use client";

import { create } from "zustand";

interface SiteState {
    logoStyle: "normal" | "white";
    showLogo: boolean;
    setLogoStyle: (logoStyle: "normal" | "white") => void;
    setShowLogo: (showLogo: boolean) => void;
}

export const useSiteStore = create<SiteState>((set) => ({
    logoStyle: "normal",
    showLogo: true,
    setLogoStyle: (logoStyle) => set({ logoStyle }),
    setShowLogo: (showLogo) => set({ showLogo }),
}));