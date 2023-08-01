class BasicData {
  enumPlatForm = {
    1: "复星商城",
    2: "京东",
    3: "宝宝树",
    4: "天猫",
    5: "快手",
    6: "抖音",
    7: "网易严选",
    8: "口碑",
    9: "星选",
    10: '线下B2B',
    11: '外部互联网医院'
  }
  getPlatForm(cb) {
    return this.enumPlatForm;
  }
}

export default new BasicData;