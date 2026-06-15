-- ============================================================
-- FRICAL Corporate — Content Tables + Seed Data
-- Ejecutar en Supabase → SQL Editor (una sola vez)
-- ============================================================

-- 1. SITE_CONTENT: textos/títulos editables (key-value)
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTACT_INFO: datos de la empresa (una sola fila)
CREATE TABLE IF NOT EXISTS contact_info (
  id           INT PRIMARY KEY DEFAULT 1,
  empresa      TEXT DEFAULT '',
  cif          TEXT DEFAULT '',
  direccion    TEXT DEFAULT '',
  telefono     TEXT DEFAULT '',
  telefono2    TEXT DEFAULT '',
  whatsapp     TEXT DEFAULT '',
  whatsapp_msg TEXT DEFAULT '',
  email        TEXT DEFAULT '',
  email_ruben  TEXT DEFAULT '',
  email_sergio TEXT DEFAULT '',
  horario      TEXT DEFAULT '',
  zona         TEXT DEFAULT '',
  instagram    TEXT DEFAULT '',
  linkedin     TEXT DEFAULT '',
  tiktok       TEXT DEFAULT '',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id          TEXT PRIMARY KEY,
  titulo      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  enlace      TEXT DEFAULT '',
  destacado   BOOLEAN DEFAULT FALSE,
  orden       INT DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SECTORS
CREATE TABLE IF NOT EXISTS sectors (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  orden       INT DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  imagen      TEXT DEFAULT '',
  titulo      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  categorias  TEXT[] DEFAULT '{}',
  fecha_dia   INT,
  fecha_mes   INT,
  fecha_anyo  INT,
  gradiente   TEXT DEFAULT '',
  acento      TEXT DEFAULT '',
  orden       INT DEFAULT 0,
  activo      BOOLEAN DEFAULT TRUE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. UPCOMING_PROJECTS
CREATE TABLE IF NOT EXISTS upcoming_projects (
  id          TEXT PRIMARY KEY,
  imagen      TEXT DEFAULT '',
  titulo      TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  categorias  TEXT[] DEFAULT '{}',
  gradiente   TEXT DEFAULT '',
  orden       INT DEFAULT 0,
  activo      BOOLEAN DEFAULT TRUE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  iniciales  TEXT DEFAULT '',
  nombre     TEXT NOT NULL,
  cargo      TEXT DEFAULT '',
  cita       TEXT NOT NULL,
  orden      INT DEFAULT 0,
  activo     BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Añadir columnas a tablas existentes (seguro si ya existen)
ALTER TABLE messages              ADD COLUMN IF NOT EXISTS leido   BOOLEAN DEFAULT FALSE;
ALTER TABLE messages              ADD COLUMN IF NOT EXISTS empresa TEXT    DEFAULT '';
ALTER TABLE applications          ADD COLUMN IF NOT EXISTS leido   BOOLEAN DEFAULT FALSE;
ALTER TABLE configurator_requests ADD COLUMN IF NOT EXISTS leido   BOOLEAN DEFAULT FALSE;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE site_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_requests ENABLE ROW LEVEL SECURITY;

-- Tablas de contenido: anon puede leer, authenticated tiene acceso total
DO $$ BEGIN
  CREATE POLICY "pub_select_site_content"  ON site_content      FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_site_content"    ON site_content      FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_contact_info"  ON contact_info      FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_contact_info"    ON contact_info      FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_services"      ON services          FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_services"        ON services          FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_sectors"       ON sectors           FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_sectors"         ON sectors           FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_projects"      ON projects          FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_projects"        ON projects          FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_upcoming"      ON upcoming_projects FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_upcoming"        ON upcoming_projects FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pub_select_testimonials"  ON testimonials      FOR SELECT USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_all_testimonials"    ON testimonials      FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Bandejas de entrada: solo autenticados pueden leer y actualizar estado
DO $$ BEGIN
  CREATE POLICY "auth_select_messages"     ON messages          FOR SELECT TO authenticated USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_update_messages"     ON messages          FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_select_applications" ON applications      FOR SELECT TO authenticated USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_update_applications" ON applications      FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_select_configurator" ON configurator_requests FOR SELECT TO authenticated USING (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "auth_update_configurator" ON configurator_requests FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO contact_info
  (id, empresa, cif, direccion, telefono, telefono2, whatsapp, whatsapp_msg,
   email, email_ruben, email_sergio, horario, zona, instagram, linkedin, tiktok)
VALUES (
  1,
  'FRICAL CALORIFUGADOS, S.L.',
  'B98127855',
  'C/ Jocs Florals, 1-3, 08950 Esplugues de Llobregat (Barcelona)',
  '673 177 887', '672 629 743', '+34673177887',
  'Hola, me gustaría solicitar información sobre vuestros servicios de aislamiento.',
  'info@fricalcalorifugados.com',
  'r.perez@fricalcalorifugados.com',
  's.perez@fricalcalorifugados.com',
  'Lunes a Viernes: 8:00 – 18:00',
  'Barcelona y área metropolitana · Cataluña',
  'https://instagram.com/frical_calorifugados',
  'https://www.linkedin.com/company/frical-calorifugados',
  'https://www.tiktok.com/@frical_calorifugados'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, titulo, descripcion, enlace, destacado, orden) VALUES
  ('aislamiento', 'Aislamiento y Calorifugado',
   'Nuestra especialidad. Calorifugado de tuberías, depósitos, calderas y equipos industriales con los materiales más adecuados para cada aplicación: lana de roca, espuma elastomérica, poliuretano inyectado. Acabado en aluminio, inoxidable o chapa lacada.',
   '/servicios/aislamiento-y-calorifugado', TRUE, 1),
  ('conductos', 'Conductos de Ventilación',
   'Fabricación y montaje de redes de conductos en chapa galvanizada o inoxidable para extracción, ventilación y climatización industrial. Proyectos llave en mano: difusores, rejillas, compuertas cortafuego y equipos de impulsión incluidos.',
   '/servicios/conductos', FALSE, 2),
  ('climatizacion', 'Climatización Industrial',
   'Diseño, instalación y mantenimiento de sistemas HVAC para industria, naves logísticas, locales comerciales y oficinas. Adaptamos cada proyecto a las exigencias técnicas y normativas de cada sector, con garantía posventa.',
   '/servicios/climatizacion', FALSE, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sectors (id, nombre, descripcion, orden) VALUES
  ('quimico',      'Químico',       'Plantas de proceso y reactores', 1),
  ('alimentario',  'Alimentario',   'Producción y conservación',      2),
  ('energetico',   'Energético',    'Generación y distribución',      3),
  ('naval',        'Naval',         'Astilleros y embarcaciones',     4),
  ('farmaceutico', 'Farmacéutico',  'GMP y salas blancas',            5),
  ('edificacion',  'Edificación',   'Oficinas y logística',           6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects
  (imagen, titulo, descripcion, categorias, fecha_dia, fecha_mes, fecha_anyo, gradiente, acento, orden)
VALUES
  ('/proyectos/proyecto-01-conductos-alimentaria.jpg',
   'Red de conductos industria alimentaria',
   'Fabricación e instalación de conductos galvanizados para ventilación y extracción de vapores en planta de producción alimentaria de 3.200 m². Cumplimiento normativa HACCP y clase de estanqueidad B.',
   ARRAY['Conductos'], 14, 3, 2024,
   'linear-gradient(145deg, #0d1f2e 0%, #07131e 55%, #020a12 100%)',
   'rgba(65, 140, 200, 0.18)', 1),
  ('/proyectos/proyecto-02-calorifugado-reactores.jpg',
   'Calorifugado de reactores — Barcelona',
   'Calorifugado de 8 reactores de proceso con lana de roca de alta densidad (150 kg/m³) y acabado en aluminio estucado. Temperatura de trabajo entre 200 °C y 350 °C. Planta química en el área metropolitana.',
   ARRAY['Aislamiento'], 22, 11, 2023,
   'linear-gradient(145deg, #1e1008 0%, #120a04 55%, #080402 100%)',
   'rgba(200, 100, 30, 0.18)', 2),
  ('/proyectos/proyecto-03-trazado-farmaceutica.jpg',
   'Trazado eléctrico — Planta farmacéutica',
   'Instalación de trazado eléctrico en tuberías de proceso para mantenimiento de temperatura crítica en planta farmacéutica en el área de Barcelona. Sistema de control SCADA integrado y documentación ATEX.',
   ARRAY['Aislamiento'], 5, 7, 2024,
   'linear-gradient(145deg, #10101e 0%, #0a0a14 55%, #050508 100%)',
   'rgba(100, 80, 200, 0.18)', 3),
  ('/proyectos/proyecto-04-conductos-logistica.jpg',
   'Conductos impulsión/retorno en cubierta',
   'Montaje de red de conductos de impulsión y retorno en cubierta de nave logística de 8.000 m². Chapa galvanizada con aislamiento exterior de lana de vidrio y acabado protector de aluminio.',
   ARRAY['Conductos', 'Aislamiento'], 18, 2, 2024,
   'linear-gradient(145deg, #0a1808 0%, #050f04 55%, #020802 100%)',
   'rgba(80, 180, 60, 0.18)', 4),
  ('/proyectos/proyecto-05-aislamiento-naval.jpg',
   'Aislamiento depósitos — Sector naval',
   'Aislamiento térmico de depósitos de almacenamiento en astillero de Tarragona. Proyección de espuma de poliuretano de alta densidad con acabado en chapa inoxidable AISI 304.',
   ARRAY['Aislamiento'], 9, 9, 2023,
   'linear-gradient(145deg, #080a1e 0%, #050614 55%, #020309 100%)',
   'rgba(50, 80, 200, 0.18)', 5),
  ('/proyectos/proyecto-06-climatizacion-vrf.jpg',
   'Climatización VRF — Sede corporativa',
   'Diseño e instalación de sistema de climatización VRF para sede corporativa de 2.400 m² en Barcelona. Unidades exteriores en cubierta con distribución de conductos integrada en falso techo técnico.',
   ARRAY['Climatización'], 3, 5, 2024,
   'linear-gradient(145deg, #071818 0%, #040e0e 55%, #020808 100%)',
   'rgba(30, 160, 160, 0.18)', 6);

INSERT INTO upcoming_projects (id, imagen, titulo, descripcion, categorias, gradiente, orden) VALUES
  ('prx-1', '/proyectos/proximamente/prx-01-petroquimica.jpg',
   'Aislamiento planta petroquímica',
   'Calorifugado completo de tuberías de proceso y reactores. Alta temperatura, acabado inoxidable AISI 316.',
   ARRAY['Aislamiento'], 'linear-gradient(145deg, #1a0e04 0%, #100804 55%, #060402 100%)', 1),
  ('prx-2', '/proyectos/proximamente/prx-02-hospital.jpg',
   'Red de conductos — Hospital',
   'Fabricación y montaje de conductos galvanizados para ventilación en edificio hospitalario. Clase estanqueidad C.',
   ARRAY['Conductos'], 'linear-gradient(145deg, #08101a 0%, #050a12 55%, #02060a 100%)', 2),
  ('prx-3', '/proyectos/proximamente/prx-03-logistica.jpg',
   'Climatización nave logística',
   'Instalación VRF y climatizadoras de techo para nave de distribución de 12.000 m² en el área metropolitana.',
   ARRAY['Climatización'], 'linear-gradient(145deg, #081808 0%, #050e05 55%, #020802 100%)', 3),
  ('prx-4', '/proyectos/proximamente/prx-04-alimentacion.jpg',
   'Calorifugado industria alimentaria',
   'Aislamiento de líneas de proceso con acabado en inoxidable AISI 316. Cumplimiento normativa HACCP y EHEDG.',
   ARRAY['Aislamiento'], 'linear-gradient(145deg, #181208 0%, #100c05 55%, #080602 100%)', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (iniciales, nombre, cargo, cita, orden) VALUES
  ('JM', 'Jordi Mas',     'Jefe de Mantenimiento · Industria Química',
   'FRICAL lleva años siendo nuestro proveedor de referencia en aislamiento industrial. Su equipo conoce la planta mejor que nadie y siempre cumple con los plazos, incluso en paradas técnicas de emergencia. Calidad y fiabilidad garantizadas.', 1),
  ('MR', 'Mireia Roca',   'Responsable de Instalaciones · Sector Alimentario',
   'La renovación completa de nuestros conductos de ventilación superó todas las expectativas. El acabado es impecable, el trato muy profesional y la documentación técnica entregada ha sido perfecta para nuestras auditorías HACCP.', 2),
  ('AP', 'Antoni Puig',   'Director Técnico · Promotora Inmobiliaria',
   'Para los sistemas de climatización de nuestros proyectos de oficinas siempre llamamos a FRICAL. Precio ajustado, soluciones a medida y una garantía posventa que realmente funciona. No necesitamos a nadie más.', 3);
