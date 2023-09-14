function ExImgUrl(s_num, f_num) {
  const s3Url = `https://foodineye2.s3.ap-northeast-2.amazonaws.com/screen_image/`;
  let imgKey = "";

  const storeFoodKeys = {
    store0: ["c197b4ac-b426-4e74-97fc-7159c4f5a4cd.jpg"],
    store1: [
      "d8ba1b90-e0fa-49f8-962e-5f1c9e8f4a62.jpg",
      "c0534680-6358-4681-82b9-cb4f2b6521cc.jpg",
    ],
    store2: [
      "d8ba1b90-e0fa-49f8-962e-5f1c9e8f4a62.jpg",
      "c0534680-6358-4681-82b9-cb4f2b6521cc.jpg",
    ],
    store3: [
      "d8ba1b90-e0fa-49f8-962e-5f1c9e8f4a62.jpg",
      "c0534680-6358-4681-82b9-cb4f2b6521cc.jpg",
    ],
    store4: [
      "d8ba1b90-e0fa-49f8-962e-5f1c9e8f4a62.jpg",
      "c0534680-6358-4681-82b9-cb4f2b6521cc.jpg",
    ],
    store5: [
      "d8ba1b90-e0fa-49f8-962e-5f1c9e8f4a62.jpg",
      "c0534680-6358-4681-82b9-cb4f2b6521cc.jpg",
    ],
  };

  if (s_num === 0) {
    imgKey = storeFoodKeys.store0[0];
  } else if (s_num === 1) {
    /** 하울 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store1[0];
    }
    for (let i = 1; i <= 8; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store1[1];
      }
    }
  } else if (s_num === 2) {
    /** 파스타 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store2[0];
    }
    for (let i = 1; i <= 9; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store2[1];
      }
    }
  } else if (s_num === 3) {
    /** 비빔밥 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store3[0];
    }
    for (let i = 1; i <= 7; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store3[1];
      }
    }
  } else if (s_num === 4) {
    /** 해장국 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store4[0];
    }
    for (let i = 1; i <= 10; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store4[1];
      }
    }
  } else if (s_num === 5) {
    /** 니나노 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store5[0];
    }
    for (let i = 1; i <= 5; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store5[1];
      }
    }
  }

  return `${s3Url}${imgKey}`;
}

export default ExImgUrl;
