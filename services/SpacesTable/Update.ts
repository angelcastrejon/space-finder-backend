import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getEventBody } from "../Shared/Utils";
import { MissingFieldError } from "../Shared/InputValidator";



const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;

const dbClient = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDB'
    }
    
    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

      try {
        if (requestBody && spaceId) {
            // get the first key in the request body
            const requestBodyKey = Object.keys(requestBody)[0];
            // get the value for the first key in request body
            const requestBodyValue = requestBody[requestBodyKey];
    
            const updateResult = await dbClient.update({
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: spaceId
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeValues:{
                    ':new': requestBodyValue
                },
                ExpressionAttributeNames:{
                    '#zzzNew': requestBodyKey
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();
            result.body = JSON.stringify(updateResult)
        }
      } catch (error) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
            result.body = error.message;
        } else {
            result.statusCode = 500;
        }
      }

    return result
}

export { handler}