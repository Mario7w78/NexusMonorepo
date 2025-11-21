import { useState, useEffect } from 'react';
// Asegúrate de que la ruta a tus tipos sea correcta
import { ModuleId, Idea, Chat, Transaction } from '../types/nexus';

// CONFIGURACIÓN DE API
// Android Emulator: 'http://10.0.2.2:3000'
// iOS Simulator / Web: 'http://localhost:3000'
// Dispositivo Físico: Tu IP local (ej: 'http://192.168.1.15:3000')
const API_URL = 'http://10.0.2.2:3000'; 

export const useNexusController = () => {
  // --- 1. ESTADOS DE UI (Navegación y Modales) ---
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  
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
    try {
      // 'user123' es un ID temporal hasta que tengamos login real
      const response = await fetch(`${API_URL}/messages/user123`);
      if (!response.ok) throw new Error('Error en red al obtener chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.log("Modo Offline o Error API Chats:", error);
    }
  };

  // Cargar datos al iniciar el hook (cuando abre la app)
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchIdeas(), fetchChats()])
      .finally(() => setLoading(false));
  }, []);

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
          author: 'Juan Dev', 
          authorId: 'user123', 
          status: 'Nueva',
          collaborators: 0,
          avatar: 'JD'
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

  // --- 5. RETORNO DEL HOOK ---
  return {
    state: {
      activeModule,
      selectedIdeaId,
      selectedIdea: getSelectedIdea(),
      showCheckout,      
      showPublishForm,   
      activeChatIndex,
      loading
    },
    data: {
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
      publishIdea, // <--- Función crítica para el botón "Publicar Proyecto"
      setActiveChatIndex
    }
  };
};