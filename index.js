require('dotenv').config();
const express = require('express');
const app = express();
const mqtt = require('mqtt');
const connection = require('./db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
const topic = process.env.TOPIC;

const client = mqtt.connect(HOST);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to a topic
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log('Subscribed to topic:', topic);
      } else {
        console.error('Error subscribing to topic:', err);
      }
    });
  });

  // Handle MQTT message arrivals
client.on('message', async(topic, message) => {
    console.log('Received message from topic:', topic, 'Message:', message.toString());

    // Parse message payload (assuming it's in JSON format)
  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (err) {
    console.error('Error parsing message payload:', err);
    return;
  }
  // Extract patient ID from message payload
  const { patientId } = payload;
  const {temperature, heartRate, timestamp} = payload;

  if (!patientId) {
    console.error('Missing patient ID in message payload');
    return;
  }

  // Process the message payload
  console.log('Processing message for patient ID:', patientId);
  
  // store the data in a database
  await savetoDB(patientId, temperature, heartRate, timestamp);
});

const savetoDB = async (patientId, temperature,heart_rate, timestamp) => {
    //each patient data is stored in a seperate table
    const tableName = `patient_${patientId}`;
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id SERIAL PRIMARY KEY, temperature NUMERIC, heart_rate INTEGER, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    try {
      await connection.query(query);
      console.log(`Table ${tableName} created successfully`);
    } catch (err) {
      console.error('Error creating table:', err);
      return;
    }

    // Insert the patient data into the table
    const insertQuery = `INSERT INTO ${tableName} (temperature, heart_rate, timestamp) VALUES ($1, $2, $3)`;
    const values = [temperature, heart_rate, timestamp];

    try {
      await connection.query(insertQuery, values);
      console.log('Patient data inserted successfully');
    } catch (err) {
      console.error('Error inserting patient data:', err);
    }
}

  // Express route for testing
app.get('/', (req, res) => {
    res.send('Express MQTT Subscriber is running!');
  });

  // Start the Express server
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
  });