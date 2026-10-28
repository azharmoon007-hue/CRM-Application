CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(40) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    alternate_phone VARCHAR(50),
    website VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    annual_revenue NUMERIC(19, 2),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(30),
    status VARCHAR(30) NOT NULL,
    source VARCHAR(30) NOT NULL,
    assigned_to UUID REFERENCES users (id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users (id),
    updated_by UUID REFERENCES users (id)
);

CREATE UNIQUE INDEX uk_customers_email ON customers (LOWER(email));
CREATE INDEX idx_customers_status ON customers (status);
CREATE INDEX idx_customers_assigned_to ON customers (assigned_to);
CREATE INDEX idx_customers_company_name ON customers (company_name);
CREATE INDEX idx_customers_created_at ON customers (created_at);

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_code VARCHAR(40) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    job_title VARCHAR(100),
    primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_customer_id ON contacts (customer_id);
CREATE INDEX idx_contacts_email ON contacts (email);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_code VARCHAR(40) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    source VARCHAR(30) NOT NULL,
    industry VARCHAR(100),
    estimated_value NUMERIC(19, 2),
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(30) NOT NULL,
    assigned_to UUID REFERENCES users (id),
    expected_close_date DATE,
    description TEXT,
    converted_customer_id UUID REFERENCES customers (id),
    converted_deal_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_assigned_to ON leads (assigned_to);
CREATE INDEX idx_leads_email ON leads (email);
CREATE INDEX idx_leads_created_at ON leads (created_at);
