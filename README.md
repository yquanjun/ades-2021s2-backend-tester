# ADES AY2021 Sem2 Backend Tester

## First things first - Set database connection

1. Go to elephantSql and copy the connection string of any instance.
2. Set the database connection string in `.env` file.

## Running an instance for CUSTOMERS

> Customer instance uses port 3000 and have 4 database connection to handle high load from customers joining queues
>
> The mobile app should connect to this instance.
>
> The script to simulate customers joining queue uses this instance too.

1. Windows

    ```
    npm run start-win-customer
    ```

2. MacOS

    ```
    npm run start-macos-customer
    ```

3. Linux

    ```
    npm run start-linux-customer
    ```

## Running an instance for COMPANY

> Company instance uses port 8080 and have 1 database connection only
>
> The Website should connect to this instance.

1. Windows

    ```
    npm run start-win-company
    ```

2. MacOS

    ```
    npm run start-macos-company
    ```

3. Linux

    ```
    npm run start-linux-company
    ```

## Simulating Customers joining queue

1. Start an backend instance for CUSTOMER

2. Create Queues in the backend

    ```
    npm run populate-website
    ```

3. Single Peak Scenario

    > Company Id: 1000000001; Queue Id: QUEUE01001

    ```
    npm run single-peak
    ```

4. Double Peak Scenario

    > Company Id: 1000000001; Queue Id: QUEUE01002

    ```
    npm run double-peak
    ```

5. Sustained Peak Scenario

    > Company Id: 1000000001; Queue Id: QUEUE01003

    ```
    npm run sustained-peak
    ```
