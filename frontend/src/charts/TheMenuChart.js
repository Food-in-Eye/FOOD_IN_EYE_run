import { getFoods, getMenus, getStore } from "../components/API.module";
import { useCallback, useState, useEffect } from "react";
import MChart from "../css/MenuChart.module.css";
import dailyReport from "../data/daily_report.json";

function TheMenuChart() {
  const sID = "64a2d45c1fe80e3e4db82af9";
  const [foodCount, setFoodCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemValue, setMenuItemValue] = useState(null);
  const [foodDataArray, setFoodDataArray] = useState([]);

  const aoiData = dailyReport["Store 1"].aoi_summary.total_food_report;
  const saleData = dailyReport["Store 1"].sale_summary.food_detail;

  const handleMenuItemValueChange = (e) => {
    setMenuItemValue(e.target.value);
  };

  const getMenuItems = useCallback(async () => {
    try {
      const resStore = await getStore(sID);
      const mID = resStore.data.m_id;
      const resMenu = await getMenus(`/menu/foods?id=${mID}`);
      const resFood = await getFoods(sID);

      if (resMenu && resMenu.data && resMenu.data.f_list) {
        setMenuItems(resMenu.data.f_list);
      } else {
        setMenuItems([]);
      }

      setFoodCount(resFood.data.food_list.length);
    } catch (error) {
      console.error(`menu-items GET error: ${error}`);
    }
  }, [sID, setMenuItems]);

  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    const dataArray = [];

    for (const foodName in aoiData) {
      if (
        aoiData.hasOwnProperty(foodName) &&
        foodName !== "ETC" &&
        foodName !== "STORE INFO"
      ) {
        const foodData = aoiData[foodName];
        const inDetail = foodData.in_detail || {};
        const visitCount = foodData.visit_count + (inDetail.visit || 0);
        const dwellTime = (foodData.duration + (inDetail.duration || 0)) / 1000;
        const score = foodData.score;

        let orderCount = 0;
        let saleCount = 0;

        for (const fieldName in saleData) {
          if (fieldName === foodName) {
            orderCount = saleData[fieldName].total_count;
            saleCount = saleData[fieldName].total_sales;

            break;
          }
        }

        dataArray.push({
          visitCount: visitCount,
          dwellTime: dwellTime.toFixed(1),
          score: score,
          totalSales: saleCount,
          totalCount: orderCount,
        });
      }
    }
    console.log("dataArray", dataArray);
    setFoodDataArray(dataArray);
  }, [aoiData, saleData, menuItems]);

  const totalCells = foodCount > 0 ? foodCount : 9;

  const generateMenu = () => {
    const menu = [];

    for (let i = 0; i < totalCells; i += 3) {
      const startIndex = i;
      const group = menuItems.slice(startIndex, startIndex + 3);

      menu.push(
        <tr key={startIndex}>
          {group.map((menuItem, columnIndex) => (
            <td key={columnIndex} className={MChart.menuItem}>
              <div className={MChart.menuItemDetails}>
                <div className={MChart.menuItemName}>{menuItem.name}</div>
                {/**라디오버튼을 체크한 값 정중앙에 표시 */}
                <div className={MChart.menuItemValue}>
                  {menuItemValue &&
                    `${
                      foodDataArray[startIndex + columnIndex][menuItemValue]
                    } ${getUnit(menuItemValue)}`}
                </div>
              </div>
            </td>
          ))}
          {group.length < 3 &&
            Array.from({ length: 3 - group.length }).map((_, columnIndex) => (
              <td
                key={group.length + columnIndex}
                className={MChart.menuItem}
              ></td>
            ))}
        </tr>
      );
    }
    return menu;
  };

  const getUnit = (value) => {
    switch (value) {
      case "visitCount":
        return "건";
      case "totalCount":
        return "개";
      case "totalSales":
        return "원";
      case "dwellTime":
        return "초";
      case "score":
        return "점";
      default:
        return "";
    }
  };

  const menu = generateMenu();

  console.log("foodDataArray", foodDataArray);

  return (
    <div className={MChart.total}>
      <div className={MChart.radioButtons}>
        <label>
          <input
            type="radio"
            value="visitCount"
            checked={menuItemValue === "visitCount"}
            onChange={handleMenuItemValueChange}
          />
          방문 수
        </label>
        <label>
          <input
            type="radio"
            value="totalCount"
            checked={menuItemValue === "totalCount"}
            onChange={handleMenuItemValueChange}
          />
          판매량
        </label>
        <label>
          <input
            type="radio"
            value="totalSales"
            checked={menuItemValue === "totalSales"}
            onChange={handleMenuItemValueChange}
          />
          판매금액
        </label>
        <label>
          <input
            type="radio"
            value="dwellTime"
            checked={menuItemValue === "dwellTime"}
            onChange={handleMenuItemValueChange}
          />
          체류시간
        </label>
        <label>
          <input
            type="radio"
            value="score"
            checked={menuItemValue === "score"}
            onChange={handleMenuItemValueChange}
          />
          집중도
        </label>
      </div>
      <table className={MChart.menuTable}>
        <tbody>{menu}</tbody>
      </table>
    </div>
  );
}

export default TheMenuChart;
