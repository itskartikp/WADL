const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Student = require("./models");
const dbConfig = require("./config");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(dbConfig.url, {useNewUrlParser: true,})
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(() => {
    console.log("Could not connect to database", err);
    process.exit();
  });


app.get("/", (req, res) => {
  res.render("index");
});


app.post("/addmarks", (req, res) => {
  var myData = new Student(req.body);
  myData.save()
    .then((item) => {
      console.log("item saved to database");
      res.redirect("/getMarks");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});


app.get("/getMarks", (req, res) => {
  console.log(req.query);
  Student.find(req.query)
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});

app.get("/count", (req,res) => {
  Student.countDocuments()
  .then((count) => {
    res.send(`Total count is ${count}`);
  })
  .catch((err) => {
    console.log("failed");
  })
})


app.get("/dsbdaGreaterThan20", (req, res) => {
  Student.find({ dsbda_marks: { $gt: 20 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});


app.get("/wadccGreaterThan40", (req, res) => {
  Student.find({ wad_marks: { $gt: 40 }, cc_marks: { $gt: 40 } })
    .then((student) => {
      res.render("table", { student: student });
    })
    .catch((err) => {
      res.json({ message: "err" });
    });
});


app.post("/deleteStudent/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id).then((student) => {
    console.log("Deleted Successfully");
    res.redirect("/getMarks");
  });
});


app.post("/updateMarks/:id", (req, res) => {
  const id = req.params.id;
  const updatedMarks = { $inc: { dsbda_marks: 10, wad_marks: 10, cc_marks: 10 } };
  
  Student.findByIdAndUpdate(id, updatedMarks, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).send("Student not found");
      }
      
      console.log("Marks updated successfully");
      res.redirect("/getMarks");
    })
    .catch((err) => {
      console.error("Error updating marks:", err);
      res.status(500).send("Internal server error");
    });
});



app.listen(3010, () => {
  console.log("Server is listening on port 3000");
});
