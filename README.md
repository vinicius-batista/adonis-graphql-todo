# Adonis graphql Todo
> A simple todo example built with adonis and graphql

## Installing / Getting started

* If you don't have [adonis-cli](https://github.com/adonisjs/adonis-cli) installed
```shell 
npm i -g @adonisjs/cli 
```

* Create a .env file based on .env.example.

* Install dependencies
```shell 
npm install 
```

* Generate a personal app key
```shell 
adonis key:generate
 ```

* Run migrations to your database
```shell
adonis migration:run
```

* Start http server local
```shell
adonis serve --dev
```

## Developing

### Built With
* [AdonisJs](https://adonisjs.com/)
* [adonis-graphql](https://github.com/RomainLanz/adonis-graphql)
* [PostgreSQL](https://www.postgresql.org/)

### Prerequisites
* Node.js >= 8.0
* Npm >= 5.0
* PostgreSQL 10

## Configuration

All local configuration are made in .env file, check .env.example.

## Tests

Tests are written with [Adonis vow](https://github.com/adonisjs/adonis-vow).
Run the following commands to run tests.

```shell
adonis test
```
