import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import fixData from "../data/fixation data.json";
import heatmap from "heatmap.js";

import { useRef, useState, useEffect } from "react";

function VisualizeFixPage() {
  const canvasRef = useRef(null);
  const canvasWidth = 285;
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    // heatmap.js 설정 및 초기화
    const heatmapInstance = heatmap.create({
      container: canvasRef.current,
    });

    const gazePoints = fixData[0].fixations.map((fixation) => fixation.gp);
    const fixations = fixData[0].fixations;

    console.log(gazePoints);

    const heatmapData = processHeatmapData(fixations);
    heatmapInstance.setData(heatmapData);

    // 히트맵 렌더링하고 캔버스에 표시
    heatmapInstance.repaint();
    // 캔버스 높이 계산
    calculateCanvasHeight(gazePoints);

    console.log(canvasRef.current);
  }, []);

  //캔버스 높이 계산
  const calculateCanvasHeight = (rawData) => {
    console.log("height: ", rawData);
    const minY = Math.min(...rawData.map((point) => point.y));
    console.log("minY: ", minY);
    const maxY = Math.max(...rawData.map((point) => point.y));
    console.log("maxY: ", maxY);
    const distance = maxY - minY;
    const padding = distance * 0.2; // 20% 여백 추가
    const calculatedHeight = distance + padding;

    setCanvasHeight(calculatedHeight);
  };

  const processHeatmapData = (rawData) => {
    console.log(rawData);
    console.log(rawData[0]);

    const heatmapData = {
      max: 100,
      data: [],
    };

    for (let i = 0; i < rawData.length - 1; i++) {
      const { cx, cy, st, et, r } = rawData[i];
      //   const nextT = rawData[i + 1].t;
      //   const value = nextT - t; // timestamp의 간격
      const adjustedX = (cx / canvasWidth) * 1000;
      const adjustedY = (cy / canvasHeight) * 1000;
      const value = r ** 2;

      heatmapData.data.push({
        x: adjustedX,
        y: adjustedY,
        value,
      });
    }

    console.log(heatmapData);
    return heatmapData;
  };

  return (
    <div>
      <MenuBar />
      <div>
        <h3>store_list heatmap</h3>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      </div>
    </div>
  );
}

export default VisualizeFixPage;
