import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = () => {
    if (playlistName.trim()) {
      onCreate(playlistName.trim());
      setPlaylistName('');
      onClose();
    }
  };

  const handleClose = () => {
    setPlaylistName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.backdrop} onTouchEnd={handleClose}>
          <View style={styles.modal} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>Create Playlist</Text>
            <Text style={styles.subtitle}>Give your playlist a name</Text>

            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              placeholderTextColor="#b3b3b3"
              value={playlistName}
              onChangeText={setPlaylistName}
              autoFocus
              maxLength={50}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton, !playlistName.trim() && styles.createButtonDisabled]}
                onPress={handleCreate}
                disabled={!playlistName.trim()}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#282828',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#1db954',
  },
  createButtonDisabled: {
    backgroundColor: '#282828',
    opacity: 0.5,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CreatePlaylistModal;
