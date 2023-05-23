const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());


MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    const db = client.db('student');
    const studentMarksCollection = db.collection('studentmarks');

    // Create a collection called "studentmarks"ccfai
    db.createCollection('studentmarks')
      .then(() => {
        console.log('Collection "studentmarks" created');
      })
      .catch((err) => {
        console.error('Failed to create collection', err);
      });

    // Insert array of documents
    const students = [
      {
        Name: 'John',
        Roll_No: 1,
        WAD_Marks: 80,
        CC_Marks: 75,
        DSBDA_Marks: 85,
        CNS_Marks: 90,
        AI_Marks: 70,
      },
      {
        Name: 'Tara',
        Roll_No: 2,
        WAD_Marks: 90,
        CC_Marks: 65,
        DSBDA_Marks: 35,
        CNS_Marks: 10,
        AI_Marks: 80,
      }
    ];

    studentMarksCollection.insertMany(students)
      .then((result) => {
        console.log(`${result.insertedCount} student documents inserted`);
      })
      .catch((err) => {
        console.error('Failed to insert student documents', err);
      });

    // Display total count of documents
    app.get('/count', (req, res) => {
      studentMarksCollection.countDocuments()
        .then((count) => {
          res.send(`Total count of documents: ${count}`);
        })
        .catch((err) => {
          console.error('Failed to retrieve count', err);
          res.status(500).send('Failed to retrieve count');
        });
    });

    // List all documents
    app.get('/students', (req, res) => {
      studentMarksCollection.find().toArray()
        .then((students) => {
          res.json(students);
        })
        .catch((err) => {
          console.error('Failed to retrieve student documents', err);
          res.status(500).send('Failed to retrieve student documents');
        });
    });

    // List names of students who got more than 20 marks in DSBDA Subject
    app.get('/students/more-than-20-dsbda', (req, res) => {
      studentMarksCollection.find({ DSBDA_Marks: { $gt: 20 } }, { projection: { Name: 1 } }).toArray()
        .then((students) => {
          const studentNames = students.map((student) => student.Name);
          res.json(studentNames);
        })
        .catch((err) => {
          console.error('Failed to retrieve students with more than 20 marks in DSBDA Subject', err);
          res.status(500).send('Failed to retrieve students with more than 20 marks in DSBDA Subject');
        });
    });

    // Update marks of specified students by 10
    app.put('/students/update-marks', (req, res) => {
      const { studentIds } = req.body;
      console.log(req.body);
      studentMarksCollection.updateMany({ _id: { $in: studentIds } }, { $inc: { WAD_Marks: 100, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_Marks: 10 } })
        .then(() => {
          console.log(WAD_Marks);
        
          res.send('Marks updated successfully');
        })
        .catch((err) => {
          console.error('Failed to update marks', err);
          res.status(500).send('Failed to update marks');
        });
    });

    const studentIds = ['646a06c29e986e59b56d9888']; // Example studentIds array

fetch('http://localhost:3000/students/update-marks', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ studentIds}),
})
  .then(response => response.text())
  .then(data => {

    console.log(data); // Prints the response message
  })
  .catch(error => {
    console.error('Failed to update marks:', error);
  });


    // List names of students who got more than 25 marks in all subjects
    app.get('/students/more-than-25-all-subjects', (req, res) => {
      studentMarksCollection.find({ WAD_Marks: { $gt: 25 }, CC_Marks: { $gt: 25 }, DSBDA_Marks: { $gt: 25 }, CNS_Marks: { $gt: 25 }, AI_Marks: { $gt: 25 } }, { projection: { Name: 1 } }).toArray()
        .then((students) => {
          const studentNames = students.map((student) => student.Name);
          res.json(studentNames);
        })
        .catch((err) => {
          console.error('Failed to retrieve students with more than 25 marks in all subjects', err);
          res.status(500).send('Failed to retrieve students with more than 25 marks in all subjects');
        });
    });

    // List names of students who got less than 40 in both Maths and Science
    app.get('/students/less-than-40-maths-science', (req, res) => {
      studentMarksCollection.find({ $and: [{ WAD_Marks: { $lt: 40 } }, { CC_Marks: { $lt: 40 } }] }, { projection: { Name: 1 } }).toArray()
        .then((students) => {
          const studentNames = students.map((student) => student.Name);
          res.json(studentNames);
        })
        .catch((err) => {
          console.error('Failed to retrieve students with less than 40 marks in both Maths and Science', err);
          res.status(500).send('Failed to retrieve students with less than 40 marks in both Maths and Science');
        });
    });

    // Remove specified student document from collection
    app.delete('/students/:id', (req, res) => {
      const studentId = req.params.id;
      studentMarksCollection.deleteOne({ _id: new MongoClient.ObjectID(studentId) })
        .then(() => {
          res.send('Student document deleted successfully');
        })
        .catch((err) => {
          console.error('Failed to delete student document', err);
          res.status(500).send('Failed to delete student document');
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
