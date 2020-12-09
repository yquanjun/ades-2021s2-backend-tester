const chalk = require('chalk');
const axios = require('axios');
const dayjs = require('dayjs');

const baseUrl = 'http://localhost:3000';
const now = dayjs().toISOString();

let queueId = 'QUEUE12345';

function equalObject(expected, actual) {
    return Object.keys(expected).every((key) => {
        return expected[key] === actual[key];
    });
}
function checkStatusAndBody(expectedStatus, actualStatus, expectedBody, actualBody) {
    const isCorrectStatus = parseInt(expectedStatus) === parseInt(actualStatus);
    const isCorrectBody = equalObject(expectedBody, actualBody);
    if (!isCorrectStatus)
        console.error(`Expected Status: ${chalk.green(expectedStatus)}, Received Status: ${chalk.red(actualStatus)}\n`);
    if (!isCorrectBody)
        console.error(
            `\nExpected Body:\n\n${chalk.green(
                JSON.stringify(expectedBody, null, 2),
            )}, \n\nReceived Body:\n\n${chalk.red(JSON.stringify(actualBody, null, 2))}\n`,
        );
    if (isCorrectBody && isCorrectStatus) console.log(chalk.green(`Success!\n`));
    return isCorrectBody && isCorrectStatus;
}

function handleError(expectedStatus, expectedBody) {
    return function (error) {
        if (expectedStatus < 400) {
            console.error(`Expected ${chalk.green(expectedStatus)}, Received ${chalk.red(error.response.status)}\n`);
            return false;
        }
        if (error.response) {
            return checkStatusAndBody(
                expectedStatus,
                error.response.status,
                { code: expectedBody },
                error.response.data,
            );
        } else {
            console.error(chalk.red('Something went wrong! Contact Jeremiah Ang'), error, '\n');
            return false;
        }
    };
}
function handleSuccess(expectedStatus, expectedBody) {
    return function (response) {
        if (expectedStatus >= 400) {
            console.error(`Expected ${chalk.green(expectedStatus)}, Received ${chalk.red(response.status)}\n`);
            return false;
        }
        return checkStatusAndBody(expectedStatus, response.status, expectedBody || {}, response.data);
    };
}

function url(path) {
    return `${baseUrl}${path}`;
}

function send(method, url, query, body) {
    return axios({
        method,
        url,
        data: body,
        params: query,
    });
}
function serverAvailable(input, status, body) {
    console.log(`====> Server Available, ${input}, ${status}, ${body}`);
    return send('PUT', url('/company/server'), {}, { queue_id: queueId })
        .then(handleSuccess(status, { customer_id: parseInt(body) }))
        .catch(handleError(status, body));
}
function updateQueue(input, status, body) {
    console.log(`====> Update Queue, ${input}, ${status}, ${body}`);
    return send('PUT', url('/company/queue'), { queue_id: queueId }, { status: input })
        .then(handleSuccess(status))
        .catch(handleError(status, body));
}
function joinQueue(input, status, body) {
    console.log(`====> Join Queue, ${input}, ${status}, ${body}`);
    return send('POST', url('/customer/queue'), {}, { queue_id: queueId, customer_id: parseInt(input) })
        .then(handleSuccess(status))
        .catch(handleError(status, body));
}
function arrivalRate(input, status, body) {
    console.log(`====> Arrival Rate, ${input}, ${status}, ${body}`);
    const [totalCount, responseLength] = body
        .substring(1, body.length - 1)
        .split(',')
        .map((i) => parseInt(i));
    return send('GET', url('/company/arrival_rate'), { queue_id: queueId, from: now, duration: parseInt(input) }, {})
        .then(function (response) {
            const body = response.data;
            const newBody = body.reduce((sum, { count }) => sum + parseInt(count), 0);
            response.data = { total_count: newBody, response_length: body.length };
            return response;
        })
        .then(handleSuccess(status, { total_count: totalCount, response_length: responseLength }))
        .catch(handleError(status, body));
}
function checkQueue(input, status, body) {
    console.log(`====> Check Queue, ${input}, ${status}, ${body}`);
    const [total, ahead, queueStatus] = body.split(',');
    return send('GET', url('/customer/queue'), { customer_id: input ? parseInt(input) : null, queue_id: queueId }, {})
        .then(
            handleSuccess(status, {
                total: parseInt(total.substring(1)),
                ahead: parseInt(ahead),
                status: queueStatus ? queueStatus.slice(0, -1).toUpperCase() : queueStatus,
            }),
        )
        .catch(handleError(status, body));
}
function createQueue(input, status, body) {
    console.log(`====> Create Queue, ${input}, ${status}, ${body}`);
    return send('POST', url('/company/queue'), {}, { queue_id: queueId, company_id: parseInt(input) })
        .then(handleSuccess(status))
        .catch(handleError(status, body));
}
function setQueueId(input, status, body) {
    console.log(`====> Set Queue Id, ${input}`);
    queueId = input;
    return handleSuccess(200)({
        status: 200,
        data: `Updated Queue Id to: ${input}`,
    });
}
function reset(input, status, body) {
    console.log(`====> Reset`);
    return send('POST', url('/reset'), {}, {}).then(handleSuccess(status)).catch(handleError(status, body));
}
const actions = [
    null,
    serverAvailable, //1
    updateQueue, //2
    joinQueue, //3
    arrivalRate, //4
    checkQueue, //5
    createQueue, //6
    setQueueId, //7
    reset, //8
];

function testLine(line) {
    const [action, input, status, body] = line.split('\t');
    return actions[action](input, status, body);
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const lines = [];
const result = [];
let passedCount = 0;
rl.on('line', (line) => lines.push(line)).on('close', async () => {
    const total = lines.length;
    for (let i = 0; i < total; i++) {
        console.log(`\n==> Test ${i + 1} of ${total}`);
        const isPassed = await testLine(lines[i]);
        result.push(isPassed);
    }
    for (let i = 0; i < result.length; i++) {
        let message = `Test Case ${(i + 1).toString().padStart(2, '0')} of ${result.length}: `;
        if (result[i]) {
            passedCount++;
            message += `${chalk.green('Passed')}`;
        } else {
            message += `${chalk.red('Failed')}`;
        }
        console.log(message);
    }
    console.log(`\nScore: ${passedCount} / ${total}`);
});
