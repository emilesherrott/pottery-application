FROM postgres
ENV POSTGRES_USER=testuser
ENV POSTGRES_PASSWORD=testpassword
ENV POSTGRES_DB=testdb
COPY 01-potters.sql /docker-entrypoint-initdb.d/
COPY 02-owners.sql /docker-entrypoint-initdb.d/
COPY 03-ceramics.sql /docker-entrypoint-initdb.d/
COPY 04-sales.sql /docker-entrypoint-initdb.d/