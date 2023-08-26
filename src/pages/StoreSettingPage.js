import MenuBar from "../components/MenuBar";
import StoreSet from "../css/StoreSetting.module.css";

function StoreSettingPage() {
  return (
    <div>
      <MenuBar />
      <div className={StoreSet.body}>
        <section className={StoreSet.desc}>
          <h1>Store Settings</h1>
          <p>필요한 가게의 정보들을 입력하세요</p>
        </section>
        <section className={StoreSet.RegisterForm}>
          <form>
            <label htmlFor="store_name">
              <span>가게 이름</span>
              <input
                id="store_name"
                type="text"
                name="store_name"
                placeholder="Ex)한눈에 학식"
              />
            </label>
            <label>{/* 운영 시간 -> 체크박스 + 드롭다운 리스트 */}</label>
            <label htmlFor="store_intro">
              <span>가게 한줄 소개</span>
              <input
                id="store_intro"
                type="text"
                name="store_intro"
                placeholder="가게 한줄 소개를 작성해보세요!"
              />
            </label>
            <label htmlFor="store_notice">
              <span>가게 공지사항</span>
              <input
                id="store_notice"
                type="text"
                name="store_notice"
                placeholder="가게의 공지사항을 적어주세요!"
              />
            </label>
          </form>
        </section>
      </div>
    </div>
  );
}

export default StoreSettingPage;
