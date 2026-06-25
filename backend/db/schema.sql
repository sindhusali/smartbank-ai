CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(20) CHECK (account_type IN ('savings','current')),
  balance NUMERIC(15,2) DEFAULT 0.00,
  is_frozen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_account_id UUID REFERENCES accounts(id),
  receiver_account_id UUID REFERENCES accounts(id),
  amount NUMERIC(15,2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('deposit','withdrawal','transfer')),
  status VARCHAR(20) DEFAULT 'completed',
  fraud_score NUMERIC(4,3),
  flagged BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  risk_score NUMERIC(4,3),
  reasons TEXT[],
  ai_explanation TEXT,
  resolved_by UUID,
  flagged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  code_hash TEXT NOT NULL,
  purpose VARCHAR(30),
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP
);