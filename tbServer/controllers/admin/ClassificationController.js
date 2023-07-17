const ClassificationService = require("../../services/admin/ClassificationService");
const JWT = require("../../util/JWT");
require("../../util/JWT");

const ClassificationController = {
  getList: async (req, res) => {
    let classificationData;
    let arr;
    await ClassificationService.getDFLList().then(async (res) => {
      classificationData = JSON.parse(JSON.stringify(res));
      for (let key in classificationData) {
        await ClassificationService.getZFLList(
          classificationData[key]["ID"]
        ).then(async (res) => {
          arr = JSON.parse(JSON.stringify(res));
          classificationData[key]["children"] = [];
          for (let i in arr) {
            classificationData[key]["children"].push(arr[i]);
          }
          for (let i in classificationData[key]["children"]) {
            await ClassificationService.getXFLList(
              classificationData[key]["children"][i]["ID"]
            ).then((res) => {
              arr = JSON.parse(JSON.stringify(res));
              classificationData[key]["children"][i]["children"] = [];
              for (let j in arr) {
                classificationData[key]["children"][i]["children"].push(arr[j]);
              }
            });
          }
        });
      }
    });
    res.send({
      code: 200,
      msg: "成功！",
      data: classificationData,
    });
  },
  addClass: async (req, res) => {
    console.log("值为：", req.body);
    await ClassificationService.addClass(req.body).then((resp) => {
      console.log("res:", resp);
      res.send({
        code: 200,
        msg: "添加成功",
        data: resp,
      });
    });
  },
};

module.exports = ClassificationController;
