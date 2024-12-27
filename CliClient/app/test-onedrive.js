require('source-map-support').install();
require('@babel/plugin-transform-runtime');

const { ConfidentialClientApplication } = require('@azure/msal-node');
const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const fs = require('fs-extra');
const path = require('path');

// Azure app registration details
const clientId = 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d';
const clientSecret = 'PLN8Q~qY7nRz~l~kg5hK-NC8UFvFFCxT9bWXPcTC';
const tenantId = '6315ae7d-2ca8-436c-babf-b4fe1c0e0a77';
const authority = `https://login.microsoftonline.com/${tenantId}`;

// Function to get an access token
async function getAccessToken(clientId, clientSecret, tenantId) {
    const msalConfig = {
        auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${tenantId}`,
            clientSecret: clientSecret
        }
    };

    const clientApplication = new ConfidentialClientApplication(msalConfig);

    const tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default']
    };

    const authResponse = await clientApplication.acquireTokenByClientCredential(
        tokenRequest
    );
    return authResponse.accessToken;
}

function configContent() {
    const configFilePath = path.dirname(__dirname) + '/config.json';
    return fs.readFile(configFilePath, 'utf8').then(content => {
        return JSON.parse(content);
    });
}

// Function to access OneDrive files
async function main() {
    const config = await configContent();
    const accessToken = getAccessToken(
        config.clientId,
        config.clientSecret,
        config.tenantId
    );

    const client = MicrosoftGraph.Client.init({
        authProvider: done => {
            done(null, accessToken);
        }
    });

    // LIST ITEMS

    // client.api('/drive/items/9ADA0EADFA073D0A%21109/children').get((err, res) => {
    // 	console.log(err, res);
    // });

    // SET ITEM CONTENT

    // client.api('/drive/items/9ADA0EADFA073D0A%21109:/test.txt:/content').put('testing', (err, res) => {
    // 	console.log(err, res);
    // });

    // SET ITEM CONTENT

    // client.api('/drive/items/9ADA0EADFA073D0A%21109:/test2.txt:/content').put('testing deux', (err, res) => {
    // 	console.log(err, res);
    // });

    // DELETE ITEM

    // client.api('/drive/items/9ADA0EADFA073D0A%21111').delete((err, res) => {
    // 	console.log(err, res);
    // });

    // GET ITEM METADATA

    // client
    //     .api(
    //         '/drive/items/9ADA0EADFA073D0A%21110?select=name,lastModifiedDateTime'
    //     )
    //     .get((err, res) => {
    //         console.log(err, res);
    //     });
}

main().catch(error => {
    console.error(error);
});
