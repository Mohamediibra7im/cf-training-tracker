import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function makeUserAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env file');
    process.exit(1);
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const username = "your_codeforces_username";

    const result = await db.collection('users').updateOne(
      { codeforcesHandle: username },
      { $set: { role: "admin" } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ User with handle "${username}" not found`);
    } else if (result.modifiedCount === 1) {
      console.log(`✅ User "${username}" is now an admin!`);
    } else {
      console.log(`ℹ️ User "${username}" was already an admin`);
    }

    const user = await db.collection('users').findOne({ codeforcesHandle: username });
    console.log('User details:', {
      handle: user?.codeforcesHandle,
      role: user?.role
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

makeUserAdmin();
