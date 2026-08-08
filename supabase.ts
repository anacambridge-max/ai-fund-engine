// ============================================================
// SUPABASE SERVICE - DATABASE INTEGRATION
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioHolding, Transaction, NAVHistory } from '../types';

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

// These will be replaced with your actual Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
};

// Create Supabase client (only if configured)
let supabase: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return supabase;
};

// ============================================================
// DATABASE TYPES (matches Supabase schema)
// ============================================================

interface DBPortfolioHolding {
  id?: number;
  fund_id: number;
  units: number;
  avg_buy_price: number;
  invested_amount: number;
  created_at?: string;
  updated_at?: string;
}

interface DBTransaction {
  id?: string;
  fund_id: number;
  type: 'BUY' | 'SELL' | 'SIP';
  units: number;
  nav: number;
  amount: number;
  transaction_date: string;
  created_at?: string;
}

interface DBNavHistory {
  id?: number;
  fund_id: number;
  amfi_code: string;
  nav: number;
  nav_date: string;
  created_at?: string;
}

interface DBSettings {
  id?: number;
  key: string;
  value: string;
  updated_at?: string;
}

// ============================================================
// PORTFOLIO OPERATIONS
// ============================================================

/**
 * Save portfolio holdings to Supabase
 */
export const savePortfolio = async (holdings: PortfolioHolding[]): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) {
    console.log('Supabase not configured, skipping save');
    return false;
  }

  try {
    // Convert to DB format
    const dbHoldings: DBPortfolioHolding[] = holdings.map(h => ({
      fund_id: h.fundId,
      units: h.units,
      avg_buy_price: h.avgBuyPrice,
      invested_amount: h.investedAmount
    }));

    // Upsert (insert or update)
    const { error } = await client
      .from('portfolio_holdings')
      .upsert(dbHoldings, { onConflict: 'fund_id' });

    if (error) {
      console.error('Failed to save portfolio:', error);
      return false;
    }

    console.log('✅ Portfolio saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return false;
  }
};

/**
 * Load portfolio holdings from Supabase
 */
export const loadPortfolio = async (): Promise<PortfolioHolding[] | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('portfolio_holdings')
      .select('*')
      .order('fund_id');

    if (error) {
      console.error('Failed to load portfolio:', error);
      return null;
    }

    // Convert from DB format
    const holdings: PortfolioHolding[] = (data as DBPortfolioHolding[]).map(h => ({
      fundId: h.fund_id,
      units: h.units,
      avgBuyPrice: h.avg_buy_price,
      investedAmount: h.invested_amount,
      currentValue: 0, // Will be calculated
      profit: 0,
      profitPercent: 0,
      allocation: 0,
      targetAllocation: 0,
      rebalanceAmount: 0
    }));

    console.log(`✅ Loaded ${holdings.length} holdings from Supabase`);
    return holdings;
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return null;
  }
};

// ============================================================
// TRANSACTION OPERATIONS
// ============================================================

/**
 * Add a new transaction
 */
export const addTransaction = async (transaction: Transaction): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) {
    return false;
  }

  try {
    const dbTransaction: DBTransaction = {
      id: transaction.id,
      fund_id: transaction.fundId,
      type: transaction.type,
      units: transaction.units,
      nav: transaction.nav,
      amount: transaction.amount,
      transaction_date: transaction.date
    };

    const { error } = await client
      .from('transactions')
      .insert(dbTransaction);

    if (error) {
      console.error('Failed to add transaction:', error);
      return false;
    }

    console.log('✅ Transaction saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return false;
  }
};

/**
 * Load all transactions
 */
export const loadTransactions = async (): Promise<Transaction[] | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to load transactions:', error);
      return null;
    }

    const transactions: Transaction[] = (data as DBTransaction[]).map(t => ({
      id: t.id || '',
      fundId: t.fund_id,
      type: t.type,
      units: t.units,
      nav: t.nav,
      amount: t.amount,
      date: t.transaction_date
    }));

    return transactions;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return null;
  }
};

// ============================================================
// NAV HISTORY OPERATIONS
// ============================================================

/**
 * Save NAV history to Supabase
 */
export const saveNavHistory = async (fundId: number, amfiCode: string, history: NAVHistory[]): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) {
    return false;
  }

  try {
    const dbHistory: DBNavHistory[] = history.map(h => ({
      fund_id: fundId,
      amfi_code: amfiCode,
      nav: h.nav,
      nav_date: h.date
    }));

    // Use upsert to avoid duplicates
    const { error } = await client
      .from('nav_history')
      .upsert(dbHistory, { onConflict: 'fund_id,nav_date' });

    if (error) {
      console.error('Failed to save NAV history:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving NAV history:', error);
    return false;
  }
};

/**
 * Load NAV history from Supabase
 */
export const loadNavHistory = async (fundId: number, days: number = 365): Promise<NAVHistory[] | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('nav_history')
      .select('nav, nav_date')
      .eq('fund_id', fundId)
      .order('nav_date', { ascending: false })
      .limit(days);

    if (error) {
      console.error('Failed to load NAV history:', error);
      return null;
    }

    const history: NAVHistory[] = (data as { nav: number; nav_date: string }[]).map(h => ({
      nav: h.nav,
      date: h.nav_date
    }));

    return history;
  } catch (error) {
    console.error('Error loading NAV history:', error);
    return null;
  }
};

// ============================================================
// SETTINGS OPERATIONS
// ============================================================

/**
 * Save a setting
 */
export const saveSetting = async (key: string, value: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) {
    return false;
  }

  try {
    const { error } = await client
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      console.error('Failed to save setting:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving setting:', error);
    return false;
  }
};

/**
 * Load a setting
 */
export const loadSetting = async (key: string): Promise<string | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      return null;
    }

    return (data as DBSettings)?.value || null;
  } catch (error) {
    return null;
  }
};

// ============================================================
// BACKUP OPERATIONS
// ============================================================

/**
 * Create a full backup of all data
 */
export const createBackup = async (): Promise<object | null> => {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const [portfolio, transactions] = await Promise.all([
      loadPortfolio(),
      loadTransactions()
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      portfolio,
      transactions
    };

    // Save backup timestamp
    await saveSetting('last_backup', backup.timestamp);

    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};
