const express = require("express");
const cors = require("cors");
const upload = require("./multer");
const connectDB = require("./index");
const Class = require("./models/Class");
const TestModel = require("./models/Test");
const BookModel = require("./models/Book");
const Analytics = require("./models/Analytics");
const Offer = require("./models/offer");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ POST
app.post(
  "/addClass",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 }
  ]),
  async (req, res) => {

    try {

      console.log("=================================");
      console.log("📥 ADD CLASS REQUEST");
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);
      console.log("=================================");


      // ===============================
      // FIRST IMAGE
      // ===============================

      const imageUrl =
        req.files &&
        req.files.image &&
        req.files.image.length > 0
          ? req.files.image[0].path
          : "";


      // ===============================
      // SECOND IMAGE - BOOK IMAGE
      // ===============================

      const imageUrl2 =
        req.files &&
        req.files.image2 &&
        req.files.image2.length > 0
          ? req.files.image2[0].path
          : "";


      console.log("🖼️ IMAGE 1:", imageUrl);
      console.log("📚 IMAGE 2:", imageUrl2);


      // ===============================
      // CREATE CLASS
      // ===============================

      const newClass = new Class({

        className: req.body.className,

        // Class main image
        imgUrl: imageUrl,

        // Books / slider second image
        imgUrl2: imageUrl2,

        educator: req.body.educator,

        exam: req.body.exam,

        subject: req.body.subject,

        appName: req.body.appName,

        books: req.body.books,

        offer: req.body.offer,

        appLink: req.body.appLink,

        demoVideo:
          extractYoutubeVideoId(req.body.demoVideo),

        yt: req.body.yt,

        tg: req.body.tg,

        wa: req.body.wa,

        ig: req.body.ig,

        io: req.body.io,

        wb: req.body.wb

      });


      // ===============================
      // SAVE TO MONGODB
      // ===============================

      await newClass.save();


      console.log("=================================");
      console.log("✅ CLASS SAVED SUCCESSFULLY");
      console.log("MongoDB ID:", newClass._id);
      console.log("Image 1:", newClass.imgUrl);
      console.log("Image 2:", newClass.imgUrl2);
      console.log("=================================");


      res.status(200).json({
        success: true,
        message: "Class Saved Successfully",
        data: newClass
      });


    } catch (err) {

      console.log("=================================");
      console.log("❌ ADD CLASS ERROR");
      console.log(err);
      console.log("=================================");


      res.status(500).json({

        success: false,

        message: "Error saving data",

        error: err.message

      });

    }

  }
);

// ✅ GET
app.get("/getClasses", async (req, res) => {
  const data = await Class.find();
  res.json(data);
});
app.get("/getTests", async (req, res) => {
  try {
    const data = await TestModel.find();
    res.json(data);
  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ message: "Error fetching tests" });
  }
});
app.get("/getBooks", async (req, res) => {
  try {
    const data = await BookModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// ======================================================
// ANALYTICS - SAVE CARD VIEW
// ======================================================

app.post("/analytics/view", async (req, res) => {

  try {

    const {
      classId,
      className,
      educator,
      exam,
      subject
    } = req.body;

    const newView = new Analytics({

      classId: classId || undefined,

      className: className || "",

      educator: educator || "",

      exam: exam || "",

      subject: subject || "",

      eventType: "view"

    });

    await newView.save();

    res.status(200).json({
      success: true,
      message: "Card view tracked successfully"
    });

  } catch (err) {

    console.log("❌ CARD VIEW ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Card view tracking failed",
      error: err.message
    });

  }

});

// ✅ DELETE (🔥 IMPORTANT)
app.delete("/deleteClass/:id", async (req, res) => {
  try {
    console.log("DELETE ID:", req.params.id);

    const deleted = await Class.findByIdAndDelete(req.params.id);

    console.log("DELETED:", deleted);

    res.json({ message: "Deleted Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// 🚀 START
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on 5000");
  });
});


app.put("/updateClass/:id", upload.single("image"), async (req, res) => {
  try {

    const updateData = {
      className: req.body.className,
      educator: req.body.educator,
      appName: req.body.appName,
      books: req.body.books,
      offer: req.body.offer,
      appLink: req.body.appLink,
      yt: req.body.yt,
      tg: req.body.tg,
      wa: req.body.wa,
      ig: req.body.ig,
      io: req.body.io,
      wb: req.body.wb

    };

    // 👇 image optional
    if(req.file){
      updateData.imgUrl = req.file.filename;
    }

    await Class.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Updated Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating" });
  }
});


app.put("/updateLink/:id", async (req, res) => {
  const { field, value } = req.body;

  try {
    await ClassModel.findByIdAndUpdate(req.params.id, {
      [field]: value
    });

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


//Test

// ✅ ADD TEST
app.post("/addTest", upload.single("image"), async (req, res) => {
  try {

    const newTest = new TestModel({
      className: req.body.className,
      imgUrl: req.file ? req.file.filename : "",
      exam: req.body.exam,
      subject: req.body.subject,
      appName: req.body.appName,
      offer: req.body.offer,
      call: req.body.call,
      appLink: req.body.appLink,
      yt: req.body.yt,
      tg: req.body.tg,
      wa: req.body.wa,
      ig: req.body.ig,
      io: req.body.io,
      wb: req.body.wb
    });

    await newTest.save();

    res.json({ message: "Test Saved ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving test" });
  }
});


// ✅ DELETE TEST
app.delete("/deleteTest/:id", async (req, res) => {
  await TestModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted ✅" });
});


// ✅ UPDATE TEST
app.put("/updateTest/:id", upload.single("image"), async (req, res) => {

  const updateData = {
    className: req.body.className,
    exam: req.body.exam,
    subject: req.body.subject,
    appName: req.body.appName,
    offer: req.body.offer,
    call: req.body.call,
    appLink: req.body.appLink,
    yt: req.body.yt,
    tg: req.body.tg,
    wa: req.body.wa,
    ig: req.body.ig,
    io: req.body.io,
    wb: req.body.wb
  };

  if(req.file){
    updateData.imgUrl = req.file.filename;
  }

  await TestModel.findByIdAndUpdate(req.params.id, updateData);

  res.json({ message: "Updated ✅" });
});


app.post("/addBook", upload.single("image"), async (req, res) => {
  try {

    const newBook = new BookModel({
      className: req.body.className,
      imgUrl: req.file ? req.file.filename : "",
      educator: req.body.educator,
      bookName: req.body.bookName,
      price: req.body.price,
      rating: req.body.rating,
      bookLink: req.body.bookLink,
    
      // 🔥 NEW
      call: req.body.call,
      yt: req.body.yt,
      tg: req.body.tg,
      wa: req.body.wa,
      ig: req.body.ig,
      io: req.body.io
    });

    await newBook.save();

    res.json({ message: "Book Saved ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving book" });
  }
});

// ======================================================
// ANALYTICS - TOTAL CLICKS
// ======================================================

app.get("/analytics/total", async (req, res) => {

  try {

      const total =
          await Analytics.countDocuments();


      res.json({

          success: true,

          total: total

      });


  } catch (error) {

      console.error(error);

      res.status(500).json({

          success: false,

          message: "Failed to get total clicks"

      });

  }

});


// ======================================================
// ANALYTICS - ALL DATA
// ======================================================

app.get("/analytics", async (req, res) => {

  try {

      const data =
          await Analytics.find()
              .sort({ createdAt: -1 });


      res.json({

          success: true,

          data: data

      });


  } catch (error) {

      console.error(error);

      res.status(500).json({

          success: false,

          message: "Failed to get analytics"

      });

  }

});

// ======================================================
// 👤 ANALYTICS - SAVE UNIQUE VISITOR
// ======================================================

app.post("/analytics/visitor", async (req, res) => {

  try {

    const {
      visitorId
    } = req.body;


    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!visitorId) {

      return res.status(400).json({

        success: false,

        message: "visitorId is required"

      });

    }


    // ==========================================
    // CHECK IF VISITOR ALREADY EXISTS
    // ==========================================

    const existingVisitor =
      await Analytics.findOne({

        visitorId: visitorId,

        eventType: "visitor"

      });


    // ==========================================
    // ALREADY VISITED
    // ==========================================

    if (existingVisitor) {

      return res.status(200).json({

        success: true,

        newVisitor: false,

        message: "Visitor already tracked"

      });

    }


    // ==========================================
    // SAVE NEW VISITOR
    // ==========================================

    const newVisitor =
      new Analytics({

        visitorId:
          visitorId,

        eventType:
          "visitor",

        clickType:
          "visitor"

      });


    await newVisitor.save();


    console.log(
      "👤 NEW VISITOR SAVED:",
      visitorId
    );


    res.status(200).json({

      success: true,

      newVisitor: true,

      message:
        "Visitor tracked successfully"

    });


  } catch (error) {

    console.error(
      "❌ VISITOR TRACKING ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Visitor tracking failed",

      error:
        error.message

    });

  }

});

// ======================================================
// 📊 ANALYTICS - DASHBOARD SUMMARY
// REAL MONGODB DATA
// ======================================================

// ======================================================
// 📊 ANALYTICS - DASHBOARD SUMMARY
// ======================================================

app.get("/analytics/summary", async (req, res) => {

  try {

    // ==================================================
    // 1️⃣ MOST CLICKED CLASSES
    // ==================================================

    const mostClickedClasses =
      await Analytics.aggregate([

        {
          $match: {

            className: {
              $ne: ""
            },

            eventType: "click"

          }
        },

        {
          $group: {

            _id: {

              className: "$className",

              educator: "$educator",

              exam: "$exam",

              subject: "$subject"

            },

            clicks: {
              $sum: 1
            }

          }
        },

        {
          $sort: {
            clicks: -1
          }
        },

        {
          $limit: 50
        }

      ]);


    // ==================================================
    // 2️⃣ CLICKS BY EXAM
    // ==================================================

    const clicksByExam =
      await Analytics.aggregate([

        {
          $match: {

            exam: {
              $ne: ""
            },

            eventType: "click"

          }
        },

        {
          $group: {

            _id: "$exam",

            clicks: {
              $sum: 1
            }

          }
        },

        {
          $sort: {
            clicks: -1
          }
        }

      ]);


    // ==================================================
    // 3️⃣ CLICKS BY SUBJECT
    // ==================================================

    const clicksBySubject =
      await Analytics.aggregate([

        {
          $match: {

            subject: {
              $ne: ""
            },

            eventType: "click"

          }
        },

        {
          $group: {

            _id: "$subject",

            clicks: {
              $sum: 1
            }

          }
        },

        {
          $sort: {
            clicks: -1
          }
        }

      ]);


    // ==================================================
    // 4️⃣ TOTAL CARD VIEWS
    // IMPORTANT:
    // Card View मध्ये eventType = "view"
    // ==================================================

    const totalCardViews =
      await Analytics.countDocuments({

        eventType: "view"

      });


    // ==================================================
    // 5️⃣ TOTAL LINK CLICKS
    // ==================================================

    const totalLinkClicks =
      await Analytics.countDocuments({

        eventType: "click"

      });


    // ==================================================
    // 6️⃣ CTR
    // ==================================================

    const ctr =
      totalCardViews > 0

        ? Number(

            (
              (totalLinkClicks / totalCardViews) * 100
            ).toFixed(2)

          )

        : 0;

    // ==================================================
    // 👤 TOTAL UNIQUE VISITORS
    // ==================================================

    const totalVisitorsResult =
      await Analytics.aggregate([

        {
          $match: {

            eventType: "visitor",

            visitorId: {
              $ne: ""
            }

          }

        },

        {
          $group: {

            _id: "$visitorId"

          }

        },

        {
          $count: "total"

        }

      ]);


    const totalVisitors =
      totalVisitorsResult.length > 0
        ? totalVisitorsResult[0].total
        : 0;

// ==================================================
// 👤 UNIQUE VISITORS - TODAY / WEEK / MONTH
// ==================================================

const now = new Date();


// 🇮🇳 India local date
const indiaDate =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Kolkata"
    }
  ).format(now);


// YYYY-MM-DD
const [year, month, day] =
  indiaDate.split("-").map(Number);


// Today start/end in India
const todayStart =
  new Date(
    `${indiaDate}T00:00:00+05:30`
  );


const todayEnd =
  new Date(
    `${indiaDate}T23:59:59.999+05:30`
  );


// ==================================================
// 👤 TODAY
// ==================================================

const todayVisitors =
  await Analytics.aggregate([

    {
      $match: {

        eventType: "visitor",

        visitorId: {
          $exists: true,
          $ne: ""
        },

        createdAt: {
          $gte: todayStart,
          $lte: todayEnd
        }

      }
    },

    {
      $group: {
        _id: "$visitorId"
      }
    },

    {
      $count: "total"
    }

  ]);


const uniqueVisitorsToday =
  todayVisitors.length
    ? todayVisitors[0].total
    : 0;


// ==================================================
// 📅 THIS MONTH
// ==================================================

const monthStart =
  new Date(
    `${year}-${String(month).padStart(2, "0")}-01T00:00:00+05:30`
  );


const nextMonth =
  month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, "0")}`;


const monthEnd =
  new Date(
    `${nextMonth}-01T00:00:00+05:30`
  );


const monthVisitors =
  await Analytics.aggregate([

    {
      $match: {

        eventType: "visitor",

        visitorId: {
          $exists: true,
          $ne: ""
        },

        createdAt: {
          $gte: monthStart,
          $lt: monthEnd
        }

      }
    },

    {
      $group: {
        _id: "$visitorId"
      }
    },

    {
      $count: "total"
    }

  ]);


const uniqueVisitorsMonth =
  monthVisitors.length
    ? monthVisitors[0].total
    : 0;


// ==================================================
// 📅 THIS WEEK
// Monday → Sunday
// ==================================================

const currentDay =
  new Date(
    `${indiaDate}T12:00:00+05:30`
  );


const dayOfWeek =
  currentDay.getDay();


const mondayOffset =
  dayOfWeek === 0
    ? 6
    : dayOfWeek - 1;


const weekStart =
  new Date(currentDay);

weekStart.setDate(
  currentDay.getDate() - mondayOffset
);

weekStart.setHours(
  0, 0, 0, 0
);


const weekEnd =
  new Date(weekStart);

weekEnd.setDate(
  weekStart.getDate() + 7
);


const weekVisitors =
  await Analytics.aggregate([

    {
      $match: {

        eventType: "visitor",

        visitorId: {
          $exists: true,
          $ne: ""
        },

        createdAt: {
          $gte: weekStart,
          $lt: weekEnd
        }

      }
    },

    {
      $group: {
        _id: "$visitorId"
      }
    },

    {
      $count: "total"
    }

  ]);


const uniqueVisitorsWeek =
  weekVisitors.length
    ? weekVisitors[0].total
    : 0;
        
    // ==================================================
    // 7️⃣ VIEWS VS CLICKS OVER TIME
    // DAILY MONGODB AGGREGATION
    // ==================================================

    const dailyAnalytics =
      await Analytics.aggregate([

        {
          $group: {

            _id: {

              date: {

                $dateToString: {

                  format: "%Y-%m-%d",

                  date: "$createdAt"

                }

              },

              eventType: "$eventType"

            },

            count: {
              $sum: 1
            }

          }

        },

        {
          $sort: {

            "_id.date": 1

          }

        }

      ]);


    // ==================================================
    // 8️⃣ CONVERT DAILY DATA
    //
    // {
    //   date,
    //   views,
    //   clicks
    // }
    // ==================================================

    const dailyMap = {};


    dailyAnalytics.forEach(item => {

      const date =
        item._id.date;


      const eventType =
        item._id.eventType;


      if (!dailyMap[date]) {

        dailyMap[date] = {

          date: date,

          views: 0,

          clicks: 0

        };

      }


      // ==============================================
      // 👁️ CARD VIEWS
      // ==============================================

      if (
        eventType === "view"
      ) {

        dailyMap[date].views +=
          item.count;

      }


      // ==============================================
      // 🖱️ LINK CLICKS
      // ==============================================

      if (
        eventType === "click"
      ) {

        dailyMap[date].clicks +=
          item.count;

      }

    });


    // ==================================================
    // 9️⃣ DAILY ARRAY + SORT
    // ==================================================

    const dailyAnalyticsFormatted =
      Object.values(dailyMap)
        .sort(

          (a, b) =>
            a.date.localeCompare(b.date)

        );


    // ==================================================
    // 🔟 CLASS-WISE VIEWS + CLICKS + CTR
    // ==================================================

    const classAnalytics =
      await Analytics.aggregate([

        // ----------------------------------------------
        // GROUP BY CLASS + EVENT TYPE
        // ----------------------------------------------

        {
          $group: {

            _id: {

              classId: "$classId",

              className: "$className",

              educator: "$educator",

              eventType: "$eventType"

            },

            count: {
              $sum: 1
            }

          }

        },


        // ----------------------------------------------
        // GROUP AGAIN BY CLASS
        // ----------------------------------------------

        {
          $group: {

            _id: {

              classId: "$_id.classId",

              className: "$_id.className",

              educator: "$_id.educator"

            },


            // 👁️ VIEWS
            views: {

              $sum: {

                $cond: [

                  {
                    $eq: [

                      "$_id.eventType",

                      "view"

                    ]

                  },

                  "$count",

                  0

                ]

              }

            },


            // 🖱️ CLICKS
            clicks: {

              $sum: {

                $cond: [

                  {
                    $eq: [

                      "$_id.eventType",

                      "click"

                    ]

                  },

                  "$count",

                  0

                ]

              }

            }

          }

        },


        // ----------------------------------------------
        // 📈 CTR
        // ----------------------------------------------

        {
          $addFields: {

            ctr: {

              $cond: [

                {
                  $gt: [

                    "$views",

                    0

                  ]

                },

                {

                  $round: [

                    {

                      $multiply: [

                        {

                          $divide: [

                            "$clicks",

                            "$views"

                          ]

                        },

                        100

                      ]

                    },

                    2

                  ]

                },

                0

              ]

            }

          }

        },


        // ----------------------------------------------
        // SORT
        // MOST VIEWED FIRST
        // ----------------------------------------------

        {
          $sort: {

            views: -1,

            clicks: -1

          }

        }

      ]);


    // ==================================================
    // 1️⃣1️⃣ TOTAL CLICKS
    // OLD COMPATIBILITY
    // ==================================================

    const totalClicks =
      totalLinkClicks;


    // ==================================================
    // 📤 FINAL RESPONSE
    // ==================================================

    res.json({

      success: true,
    
      totalVisitors,
    
      uniqueVisitorsToday,
    
      uniqueVisitorsWeek,
    
      uniqueVisitorsMonth,
    
      totalClicks,
    
      totalCardViews,
    
      totalLinkClicks,
    
      ctr,
    
      mostClickedClasses,
    
      clicksByExam,
    
      clicksBySubject,
    
      dailyAnalytics:
        dailyAnalyticsFormatted,
    
      classAnalytics
    
    });


  } catch (error) {

    console.error(
      "❌ ANALYTICS SUMMARY ERROR:",
      error
    );


    res.status(500, {

      success: false,

      message:
        "Failed to load analytics summary",

      error:
        error.message

    });

  }

});

// ======================================================
// 🎁 OFFERS - ADD
// ======================================================

app.post("/addOffer", async (req, res) => {

  try {

    const {
      offerTitle,
      festival,
      discount,
      couponCode,
      description,
      validFrom,
      validTill,
      applicableTo,
      products,
      active
    } = req.body;


    if (!offerTitle) {
      return res.status(400).json({
        success: false,
        message: "Offer title is required"
      });
    }


    const newOffer = new Offer({

      offerTitle,
      festival,
      discount,
      couponCode,
      description,

      validFrom,
      validTill,

      applicableTo,

      products: products || [],

      active:
        active === true ||
        active === "true"

    });


    await newOffer.save();


    res.status(200).json({

      success: true,

      message: "Offer saved successfully",

      data: newOffer

    });


  } catch (error) {

    console.error("❌ ADD OFFER ERROR:", error);

    res.status(500).json({

      success: false,

      message: "Error saving offer",

      error: error.message

    });

  }

});

// ======================================================
// 🎁 OFFERS - GET
// ======================================================

app.get("/getOffers", async (req, res) => {

  try {

    const offers = await Offer
      .find()
      .sort({ createdAt: -1 });


    res.json(offers);


  } catch (error) {

    console.error("❌ GET OFFERS ERROR:", error);

    res.status(500).json({

      success: false,

      message: "Error fetching offers",

      error: error.message

    });

  }

});

// ======================================================
// 🎁 OFFERS - UPDATE
// ======================================================

app.put("/updateOffer/:id", async (req, res) => {

  try {

    const updatedOffer =
      await Offer.findByIdAndUpdate(

        req.params.id,

        {
          offerTitle: req.body.offerTitle,
          festival: req.body.festival,
          discount: req.body.discount,
          couponCode: req.body.couponCode,
          description: req.body.description,

          validFrom: req.body.validFrom,
          validTill: req.body.validTill,

          applicableTo: req.body.applicableTo,

          products:
            req.body.products || [],

          active:
            req.body.active === true ||
            req.body.active === "true"
        },

        {
          new: true
        }

      );


    if (!updatedOffer) {

      return res.status(404).json({

        success: false,

        message: "Offer not found"

      });

    }


    res.json({

      success: true,

      message: "Offer updated successfully",

      data: updatedOffer

    });


  } catch (error) {

    console.error("❌ UPDATE OFFER ERROR:", error);

    res.status(500).json({

      success: false,

      message: "Error updating offer",

      error: error.message

    });

  }

});

// ======================================================
// 🎁 OFFERS - DELETE
// ======================================================

app.delete("/deleteOffer/:id", async (req, res) => {

  try {

    await Offer.findByIdAndDelete(req.params.id);


    res.json({

      success: true,

      message: "Offer deleted successfully"

    });


  } catch (error) {

    console.error("❌ DELETE OFFER ERROR:", error);

    res.status(500).json({

      success: false,

      message: "Error deleting offer",

      error: error.message

    });

  }

});