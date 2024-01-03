const User = require("../models/UserModel");
const bcrypt = require("bcrypt");  //ma hoa mat khau

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });

            if (checkUser !== null) {
                //email da ton tai
                resolve({
                    status: "OK",
                    message: "Email already exists",
                });
            }
     
            const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds)
            
            const createUser = await User.create({
                name,
                email,
                password,
                confirmPassword,
                phone,
            });
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createUser,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { createUser };
