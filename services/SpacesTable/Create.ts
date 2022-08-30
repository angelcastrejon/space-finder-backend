import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { MissingFieldError, validateAsSpaceEntry } from "../Shared/InputValidator";
import { generateRandomId } from "../Shared/Utils";


const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDB'
    }
    
    const item = typeof event.body == 'object'? event.body: JSON.parse(event.body);
    item.spaceId = generateRandomId();
    validateAsSpaceEntry(item);
    try {
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
        result.body = JSON.stringify(`Created item with id: ${item.spaceId}`)
    } catch (error) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
            result.body = error.message
        } else {
            result.statusCode = 500;
        }
    }
    
    return result
}

export { handler}