const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.STRIPE_SECRET_KEY)
const nodemailer = require("nodemailer");
const port = process.env.PORT || 4000;
const path = require('path');
/// changes made
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'build','index.html'))
  })
}
/////////// STRIPE PAYMENT ////
app.post("/charge-client", async (req, res) => {
  console.log(req.body);
  let newTotal = req.body.amount;
  console.log('new total --- ', newTotal);
  let total = newTotal * 100;
  let parsedTotal = parseInt(total)
  console.log('total -- ', total);
  console.log('parsed total -- ', parsedTotal);
    // Create a PaymentIntent with the order amount and currency
    const pi = await stripe.paymentIntents.create({
      amount:parsedTotal.toString(),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log('PAYMENT INTENT --- ', pi);
    const { error, client_secret, id } = pi;
  
    res.send({
      clientSecret: client_secret,
      error:error,
      id
    });

    /// email receipt
    let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Golden Rides" <admin@goldenrides.com>', // sender address
    to: `${req.body.email},${req.body.loggedUserEmail}`, // list of receivers
    subject: "Confirmation Number ✔", // Subject line
    text: `Thank you for making a reservation. 
    Reservation made success.
    CONFIRMATION NUMBER ${req.body.confirmation}.
    EMAIL ADDRESS - ${req.body.email},${req.body.loggedUserEmail}.
    FROM -  ${req.body.from}. 
    TO -  ${req.body.to}.
    DATE -  ${req.body.date}.
    PAYMENT MADE - $${req.body.amount}`, // plain text body
    html: `<b>
    <h1>Reservation made success</h1>
    <p>CONFIRMATION NUMBER ${req.body.confirmation}</p>
    <p>EMAIL ADDRESS - ${req.body.email},${req.body.loggedUserEmail}</p>
    <p>FROM -  ${req.body.from}</p>
    <p>TO -  ${req.body.to}</p>
    <p>DATE -  ${req.body.date}</p>
    <p>PAYMENT MADE - $${req.body.amount}</p>
    </b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
/////////////////////////////
app.post('/sendEmail',(req,res) => {
  console.log(req.body);
})

app.listen(port, () => {
    console.log(`Limo Company Server started on port ${port}`);
});

//Run app, then load http://localhost:port in a browser to see the output.