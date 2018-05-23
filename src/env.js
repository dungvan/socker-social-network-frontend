var env = {};
if (process.env.SSN_ENV === 'development') {
    env = {
        url: 'http://localhost',
        s3Endpoint: 'http://4303c442.ngrok.io/socker-social-network-api/'
    }
} else {
    env = {
        url: 'http://localhost',
        s3Endpoint: 'http://4303c442.ngrok.io/soccer-social-network-api/'
    }
}

export default env;