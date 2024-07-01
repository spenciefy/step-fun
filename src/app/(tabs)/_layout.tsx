import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Competitions',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="person-walking" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="wallet" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
