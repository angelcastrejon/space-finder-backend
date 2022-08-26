import { SpaceStack } from "./SpaceStack";
import { App } from "aws-cdk-lib";

const app = new App();

// init project
new SpaceStack(app, 'Space-finder', {
    stackName: 'SpaceFinder'
})
