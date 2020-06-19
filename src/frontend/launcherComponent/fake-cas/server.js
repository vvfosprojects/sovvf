const express = require('express');
const server = express();
const port = 4001;
server.use(express.static('public'));
server.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.get('/serviceValidate', (req, res) => {
    let jsonFakeResponse = {
        'serviceResponse': {
            'authenticationSuccess': {
                'user': 'mario.rossi@dipvvf.it',
                'attributes': {
                    'credentialType': 'UsernamePasswordCredential',
                    'isFromNewLogin': [
                        true
                    ],
                    'authenticationDate': [
                        1591868322.293000000
                    ],
                    'sAMAccountName': [
                        'RSSMRA80A01H501U'
                    ],
                    'authenticationMethod': 'LdapAuthenticationHandler',
                    'successfulAuthenticationHandlers': [
                        'LdapAuthenticationHandler'
                    ],
                    'UserPrincipalName': [
                        'mario.rossi@dipvvf.it'
                    ],
                    'longTermAuthenticationRequestTokenUsed': [
                        false
                    ],
                    'sn': [
                        'Rossi'
                    ],
                    'cn': [
                        'Rossi Mario'
                    ]
                }
            }
        }
    }
    if (req.query.ticket) {
        jsonFakeResponse.serviceResponse.authenticationSuccess.attributes.sAMAccountName[0] = req.query.ticket.toUpperCase();
        res.json(jsonFakeResponse);
    } else {
        res.sendStatus(401)
    }
    console.log(jsonFakeResponse);

});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
