import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterData {
  proceedingId: string;
  partyName: string;
  dateFrom: string;
  dateTo: string;
  proceedingStatus: string;
  proceedingType: string;
  jointHearing: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
  statusOptions: string[];
  typeOptions: string[];
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  showTypeDropdown: boolean;
  setShowTypeDropdown: (show: boolean) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filterData,
  setFilterData,
  statusOptions,
  typeOptions,
  showStatusDropdown,
  setShowStatusDropdown,
  showTypeDropdown,
  setShowTypeDropdown,
  onReset,
  onSearch,
}) => {
  const handleClose = () => {
    setShowStatusDropdown(false);
    setShowTypeDropdown(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Proceedings</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Proceeding ID</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter proceeding ID"
                value={filterData.proceedingId}
                onChangeText={(text) => setFilterData({ ...filterData, proceedingId: text })}
              />
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Party Name</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter individual's name"
                value={filterData.partyName}
                onChangeText={(text) => setFilterData({ ...filterData, partyName: text })}
              />
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Hearing Start Date</Text>
              <View style={styles.dateRangeContainer}>
                <TextInput
                  style={[styles.filterInput, styles.dateInput]}
                  placeholder="From"
                  value={filterData.dateFrom}
                  onChangeText={(text) => setFilterData({ ...filterData, dateFrom: text })}
                />
                <Ionicons name="arrow-forward" size={20} color="#666" />
                <View style={styles.dateInputWithIcon}>
                  <TextInput
                    style={[styles.filterInput, styles.dateInput]}
                    placeholder="To"
                    value={filterData.dateTo}
                    onChangeText={(text) => setFilterData({ ...filterData, dateTo: text })}
                  />
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </View>
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Proceeding Status</Text>
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => {
                  setShowTypeDropdown(false);
                  setShowStatusDropdown(!showStatusDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !filterData.proceedingStatus && styles.dropdownPlaceholder,
                  ]}
                >
                  {filterData.proceedingStatus || 'Select status'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFilterData({ ...filterData, proceedingStatus: '' });
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>All Statuses</Text>
                  </TouchableOpacity>
                  {statusOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.dropdownItem,
                        filterData.proceedingStatus === status && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setFilterData({ ...filterData, proceedingStatus: status });
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          filterData.proceedingStatus === status && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {status}
                      </Text>
                      {filterData.proceedingStatus === status && (
                        <Ionicons name="checkmark" size={20} color="#00598E" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Proceeding Type</Text>
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => {
                  setShowStatusDropdown(false);
                  setShowTypeDropdown(!showTypeDropdown);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !filterData.proceedingType && styles.dropdownPlaceholder,
                  ]}
                >
                  {filterData.proceedingType || 'Select type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {showTypeDropdown && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFilterData({ ...filterData, proceedingType: '' });
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>All Types</Text>
                  </TouchableOpacity>
                  {typeOptions.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        filterData.proceedingType === type && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setFilterData({ ...filterData, proceedingType: type });
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          filterData.proceedingType === type && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                      {filterData.proceedingType === type && (
                        <Ionicons name="checkmark" size={20} color="#00598E" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.filterRow, styles.toggleRow]}>
              <Text style={styles.filterLabel}>Joint Hearing</Text>
              <Switch
                value={filterData.jointHearing}
                onValueChange={(value) => setFilterData({ ...filterData, jointHearing: value })}
                trackColor={{ false: '#E0E0E0', true: '#00598E' }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
    flex: 1,
  },
  filterRow: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateInputWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    minHeight: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#00598E',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  searchButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#00598E',
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});


