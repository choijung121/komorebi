import { StyleSheet } from 'react-native';

const authStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  form: {
    width: '100%',
    maxWidth: 360
  },
  header: {
    marginBottom: 40,
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  field: {
    marginBottom: 16
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12
  },
  nameField: {
    flex: 1
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  errorWrap: {
    marginBottom: 16
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444'
  },
  fieldError: {
    marginTop: 8,
    fontSize: 12,
    color: '#F97316'
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  },
  secondaryText: {
    color: '#374151',
    fontWeight: '700'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  confirmCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8
  },
  confirmBody: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16
  }
});

export default authStyles;
