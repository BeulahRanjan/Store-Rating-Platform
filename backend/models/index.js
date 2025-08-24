const User = require('./userModel');
const Store = require('./storeModel');
const Rating = require('./ratingModel');


User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });


Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });


User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { User, Store, Rating };
