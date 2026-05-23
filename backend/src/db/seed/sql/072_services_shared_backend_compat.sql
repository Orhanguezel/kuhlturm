-- 072_services_shared_backend_compat.sql
-- shared-backend services router expects these canonical columns.

UPDATE services
SET
  module_key = COALESCE(NULLIF(module_key, ''), 'kuhlturm'),
  is_featured = featured,
  storage_asset_id = image_asset_id;

UPDATE services_i18n
SET
  title = COALESCE(NULLIF(title, ''), name),
  content = COALESCE(content, includes, description),
  alt = COALESCE(alt, image_alt);
