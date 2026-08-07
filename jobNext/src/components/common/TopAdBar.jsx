import { useEffect, useRef } from "react";

export default function TopAdBar() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector("script")) return;

    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src =
        "https://pl30560395.effectivecpmnetwork.com/e7129ad472d074ec7e3d6bf0c075fa9e/invoke.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      container.appendChild(script);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="top-ad-bar"
      style={{
        width: "100%",
        background: "#0a0f1d",
        borderBottom: "1px solid rgba(51,65,85,0.3)",
        boxSizing: "border-box",
        overflow: "hidden",
        paddingTop: "68px",
      }}
    >

      <style>{`
        #container-e7129ad472d074ec7e3d6bf0c075fa9e {
          width: 100% !important;
          max-width: 1280px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e > div,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="wrap"],
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="list"],
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="inner"] {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          justify-content: center !important;
          align-items: stretch !important;
          gap: 14px !important;
          padding: 6px 20px 6px !important;
          overflow-x: auto !important;
          scrollbar-width: none !important;
          background: transparent !important;
        }
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e::-webkit-scrollbar {
          display: none !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e a,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"],
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="card"],
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="teaser"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          flex: 0 0 calc(25% - 11px) !important;
          min-width: 180px !important;
          max-width: 280px !important;
          height: 160px !important;
          text-decoration: none !important;
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          gap: 6px !important;
          justify-content: flex-start !important;
          transition: opacity 0.2s !important;
          box-shadow: none !important;
        }
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e a:hover,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"]:hover {
          opacity: 0.85 !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e img {
          width: 100% !important;
          min-width: unset !important;
          height: 120px !important;
          object-fit: cover !important;
          border-radius: 8px !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
          display: block !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e span,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e p,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e font {
          font-size: 11px !important;
          line-height: 1.35 !important;
          color: #cbd5e1 !important;
          font-weight: 500 !important;
          text-align: center !important;
          margin: 0 !important;
          padding: 0 !important;
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          -webkit-line-clamp: 2 !important;
          overflow: hidden !important;
          background: transparent !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e iframe {
          background: transparent !important;
          border: none !important;
        }

        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e div,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e span,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e p,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e a,
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="item"],
        #top-ad-bar #container-e7129ad472d074ec7e3d6bf0c075fa9e [class*="card"] {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>

      <div
        id="container-e7129ad472d074ec7e3d6bf0c075fa9e"
        ref={containerRef}
        style={{ width: "100%", margin: "0 auto" }}
      />
    </div>
  );
}
