# HomeVideoHosting

## Run website
```bash
docker compose up
```

## Kill website
```bash
docker compose down
```

# Individual services

## Open shell inside a container
```bash
docker exec -it <container-name> sh
```

## Run nginx with rmtp module
```bash
docker container run --rm -d -p 80:80 -p 1935:1935 --name nginx-rmtp tiangolo/nginx-rtmp
```
**NOTE** This image uses the following default configuration:
```
rtmp_auto_push on;
worker_processes auto;
rtmp_auto_push on;
events {}
rtmp {
    server {
        listen 1935;
        listen [::]:1935 ipv6only=on;    

        application live {
            live on;
            record off;
        }
    }
}

```

# Database
## Database schema
```sql
-- Main videos table
CREATE TABLE HomeVideos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Filename NVARCHAR(255) NOT NULL,
    LengthSeconds INT NOT NULL,
    RecordedDate DATETIME2 NULL,
    Location NVARCHAR(255) NOT NULL
);

-- People table
CREATE TABLE People (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL
);

-- Junction table for many-to-many relationship
CREATE TABLE HomeVideoPeople (
    HomeVideoId INT NOT NULL,
    PersonId INT NOT NULL,

    PRIMARY KEY (HomeVideoId, PersonId),

    FOREIGN KEY (HomeVideoId)
        REFERENCES HomeVideos(Id)
        ON DELETE CASCADE,

    FOREIGN KEY (PersonId)
        REFERENCES People(Id)
        ON DELETE CASCADE
);
```

## Database test data
```sql
-- Insert sample people (grouped into families)
INSERT INTO People (FirstName, LastName)
VALUES
    -- Johnson family
    ('Alice', 'Johnson'),
    ('David', 'Johnson'),
    ('Sophie', 'Johnson'),

    -- Smith family
    ('Bob', 'Smith'),
    ('Emma', 'Smith'),
    ('Liam', 'Smith'),

    -- Brown family
    ('Charlie', 'Brown'),
    ('Olivia', 'Brown'),

    -- Wilson family
    ('Daniel', 'Wilson'),
    ('Sarah', 'Wilson'),

    -- Davis family
    ('Olivia', 'Davis'),
    ('Noah', 'Davis'),

    -- Taylor family
    ('Sophia', 'Taylor'),
    ('George', 'Taylor'),

    -- Miller family
    ('Jake', 'Miller'),
    ('Mia', 'Miller');

    -- Insert sample home videos
INSERT INTO HomeVideos (Filename, LengthSeconds, RecordedDate, Location)
VALUES
    ('birthday_party_2023.mp4', 542, '2023-07-15 14:30:00', 'Farm'),
    ('family_vacation_beach.mov', 1280, '2022-08-03 10:15:00', 'Cinema'),
    ('christmas_morning.mp4', 965, '2021-12-25 08:00:00', 'Park'),
    ('soccer_game_highlights.avi', 430, '2024-04-21 16:45:00', 'Home'),
    ('baby_first_steps.mp4', 210, '2020-05-11 18:20:00', 'Home'),
    ('graduation_day.mov', 1500, '2019-06-10 12:00:00', 'Disneyland'),
    ('backyard_bbq.mp4', 780, '2023-09-02 17:10:00', 'Farm'),
    ('road_trip_timelapse.mp4', 320, '2024-01-18 09:00:00', 'Runabout'),
    ('wedding_reception.mp4', 3600, '2022-05-28 19:30:00', 'Home'),
    ('dog_playing_fetch.mp4', 95, '2024-03-12 15:05:00', 'Home');

    -- Link people to videos (family-based grouping logic)

INSERT INTO HomeVideoPeople (HomeVideoId, PersonId)
VALUES
    -- birthday_party_2023.mp4 (Johnson + Smith families)
    (1, 1), (1, 2), (1, 3),   -- Johnson
    (1, 4), (1, 5),           -- Smith

    -- family_vacation_beach.mov (Smith + Davis families)
    (2, 4), (2, 5), (2, 6),
    (2, 11), (2, 12),

    -- christmas_morning.mp4 (Wilson family)
    (3, 9), (3, 10),

    -- soccer_game_highlights.avi (Miller + Taylor)
    (4, 15), (4, 16),
    (4, 13), (4, 14),

    -- baby_first_steps.mp4 (Davis family)
    (5, 11), (5, 12),

    -- graduation_day.mov (Taylor family)
    (6, 13), (6, 14),

    -- backyard_bbq.mp4 (multi-family gathering)
    (7, 1), (7, 4), (7, 7), (7, 9),

    -- road_trip_timelapse.mp4 (Brown + Miller)
    (8, 7), (8, 8), (8, 15),

    -- wedding_reception.mp4 (all families mixed)
    (9, 1), (9, 4), (9, 7), (9, 9), (9, 11), (9, 13),

    -- dog_playing_fetch.mp4 (Smith + Johnson)
    (10, 2), (10, 5), (10, 6);
```


