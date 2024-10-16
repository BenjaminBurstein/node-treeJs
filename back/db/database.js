const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:tictactoehp@cluster0.kkows1p.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'hp_game'
}).then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Failed to connect to database:', err);
});

const getAllUsers = async (User) => {
    return new Promise((resolve, reject) => {
        try {
            const users = User.find({});
          resolve(users);
        } catch (e) {
            console.log("Error when gettings all users: ", e);
            reject(null);
        }
    })

}

const getUserById = (User, id) => {

        return new Promise( ((resolve, reject) => {
            try {
                const user = User.findOne({apiId: id}).exec();
                if (user !== null) {
                    resolve(user);
                }
                resolve(null);
            } catch (err) {
                console.log("Error when getting user by his token: ", err);
                reject(err);
            }
        }))


}

const createOrUpdateUser = async (User, userModelObject) => {
    try {
        const user = await User.findOne({ appId: userModelObject.appId });
        if (user.apiId === userModelObject.apiId) {
            console.log('user already in db');
        } else {
            // Create a new user with the given object
            const newUser = new User(userModelObject);
            await newUser.save();
            console.log('User created:', newUser);
        }
    } catch (err) {
        console.error('Error creating or updating user:', err);
    }
};

const updateLeaderboard = async (Leaderboard, leaderboardModelObject, victory) => {
    try {
        const userOnboard = await Leaderboard.findOne({user: leaderboardModelObject.user});
        if (userOnboard) {
            if (victory) {
                userOnboard.victory += 1;
            } else {
                userOnboard.loose += 1;
            }
            await userOnboard.save();
            console.log('Number of victory/loose updated:', userOnboard);
        } else {
            // Add a new user to the leaderboard
            const newUserboard = new Leaderboard(leaderboardModelObject);
            await newUserboard.save();
            console.log('New User added to the leaderboard:', newUserboard);
        }
    } catch (err) {
        console.error('Error while added or updating user on the leaderboard :', err);
    }
}

const getTop10Player = (Leaderboard) => {
    return new Promise((resolve, reject) => {
        try {
            const topUsersRequest = Leaderboard.aggregate([
                // Lookup the user details using objectId
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                // Flatten the user details array
                {
                    $unwind: "$user"
                },
                // Sort by victory in descending order, loose in ascending order and apiId in ascending order
                {
                    $sort: {
                        "victory": -1,
                        "loose": 1,
                        "user.apiId": 1
                    }
                },
                // Limit to the top 10 users
                {
                    $limit: 10
                },
                // Project the required fields
                {
                    $project: {
                        _id: 0,
                        "user.name": 1,
                        "user.house": 1,
                        "victory": 1,
                        "loose": 1,
                        "user.apiId": 1
                    }
                }
            ]);
            topUsersRequest.exec((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else if (!result || result.length === 0) {
                    console.warn("No results found!");
                    resolve([]);
                } else {
                    console.log(result);
                    resolve(result);
                }
            });
        } catch (e) {
            console.log("Error when getting top users: ", e);
            reject(e);
        }
    });
};


const getTopHouse = (Leaderboard) => {
    return new Promise((resolve, reject) => {
        try {
            const topHousesRequest = Leaderboard.aggregate([
                // Lookup the user details using objectId
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                // Flatten the user details array
                {
                    $unwind: "$user",
                },
                // Group by house and sum victories, userVictories, and user details
                {
                    $group: {
                        _id: "$user.house",
                        victories: { $sum: "$victory" },
                        userVictories: { $sum: { $cond: [ { $eq: [ "$user.house", "$_id" ] }, "$victory", 0 ] } },
                        user: { $push: "$user" },
                    },
                },
                // Sort by victories in descending order, then by userVictories in descending order,
                // then by loose in ascending order, and finally by apiId in ascending order
                {
                    $sort: {
                        victories: -1,
                        userVictories: -1,
                        "user.loose": 1,
                        "user.apiId": 1
                    },
                },
                // Project the required fields
                {
                    $project: {
                        _id: 0,
                        house: "$_id",
                        victories: 1,
                    },
                },
            ]);

            topHousesRequest.exec((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else if (!result || result.length === 0) {
                    console.warn("No results found!");
                    resolve([]);
                } else {
                    console.log(result);
                    resolve(result);
                }
            });
        } catch (e) {
            console.log("Error when getting top house: ", e);
            reject(e);
        }
    });
};

module.exports = { getAllUsers, getUserById, createOrUpdateUser, updateLeaderboard, getTop10Player, getTopHouse };
