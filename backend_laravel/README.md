# News Aggregator

## Setting Up The Project

### Prerequisites

- Composer
- Docker
- Docker Compose

**Important: For production, `.env` files must be set and hidden by YOU! The given `.env` files here are examples**

To create the `.env` file, run;
```
cp .env.example .env # get the env files from the example env file
```

---

The app is able to fetch data from these API's;
- The Guardian
- NewsAPI
- New York Times

If you wish to fetch data from the given API's, the required API_KEYS should be obtained and set in the `.env` file.

---

The app uses Fortify/Sanctum for authentication. These env variables should be changed accordingly in the `.env` file depending on the environment. They are `localhost` by default;
```
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost
```
---

To run the project and set up the database, run;
```
composer install # install dependencies
./vendor/bin/sail artisan key:generate# generate a Laravel app key
./vendor/bin/sail up -d # run the project locally
until ./vendor/bin/sail artisan migrate; do echo -e "\n\n ---- waiting for database to get up"; sleep 5; done; # migrate the database
./vendor/bin/sail artisan db:seed --class=PreferenceSeeder
```

---
    
The project is now set up and running at `127.0.0.1:80`.

`Phpmyadmin` is accessible at `127.0.0.1:8081` with these credentials;
```
sail
password
```

To stop running the project
```
./vendor/bin/sail stop
```

You can then run the project again with
```
./vendor/bin/sail up -d
```

To delete the project's docker resources including the volumes
```
./vendor/bin/sail down -v
```

---

The project starts with an empty database.
- If you've filled the required API keys in the `.env` file, a request to `/api/fetch-news-remote` fetches the newest news and populates the database.
    - A cronjob is also created in `app/Console/Kernel.php` file that fetches the remote news daily.
- If you don't have API keys, you can make a request to `/api/fetch-news-local` to populate the database from example responses that are in the repository.
