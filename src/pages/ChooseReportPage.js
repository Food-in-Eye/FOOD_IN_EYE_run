import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import CR from "../css/ChooseReport.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { getDailyReport } from "../components/API.module";
import useTokenRefresh from "../components/useTokenRefresh";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function ChooseReportPage() {
  useTokenRefresh();
  const navigate = useNavigate();
  const location = useLocation();

  const sID = localStorage.getItem("s_id");
  const selectedDateFromMain = location?.state?.date || "";
  console.log(selectedDateFromMain);
  const [selectedDate, setSelectedDate] = useState(selectedDateFromMain || "");
  // const [formatDate, setFormatDate] = useState("");
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

      return `${year}-${month}-${day}`;
    }
  };

  const handlePickTotalReport = () => {
    navigate("/total-report", { state: { reportDate, s3Key } });
  };

  const handlePickMenuReport = () => {
    navigate("/select-menu", { state: { reportDate, s3Key } });
  };

  const handleDateChange = async (date) => {
    hasReport === false && setHasReport(true);
    setSelectedDate(date);
    changeFormatDate(date);
  };

  const getReports = () => {
    try {
      const formattedDate = changeFormatDate(selectedDate);
      const resPromise = getDailyReport(`s_id=${sID}&date=${formattedDate}`);
      resPromise.then((res) => {
        setReportDate(res.data.date);
        setS3Key(res.data.daily_report);
      });
    } catch (error) {
      if (error.response.status === 400) {
        if (
          error.response.data.detail === "Report Not found about input date"
        ) {
          setHasReport(false);
          setSelectedDate("");

          toast.success(
            "선택한 날짜에 리포트가 없습니다. 이날은 가게를 열지 않았나봐요!",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );

          // navigate("/choose-report");
        } else if (
          error.response.data.detail === "Report Not found about input id"
        ) {
          setHasReport(false);
          setSelectedDate("");

          toast.success("아직 사장님 가게의 리포트는 만들어지지 않았습니다.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });

          // navigate("/choose-report");
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      console.error(error);
    }
  };

  useEffect(() => {
    selectedDate && getReports();
  }, [selectedDate]);

  console.log("selectedDate", selectedDate);

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
                  // onChange={(date) => setSelectedDate(date)}
                  onChange={handleDateChange}
                />
              </section>
            </div>
            <div className={CR.pickReport}>
              <section
                onClick={handlePickTotalReport}
                className={`${CR.mvToTotalReport} ${
                  !hasReport || !selectedDate ? CR.disabledSection : ""
                }`}
              >
                <div>
                  <span>전체 리포트</span>
                </div>
              </section>
              <section
                onClick={handlePickMenuReport}
                className={`${CR.mvToMenuReport} ${
                  !hasReport || !selectedDate ? CR.disabledSection : ""
                }`}
              >
                <div>
                  <span>메뉴별 리포트</span>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChooseReportPage;
