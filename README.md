# HomeVideoHosting

## Run website
```bash
docker compose up
```

## Kill website
```bash
docker compose down
```

## Database video table schema
```sql
CREATE TABLE HomeVideos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Filename NVARCHAR(255) NOT NULL,
    LengthSeconds INT NOT NULL,
    RecordedDate DATETIME2 NULL,
    People NVARCHAR(500) NULL
);
```

# Individual services

## Run nginx
```bash
docker container run --rm -d -p 80:80 nginx:latest
```
Alternatively bind the current directory to allow for live updates during development:
```bash
docker container run --rm -d -p 80:80 --mount type=bind,source="$(pwd)/app",target=/usr/share/nginx/html nginx:latest
```

## Run sql server
**Note**
Password must be strong for sql server to actually start up
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433  --name sqlserver --hostname sqlserver -d --mount type=bind,source="$(pwd)/sqldata",target=//var/opt/mssql/ mcr.microsoft.com/mssql/server:2019-latest
```


