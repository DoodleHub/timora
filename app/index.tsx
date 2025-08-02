import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Sample data for groups
const sampleGroups = [
  { id: '1', name: 'Work Projects', color: '#FF6B6B', taskCount: 12 },
  { id: '2', name: 'Personal Goals', color: '#4ECDC4', taskCount: 8 },
  { id: '3', name: 'Health & Fitness', color: '#45B7D1', taskCount: 15 },
  { id: '4', name: 'Learning', color: '#96CEB4', taskCount: 6 },
  { id: '5', name: 'Home Tasks', color: '#FFEAA7', taskCount: 10 },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderGroupItem = ({ item }: { item: (typeof sampleGroups)[0] }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => router.push(`/calendar/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.taskCount}>{item.taskCount} tasks</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <Text style={styles.subtitle}>Organize your tasks by groups</Text>
      </View>

      <FlatList
        data={sampleGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 20,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
