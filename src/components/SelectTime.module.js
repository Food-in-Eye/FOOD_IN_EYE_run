import ST from "../css/SelectTime.module.css";
import { useState } from "react";

function SelectTime() {
  const [selectedOpenTime, setSelectOpenTime] = useState(0);
  const [selectedCloseTime, setSelectCloseTime] = useState(0);

  const onSelectOpenTime = (selectedOptions) => {
    setSelectOpenTime(selectedOptions);
  };

  const onSelectCloseTime = (selectedOptions) => {
    setSelectCloseTime(selectedOptions);
  };

  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const time = `${formattedHour}:${formattedMinute}`;
      timeOptions.push({ value: time, label: time });
    }
  }

  return (
    <div className={ST.mainDiv}>
      <label htmlFor="open-time-select">
        <select
          id="open-time-select"
          value={selectedOpenTime}
          onChange={onSelectOpenTime}
        >
          <option value="">시간을 선택하세요</option>
          {timeOptions.map((timeOption, index) => (
            <option key={index} value={timeOption.value}>
              {timeOption.label}
            </option>
          ))}
        </select>
      </label>

      <span>-</span>

      <label htmlFor="close-time-select">
        <select
          id="close-time-select"
          value={selectedCloseTime}
          onChange={onSelectCloseTime}
        >
          <option value="">시간을 선택하세요</option>
          {timeOptions.map((timeOption, index) => (
            <option key={index} value={timeOption.value}>
              {timeOption.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SelectTime;
