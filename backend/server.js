import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import Pusher from 'pusher'; // Import the Pusher library
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Pusher configuration
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

app.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  console.log(auth)
  res.send(auth);
});

app.post('/send-message', async (req, res) => {
  try {
    const { recipients, text } = req.body;
    console.log(recipients,text)

    recipients.forEach(recipient => {
      const recipientChannel = `private-${recipient}`;
      const newRecipients = recipients.filter(r => r !== recipient);

      // Trigger an event on the Pusher channel
      pusher.trigger(recipientChannel, 'client-receive-message', {
        recipients: newRecipients,
        sender: recipient,
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send message.' });
  }
});


app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
