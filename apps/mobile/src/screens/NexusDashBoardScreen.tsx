import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNexusController } from '../hooks/useNexusController';
import { COLORS } from '../components/NativeComponents';
import { Target, Users, Lightbulb, MessageSquare, CreditCard } from 'lucide-react-native';

// Importar Módulos
import { IdeasModule } from './modules/IdeasModule';
import { MessagesModule } from './modules/MessagesModule';
import { ProfileModule } from './modules/ProfileModule';
import { PaymentsModule } from './modules/PaymentsModule';

// Dashboard Simple (Home)
const DashboardHome = ({ actions }: any) => (
  <View style={{ padding: 16 }}>
    <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.primary }}>Hola, Juan 👋</Text>
    <Text style={{ color: COLORS.textMuted, marginBottom: 24 }}>Tienes 3 actualizaciones nuevas</Text>
    
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
       <TouchableOpacity style={[styles.dashCard, { backgroundColor: '#dbeafe' }]} onPress={() => actions.navigateToModule('ideas')}>
          <Lightbulb color={COLORS.primary} size={32} />
          <Text style={styles.dashCardTitle}>Explorar</Text>
          <Text>124+ Nuevas</Text>
       </TouchableOpacity>
       <TouchableOpacity style={[styles.dashCard, { backgroundColor: '#dcfce7' }]} onPress={() => actions.navigateToModule('messages')}>
          <MessageSquare color={COLORS.success} size={32} />
          <Text style={styles.dashCardTitle}>Mensajes</Text>
          <Text>2 No leídos</Text>
       </TouchableOpacity>
    </View>
  </View>
);

export const NexusDashboardScreen = () => {
  const { state, actions } = useNexusController();

  const renderContent = () => {
    switch (state.activeModule) {
      case 'dashboard': return <DashboardHome actions={actions} />;
      case 'ideas': return <IdeasModule />;
      case 'messages': return <MessagesModule />;
      case 'payments': return <PaymentsModule />;
      case 'users': return <ProfileModule />;
      default: return <DashboardHome actions={actions} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      {!state.selectedIdea && !state.showCheckout && !state.showPublishForm && (
        <View style={styles.tabBar}>
          {[
            { id: 'dashboard', icon: Target, label: 'Inicio' },
            { id: 'ideas', icon: Lightbulb, label: 'Ideas' },
            { id: 'messages', icon: MessageSquare, label: 'Chat' },
            { id: 'payments', icon: CreditCard, label: 'Pagos' },
            { id: 'users', icon: Users, label: 'Perfil' },
          ].map((tab) => (
            <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => actions.navigateToModule(tab.id as any)}>
              <tab.icon color={state.activeModule === tab.id ? COLORS.primary : COLORS.textMuted} size={24} />
              <Text style={[styles.tabText, { color: state.activeModule === tab.id ? COLORS.primary : COLORS.textMuted }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 20, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  dashCard: { width: '48%', padding: 20, borderRadius: 16, gap: 8 },
  dashCardTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 }
});