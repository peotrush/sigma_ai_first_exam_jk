# Frontend Architecture

## Overview

This document defines the comprehensive frontend architecture for the Kash Budget React Native mobile application. The frontend is designed for clarity, maintainability, and scalability while delivering a smooth user experience.

**Technology Stack:**
- **Framework:** React Native 0.73
- **Language:** TypeScript 5.3
- **State Management:** Redux Toolkit + Redux Persist
- **Navigation:** React Navigation v6
- **UI Components:** React Native Paper + Custom Design System
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Taxonomy](#component-taxonomy)
3. [Design System](#design-system)
4. [Redux State Management](#redux-state-management)
5. [Navigation Architecture](#navigation-architecture)
6. [API Client Setup](#api-client-setup)
7. [Error Handling](#error-handling)
8. [Testing Strategy](#testing-strategy)
9. [Performance Optimization](#performance-optimization)
10. [Naming Conventions](#naming-conventions)
11. [Code Patterns](#code-patterns)

---

## Project Structure

```
apps/mobile/
├── src/
│   ├── screens/               # Screen components (pages)
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── scan/
│   │   │   ├── ScanScreen.tsx
│   │   │   ├── QRScannerView.tsx
│   │   │   └── ManualEntryScreen.tsx
│   │   ├── insights/
│   │   │   ├── InsightsScreen.tsx
│   │   │   ├── WeeklyInsightsView.tsx
│   │   │   └── CategoryBreakdownView.tsx
│   │   ├── goals/
│   │   │   ├── GoalsScreen.tsx
│   │   │   ├── BudgetSetupScreen.tsx
│   │   │   └── ProgressTrackingView.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/            # Reusable UI components
│   │   ├── atoms/            # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Text/
│   │   │   ├── Input/
│   │   │   ├── Icon/
│   │   │   └── Badge/
│   │   │
│   │   ├── molecules/        # Combinations of atoms
│   │   │   ├── TransactionCard/
│   │   │   ├── CategoryPill/
│   │   │   ├── BudgetProgressBar/
│   │   │   ├── KashAvatar/
│   │   │   └── LocationTag/
│   │   │
│   │   └── organisms/        # Complex components
│   │       ├── TransactionList/
│   │       ├── CategoryBreakdownChart/
│   │       ├── BudgetGoalCard/
│   │       ├── KashMessageBubble/
│   │       └── BottomSheet/
│   │
│   ├── navigation/           # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   │
│   ├── redux/               # State management
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── transactionsSlice.ts
│   │   │   ├── budgetSlice.ts
│   │   │   ├── creditsSlice.ts
│   │   │   ├── messagesSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks.ts         # useAppDispatch, useAppSelector
│   │
│   ├── services/            # API and external services
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── authApi.ts
│   │   │   ├── transactionApi.ts
│   │   │   ├── budgetApi.ts
│   │   │   ├── creditApi.ts
│   │   │   └── messageApi.ts
│   │   ├── storage/
│   │   │   ├── secureStorage.ts
│   │   │   └── asyncStorage.ts
│   │   ├── location/
│   │   │   ├── locationService.ts
│   │   │   └── geofencingService.ts
│   │   ├── qr/
│   │   │   └── qrScannerService.ts
│   │   └── analytics/
│   │       └── analyticsService.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useBudget.ts
│   │   ├── useLocation.ts
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatters/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── number.ts
│   │   ├── validators/
│   │   │   ├── email.ts
│   │   │   ├── password.ts
│   │   │   └── amount.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── theme/             # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   │
│   ├── types/            # TypeScript types
│   │   ├── navigation.ts
│   │   ├── redux.ts
│   │   └── components.ts
│   │
│   ├── assets/           # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   └── App.tsx           # Root component
│
├── android/              # Android native code
├── ios/                  # iOS native code
├── __tests__/           # Test files
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
└── package.json
```

---

## Component Taxonomy

We follow the **Atomic Design** methodology to organize components into a clear hierarchy:

### Atoms

**Definition:** Basic building blocks that can't be broken down further.

**Examples:**
- Button
- Text
- Input
- Icon
- Badge
- Spinner

**Implementation Example:**

```typescript
// src/components/atoms/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styles } from './Button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
```

### Molecules

**Definition:** Combinations of atoms that form functional units.

**Examples:**
- TransactionCard (combines Text, Badge, Icon)
- CategoryPill (combines Icon, Text)
- BudgetProgressBar (combines Text, ProgressBar)

**Implementation Example:**

```typescript
// src/components/molecules/TransactionCard/TransactionCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Transaction } from '@kash/shared';
import { Text } from '../../atoms/Text';
import { Badge } from '../../atoms/Badge';
import { Icon } from '../../atoms/Icon';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { styles } from './TransactionCard.styles';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        <Icon name={transaction.category?.icon || 'shopping-bag'} size={24} />
        <View style={styles.details}>
          <Text variant="body" weight="semibold">
            {transaction.category?.name || 'Uncategorized'}
          </Text>
          <Text variant="caption" color="secondary">
            {formatDate(transaction.timestamp, 'MMM DD, HH:mm')}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text variant="body" weight="bold">
          {formatCurrency(transaction.amount)}
        </Text>
        {transaction.source === 'qr_scan' && (
          <Badge text="QR" variant="success" size="small" />
        )}
      </View>
    </TouchableOpacity>
  );
};
```

### Organisms

**Definition:** Complex components composed of molecules and atoms.

**Examples:**
- TransactionList
- CategoryBreakdownChart
- BudgetGoalCard
- KashMessageBubble

**Implementation Example:**

```typescript
// src/components/organisms/TransactionList/TransactionList.tsx
import React from 'react';
import { FlatList, View } from 'react-native';
import { Transaction } from '@kash/shared';
import { TransactionCard } from '../../molecules/TransactionCard';
import { Text } from '../../atoms/Text';
import { styles } from './TransactionList.styles';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  loading?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionPress,
  loading = false,
  onRefresh,
  onEndReached,
}) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="h3">Recent Transactions</Text>
      <Text variant="caption" color="secondary">
        {transactions.length} transactions
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionCard
      transaction={item}
      onPress={() => onTransactionPress?.(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text variant="body" color="secondary" align="center">
        No transactions yet. Scan your first receipt!
      </Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshing={loading}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
    />
  );
};
```

### Templates & Pages

**Templates:** Page-level layouts without specific data.
**Pages (Screens):** Complete pages with data and business logic.

```typescript
// src/screens/insights/InsightsScreen.tsx
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchWeeklyInsights } from '../../redux/slices/transactionsSlice';
import { WeeklyInsightsView } from './WeeklyInsightsView';
import { CategoryBreakdownChart } from '../../components/organisms/CategoryBreakdownChart';
import { Text } from '../../components/atoms/Text';
import { styles } from './InsightsScreen.styles';

export const InsightsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { weeklyInsights, loading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchWeeklyInsights());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Insights</Text>
      </View>

      <WeeklyInsightsView insights={weeklyInsights} loading={loading} />

      <CategoryBreakdownChart data={weeklyInsights?.byCategory || []} />
    </ScrollView>
  );
};
```

---

## Design System

### Colors

```typescript
// src/theme/colors.ts
export const colors = {
  // Primary palette
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main primary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary palette (for Kash mascot)
  secondary: {
    50: '#FFF9C4',
    100: '#FFF59D',
    200: '#FFF176',
    300: '#FFEE58',
    400: '#FFEB3B',
    500: '#FFC107', // Kash yellow
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Category colors
  categories: {
    groceries: '#4CAF50',
    dining: '#FF9800',
    transport: '#2196F3',
    entertainment: '#9C27B0',
    shopping: '#E91E63',
    bills: '#607D8B',
    health: '#F44336',
    treatYourself: '#FFC107',
  },

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },

  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
};
```

### Typography

```typescript
// src/theme/typography.ts
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
  },

  variants: {
    h1: {
      fontFamily: 'Inter-Bold',
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Inter-Bold',
      fontSize: 30,
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 24,
      lineHeight: 32,
    },
    h4: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      lineHeight: 28,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyBold: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    small: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 16,
    },
  },
};
```

### Spacing

```typescript
// src/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

### Component States

```typescript
// src/theme/states.ts
export const componentStates = {
  button: {
    default: {
      opacity: 1,
      scale: 1,
    },
    pressed: {
      opacity: 0.7,
      scale: 0.98,
    },
    disabled: {
      opacity: 0.5,
    },
  },
  card: {
    default: {
      elevation: 2,
    },
    pressed: {
      elevation: 4,
    },
  },
};
```

---

## Redux State Management

### Store Configuration

```typescript
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetReducer from './slices/budgetSlice';
import creditsReducer from './slices/creditsSlice';
import messagesReducer from './slices/messagesSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'budget'], // Only persist auth and budget
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    transactions: transactionsReducer,
    budget: budgetReducer,
    credits: creditsReducer,
    messages: messagesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### State Slices

**Auth Slice:**

```typescript
// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthResponse } from '@kash/shared';
import { authApi } from '../../services/api/authApi';
import { SecureStorage } from '../../services/storage/secureStorage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authApi.login(email, password);
    await SecureStorage.saveTokens(response.accessToken, response.refreshToken);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authApi.register(email, password);
    await SecureStorage.saveTokens(response.accessToken, response.refreshToken);
    return response;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStorage.clearTokens();
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      });
  },
});

export const { setTokens, clearError } = authSlice.actions;
export default authSlice.reducer;
```

**Transactions Slice:**

```typescript
// src/redux/slices/transactionsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction, WeeklyInsights } from '@kash/shared';
import { transactionApi } from '../../services/api/transactionApi';

interface TransactionsState {
  transactions: Transaction[];
  weeklyInsights: WeeklyInsights | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

const initialState: TransactionsState = {
  transactions: [],
  weeklyInsights: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
    return await transactionApi.getTransactions(limit, offset);
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await transactionApi.createTransaction(transaction);
  }
);

export const fetchWeeklyInsights = createAsyncThunk(
  'transactions/fetchWeeklyInsights',
  async () => {
    return await transactionApi.getWeeklyInsights();
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          limit: action.payload.limit,
          offset: action.payload.offset,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      // Create transaction
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      // Fetch weekly insights
      .addCase(fetchWeeklyInsights.fulfilled, (state, action) => {
        state.weeklyInsights = action.payload;
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
```

### Custom Hooks

```typescript
// src/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## Navigation Architecture

### Navigation Structure

```typescript
// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

**Main Tab Navigator:**

```typescript
// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../components/atoms/Icon';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { InsightsScreen } from '../screens/insights/InsightsScreen';
import { GoalsScreen } from '../screens/goals/GoalsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral.gray[500],
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="See"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Save"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="target" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
```

---

## API Client Setup

```typescript
// src/services/api/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../redux/store';
import { setTokens, logout } from '../../redux/slices/authSlice';
import { SecureStorage } from '../storage/secureStorage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.kashbudget.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = store.getState().auth;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not a retry, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = await SecureStorage.getTokens();

        if (tokens?.refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: tokens.refreshToken,
          });

          const { accessToken, refreshToken } = response.data;

          // Update Redux store
          store.dispatch(setTokens({ accessToken, refreshToken }));

          // Update secure storage
          await SecureStorage.saveTokens(accessToken, refreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Error Handling

```typescript
// src/utils/errorHandler.ts
import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import * as Sentry from '@sentry/react-native';

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;

    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        api: {
          status: error.response?.status,
          url: error.config?.url,
        },
      },
    });

    // Return user-friendly message
    return apiError?.message || 'An unexpected error occurred';
  }

  return 'An unexpected error occurred';
};

export const showErrorAlert = (error: unknown) => {
  const message = handleApiError(error);
  Alert.alert('Error', message, [{ text: 'OK' }]);
};
```

---

## Testing Strategy

### Unit Testing

```typescript
// src/components/atoms/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Click Me" onPress={() => {}} loading />
    );

    expect(queryByText('Click Me')).toBeNull();
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });
});
```

### Integration Testing

```typescript
// src/screens/scan/__tests__/ScanScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { ScanScreen } from '../ScanScreen';

describe('ScanScreen', () => {
  it('renders QR scanner when camera permission granted', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ScanScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(getByTestId('qr-scanner')).toBeTruthy();
    });
  });
});
```

---

## Naming Conventions

### Files and Folders

- **Components:** PascalCase (e.g., `Button.tsx`, `TransactionCard.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`, `validators.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types:** PascalCase with `.types.ts` suffix (e.g., `navigation.types.ts`)

### Variables and Functions

- **Variables:** camelCase (e.g., `userName`, `transactionList`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_TRANSACTION_AMOUNT`)
- **Functions:** camelCase, verb-based (e.g., `fetchTransactions`, `validateEmail`)
- **React Components:** PascalCase (e.g., `LoginScreen`, `Button`)
- **Hooks:** camelCase starting with `use` (e.g., `useAuth`, `useTransactions`)

---

## Performance Optimization

### React.memo for Expensive Components

```typescript
export const TransactionCard = React.memo<TransactionCardProps>(
  ({ transaction, onPress }) => {
    // Component logic
  },
  (prevProps, nextProps) => {
    return prevProps.transaction.id === nextProps.transaction.id;
  }
);
```

### useMemo and useCallback

```typescript
const SomeComponent = () => {
  const transactions = useAppSelector((state) => state.transactions.transactions);

  // Memoize expensive calculations
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Memoize callbacks
  const handlePress = useCallback((id: string) => {
    console.log('Pressed:', id);
  }, []);

  return <View>{/* Component JSX */}</View>;
};
```

### FlatList Optimization

```typescript
<FlatList
  data={transactions}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

---

## Version History

| Version | Date       | Author | Changes                           |
|---------|------------|--------|-----------------------------------|
| 1.0     | 2025-11-17 | Team   | Initial frontend architecture     |

---

*Last Updated: 2025-11-17*
