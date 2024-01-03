const UserService = require ("../services/UserService.js")
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        const isCheckEmail = regexEmail.test(email)
        if ( !name || !email || !password || !confirmPassword || !phone ) {
            return res.status(200).json ({
                status: `ERR`,
                message: "The input is requied"
            })
        } else if (!isCheckEmail) {
            return res.status(200).json ({
                status: `ERR`,
                message: "Email is not valid"
            })
        }
        else if (password != confirmPassword) {
            return res.status(200).json ({
                status: `ERR`,
                message: "Confirm password is not correct"
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json (response)
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

module.exports = {createUser}
