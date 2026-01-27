import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KeywordData {
  keyword1: string;
  keyword2: string;
  keyword3: string;
  operator: 'None' | 'AND' | 'OR';
}

interface KeywordSearchModalProps {
  visible: boolean;
  onClose: () => void;
  keywordData: KeywordData;
  setKeywordData: (data: KeywordData) => void;
  showOperatorDropdown: boolean;
  setShowOperatorDropdown: (show: boolean) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const KeywordSearchModal: React.FC<KeywordSearchModalProps> = ({
  visible,
  onClose,
  keywordData,
  setKeywordData,
  showOperatorDropdown,
  setShowOperatorDropdown,
  onReset,
  onSearch,
}) => {
  const handleClose = () => {
    setShowOperatorDropdown(false);
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
            <Text style={styles.modalTitle}>Search By Keyword</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.keywordInfoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#00598E" />
              <Text style={styles.keywordInfoText}>
                Search for keywords within proceeding documents and content. Use operators to combine multiple keywords.
              </Text>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Enter first search keyword</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter keyword"
                value={keywordData.keyword1}
                onChangeText={(text) => setKeywordData({ ...keywordData, keyword1: text })}
              />
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Operator</Text>
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setShowOperatorDropdown(!showOperatorDropdown)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    keywordData.operator === 'None' && styles.dropdownPlaceholder,
                  ]}
                >
                  {keywordData.operator}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              {showOperatorDropdown && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      keywordData.operator === 'None' && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setKeywordData({ ...keywordData, operator: 'None' });
                      setShowOperatorDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        keywordData.operator === 'None' && styles.dropdownItemTextSelected,
                      ]}
                    >
                      None
                    </Text>
                    {keywordData.operator === 'None' && (
                      <Ionicons name="checkmark" size={20} color="#00598E" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      keywordData.operator === 'AND' && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setKeywordData({ ...keywordData, operator: 'AND' });
                      setShowOperatorDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        keywordData.operator === 'AND' && styles.dropdownItemTextSelected,
                      ]}
                    >
                      AND
                    </Text>
                    {keywordData.operator === 'AND' && (
                      <Ionicons name="checkmark" size={20} color="#00598E" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      keywordData.operator === 'OR' && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setKeywordData({ ...keywordData, operator: 'OR' });
                      setShowOperatorDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        keywordData.operator === 'OR' && styles.dropdownItemTextSelected,
                      ]}
                    >
                      OR
                    </Text>
                    {keywordData.operator === 'OR' && (
                      <Ionicons name="checkmark" size={20} color="#00598E" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {keywordData.operator !== 'None' && (
              <>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Enter second search keyword</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter keyword (optional)"
                    value={keywordData.keyword2}
                    onChangeText={(text) => setKeywordData({ ...keywordData, keyword2: text })}
                  />
                </View>

                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Enter third search keyword</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter keyword (optional)"
                    value={keywordData.keyword3}
                    onChangeText={(text) => setKeywordData({ ...keywordData, keyword3: text })}
                  />
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
              <Text style={styles.searchButtonText}>Search by Keyword</Text>
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
  keywordInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  keywordInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#00598E',
    lineHeight: 20,
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


