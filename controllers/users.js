const User = require('../models/user');
const { returnClarifaiRequestOptions } = require('../utils/clarifaiCalls')

module.exports.signin = (req, res) => {
    const { _id, email, name, entries, username, joined } = req.user;
    const { password } = req.body;
    if (!password || !username) {
        return res.status(400).json('Incorrect form submission');
    };
    const user = { _id, email, name, entries, username, joined }
    res.send(user);
};

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password, username } = req.body;
        if (!email || !name || !password || !username) {
            return res.status(400).json('Incorrect form submission');
        };
        const user = new User({ email, name, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) {
                next(err)
            }
            res.send(user)
        })
    } catch (err) {
        console.log(err)
    }
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return
        }
        res.send(req.user)
    });
};

module.exports.userProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.send(user)
};

module.exports.putImage = async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    try {
        user.entries++
        await user.save();
        res.send(user);
    } catch (e) {
        res.send(e)
    };
};

module.exports.imageSubmission = (req, res) => {
    const { input } = req.body;
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(input))
        .then(data => data.json())
        .then(data => {
            res.json(data)
        })
        .catch(e => res.status(400).json('unable to work with API'));
}

