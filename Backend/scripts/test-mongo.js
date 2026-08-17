require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set');
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

(async () => {
  try {
    await client.connect();
    console.log('MongoDB driver: connected successfully');
  } catch (err) {
    console.error('MongoDB driver error:');
    console.error(err);
  } finally {
    try { await client.close(); } catch {};
    process.exit(0);
  }
})();
