import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import { GET_PROCEDINGS, ProceedingsFilterInput, ProceedingData } from './queries';
import { FilterModal } from './FilterModal';
import { KeywordSearchModal } from './KeywordSearchModal';

interface Hearing {
  id: string;
  proceedingId: string;
  parties: string[];
  description: string;
  status: 'In Progress' | 'Adjourned' | 'Cancelled' | 'Completed';
  proceedingUpdate: string;
  hearingStartDate?: string;
  participationDeadline?: string;
  formatOfHearing?: string;
  hearingStartEndDates?: string;
  hearingLocation?: string;
  proceedingTypes?: Array<{
    type: string;
    applicantName: string;
    description: string;
    number?: string;
    source?: string;
  }>;
  partiesList?: Array<{ name: string }>;
  submissionSchedule?: Array<{
    submitter: string;
    description: string;
    deadlineDate?: string;
    receivedDate?: string;
    status?: string;
  }>;
  exhibits?: Array<{
    submitter: string;
    fileType: string;
    exhibitNo: string;
    fileName: string;
    fileSize: string;
    url: string;
  }>;
}

const mockHearings: Hearing[] = [
  {
    id: '1',
    proceedingId: '467',
    parties: [
      'Tourmaline Oil Corp.',
      'Tykewest Limited',
      'Northrock Resources Partnership Ltd.',
    ],
    description:
      'Application 33571576 from Tourmaline Oil Corp to amend pipeline license 62758-5, and related common carrier applications 1959278 from Northrock Resources Partnership Ltd. and 1958059 from TykeWest Limited',
    status: 'In Progress',
    proceedingUpdate:
      'The application file for hearing has been received and sent to applicants for verification with responses due by February 4, 2026.',
    hearingStartDate: undefined,
    participationDeadline: '2026-02-04',
    formatOfHearing: 'Hybrid',
    hearingStartEndDates: '2026-03-08 to 2026-03-10',
    hearingLocation: 'Calgary, AB',
    proceedingTypes: [
      {
        type: 'Public Hearing',
        applicantName: 'Tourmaline Oil Corp.',
        description: 'Application to amend pipeline license 62758-5',
        number: '33571576',
        source: 'AER',
      },
    ],
    partiesList: [
      { name: 'Tourmaline Oil Corp.' },
      { name: 'Tykewest Limited' },
      { name: 'Northrock Resources Partnership Ltd.' },
    ],
    submissionSchedule: [
      {
        submitter: 'All Parties',
        description: 'Deadline for written submissions',
        deadlineDate: '2026-02-15',
        status: 'Pending',
      },
    ],
    exhibits: [
      {
        submitter: 'Tourmaline Oil Corp.',
        fileType: 'Application',
        exhibitNo: '1.0',
        fileName: '1.0 - Application Document.pdf',
        fileSize: '2.5 MB',
        url: '#',
      },
    ],
  },
  {
    id: '2',
    proceedingId: '465',
    parties: [
      'North 40 Resources Ltd.',
      'AER Regulatory Applications Branch',
      'Canadian Natural Resources Limited',
    ],
    description:
      "Regulatory Appeal by North 40 Resources Ltd. of the AER Regulatory Applications Branch's July 16, 2025, decision issuing the Pooling Delineation Approval and Off-Target Penalty Approval to Canadian Natural Resources Limited.",
    status: 'In Progress',
    proceedingUpdate:
      'On December 17, 2025, the Notice of Hearing was issued. The final date to submit a request to participate is January 20, 2026. The final date for North 40 to submit a response to any request is February 3, 2026.',
    hearingStartDate: undefined,
    participationDeadline: '2026-01-20',
    formatOfHearing: 'In-Person',
    hearingLocation: 'Edmonton, AB',
    proceedingTypes: [
      {
        type: 'Regulatory Appeal',
        applicantName: 'North 40 Resources Ltd.',
        description:
          'Request for Regulatory Appeal by North 40 Resources Ltd. of the Pooling Delineation Approval and Off-Target Penalty Approval issued to Canadian Natural Resources Limited on July 16, 2025',
        number: '',
        source: '',
      },
    ],
    partiesList: [
      { name: 'North 40 Resources Ltd.' },
      { name: 'AER Regulatory Applications Branch' },
      { name: 'Canadian Natural Resources Limited' },
    ],
    submissionSchedule: [],
    exhibits: [
      {
        submitter: 'North 40 Resources Ltd.',
        fileType: 'Other',
        exhibitNo: '1.0',
        fileName: '1.0 - 2025-11-12 North 40 to AER re Stay Request.pdf',
        fileSize: '2.68 MB',
        url: '#',
      },
      {
        submitter: 'Hearing Services',
        fileType: 'Record of Decision Maker - Requested',
        exhibitNo: '2.0',
        fileName: '2.0 - 2025-11-19 AER to Reg Apps re Request for Record of Decision Maker.pdf',
        fileSize: '179.92 KB',
        url: '#',
      },
      {
        submitter: 'Hearing Panel',
        fileType: 'Other',
        exhibitNo: '3.0',
        fileName: '3.0 - 2025-11-25 Hearing Panel Decision.pdf',
        fileSize: '154.04 KB',
        url: '#',
      },
    ],
  },
  {
    id: '3',
    proceedingId: '464',
    parties: ['DeerGarden Resources Ltd.', 'AER Regulatory'],
    description: 'Regulatory Appeal by DeerGarden Resources',
    status: 'In Progress',
    proceedingUpdate: 'On January 16, 2026, the hearing panel',
    hearingStartDate: '2026-06-16',
    participationDeadline: '2026-02-01',
    formatOfHearing: 'Virtual',
    hearingLocation: 'Virtual',
    proceedingTypes: [
      {
        type: 'Regulatory Appeal',
        applicantName: 'DeerGarden Resources Ltd.',
        description: 'Regulatory Appeal by DeerGarden Resources',
        number: '',
        source: '',
      },
    ],
    partiesList: [{ name: 'DeerGarden Resources Ltd.' }, { name: 'AER Regulatory' }],
    submissionSchedule: [],
    exhibits: [],
  },
];

export const HearingsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [filterData, setFilterData] = useState({
    proceedingId: '',
    partyName: '',
    dateFrom: '',
    dateTo: '',
    proceedingStatus: '',
    proceedingType: '',
    jointHearing: false,
  });
  const [keywordData, setKeywordData] = useState({
    keyword1: '',
    keyword2: '',
    keyword3: '',
    operator: 'None',
  });

  // Build GraphQL filter from filterData
  const graphqlFilter: ProceedingsFilterInput = useMemo(() => {
    const filter: ProceedingsFilterInput = {};
    if (filterData.proceedingId) filter.proceedingId = filterData.proceedingId;
    if (filterData.partyName) filter.partyName = filterData.partyName;
    if (filterData.dateFrom) filter.dateFrom = filterData.dateFrom;
    if (filterData.dateTo) filter.dateTo = filterData.dateTo;
    if (filterData.proceedingStatus) filter.proceedingStatus = filterData.proceedingStatus;
    if (filterData.proceedingType) filter.proceedingType = filterData.proceedingType;
    if (filterData.jointHearing) filter.jointHearing = filterData.jointHearing;
    return filter;
  }, [filterData]);

  // Fetch proceedings from GraphQL API
  const { data, loading, error, refetch } = useQuery(GET_PROCEDINGS, {
    variables: { filter: graphqlFilter },
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('GraphQL Error:', err);
      Alert.alert('Error', 'Failed to load proceedings. Please try again.');
    },
  });

  // Transform API data to Hearing interface
  const apiHearings = useMemo(() => {
    if (!data?.proceedings?.data) return [];
    
    return data.proceedings.data.map((proc: ProceedingData): Hearing => ({
      id: proc.id,
      proceedingId: proc.proceedingId,
      parties: proc.partiesNames || [],
      description: proc.description || '',
      status: (proc.status as any) || 'In Progress',
      proceedingUpdate: proc.reportUpdate || '',
      hearingStartDate: proc.hearingDates?.startDate,
      hearingStartEndDates: proc.hearingDates?.startDate && proc.hearingDates?.endDate
        ? `${proc.hearingDates.startDate} to ${proc.hearingDates.endDate}`
        : proc.hearingDates?.startDate || undefined,
      hearingLocation: proc.location,
      // These fields would need to be fetched separately or included in the query
      participationDeadline: undefined,
      formatOfHearing: undefined,
      proceedingTypes: undefined,
      partiesList: proc.partiesNames?.map(name => ({ name })) || [],
      submissionSchedule: undefined,
      exhibits: undefined,
    }));
  }, [data]);

  // Use API data if available, otherwise fall back to mock data
  const allHearings = apiHearings.length > 0 ? apiHearings : mockHearings;

  // Extract unique values from hearings for dropdowns
  const statusOptions = useMemo(() => {
    const statuses = new Set(allHearings.map((h) => h.status));
    return Array.from(statuses);
  }, [allHearings]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    allHearings.forEach((h) => {
      h.proceedingTypes?.forEach((pt) => {
        types.add(pt.type);
      });
    });
    return Array.from(types);
  }, [allHearings]);

  const filteredHearings = allHearings.filter((hearing) => {
    // Quick search bar filter
    const matchesQuickSearch =
      searchQuery === '' ||
      hearing.proceedingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hearing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hearing.parties.some((party) => party.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hearing.status.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter modal filters
    const matchesFilter =
      (filterData.proceedingId === '' ||
        hearing.proceedingId.toLowerCase().includes(filterData.proceedingId.toLowerCase())) &&
      (filterData.partyName === '' ||
        hearing.parties.some((party) =>
          party.toLowerCase().includes(filterData.partyName.toLowerCase())
        )) &&
      (filterData.proceedingStatus === '' || hearing.status === filterData.proceedingStatus) &&
      (filterData.proceedingType === '' ||
        hearing.proceedingTypes?.some((pt) => pt.type === filterData.proceedingType)) &&
      (filterData.dateFrom === '' ||
        (hearing.hearingStartDate && hearing.hearingStartDate >= filterData.dateFrom)) &&
      (filterData.dateTo === '' ||
        (hearing.hearingStartDate && hearing.hearingStartDate <= filterData.dateTo));

    // Keyword search filter
    const matchesKeyword = (() => {
      if (keywordData.operator === 'None' && keywordData.keyword1 === '') {
        return true; // No keyword search active
      }

      const searchText = `${hearing.proceedingId} ${hearing.description} ${hearing.parties.join(' ')} ${hearing.proceedingUpdate}`.toLowerCase();
      
      const hasKeyword1 = keywordData.keyword1 === '' || searchText.includes(keywordData.keyword1.toLowerCase());
      const hasKeyword2 = keywordData.keyword2 === '' || searchText.includes(keywordData.keyword2.toLowerCase());
      const hasKeyword3 = keywordData.keyword3 === '' || searchText.includes(keywordData.keyword3.toLowerCase());

      if (keywordData.operator === 'AND') {
        return hasKeyword1 && hasKeyword2 && hasKeyword3;
      } else if (keywordData.operator === 'OR') {
        return hasKeyword1 || hasKeyword2 || hasKeyword3;
      } else {
        // None - only check first keyword
        return hasKeyword1;
      }
    })();

    return matchesQuickSearch && matchesFilter && matchesKeyword;
  });

  const handleFilterSearch = () => {
    setShowFilterModal(false);
    setShowStatusDropdown(false);
    setShowTypeDropdown(false);
  };

  const handleKeywordSearch = () => {
    setShowKeywordModal(false);
    setShowOperatorDropdown(false);
  };

  const handleKeywordReset = () => {
    setKeywordData({
      keyword1: '',
      keyword2: '',
      keyword3: '',
      operator: 'None',
    });
  };

  const handleReset = () => {
    setFilterData({
      proceedingId: '',
      partyName: '',
      dateFrom: '',
      dateTo: '',
      proceedingStatus: '',
      proceedingType: '',
      jointHearing: false,
    });
    setShowStatusDropdown(false);
    setShowTypeDropdown(false);
  };

  const renderHearingCard = ({ item }: { item: Hearing }) => (
    <TouchableOpacity
      style={styles.hearingCard}
      onPress={() => navigation.navigate('HearingDetail', { hearing: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.proceedingIdBadge}>
          <Text style={styles.proceedingIdText}>ID: {item.proceedingId}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'In Progress' && styles.statusBadgeActive]}>
          <View style={[styles.statusDot, item.status === 'In Progress' && styles.statusDotGreen]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.partiesContainer}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.partiesLabel}>Parties:</Text>
          <Text style={styles.partiesText} numberOfLines={2}>
            {item.parties.join(', ')}
          </Text>
        </View>

        <View style={styles.updateContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.updateText} numberOfLines={2}>
            {item.proceedingUpdate}
          </Text>
        </View>

        {item.hearingStartDate && (
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>Hearing Start: {item.hearingStartDate}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={20} color="#00598E" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AER Public Hearings</Text>
      </View>

      {/* Welcome Section */}
      <ScrollView style={styles.welcomeSection} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeTitle}>Welcome to the Hearings – Public Record System</Text>
        <Text style={styles.welcomeDescription}>
          The AER maintains a public record for all hearings. This allows you to access documents
          (called Exhibits), and information like key dates, status, etc. For assistance, please
          contact Hearing.Services@aer.ca
        </Text>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>Warning:</Text> Due to migration from an archived
            system to this new system, some information fields may be incorrect or missing. While we
            work to correct this information, please rely on the Exhibits to find the most accurate
            information.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter-outline" size={18} color="#fff" />
          <Text style={styles.filterButtonText}>Filter Proceedings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.keywordButton}
          onPress={() => setShowKeywordModal(true)}
        >
          <Ionicons name="search-outline" size={18} color="#00598E" />
          <Text style={styles.keywordButtonText}>Keyword Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search proceedings..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* List Title */}
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>Proceedings List</Text>
        <Text style={styles.listDescription}>
          Proceedings are listed in numerical order with in-progress proceedings at the top,
          followed by adjourned proceedings. Cancelled and completed proceedings are listed at the
          end.
        </Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00598E" />
          <Text style={styles.loadingText}>Loading proceedings...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
          <Text style={styles.errorText}>Failed to load proceedings</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hearings Cards List */}
      {!loading && !error && (
        <FlatList
          data={filteredHearings}
          renderItem={renderHearingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={() => refetch()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No proceedings found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterData={filterData}
        setFilterData={setFilterData}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        showStatusDropdown={showStatusDropdown}
        setShowStatusDropdown={setShowStatusDropdown}
        showTypeDropdown={showTypeDropdown}
        setShowTypeDropdown={setShowTypeDropdown}
        onReset={handleReset}
        onSearch={handleFilterSearch}
      />
      <KeywordSearchModal
        visible={showKeywordModal}
        onClose={() => setShowKeywordModal(false)}
        keywordData={keywordData}
        setKeywordData={setKeywordData}
        showOperatorDropdown={showOperatorDropdown}
        setShowOperatorDropdown={setShowOperatorDropdown}
        onReset={handleKeywordReset}
        onSearch={handleKeywordSearch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00598E',
  },
  welcomeSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00598E',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    padding: 12,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00598E',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  keywordButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00598E',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  keywordButtonText: {
    color: '#00598E',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listTitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  hearingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proceedingIdBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  proceedingIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00598E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    gap: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#E3F2FD',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  statusDotGreen: {
    backgroundColor: '#28A745',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  cardBody: {
    gap: 12,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    fontWeight: '500',
  },
  partiesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  partiesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  partiesText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  updateText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#00598E',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00598E',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

