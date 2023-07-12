import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import gazeData from "../data/gaze_data.json";
import heatmap from "heatmap.js";

import { useRef, useState, useEffect } from "react";

function VisualizeGazePage() {
  const [divHeights, setDivHeights] = useState([]);
  const pages = ["store_list", "store_menu", "menu_detail", "cart"];

  useEffect(() => {
    const heights = pages.map((page) => {
      const filteredData = gazeData.filter((item) => item.page === page);
      return filteredData.length > 0
        ? calculateHeight(filteredData[0].gaze)
        : 0;
    });

    setDivHeights(heights);
  }, []);

  const calculateHeight = (data) => {
    if (!data || data.length === 0) return 0;

    const minY = Math.min(...data.map((point) => point.y));
    const maxY = Math.max(...data.map((point) => point.y));
    const distance = maxY - minY;
    const padding = distance * 0.2; // 20% 여백 추가
    const calculatedHeight = distance + padding;

    return calculatedHeight;
  };

  return (
    <div>
      <MenuBar />
      <div>
        <h1>화면별 gaze-plot</h1>
        <section className={VisualizeGaze.screens}>
          {divHeights.map((divHeight, index) => {
            const filteredGazeData = gazeData
              .filter((item) => item.page === pages[index])
              .flatMap((item) =>
                item.gaze.filter((point) => point.x >= 0 && point.x <= 643.2)
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
                {filteredGazeData.map((point, idx) => (
                  <div
                    key={`${idx}`}
                    className={VisualizeGaze.gazePoint}
                    style={{
                      left: `${(point.x / 643.2) * 100}%`,
                      top: `${(point.y / divHeight) * 100}%`,
                    }}
                    title={pages[index]}
                  ></div>
                ))}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default VisualizeGazePage;
