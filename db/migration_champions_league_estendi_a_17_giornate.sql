-- Estende la Champions League da 8 a 17 giornate (fase a campionato + fase a eliminazione
-- diretta fino alla finale). Da eseguire una volta sola se hai già applicato
-- migration_add_champions_league.sql con num_giornate=8.
UPDATE campionato SET num_giornate = 17 WHERE id = 'CHAMPIONS_LEAGUE';
