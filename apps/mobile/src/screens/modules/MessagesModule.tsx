import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Card, Avatar, Input, Button, COLORS } from '../../components/NativeComponents';
import { useNexusController } from '../../hooks/useNexusController';
import { ArrowLeft, Send } from 'lucide-react-native';

export const MessagesModule = () => {
  const { data, state } = useNexusController(); 
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // --- ESTADO DE CARGA ---
  if (state.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // VISTA CHAT INDIVIDUAL
  if (activeChatId) {
    // Buscamos por _id (Mongo) o id (Mock)
    const chat = data.chats.find(c => (c._id || c.id) === activeChatId);
    
    if (!chat) return <Text style={{ padding: 20 }}>Chat no encontrado</Text>;

    // Normalizamos el nombre para usar cualquiera de los dos campos
    const displayName = chat.participantName || chat.name || 'Usuario';

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.chatHeader}>
          <Button 
            title="" 
            variant="ghost" 
            icon={<ArrowLeft size={20} color={COLORS.text} />} 
            onPress={() => setActiveChatId(null)} 
          />
          <Avatar initials={chat.avatar || 'U'} />
          <View style={{ marginLeft: 10 }}>
             <Text style={{ fontWeight: 'bold' }}>{displayName}</Text>
             <Text style={{ fontSize: 12, color: COLORS.success }}>{chat.online ? 'En línea' : 'Offline'}</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
           {/* Renderizado de mensajes: Priorizamos el array 'messages' del backend */}
           {chat.messages && chat.messages.length > 0 ? (
             chat.messages.map((msg, index) => (
               <View key={index} style={[styles.bubble, msg.sender === 'Me' ? styles.bubbleRight : styles.bubbleLeft]}>
                 <Text style={msg.sender === 'Me' ? { color: 'white' } : { color: COLORS.text }}>
                   {msg.content}
                 </Text>
               </View>
             ))
           ) : (
             /* Fallback para datos mock antiguos */
             <View style={[styles.bubble, styles.bubbleLeft]}>
               <Text>{chat.lastMessage || 'Inicio de la conversación'}</Text>
             </View>
           )}
        </ScrollView>

        <View style={styles.chatInputContainer}>
           <View style={{ flex: 1 }}><Input placeholder="Escribe un mensaje..." /></View>
           <Button title="" icon={<Send size={18} color="#fff" />} onPress={() => {}} style={{ width: 48, height: 48, marginLeft: 8 }} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // VISTA LISTA DE CHATS
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.headerTitle}>Mensajes</Text>
      
      {data.chats.length === 0 ? (
        <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: 20 }}>
          No tienes mensajes aún.
        </Text>
      ) : (
        data.chats.map((chat) => {
          // Normalización de datos para la tarjeta
          const uniqueId = chat._id || chat.id || 'temp-id';
          const displayName = chat.participantName || chat.name || 'Usuario';
          
          // Obtener el último mensaje real o el mock
          let previewMessage = 'Nueva conversación';
          if (chat.messages && chat.messages.length > 0) {
            previewMessage = chat.messages[chat.messages.length - 1].content;
          } else if (chat.lastMessage) {
            previewMessage = chat.lastMessage;
          }

          return (
            <TouchableOpacity key={uniqueId} onPress={() => setActiveChatId(uniqueId)}>
              <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Avatar initials={chat.avatar || 'U'} size={48} />
                 <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Text style={{ fontWeight: 'bold' }}>{displayName}</Text>
                       <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{chat.time || 'Hoy'}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ color: COLORS.textMuted, marginTop: 2 }}>
                      {previewMessage}
                    </Text>
                    <Text style={{ fontSize: 10, color: COLORS.primary, marginTop: 4 }}>{chat.project}</Text>
                 </View>
                 
                 {/* Manejo de unreadCount (backend) o unread (mock) */}
                 {(chat.unreadCount || chat.unread || 0) > 0 && (
                   <View style={styles.unreadBadge}>
                     <Text style={{ color: 'white', fontSize: 10 }}>
                       {chat.unreadCount || chat.unread}
                     </Text>
                   </View>
                 )}
              </Card>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 8 },
  bubbleLeft: { backgroundColor: '#f1f5f9', alignSelf: 'flex-start' },
  bubbleRight: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  chatInputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff', alignItems: 'center' },
  unreadBadge: { backgroundColor: COLORS.primary, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }
});