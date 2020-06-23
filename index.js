const express = require('express')
const fs = require("fs"); 
const balls = require("./balls"); 
const { time } = require('console');
const app = express()
const port = 3000

app.get('/bounce', (req, res) => {
    
    let restitution = req.query.res;
    let height = req.query.height;
    let heights=[height];
    let time = 0;
    let times = [time];

    heights.push(0);
    time += Math.sqrt(2*height/9.8);
    times.push(time.toFixed(4));

    while(height > 0.0009) {
        let nextHeight = height*restitution*restitution;
        heights.push(nextHeight.toFixed(4));
        height = nextHeight;

        let nextTime = Math.sqrt(2*nextHeight/9.8)
        time += nextTime;
        times.push(time.toFixed(4));
        heights.push(0);
        time += nextTime;
        times.push(time.toFixed(4));
        console.log("height : "+height+"time"+time);
    }

    let data = {
        heights : heights,
        times : times,
        height : req.query.height,
        res : req.query.res
    }

    writeInFile(data);

    res.send(data);
})

const writeInFile = (data) => {
  let ball = {
    heights: data.heights,
    times: data.times,
  };

  balls.push(ball);

  fs.writeFile("balls.json", JSON.stringify(balls), (err) => {
    if (err) console.log( "ERROR : "+err);
    console.log("Done writing");
  });
};

app.get('/history', (req,res) => {
  res.send(balls);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))