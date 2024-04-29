require('dotenv').config();
const express = require('express');
const app = express();
const mqtt = require('mqtt');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const client = mqtt.connect(HOST);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to a topic
    client.subscribe('test/topic', (err) => {
      if (!err) {
        console.log('Subscribed to topic: test/topic');
      } else {
        console.error('Error subscribing to topic:', err);
      }
    });
  });

  // Handle MQTT message arrivals
client.on('message', (topic, message) => {
    console.log('Received message from topic:', topic, 'Message:', message.toString());
    // You can process the received message here
  });

  // Express route for testing
app.get('/', (req, res) => {
    res.send('Express MQTT Subscriber is running!');
  });

  // Start the Express server
app.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
  });