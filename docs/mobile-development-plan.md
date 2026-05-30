# Mobile Development Plan
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

> **Status**: Ready for Execution by AI Agent Code  
> **Target**: React Native (Android & iOS)  
> **Last Updated**: 2026-05-16  
> **Dependencies**: Backend API, Authentication Service

---

## 1. Technical Prerequisites

### 1.1 Project Structure
```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   ├── field-app/          # Mobile Lapangan
│   │   ├── customer-portal/    # Customer Portal Mobile
│   │   └── shared/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── offline.ts
│   ├── store/
│   ├── utils/
│   └── types/
├── assets/
└── tests/
```

### 1.2 Environment Variables
```bash
API_BASE_URL=https://api.simdp.com/v1
API_TIMEOUT=30000
ENV=development
FCM_SENDER_ID=123456789
```

### 1.3 Dependencies (package.json)
```json
{
  "dependencies": {
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "expo": "~50.0.0",
    "expo-image-picker": "~14.0.0",
    "expo-camera": "~14.0.0",
    "expo-secure-store": "~12.0.0",
    "expo-notifications": "~0.27.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0"
  }
}
```

---

## 2. Phase-Based Implementation

### Phase 1: Foundation & Authentication (Week 1)

#### 2.1 Tasks
- [ ] Initialize Expo project in `mobile/` directory
- [ ] Configure TypeScript strict mode
- [ ] Setup React Navigation (Stack + Bottom Tabs)
- [ ] Implement `src/services/api.ts` with interceptors
- [ ] Create `src/types/auth.ts` for user/session types

#### 2.2 Auth Flow Implementation
```typescript
// src/types/auth.ts
export type UserRole = 'site_engineer' | 'project_manager' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  projectId?: string;
  assignedUnits?: string[];
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: number;
}
```

```typescript
// src/services/auth.ts
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    // POST /auth/login
    // Store token in SecureStore
    // Return user data with role
  };

  const logout = async () => {
    // Clear SecureStore
    // Clear AsyncStorage queues
  };

  return { login, logout };
};
```

#### 2.3 Screen Implementation
| Screen File | Route | Purpose |
|-------------|-------|---------|
| `src/screens/auth/LoginScreen.tsx` | `/login` | Email/password + biometric option |
| `src/screens/auth/RoleSelectionScreen.tsx` | `/role` | Auto-redirect based on role |

#### 2.4 Checkpoints
- [ ] Login with mock API returns role
- [ ] Session persists after app restart
- [ ] Role-based initial navigation works

---

### Phase 2: Mobile Lapangan Core (Week 2-3)

#### 2.1 Navigation Structure
```typescript
// src/navigation/FieldAppNavigator.tsx
const FieldAppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={FieldHomeScreen} />
    <Tab.Screen name="Milestone" component={MilestoneNavigator} />
    <Tab.Screen name="Units" component={UnitListScreen} />
    <Tab.Screen name="Issues" component={IssueNavigator} />
    <Tab.Screen name="Notifications" component={NotificationScreen} />
  </Tab.Navigator>
);
```

#### 2.2 Fitur Absensi & Laporan Harian (Implemented)
| File | Route | Key Functionality |
|------|-------|-------------------|
| `screens/pengawas/FieldAttendanceScreen.tsx` | `/attendance` | Check-in/out, riwayat absensi, statistik bulanan |
| `screens/pengawas/FieldDailyReportScreen.tsx` | `/reports` | Form laporan harian, draft, riwayat laporan |

##### API Contract Absensi
```typescript
// POST /api/mobile/field/attendance
interface AttendancePayload {
  date: string;        // YYYY-MM-DD
  checkInTime?: string; // HH:MM
  checkOutTime?: string;
  status: "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPHA";
  notes?: string;
  location?: { latitude: number; longitude: number };
}

// GET /api/mobile/field/attendance/summary
interface AttendanceSummary {
  attendanceRate: number;
  presentDays: number;
  lateDays: number;
  permissionDays: number;
  sickDays: number;
}
```

##### API Contract Laporan Harian
```typescript
// POST /api/mobile/field/reports
interface DailyReportPayload {
  date: string;
  projectId?: string;
  unitId?: string;
  summary: string;
  activities: string[];
  issues: string[];
  weather: "CERAH" | "MENDUNG" | "HUJAN" | "BADAI";
  photoUrls: string[];
  isDraft: boolean;
}
```

#### 2.2 Milestone Update Flow

##### API Contract
```typescript
// POST /api/mobile/milestones/:id/complete
interface MilestoneUpdatePayload {
  unitId: string;
  milestoneId: string;
  notes?: string;
  photos: string[]; // URIs
}

// Response
interface MilestoneUpdateResponse {
  success: boolean;
  updatedMilestone: {
    id: string;
    status: 'completed';
    completedAt: string;
    photoUrls: string[];
  };
}
```

##### Screen Components
| File | Route | Key Functionality |
|------|-------|-------------------|
| `screens/field-app/ProjectSelectScreen.tsx` | `/projects` | List assigned projects |
| `screens/field-app/UnitSelectScreen.tsx` | `/units/:projectId` | Filter by project |
| `screens/field-app/MilestoneListScreen.tsx` | `/milestones/:unitId` | Show status grid |
| `screens/field-app/MilestoneUpdateScreen.tsx` | `/milestone/:id/update` | Form + photo upload |
| `screens/field-app/PhotoCaptureScreen.tsx` | `/photo/capture` | Camera/gallery picker |

##### Photo Upload Implementation
```typescript
// src/services/photo.ts
export const compressAndUpload = async (uri: string): Promise<string> => {
  // Resize to max 1024px
  // Compress to < 1MB
  // Upload to /api/upload/photos
  // Return URL
};

// Usage in capture screen
const handlePhotoCapture = async () => {
  const result = await ImagePicker.launchCameraAsync();
  if (!result.canceled) {
    const url = await compressAndUpload(result.assets[0].uri);
    setPhotos(prev => [...prev, url]);
  }
};
```

#### 2.3 Offline Queue Implementation
```typescript
// src/services/offline.ts
interface QueueItem {
  id: string;
  type: 'milestone_update' | 'issue_report';
  payload: any;
  timestamp: number;
  attempts: number;
}

export class OfflineQueue {
  private queue: QueueItem[] = [];

  async enqueue(item: Omit<QueueItem, 'id' | 'timestamp' | 'attempts'>) {
    const queueItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
      attempts: 0,
    };
    await AsyncStorage.setItem(
      'offline_queue',
      JSON.stringify([...this.queue, queueItem])
    );
  }

  async processQueue() {
    // Process items when connectivity restored
    // Retry failed items up to 3 times
  }
}
```

---

### Phase 3: Customer Portal Mobile (Week 3-4)

#### 3.1 Navigation Structure
```typescript
// src/navigation/CustomerPortalNavigator.tsx
const CustomerPortalTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={CustomerHomeScreen} />
    <Tab.Screen name="Progress" component={ProgressNavigator} />
    <Tab.Screen name="Billing" component={BillingNavigator} />
    <Tab.Screen name="Documents" component={DocumentScreen} />
    <Tab.Screen name="Support" component={SupportNavigator} />
  </Tab.Navigator>
);
```

#### 3.2 Progress Tracking Screens

##### API Contract
```typescript
// GET /api/customer/:userId/unit/:unitId/progress
interface UnitProgress {
  unitId: string;
  unitCode: string;
  typeName: string;
  overallProgress: number;
  milestones: Milestone[];
  photos: ProgressPhoto[];
}

interface ProgressPhoto {
  id: string;
  url: string;
  milestoneId: string;
  caption: string;
  takenAt: string;
}
```

##### Screen Implementation
| File | Route | Key Functionality |
|------|-------|-------------------|
| `screens/customer/ProgressScreen.tsx` | `/progress` | Progress bar + timeline |
| `screens/customer/PhotoGalleryScreen.tsx` | `/photos` | Horizontal swipe gallery |
| `screens/customer/MilestoneDetailScreen.tsx` | `/milestones` | Target vs actual dates |

#### 3.3 Billing & Payment Screens

##### API Contract
```typescript
// GET /api/customer/:userId/billing
interface BillingSummary {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

interface Bill {
  id: string;
  type: 'installment' | 'ipm' | 'other';
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'overdue' | 'pending_verification' | 'paid';
  virtualAccount?: string;
}

// POST /api/customer/:userId/payment-proof
interface PaymentProofPayload {
  billId: string;
  photoUri: string;
}
```

##### Screen Implementation
| File | Route | Key Functionality |
|------|-------|-------------------|
| `screens/customer/BillingScreen.tsx` | `/billing` | Summary cards + list |
| `screens/customer/PaymentProofScreen.tsx` | `/payment-proof` | Camera/gallery upload |

---

### Phase 4: Offline Support & Notifications (Week 4)

#### 4.1 Connectivity Detection
```typescript
// src/hooks/useNetwork.ts
import NetInfo from '@react-native-community/netinfo';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        OfflineQueue.processQueue();
      }
    });
    return () => unsubscribe();
  }, []);

  return { isOnline };
};
```

#### 4.2 Push Notification Registration
```typescript
// src/services/notifications.ts
export const registerForNotifications = async (userId: string) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // POST /api/notifications/register
  await api.post('/notifications/register', {
    userId,
    expoPushToken: token,
  });
};

// Handle notification reception
Notifications.addNotificationReceivedListener(notification => {
  // Update local badge count
  // Store notification in local DB
});
```

---

### Phase 5: Polish & Testing (Week 5)

#### 5.1 UI Components Checklist
| Component | Tap Target | Feedback | Status |
|-----------|------------|----------|--------|
| Primary buttons | min 44px | Haptic + loading state | ⬜ |
| Photo preview | 44px margins | Swipe gestures | ⬜ |
| Form inputs | 44px height | Validation messages | ⬜ |
| Empty states | Illustration + CTA | Accessible | ⬜ |

#### 5.2 Biometric Implementation
```typescript
// src/services/biometric.ts
export const authenticateWithBiometrics = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Login dengan sidik jari atau Face ID',
    cancelLabel: 'Batal',
  });

  return result.success;
};
```

#### 5.3 Test Scenarios
```typescript
// tests/flows/milestone-update.test.ts
describe('Milestone Update Flow', () => {
  test('Complete flow with photos', async () => {
    // Mock API responses
    // Navigate through screens
    // Upload photos
    // Verify success state
  });

  test('Offline queue behavior', async () => {
    // Mock offline state
    // Submit milestone update
    // Verify offline queue saved
    // Mock online state
    // Verify auto-sync
  });
});
```

---

## 3. Screen Inventory

### Mobile Lapangan (12 Screens)
| No | Screen | File Path | Priority |
|----|--------|-----------|----------|
| 1 | Login | `screens/auth/LoginScreen.tsx` | P0 |
| 2 | Home | `screens/field-app/HomeScreen.tsx` | P0 |
| 3 | Project Select | `screens/field-app/ProjectSelectScreen.tsx` | P0 |
| 4 | Unit Select | `screens/field-app/UnitSelectScreen.tsx` | P0 |
| 5 | Milestone List | `screens/field-app/MilestoneListScreen.tsx` | P0 |
| 6 | Milestone Update | `screens/field-app/MilestoneUpdateScreen.tsx` | P0 |
| 7 | Photo Capture | `screens/field-app/PhotoCaptureScreen.tsx` | P0 |
| 8 | Update History | `screens/field-app/UpdateHistoryScreen.tsx` | P1 |
| 9 | Unit List | `screens/field-app/UnitListScreen.tsx` | P0 |
| 10 | Unit Detail | `screens/field-app/UnitDetailScreen.tsx` | P0 |
| 11 | Issue Form | `screens/field-app/IssueFormScreen.tsx` | P0 |
| 12 | Issue History | `screens/field-app/IssueHistoryScreen.tsx` | P1 |

### Customer Portal Mobile (7 Main Screens)
| No | Screen | File Path | Priority |
|----|--------|-----------|----------|
| 1 | Login | `screens/auth/LoginScreen.tsx` | P0 |
| 2 | Home | `screens/customer/HomeScreen.tsx` | P0 |
| 3 | Progress | `screens/customer/ProgressScreen.tsx` | P0 |
| 4 | Billing | `screens/customer/BillingScreen.tsx` | P0 |
| 5 | Documents | `screens/customer/DocumentScreen.tsx` | P0 |
| 6 | Support | `screens/customer/SupportScreen.tsx` | P0 |
| 7 | Photo Gallery | `screens/customer/PhotoGalleryScreen.tsx` | P1 |

---

## 4. API Integration Matrix

| Module | Endpoint | Method | Auth Required |
|--------|----------|--------|---------------|
| Auth | `/api/auth/login` | POST | No |
| Auth | `/api/auth/refresh` | POST | No |
| Milestones | `/api/mobile/milestones/:id` | GET | Yes |
| Milestones | `/api/mobile/milestones/:id/complete` | POST | Yes |
| Units | `/api/mobile/units` | GET | Yes |
| Issues | `/api/mobile/issues` | POST | Yes |
| Progress | `/api/customer/:userId/unit/:unitId/progress` | GET | Yes |
| Billing | `/api/customer/:userId/billing` | GET | Yes |
| Photos | `/api/upload/photos` | POST | Yes |

---

## 5. Build & Deployment

### 5.1 Build Configuration
```json
// app.json
{
  "expo": {
    "name": "SIMDP Mobile",
    "slug": "simdp-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png"
      },
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 5.2 Deployment Commands
```bash
# Development
npm run dev:mobile

# Android Build
eas build --platform android --profile preview

# iOS Build
eas build --platform ios --profile preview

# Production
eas build --platform all --profile production
```

---

## 6. Definition of Done

### Per Phase
- [ ] All screens implemented per spec
- [ ] API integration complete with error handling
- [ ] Offline behavior tested
- [ ] Role-based access enforced
- [ ] TypeScript compilation passes
- [ ] Critical user flows tested

### For AI Agent Execution
Run these commands to verify:
```bash
cd mobile
npm run typecheck
npm run lint
npm test -- --passWithNoTests
npx expo export --platform ios --dump-sourcemap
```

---

*Dokumen: mobile-development-plan.md | SIMDP | Versi 1.0 | Mei 2026*