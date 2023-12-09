# News Aggregator

## Running Locally

To run locally;
```
./vendor/bin/sail up -d
```

To stop running;
```
./vendor/bin/sail stop
```

To delete the docker stuff from local;
```
./vendor/bin/sail down
```

## Database

To migrate (should be run after running locally for the first time);
```
./vendor/bin/sail artisan migrate
```

## Phpmyadmin

Phpymyadmin can be accessed at `localhost:8081` with `sail` and `password` credentials.
