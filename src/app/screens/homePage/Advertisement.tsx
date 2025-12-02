import React from "react";

export default function Advertisement() {
  return (
    <div className="ads-frame">
      <div className="ads-copy">
        <p className="ads-kicker">Camera Shop Dev</p>
        <h3 className="ads-title">Admin-run platform, agent-powered catalog.</h3>
        <p className="ads-desc">
          Upload compliant product media, assign agents to brands, and give shoppers
          a trusted path to the right camera, lens, or drone.
        </p>
      </div>
      <div className="ads-visual">
        <img src="/img/camera-deal.svg" alt="Camera deals and catalog visuals" />
      </div>
    </div>
  );
}
