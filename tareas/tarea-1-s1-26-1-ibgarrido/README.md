[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/hL5YPVWS)
# Tarea 1 :construction:

* :pencil2: **Nombre:** Ignacio Garrido Bobadilla
* :pencil2: **Correo:** ibgarrido@uc.cl

## Código :symbols:

### :computer: Cómo ejecutar este código [1 Punto]

Se debe hacer git clone del repositorio y luego hacer:

1. mover a la carpeta:
```
cd tarea-1-s1-26-1-ibgarrido/

```
2. Para instalar dependencias base.
```
npm install

```

3. Como es un proyecto en Vite:
```
npm run dev

```

### :teacher: Explicación del funcionamiento del código. Como mínimo, especificar pages utilizadas, los modales que usa cada uno, cómo está estructurado el código si tienen nuevos/distintos archivos o carpetas, etc.  [2.5 Puntos]

- El código HTML de los return sigue una estructura basada en la metolodogía [BEM](https://en.bem.info/methodology/quick-start/), para mejor legibilidad.
- Para hacer llamados a la API se utilizó exclusivamente la librería axios, tal como lo permite el enunciado.

**Pages**

# 📄 Pages

## 1.Landing (`Landing.jsx` / `Landing.css`)

- Corresponde al landing de la página web. Solo carga el Navbar sin datos de usuario junto al contenido HTML propio de la página.

---

## 2.Login (`Login.jsx` / `Login.css`)

- Corresponde a la página de **inicio de sesión**. Mediante dos **UseState** para el usuario y contraseña, utiliza la función asincrónica **HandleLogin** que procesa el método POST del login de la API. Además guarda el Token en el LocalStorage para ser usado con el método GET de la API al cargar los datos de usuario en el MarketPlace.

---

## 3.MarketPlace(`ArtistMarketPage.jsx` / `ArtistMarketPage.css`)

- Corresponde a la página principal de artistas a la venta. El código se basa en 4 funciones:
    1. **fetchProfile**: Se ejecuta automáticamente al cargar la página mediante un useEffect. Verifica el token de sesión y hace un GET a la API para cargar los datos actuales del usuario (nombre y saldo de DCCoins).
    2. **fetchArtist**: Se encarga de traer la lista de artistas desde la API filtrando por página y texto de búsqueda. Está envuelta en un hook useCallback para memorizarla y evitar ciclos infinitos de re-renderizado en el grid.
    3. **HandleBuyArtist /handleSellArtist** : Permiten obtener los datos del usuario a través de un llamado POST a la API. Con estos datos se actualiza el ArtisCard y ArtistCardModal en la ventana de adquisición de un contrato con un artista.

* Aquí se utiliza ArtistCard para represnetar a los artistas en "cards" que van metidas en la grilla, mientras que el ArtistCardModal entrega información en detalle y la posibilidad de contratar a un artista.

---

## 4. MyArtists (`MyArtistsPage.jsx` / `MyArtistsPage.css`)

- Corresponde a la página que permite manejar los artistas adquiridos y la edición de estos:
    1. **fetchProfile**: usamos callback al cargar el perfil para poder reutilizar la función después de crear/vender/editar artistas.
    2. **fetchMyArtist**: Misma lógica que en el Market, la idea es poder reutilizar la función que trae los artistas al crear/vender/editar.
    3.**HandleCreateArtist**: Se pasa como prop al ArtistFormModal, el cual lo ejecuta al hacer submit con los datos del formulario. Luego de crear el artista, se recarga el perfil (para actualizar balance) y la grilla de mis artistas, y se cierra el modal.
    4. **HandleSellArtist**: Sigue la misma lógica de la misma función definida en MarketPlace.
    5. **HandleDeleteArtist**: se llama desde el modal de artista seleccionado, el cual solo se puede abrir si el artista es adquirido.
    6. **HandleUpdateArtist**: se encarga de enviar la petición de actualización a la API, y luego recargar el perfil y los artistas para reflejar los cambios, y también maneja errores de validación.

* Aquí usamos ArtistCard con el mismo propóito, mientras que ArtistCardModal da la opción de vender, eliminar y editar el artista. por otra parte ArtistFormModal se utiliza para poder gestionar la edición de artistas o bien la creación de uno nuevo.
## 5. Components

- ArtistCard: Fue modificada para recibir todos los datos del artista, y un Booleano para abrir el CardModal
- ArtistCardModal: Recibe los datos del artista, y tiene dos visualizaciones: Si no somos dueños del artista, solo permite adquirirlo y ver los datos, y si somos dueño del artista permite vender, eliminar y editar.
- ArtistFormModal: En base a la Prop Initial Values permite: Si es Null, entrar en modo crear usuario, y si contiene una lista con datos de artista, permite modificarlos.
- NavBar: Posee dos modos. Si no hay logeo aún, solo muestra el ícono de la página junto a la barra y un botón que redirige al login. Si hay logeo, muestra adicionalmente los datos de usuario y un botón de logout.


### :warning: Funcionalidades implementadas y no implementadas (basado en la rúbrica del enunciado)
✅ Logrado | ⚠️ Semilogrado |  No logrado

Base tarea:

- Navbar: ✅
- Landing Page: ✅
- Página Login: ✅
- MainPage: ✅
- MyArtistPage: ✅
- ArtistCard: ✅
- ArtistCardModal: ✅
- ArtistFormModal: ✅
- SearchBar: ❌

Bonus:

- ConfirmActionModal: ❌
- StatusMessageModal: ❌


## Reflexión :thought_balloon: [3.5 Puntos]

### :scroll: ¿Para que utilizamos *async* y *await* en las funciones? [1 Punto]

La conexión con APIs que manejan bases de datos suele tomar tiempo (No es instanáneo, sino que dependiendo de distintas variables como la cantidad de datos o el flujo de personas haciendo llamadas al mismo tiempo, puede tardar). Debido a estas diferencias de tiempo, es que se utilizan funciones asincrónicas.

Para ello se utiliza **async** para generar una promesa (el output de la API por cumplir), y **awaits** se utiliza para pausar la ejecución de esta hasta que se resuelva la promesa.


### :thinking: Investiga sobre bibliotecas como Tailwind CSS o Bootstrap. Indica para qué sirven y explica de qué manera te hubiese servido para la realización de esta tarea. (Recordar que está prohibido su uso para esta tarea) [1 Punto]

- Tailwind: es un framework de CSS centrado en usar las clases para definir el diseño de estas mismas. En el caso de la tarea habría sido útil para reutilizar botones, grids, backgrounds y elementos que se repetían, los cuales muchas veces tuve que hacer copy-paste del código CSS anterior y de las clases cambiándole el nombre según el page para poder usarlos, haciendo que los objetivos repetitivos fueran código redundante.
- Bootstrap: Es una librería con componentes listos (Botones, Navbars, cards, modals). En el caso de la tarea habría sido útil ya que me habría ahorrado el tener que programar desde cero el comportamiento visual y estructural de ArtistCard, ArtistCardModal y el navbar.

### :adhesive_bandage: Explica la diferencia entre *props* y *state* dentro de un componente React. ¿En qué situaciones utilizarías cada uno? [1.5 Puntos]

Props y States sirven ambos para pasar datos, pero se usan en distintos contextos.

- Props: Se utiliza para pasar datos de un componente Padre a un componente hijo, donde los datos son inmutables. En el caso de la tarea se utilizó con el ArtistCard, ArtistCardModal y NavBar, ya que el componente padre les inyecta la información (los datos del artista a mostrar o el nombre del usuario logueado) y estos componentes hijos simplemente usan esa información para dibujarse en la pantalla, delegando cualquier cambio al padre.

- State: Es la memoria interna y privada de un componente. A diferencia de las props, el state es mutable. Se utiliza para almacenar datos dinámicos de modo que cada vez que el state cambia, React gatilla un re-renderizado del componente para actualizar la interfaz gráfica. En el caso de la tarea habría sido útil para la SearchBar, ya que la query de búsqueda al escribir el texto por cada letra que agregamos estamos modificando el dato de entrada, lo cual cambia el criterio del filtro constantemente.


### :computer: ¿Realizaste el bonus?
**No**

### Fuentes:

## Llamado/manejo de API:
- https://www.youtube.com/watch?v=2QgpLKJl0pg (
Cápsula 5 - Conexón a la API)
- https://medium.com/better-programming/handling-async-errors-with-axios-in-react-1e25c058a8c9
- https://dev.to/collegewap/react-axios-post-request-example-1dl3?url=https://dev.to/collegewap/react-axios-post-request-example-1dl3
- https://www.freecodecamp.org/news/how-to-use-axios-with-react/
- https://stackoverflow.com/questions/63333044/handling-api-calls-using-useeffect-vs-using-usecallback


## navBar
- https://blog.logrocket.com/creating-navbar-react/
- https://stackoverflow.com/questions/57232965/what-is-the-correct-way-to-change-navbar-values-in-react-based-on-if-user-is-log