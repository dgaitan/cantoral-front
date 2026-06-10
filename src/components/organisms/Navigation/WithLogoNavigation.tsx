"use client";

import { useEffect } from "react";
import { useSiteStore } from "@/store/siteStore";

export function WithLogoNavigation({ withLogo = true, withColorLogo = 'normal' }: { withLogo: boolean, withColorLogo: string }) {
    const { setShowLogo, setLogoStyle } = useSiteStore();

    useEffect(() => {
        setShowLogo(withLogo);
        setLogoStyle(withColorLogo ? "white" : "normal");
    }, [withLogo, withColorLogo, setShowLogo, setLogoStyle]);

    return null;
}