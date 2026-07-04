import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

function UserProfile() {
  //Estos son los minimos estados que necesitas para esta página, puedes agregar más si lo consideras necesario
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [minutes, setMinutes] = useState(1)

  // TODO 1: Lectura de sesión, setear token en estado. 
  useEffect(() => {
    // COMPLETA AQUÍ
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken)
    if (accessToken) {
      setToken(accessToken);
      fetchUserData(accessToken);
    }

  }, [])

  // TODO 2: Contador de expiración si es que hay token seteado
  useEffect(() => {
    if (!token) return

    const timer = setInterval(() => {
      const decoded = jwtDecode(token) as { exp: number }; // Aquí necesitamos el tiempo de expiración si o si
      const currentTime = Math.floor(Date.now()/1000);
      const difference = decoded.exp - currentTime

      if (difference > 0){ // Si todavía hay tiempo, fijarlo en el contador.
        const hours = Math.floor(difference / 3600).toString().padStart(2, '0')
        console.log(hours)
        const mins = Math.floor((difference % 3600) / 60).toString().padStart(2, '0') // esto es muy intro a la progra pero se me había olvidado xd
        console.log(mins)
        const secs = (difference % 60).toString().padStart(2, '0')
        console.log(secs)
        setTimeLeft(`${hours}:${mins}:${secs}`)
        console.log(`${hours}:${mins}:${secs}`)
      }
      else{ // En caso contrario, chau
        setTimeLeft('Expirado')
        clearInterval(timer)
      }

    }, 1000);
    // COMPLETA AQUÍ
    return () => clearInterval(timer) 
  }, [token])

  // TODO 3: Carga de datos del usuario con request a la API dummyjson (pueden ver su documentación), incluyendo el authorization token
  // https://dummyjson.com/docs/auth (Esta hecho con fetch pero para adaptar a axios es usar Get con el bearer token en headers)
  const fetchUserData = async (accessToken) => {
    // COMPLETA AQUÍ
    try {
      const response = await axios.get('https://dummyjson.com/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUser(response.data);
    }
    catch (error) {
      setError('No se pudo cargar los datos del usuario')
    }
  }

  // TODO 4: Refresco de ambos tokens, con el tiempo definido desde frontend (Tip: el tiempo recibido no afecta a ambos)
  const refreshTokens = async () => {
    // COMPLETA AQUÍ

    try {
      const response = await axios.post('https://dummyjson.com/auth/refresh', {
        refreshToken: Cookies.get('refreshToken'),
        expiresInMins: minutes,
      });
      const { accessToken, refreshToken } = response.data
      //actualizar cookies
      const decoded = jwtDecode(accessToken) as { exp?: number }
      if (decoded.exp) {
        Cookies.set('accessToken', accessToken, { expires: new Date(decoded.exp * 1000) })
        Cookies.set('refreshToken', refreshToken, { expires: 7 })
      }
      setToken(accessToken)
      setError('')
    }
    catch (error) {
      setError('No se pudo refrescar los tokens.')
    }
  }

  // TODO 5: Cerrar sesión
  const logout = () => {
    // COMPLETA AQUÍ
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('rememberMe')
    setToken('')
    setUser(null)
    window.location.href = '/'
  }

  if (token === '') return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">No autenticado</h2>
          <p className="text-gray-300">Por favor, inicia sesión para ver tu perfil.</p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold rounded-lg transition-all hover:opacity-90">
            Volver al Login
          </a>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
                <p className="text-gray-400 text-sm">Información de tu cuenta</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded-lg text-sm font-semibold transition-all"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Información Personal
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Nombre</p>
                    <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Usuario</p>
                    <p className="text-white font-semibold">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Email</p>
                    <p className="text-white font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Género</p>
                    <p className="text-white font-semibold">{user.gender === 'female' ? 'Femenino' : 'Masculino'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">ID</p>
                    <p className="text-white font-semibold">#{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Sesión Activa
                </h2>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Token de Acceso</p>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-3 font-mono text-xs text-cyan-400 break-all max-h-24 overflow-y-auto">
                    {token}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Tiempo Restante</p>
                  <div className="bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white font-bold text-lg">{timeLeft}</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414l1-1A1 1 0 0011 9.414V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Renovar Sesión
                </h2>
                <p className="text-gray-400 text-sm">Selecciona cuántos minutos deseas que sea válido el nuevo token</p>
                <div className="flex gap-3">
                  <select
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-slate-900">
                        {i + 1} minuto{i !== 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={refreshTokens}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center gap-2 font-bold text-white hover:opacity-90 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Renovar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-25 animate-pulse"></div>
              <p className="text-gray-300">Cargando información del usuario...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}

export default UserProfile
