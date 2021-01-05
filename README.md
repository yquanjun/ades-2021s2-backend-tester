# ADES AY2021 Sem2 Backend Tester

## Simulating Customers joining

1. Set the database connection string in `.env` file
2. Start the backend with

    ```
    npm run start-<OS>
    ```

    Where `<OS>` is either

    - linux
    - macos
    - win

    e.g. if you're using windows

    ```
    npm run start-win
    ```

3. Create Queues in the backend

    ```
    npm run populate-website
    ```

4. Start populating customers with the following

    ```
    npm run <SCENARIO>
    ```

    Where `<SCENARIO>` is one of:

    - single-peak
    - double-peak
    - sustained-peak

    e.g. to run single-peak

    ```
    npm run single-peak
    ```
