const DB_NAME = 'TodoAppDB';
const STORE_NAME = 'todos'; // Object store para los todos guardados
const PENDING_STORE = 'pending_todos'; // Object store para los todos pendientes de guardar (en caso de estar offline)
const DB_VERSION = 2;

// Ensure consistent property order when saving todos: id, description, done
const normalizeTodo = (todo) => ({ id: todo.id, description: todo.description, done: todo.done });

// Initialize the database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // Abrir la base de datos
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Oneupgrade needed: crea un nuevo object store si no existe
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Si no existe el object store de todos, crealo con primary key 'id'
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      // Si no existe el object store de pending todos, créalo con primary key 'id' y autoIncrement true (Si no das id, se generará automáticamente)
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        db.createObjectStore(PENDING_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    // manejo de errores.
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

// Save todos to IndexedDB
export const saveTodos = async (todos) => {
  // TODO
  // 1. Abrir conexión a la DB
  const db = await initDB();

  // 2. Retornar promesa de la transacción
  return new Promise((resolve, reject) => {

    // Crear transacción readwrite
    const transaction = db.transaction(STORE_NAME, 'readwrite');

    // Obtener el object store
    const store = transaction.objectStore(STORE_NAME);

    store.clear() // Limpiar cualquier pendiente anterior, ya que solo guardamos uno a la vez

    // Guardar cada todo
    todos.forEach(todo => {
      store.put(normalizeTodo(todo));
    });

    // Manejo de éxito
    transaction.oncomplete = () => resolve();

    // Manejo de error
    transaction.onerror = () => reject(transaction.error);
  });
};

// Load todos from IndexedDB
export const loadTodos = async () => {
  // TODO
  // 1. Abrir conexión a la DB
  const db = await initDB();

  // 2. Retornar promesa de la transacción
  return new Promise((resolve, reject) => {

    // Crear transacción readonly
    const transaction = db.transaction(STORE_NAME, 'readonly');

    // Obtener el object store
    const store = transaction.objectStore(STORE_NAME);
    
    // Obtener todos los todos
    const request = store.getAll();

    // Manejo de éxito

      // Manejo de éxito
    request.onsuccess = () => resolve(request.result);

    // Manejo de error
    transaction.onerror = () => reject(transaction.error);
  });
};


// Para estado Offline: Guardar un todo pendiente de guardar en IndexedDB

// Save pending todo
export const savePendingTodo = async (todo) => {
  // TODO
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_STORE, 'readwrite');
    const store = transaction.objectStore(PENDING_STORE);
    store.put(normalizeTodo(todo));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Load pending todos
export const loadPendingTodos = async () => {
  // TODO

  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_STORE, 'readonly');
    const store = transaction.objectStore(PENDING_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
  });
};

// Clear pending todos
export const clearPendingTodos = async () => {
  // TODO
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_STORE, 'readwrite');
    const store = transaction.objectStore(PENDING_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    transaction.onerror = () => reject(transaction.error);  
  });
};

