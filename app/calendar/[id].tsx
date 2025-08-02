import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Sample data for groups (matching the home screen)
const sampleGroups = [
  { id: '1', name: 'Work Projects', color: '#FF6B6B' },
  { id: '2', name: 'Personal Goals', color: '#4ECDC4' },
  { id: '3', name: 'Health & Fitness', color: '#45B7D1' },
  { id: '4', name: 'Learning', color: '#96CEB4' },
  { id: '5', name: 'Home Tasks', color: '#FFEAA7' },
];

// Type definitions
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskData = {
  [date: string]: Task[];
};

type SampleTasks = {
  [groupId: string]: TaskData;
};

// Sample tasks for different days
const sampleTasks: SampleTasks = {
  '1': {
    '2024-01-15': [
      { id: '1', title: 'Review project requirements', completed: false },
      { id: '2', title: 'Schedule team meeting', completed: true },
      { id: '3', title: 'Update documentation', completed: false },
    ],
    '2024-01-16': [
      { id: '4', title: 'Prepare presentation slides', completed: false },
      { id: '5', title: 'Send progress report', completed: false },
    ],
    '2024-01-17': [
      { id: '6', title: 'Code review session', completed: false },
      { id: '7', title: 'Update project timeline', completed: false },
    ],
  },
  '2': {
    '2024-01-15': [
      { id: '1', title: 'Read 30 minutes', completed: true },
      { id: '2', title: 'Practice meditation', completed: false },
    ],
    '2024-01-16': [
      { id: '3', title: 'Set monthly goals', completed: false },
      { id: '4', title: 'Call family', completed: true },
    ],
  },
  '3': {
    '2024-01-15': [
      { id: '1', title: 'Morning workout', completed: true },
      { id: '2', title: 'Drink 8 glasses of water', completed: false },
    ],
    '2024-01-16': [
      { id: '3', title: 'Evening run', completed: false },
      { id: '4', title: 'Meal prep for week', completed: false },
    ],
  },
};

// Generate dates for the next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
};

export default function CalendarScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const group = sampleGroups.find((g) => g.id === id);
  const dates = generateDates();

  const renderDaySection = ({ item: date }: { item: Date }) => {
    const dateString = formatDate(date);
    const tasks =
      sampleTasks[id as keyof typeof sampleTasks]?.[dateString] || [];
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <View style={styles.daySection}>
        <View style={styles.dayHeader}>
          <Text style={[styles.dayTitle, isToday && styles.todayText]}>
            {formatDisplayDate(date)}
          </Text>
          {tasks.length > 0 && (
            <View style={styles.taskCount}>
              <Text style={styles.taskCountText}>{tasks.length}</Text>
            </View>
          )}
        </View>

        {tasks.length > 0 ? (
          <View style={styles.tasksContainer}>
            {tasks.map((task: Task) => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity style={styles.checkbox}>
                  <Ionicons
                    name={
                      task.completed ? 'checkmark-circle' : 'ellipse-outline'
                    }
                    size={20}
                    color={task.completed ? '#4ECDC4' : '#ddd'}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.completedTask,
                  ]}
                >
                  {task.title}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyDay}>
            <Text style={styles.emptyText}>No tasks for this day</Text>
          </View>
        )}
      </View>
    );
  };

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Group not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={[styles.groupColor, { backgroundColor: group.color }]} />
          <Text style={styles.groupName}>{group.name}</Text>
        </View>
      </View>

      {/* Calendar */}
      <FlatList
        data={dates}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.toISOString()}
        contentContainerStyle={styles.calendarContainer}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  calendarContainer: {
    padding: 20,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  todayText: {
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  taskCount: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  taskCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tasksContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#7f8c8d',
  },
  emptyDay: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
});
