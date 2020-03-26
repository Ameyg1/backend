const providers = ['twitter', 'google', 'facebook', 'github', 'linkedin']

const callbacks = providers.map(provider => {
    return process.env.NODE_ENV === 'production'
        ? `https://backend.kunekt.co/${provider}/callback`
        : `https://localhost:8080/${provider}/callback`
})

const [twitterURL, googleURL, facebookURL, githubURL, linkedinURL] = callbacks

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
    ? 'https://app.kunekt.co'
    : ['https://127.0.0.1:3000', 'https://localhost:3000']

exports.TWITTER_CONFIG = {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: twitterURL,
}

exports.GOOGLE_CONFIG = {
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: googleURL
}

exports.FACEBOOK_CONFIG = {
    clientID: process.env.FACEBOOK_KEY,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
    callbackURL: facebookURL
}

exports.GITHUB_CONFIG = {
    clientID: process.env.GITHUB_KEY,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: githubURL
}

exports.LINKEDIN_CONFIG = {
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: linkedinURL,
    scope: ['r_liteprofile'],
    state: true
}