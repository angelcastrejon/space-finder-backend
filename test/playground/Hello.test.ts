import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from '../../services/SpacesTable/Delete';

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: '19bd1d88-e67e-4c87-8821-46b1721dcf80'
    }
} as any;

const result = handler(event, {} as any).then((apiResult)=>{
    const items = JSON.parse(apiResult.body);
    console.log(123)
});
