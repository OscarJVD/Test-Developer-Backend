const mongoose = require("mongoose");
const util = require('util')
const fs = require('fs');
const bcrypt = require("bcrypt");
// const { base64ToBlob, blobToBase64 } = require('base64-blob')
// let b64toBlob = require('b64-to-blob');
// const b = require('based-blob');
// const { imageUpload } = require("../utils/functions");

const crudCtrl = {
  /**
   * @param {object} req
   * @param {object} res
   * @description This function write models with fs module and create collections and documents on MongoDB dinamically
  */
  createField: async (req, res) => {
    try {

      const { model, values, forallusersflag, newFields, fields, modelRef } = req.body;

      const isArrFields = Array.isArray(fields)
      const existsNewFields = newFields && newFields.length > 0 && Array.isArray(newFields)
      // && typeof newFields[0] == 'object'
      const newFieldsFlag = isArrFields && existsNewFields ? true : false

      // VALIDACIÓN DE DATOS NO VACIOS
      let fieldValues = Object.values(values), resReturnFlag = { bool: false, fieldName: '' }
      if (newFieldsFlag) {
        newFields.forEach(newField => {
          if (newField.required && !newField.value) {
            resReturnFlag.bool = true
            resReturnFlag.fieldName = newField.inputAndModelName + ' - ' + newField.title
          }
        })
      } else {
        fieldValues.map(value => {
          if (value == '' || !value) resReturnFlag.bool = true
        })
      }

      if (resReturnFlag.bool)
        return res.status(400).json({ msg: `${resReturnFlag.fieldName ? `El campo ${resReturnFlag.fieldName} es obligatorio.` : 'Todos los campos son obligatorios.'}` });
      // END VALIDACIÓN DE DATOS NO VACIOS

      let filter = {}

      if (!forallusersflag) {
        filter.user = req.authUser._id
      } else {
        if (req.authUser.role != 'admin')
          filter.user = req.authUser._id
      }

      let schemaDinamicObject = {}

      const dinamicSchemaCall = new mongoose.Schema(schemaDinamicObject, {
        timestamps: true,
        strict: false
      });

      const newSchemaProps = {
        user: req.authUser._id,
      }

      if (newFieldsFlag) {

        console.log('newFieldsFlag', newFieldsFlag)

        let newFieldsArrLength = newFields.length
        for (let i = 0; i < newFieldsArrLength; i++) {
          let legible = newFields[i]
          if (legible.inputType == 'password')
            newSchemaProps[legible.inputAndModelName] = await bcrypt.hash(legible.value, 12);
          else
            newSchemaProps[legible.inputAndModelName] = legible.value
        }
      } else {
        for (const key in values)
          newSchemaProps[key] = values[key]
      }

      console.log(util.inspect(newSchemaProps))

      let models = mongoose.modelNames()
      if (models.includes(model)) {
        const dinamicModelRef = require(`../models/${model}Model`)
        // The collection exists
        console.log(`Collection ${model} exists`);
        const newRow = new dinamicModelRef(newSchemaProps);
        await newRow.save();
        collectionExistsFlag = true;
      } else {
        // No se ha compilado el modelo
        delete mongoose.connection.models[model.charAt(0).toUpperCase() + model.slice(1)];
        const dinamicNewSchema = mongoose.model(model, dinamicSchemaCall);
        const newRow = new dinamicNewSchema(newSchemaProps);
        await newRow.save();

        const UppModelName = model.charAt(0).toUpperCase() + model.slice(1);

        let schemaObj = ``

        if (newFieldsFlag) {
          newFields.forEach(newField => {
            let type;

            if (newField.type == 'text' || newField.type == 'string' || newField.type == '') type = `String`
            if (newField.type == 'number' || newField.type == 0) type = `Number`

            schemaObj += `${newField.inputAndModelName}:
            { 
              type:  ${type}, 
              ${newField.required ? `required: ${`${newField.required ? `true` : `false`},`}` : ` `}
              ${newField.unique ? `unique: ${`${newField.unique}`},` : ` `}
              ${newField.trim ? `trim: ${`${newField.trim}`},` : ` `}
              ${newField.default ? `default: ${`${newField.default}`},` : ` `}
              ${newField.minlength ? `minlength: ${`${newField.minlength}`},` : ` `}
              ${newField.maxlength ? `maxlength: ${`${newField.maxlength}`},` : ` `}},`
          })
        } else {
          for (const keyField in fields) {
            schemaObj += `${keyField}:{type:  ${typeof fields[keyField] == 'string' ? `String` : `Number`}, required: true},`
          }
        }

        const fileContent = `
              const mongoose = require("mongoose");
              const ${UppModelName}Schema = new mongoose.Schema({${schemaObj}user: {
                type: mongoose.Types.ObjectId,
                ref: 'user',
              },
              historic: { type: Array, required: false }
            },{timestamps: true,strict: false});
              module.exports = mongoose.model('${model}', ${UppModelName}Schema);
            `;

        const filepath = `./models/${model}Model.js`;

        console.log(util.inspect(fileContent));

        fs.writeFileSync(filepath, fileContent, (err) => {
          if (err) throw err;

          console.log("The file was succesfully saved!");
        });
      }

      res.json({ msg: "Registro añadido" });
    } catch (error) {
      console.log('ERROR - ERROR - ERROR')
      console.log(util.inspect(error));
      console.log(error)
      return res.status(500).json({ msg: error.message });
    }
  },
   /**
   * @param {object} req
   * @param {object} res
   * @description This function get the information from the collection created dinamically
  */
  getDataField: async (req, res) => {

    const { model, forallusersflag, otherUser, fields, fieldsAndValues } = req.body;

    let filter = {}

    if (!req.authUser || !req.authUser._id)
      return res.status(400).json({ msg: "Por favor inicia sesión." });

    if (!forallusersflag) {
      filter.user = req.authUser._id
    } else {
      if (req.authUser && req.authUser.role != 'admin')
        filter.user = req.authUser._id
    }

    if (otherUser) filter.user = otherUser

    let isForIonix = true
    if (isForIonix) filter = {}

    const filePath = `./models/${model}Model.js`
    if (fs.existsSync(filePath)) {
      console.log("El archivo EXISTE! " + `../models/${model}Model`);
      const dinamicModelRef = require(`../models/${model}Model`)
      const data = await dinamicModelRef.find(filter).select("-password")

      res.json({
        msg: "Datos de los campos"
        , data
      });
    } else {
      console.log("El archivo NO EXISTE!");
      res.json({
        msg: "No hay datos aún"
      });
    }

  },
  /**
   * @param {object} req
   * @param {object} res
   * @description This function update the the information dinamically in the collection created
  */
  editRow: async (req, res) => {
    try {
      const { id } = req.params
      const { model, forallusersflag, values } = req.body;

      // console.log(model);
      // console.log(util.inspect(values))
      let entries = Object.entries(values)

      let resReturnFlag = false
      entries.map(input => {
        if (input[1] == '' || !input[1]) resReturnFlag = true
      })

      if (resReturnFlag) return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });

      let newValues = {}

      // let entriesLength = entries.length
      for (const key in values) {
        // if (typeof values[key] != 'object') {
        let mainKeyValue = typeof values[key] == 'object' ? values[key].value : values[key]
        if (key == 'password') {
          newValues[key] = await bcrypt.hash(mainKeyValue, 12);
        } else {
          newValues[key] = mainKeyValue
        }
      }

      console.log(util.inspect(newValues));

      let filter = { _id: id }

      if (!forallusersflag) {
        filter.user = req.authUser._id
      } else {
        if (req.authUser.role != 'admin')
          filter.user = req.authUser._id
      }

      if (model == 'user') delete filter.user
      // console.log(filter);
      const DinamicModelCall = require(`../models/${model}Model`)
      await DinamicModelCall.findOneAndUpdate(filter, newValues);

      // console.log(util.inspect(docUpdate));

      res.json({ msg: "Registro editado" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
   /**
   * @param {object} req
   * @param {object} res
   * @description This function creates a historic model and collection and delete the the information dinamically in the collection created
  */
  softDeleteRow: async (req, res) => {
    try {
      const { id } = req.params
      const { model, forallusersflag, item } = req.body;

      console.log('ITEM');
      console.log(util.inspect(item));
      console.log('END ITEM');

      let filter = { _id: id }

      if (!forallusersflag) {
        filter.user = req.authUser._id
      } else {
        if (req.authUser.role != 'admin')
          filter.user = req.authUser._id
      }

      const DinamicModelCall = require(`../models/${model}Model`)
      const row = await DinamicModelCall.findById(id)
      if (!row) return res.status(400).json({ msg: "Fila no encontrada. Error: FI001" });

      const test = mongoose.connection.db.listCollections({ name: model + 'historic' + 's' })
        .next(async function (err, collinfo) {
          console.log(`Collection ${model} doesnt exists`);
          let schemaDinamicObject = {}

          console.log('schemaDinamicObject', util.inspect(schemaDinamicObject));
          console.log(util.inspect(schemaDinamicObject));

          const dinamicSchemaCall = new mongoose.Schema(schemaDinamicObject, {
            timestamps: true,
            strict: false
          });

          const newSchemaProps = {
            user: req.authUser._id,
          }

          if (collinfo && collinfo.name == model + 'historics') {
            const dinamicModelRef = require(`../models/${model}historicModel`)
            // The collection exists
            console.log(`Collection ${model} exists`);
            // const newRow = new dinamicModelRef(newSchemaProps);
            // await newRow.save();
            await dinamicModelRef.update(
              {},
              { $push: { historic: item } }, { upsert: true }  // or $set
            );
            collectionExistsFlag = true;
          } else {
            // No existe
            delete mongoose.connection.models[model.charAt(0).toUpperCase() + model.slice(1) + 'historic'];

            newSchemaProps.historic = [item]
            const dinamicNewSchema = mongoose.model(model + 'historic', dinamicSchemaCall);
            const newRow = new dinamicNewSchema(newSchemaProps);
            await newRow.save();

            // await DinamicModelCall.update(
            //   filter,
            //   { $push: { historic: item } }, { upsert: true }  // or $set
            // );

            const UppModelName = model.charAt(0).toUpperCase() + model.slice(1) + 'historic';

            const fileContent = `
            const mongoose = require("mongoose");
            const ${UppModelName}Schema = new mongoose.Schema({${model}: {
              type: mongoose.Types.ObjectId,
              ref: '${model}',
            },
            
            historic: { type: Array, required: false }
          },{timestamps: true,strict: false});
            module.exports = mongoose.model('${model + 'historic'}', ${UppModelName}Schema);
          `;

            const filepath = `./models/${model}historicModel.js`;

            console.log(util.inspect(fileContent));

            fs.writeFileSync(filepath, fileContent, (err) => {
              if (err) throw err;

              console.log("The file was succesfully saved!");
            });
          }
        });

      await DinamicModelCall.findByIdAndDelete(item._id)

      return res.json({ msg: "Registro eliminado" });
    } catch (error) {
      console.log(error)
      console.log(util.inspect(error))
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = crudCtrl;