-- ============================================================
-- TIBA — Database Schema (PostgreSQL / Supabase)
-- Migration: 001_initial_schema
-- Date: 2026-03-18
-- Covers: All 6 Epics, 37 FRs, 14 tables
-- Conventions: snake_case tables/columns, singular names
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";       -- pgvector
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- trigram for fuzzy search

-- ============================================================
-- TABLE 1: user_profile — Profil Utilisateur B2C
-- FRs: FR17, FR18, FR20, FR21, FR36
-- ============================================================
CREATE TABLE user_profile (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number           TEXT UNIQUE NOT NULL,
  display_name           TEXT,
  plan_type              TEXT NOT NULL DEFAULT 'freemium'
                           CHECK (plan_type IN ('freemium', 'premium')),
  premium_expires_at     TIMESTAMPTZ,
  scan_count_month       INT NOT NULL DEFAULT 0,
  scan_month_reset       DATE NOT NULL DEFAULT CURRENT_DATE,
  onboarding_completed   BOOLEAN NOT NULL DEFAULT FALSE,
  disclaimer_accepted    BOOLEAN NOT NULL DEFAULT FALSE,
  disclaimer_accepted_at TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profile_phone ON user_profile (phone_number);
CREATE INDEX idx_user_profile_plan  ON user_profile (plan_type);

-- ============================================================
-- TABLE 2: admin_user — Opérateur Admin B2B
-- FRs: FR29, Epic 4, Story 6.3
-- ============================================================
CREATE TABLE admin_user (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'operator'
                  CHECK (role IN ('operator', 'analytics', 'super_admin')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: medication — Fiche Médicament
-- FRs: FR1, FR2, FR3, FR4, FR29, FR31
-- ============================================================
CREATE TABLE medication (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  barcode               TEXT UNIQUE,
  therapeutic_category  TEXT,
  notice_text           TEXT,                  -- texte brut complet de la notice
  notice_source         TEXT NOT NULL,         -- URL ou référence officielle
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  version               INT NOT NULL DEFAULT 1,
  created_by            UUID REFERENCES admin_user(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medication_barcode ON medication (barcode);
CREATE INDEX idx_medication_name    ON medication USING gin (name gin_trgm_ops);
CREATE INDEX idx_medication_active  ON medication (is_active);

-- ============================================================
-- TABLE 4: medication_photo — Photos Boîte Médicament
-- FRs: FR30 (photos produit)
-- ============================================================
CREATE TABLE medication_photo (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id   UUID NOT NULL REFERENCES medication(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  thumbnail_path  TEXT,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medication_photo_medication ON medication_photo (medication_id);

-- ============================================================
-- TABLE 5: notice_chunk — Chunks Vectorisés de la Notice (pgvector)
-- FRs: FR8 (RAG Strict), FR22 (ingestion), FR31 (update)
-- ============================================================
CREATE TABLE notice_chunk (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id   UUID NOT NULL REFERENCES medication(id) ON DELETE CASCADE,
  chunk_index     INT NOT NULL,
  content         TEXT NOT NULL,
  embedding       vector(1536) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notice_chunk_medication ON notice_chunk (medication_id);
CREATE INDEX idx_notice_chunk_embedding  ON notice_chunk
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- TABLE 6: pharmacy — Pharmacie Partenaire (PostGIS)
-- FRs: FR13 (GPS), FR14 (itinéraire), FR15 (cache)
-- ============================================================
CREATE TABLE pharmacy (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  district    TEXT,
  phone       TEXT,
  location    geography(POINT, 4326) NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pharmacy_location ON pharmacy USING GIST (location);
CREATE INDEX idx_pharmacy_city     ON pharmacy (city);
CREATE INDEX idx_pharmacy_active   ON pharmacy (is_active);

-- ============================================================
-- TABLE 7: pharmacy_schedule — Horaires de Garde
-- FRs: FR30b, FR13
-- ============================================================
CREATE TABLE pharmacy_schedule (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id   UUID NOT NULL REFERENCES pharmacy(id) ON DELETE CASCADE,
  guard_date    DATE NOT NULL,
  start_time    TIME NOT NULL DEFAULT '00:00',
  end_time      TIME NOT NULL DEFAULT '23:59',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX  idx_pharmacy_schedule_date     ON pharmacy_schedule (guard_date);
CREATE INDEX  idx_pharmacy_schedule_pharmacy ON pharmacy_schedule (pharmacy_id);
CREATE UNIQUE INDEX idx_pharmacy_schedule_unique
  ON pharmacy_schedule (pharmacy_id, guard_date);

-- ============================================================
-- TABLE 8: pharmacy_stock — Disponibilité Médicaments en Pharmacie
-- FRs: FR30b (disponibilité), FR16 (suggestion post-scan)
-- ============================================================
CREATE TABLE pharmacy_stock (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacy(id) ON DELETE CASCADE,
  medication_id   UUID NOT NULL REFERENCES medication(id) ON DELETE CASCADE,
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_pharmacy_stock_unique
  ON pharmacy_stock (pharmacy_id, medication_id);

-- ============================================================
-- TABLE 9: ai_audit_log — Journal Immuable des Interactions IA
-- FRs: FR24 (journalisation), NFR8 (24 mois, immuable)
-- ⚠️ INSERT ONLY — no UPDATE or DELETE via RLS
-- ============================================================
CREATE TABLE ai_audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_hash       TEXT NOT NULL,
  medication_id   UUID REFERENCES medication(id),
  query_text      TEXT NOT NULL,
  response_text   TEXT,
  context_patient JSONB,
  was_blocked     BOOLEAN NOT NULL DEFAULT FALSE,
  block_reason    TEXT,
  source_type     TEXT NOT NULL CHECK (source_type IN ('text', 'voice')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_audit_log_user       ON ai_audit_log (user_hash);
CREATE INDEX idx_ai_audit_log_medication ON ai_audit_log (medication_id);
CREATE INDEX idx_ai_audit_log_blocked    ON ai_audit_log (was_blocked)
  WHERE was_blocked = TRUE;
CREATE INDEX idx_ai_audit_log_date       ON ai_audit_log (created_at);

-- ============================================================
-- TABLE 10: user_report — Signalements Utilisateur
-- FRs: FR37 (signalement)
-- ============================================================
CREATE TABLE user_report (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_log_id  UUID NOT NULL REFERENCES ai_audit_log(id),
  user_id       UUID NOT NULL REFERENCES user_profile(id),
  reason        TEXT NOT NULL CHECK (reason IN ('incorrect', 'dangerous', 'other')),
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'reviewed', 'resolved')),
  reviewed_by   UUID REFERENCES admin_user(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);

CREATE INDEX idx_user_report_status ON user_report (status);

-- ============================================================
-- TABLE 11: payment — Transactions Mobile Money
-- FRs: FR19 (Mobile Money), FR35 (historique)
-- ============================================================
CREATE TABLE payment (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES user_profile(id),
  amount        DECIMAL(10, 2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'XAF',
  operator      TEXT NOT NULL CHECK (operator IN ('orange', 'airtel', 'moov')),
  phone_number  TEXT NOT NULL,
  external_ref  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  period_start  DATE,
  period_end    DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_user   ON payment (user_id);
CREATE INDEX idx_payment_status ON payment (status);
CREATE INDEX idx_payment_date   ON payment (created_at);

-- ============================================================
-- TABLE 12: scan_history — Historique des Scans Utilisateur
-- FRs: FR1, FR2, FR18 (compteur quota)
-- ============================================================
CREATE TABLE scan_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profile(id),
  medication_id   UUID NOT NULL REFERENCES medication(id),
  scan_type       TEXT NOT NULL CHECK (scan_type IN ('barcode', 'ocr')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scan_history_user ON scan_history (user_id);
CREATE INDEX idx_scan_history_date ON scan_history (created_at);

-- ============================================================
-- TABLE 13: anonymous_scan_event — Données Anonymisées B2B
-- FRs: FR23 (anonymisation), NFR9 (irréversible)
-- ⚠️ INSERT ONLY via service_role — jamais de données personnelles
-- ============================================================
CREATE TABLE anonymous_scan_event (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_hash       TEXT NOT NULL,
  medication_id   UUID NOT NULL REFERENCES medication(id),
  zone_id         TEXT NOT NULL,
  patient_type    TEXT CHECK (patient_type IN ('adult', 'child')),
  scan_type       TEXT NOT NULL CHECK (scan_type IN ('barcode', 'ocr')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_anonymous_scan_event_zone       ON anonymous_scan_event (zone_id);
CREATE INDEX idx_anonymous_scan_event_medication ON anonymous_scan_event (medication_id);
CREATE INDEX idx_anonymous_scan_event_date       ON anonymous_scan_event (created_at);

-- ============================================================
-- TABLE 14: aggregated_scan_metric — Métriques Agrégées B2B
-- FRs: FR26, FR27, FR28, NFR21
-- ============================================================
CREATE TABLE aggregated_scan_metric (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id         TEXT NOT NULL,
  medication_id   UUID NOT NULL REFERENCES medication(id),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  period_type     TEXT NOT NULL CHECK (period_type IN ('day', 'week', 'month')),
  scan_count      INT NOT NULL DEFAULT 0,
  unique_scanners INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_aggregated_metric_unique
  ON aggregated_scan_metric (zone_id, medication_id, period_start, period_type);
CREATE INDEX idx_aggregated_metric_zone ON aggregated_scan_metric (zone_id);
CREATE INDEX idx_aggregated_metric_date ON aggregated_scan_metric (period_start);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user            ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication            ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_photo      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_chunk          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy              ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_schedule     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_stock        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_report           ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment               ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history          ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_scan_event  ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_scan_metric ENABLE ROW LEVEL SECURITY;

-- user_profile: users can only see/edit their own profile
CREATE POLICY "user_profile_select_own" ON user_profile
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_profile_update_own" ON user_profile
  FOR UPDATE USING (auth.uid() = id);

-- medication: public read, admin write
CREATE POLICY "medication_select_all" ON medication
  FOR SELECT USING (TRUE);
CREATE POLICY "medication_insert_admin" ON medication
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );
CREATE POLICY "medication_update_admin" ON medication
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- medication_photo: public read, admin write
CREATE POLICY "medication_photo_select_all" ON medication_photo
  FOR SELECT USING (TRUE);
CREATE POLICY "medication_photo_insert_admin" ON medication_photo
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- notice_chunk: public read (needed for RAG), admin write
CREATE POLICY "notice_chunk_select_all" ON notice_chunk
  FOR SELECT USING (TRUE);
CREATE POLICY "notice_chunk_insert_admin" ON notice_chunk
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- pharmacy: public read, admin write
CREATE POLICY "pharmacy_select_all" ON pharmacy
  FOR SELECT USING (TRUE);
CREATE POLICY "pharmacy_insert_admin" ON pharmacy
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );
CREATE POLICY "pharmacy_update_admin" ON pharmacy
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- pharmacy_schedule: public read, admin write
CREATE POLICY "pharmacy_schedule_select_all" ON pharmacy_schedule
  FOR SELECT USING (TRUE);
CREATE POLICY "pharmacy_schedule_insert_admin" ON pharmacy_schedule
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );
CREATE POLICY "pharmacy_schedule_update_admin" ON pharmacy_schedule
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- pharmacy_stock: public read, admin write
CREATE POLICY "pharmacy_stock_select_all" ON pharmacy_stock
  FOR SELECT USING (TRUE);
CREATE POLICY "pharmacy_stock_insert_admin" ON pharmacy_stock
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );
CREATE POLICY "pharmacy_stock_update_admin" ON pharmacy_stock
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- ai_audit_log: INSERT ONLY via service_role (immutable)
-- No user-facing policies (Edge Functions use service_role key)
CREATE POLICY "ai_audit_log_service_insert" ON ai_audit_log
  FOR INSERT WITH CHECK (TRUE);  -- Edge Function via service_role
-- No SELECT policy for regular users
-- Admin can read via service_role or dedicated admin policy
CREATE POLICY "ai_audit_log_admin_select" ON ai_audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- user_report: users insert own, admins read all
CREATE POLICY "user_report_insert_own" ON user_report
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_report_select_admin" ON user_report
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND is_active = TRUE)
  );

-- payment: users see own payments
CREATE POLICY "payment_select_own" ON payment
  FOR SELECT USING (auth.uid() = user_id);

-- scan_history: users see own history
CREATE POLICY "scan_history_select_own" ON scan_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scan_history_insert_own" ON scan_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- anonymous_scan_event: service_role only (no user access)
-- No policies for regular users

-- aggregated_scan_metric: analytics role only
CREATE POLICY "aggregated_metric_select_analytics" ON aggregated_scan_metric
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_user WHERE id = auth.uid() AND role IN ('analytics', 'super_admin'))
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER trg_user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_medication_updated_at
  BEFORE UPDATE ON medication
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pharmacy_updated_at
  BEFORE UPDATE ON pharmacy
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pharmacy_stock_updated_at
  BEFORE UPDATE ON pharmacy_stock
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_payment_updated_at
  BEFORE UPDATE ON payment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_admin_user_updated_at
  BEFORE UPDATE ON admin_user
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- COMMENTS (documentation interne)
-- ============================================================
COMMENT ON TABLE user_profile IS 'Profil utilisateur B2C (Freemium/Premium)';
COMMENT ON TABLE admin_user IS 'Opérateur administrateur du Web Dashboard';
COMMENT ON TABLE medication IS 'Fiche médicament avec notice certifiée';
COMMENT ON TABLE medication_photo IS 'Photos des boîtes de médicaments (Supabase Storage)';
COMMENT ON TABLE notice_chunk IS 'Chunks vectorisés pgvector pour RAG Strict (temp 0.0)';
COMMENT ON TABLE pharmacy IS 'Pharmacie partenaire avec coordonnées PostGIS';
COMMENT ON TABLE pharmacy_schedule IS 'Calendrier de garde des pharmacies';
COMMENT ON TABLE pharmacy_stock IS 'Disponibilité médicaments par pharmacie';
COMMENT ON TABLE ai_audit_log IS 'Journal immuable des interactions IA (INSERT ONLY, rétention 24 mois)';
COMMENT ON TABLE user_report IS 'Signalements utilisateur sur les réponses IA';
COMMENT ON TABLE payment IS 'Transactions Mobile Money (Orange, Airtel, Moov)';
COMMENT ON TABLE scan_history IS 'Historique des scans utilisateur (barcode/OCR)';
COMMENT ON TABLE anonymous_scan_event IS 'Données de scan anonymisées irréversiblement pour B2B';
COMMENT ON TABLE aggregated_scan_metric IS 'Métriques agrégées par zone/période pour dashboard B2B';
