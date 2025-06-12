

// import React, { useState, useEffect } from 'react';
// import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
// import { Modal, Portal, Text, Button, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
// import Markdown from 'react-native-markdown-display';

// const LaudoModal = ({
//   visible,
//   onDismiss,
//   evidence,
//   caseInfo,
//   onGenerateReport,
//   onDownloadPDF,
//   loading,
//   imageBase64,
// }) => {
//   const [reportContent, setReportContent] = useState('');
//   const [hasReport, setHasReport] = useState(false);

//   useEffect(() => {
//     if (visible && evidence) {
//       setReportContent('');
//       setHasReport(false);
//     }
//   }, [visible, evidence]);

//   const handleGenerateReport = async () => {
//     try {
//       const report = await onGenerateReport(evidence, caseInfo);
//       setReportContent(report.report);
//       setHasReport(true);
//     } catch (error) {
//       Alert.alert('Erro', 'Falha ao gerar laudo: ' + error.message);
//     }
//   };

//   const parseContent = (content) => {
//     if (!content) return {};
//     try {
//       return JSON.parse(content);
//     } catch (e) {
//       return {};
//     }
//   };

//   const contentData = evidence ? parseContent(evidence.content) : {};

//   return (
//     <Portal>
//       <Modal
//         visible={visible}
//         onDismiss={onDismiss}
//         contentContainerStyle={styles.modalContainer}
//       >
//         <View style={styles.header}>
//           <Text style={styles.title}>
//             Laudo Pericial - Evidência {evidence?.id}
//           </Text>
//           <IconButton
//             icon="close"
//             size={24}
//             onPress={onDismiss}
//           />
//         </View>
//         <Divider />
//         <ScrollView style={styles.content}>
//           <View style={styles.evidenceInfo}>
//             <Text style={styles.sectionTitle}>Informações da Evidência</Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>ID:</Text> {evidence?.id || 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Nome:</Text> {contentData.nome || 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Tipo:</Text> {evidence?.type || 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Data de Coleta:</Text>{' '}
//               {evidence?.dateCollection
//                 ? new Date(evidence.dateCollection).toLocaleDateString('pt-BR')
//                 : 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Tipo de Exames:</Text>{' '}
//               {contentData.tipoExames || 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Caso:</Text>{' '}
//               {caseInfo?.title || 'N/A'}
//             </Text>
//             <Text style={styles.infoText}>
//               <Text style={styles.label}>Status:</Text> {evidence?.status || 'N/A'}
//             </Text>
//             {imageBase64 && (
//               <Image
//                 source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
//                 style={styles.evidenceImage}
//               />
//             )}
//           </View>
//           <Divider style={styles.divider} />
//           {!hasReport && !loading && (
//             <View style={styles.generateSection}>
//               <Text style={styles.sectionTitle}>Gerar Laudo</Text>
//               <Text style={styles.description}>
//                 Clique abaixo para gerar um laudo pericial automatizado com base nas informações da evidência.
//               </Text>
//               <Button
//                 mode="contained"
//                 icon="file-document"
//                 onPress={handleGenerateReport}
//                 style={styles.generateButton}
//               >
//                 Gerar Laudo com IA
//               </Button>
//             </View>
//           )}
//           {loading && (
//             <View style={styles.loadingSection}>
//               <ActivityIndicator size="large" color="#6200ee" />
//               <Text style={styles.loadingText}>Gerando laudo...</Text>
//             </View>
//           )}
//           {hasReport && reportContent && (
//             <View style={styles.reportSection}>
//               <Text style={styles.sectionTitle}>Laudo Gerado</Text>
//               <View style={styles.reportContent}>
//                 <Markdown style={markdownStyles}>{reportContent}</Markdown>
//               </View>
//               <View style={styles.buttonContainer}>
//                 <Button
//                   mode="contained"
//                   icon="download"
//                   onPress={() => onDownloadPDF(reportContent, evidence?.id)}
//                   style={styles.actionButton}
//                 >
//                   Baixar PDF
//                 </Button>
//                 <Button
//                   mode="outlined"
//                   icon="content-save"
//                   onPress={() => {
//                     Alert.alert('Sucesso', 'Laudo salvo com sucesso!');
//                     onDismiss();
//                   }}
//                   style={styles.actionButton}
//                 >
//                   Salvar
//                 </Button>
//               </View>
//             </View>
//           )}
//         </ScrollView>
//         <Divider />
//         <View style={styles.footer}>
//           <Button
//             mode="outlined"
//             onPress={onDismiss}
//             style={styles.footerButton}
//           >
//             Fechar
//           </Button>
//         </View>
//       </Modal>
//     </Portal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     backgroundColor: '#fff',
//     margin: 20,
//     borderRadius: 8,
//     maxHeight: '90%',
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   content: {
//     padding: 16,
//   },
//   evidenceInfo: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   infoText: {
//     fontSize: 14,
//     marginBottom: 4,
//     color: '#666',
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   evidenceImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   divider: {
//     marginVertical: 16,
//   },
//   generateSection: {
//     alignItems: 'center',
//     padding: 16,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   generateButton: {
//     width: '80%',
//   },
//   loadingSection: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#666',
//   },
//   reportSection: {
//     marginTop: 16,
//   },
//   reportContent: {
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 16,
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: 8,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   footerButton: {
//     flex: 1,
//     marginHorizontal: 8,
//   },
// });

// const markdownStyles = {
//   body: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//   },
//   heading1: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginVertical: 10,
//   },
//   heading2: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginVertical: 8,
//   },
//   paragraph: {
//     marginVertical: 5,
//   },
// };

// export default LaudoModal;



import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Modal,
  Portal,
  Text,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
 } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';

const LaudoModal = ({
  visible,
  onDismiss,
  evidence,
  caseInfo,
  onGenerateReport,
  onDownloadPDF,
  loading,
}) => {
  const [reportContent, setReportContent] = useState('');
  const [hasReport, setHasReport] = useState(false);

  useEffect(() => {
    if (visible && evidence) {
      setReportContent('');
      setHasReport(false);

      // Validar caseId
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(evidence?.caseId);
      if (!isValidUUID) {
        Alert.alert('Erro', 'ID do caso inválido para a evidência selecionada.');
        onDismiss();
      }
    }
  }, [visible, evidence, onDismiss]);

  const handleGenerateReport = useCallback(async () => {
  if (!evidence?.caseId || !caseInfo?.id) {
    Alert.alert('Erro', 'Caso não selecionado ou inválido.');
    return;
  }

  try {
    const report = await onGenerateReport(evidence, caseInfo);
    setReportContent(report.report);
    setHasReport(true);
  } catch (error) {
    Alert.alert('Erro', `Falha ao gerar laudo: ${error.message}`);
  }
}, [evidence, caseInfo, onGenerateReport]);

const parseContent = (content) => {
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
};


  const contentData = evidence ? parseContent(evidence.content) : {};

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Laudo Pericial Perícial- Evidência {evidence?.id || 'N/A'}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
          />
          
        </View>
        <Divider />
        <ScrollView style={styles.content}>
          <View style={styles.evidenceInfo}>
            <Text style={styles.sectionTitle}>Informações da Evidência</Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>ID:</Text> {evidence?.id || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Nome:</Text> Nome: {contentData.nome || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Tipo:</Text> {evidence?.type || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Data de Coleta:</Text>
              {evidence?.dateCollection
                ? new Date(evidence.dateCollection).toLocaleDateString('pt-BR')
                : 'N/A'}
              </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Tipo de Exames:</Text> {contentData.tipoExames || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Caso:</Text> {caseInfo?.title || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Status:</Text> {evidence?.status || 'N/A'}
            </Text>
          </View>
          <Divider style={styles.divider} />
          {!hasReport && !loading && (
            <View style={styles.generateSection}>
              <Text style={styles.sectionTitle}>Gerar Laudo</Text>
              <Text style={styles.description}>
                Clique abaixo para gerar um laudo pericial automatizado com base nas informações da evidência.
              </Text>
              <Button
                mode="contained"
                icon="description"
                onPress={handleGenerateReport}
                style={styles.generateButton}
              >
                Gerar Laudo com IA
              </Button>
            </View>
          )}
          {loading && (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color="#6200ee" />
              <Text style={styles.loadingText}>Gerando laudo...</Text>
            </View>
          )}
          {hasReport && reportContent && (
            <View style={styles.reportSection}>
              <Text style={styles.sectionTitle}>Laudo Gerado</Text>
              <View style={styles.reportContent}>
                <Markdown style={markdownStyles}>{reportContent}</Markdown>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon="download"
                  onPress={() => onDownloadPDF(reportContent, evidence?.id)}
                  style={styles.actionButton}
                >
                  Baixar PDF
                </Button>
                <Button
                  mode="outlined"
                  icon="content-save"
                  onPress={() => {
                    Alert.alert('Sucesso', 'Laudo salvo com sucesso!');
                    onDismiss();
                  }}
                  style={styles.actionButton}
                >
                  Salvar
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
        <Divider />
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.footerButton}
          >
            Fechar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  evidenceInfo: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 16,
  },
  generateSection: {
    alignItems: 'center',
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  generateButton: {
    width: '80%',
  },
  loadingSection: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  reportSection: {
    marginTop: 16,
  },
  reportContent: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

const markdownStyles = {
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  heading2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 8,
  },
  paragraph: {
    marginVertical: 5,
  },
};

export default LaudoModal;
