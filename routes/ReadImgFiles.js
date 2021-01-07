const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
  try {
    let ImgName = "uploads/coverbookimg/" + req.query.img_name;
    console.log(ImgName);
    fs.readFile(ImgName, (err, ImageData) => {
      if (err) {
        res.json({
          result: "Failed",
          message: `Cannot read img.error is : ${err}`,
        });
      }
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(ImageData);
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
