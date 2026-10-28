CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    customer_id UUID REFERENCES customers (id),
    lead_id UUID REFERENCES leads (id),
    deal_id UUID REFERENCES deals (id),
    assigned_to UUID REFERENCES users (id),
    due_date TIMESTAMPTZ,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    priority VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_assigned_to ON activities (assigned_to);
CREATE INDEX idx_activities_status ON activities (status);
CREATE INDEX idx_activities_due_date ON activities (due_date);
CREATE INDEX idx_activities_customer_id ON activities (customer_id);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users (id),
    customer_id UUID REFERENCES customers (id),
    lead_id UUID REFERENCES leads (id),
    deal_id UUID REFERENCES deals (id),
    priority VARCHAR(30) NOT NULL,
    due_date TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL,
    reminder_at TIMESTAMPTZ,
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned_to ON tasks (assigned_to);
CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    customer_id UUID REFERENCES customers (id),
    lead_id UUID REFERENCES leads (id),
    deal_id UUID REFERENCES deals (id),
    contact_id UUID REFERENCES contacts (id),
    created_by UUID REFERENCES users (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_customer_id ON notes (customer_id);
CREATE INDEX idx_notes_lead_id ON notes (lead_id);
CREATE INDEX idx_notes_deal_id ON notes (deal_id);

CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    cc VARCHAR(500),
    bcc VARCHAR(500),
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    customer_id UUID REFERENCES customers (id),
    lead_id UUID REFERENCES leads (id),
    deal_id UUID REFERENCES deals (id),
    template_id UUID REFERENCES email_templates (id),
    sent_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emails_customer_id ON emails (customer_id);
CREATE INDEX idx_emails_lead_id ON emails (lead_id);
CREATE INDEX idx_emails_status ON emails (status);
