CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID NOT NULL REFERENCES pipelines (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sequence INTEGER NOT NULL,
    probability INTEGER NOT NULL,
    color VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pipeline_stages_pipeline_id ON pipeline_stages (pipeline_id);

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES customers (id),
    lead_id UUID REFERENCES leads (id),
    assigned_to UUID REFERENCES users (id),
    pipeline_id UUID NOT NULL REFERENCES pipelines (id),
    stage_id UUID NOT NULL REFERENCES pipeline_stages (id),
    amount NUMERIC(19, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    probability INTEGER NOT NULL DEFAULT 0,
    expected_close_date DATE,
    status VARCHAR(30) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deals_status ON deals (status);
CREATE INDEX idx_deals_assigned_to ON deals (assigned_to);
CREATE INDEX idx_deals_customer_id ON deals (customer_id);
CREATE INDEX idx_deals_pipeline_stage ON deals (pipeline_id, stage_id);
CREATE INDEX idx_deals_expected_close_date ON deals (expected_close_date);

ALTER TABLE leads
    ADD CONSTRAINT fk_leads_converted_deal FOREIGN KEY (converted_deal_id) REFERENCES deals (id);
