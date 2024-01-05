const User = require("../models/UserModel");
const bcrypt = require("bcrypt"); //ma hoa mat khau
const { genneralAccessToken } = require("./JwtService");

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

            const hash = bcrypt.hashSync(password, 10);

            const createUser = await User.create({
                name,
                email,
                password: hash,
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

const loginUser = (loginUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = loginUser;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message:
                        "The email address or password is incorrect. Please retry...",
                });
            }

            //sau khi ktra login hop le
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (userID, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: userID });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "User is not exists",
                });
            }
            const updateUser = await User.findByIdAndUpdate(userID, data, {
                new: true,
            });
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateUser,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: userID });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "User is not exists",
                });
            }
            await User.findByIdAndDelete(userID);
            resolve({
                status: "OK",
                message: "Delete user successfully",
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await User.find();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: result,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const detailUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await User.findById(userID);
            resolve({
                status: "OK",
                message: "SUCCESS",
                result,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { createUser, loginUser, updateUser, deleteUser, getAllUsers, detailUser };
