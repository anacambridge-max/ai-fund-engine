-- ============================================================
-- AI MUTUAL FUND ENGINE PRO - SUPABASE DATABASE SCHEMA
-- ============================================================
-- Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PORTFOLIO HOLDINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id BIGSERIAL PRIMARY KEY,
    fund_id INTEGER NOT NULL UNIQUE,
    units DECIMAL(15, 6) NOT NULL DEFAULT 0,
    avg_buy_price DECIMAL(15, 4) NOT NULL DEFAULT 0,
    invested_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_fund_id ON portfolio_holdings(fund_id);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL', 'SIP')),
    units DECIMAL(15, 6) NOT NULL,
    nav DECIMAL(15, 4) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_fund_id ON transactions(fund_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);

-- ============================================================
-- NAV HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS nav_history (
    id BIGSERIAL PRIMARY KEY,
    fund_id INTEGER NOT NULL,
    amfi_code VARCHAR(20) NOT NULL,
    nav DECIMAL(15, 4) NOT NULL,
    nav_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(fund_id, nav_date)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_nav_history_fund_id ON nav_history(fund_id);
CREATE INDEX IF NOT EXISTS idx_nav_history_date ON nav_history(nav_date DESC);

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BACKUP LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS backup_logs (
    id BIGSERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to portfolio_holdings
DROP TRIGGER IF EXISTS update_portfolio_holdings_updated_at ON portfolio_holdings;
CREATE TRIGGER update_portfolio_holdings_updated_at
    BEFORE UPDATE ON portfolio_holdings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to settings
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ============================================================
-- Enable RLS if you want user-specific data
-- ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE nav_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================
-- INSERT INTO settings (key, value) VALUES 
--     ('app_version', '1.0.0'),
--     ('last_nav_update', NULL),
--     ('last_backup', NULL);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these to verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT 'Schema created successfully!' as status;
