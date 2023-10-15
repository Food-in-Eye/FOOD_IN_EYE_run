import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import CR from "../css/ChooseReport.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { getDailyReport } from "../components/API.module";
import useTokenRefresh from "../components/useTokenRefresh";
import { Link } from "react-router-dom";

function ChooseReportPage() {
  useTokenRefresh();

  const sID = localStorage.getItem("s_id");
  const [selectedDate, setSelectedDate] = useState("");
  const [formatDate, setFormatDate] = useState("");
  const [hasReport, setHasReport] = useState(true);
  const [reportDate, setReportDate] = useState("");
  const [s3Key, setS3Key] = useState("");

  const getDayClassName = (date) => {
    const isTodayOrEarlier = date <= new Date();
    const isSelectedDate =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    if (!isTodayOrEarlier) {
      return CR.grayedOutDay;
    }

    if (isSelectedDate) {
      return CR.selectedDay;
    }

    return CR.unselectedDay;
  };

  const changeFormatDate = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      setFormatDate(`${year}-${month}-${day}`);
    }
  };

  const getReports = () => {
    try {
      const resPromise = getDailyReport(`s_id=${sID}&date=${formatDate}`);
      resPromise.then((res) => {
        console.log(res);
        setReportDate(res.data.date);
        setS3Key(res.data.daily_report);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    changeFormatDate(selectedDate);
    formatDate && getReports();
  }, [selectedDate, formatDate]);

  console.log("selectedDate", selectedDate);
  console.log("formattedDate", formatDate);

  return (
    <div>
      <MenuBar />
      <div className={CR.background}>
        <div className={CR.body}>
          <section className={CR.pageDesc}>
            <h1>데일리 리포트 선택</h1>
            <span>
              원하는 날짜의 리포트를 선택해서 볼 수 있어요! <br />
              날짜를 선택하면 전체 리포트와 메뉴별 리포트 중 원하는 리포트를
              골라보세요.
            </span>
          </section>
          <section className={CR.pickSection}>
            <div className={CR.pickDate}>
              <section className={CR.setDate}>
                <span>리포트를 확인할 날짜를 선택하세요: </span>
                <DatePicker
                  className={CR.datePicker}
                  dateFormat="yyyy.MM.dd"
                  shouldCloseOnSelect
                  maxDate={new Date()}
                  dayClassName={(d) => getDayClassName(d)}
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </section>
            </div>
            <div className={CR.pickReport}>
              <Link
                to={{
                  pathname: "/total-report",
                  state: { reportDate, s3Key },
                }}
                className={`${CR.mvToTotalReport} ${
                  !hasReport || !selectedDate ? CR.disabledSection : ""
                }`}
              >
                <div>
                  <span>전체 리포트</span>
                </div>
              </Link>
              <Link
                to={{
                  pathname: "/menu-report",
                  state: { reportDate, s3Key },
                }}
                className={`${CR.mvToMenuReport} ${
                  !hasReport || !selectedDate ? CR.disabledSection : ""
                }`}
              >
                <div>
                  <span>메뉴별 리포트</span>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChooseReportPage;
