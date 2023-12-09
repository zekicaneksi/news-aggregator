# News Aggregator

## Setting Up The Project

- Get the env files from the example env file;
    ```
    cp .env.example .env
    ```

- To install dependencies;
    ```
    composer install
    ```

- To generate a Laravel app key;
    ```
    php artisan key:generate
    ```

- To run the project locally
    ```
    ./vendor/bin/sail up -d
    ```

- To migrate the database
    ```
    ./vendor/bin/sail artisan migrate
    ```

The project is now set up and running at `127.0.0.1:80`.

Phpmyadmin is accessible at `127.0.0.1:8081` with these credentials;
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
