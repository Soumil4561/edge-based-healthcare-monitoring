const mqtt = require('mqtt');

const brokerUrl = 'mqtt://broker.hivemq.com';  // Replace with your MQTT broker's URL
const options = {
  clientId: 'patient-publisher',  // Unique client ID
  clean: true,
};

const client = mqtt.connect(brokerUrl, options);

// Define the patient ID
const patientID = '202151161'; // Replace with the patient ID

// Function to generate random patient data
function generatePatientData(patientId) {
  const minHeartRate = 60;
  const maxHeartRate = 100;
  const minTemperature = 36.5;
  const maxTemperature = 37.5;
  
  const heartRate = Math.floor(Math.random() * (maxHeartRate - minHeartRate + 1)) + minHeartRate;
  const temperature = (Math.random() * (maxTemperature - minTemperature) + minTemperature).toFixed(2);
  
  return { patientId, heartRate, temperature };
}

// Publish patient data every 10 seconds
setInterval(() => {
  const topic = 'patient/data';
  const { patientId, heartRate, temperature } = generatePatientData(patientID);
  const message = JSON.stringify({ patientId, heartRate, temperature, timestamp: new Date().toISOString()});

  // Publish the message
  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Error publishing patient data:', err);
    } else {
      console.log(`Patient data published: ${message}`);
    }
  });
}, 10000);  // Publish every 10 seconds

// Handle connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Handle errors
client.on('error', (err) => {
  console.error('Error:', err);
});

// Handle disconnection
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down MQTT publisher');
  client.end();
  process.exit();
});
