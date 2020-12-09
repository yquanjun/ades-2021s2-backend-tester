const customer_id_prefix = Math.floor(Math.random() * 89999) + 10000;
let customer_id = customer_id_prefix * 100000;
function setCustomerId(context, events, done) {
    context.vars.customer_id = customer_id++;
    done();
}

module.exports = {
    setCustomerId,
};
