import { useEffect, useRef, useState } from "react";
import Tooltip from "react-simple-tooltip";
import { postDataAPI, postFormDataAPI, putDataAPI } from "../../utils/fetchData";
import { capFirstLetter, getRandomNum, imageUpload, sort } from "../../utils/functions";
import Approve from "../alert/Approve";
import MTable from './MTable';
import { Oval } from 'react-loader-spinner'
import Toast from "../alert/Toast";
import 'react-autocomplete-input/dist/bundle.css';
import { useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import ReactPasswordToggleIcon from "react-password-toggle-icon";
import SimpleModalWrapped from "../alert/Modal";
import imageCompression from 'browser-image-compression';
import { base64ToBlob, blobToBase64 } from 'base64-blob'

const Crud = ({ user, arr, limit, addstr, modelRef, forallusersflag, auth, model, fields, optional }) => {

  console.log(user)
  console.log(auth)
  let inputPasswordIconRef = useRef();
  let addRef = useRef()
  let inputsNewItemRef = useRef()
  let [addTitle, setAddTitle] = useState("")
  let [addTitleAlone, setAddTitleAlone] = useState("")
  let [addTxt, setAddTxt] = useState("Agregar")
  let [add, setAdd] = useState(false)
  let [showValidInputs, setShowValidInputs] = useState({ flag: false, str: '' })
  let [showLoader, setShowLoader] = useState(false)
  let [values, setValues] = useState(fields)
  let [mTableCols, setMTableCols] = useState([])
  let [readData, setReadData] = useState([])
  const [isArrFields, setIsArrFields] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [id, setId] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null)
  const dispatch = useDispatch();

  if (!model) model = 'user'
  if (!modelRef) modelRef = 'user'
  if (!forallusersflag) forallusersflag = false
  if (!optional) {
    optional = {
      withDetail: false,
      tableType: 'list'
    }
  }

  const handleEditItem = (item) => {
    // console.log(readData)
    console.log('item', item);
    console.log('values', values);
    console.log('fields', fields);
    setId(item._id);
    setAdd(true)

    let newObj = fields, isArrayObjFields = {}
    if (isArrFields || Array.isArray(fields)) {
      let newValues = []
      Object.entries(values).forEach(val => {
        newValues.push(val[1].inputAndModelName)
      })

      Object.keys(item).forEach(itemObjKey => {
        newValues.forEach(newValue => {
          if (itemObjKey == newValue) {
            isArrayObjFields[itemObjKey] = item[itemObjKey]
          }
        })
      })

      newObj = Object.assign({}, values, isArrayObjFields)

    } else {
      Object.keys(item).forEach(key => {
        if (fields.hasOwnProperty(key)) {
          newObj[key] = item[key]
        }
      })

      Object.keys(fields).forEach(key => {
        if (!item.hasOwnProperty(key)) {
          newObj[key] = ''
        }
      })

    }

    console.log('newObj', newObj);

    setValues(newObj)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const prepareDeleteItem = (item) => {
    console.log('item', item);
    console.log('values', values);
    console.log('fields', fields);
    setItemToDelete(item)
    handleClickOpen()
  };

  let randomKey = () => getRandomNum(1, 99999).toString() + getRandomNum(1, 99999).toString() + getRandomNum(1, 99999).toString()

  const getItems = async () => {

    let getObj = { model, fieldsAndValues: values, fields }

    if (auth.user._id !== user._id)
      getObj.otherUser = user._id

    let res = await postDataAPI('getDataField', getObj, auth.token)
    // console.log(res);
    if (res.data.data && res.data.data.length > 0) {
      // console.log(res.data.data)
      res = sort(res.data.data)
      // console.log(res)
      setReadData([...res])
      // console.log(res)

      let arrSimpleFieldsJoin = []

      if (fields && Array.isArray(fields)) {
        fields.map(field => {
          if (field.hasOwnProperty("tableShow") && field.tableShow == false) {
            return;
          } else {
            let newTitle = field.title.toLowerCase().trim().replace('un ', '').replace('tu ', '').trim()

            // SOLO VALIDACIÓN PARA TIPO DE CAMPOS LARGO
            let arrSimpleFieldsJoinProps = {
              field: field.inputAndModelName,
              title: capFirstLetter(newTitle)
            }

            // for (const key in values) {
            //   if(typeof values[key] == 'object' && valu.inputAndModelName ==  )
            // }

            if (field.inputType == 'image') {

              arrSimpleFieldsJoinProps.render = (rowData, index) => (
                <img key={index} src={rowData[field.inputAndModelName] ? rowData[field.inputAndModelName] : "https://res.cloudinary.com/solumobil/image/upload/v1639261011/user/icons8-usuario-masculino-en-c%C3%ADrculo-96_ipicdt.png"} alt="Avatar" style={{ width: '50px' }} />
              )
            }

            arrSimpleFieldsJoin.push(arrSimpleFieldsJoinProps)
          }
        })
      } else {
        Object.keys(fields).map(field => {
          Object.entries(addstr).map(titles => {
            if (field == titles[0]) {
              let newTitle = titles[1].replace('un, ').replace('tu', '').trim()
              arrSimpleFieldsJoin.push({
                field,
                title: capFirstLetter(newTitle)
              })
            }
          })
        })
      }

      let arrColumnsMTable = []

      arrSimpleFieldsJoin.map(field => {

        let arrColsTableProps = {
          title: field.title,
          field: field.field,
          render: field.render,
        }

        console.log(field)

        arrColumnsMTable.push(arrColsTableProps)
      })

      // Acciones
      arrColumnsMTable.push({
        title: '',
        field: 'anyany',
        render: (rowData, index) => (
          <div className="justify-content-center text-center d-flex align-items-center col-3" key={index}>
            <div className="row align-items-center text-center justify-content-center d-flex">

              <div className="col-md-5 align-items-center text-center justify-content-center d-flex m-1">
                <Tooltip content={`Editar fila`} placement="left" className="">
                  <i className="text-center border border-warning justify-content-center h-100 align-items-center d-flex edit-crud-btn  btn fas fa-edit text-warning pointer"
                    onClick={() => handleEditItem(rowData)}></i>
                </Tooltip>
              </div>

              <div className="col-md-5 align-items-center text-center justify-content-center d-flex m-1">
                <Tooltip content={`Eliminar fila`} placement="left" className="">
                  <i style={{
                    paddingRight: '1.07rem',
                    paddingLeft: '1.07rem'
                  }} className="delete-crud-button border border-danger text-center justify-content-center btn fas h-100 align-items-center d-flex fa-trash text-danger pointer"
                    onClick={() => { prepareDeleteItem(rowData); }}
                  ></i>
                </Tooltip>
              </div>
            </div>
          </div>
        ),
      })

      console.log('arrColumnsMTable', arrColumnsMTable)

      setMTableCols(arrColumnsMTable)
    }

    console.log('readData', readData, readData.data, model);
  }

  // EYE ICON
  const showIcon = () => (
    <i className="fas fa-eye pointer" aria-hidden="true"></i>
  );

  const hideIcon = () => (
    <i className="fas fa-eye-slash pointer" aria-hidden="true"></i>
  );
  // END EYE ICON

  useEffect(() => {
    /**
   *  Default validations
   */
    if (fields && Array.isArray(fields)) {
      setIsArrFields(true)
      console.log('isArrFields true')

      let errorFlag = { bool: false, msg: '' }
      fields.forEach(field => {
        if (field.hasOwnProperty('inputAndModelName')) {
          if (field['inputAndModelName'] == model) {
            errorFlag.bool = true;
            errorFlag.msg = `El modelo ${model} no puede ser igual al del campo ${field.hasOwnProperty('title') ? field.title : ''}`
            return console.error(errorFlag.msg)
          }
        }
      })

      if (errorFlag.bool == true) {
        return console.error(errorFlag.msg)
      }
    } else {
      setIsArrFields(false)
    }
    /**
   *  END -> Default validations
   */
  }, [])

  useEffect(() => {
    if (fields && Array.isArray(fields)) {
      setIsArrFields(true)
    } else {
      setIsArrFields(false)
    }

    getItems()

    let addString = addstr ? 'Agrega ' : 'Agregar'
    setAddTxt(addString);
    let str = '', strAlone = '', fieldTitleSet = new Set();

    if (Array.isArray(fields)) {
      fields.forEach((field, index) => {
        fieldTitleSet.add(field.title)
      })
    } else {
      Object.values(addstr).forEach((field, index) => {
        fieldTitleSet.add(field)
      })
    }

    let setFieldsToArray = Array.from(fieldTitleSet), fieldLength = setFieldsToArray.length

    setFieldsToArray.forEach((fieldTit, index) => {
      if (fieldLength - 2 == index) {
        str += fieldTit + ' y '
      } else if (fieldLength - 1 == index) {
        str += fieldTit
      } else {
        str += fieldTit + ', '
      }
    })

    setAddTitle(addString + ' ' + str)
    strAlone = capFirstLetter(str)
    setAddTitleAlone(strAlone)
  }, [])

  let manyDinamicFieldsFlag = false;
  if (typeof fields !== undefined && typeof fields == 'object' && fields) {
    manyDinamicFieldsFlag = true
  } else {
    if (!fields)
      return <span className="text-danger">INGRESA EL ID DEL CAMPO POR DEFECTO QUE SE VA A GENERAR DINAMICAMENTE</span>
  }

  if (!arr || arr.length <= 0 || Object.keys(arr).length <= 0) {

    const prepareNewItem = e => {
      e.preventDefault()
      setAdd(true)
      setId('')

      setTimeout(() => {
        console.log(inputsNewItemRef.current.children)
        if (inputsNewItemRef.current.children && inputsNewItemRef.current.children.length > 0) {
          Array.from(inputsNewItemRef.current.children).forEach((div, index) => {
            if (inputsNewItemRef.current.children[index].children[0] && inputsNewItemRef.current.children[index].children[0].type == 'text' && inputsNewItemRef.current.children[index].children[0].placeholder) {
              inputsNewItemRef.current.children[index].children[0].placeholder = inputsNewItemRef.current.children[index].children[0].placeholder.replace(/,/g, '')
            }
          })
        }
      }, 0.00001);

      let newArr = fields
      setValues(newArr)
    }

    const submitItem = async () => {
      try {
        console.log('item to save or edit', values)
        let newValues = {}, newFields = [], tempObj = [], formDataPostFlag = false;

        let valuesKeys = Object.keys(values)
        console.log(fields)

        let stopFlag = false, stopMsg = ''
        fields.forEach(field => {
          if (field.required)
            if (!valuesKeys.includes(field.inputAndModelName)) {
              stopFlag = true
              stopMsg = `El campo ${capFirstLetter(field.title.toLowerCase().replace('un ', '').replace('tu ', ''))} es requerido`
            }
        })

        // PREVALIDATION VALUES
        Object.entries(values).forEach((val) => {
          if (typeof val[1] != 'object') {
            console.log(val)
            // if (!val[1]) {
            //   stopFlag = true
            // }

            newValues[val[0]] = val[1]
          }
          else {
            // if (!val[1].value) {
            //   console.log(val)
            //   stopFlag = true

            // }
            tempObj.push(val[1])
          }
        })

        if (stopFlag)
          return dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { error: stopMsg ? stopMsg : 'Todos los campos son obligatorios' },
          });

        tempObj.forEach((val) => {
          Object.entries(values).forEach(valueObj => {
            if (val.inputAndModelName == valueObj[0]) {
              let newObj = {}
              newObj = val
              newObj["value"] = valueObj[1]
              newFields.push(newObj)
            }
          })
        })

        // VALIDAR CAMPOS VACIOS
        let entries = Object.entries(newValues)
        let resReturnFlag = false

        entries.map(input => {

          if (input[1] == '' || !input[1]) {
            resReturnFlag = true
            return dispatch({
              type: GLOBAL_TYPES.ALERT,
              payload: { error: 'Todos los campos son obligatorios' },
            });
          }
        })

        if (resReturnFlag) return;
        // END VALIDAR CAMPOS VACIOS

        // PRE SET EDIT
        let res, newArr = [], resMsg = '', idToEdit

        if (id) {
          idToEdit = id
          setAdd(false);
          setId('')
          newArr = []

          readData.forEach(row => {
            if (row._id == idToEdit) {
              Object.keys(values).forEach(key => {
                if (values[key] instanceof Blob) {
                  row[key] = URL.createObjectURL(values[key])
                } else {
                  row[key] = values[key]
                }
              })
              newArr.push(row)
            } else {
              newArr.push(row)
            }
          })

          setReadData(newArr);
        }

        // PRE SET EDIT

        // Subida de imagen
        let newFmtValues = values
        for (const key in values) {

          if (values[key].hasOwnProperty('value') && values[key].value instanceof Blob && values[key].value) {

            let media = await imageUpload([values[key].value]);
            let imageURL = media[0].url
            newFmtValues[key]['value'] = imageURL
          }

          if (!values[key].hasOwnProperty('value') && values[key] instanceof Blob && values[key]) {
            let media2 = await imageUpload([values[key]]);
            let imageURL2 = media2[0].url
            newFmtValues[key] = imageURL2
          }
        }

        delete newFmtValues.tableData
        setValues(newFmtValues);
        // END Subida de imagen

        newFields = newFmtValues

        if (id) {
          res = await putDataAPI(`editRow/${idToEdit}`, { model, values, forallusersflag }, auth.token)
          await getItems()
          resMsg = 'Editado'
        }

        if (!id) {
          setAdd(false);
          setId('')
          newArr = []
          readData.forEach(row => newArr.push(row))
          newArr.push(values)

          console.log(newArr);
          setReadData(newArr);

          res = await postDataAPI('createField', { model, values, fields, newFields, modelRef, forallusersflag }, auth.token)

          await getItems()
          resMsg = 'Creado'
        }

        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { success: resMsg },
        });

      } catch (error) {
        console.error(error)
      }
    }

    const handleChange = (e, objCustomInput = {}) => {

      let inputAttrs = {}
      if (typeof e == 'string') {
        inputAttrs = objCustomInput
      } else {
        inputAttrs = e.target
      }

      const { name, value } = inputAttrs

      console.log(name, value);
      console.log(values);
      setValues({ ...values, [name]: value });
      e.target.focus();
    }

    const handleImage = async (e) => {
      let image = e.target.files[0];

      console.log('image', image)
      console.log('image', image instanceof File)

      if (!image) {

        // debugger
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: 'La imagen no existe' },
        });
      }
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        // debugger
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: 'El formato de imagen puede ser .jpeg o .png' },
        });
      }

      if (image.size > 1024 * 1024 * 2)
        // 2mb
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            error: 'El tamaño maximo aceptado para la imagen es de 2mb',
          },
        });
      // IMG COMPRESOR
      let options = {
        maxSizeMB: 2, // 1
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      let compressedImage;
      if (image) compressedImage = await imageCompression(image, options);
      if (!compressedImage)
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: 'Error de compresión. Intentalo mas tarde' },
        });

      let definitiveImage = compressedImage
      console.log(compressedImage, "HPAPPAPA");

      let indexObjImage, newValuesObje = values;

      Object.entries(values).forEach((valu, index) => {
        newValuesObje[valu[0]] = valu[1]
        if (typeof valu[1] == 'object' && (valu[1].inputAndModelName == e.target.name || valu[1].inputAndModelName == e.target.name)) {
          newValuesObje[index].value = definitiveImage
        }
      })

      console.log(indexObjImage);

      setValues({ ...values, [e.target.name]: definitiveImage });
      // setValues({ ...values, [indexObjImage]: {["value"]: definitiveImage} });

      console.log(values);
    }

    const handleDialogClose = () => {
      setOpen(false);
    };

    const handleDelete = async (action) => {
      try {
        // await getItems()
        console.log(action)
        if (action == 'cancel') {
          setItemToDelete(null)
          handleDialogClose()
        } else {
          setShowLoader(true)
          // ACTUALIZAR ESTADO SIN EL ITEM ELIMINADO
          let newArr = []
          readData.forEach(row => {
            if (row._id != itemToDelete._id) newArr.push(row)
          })
          setReadData(newArr);
          // END ACTUALIZAR ESTADO SIN EL ITEM ELIMINADO

          handleDialogClose()
          console.log(itemToDelete)
          if (!itemToDelete) return console.error('Error, item no encontrado')
          if (!itemToDelete || !itemToDelete._id) {
            setTimeout(async () => {
              await putDataAPI(`softDeleteRow/${itemToDelete._id}`, { model, item: itemToDelete, forallusersflag }, auth.token)
            }, 1000);
          }
          await putDataAPI(`softDeleteRow/${itemToDelete._id}`, { model, item: itemToDelete, forallusersflag }, auth.token)
          await getItems()
          setShowLoader(false)

          // ACTUALIZAR ESTADO SIN EL ITEM ELIMINADO
          newArr = []
          readData.forEach(row => {
            if (row._id != itemToDelete._id) newArr.push(row)
          })
          setReadData(newArr);
          // END ACTUALIZAR ESTADO SIN EL ITEM ELIMINADO

          return dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { success: 'Eliminado' },
          });

        }
      } catch (error) {
        console.error(error);
        throw error
      }
    };

    const handleCancelAdd = () => {
      setAdd(false);
      setId('');
    }

    console.log('fields', fields);

    return (
      <>
        <div className="w-100 p-4">
          <SimpleModalWrapped />

          {
            showValidInputs.flag &&
            <Toast
              msg={{ title: showValidInputs.str, body: "" }}
              handleShow={() => {
                setShowValidInputs(false);
                dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
              }}
              bgColor="bg-danger"
              onlyTitle={true}
            />
          }

          <Approve
            desc={`¿Estás seguro de que desea eliminar la fila ${itemToDelete && Object.values(itemToDelete)[1] ? 'con id terminado en: ...' + Object.values(itemToDelete)[1].slice(19, Object.values(itemToDelete)[1].length) + '?' : ''}`}
            isOpen={isOpen}
            handleClose={handleDialogClose}
            handleAction={handleDelete}
          />

          <div className={`input-group ${add ? '' : 'd-none'}`}>

            {/* INPUTS */}
            <div ref={inputsNewItemRef} className="justify-content-center" style={{ display: 'contents' }}>
              {
                manyDinamicFieldsFlag
                  ?
                  (
                    isArrFields || Array.isArray(fields)
                      ?
                      fields.map((field, index) => ( // En construcción lo dinamico muy dinamico
                        <div className="col-12 my-1" key={index}>

                          {
                            ((field.inputType == 'text' || field.inputType == 'string' || !field.inputType) &&
                              <input
                                type="text"
                                value={values[field.inputAndModelName]}
                                id={field.inputAndModelName}
                                name={field.inputAndModelName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={`Ingresa ${field.title.toLowerCase()}`}
                              />
                            )
                          }

                          {
                            ((field.inputType == 'image') &&

                              <div className="mb-3">
                                <label htmlFor={field.inputAndModelName} className="form-label">{`Ingresa ${field.title.toLowerCase()}`}</label>
                                <input
                                  type="file"
                                  // value={values[field.inputAndModelName]}
                                  id={field.inputAndModelName}
                                  name={field.inputAndModelName}
                                  onChange={handleImage}
                                  className="form-control"
                                  placeholder={`Ingresa ${field.title.toLowerCase()}`}
                                />
                              </div>
                            )
                          }

                          {
                            ((field.inputType == 'password') &&

                              <div className="form-group">
                                <div className="position-relative">
                                  <input
                                    type="password"
                                    ref={inputPasswordIconRef}
                                    value={values[field.inputAndModelName]}
                                    id={field.inputAndModelName}
                                    name={field.inputAndModelName}
                                    onChange={handleChange}
                                    className="form-control my-2"
                                    placeholder={`Ingresa ${field.title.toLowerCase()}`}
                                  />

                                  <ReactPasswordToggleIcon
                                    inputRef={inputPasswordIconRef}
                                    showIcon={showIcon}
                                    hideIcon={hideIcon}
                                  />
                                </div>
                              </div>
                            )
                          }

                        </div>
                      ))
                      :
                      Object.keys(fields).map((field, index) => ( // En construcción lo dinamico muy dinamico
                        <div className="col-12 my-1" key={index}>

                          {
                            field.inputType == 'text' || !field.inputType &&
                            <input
                              type="text"
                              value={values[field]}
                              // id={field}
                              name={field}
                              onChange={handleChange}
                              className="form-control"
                              placeholder={
                                Object.entries(addstr).map(placeholder => {
                                  if (placeholder[0] == field)
                                    return ('Ingresa ' + (placeholder[1] != ',' ? placeholder[1].replace(/,/g, '') : '').replace(' - ', '').replace(" y", "y")).replace(/,/g, '')
                                })
                              }
                            />
                          }
                        </div>
                      ))
                  )
                  :
                  // Nunca va a llegar acá
                  <div className="col-12 my-1">
                    <input type="text" value={values[Object.keys(fields)[0][0]]} id={Object.keys(fields)[0][0]} name={Object.keys(fields)[0][0]} onChange={handleChange}
                      className="form-control"
                      placeholder={`Ingresa ${Object.entries(addstr)[0][1].replace(/,/g, '')}`}
                    />
                  </div>
              }
            </div>
            {/* END INPUTS */}

            {/* SAVE - EDIT - CANCEL BUTTON */}
            <div className="col-12 justify-content-center text-center mt-2 mb-3">
              <Tooltip content="Guardar" placement="bottom">
                <button
                  type="button"
                  onClick={submitItem}
                  className={`btn btn-${id ? 'warning' : 'primary'} btn-sm text-initial`}
                >
                  <i className={`fas fa-${id ? 'edit' : 'save'}`}></i> {id ? 'Editar' : 'Guardar'}
                </button>
              </Tooltip>

              <Tooltip content="Cancelar" placement="bottom">
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="btn btn-danger btn-sm text-initial ms-2"
                >
                  <i className="fas fa-window-close"></i> Cancelar
                </button>
              </Tooltip>
            </div>
          </div>
          {/* END SAVE - EDIT - CANCEL BUTTON */}

          {/* ADD NEW REGISTER BUTTON */}
          <div className={`mb-3 ${optional && optional.textAddBtnType && optional.textAddBtnType != 'simple' ? 'text-left justify-content-start' : 'text-right justify-content-end float-right'}`}>
            {
              !optional || optional.addBtnType == 'a' || !optional.hasOwnProperty('addBtnType') &&
              ((!forallusersflag && user && user.username === auth.user.username) && (readData.length < limit || !limit)) &&
              <a href="#" className={`h-100 d-flex align-items-center ${add ? 'd-none' : ''}`} onClick={prepareNewItem}>
                <i className="fas fa-lg fa-plus-circle"></i>&nbsp;
                <span ref={addRef}>
                  {optional && optional.textAddBtnType && optional.textAddBtnType != 'simple' ? addTitle : 'Nuevo'}
                </span>
              </a>
            }

            {
              optional && optional.addBtnType == 'button' &&
              ((!forallusersflag && user && user.username === auth.user.username) && (readData.length < limit || !limit)) &&
              <button className={`btn btn-primary h-100 d-flex align-items-center ${add ? 'd-none' : ''}`} onClick={prepareNewItem}>
                <i className="fas fa-lg fa-plus-circle"></i>&nbsp;
                <span ref={addRef}>
                  {optional && optional.textAddBtnType && optional.textAddBtnType != 'simple' ? addTitle : 'Nuevo'}
                </span>
              </button>
            }
          </div>

          {
            !forallusersflag &&
            <div className="mt-2 w-100">
              {
                optional.tableType == 'list' &&
                <>
                  {
                    !showLoader && readData.map((item, index) => (
                      <div className="row w-100 ms-1 my-2 border card-crud p-2" style={{ overflow: 'hidden' }} key={randomKey()}>
                        <div className={`mb-2 col-${(!forallusersflag && user && user.username !== auth.user.username) ? '12' : '9'}`}>
                          {
                            isArrFields || Array.isArray(fields)
                              ? fields.map((fieldMap, fieldIndex) => (
                                <div key={randomKey()}>

                                  {
                                    fieldMap.inputType == 'password' &&
                                    <input type="password" className="form-control border-0 d-block ps-0 pb-0 mb-0" disabled value={item[fieldMap.inputAndModelName]} />
                                  }

                                  {
                                    fieldMap.inputType != 'password' &&
                                    <p
                                      className={`fs-6 fw-semi-bold border-bottom ${fieldIndex > 0 ? 'mt-2' : ''} pb-0 mb-0 ${fieldIndex == 0 ? 'pt-2' : ''}`}
                                      style={{ wordWrap: 'break-word' }}>
                                      {
                                        item[fieldMap.inputAndModelName]
                                      }
                                    </p>
                                  }

                                  <span className="fw-bold text-muted p-0 fs-8 fst-italic text-capitalize">
                                    {fieldMap && fieldMap.title && fieldMap.title.replace('un', '')}
                                  </span>
                                </div>
                              ))
                              : Object.keys(fields).map((fieldMap, fieldIndex) => (
                                <div key={randomKey()}>
                                  <p className={`fs-6 fw-semi-bold border-bottom ${fieldIndex > 0 ? 'mt-2' : ''} pb-0 mb-0 ${fieldIndex == 0 ? 'pt-2' :
                                    ''}`} style={{ wordWrap: 'break-word' }} key={randomKey()}>{item[isArrFields || Array.isArray(fields) ? fieldMap : fieldMap]}</p>
                                  {
                                    <span className="fw-bold text-muted p-0 fs-8 fst-italic text-capitalize">
                                      {
                                        readData && readData.length > 0
                                          ? Object.entries(addstr).map(placeholder => {
                                            return placeholder[0] == fieldMap
                                              ? (Object.keys(addstr).length == 2 ? placeholder[1].replace('tu', '').replace('-', '').replace(' - ', '').replace('>', '').replace('y', '')
                                                : placeholder[1].replace('tu', '')).replace('-', '').replace(' - ', '').replace('>', '').replace('y', '') : ''
                                          })
                                          : Object.entries(addstr).map(placeholder => {
                                            return placeholder[0] == fieldMap
                                              ? (Object.keys(addstr).length == 2
                                                ? placeholder[1].replace('-', '').replace(' - ', '').replace('>', '').replace('y', '')
                                                : placeholder[1]).replace('-', '').replace(' - ', '').replace('>', '').replace('y', '')
                                              : ''
                                          })
                                      }
                                    </span>
                                  }

                                </div>
                              ))
                            //  END READ
                          }
                        </div>

                        {
                          !forallusersflag && user && user.username === auth.user.username && <>
                            <div className="justify-content-center text-center d-flex align-items-center col-3" key={randomKey()}>
                              <div className="row align-items-center text-center justify-content-center d-flex">

                                <div className="col-md-5 align-items-center text-center justify-content-center d-flex m-1">
                                  <Tooltip content={`Editar fila`} placement="left" className="">
                                    <i className="text-center border border-warning justify-content-center h-100 align-items-center d-flex edit-crud-btn  btn fas fa-edit text-warning pointer"
                                      onClick={() => handleEditItem(item)}></i>
                                  </Tooltip>
                                </div>

                                <div className="col-md-5 align-items-center text-center justify-content-center d-flex m-1">
                                  <Tooltip content={`Eliminar fila`} placement="left" className="">
                                    <i style={{
                                      paddingRight: '1.07rem',
                                      paddingLeft: '1.07rem'
                                    }} className="delete-crud-button border border-danger text-center justify-content-center btn fas h-100 align-items-center d-flex fa-trash text-danger pointer"
                                      onClick={() => { prepareDeleteItem(item); }}
                                    ></i>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </>
                        }
                      </div>
                    ))
                  }

                  <div className={`d-flex justify-content-center ${showLoader ? ' ' : 'd-none'}`}>
                    <Oval
                      height="70"
                      width="70"
                      color='grey'
                      ariaLabel={`Cargando ${addTitleAlone}`}
                    />
                  </div>

                </>
              }

              {
                optional.tableType == 'table' &&
                <MTable
                  title={<h3 className='text-uppercase'>{optional.generalTitle}</h3>}
                  data={readData}
                  columns={mTableCols}
                />
              }

            </div>
          }
        </div>

      </>
    )
  }
}

export default Crud