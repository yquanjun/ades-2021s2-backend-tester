# ADES AY2021S2 Backend Tester

This tester tests the correctness of the overall system, it should be complimented with the test cases provided to the students which tests the correctness of each API's response.

## Running the test

1. Install packages
    ```
    $ npm install
    ```
2. Start your backend on `localhost`, on port `3000`
3. Run `npm test`
4. Inspect the pass/fail result in cmd.
5. Inspect any errors in your app's terminal.

## Files

There are 2 files

1. index.test.js

    This is the runner that will parse the test case file.
    The tests are run synchronously.

2. virtual-queue-test-cases.txt

    This is the actual test cases as a TAB delimited file.

## virtaul-queue-test-cases.txt

Each line of the file is a single test case, each of the test case follows the following format:

```
<API #> <INPUT> <EXPECTED RESPONSE STATUS> <EXPECTED RESPONSE BODY>
```

1. `<API #>`

    Each of the api is mapped to a number the mapping is as follows:

    | API              | #   |
    | ---------------- | --- |
    | server available | 1   |
    | update queue     | 2   |
    | join queue       | 3   |
    | arrival rate     | 4   |
    | Check Queue      | 5   |
    | create queue     | 6   |

    > e.g.
    >
    > `2 <INPUT> <EXPECTED RESPONSE STATUS> <EXPECTED RESPONSE BODY>`
    >
    > Represents making a "Update Queue" API call.

2. `<INPUT>`

    The input would represent different thing for each API, the mapping is as follows:

    | API              | Input       |
    | ---------------- | ----------- |
    | server available | N.A.        |
    | update queue     | status      |
    | join queue       | customer_id |
    | arrival rate     | duration    |
    | Check Queue      | customer_id |
    | create queue     | company_id  |

    > e.g.
    >
    > `3 1234567890 <EXPECTED RESPONSE STATUS> <EXPECTED RESPONSE BODY>`
    >
    > Represents making a "Join Queue" API call with `customer_id=1234567890`.

3. `<EXPECTED RESPONSE STATUS>`

    As the name suggest, the expected HTTP response status

4. `<EXPECTED RESPONSE BODY>`

    For error cases (e.g. 400, 404, 422, 500), this represents the error expected error code such as `QUEUE_INACTIVE` or `UNEXPECTED_ERROR`.

    For success cases, this can be a comma-delimited value representing different parts of the response. The mapping is as follows:

    | API              | CSV format              |
    | ---------------- | ----------------------- |
    | server available | customer_id             |
    | update queue     | N.A.                    |
    | join queue       | N.A.                    |
    | arrival rate     | total_sum,result_length |
    | Check Queue      | total,ahead,status      |
    | create queue     | N.A.                    |

    > e.g.
    >
    > `4 1 200 3,60`
    >
    > This represents making a "Arrival Rate" API call with a duration of **1** minute, the HTTP request should return with a status of **200**, the sum of all the arrival rates should equal to **3** and the length of the result array should be **60**.

You may notice that certain parameters are missing from this definition, for simplicity sake, we shall assume that some parameters are shared throughout the test case. The list of such parameters are as follows, feel free to modify them via `index.test.js`:

| variable | value                                       |
| -------- | ------------------------------------------- |
| queue_id | Hardcoded in `index.test.js`                |
| from     | The timestamp at the start of the test case |
| baseUrl  | http://localhost:3000                       |
