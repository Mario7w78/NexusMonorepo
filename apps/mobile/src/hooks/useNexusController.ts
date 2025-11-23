import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModuleId, Idea, Chat, Transaction, User } from '../types/nexus';

// Detecta automáticamente la plataforma
const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const USER_STORAGE_KEY = '@nexus_user';

export const useNexusController = () => {
  // --- 1. ESTADOS DE UI (Navegación y Modales) ---
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ID Híbrido: Acepta number (mock) o string (Mongo)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | number | null>(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [activeChatIndex, setActiveChatIndex] = useState(0);

  // --- 2. ESTADOS DE DATOS (Desde Backend) ---
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Aún vacío por ahora
  const [loading, setLoading] = useState(false);

  // --- 3. FETCHING DE DATOS (Lectura) ---
  const fetchIdeas = async () => {
    try {
      const response = await fetch(`${API_URL}/ideas`);
      if (!response.ok) throw new Error('Error en red al obtener ideas');
      const data = await response.json();
      setIdeas(data);
    } catch (error) {
      console.log("Modo Offline o Error API Ideas:", error);
    }
  };

  const fetchChats = async () => {
    if (!currentUser) return; // No fetch if not logged in

    try {
      const response = await fetch(`${API_URL}/messages/${currentUser.id}`);
      if (!response.ok) throw new Error('Error en red al obtener chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.log("Modo Offline o Error API Chats:", error);
    }
  };

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error loading session:", error);
      }
    };
    loadSession();
  }, []);

  // Cargar datos al iniciar el hook (cuando abre la app)
  useEffect(() => {
    setLoading(true);
    const promises = [fetchIdeas()];
    if (currentUser) promises.push(fetchChats());

    Promise.all(promises)
      .finally(() => setLoading(false));
  }, [currentUser]); // Re-fetch when user changes

  // --- 4. ACCIONES (Lógica de Negocio) ---

  const navigateToModule = (module: ModuleId) => {
    setActiveModule(module);
    // Limpiamos estados al cambiar de módulo para evitar errores visuales
    setSelectedIdeaId(null);
    setShowCheckout(false);
    setShowPublishForm(false);
  };

  const selectIdea = (id: string | number | null) => {
    setSelectedIdeaId(id);
    // Si deseleccionamos (id es null), también cerramos checkout por seguridad
    if (id === null) setShowCheckout(false);
  };

  const toggleCheckout = (show: boolean) => {
    setShowCheckout(show);
  };

  const togglePublishForm = (show: boolean) => {
    setShowPublishForm(show);
  };

  // Helper para obtener el objeto completo de la idea seleccionada
  // Compara tanto id (mock) como _id (mongo)
  const getSelectedIdea = () => {
    return ideas.find(i => (i._id || i.id) === selectedIdeaId);
  };

  // --- NUEVA FUNCIÓN: PUBLICAR IDEA (Escritura) ---
  const publishIdea = async (formData: any) => {
    try {
      setLoading(true); // Mostramos carga

      const response = await fetch(`${API_URL}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Datos por defecto para el MVP
          author: currentUser?.fullName || 'Juan Dev',
          authorId: currentUser?.id || 'user123',
          status: 'Nueva',
          collaborators: 0,
          avatar: currentUser?.avatar || 'JD'
        }),
      });

      if (response.ok) {
        console.log("✅ Idea publicada con éxito");
        await fetchIdeas();        // 1. Recarga la lista desde el servidor
        setShowPublishForm(false); // 2. Cierra el formulario
      } else {
        console.error("❌ Error del servidor al publicar:", response.status);
        alert("Hubo un problema al publicar. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("❌ Error de red al publicar:", error);
      alert("Error de conexión. Revisa tu internet.");
    } finally {
      setLoading(false); // Quitamos carga
    }
  };

  // --- 6. AUTENTICACIÓN ---
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Error de login' };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: 'Email o contraseña incorrectos' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, specialty: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, specialty }),
      });

      if (!response.ok) throw new Error('Error al registrar');

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Error al registrar' };
      }
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, error: 'No se pudo crear la cuenta' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setCurrentUser(null);
      setActiveModule('dashboard');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // --- 5. RETORNO DEL HOOK ---
  return {
    state: {
      activeModule,
      selectedIdeaId,
      selectedIdea: getSelectedIdea(),
      showCheckout,
      showPublishForm,
      activeChatIndex,
      loading,
      currentUser,
      // Data moved to state for easier access in UI
      ideas,
      chats,
      transactions
    },
    actions: {
      navigateToModule,
      setActiveModule,
      selectIdea,
      toggleCheckout,
      togglePublishForm,
      publishIdea,
      setActiveChatIndex,
      login,
      register,
      logout
    }
  };
};