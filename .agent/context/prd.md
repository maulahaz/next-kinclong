# 🚗 Product Requirements Document (PRD)

## Product Name: Kinclong

---

## 1. 📌 Overview

Kinclong is a **mobile-first web application** designed to streamline car wash operations between:

* **Car Wash Owners (Admins)**
* **Car Washers (Staff)**
* **Customers (Clients)**

The platform enables:

* Contract/package management
* Scheduled wash tracking
* Proof-of-work (image evidence)
* Customer acknowledgment
* Multi-car support per customer

---

## 2. 🎯 Goals & Objectives

### Business Goals

* Digitize manual car wash operations
* Increase transparency with customers
* Improve staff accountability via evidence uploads
* Enable subscription (monthly contracts)

### User Goals

* **Admin**: Manage contracts, staff, customers efficiently
* **Staff**: Easily track tasks and upload proof
* **Customer**: Verify services and track usage

---

## 3. 👥 User Roles & Permissions

### 3.1 Admin (Car Wash Owner)

* Create/edit/delete:

  * Customers
  * Cars
  * Staff
  * Contracts (packages)
* Assign contracts to customers
* Monitor wash completion
* View reports

---

### 3.2 Staff (Car Washer)

* View assigned wash jobs
* Upload evidence (image after wash)
* Mark job as completed

---

### 3.3 Customer

* View their cars
* View active contracts
* See wash history + images
* Acknowledge completed washes
* Track remaining washes in package

---

## 4. 📦 Contract Packages

### 4.1 Available Packages

#### By Request (On Demand)

| Type         | Small Car | Big Car |
| ------------ | --------- | ------- |
| Outside Wash | AED 25    | AED 30  |
| Inside Wash  | AED 20    | AED 25  |

#### Monthly Package

| Package                        | Small Car | Big Car |
| ------------------------------ | --------- | ------- |
| 4x Outside + 1x Inside (Month) | AED 75    | AED 100 |

---

### 4.2 Contract Rules

* Monthly contract = **5 total washes (4 outside + 1 inside)**
* Each wash must have:

  * Status
  * Evidence (image)
  * Timestamp
* When all washes are completed → contract is **Completed**
* Customer must create a **new contract manually**

---

## 5. 🔄 Core Workflows

---

### 5.1 Contract Creation (Admin)

1. Admin selects Customer
2. Selects Car
3. Chooses package
4. Confirms contract
5. System generates:

   * Wash quota
   * Schedule (optional/manual)

---

### 5.2 Wash Execution (Staff)

1. Staff sees assigned jobs
2. Performs wash
3. Uploads image evidence
4. Marks job as completed

---

### 5.3 Customer Acknowledgment

1. Customer receives notification (toast / UI indicator)
2. Views uploaded image
3. Confirms (acknowledges) wash

---

### 5.4 Contract Completion

* If all required washes are:

  * Completed ✅
  * With evidence ✅
* Then:
  → Contract status = **Completed**
  → Prompt: “Create New Contract”

---

### 5.5 Multi-Car Support

* Customer can:

  * Add multiple cars
  * Each car has its own contracts

---

## 6. 🧱 Features Breakdown

---

### 6.1 Authentication

* Role-based login:

  * Admin
  * Staff
  * Customer

---

### 6.2 Dashboard

#### Admin Dashboard

* Total customers
* Active contracts
* Completed washes
* Staff activity

#### Staff Dashboard

* Today’s tasks
* Pending uploads

#### Customer Dashboard

* Active contracts
* Remaining washes
* Recent activity

---

### 6.3 Car Management

* Fields:

  * Plate number
  * Car type (Small / Big)
  * Owner

---

### 6.4 Contract Management

* Create / Edit / View
* Track:

  * Remaining washes
  * Evidence uploads
  * Status

---

### 6.5 Wash Records

* Each wash includes:

  * Type (inside/outside)
  * Date
  * Image evidence
  * Status (Pending / Done / Acknowledged)

---

### 6.6 Evidence Upload

* Image upload (camera/mobile-first)
* Stored in:

  * Local storage or cloud (Supabase Storage recommended)

---

### 6.7 Notifications (UI-level)

* Toast messages:

  * Success
  * Error
* Visual indicators:

  * New evidence uploaded
  * Pending acknowledgment

---

## 7. 🗄️ Data Model (High-Level)

### Entities

#### User

* id
* name
* role (admin, staff, customer)

#### Customer

* id
* user_id

#### Car

* id
* customer_id
* type (small/big)
* plate_number
* image_url

#### Contract

* id
* customer_id
* car_id
* package_type
* total_washes
* completed_washes
* status

#### Wash

* id
* contract_id
* type (inside/outside)
* status
* image_url
* completed_by (staff_id)
* acknowledged_by_customer (boolean)

---

## 8. 🎨 UI/UX Requirements

### Design System

* **Font**: San Francisco (iOS style)

#### Color Palette (Green Mint Theme)

The application must follow a green mint color palette to create a clean, modern, and fresh visual identity.
* **Primary Colors**:
  * Primary (Mint Green): #2ED573
  * Primary Dark: #20BF6B
  * Primary Light: #7BED9F
* **Neutral Colors**:
  * Background: #FFFFFF (white)
  * Surface: #F7FDF9 (very light mint)
  * Border: #E6F4EA
* **Text Colors**:
  * Primary Text: #0F3D2E (dark green)
  * Secondary Text: #4F7D6B
  * Muted Text: #9BBFB0
* **Status Colors**:
  * Success: #2ED573
  * Error: #FF6B6B
  * Warning: #FBC531  

#### Usage Rules
* Primary actions (buttons, highlights) must use Primary Mint Green
* Background must remain white or very light mint
* Text must always maintain high contrast readability
* Avoid using non-theme colors unless for status (error/warning)

#### Visual Style
* Clean, minimal UI
* Subtle neon glow effect on primary buttons:
  * box-shadow: ```0 0 8px rgba(46, 213, 115, 0.6)```
* Rounded corners (```rounded-xl```)
* Soft shadows (no harsh drop shadows)

#### Components Styling Rules
##### Buttons
* Primary: mint green background + white text
* Secondary: white background + green border
* Hover: slightly darker green
##### Cards
* White background
* Light border (#E6F4EA)
* Soft shadow
##### Tables
* Header: light mint background
* Row hover: very light green highlight

---

### UI Rules

* ✅ All buttons: **Icon + Label**
* ✅ Small buttons: **Icon only + Tooltip**
* ✅ Loading state: Spinner on click
* ✅ Feedback: Toast messages
* ✅ Destructive actions:

  * Require confirmation modal

---

### Tables

* Actions column:

  * “...” (kebab menu) or hamburger
  * Options:

    * Detail
    * Edit
* Delete:

  * Only inside Detail page

---

### Forms

* Single reusable form:

  * Create + Edit mode
* Validation required

---

## 9. 📱 Responsive Design

* Mobile-first design
* Optimized for:

  * Phone (primary)
  * Tablet
  * Desktop (responsive scaling)

---

## 10. 🛠️ Tech Stack

### Frontend

* Next.js
* Tailwind CSS
* ShadCN UI

### Backend

* Next.js API routes / Server Actions

### Database

* PostgreSQL via:

  * Drizzle ORM
  * Supabase OR NeonDB

### Storage

* Local / Supabase Storage (for images)

---

## 11. ⚠️ Edge Cases

* Staff uploads wrong image → allow re-upload
* Customer doesn’t acknowledge → still counted as completed? (define rule)
* Partial monthly usage → contract expires?
* Duplicate contracts per car → allowed or restricted?

---

## 12. 🚀 Future Enhancements

* Push notifications
* Auto-scheduling washes
* Payment integration
* Subscription auto-renewal
* GPS tracking for staff
* AI image validation (car cleanliness detection)

---

## 13. 📊 Success Metrics

* % of completed contracts
* Avg. time to upload evidence
* Customer acknowledgment rate
* Retention (monthly renewals)
