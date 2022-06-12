import React from 'react';
import { useSelector } from 'react-redux';
import Crud from '../components/dinamic/Crud';

const Home = () => {

  const { auth } = useSelector((state) => state);

  return (
    <div>

      {/* <Crud
        user={auth.user}
        model="user"
        fields={{ firstname: '', lastname: '', username: '', email: '', avatar: '', mobile: '' }}
        addstr={{ firstname: 'tu primer nombre', lastname: 'segundo nombre', username: 'usuario', email: 'correo', avatar: 'avatar', mobile: 'teléfono' }}
        auth={auth}
        optional={{
          tableType: 'table',
          generalTitle: 'Usuarios',
          addBtnType: 'button',
          textAddBtnType: 'simple'
        }}
      /> */}

      <Crud
        model="user" // Nombre de la tabla
        fields={[
          {
            inputAndModelName: 'firstname', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: "Tu primer nombre",
            required: true,
            regex: '^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$',
            unique: false,
          },
          {
            inputAndModelName: 'lastname', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: "segundo nombre",
            required: true,
            unique: false,
          },
          {
            inputAndModelName: 'username', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: 'usuario',
            required: true,
            unique: false,
          },
          {
            inputAndModelName: 'email', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: 'correo',
            required: true,
            unique: false,
          },
          {
            inputAndModelName: 'avatar', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: 'avatar',
            required: true,
            unique: false,
          },
          {
            inputAndModelName: 'mobile', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'text',
            title: 'teléfono',
            required: true,
            unique: false,
          },
          {
            inputAndModelName: 'password', // it would be differente to the parent model. It needs de validation
            type: 'text',
            inputType: 'password',
            title: 'contraseña',
            required: true,
            unique: false,
            tableShow: false
          },
        ]}
        auth={auth}
        user={auth.user}
        optional={{
          tableType: 'table',
          generalTitle: 'Usuarios',
          addBtnType: 'button',
          textAddBtnType: 'simple'
        }}
      />
    </div>
  );
}

export default Home;
