import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import CalculateFixationHeight from "../components/CalculateScreensHeight.module";
import fixData from "../data/fixation data.json";
import heatmap from "heatmap.js";

import { useRef, useState, useEffect } from "react";

function VisualizeFixPage() {
  const [divHeights, setDivHeights] = useState([]);
  const pages = ["store_list", "store_menu", "menu_detail"];

  useEffect(() => {
    const heights = pages.map((page) => {
      const filteredData = fixData.filter((item) => item.page === page);
      return filteredData.length > 0
        ? CalculateFixationHeight(filteredData)
        : 0;
    });

    setDivHeights(heights);
  }, []);

  return (
    <div>
      <MenuBar />
      <div>
        <h1>화면별 fixations</h1>
        <section className={VisualizeGaze.screens}>
          {divHeights.map((divHeight, index) => {
            const filteredFixData = fixData.filter(
              (item) => item.page === pages[index]
            );

            return (
              <div
                key={index}
                className={`${VisualizeGaze.gazePlot} ${VisualizeGaze.gazePlotRow}`}
                style={{ height: divHeight }}
              >
                <div className={VisualizeGaze.gazeScreenName}>
                  {pages[index]}
                </div>
                <svg width="643.2" height={divHeight}>
                  {filteredFixData.flatMap((item) =>
                    item.fixations.flatMap((fixation, fixationIdx) => (
                      <circle
                        key={`${fixationIdx}`}
                        cx={fixation.cx}
                        cy={fixation.cy}
                        r={fixation.r}
                        className={`${VisualizeGaze.fixCircle} ${VisualizeGaze.gazePoint}`}
                        title={pages[index]}
                      />
                    ))
                  )}
                </svg>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default VisualizeFixPage;
