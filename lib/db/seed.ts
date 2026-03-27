import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding database with realistic dummy data...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing in environment variables');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    // 1. Clear existing data to avoid conflicts (optional but recommended for seeds)
    console.log('Clearing existing data...');
    await db.delete(schema.washesTable);
    await db.delete(schema.contractsTable);
    await db.delete(schema.carsTable);
    await db.delete(schema.customersTable);
    await db.delete(schema.staffsTable);
    await db.delete(schema.usersTable);
    await db.delete(schema.packagesTable);
    await db.delete(schema.settingsTable);

    // 1.5 Insert Settings
    console.log('Inserting settings...');
    await db.insert(schema.settingsTable).values({
      id: 1,
      appName: 'Kinclong App',
      companyName: 'Kinclong Wash',
      companyLogo: 'https://placehold.co/200x50/2E5D57/FFFFFF?text=Kinclong',
      companyIcon: 'https://placehold.co/50x50/2E5D57/FFFFFF?text=K',
      companyAddress: 'Jl. Sudirman No 123, Jakarta',
      phone: '+628123456789',
      email: 'info@kinclong.com',
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      socialMedia: { instagram: '@kinclongwash', facebook: 'Kinclong Wash' },
      others: { primaryColor: '#2ED573', theme: 'light' },
    });

    // 2. Insert Users
    //--Let's use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash('pass-123', 10)
    console.log('Inserting users...');
    const insertedUsers = await db.insert(schema.usersTable).values([
      { name: 'John Admin', email: 'admin@mail.com', phone: '0551234561', role: 'admin', passwordHash: hashedPassword, isActive: true },
      { name: 'Ali Washer', email: 'ali@mail.com', phone: '0551234562', role: 'staff', passwordHash: hashedPassword, isActive: true },
      { name: 'Omar Staff', email: 'omar@mail.com', phone: '0551234563', role: 'staff', passwordHash: hashedPassword, isActive: true },
      { name: 'Fatima Customer', email: 'fatima@mail.com', phone: '0551234564', role: 'customer', passwordHash: hashedPassword, isActive: true },
      { name: 'Ahmed Customer', email: 'ahmed@mail.com', phone: '0551234565', role: 'customer', passwordHash: hashedPassword, isActive: true },
    ]).returning();

    const admin = insertedUsers[0];
    const staff1 = insertedUsers[1];
    const staff2 = insertedUsers[2];
    const userFatima = insertedUsers[3];
    const userAhmed = insertedUsers[4];

    // 2.5 Insert Staffs
    console.log('Inserting staffs...');
    await db.insert(schema.staffsTable).values([
      { userId: staff1.id, phone: '0551234562', address: 'Jl. Merdeka No 10, Jakarta', position: 'Car Washer', salary: 3500000, hireDate: new Date('2024-01-15') },
      { userId: staff2.id, phone: '0551234563', address: 'Jl. Sudirman No 50, Jakarta', position: 'Supervisor', salary: 5000000, hireDate: new Date('2023-11-20') },
    ]);

    // 3. Insert Customers (Link to users)
    console.log('Inserting customers...');
    const insertedCustomers = await db.insert(schema.customersTable).values([
      { userId: userFatima.id, phone: '0551234564', email: 'fatima@contact.com', address: 'Jl. Melati No 1, Jakarta', points: 150, isActive: true },
      { userId: userAhmed.id, phone: '0551234565', email: 'ahmed@contact.com', address: 'Jl. Mawar No 2, Jakarta', points: 50, isActive: true },
    ]).returning();

    const customerFatima = insertedCustomers[0];
    const customerAhmed = insertedCustomers[1];

    // 4. Insert Cars
    console.log('Inserting cars...');
    const insertedCars = await db.insert(schema.carsTable).values([
      { customerId: customerFatima.id, type: 'small', plateNumber: 'A 12345' },
      { customerId: customerFatima.id, type: 'big', plateNumber: 'D 67890' },
      { customerId: customerAhmed.id, type: 'small', plateNumber: 'E 55555' },
    ]).returning();

    const fatimaCar1 = insertedCars[0];
    const fatimaCar2 = insertedCars[1];
    const ahmedCar = insertedCars[2];

    // 4.5 Insert Packages
    console.log('Inserting packages...');
    const insertedPackages = await db.insert(schema.packagesTable).values([
      {
        name: 'Eco Monthly Pack',
        description: 'Complete monthly vehicle wash including 4 exterior washes and 1 deep interior cleaning.',
        duration: 30,
        price: 250000,
        includes: ["4x Exterior wash", "1x Interior clean", "Basic Waxing", "Tire dressing"],
        popularity: 95,
      },
      {
        name: 'Quick Splash',
        description: 'On-demand cars exterior wash within 15 mins.',
        duration: 1,
        price: 65000,
        includes: ["1x Exterior wash", "Window wiping"],
        popularity: 60,
      },
      {
        name: 'Premium Detailing',
        description: 'Top-tier detailing for true car enthusiasts.',
        duration: 3,
        price: 850000,
        includes: ["Exterior wash", "Interior detailing", "Polishing", "Premium Waxing", "Engine bay wipe"],
        popularity: 40,
        isActive: false, // Maybe currently unavailable
      }
    ]).returning();

    const monthlyPack = insertedPackages[0];
    const onDemandPack = insertedPackages[1];

    // 5. Insert Contracts
    console.log('Inserting contracts...');
    const insertedContracts = await db.insert(schema.contractsTable).values([
      {
        customerId: customerFatima.id,
        carId: fatimaCar1.id,
        packageId: monthlyPack.id,
        packageType: monthlyPack.name,
        totalWashes: 5, // 4 outside + 1 inside
        completedWashes: 2,
        status: 'active',
      },
      {
        customerId: customerFatima.id,
        carId: fatimaCar2.id,
        packageId: onDemandPack.id,
        packageType: onDemandPack.name,
        totalWashes: 1,
        completedWashes: 1,
        status: 'completed',
      },
      {
        customerId: customerAhmed.id,
        carId: ahmedCar.id,
        packageId: monthlyPack.id,
        packageType: monthlyPack.name,
        totalWashes: 5,
        completedWashes: 0,
        status: 'active',
      },
    ]).returning();

    const fatimaContract1 = insertedContracts[0];
    const fatimaContract2 = insertedContracts[1];
    const ahmedContract = insertedContracts[2];

    // 6. Insert Washes
    console.log('Inserting washes...');
    await db.insert(schema.washesTable).values([
      // Fatima's active monthly package (2 washes completed)
      {
        contractId: fatimaContract1.id,
        type: 'outside',
        status: 'acknowledged',
        imageUrl: 'https://placehold.co/600x400/2ED573/FFFFFF?text=Outside+Wash+1',
        completedBy: staff1.id,
        acknowledgedByCustomer: true,
      },
      {
        contractId: fatimaContract1.id,
        type: 'outside',
        status: 'done', // Waiting for Fatima to acknowledge
        imageUrl: 'https://placehold.co/600x400/2ED573/FFFFFF?text=Outside+Wash+2',
        completedBy: staff2.id,
        acknowledgedByCustomer: false,
      },
      {
        contractId: fatimaContract1.id,
        type: 'inside',
        status: 'pending',
        acknowledgedByCustomer: false,
      },
      // Fatima's completed on-demand package
      {
        contractId: fatimaContract2.id,
        type: 'outside',
        status: 'acknowledged',
        imageUrl: 'https://placehold.co/600x400/20BF6B/FFFFFF?text=On-Demand+Wash',
        completedBy: staff1.id,
        acknowledgedByCustomer: true,
      },
      // Ahmed's new monthly package (1 pending wash scheduled)
      {
        contractId: ahmedContract.id,
        type: 'outside',
        status: 'pending',
        acknowledgedByCustomer: false,
      },
    ]);

    console.log('✅ Seed complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    pool.end();
  }
}

seed();
