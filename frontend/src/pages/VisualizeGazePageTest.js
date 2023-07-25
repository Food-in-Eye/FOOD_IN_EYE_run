import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import CalculateHeight from "../components/CalculateScreensHeight.module";
import gazeData from "../data/gaze_data.json";
import fixData from "../data/fixation data.json";
import heatmap from "heatmap.js";

import { useRef, useState, useEffect } from "react";

function VisualizeGazePage() {
  const [divHeights, setDivHeights] = useState([]);
  const [showDataFromGaze, setShowDataFromGaze] = useState(false);
  const [showDataFromFix, setShowDataFromFix] = useState(false);
  const pages = ["store_list", "store_menu", "menu_detail", "cart", "order"];

  useEffect(() => {
    const heights = pages.map((page) => {
      const filteredData = showDataFromFix
        ? fixData.filter((item) => item.page === page)
        : showDataFromGaze
        ? gazeData.filter((item) => item.page === page)
        : [];

      return filteredData.length > 0 && showDataFromGaze
        ? CalculateHeight(filteredData[0].gaze)
        : filteredData.length > 0 && showDataFromFix
        ? CalculateHeight(
            filteredData[0].fixations.flatMap((fixation) => fixation.gp)
          )
        : 0;
    });

    setDivHeights(heights);
  }, [showDataFromGaze, showDataFromFix]);

  const handleGazeDataFromGaze = () => {
    setShowDataFromGaze(true);
    setShowDataFromFix(false);
  };

  const handleGazeDataFromFix = () => {
    setShowDataFromFix(true);
    setShowDataFromGaze(false);
  };

  return (
    <div>
      <MenuBar />
      <div>
        <section className={VisualizeGaze.head}>
          <h1>화면별 gaze-plot</h1>
          <div className={VisualizeGaze.buttons}>
            <button onClick={handleGazeDataFromGaze}>
              show from gaze-data
            </button>
            <button onClick={handleGazeDataFromFix}>
              show from fixation-data
            </button>
          </div>
        </section>

        {showDataFromGaze || showDataFromFix ? (
          <section className={VisualizeGaze.screens}>
            {divHeights.map((divHeight, index) => {
              const filteredData = showDataFromGaze
                ? gazeData
                : showDataFromFix
                ? fixData
                : [];

              const filteredGazeData = filteredData
                .filter((item) => item.page === pages[index])
                .flatMap((item) =>
                  item.gaze
                    ? item.gaze.filter(
                        (point) => point.x >= 0 && point.x <= 643.2
                      )
                    : item.fixations
                        .flatMap((item) => item.gp)
                        .filter((point) => point.x >= 0 && point.x <= 643.2)
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
        ) : (
          <p className={VisualizeGaze.noClickBtn}>버튼을 클릭하세요.</p>
        )}
      </div>
    </div>
  );
}

export default VisualizeGazePage;
