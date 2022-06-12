import { Route, Redirect } from 'react-router-dom'

const PrivateRouter = ( props ) => {
  const firstLogin = localStorage.getItem('firstSlidesLogin')
  return firstLogin ? <Route sensitive {...props} /> : <Redirect to='/' />
}

/**
 * sensitive  -> Cuándo true, coincidirá si la ruta distingue entre mayúsculas y minúsculas .
 */

export default PrivateRouter
