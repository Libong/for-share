interface BoxDataProp {
    establishAt: number,
    produceAt: number, //生产日期
    overdueAt: number, //过期时间
    buyAt: number, //购买日期
    goodsName: string, //物品名称
    goodsTypes: [{
        id: "1",
        name: "面包",
    }], //物品标签
    recordId: "1", //记录编号
}