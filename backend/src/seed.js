require('dotenv').config();
const { sequelize, User } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const email = process.env.SEED_ADMIN_EMAIL;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }

    await User.create({
      name: process.env.SEED_ADMIN_NAME,
      email,
      password: process.env.SEED_ADMIN_PASSWORD,
      address: process.env.SEED_ADMIN_ADDRESS,
      role: 'admin',
    });

    console.log('Seeded initial admin user:', email);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
