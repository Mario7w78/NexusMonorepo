import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Avatar, Button, Input, COLORS, Separator } from '../../components/NativeComponents';

export const ProfileModule = () => (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Mi Perfil</Text>
    <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
       <Avatar initials="JD" size={80} />
       <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>Juan Desarrollador</Text>
       <Text style={{ color: COLORS.textMuted }}>Full Stack Developer</Text>
       <View style={{ flexDirection: 'row', marginTop: 16, gap: 20 }}>
          <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>12</Text><Text style={{ fontSize: 12 }}>Proyectos</Text></View>
          <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>4.8</Text><Text style={{ fontSize: 12 }}>Rating</Text></View>
          <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>$5k</Text><Text style={{ fontSize: 12 }}>Ganado</Text></View>
       </View>
    </Card>

    <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 12 }}>Editar Información</Text>
    <Card>
       <Input label="Nombre Completo" value="Juan Desarrollador" />
       <Input label="Especialidad" value="Full Stack Developer" />
       <Input label="Biografía" multiline value="Apasionado por crear soluciones tecnológicas..." />
       <Button title="Guardar Cambios" onPress={() => alert('Guardado')} />
    </Card>
  </ScrollView>
);