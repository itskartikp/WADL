const express = require('express');
const { MongoClient } = require('mongodb');


const app = express();
const port = 3001;

app.use(express.json());

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    const db = client.db('music');
    const songDetailsCollection = db.collection('songdetails');

    // Create a collection called "songdetails"
    db.createCollection('songdetails')
      .then(() => {
        console.log('Collection "songdetails" created');
      })
      .catch((err) => {
        console.error('Failed to create collection', err);
      });

    // Insert array of 5 song documents
    const songs = [
      {
        Songname: 'Song 1',
        Film: 'Film 1',
        Music_director: 'Music Director 1',
        singer: 'Singer 1',
      },
      // Add more song documents here
    ];

    songDetailsCollection.insertMany(songs)
      .then((result) => {
        console.log(`${result.insertedCount} song documents inserted`);
      })
      .catch((err) => {
        console.error('Failed to insert song documents', err);
      });

    // Display total count of documents
    app.get('/count', (req, res) => {
      songDetailsCollection.countDocuments()
        .then((count) => {
          res.send(`Total count of documents: ${count}`);
        })
        .catch((err) => {
          console.error('Failed to retrieve count', err);
          res.status(500).send('Failed to retrieve count');
        });
    });

    // List all documents
    app.get('/songs', (req, res) => {
      songDetailsCollection.find().toArray()
        .then((songs) => {
          res.json(songs);
        })
        .catch((err) => {
          console.error('Failed to retrieve song documents', err);
          res.status(500).send('Failed to retrieve song documents');
        });
    });

    // List specified Music Director songs
    app.get('/songs/music-director/:director', (req, res) => {
      const musicDirector = req.params.director;
      songDetailsCollection.find({ Music_director: musicDirector }).toArray()
        .then((songs) => {
          res.json(songs);
        })
        .catch((err) => {
          console.error('Failed to retrieve songs by specified Music Director', err);
          res.status(500).send('Failed to retrieve songs by specified Music Director');
        });
    });

    // List specified Music Director songs sung by specified Singer
    app.get('/songs/music-director/:director/singer/:singer', (req, res) => {
      const musicDirector = req.params.director;
      const singer = req.params.singer;
      songDetailsCollection.find({ Music_director: musicDirector, singer: singer }).toArray()
        .then((songs) => {
          res.json(songs);
        })
        .catch((err) => {
          console.error('Failed to retrieve songs by specified Music Director and Singer', err);
          res.status(500).send('Failed to retrieve songs by specified Music Director and Singer');
        });
    });
    





    const songId = '6468524e3db6b800af67409a';

    fetch(`http://localhost:3001/songs/${songId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Song deleted successfully');
        } else {
          console.error('Failed to delete song');
        }
      })
      .catch(error => {
        console.error('Failed to delete song', error);
      });

    // Delete a song
    app.delete('/songs/:id', (req, res) => {
      const songId = req.params.id;
      songDetailsCollection.deleteOne({ _id: new MongoClient.ObjectId(songId) })
        .then(() => {
          res.send('Song deleted successfully');
        })
        .catch((err) => {
          console.error('Failed to delete song', err);
          res.status(500).send('Failed to delete song');
        });
    });







    // Add a new song
    app.post('/add-song', (req, res) => {
        console.log(req.body);
        const newSong = req.body;
        songDetailsCollection.insertOne(newSong)
          .then(() => {
            res.send('Song added successfully');
          })
          .catch((err) => {
            console.error('Failed to add song', err);
            res.status(500).send('Failed to add song');
          });
      });
      

    const songDetails = {
        Songname:'kesariya',
        Film: 'bramha',
        Music_director: 'ayan',
        singer: 'arijit',
      };
      
      fetch('http://localhost:3001/add-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songDetails),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('Failed to add song');
          }
        })
        .then((message) => {
          console.log(message); // Song added successfully
        })
        .catch((error) => {
          console.error(error);
        });




    // List Songs sung by Specified Singer from specified film
    app.get('/songs/film/:film/singer/:singer', (req, res) => {
      const film = req.params.film;
      const singer = req.params.singer;
      songDetailsCollection.find({ Film: film, singer: singer }).toArray()
        .then((songs) => {
          res.json(songs);
        })
        .catch((err) => {
          console.error('Failed to retrieve songs by specified Singer from specified Film', err);
          res.status(500).send('Failed to retrieve songs by specified Singer from specified Film');
        });
    });

    // Update the document by adding Actor and Actress name
    app.put('/songs/:id', (req, res) => {
        const songId = req.params.id;
        const { actor, actress } = req.body;
        console.log(req,body);
        const filter = { _id: new MongoClient.ObjectId(songId) };
        const update = { $set: { actor, actress } };
        songDetailsCollection
          .updateOne(filter, update)
          .then(() => {
            res.send('Song updated successfully');
          })
          .catch((err) => {
            console.error('Failed to update song', err);
            res.status(500).send('Failed to update song');
          });
      });

      const songIde = '6469e16afe0032f74be9d638'; // Replace with the actual song ID
      const updateData = {
        actor: 'Updated Actor',
        actress: 'Updated Actress'
      };
      
      fetch(`/songs/${songIde}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
        .then(response => {
          if (response.ok) {
            console.log('Song updated successfully');
          } else {
            console.error('Failed to update song');
          }
        })
        .catch(error => {
          console.error('Failed to update song', error);
        });
      


    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
