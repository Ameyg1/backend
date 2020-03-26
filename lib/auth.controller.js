exports.twitter = (req, res) => {
    const io = req.app.get('io')
    const user = {
        name: req.user.username,
        photo: req.user.photos[0].value.replace(/_normal/, ''),
        retrivalUrl: null
    }
    io.in(req.session.socketId).emit('twitter', user)
    res.end()
}

exports.google = (req, res) => {
    const io = req.app.get('io')
    const user = {
        name: req.user.displayName,
        photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250'),
        retrivalUrl: null
    }
    io.in(req.session.socketId).emit('google', user)
    res.end()
}

exports.facebook = (req, res) => {
    const io = req.app.get('io')
    const { givenName, familyName } = req.user.name
    const user = {
        name: `${givenName} ${familyName}`,
        photo: req.user.photos[0].value,
        retrivalUrl: null
    }
    io.in(req.session.socketId).emit('facebook', user)
    res.end()
}

exports.github = (req, res) => {
    const io = req.app.get('io')
    const user = {
        name: req.user.username,
        photo: req.user.photos[0].value,
        retrivalUrl: null
    }
    io.in(req.session.socketId).emit('github', user)
    res.end()
}

exports.linkedin = (req, res) => {
    const io = req.app.get('io')
    console.log(res);
    const user = {
        name: req.user.displayName,
        photo: req.user.photos[2].value,
        retrivalUrl: 'https://www.linkedin.com/profile/preview'
    }
    io.in(req.session.socketId).emit('linkedin', user)
    res.end()
}

