"use client";

import { useEffect } from "react";

export default function AdPlaceholder({ type = "horizontal", label = "Advertisement" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://pl30560395.effectivecpmnetwork.com/e7129ad472d074ec7e3d6bf0c075fa9e/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    const container = document.getElementById(
      "container-e7129ad472d074ec7e3d6bf0c075fa9e"
    );

    if (container && !container.querySelector("script")) {
      container.appendChild(script);
    }
  }, []);

  const getContainerStyles = () => {
    const base = {
      width: "100%",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    if (type === "horizontal") {
      return {
        ...base,
        maxWidth: "970px",
        padding: "10px 0",
      };
    }
    if (type === "vertical") {
      return {
        ...base,
        maxWidth: "300px",
        padding: "10px 0",
      };
    }
    if (type === "square") {
      return {
        ...base,
        maxWidth: "336px",
        padding: "10px 0",
      };
    }
    return base;
  };

  // Hard ceiling per type — regardless of whatever markup the network
  // injects (or fails to replace on a blocked/closed ad), the frame below
  // can never grow past this and spill into surrounding layout.
  const frameMaxHeight = type === "horizontal" ? 190 : type === "vertical" ? 620 : 380;

  return (
    <div className={`ad-wrapper ad-${type}`} style={{ width: "100%" }}>
      {/* Card frame matches the site's own card language (bg-white,
         border-gray-100, rounded-2xl, shadow-sm) with dark: variants for
         the site's dark mode, instead of a hardcoded dark navy box that
         only worked on the dark hero section. */}
      <div className="ad-card">
        <p className="ad-caption">{label}</p>

        <div className="ad-frame" style={{ maxHeight: `${frameMaxHeight}px` }}>
          <style>{`
            .ad-card {
              width: 100%;
              background: #ffffff;
              border: 1px solid #f3f4f6;
              border-radius: 16px;
              padding: 14px;
              box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04);
              box-sizing: border-box;
            }
            .dark .ad-card {
              background: #0f172a;
              border-color: rgba(51, 65, 85, 0.5);
            }

            .ad-caption {
              text-align: center;
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #9ca3af;
              margin: 0 0 10px 0;
            }
            .dark .ad-caption {
              color: #64748b;
            }

            .ad-frame {
              width: 100%;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 10px;
            }

            #container-e7129ad472d074ec7e3d6bf0c075fa9e {
              width: 100% !important;
              margin: 0 auto !important;
              box-sizing: border-box !important;
            }

            /* Catch-all so any unstyled fallback (including a "closed" ad
               state) inherits the surrounding card's colors instead of
               showing a raw white/black box that clashes with the page. */
            #container-e7129ad472d074ec7e3d6bf0c075fa9e,
            #container-e7129ad472d074ec7e3d6bf0c075fa9e div,
            #container-e7129ad472d074ec7e3d6bf0c075fa9e span,
            #container-e7129ad472d074ec7e3d6bf0c075fa9e p {
              background-color: transparent !important;
              color: #374151 !important;
            }
            .dark #container-e7129ad472d074ec7e3d6bf0c075fa9e,
            .dark #container-e7129ad472d074ec7e3d6bf0c075fa9e div,
            .dark #container-e7129ad472d074ec7e3d6bf0c075fa9e span,
            .dark #container-e7129ad472d074ec7e3d6bf0c075fa9e p {
              color: #cbd5e1 !important;
            }

            /* Horizontal Layout: force row flexbox on container AND immediate child wrappers */
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e > div,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="wrapper"],
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="container"] {
              display: flex !important;
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              justify-content: center !important;
              align-items: stretch !important;
              gap: 14px !important;
              width: 100% !important;
              overflow-x: auto !important;
              scrollbar-width: none !important;
            }

            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e::-webkit-scrollbar {
              display: none !important;
            }

            .ad-vertical #container-e7129ad472d074ec7e3d6bf0c075fa9e,
            .ad-square #container-e7129ad472d074ec7e3d6bf0c075fa9e {
              display: flex !important;
              flex-direction: column !important;
              flex-wrap: nowrap !important;
              gap: 14px !important;
            }

            /* Individual cards (anchors, items, cards, iframes) — kept as a
               light card matching the site rather than a dark slate tile */
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e a,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e iframe,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"],
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="card"] {
              display: flex !important;
              flex-direction: column !important;
              flex: 0 0 calc(25% - 11px) !important;
              min-width: 160px !important;
              max-width: 280px !important;
              height: 140px !important;
              text-decoration: none !important;
              background: #f9fafb !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 10px !important;
              padding: 8px !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              justify-content: flex-start !important;
              align-items: center !important;
              transition: transform 0.2s ease, border-color 0.2s ease !important;
            }
            .dark .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e a,
            .dark .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"],
            .dark .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="card"] {
              background: #16213a !important;
              border-color: rgba(51, 65, 85, 0.5) !important;
            }

            #container-e7129ad472d074ec7e3d6bf0c075fa9e iframe {
              background-color: transparent !important;
              border: none !important;
              border-radius: 10px !important;
            }

            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e a:hover,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"]:hover {
              transform: translateY(-2px) !important;
              border-color: #6366f1 !important;
            }

            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e img {
              width: 100% !important;
              height: 84px !important;
              object-fit: cover !important;
              border-radius: 8px !important;
              margin-bottom: 6px !important;
            }

            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e span,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e p,
            .ad-horizontal #container-e7129ad472d074ec7e3d6bf0c075fa9e font {
              font-size: 11px !important;
              line-height: 1.3 !important;
              text-align: center !important;
              margin: 2px 0 !important;
              font-weight: 500 !important;
            }

            .ad-vertical #container-e7129ad472d074ec7e3d6bf0c075fa9e img,
            .ad-square #container-e7129ad472d074ec7e3d6bf0c075fa9e img {
              max-width: 100% !important;
              height: auto !important;
              border-radius: 10px !important;
            }
          `}</style>
          <div
            id="container-e7129ad472d074ec7e3d6bf0c075fa9e"
            style={getContainerStyles()}
          ></div>
        </div>
      </div>
    </div>
  );
}