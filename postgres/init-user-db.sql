CREATE ROLE postgresdev WITH LOGIN PASSWORD 'postgresdev';

CREATE DATABASE auth_service_dev;
CREATE DATABASE auth_service_test;

GRANT ALL PRIVILEGES ON DATABASE auth_service_dev TO postgresdev;
GRANT ALL PRIVILEGES ON DATABASE auth_service_test TO postgresdev;

CREATE DATABASE notes_dev;
CREATE DATABASE notes_test;

GRANT ALL PRIVILEGES ON DATABASE notes_dev TO postgresdev;
GRANT ALL PRIVILEGES ON DATABASE notes_test TO postgresdev;
