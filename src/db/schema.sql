-- =========================================================
-- OTT Mega 2.0 - Relational Database Schema (PostgreSQL / MySQL)
-- Designed for High Concurrency, Fast Credential Delivery & Audit Logs
-- =========================================================

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. OTT Plans Table
CREATE TABLE IF NOT EXISTS ott_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    platform VARCHAR(80) NOT NULL,
    badge VARCHAR(80),
    duration VARCHAR(50) NOT NULL, -- e.g. '1 Month', '3 Months', '1 Year'
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    screens INT DEFAULT 1,
    resolution VARCHAR(50) DEFAULT '4K UHD',
    device_support VARCHAR(150) DEFAULT 'TV, Laptop, Mobile',
    is_popular BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    description TEXT,
    icon_color VARCHAR(30) DEFAULT '#ec4899',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'OTT-82419'
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL, -- WhatsApp number for delivery
    plan_id VARCHAR(36) REFERENCES ott_plans(id) ON DELETE SET NULL,
    plan_title VARCHAR(150) NOT NULL,
    platform VARCHAR(80) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Completed', 'Failed'
    payment_method VARCHAR(50) DEFAULT 'UPI',
    payment_ref VARCHAR(100),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Credentials Table (Secure separate storage)
CREATE TABLE IF NOT EXISTS order_credentials (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    account_email VARCHAR(255) NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    profile_pin VARCHAR(20),
    screen_number VARCHAR(30),
    expiry_date DATE,
    special_notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Unread', -- 'Unread', 'Replied', 'Archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups on Track Order and Admin queries
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_plans_platform ON ott_plans(platform);
