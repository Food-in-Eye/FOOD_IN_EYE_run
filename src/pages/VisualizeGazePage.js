import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import GenerateImgUrl from "../components/GenerateImgUrl.module";
// import ExImgUrl from "../components/ExImgUrl.module";
import heatmap from "heatmap.js";

import { useState, useEffect } from "react";
import { getGaze, getFilteredGaze } from "../components/API.module";

function VisualizeGazePage() {
  const storeNum = parseInt(localStorage.getItem("storeNum"), 10);
  const pages = ["store_list", "store_menu", "menu_detail"];
  const imgWidth = 1080;

  const [pageList, setPageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [divWidths, setDivWidths] = useState([]);
  const [divHeights, setDivHeights] = useState([]);
  const [gazeData, setGazeData] = useState([]);
  const [pageGazeData, setPageGazeData] = useState([]);
  const [pageFixData, setPageFixData] = useState([]);
  const [fixData, setFixData] = useState([]);

  const [filteredGazeData, setFilteredGazeData] = useState([]);
  const [filteredGPData, setFilteredGPData] = useState([]);

  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    /**임시: 디렉토리 내 폴더명 확인용 코드 */
    console.log("storeNum", storeNum);
    const getJsonFiles = async () => {
      try {
        const response = await getGaze(`?prefix=C_0725&extension=.json`);
        console.log(response.data);
        setFileList(response.data);
      } catch (error) {
        console.error("Error getting file names from api: ", error);
      }
    };

    getJsonFiles();
  }, []);

  const handleInputValues = async (event) => {
    event.preventDefault();

    const key = document.getElementById("key").value;
    const winSize = document.getElementById("winSize").value;
    const fixDist = document.getElementById("fixDist").value;

    try {
      await getFilteredGaze(
        `?key=${key}&win_size=${winSize}&fix_dist=${fixDist}`
      ).then((res) => {
        setFixData(res.data);
        console.log("fix_data", res);
      });
    } catch (error) {
      console.error("Error getting data from analysis:", error);
    }

    try {
      await getGaze(`/gaze?key=${key}`).then((res) => setGazeData(res.data));
    } catch (error) {
      console.error("Error fetching data from S3:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!gazeData || gazeData.length === 0) return;

      const filteredGazeData = gazeData.filter(
        (item) => pages.includes(item.page)
        // &&
        // (item.s_num === 0 || item.s_num === storeNum)
      );

      setPageGazeData(filteredGazeData);

      const filteredFixData = fixData.filter(
        (item) => pages.includes(item.page)
        // &&
        // (item.s_num === 0 || item.s_num === storeNum)
      );
      setPageFixData(filteredFixData);

      setPageList(
        pageGazeData.map((data) => ({
          page: data.page,
          s_num: data.s_num,
          f_num: data.f_num,
        }))
      );

      console.log("pageList", pageList);

      const getImgUrls = async () => {
        const imgUrls = await Promise.all(
          pageList.map(async (page) => {
            console.log("s_num, f_num", page.s_num, page.f_num);
            return await GenerateImgUrl(page.s_num, page.f_num);
            // return await ExImgUrl(page.s_num, page.f_num);
          })
        );
        setImgUrls(imgUrls);
      };

      const getImgDimensions = async () => {
        const dimensions = await Promise.all(
          imgUrls.map(async (url) => {
            const img = new Image();
            img.src = url;

            await new Promise((resolve) => {
              img.onload = resolve;
            });

            const imgRatio = img.height / img.width;

            return {
              url: url,
              width: imgWidth,
              height: imgWidth * imgRatio,
            };
          })
        );

        return dimensions;
      };

      getImgUrls();

      const imgDimensions = await getImgDimensions();
      const imgWidths = imgDimensions.map((dim) => dim.width);
      const imgHeights = imgDimensions.map((dim) => dim.height);

      setDivWidths(imgWidths);
      setDivHeights(imgHeights);
    };

    loadData();
  }, [gazeData, fixData]);

  console.log("divWidths", divWidths);
  console.log("divHeights", divHeights);

  /** Calculate filteredGazeData, filteredGPData */
  useEffect(() => {
    const filteredGazeData = pageGazeData.map((data, index) =>
      data.gaze.length > 0
        ? data.gaze.filter(
            (point) =>
              point.x >= 0 &&
              point.x <= divWidths[index] &&
              // point.x <= screenWidth &&
              point.y >= 0 &&
              point.y <= divHeights[index]
          )
        : []
    );

    const filteredGPData = pageFixData.map((data, index) =>
      data.fixations
        .flatMap((data) => data.gp)
        .filter(
          (point) =>
            point.x >= 0 &&
            point.x <= divWidths[index] &&
            // point.x <= screenWidth &&
            point.y >= 0 &&
            point.y <= divHeights[index]
        )
    );

    setFilteredGazeData(filteredGazeData);
    setFilteredGPData(filteredGPData);
  }, [pageGazeData, pageFixData, divWidths, divHeights]);

  return (
    <div>
      <MenuBar />
      <div>
        <section className={VisualizeGaze.head}>
          <h1>화면별 gaze-plot</h1>
          <div className={VisualizeGaze.inputs}>
            <label>
              key: <input id="key" type="text" name="key" required />
            </label>
            <label>
              window-size:{" "}
              <input id="winSize" type="text" name="window-size" required />
            </label>
            <label>
              fixation-distance:{" "}
              <input
                id="fixDist"
                type="text"
                name="fixation-distance"
                required
              />
            </label>
            <button id="submit" onClick={handleInputValues}>
              Submit
            </button>
          </div>
        </section>
        <h3>Raw Gaze | Fixation & Fixation/gp | Raw Gaze & Fixation/gp</h3>
        <div className={VisualizeGaze.screensForCompare}>
          <section className={VisualizeGaze.screensBeforeFilter}>
            {divHeights.map((divHeight, index) => {
              return (
                <div
                  key={index}
                  className={`${VisualizeGaze.gazePlot} ${VisualizeGaze.gazePlotRow}`}
                  style={{
                    width: divWidths[index],
                    height: divHeight,
                    backgroundImage: `url(${imgUrls[index]})`,
                    backgroundSize: "cover",
                    // filter: "blur(5px)",
                  }}
                >
                  <div className={VisualizeGaze.gazeScreenName}>
                    {pageList[index].page}
                  </div>
                  {filteredGazeData[index].map((point, idx) => (
                    <div
                      key={`${idx}`}
                      className={VisualizeGaze.gazePoint}
                      style={{
                        left: `${(point.x / divWidths[index]) * 100}%`,
                        top: `${(point.y / divHeight) * 100}%`,
                      }}
                      title={pageList[index].page}
                    ></div>
                  ))}
                </div>
              );
            })}
          </section>
          <section className={VisualizeGaze.screensAfterFilter}>
            {divHeights.map((divHeight, index) => {
              return (
                <div
                  key={`page_${index}`}
                  className={`${VisualizeGaze.gazePlot} ${VisualizeGaze.gazePlotRow}`}
                  style={{
                    width: divWidths[index],
                    height: divHeight,
                    backgroundImage: `url(${imgUrls[index]})`,
                    backgroundSize: "cover",
                    // filter: "blur(5px)",
                  }}
                >
                  <div className={VisualizeGaze.gazeScreenName}>
                    {pageList[index].page}
                  </div>
                  {filteredGPData[index].map((point, idx) => (
                    <div
                      key={`gaze_point_${idx}`}
                      className={VisualizeGaze.gazePoint}
                      style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        // left: `${(point.x / divWidths[index]) * 100}%`,
                        // top: `${(point.y / divHeight) * 100}%`,
                      }}
                      title={pageList[index].page}
                    ></div>
                  ))}
                  <svg width={divWidths[index]} height={divHeight}>
                    {pageFixData[index].fixations.map(
                      (fixation, fixationIdx) => (
                        <circle
                          key={`fixation_${fixationIdx}`}
                          cx={fixation.cx}
                          cy={fixation.cy}
                          r={fixation.r}
                          className={`${VisualizeGaze.fixCircle} ${VisualizeGaze.gazePoint}`}
                          title={pageList[index].page}
                        />
                      )
                    )}
                  </svg>
                </div>
              );
            })}
          </section>
          <section className={VisualizeGaze.screensOverlapGaze}>
            {divHeights.map((divHeight, index) => {
              return (
                <div
                  key={index}
                  className={`${VisualizeGaze.gazePlot} ${VisualizeGaze.gazePlotRow}`}
                  style={{
                    width: divWidths[0],
                    height: divHeight,
                    backgroundImage: `url(${imgUrls[index]})`,
                    backgroundSize: "cover",
                    // filter: "blur(5px)",
                  }}
                >
                  <div className={VisualizeGaze.gazeScreenName}>
                    {pageList[index].page}
                  </div>
                  {filteredGazeData[index].map((point, idx) => (
                    <div
                      key={`${idx}`}
                      className={VisualizeGaze.overGazePoint}
                      style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        // left: `${(point.x / divWidths[index]) * 100}%`,
                        // top: `${(point.y / divHeight) * 100}%`,
                      }}
                      title={pageList[index].page}
                    ></div>
                  ))}
                  {filteredGPData[index].map((point, idx) => (
                    <div
                      key={`gaze_point_${idx}`}
                      className={VisualizeGaze.overGP}
                      style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        // left: `${(point.x / divWidths[index]) * 100}%`,
                        // top: `${(point.y / divHeight) * 100}%`,
                      }}
                      title={pageList[index].page}
                    ></div>
                  ))}
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}

export default VisualizeGazePage;
