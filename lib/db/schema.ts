import { pgTable, serial, varchar, boolean, integer, timestamp, pgEnum, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['admin', 'staff', 'customer', 'unverified']);
export const carTypeEnum = pgEnum('car_type', ['small', 'big']);
export const contractStatusEnum = pgEnum('contract_status', ['active', 'completed', 'cancelled']);
export const washTypeEnum = pgEnum('wash_type', ['inside', 'outside']);
export const washStatusEnum = pgEnum('wash_status', ['pending', 'done', 'acknowledged']);

export const settingsTable = pgTable('settings', {
  id: serial('id').primaryKey(),
  appName: varchar('app_name', { length: 255 }).notNull().default('Kinclong'),
  companyName: varchar('company_name', { length: 255 }).notNull().default('Kinclong Car Wash'),
  companyLogo: varchar('company_logo', { length: 500 }),
  companyIcon: varchar('company_icon', { length: 500 }),
  companyAddress: varchar('company_address', { length: 500 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  currency: varchar('currency', { length: 10 }).notNull().default('IDR'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Jakarta'),
  socialMedia: json('social_media'),
  others: json('others'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 50 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').default('unverified').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customersTable = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  phone: varchar('phone', { length: 50 }), //--Use as another phone, main phone will get from user table
  email: varchar('email', { length: 255 }), //--Use as another email, main email will get from user table
  address: varchar('address', { length: 500 }),
  points: integer('points').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  idCardUrl: varchar('id_card_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const staffsTable = pgTable('staffs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  phone: varchar('phone', { length: 50 }), //--Use as another phone, main phone will get from user table
  address: varchar('address', { length: 500 }),
  position: varchar('position', { length: 100 }),
  salary: integer('salary'),
  isActive: boolean('is_active').default(true).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  idCardUrl: varchar('id_card_url', { length: 500 }),
  hireDate: timestamp('hire_date').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carsTable = pgTable('cars', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customersTable.id).notNull(),
  type: carTypeEnum('type').notNull(),
  plateNumber: varchar('plate_number', { length: 50 }).notNull(),
  brand: varchar('brand', { length: 50 }), //--Use as another brand. Eq. KIA, Honda, Toyota, etc
  model: varchar('model', { length: 50 }), //--Use as another model. Eq. Carnival, Brio, Avanza, etc
  color: varchar('color', { length: 50 }), //--Use as another color. Eq. Black, White, Silver, etc
  imageUrl: varchar('image_url', { length: 500 }),
  notes: varchar('notes', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const packagesTable = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 500 }),
  duration: integer('duration').notNull(), // e.g., days validity
  price: integer('price').notNull(),
  includes: json('includes').notNull(), // Example: ["Exterior wash", "Interior clean"]
  popularity: integer('popularity').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contractsTable = pgTable('contracts', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customersTable.id).notNull(),
  carId: integer('car_id').references(() => carsTable.id).notNull(),
  packageId: integer('package_id').references(() => packagesTable.id), // Link to new packages table
  packageType: varchar('package_type', { length: 100 }).notNull(), // existing legacy or derived name
  totalWashes: integer('total_washes').notNull(),
  completedWashes: integer('completed_washes').default(0).notNull(),
  status: contractStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const washesTable = pgTable('washes', {
  id: serial('id').primaryKey(),
  contractId: integer('contract_id').references(() => contractsTable.id).notNull(),
  type: washTypeEnum('type').notNull(),
  status: washStatusEnum('status').default('pending').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  completedBy: integer('completed_by').references(() => usersTable.id), // staff_id
  acknowledgedByCustomer: boolean('acknowledged_by_customer').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations for easier queries
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  customer: one(customersTable),
  staff: one(staffsTable),
  washesCompleted: many(washesTable),
}));

export const customersRelations = relations(customersTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [customersTable.userId], references: [usersTable.id] }),
  cars: many(carsTable),
  contracts: many(contractsTable),
}));

export const carsRelations = relations(carsTable, ({ one, many }) => ({
  customer: one(customersTable, { fields: [carsTable.customerId], references: [customersTable.id] }),
  contracts: many(contractsTable),
}));

export const staffsRelations = relations(staffsTable, ({ one }) => ({
  user: one(usersTable, { fields: [staffsTable.userId], references: [usersTable.id] }),
}));

export const packagesRelations = relations(packagesTable, ({ many }) => ({
  contracts: many(contractsTable),
}));

export const contractsRelations = relations(contractsTable, ({ one, many }) => ({
  customer: one(customersTable, { fields: [contractsTable.customerId], references: [customersTable.id] }),
  car: one(carsTable, { fields: [contractsTable.carId], references: [carsTable.id] }),
  package: one(packagesTable, { fields: [contractsTable.packageId], references: [packagesTable.id] }),
  washes: many(washesTable),
}));

export const washesRelations = relations(washesTable, ({ one }) => ({
  contract: one(contractsTable, { fields: [washesTable.contractId], references: [contractsTable.id] }),
  staff: one(usersTable, { fields: [washesTable.completedBy], references: [usersTable.id] }),
  staffProfile: one(staffsTable, { fields: [washesTable.completedBy], references: [staffsTable.userId] }),
}));
