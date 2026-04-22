app.post("/addTest", upload.single("image"), async (req, res) => {
  try {

    const newTest = new TestModel({
      className: req.body.className,
      exam: req.body.exam,
      subject: req.body.subject,
      appName: req.body.appName,
      offer: req.body.offer,
      appLink: req.body.appLink,
      imgUrl: req.file ? req.file.filename : "",
      yt: req.body.yt,
      tg: req.body.tg,
      wa: req.body.wa,
      io: req.body.io,
      wb: req.body.wb
    });

    await newTest.save();   // 🔥 MongoDB मध्ये save

    res.json({ message: "Test added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving test" });
  }
});