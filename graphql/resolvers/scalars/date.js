const { GraphQLScalarType, Kind } = require('graphql');
const { DateTime } = require('luxon');

function parseValue(value) {
    //construct JS Date object
    if (!(typeof value !== 'integer' | typeof value !== 'string'))
        throw Error('Expected integer or string for date value');
    const jsDate = new Date(value);
    //ensure date is valid (i.e. not Feb 30) w/ luxon
    const date = DateTime.fromJSDate(jsDate);
    if (!date.isValid)
        throw Error('Date is invalid: ' + date.invalidExplanation);
    return date.toISO();
}
module.exports = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Custom scalar for Dates',
        serialize(value) {
            if (value instanceof Date) {
                return value.toISOString();
            }
            throw Error('Expected `Date` object');
        },
        parseValue: parseValue,
        parseLiteral(ast) {
            return parseValue(ast.value);
        }
    })
}