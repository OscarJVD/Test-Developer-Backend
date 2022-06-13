
              const mongoose = require("mongoose");
              const PersonalemailSchema = new mongoose.Schema({personalemail:{type:  String, required: true},user: {
                type: mongoose.Types.ObjectId,
                ref: 'user',
              },
              historic: { type: Array, required: false }
            },{timestamps: true,strict: false});
              module.exports = mongoose.model('personalemail', PersonalemailSchema);
            