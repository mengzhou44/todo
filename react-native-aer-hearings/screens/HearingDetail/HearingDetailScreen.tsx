import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export const HearingDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { hearing }: { hearing: Hearing } = route.params;
  const [selectedExhibits, setSelectedExhibits] = useState<Set<string>>(new Set());

  const handleOpenDocument = (url: string) => {
    Linking.openURL(url);
  };

  const toggleExhibitSelection = (exhibitNo: string) => {
    const newSelection = new Set(selectedExhibits);
    if (newSelection.has(exhibitNo)) {
      newSelection.delete(exhibitNo);
    } else {
      newSelection.add(exhibitNo);
    }
    setSelectedExhibits(newSelection);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.proceedingIdBox}>
            <Text style={styles.proceedingIdText}>Proceeding ID: {hearing.proceedingId}</Text>
          </View>
          <TouchableOpacity
            style={styles.goToListButton}
            onPress={() => navigation.navigate('HearingsList')}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.goToListButtonText}>Go To Proceeding List</Text>
          </TouchableOpacity>
        </View>

        {/* Proceeding Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proceeding Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{hearing.description}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Participation Request Deadline Date</Text>
            <Text style={styles.detailValue}>{hearing.participationDeadline || '—'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Format of Hearing</Text>
            <Text style={styles.detailValue}>{hearing.formatOfHearing || '—'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hearing Start and End Dates</Text>
            <Text style={styles.detailValue}>{hearing.hearingStartEndDates || '—'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Proceeding Update</Text>
            <Text style={styles.detailValue}>{hearing.proceedingUpdate}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hearing Location</Text>
            <Text style={styles.detailValue}>{hearing.hearingLocation || '—'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, hearing.status === 'In Progress' && styles.statusDotGreen]} />
              <Text style={styles.statusText}>{hearing.status}</Text>
            </View>
          </View>
        </View>

        {/* Proceeding Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proceeding Types</Text>
          {hearing.proceedingTypes && hearing.proceedingTypes.length > 0 ? (
            hearing.proceedingTypes.map((type, index) => (
              <View key={index} style={styles.typeCard}>
                <View style={styles.typeRow}>
                  <Text style={styles.typeLabel}>Type:</Text>
                  <Text style={styles.typeValue}>{type.type}</Text>
                </View>
                <View style={styles.typeRow}>
                  <Text style={styles.typeLabel}>Applicant:</Text>
                  <Text style={styles.typeValue}>{type.applicantName}</Text>
                </View>
                <View style={styles.typeRow}>
                  <Text style={styles.typeLabel}>Description:</Text>
                  <Text style={styles.typeValue}>{type.description}</Text>
                </View>
                {type.number && (
                  <View style={styles.typeRow}>
                    <Text style={styles.typeLabel}>Number:</Text>
                    <Text style={styles.typeValue}>{type.number}</Text>
                  </View>
                )}
                {type.source && (
                  <View style={styles.typeRow}>
                    <Text style={styles.typeLabel}>Source:</Text>
                    <Text style={styles.typeValue}>{type.source}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No proceeding types available</Text>
            </View>
          )}
        </View>

        {/* Parties/Others Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties/Others</Text>
          <Text style={styles.sectionSubtitle}>List of Parties and Non-Participants</Text>
          {hearing.partiesList && hearing.partiesList.length > 0 ? (
            <View style={styles.partiesList}>
              {hearing.partiesList.map((party, index) => (
                <View key={index} style={styles.partyItem}>
                  <Ionicons name="person-outline" size={20} color="#00598E" />
                  <Text style={styles.partyName}>{party.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No parties listed</Text>
            </View>
          )}
        </View>

        {/* Submission Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submission Schedule</Text>
          <Text style={styles.scheduleDescription}>
            The submission schedule is set by the hearing panel and outlines the dates each party
            is to submit information or evidence prior to the start of the hearing.
          </Text>
          {hearing.submissionSchedule && hearing.submissionSchedule.length > 0 ? (
            hearing.submissionSchedule.map((item, index) => (
              <View key={index} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleDateBox}>
                    <Ionicons name="calendar-outline" size={16} color="#00598E" />
                    <Text style={styles.scheduleDate}>{item.deadlineDate || '—'}</Text>
                  </View>
                  {item.status && (
                    <View style={styles.scheduleStatus}>
                      <Text style={styles.scheduleStatusText}>{item.status}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.scheduleBody}>
                  <Text style={styles.scheduleSubmitter}>{item.submitter}</Text>
                  <Text style={styles.scheduleDescriptionText}>{item.description}</Text>
                  {item.receivedDate && (
                    <Text style={styles.scheduleReceived}>
                      Received: {item.receivedDate}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No submission schedule available</Text>
            </View>
          )}
        </View>

        {/* Exhibits Section */}
        <View style={styles.section}>
          <View style={styles.exhibitsHeader}>
            <Text style={styles.sectionTitle}>Exhibits</Text>
            {selectedExhibits.size > 0 && (
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download-outline" size={18} color="#fff" />
                <Text style={styles.downloadButtonText}>Download Selected ({selectedExhibits.size})</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.sectionSubtitle}>Exhibits For this Proceeding</Text>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.exhibitSearchInput}
              placeholder="Search exhibits..."
              placeholderTextColor="#999"
            />
          </View>

          {hearing.exhibits && hearing.exhibits.length > 0 ? (
            hearing.exhibits.map((exhibit, index) => (
              <View key={index} style={styles.exhibitCard}>
                <View style={styles.exhibitHeader}>
                  <TouchableOpacity
                    onPress={() => toggleExhibitSelection(exhibit.exhibitNo)}
                    style={[
                      styles.checkbox,
                      selectedExhibits.has(exhibit.exhibitNo) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedExhibits.has(exhibit.exhibitNo) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <View style={styles.exhibitNoBadge}>
                    <Text style={styles.exhibitNoText}>{exhibit.exhibitNo}</Text>
                  </View>
                </View>

                <View style={styles.exhibitBody}>
                  <View style={styles.exhibitRow}>
                    <Text style={styles.exhibitLabel}>Submitter:</Text>
                    <Text style={styles.exhibitValue}>{exhibit.submitter}</Text>
                  </View>
                  <View style={styles.exhibitRow}>
                    <Text style={styles.exhibitLabel}>File Type:</Text>
                    <Text style={styles.exhibitValue}>{exhibit.fileType}</Text>
                  </View>
                  <View style={styles.exhibitRow}>
                    <Text style={styles.exhibitLabel}>File Name:</Text>
                    <TouchableOpacity
                      onPress={() => handleOpenDocument(exhibit.url)}
                      style={styles.fileNameLink}
                    >
                      <Ionicons name="download-outline" size={16} color="#00598E" />
                      <Text style={styles.fileNameText} numberOfLines={2}>
                        {exhibit.fileName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.exhibitRow}>
                    <Text style={styles.exhibitLabel}>File Size:</Text>
                    <Text style={styles.exhibitValue}>{exhibit.fileSize}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.previewButton}>
                  <Ionicons name="eye-outline" size={18} color="#00598E" />
                  <Text style={styles.previewButtonText}>Preview</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No exhibits available</Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  proceedingIdBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  proceedingIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  goToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00598E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  goToListButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  statusDotGreen: {
    backgroundColor: '#28A745',
  },
  statusText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  typeCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 100,
  },
  typeValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  partiesList: {
    gap: 12,
  },
  partyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    gap: 12,
  },
  partyName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 8,
  },
  scheduleDate: {
    fontSize: 13,
    color: '#00598E',
    fontWeight: '600',
  },
  scheduleStatus: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduleStatusText: {
    fontSize: 12,
    color: '#00598E',
    fontWeight: '600',
  },
  scheduleBody: {
    gap: 6,
  },
  scheduleSubmitter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  scheduleDescriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scheduleReceived: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  exhibitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00598E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  exhibitSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  exhibitCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exhibitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#00598E',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00598E',
  },
  exhibitNoBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  exhibitNoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00598E',
  },
  exhibitBody: {
    gap: 8,
    marginBottom: 12,
  },
  exhibitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  exhibitLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 90,
  },
  exhibitValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  fileNameLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileNameText: {
    flex: 1,
    fontSize: 14,
    color: '#00598E',
    textDecorationLine: 'underline',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  previewButtonText: {
    fontSize: 14,
    color: '#00598E',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  bottomSpacing: {
    height: 32,
  },
});


