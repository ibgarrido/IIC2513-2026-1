import { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  // Estos son los estados mínimos que necesitas para esta página, puedes agregar más si lo consideras necesario
  const [email, setEmail] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // NO MODIFICAR LA PRIMERA PARTE DE ESTE USE EFFECT:
  // esto verifica si ya existe un token válido al montar la página, redirigiendo directamente a vista user. 
  // Deben implementar el flujo con refresh token.
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = Cookies.get('accessToken')
      
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken) as { exp?: number }
          
          // Verificar si el token aún no ha expirado
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            console.log('Token válido encontrado, redirigiendo a /user')
            navigate('/user')
            return
          } else {
            // Token expirado, eliminarlo
            console.log('Token expirado, eliminando cookie')
            Cookies.remove('accessToken')
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error)
          Cookies.remove('accessToken')
        }
      }

      // TODO 0: Si no hay accessToken válido, verificar si existe refreshToken, 
      // y si existe, intentar obtener un nuevo accessToken usando el refreshToken, actualizando ambos
      
      const refreshToken = Cookies.get('refreshToken')
      if (refreshToken) {
        try {
          // COMPLETA AQUÍ el request al endpoint de refresh de dummyjson
          const response = await axios.post('https://dummyjson.com/auth/refresh', {
            refreshToken,
            expiresInMins: 1,
          });
          // Si es exitoso, extrae ambos, decodifícalos,
          const { accessToken: newAccess, refreshToken: newRefresh } = response.data
          console.log(response.data)
          const decoded = jwtDecode(newAccess) as { exp?: number }
          // y guárdalos en cookies según el valor de rememberMe 
          // (puedes asumir que es true para este caso, ya que había un refresh token guardado)
          if (decoded.exp){
            Cookies.set('accessToken', newAccess, { expires: new Date(decoded.exp * 1000) }) //hay que multiplicar el tiempo *1000 ya que JS trabaja en milisegundos y jwt en segundos
            Cookies.set('refreshToken', newRefresh, { expires: 7 })
            // Redirige a /user
            navigate('/user')
          }  
        } catch (error) {
          console.error('Error al refrescar el token:', error)
          // Eliminar ambas cookies si falla el refresh
          Cookies.remove('refreshToken')
          Cookies.remove('accessToken')
        }
      }
    }

    checkTokenValidity()
  }, [navigate])
  const handleSubmit = async (e) => {
    e.preventDefault()

    // TODO 1: Inicia el estado de carga y limpia errores previos
    // (si los declaraste en el estado)

    try {
      // TODO 2: Realiza una solicitud POST a 'https://dummyjson.com/auth/login'
      const response = await axios.post('https://dummyjson.com/auth/login', {
            username: email,
            password:password,
            expiresInMins: 1, //RECORDAR: le puso 1 para debugear mientras
          }); 
    // COMPLETA AQUÍ

      // TODO 3: Extrae accessToken y refreshToken de la respuesta
      const { accessToken, refreshToken } = response.data // COMPLETA AQUÍ


      // TODO 4: Decodifica el accessToken con jwtDecode

      //COMPLETAR AQUÍ
      const decoded = jwtDecode(accessToken) as { exp?: number }

      // TODO 5: Setea el accesToken según su expiración

      //COMPLETAR AQUÍ
      if (decoded.exp) {
        Cookies.set('accessToken', accessToken, { expires: new Date(decoded.exp * 1000) })
      }
      
      // TODO 6: Según el valor de rememberMe, setea el refreshToken con o sin persistencia

      //COMPLETAR AQUÍ
      if (rememberMe) {
        Cookies.set('refreshToken', refreshToken, { expires: 7 })
      } else {
        Cookies.set('refreshToken', refreshToken) //Si es falso, persistente.
      }
      // TODO 7: Redirige al usuario a la ruta '/user'
      navigate('/user')
      //COMPLETAR AQUÍ

    } catch (error) {
      // TODO 8: Muestra el error en pantalla
      // COMPLETA AQUÍ
      setError('Credenciales inválidas. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">Bienvenido</h1>
            <p className="text-gray-300 text-sm font-medium">Accede a tu cuenta para continuar</p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm font-medium animate-shake">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <input
                id="email"
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Usuario"
                className="peer w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300"
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 text-xs font-semibold text-cyan-400 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              >
                Usuario
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
            </div>

            <div className="group relative">
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Contraseña"
                className="peer w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300"
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 text-xs font-semibold text-cyan-400 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              >
                Contraseña
              </label>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    className="absolute w-full h-full opacity-0 cursor-pointer peer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 border border-white/30 rounded-lg bg-white/5 peer-checked:bg-gradient-to-br peer-checked:from-cyan-400 peer-checked:to-blue-600 peer-checked:border-transparent transition-all duration-300 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Recuérdame</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition duration-300 hover:opacity-90 disabled:opacity-50"
            >
              <span className="text-base font-bold">
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </span>
              {!loading && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </form>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">
            </p>
            <div className="text-xs text-gray-500">
              <p className="font-semibold text-cyan-400/70 mb-2">¿Necesitas usuarios de prueba? <a href="https://dummyjson.com/users" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400 transition-colors">Haz clic aquí</a></p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}

export default LoginPage
