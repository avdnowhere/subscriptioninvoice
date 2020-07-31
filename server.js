const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/greetingmessage', (req, res) => {
    res.send({ message: 'Welcome from Express.js!' });
});

app.post('/api/createsubscription', (req, res) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const firstDate = new Date(req.body.StartDate);
    const secondDate = new Date(req.body.EndDate);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    let addDays;
    if(req.body.SubscriptionType === 'DAILY'){
        addDays = 1;
    } else if(req.body.SubscriptionType === 'WEEKLY'){
        addDays = 7;
    } else {
        addDays = 30;
    }

    let invoiceDates = [];
    for(let i = 0; i <= diffDays; i += addDays){
        let startDate = new Date(req.body.StartDate);
        startDate.setDate(startDate.getDate() + i);
        let endDate = new Date(req.body.EndDate);
        if(startDate <= endDate){
            let dateStr = `${startDate.getDate()}`.padStart(2, "0") + "/" + `${startDate.getMonth() + 1}`.padStart(2, "0") + "/" + startDate.getFullYear();
            invoiceDates.push(dateStr);
        }
    }

    let outputDetails = [req.body, {invoiceDates}];
    res.send(`${JSON.stringify(outputDetails)}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));