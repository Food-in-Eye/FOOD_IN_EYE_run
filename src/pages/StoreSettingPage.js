import { useState } from "react";
import MenuBar from "../components/MenuBar";
import Button from "../css/Button.module.css";
import StoreSet from "../css/StoreSetting.module.css";
import SelectTime from "../components/SelectTime.module";

function StoreSettingPage() {
  return (
    <div>
      <MenuBar />
      <div className={StoreSet.background}>
        <div className={StoreSet.body}>
          <section className={StoreSet.desc}>
            <h1>Store Settings</h1>
            <span>필요한 가게의 정보들을 입력하세요</span>
          </section>
          <section className={StoreSet.RegisterForm}>
            <form>
              <section className={StoreSet.storeNameSection}>
                <label htmlFor="store_name">
                  <span>가게 이름</span>
                  <input
                    id="store_name"
                    type="text"
                    name="store_name"
                    placeholder="Ex)한눈에 학식"
                  />
                </label>
                <button
                  className={Button.nameDuplicateCheck}
                  // onClick={handleNameDuplicate}
                >
                  이름 중복 확인
                </button>
              </section>
              <div className={StoreSet.selectTimeDiv}>
                <span>운영 시간</span>
                <SelectTime />
              </div>
              <label htmlFor="store_intro">
                <span>가게 한 줄 소개</span>
                <textarea
                  id="store_intro"
                  type="text"
                  name="store_intro"
                  cols="30"
                  rows="2"
                  placeholder="가게 한 줄 소개를 작성해보세요!"
                />
              </label>
              <label htmlFor="store_notice">
                <span>가게 공지사항</span>
                <textarea
                  id="store_notice"
                  type="text"
                  name="store_notice"
                  cols="30"
                  rows="2"
                  placeholder="가게의 공지사항을 적어주세요!"
                />
              </label>
            </form>
          </section>
          <button className={Button.registerStore}>등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default StoreSettingPage;
