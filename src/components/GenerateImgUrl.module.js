function GenerateImgUrl(s_num, f_num) {
  const s3Url = `https://foodineye2.s3.ap-northeast-2.amazonaws.com/screen_image/`;
  let imgKey = "";

  const storeFoodKeys = {
    store0: ["bf059d17-fe81-4f4d-a3b0-1ad96efcfcbd.jpg"],
    store1: [
      "bf059d17-fe81-4f4d-a3b0-1ad96efcfcbd.jpg",
      "449d3903-e415-4851-8108-99de57b4564f.jpg",
      "bfaa5b1b-3542-4bd8-8fc0-6b46579284b7.jpg",
      "5a85a96e-0c31-4ca8-8b7d-b12d8d2fbf33.jpg",
      "4abcbf40-b8d0-454c-aebb-0f0d5c281d49.jpg",
      "97790bf9-29ea-4f40-8d69-69cd1224c04f.jpg",
      "cf6dd86b-8204-4780-99f6-828c20a01e05.jpg",
      "9fa2049c-2f4f-4ff2-b71b-1c0eaf5e3bd6.jpg",
    ],
    store2: [
      "0f28fb13-12cf-4370-8204-d6a0ebb72ab1.jpg",
      "a769b5f1-ba26-4855-a5f4-ccceb1628796.jpg",
      "19af8c4b-bf9b-482d-9723-dfc997eca1c8.jpg",
      "fd6aaf47-edfa-4ced-9c5a-c5db2d3a427d.jpg",
      "e24c4952-e68c-4c81-bf3a-671e2f391d55.jpg",
      "3047a5ee-3f13-452a-baa3-ebd03108a294.jpg",
      "720d74ba-b9a6-4b70-933e-b47964ae2c20.jpg",
      "e30ce0bd-f1ee-4cbb-a60f-2dcff9400a26.jpg",
      "fdf82336-6d02-4385-8b14-790a893ef3e2.jpg",
    ],
    store3: [
      "87a1a4b0-30b8-4258-b428-5ffb44c60d05.jpg",
      "72956ecc-9eb0-406b-93b0-8b0f2f01068e.jpg",
      "08aedc15-c118-4302-9e2b-9ad7e9b9c510.jpg",
      "66e64588-9c0f-4b15-9790-c5e55d01c5d5.jpg",
      "5c1bddde-e6e7-4115-af67-9f50e0a2dfa9.jpg",
      "f07e52ef-fa0b-4f85-ac39-4816f12aa79b.jpg",
      "bb6edc1c-810b-4c66-bfd8-158b85406f85.jpg",
    ],
    store4: [
      "f6a9a48c-2f8a-4922-9fb5-ae1dee364de9.jpg",
      "e4fc61bf-b3ed-4867-8e00-8f6225168df5.jpg",
      "c7955e30-1651-48da-a26f-a973524b23fb.jpg",
      "27afa163-2925-483c-93a8-d1b15a021912.jpg",
      "b82698eb-cce0-4df0-bfe3-7d24c19319f8.jpg",
      "99770614-9272-492e-ad74-119cede8365c.jpg",
      "f09ba7c7-bff0-4915-b8ef-f9027b6bb524.jpg",
    ],
    store5: [
      "bfbfcbb8-8134-4e9a-867e-c73c46b5a372.jpg",
      "b886cc81-d6e7-4c85-9563-2e45f4e389ca.jpg",
      "df7917d4-f921-4d5f-a5fd-85ae2ba3f63f.jpg",
      "a0bbc3c1-354f-4b3d-bd5c-cbb933ae0ac1.jpg",
      "e1805621-482a-4427-aeb8-7c65799a1862.jpg",
    ],
  };

  if (s_num === 0) {
    imgKey = storeFoodKeys.store0[0];
  } else if (s_num === 1) {
    /** 하울 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store1[0];
    }
    for (let i = 1; i <= storeFoodKeys.store1.length; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store1[i];
      }
    }
  } else if (s_num === 2) {
    /** 파스타 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store2[0];
    }
    for (let i = 1; i <= storeFoodKeys.store2.length; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store2[i];
      }
    }
  } else if (s_num === 3) {
    /** 비빔밥 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store3[0];
    }
    for (let i = 1; i <= storeFoodKeys.store3.length; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store3[i];
      }
    }
  } else if (s_num === 4) {
    /** 해장국 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store4[0];
    }
    for (let i = 1; i <= storeFoodKeys.store4.length; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store4[i];
      }
    }
  } else if (s_num === 5) {
    /** 니나노 */
    if (f_num === 0) {
      imgKey = storeFoodKeys.store5[0];
    }
    for (let i = 1; i <= storeFoodKeys.store5.length; i++) {
      if (f_num === i) {
        imgKey = storeFoodKeys.store5[i];
      }
    }
  }

  return `${s3Url}${imgKey}`;
}

export default GenerateImgUrl;
