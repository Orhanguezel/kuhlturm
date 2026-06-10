SET NAMES utf8mb4;
SET time_zone='+00:00';

START TRANSACTION;

DELETE FROM `reference_images_i18n`;
DELETE FROM `reference_images`;
DELETE FROM `references_i18n`;
DELETE FROM `references`;

COMMIT;
