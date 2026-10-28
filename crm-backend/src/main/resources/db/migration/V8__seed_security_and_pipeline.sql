INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'Full unrestricted access'),
    ('ADMIN', 'Administrative access across the CRM'),
    ('SALES_MANAGER', 'Manages a sales team and pipeline'),
    ('SALES_REP', 'Owns assigned leads, customers and deals'),
    ('SUPPORT_AGENT', 'Customer support and activity tracking'),
    ('MARKETING_USER', 'Lead generation and campaign tracking'),
    ('VIEWER', 'Read-only access');

INSERT INTO permissions (name, description) VALUES
    ('CUSTOMER_VIEW', 'View customers'),
    ('CUSTOMER_CREATE', 'Create customers'),
    ('CUSTOMER_UPDATE', 'Update customers'),
    ('CUSTOMER_DELETE', 'Delete customers'),
    ('LEAD_VIEW', 'View leads'),
    ('LEAD_CREATE', 'Create leads'),
    ('LEAD_UPDATE', 'Update leads'),
    ('LEAD_DELETE', 'Delete leads'),
    ('DEAL_VIEW', 'View deals'),
    ('DEAL_CREATE', 'Create deals'),
    ('DEAL_UPDATE', 'Update deals'),
    ('DEAL_DELETE', 'Delete deals'),
    ('CONTACT_VIEW', 'View contacts'),
    ('CONTACT_CREATE', 'Create contacts'),
    ('CONTACT_UPDATE', 'Update contacts'),
    ('CONTACT_DELETE', 'Delete contacts'),
    ('ACTIVITY_VIEW', 'View activities'),
    ('ACTIVITY_CREATE', 'Create activities'),
    ('ACTIVITY_UPDATE', 'Update activities'),
    ('ACTIVITY_DELETE', 'Delete activities'),
    ('TASK_VIEW', 'View tasks'),
    ('TASK_CREATE', 'Create tasks'),
    ('TASK_UPDATE', 'Update tasks'),
    ('TASK_DELETE', 'Delete tasks'),
    ('NOTE_VIEW', 'View notes'),
    ('NOTE_CREATE', 'Create notes'),
    ('NOTE_UPDATE', 'Update notes'),
    ('NOTE_DELETE', 'Delete notes'),
    ('PIPELINE_VIEW', 'View pipelines'),
    ('PIPELINE_CREATE', 'Create pipelines'),
    ('PIPELINE_UPDATE', 'Update pipelines'),
    ('PIPELINE_DELETE', 'Delete pipelines'),
    ('REPORT_VIEW', 'View reports'),
    ('REPORT_EXPORT', 'Export reports'),
    ('USER_MANAGE', 'Manage users'),
    ('AUDIT_VIEW', 'View audit logs'),
    ('DASHBOARD_VIEW', 'View dashboard'),
    ('NOTIFICATION_VIEW', 'View notifications'),
    ('FILE_UPLOAD', 'Upload files'),
    ('FILE_DELETE', 'Delete files'),
    ('EMAIL_SEND', 'Send emails'),
    ('EMAIL_VIEW', 'View emails'),
    ('SEARCH_VIEW', 'Use global search');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name IN ('SUPER_ADMIN', 'ADMIN');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'CUSTOMER_VIEW', 'CUSTOMER_CREATE', 'CUSTOMER_UPDATE',
    'LEAD_VIEW', 'LEAD_CREATE', 'LEAD_UPDATE', 'LEAD_DELETE',
    'DEAL_VIEW', 'DEAL_CREATE', 'DEAL_UPDATE', 'DEAL_DELETE',
    'CONTACT_VIEW', 'CONTACT_CREATE', 'CONTACT_UPDATE',
    'ACTIVITY_VIEW', 'ACTIVITY_CREATE', 'ACTIVITY_UPDATE', 'ACTIVITY_DELETE',
    'TASK_VIEW', 'TASK_CREATE', 'TASK_UPDATE', 'TASK_DELETE',
    'NOTE_VIEW', 'NOTE_CREATE', 'NOTE_UPDATE', 'NOTE_DELETE',
    'PIPELINE_VIEW',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'DASHBOARD_VIEW', 'NOTIFICATION_VIEW',
    'FILE_UPLOAD', 'FILE_DELETE',
    'EMAIL_SEND', 'EMAIL_VIEW',
    'SEARCH_VIEW'
)
WHERE r.name = 'SALES_MANAGER';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'CUSTOMER_VIEW', 'CUSTOMER_CREATE', 'CUSTOMER_UPDATE',
    'LEAD_VIEW', 'LEAD_CREATE', 'LEAD_UPDATE',
    'DEAL_VIEW', 'DEAL_CREATE', 'DEAL_UPDATE',
    'CONTACT_VIEW', 'CONTACT_CREATE', 'CONTACT_UPDATE',
    'ACTIVITY_VIEW', 'ACTIVITY_CREATE', 'ACTIVITY_UPDATE',
    'TASK_VIEW', 'TASK_CREATE', 'TASK_UPDATE',
    'NOTE_VIEW', 'NOTE_CREATE', 'NOTE_UPDATE',
    'PIPELINE_VIEW',
    'DASHBOARD_VIEW', 'NOTIFICATION_VIEW',
    'FILE_UPLOAD',
    'EMAIL_SEND', 'EMAIL_VIEW',
    'SEARCH_VIEW'
)
WHERE r.name = 'SALES_REP';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'CUSTOMER_VIEW', 'CUSTOMER_UPDATE',
    'CONTACT_VIEW', 'CONTACT_UPDATE',
    'ACTIVITY_VIEW', 'ACTIVITY_CREATE', 'ACTIVITY_UPDATE',
    'TASK_VIEW', 'TASK_CREATE', 'TASK_UPDATE',
    'NOTE_VIEW', 'NOTE_CREATE', 'NOTE_UPDATE',
    'DASHBOARD_VIEW', 'NOTIFICATION_VIEW',
    'FILE_UPLOAD',
    'EMAIL_SEND', 'EMAIL_VIEW',
    'SEARCH_VIEW'
)
WHERE r.name = 'SUPPORT_AGENT';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'CUSTOMER_VIEW',
    'LEAD_VIEW', 'LEAD_CREATE', 'LEAD_UPDATE',
    'CONTACT_VIEW',
    'ACTIVITY_VIEW', 'ACTIVITY_CREATE',
    'NOTE_VIEW', 'NOTE_CREATE',
    'REPORT_VIEW',
    'DASHBOARD_VIEW', 'NOTIFICATION_VIEW',
    'EMAIL_VIEW',
    'SEARCH_VIEW'
)
WHERE r.name = 'MARKETING_USER';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name LIKE '%_VIEW'
WHERE r.name = 'VIEWER';

INSERT INTO pipelines (name, description, active)
VALUES ('Default Sales Pipeline', 'Standard B2B sales process', TRUE);

INSERT INTO pipeline_stages (pipeline_id, name, sequence, probability, color, active)
SELECT p.id, stage.name, stage.seq, stage.prob, stage.color, TRUE
FROM pipelines p
CROSS JOIN (
    VALUES
        ('LEAD', 1, 10, '#6B7280'),
        ('QUALIFICATION', 2, 25, '#3B82F6'),
        ('PROPOSAL', 3, 50, '#8B5CF6'),
        ('NEGOTIATION', 4, 75, '#F59E0B'),
        ('CLOSED_WON', 5, 100, '#10B981'),
        ('CLOSED_LOST', 6, 0, '#EF4444')
) AS stage(name, seq, prob, color)
WHERE p.name = 'Default Sales Pipeline';

INSERT INTO email_templates (name, subject, body, active)
VALUES
    ('Welcome', 'Welcome to our CRM', 'Hello {{name}}, welcome aboard.', TRUE),
    ('Follow Up', 'Following up', 'Hello {{name}}, I wanted to follow up on our last conversation.', TRUE);
