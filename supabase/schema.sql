-- ============================================================
-- FRICAL CALORIFUGADOS -- Schema Supabase -- Fase 2
-- Region: West EU (Paris)
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================


-- ------------------------------------------------------------
-- 1. TABLAS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden       INTEGER NOT NULL DEFAULT 0,
  slug        TEXT NOT NULL UNIQUE,
  titulo      TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  enlace      TEXT NOT NULL DEFAULT '',
  destacado   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden       INTEGER NOT NULL DEFAULT 0,
  slug        TEXT NOT NULL UNIQUE,
  imagen_url  TEXT NOT NULL DEFAULT '',
  titulo      TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  categorias  TEXT[] NOT NULL DEFAULT '{}',
  fecha_dia   INTEGER,
  fecha_mes   INTEGER,
  fecha_anyo  INTEGER,
  gradiente   TEXT NOT NULL DEFAULT '',
  acento      TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upcoming_projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden       INTEGER NOT NULL DEFAULT 0,
  slug        TEXT NOT NULL UNIQUE,
  imagen_url  TEXT NOT NULL DEFAULT '',
  titulo      TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  categorias  TEXT[] NOT NULL DEFAULT '{}',
  gradiente   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sectors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  nombre      TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  orden       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden      INTEGER NOT NULL DEFAULT 0,
  iniciales  TEXT NOT NULL DEFAULT '',
  nombre     TEXT NOT NULL DEFAULT '',
  cargo      TEXT NOT NULL DEFAULT '',
  cita       TEXT NOT NULL DEFAULT '',
  visible    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_info (
  id           TEXT PRIMARY KEY DEFAULT 'main',
  empresa      TEXT NOT NULL DEFAULT '',
  cif          TEXT NOT NULL DEFAULT '',
  direccion    TEXT NOT NULL DEFAULT '',
  telefono     TEXT NOT NULL DEFAULT '',
  telefono2    TEXT NOT NULL DEFAULT '',
  whatsapp     TEXT NOT NULL DEFAULT '',
  whatsapp_msg TEXT NOT NULL DEFAULT '',
  email        TEXT NOT NULL DEFAULT '',
  email_ruben  TEXT NOT NULL DEFAULT '',
  email_sergio TEXT NOT NULL DEFAULT '',
  horario      TEXT NOT NULL DEFAULT '',
  zona         TEXT NOT NULL DEFAULT '',
  instagram    TEXT NOT NULL DEFAULT '',
  linkedin     TEXT NOT NULL DEFAULT '',
  tiktok       TEXT NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solo insercion publica, sin lectura anonima
CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT NOT NULL DEFAULT '',
  empresa    TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  telefono   TEXT NOT NULL DEFAULT '',
  servicio   TEXT NOT NULL DEFAULT '',
  mensaje    TEXT NOT NULL DEFAULT '',
  leido      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL DEFAULT '',
  telefono       TEXT NOT NULL DEFAULT '',
  puesto_interes TEXT NOT NULL DEFAULT '',
  vacante_id     TEXT,
  mensaje        TEXT NOT NULL DEFAULT '',
  cv_url         TEXT NOT NULL DEFAULT '',
  leido          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configurator_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL DEFAULT '',
  empresa       TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  telefono      TEXT NOT NULL DEFAULT '',
  configuracion JSONB NOT NULL DEFAULT '{}',
  tipos_trabajo TEXT[] NOT NULL DEFAULT '{}',
  sector        TEXT NOT NULL DEFAULT '',
  ubicacion     TEXT NOT NULL DEFAULT '',
  plazo         TEXT NOT NULL DEFAULT '',
  adjunto_url   TEXT NOT NULL DEFAULT '',
  leido         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 2. STORAGE
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-uploads', 'private-uploads', FALSE)
ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE site_content          ENABLE ROW LEVEL SECURITY;
ALTER TABLE services              ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_requests ENABLE ROW LEVEL SECURITY;

-- Lectura publica (contenido del sitio)
CREATE POLICY "public_read_site_content"
  ON site_content FOR SELECT USING (TRUE);

CREATE POLICY "public_read_services"
  ON services FOR SELECT USING (TRUE);

CREATE POLICY "public_read_projects"
  ON projects FOR SELECT USING (TRUE);

CREATE POLICY "public_read_upcoming_projects"
  ON upcoming_projects FOR SELECT USING (TRUE);

CREATE POLICY "public_read_sectors"
  ON sectors FOR SELECT USING (TRUE);

CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT USING (TRUE);

CREATE POLICY "public_read_contact_info"
  ON contact_info FOR SELECT USING (TRUE);

-- Insercion publica (formularios): solo INSERT, nunca SELECT
CREATE POLICY "public_insert_messages"
  ON messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "public_insert_applications"
  ON applications FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "public_insert_configurator_requests"
  ON configurator_requests FOR INSERT WITH CHECK (TRUE);

-- Admin: acceso completo al contenido editable
CREATE POLICY "auth_all_site_content"
  ON site_content FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_services"
  ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_projects"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_upcoming_projects"
  ON upcoming_projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_sectors"
  ON sectors FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_testimonials"
  ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all_contact_info"
  ON contact_info FOR ALL USING (auth.role() = 'authenticated');

-- Admin: bandejas (leer / actualizar / borrar)
CREATE POLICY "auth_read_messages"
  ON messages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update_messages"
  ON messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_messages"
  ON messages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_applications"
  ON applications FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update_applications"
  ON applications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_applications"
  ON applications FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_configurator_requests"
  ON configurator_requests FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update_configurator_requests"
  ON configurator_requests FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_configurator_requests"
  ON configurator_requests FOR DELETE USING (auth.role() = 'authenticated');

-- Storage bucket media (publico)
CREATE POLICY "public_read_media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "auth_insert_media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "auth_update_media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Storage bucket private-uploads (privado: anon sube, solo admin lee)
CREATE POLICY "anon_insert_private_uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'private-uploads');

CREATE POLICY "auth_all_private_uploads"
  ON storage.objects FOR ALL
  USING (bucket_id = 'private-uploads' AND auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 4. SEED
-- ------------------------------------------------------------

INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow',  'Esplugues de Llobregat - Barcelona'),
  ('hero_title',    'Soluciones integrales de aislamiento y calorifugado'),
  ('hero_subtitle', 'Especialistas en aislamiento termico, acustico y contra incendios para instalaciones industriales y edificios en Barcelona y provincia.'),
  ('footer_claim',  'Especialistas en aislamiento y calorifugado industrial'),
  ('empresa',       'FRICAL CALORIFUGADOS, S.L.'),
  ('cif',           'B98127855'),
  ('telefono',      '673 177 887'),
  ('telefono2',     '672 629 743'),
  ('whatsapp',      '+34673177887'),
  ('whatsapp_msg',  'Hola, me gustaria solicitar informacion sobre vuestros servicios de aislamiento.'),
  ('email',         'info@fricalcalorifugados.com'),
  ('email_ruben',   'r.perez@fricalcalorifugados.com'),
  ('email_sergio',  's.perez@fricalcalorifugados.com'),
  ('horario',       'Lunes a Viernes: 8:00 - 18:00'),
  ('zona',          'Barcelona y area metropolitana - Cataluna'),
  ('direccion',     'C/ Jocs Florals, 1-3, 08950 Esplugues de Llobregat (Barcelona)'),
  ('instagram',     'https://instagram.com/frical_calorifugados'),
  ('linkedin',      'https://www.linkedin.com/company/frical-calorifugados'),
  ('tiktok',        'https://www.tiktok.com/@frical_calorifugados')
ON CONFLICT (key) DO NOTHING;

INSERT INTO contact_info
  (id, empresa, cif, direccion, telefono, telefono2, whatsapp, whatsapp_msg,
   email, email_ruben, email_sergio, horario, zona, instagram, linkedin, tiktok)
VALUES
  ('main',
   'FRICAL CALORIFUGADOS, S.L.',
   'B98127855',
   'C/ Jocs Florals, 1-3, 08950 Esplugues de Llobregat (Barcelona)',
   '673 177 887',
   '672 629 743',
   '+34673177887',
   'Hola, me gustaria solicitar informacion sobre vuestros servicios de aislamiento.',
   'info@fricalcalorifugados.com',
   'r.perez@fricalcalorifugados.com',
   's.perez@fricalcalorifugados.com',
   'Lunes a Viernes: 8:00 - 18:00',
   'Barcelona y area metropolitana - Cataluna',
   'https://instagram.com/frical_calorifugados',
   'https://www.linkedin.com/company/frical-calorifugados',
   'https://www.tiktok.com/@frical_calorifugados')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (orden, slug, titulo, descripcion, enlace, destacado) VALUES
  (1,
   'aislamiento',
   'Aislamiento y Calorifugado',
   'Nuestra especialidad. Calorifugado de tuberias, depositos, calderas y equipos industriales con los materiales mas adecuados para cada aplicacion: lana de roca, espuma elastomerica, poliuretano inyectado. Acabado en aluminio, inoxidable o chapa lacada.',
   '/servicios/aislamiento-y-calorifugado',
   TRUE),
  (2,
   'conductos',
   'Conductos de Ventilacion',
   'Fabricacion y montaje de redes de conductos en chapa galvanizada o inoxidable para extraccion, ventilacion y climatizacion industrial. Proyectos llave en mano: difusores, rejillas, compuertas cortafuego y equipos de impulsion incluidos.',
   '/servicios/conductos',
   FALSE),
  (3,
   'climatizacion',
   'Climatizacion Industrial',
   'Diseno, instalacion y mantenimiento de sistemas HVAC para industria, naves logisticas, locales comerciales y oficinas. Adaptamos cada proyecto a las exigencias tecnicas y normativas de cada sector, con garantia posventa.',
   '/servicios/climatizacion',
   FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects
  (orden, slug, imagen_url, titulo, descripcion,
   categorias, fecha_dia, fecha_mes, fecha_anyo, gradiente, acento)
VALUES
  (1,
   'conductos-alimentaria',
   '/proyectos/proyecto-01-conductos-alimentaria.jpg',
   'Red de conductos industria alimentaria',
   'Fabricacion e instalacion de conductos galvanizados para ventilacion y extraccion de vapores en planta de produccion alimentaria de 3.200 m2. Cumplimiento normativa HACCP y clase de estanqueidad B.',
   ARRAY['Conductos'],
   14, 3, 2024,
   'linear-gradient(145deg, #0d1f2e 0%, #07131e 55%, #020a12 100%)',
   'rgba(65, 140, 200, 0.18)'),
  (2,
   'calorifugado-reactores',
   '/proyectos/proyecto-02-calorifugado-reactores.jpg',
   'Calorifugado de reactores - Barcelona',
   'Calorifugado de 8 reactores de proceso con lana de roca de alta densidad (150 kg/m3) y acabado en aluminio estucado. Temperatura de trabajo entre 200 y 350 grados C. Planta quimica en el area metropolitana.',
   ARRAY['Aislamiento'],
   22, 11, 2023,
   'linear-gradient(145deg, #1e1008 0%, #120a04 55%, #080402 100%)',
   'rgba(200, 100, 30, 0.18)'),
  (3,
   'trazado-farmaceutica',
   '/proyectos/proyecto-03-trazado-farmaceutica.jpg',
   'Trazado electrico - Planta farmaceutica',
   'Instalacion de trazado electrico en tuberias de proceso para mantenimiento de temperatura critica en planta farmaceutica en el area de Barcelona. Sistema de control SCADA integrado y documentacion ATEX.',
   ARRAY['Aislamiento'],
   5, 7, 2024,
   'linear-gradient(145deg, #10101e 0%, #0a0a14 55%, #050508 100%)',
   'rgba(100, 80, 200, 0.18)'),
  (4,
   'conductos-logistica',
   '/proyectos/proyecto-04-conductos-logistica.jpg',
   'Conductos impulsion/retorno en cubierta',
   'Montaje de red de conductos de impulsion y retorno en cubierta de nave logistica de 8.000 m2. Chapa galvanizada con aislamiento exterior de lana de vidrio y acabado protector de aluminio.',
   ARRAY['Conductos', 'Aislamiento'],
   18, 2, 2024,
   'linear-gradient(145deg, #0a1808 0%, #050f04 55%, #020802 100%)',
   'rgba(80, 180, 60, 0.18)'),
  (5,
   'aislamiento-naval',
   '/proyectos/proyecto-05-aislamiento-naval.jpg',
   'Aislamiento depositos - Sector naval',
   'Aislamiento termico de depositos de almacenamiento en astillero de Tarragona. Proyeccion de espuma de poliuretano de alta densidad con acabado en chapa inoxidable AISI 304.',
   ARRAY['Aislamiento'],
   9, 9, 2023,
   'linear-gradient(145deg, #080a1e 0%, #050614 55%, #020309 100%)',
   'rgba(50, 80, 200, 0.18)'),
  (6,
   'climatizacion-vrf',
   '/proyectos/proyecto-06-climatizacion-vrf.jpg',
   'Climatizacion VRF - Sede corporativa',
   'Diseno e instalacion de sistema de climatizacion VRF para sede corporativa de 2.400 m2 en Barcelona. Unidades exteriores en cubierta con distribucion de conductos integrada en falso techo tecnico.',
   ARRAY['Climatizacion'],
   3, 5, 2024,
   'linear-gradient(145deg, #071818 0%, #040e0e 55%, #020808 100%)',
   'rgba(30, 160, 160, 0.18)')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO upcoming_projects
  (orden, slug, imagen_url, titulo, descripcion, categorias, gradiente)
VALUES
  (1,
   'prx-petroquimica',
   '/proyectos/proximamente/prx-01-petroquimica.jpg',
   'Aislamiento planta petroquimica',
   'Calorifugado completo de tuberias de proceso y reactores. Alta temperatura, acabado inoxidable AISI 316.',
   ARRAY['Aislamiento'],
   'linear-gradient(145deg, #1a0e04 0%, #100804 55%, #060402 100%)'),
  (2,
   'prx-hospital',
   '/proyectos/proximamente/prx-02-hospital.jpg',
   'Red de conductos - Hospital',
   'Fabricacion y montaje de conductos galvanizados para ventilacion en edificio hospitalario. Clase estanqueidad C.',
   ARRAY['Conductos'],
   'linear-gradient(145deg, #08101a 0%, #050a12 55%, #02060a 100%)'),
  (3,
   'prx-logistica',
   '/proyectos/proximamente/prx-03-logistica.jpg',
   'Climatizacion nave logistica',
   'Instalacion VRF y climatizadoras de techo para nave de distribucion de 12.000 m2 en el area metropolitana.',
   ARRAY['Climatizacion'],
   'linear-gradient(145deg, #081808 0%, #050e05 55%, #020802 100%)'),
  (4,
   'prx-alimentacion',
   '/proyectos/proximamente/prx-04-alimentacion.jpg',
   'Calorifugado industria alimentaria',
   'Aislamiento de lineas de proceso con acabado en inoxidable AISI 316. Cumplimiento normativa HACCP y EHEDG.',
   ARRAY['Aislamiento'],
   'linear-gradient(145deg, #181208 0%, #100c05 55%, #080602 100%)')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sectors (orden, slug, nombre, descripcion) VALUES
  (1, 'quimico',      'Quimico',      'Plantas de proceso y reactores'),
  (2, 'alimentario',  'Alimentario',  'Produccion y conservacion'),
  (3, 'energetico',   'Energetico',   'Generacion y distribucion'),
  (4, 'naval',        'Naval',        'Astilleros y embarcaciones'),
  (5, 'farmaceutico', 'Farmaceutico', 'GMP y salas blancas'),
  (6, 'edificacion',  'Edificacion',  'Oficinas y logistica')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO testimonials (orden, iniciales, nombre, cargo, cita) VALUES
  (1,
   'JM',
   'Jordi Mas',
   'Jefe de Mantenimiento - Industria Quimica',
   'FRICAL lleva anos siendo nuestro proveedor de referencia en aislamiento industrial. Su equipo conoce la planta mejor que nadie y siempre cumple con los plazos, incluso en paradas tecnicas de emergencia. Calidad y fiabilidad garantizadas.'),
  (2,
   'MR',
   'Mireia Roca',
   'Responsable de Instalaciones - Sector Alimentario',
   'La renovacion completa de nuestros conductos de ventilacion supero todas las expectativas. El acabado es impecable, el trato muy profesional y la documentacion tecnica entregada ha sido perfecta para nuestras auditorias HACCP.'),
  (3,
   'AP',
   'Antoni Puig',
   'Director Tecnico - Promotora Inmobiliaria',
   'Para los sistemas de climatizacion de nuestros proyectos de oficinas siempre llamamos a FRICAL. Precio ajustado, soluciones a medida y una garantia posventa que realmente funciona. No necesitamos a nadie mas.');


-- ------------------------------------------------------------
-- USUARIO ADMINISTRADOR
-- Supabase Dashboard > Authentication > Users > Add user
-- Email + contrasena segura. No se requiere nada mas en la BD.
-- ------------------------------------------------------------
