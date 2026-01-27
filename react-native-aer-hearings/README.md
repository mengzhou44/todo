# AER Public Hearings - React Native App

React Native mobile app for the Alberta Energy Regulator Public Hearings system.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Apollo Client

Update the GraphQL endpoint in `config/apolloClient.ts`:

```typescript
const GRAPHQL_URI = 'https://your-api-endpoint.com/graphql'; // Replace with your actual endpoint
```

### 3. Add Authentication (if needed)

If your API requires authentication, uncomment and configure the auth link in `config/apolloClient.ts`:

```typescript
// Get the authentication token from storage
const token = await AsyncStorage.getItem('authToken');

return {
  headers: {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
  },
};
```

### 4. Run the App

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## GraphQL Query

The app uses the following query to fetch proceedings:

```graphql
query Proceedings($filter: ProceedingsFilterInput) {
  proceedings(filter: $filter) {
    data {
      id
      proceedingId
      location
      status
      description
      reportUpdate
      partiesNames
      hearingDates {
        startDate
        endDate
      }
    }
  }
}
```

## Features

- **Filter Search**: Structured filters for specific fields
- **Keyword Search**: Text-based search with boolean operators (AND, OR)
- **Mobile-friendly**: Card-based layout optimized for mobile devices
- **Pull to Refresh**: Swipe down to refresh proceedings list
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Visual feedback during data fetching

## Project Structure

```
react-native-aer-hearings/
├── config/
│   └── apolloClient.ts      # Apollo Client configuration
├── graphql/
│   └── queries.ts           # GraphQL queries and types
├── screens/
│   ├── HearingsListScreen.tsx    # Main list with filters
│   ├── HearingDetailScreen.tsx  # Detail view with sections
│   └── RegisterScreen.tsx        # Registration form
└── App.tsx                   # Main app with navigation
```

## Notes

- The app falls back to mock data if the API is unavailable
- Filter changes automatically trigger a new API call
- Keyword search is performed client-side on the fetched data
- All filter options are dynamically populated from the API response
