#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Training Tracker Environment Setup\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists!');
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            createEnvFile();
        } else {
            console.log('Setup cancelled.');
            process.exit(0);
        }
        rl.close();
    });
} else {
    createEnvFile();
}

function createEnvFile() {
    console.log('📝 Creating environment variables...\n');

    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('base64');

    const envContent = `# MongoDB Connection String
# Replace with your actual MongoDB connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGO_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# JWT Secret Key (auto-generated - keep this secure!)
JWT_SECRET=${jwtSecret}

# Optional: Codeforces API Rate Limiting (in milliseconds)
# Default: 1000ms between requests
CODEFORCES_API_DELAY=1000
`;

    try {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env.local file created successfully!\n');

        console.log('📋 Next steps:');
        console.log('1. Replace the MONGO_URL with your actual MongoDB connection string');
        console.log('2. Keep the JWT_SECRET secure and don\'t share it');
        console.log('3. For deployment, set these same variables in your hosting platform\n');

        console.log('🔗 MongoDB Atlas Setup:');
        console.log('- Go to https://mongodb.com/atlas');
        console.log('- Create a free account and cluster');
        console.log('- Get your connection string from the "Connect" button');
        console.log('- Replace the MONGO_URL placeholder with your actual connection string\n');

        console.log('🚀 Deployment:');
        console.log('- For Vercel: Set MONGO_URL and JWT_SECRET in project settings');
        console.log('- For other platforms: Add these as environment variables\n');

        console.log('⚠️  Important:');
        console.log('- Never commit .env.local to version control');
        console.log('- Keep your JWT_SECRET secure and random');
        console.log('- Use the same JWT_SECRET across all environments\n');

    } catch (error) {
        console.error('❌ Error creating .env.local file:', error.message);
        process.exit(1);
    }
}
