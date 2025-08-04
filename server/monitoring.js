import { connectDB, getConnection } from './config/db.js';
import Event from './models/Event.js';
import mongoose from 'mongoose';

const SENSOR_DATA_COLLECTION = 'sensorData';
const SETTINGS_COLLECTION = 'settings';

const checkSensorData = async () => {
  try {
    const db = getConnection();
    const settings = await db.collection(SETTINGS_COLLECTION).findOne();
    const thresholds = settings?.thresholds || {};

    const sensorDataCollection = db.collection(SENSOR_DATA_COLLECTION);
    const changeStream = sensorDataCollection.watch();

    changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        const newDoc = change.fullDocument;
        const { topic, payload } = newDoc;

        for (const key in payload) {
          if (key in thresholds && payload[key] > thresholds[key]) {
            const newEvent = new Event({
              title: `${key} Spike Detected`,
              description: `Sensor ${topic} reported a value of ${payload[key]}, which is above the threshold of ${thresholds[key]}.`,
              severity: 'critical',
            });
            await newEvent.save();
            console.log(`Event created for ${key} spike.`);
          }
        }
      }
    });

    console.log('Monitoring sensor data for spikes...');
  } catch (err) {
    console.error('Error monitoring sensor data:', err);
  }
};

const startMonitoring = async () => {
  await connectDB();
  await checkSensorData();
};

startMonitoring();
