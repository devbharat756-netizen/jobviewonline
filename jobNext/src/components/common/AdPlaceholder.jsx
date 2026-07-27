import { useEffect } from "react";

export default function AdPlaceholder() {
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

  return (
    <div
      id="container-e7129ad472d074ec7e3d6bf0c075fa9e"
      style={{
        width: "100%",
        margin: "20px auto",
      }}
    ></div>
  );
}