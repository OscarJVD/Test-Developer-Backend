
            const mongoose = require("mongoose");
            const UserhistoricSchema = new mongoose.Schema({user: {
              type: mongoose.Types.ObjectId,
              ref: 'user',
            },
            
            historic: { type: Array, required: false }
          },{timestamps: true,strict: false});
            module.exports = mongoose.model('userhistoric', UserhistoricSchema);
          