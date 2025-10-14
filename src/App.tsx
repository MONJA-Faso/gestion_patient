import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Layout } from './components/common/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { PatientList } from './components/patients/PatientList';
import { PatientDetail } from './components/patients/PatientDetail';
import { AddPatientForm } from './components/patients/AddPatientForm';
import { AppointmentManagement } from './components/appointments/AppointmentManagement';
import { UserManagement } from './components/users/UserManagement';
import { ReportsManagement } from './components/reports/ReportsManagement';
import { Settings } from './components/settings/Settings';
import { Appointment } from './types';
import { GardeManagement } from './components/gardes/Gardes';
import MedRecords from './components/medicalRecords/MedRecords';
// import { getDashboardInfo } from './api/ApiCenter';
// import Swal from 'sweetalert2';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patientAppointment, setPatientAppointment] = useState<any | null>(null)
  const [detailOnglet, setDetailOnglet] = useState('overview');
  // Test Dossier

  const [isRegister, setIsRegister] = useState(false);


  // const verifyToken = async () => {
  //   try {
  //     getDashboardInfo()
  //   } catch (error: any) {
  //     if (error.response) {
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Erreur',
  //         text: error.response?.data.error,
  //         confirmButtonText: 'OK',
  //         confirmButtonColor: '#d33'
  //       });
  //       return;
  //     }else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Erreur',
  //         text: "Token expiré; Veuillew vous reconnecter !",
  //         confirmButtonText: 'OK',
  //         confirmButtonColor: '#d33'
  //       });
  //     }
  //   }
  // }

  // useEffect(() => {
  //   console.log("Info dashboard : ", getDashboardInfo());
  //   verifyToken();
  // }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!isRegister) {
      return <LoginForm isRegister={isRegister} setIsRegister={setIsRegister} />;
    } else {
      return <RegisterForm isRegister={isRegister} setIsRegister={setIsRegister} />;
    }
  }

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setDetailOnglet('overview');
    setCurrentPage('patient-detail');
  };

  const handlePatientMedSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setDetailOnglet('medical');
    setCurrentPage('patient-detail');
  };

  const handleAddPatient = (patient?: any) => {
    if (patient) {
      setSelectedPatient(patient);
    } else {
      setSelectedPatient(null);
    }
    setShowAddPatient(true);
    setCurrentPage('add-patient');
  };

  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setShowAddPatient(false);
    setCurrentPage('patients');
  };

  const handleCreateAppointWithPatient = (appoint?: Partial<Appointment>) => {
    setPatientAppointment(appoint)
    setCurrentPage("appointments")
  }

  const handleAppointmentPatientUsed = () => {
    setPatientAppointment(null);
  }

  const renderPageContent = () => {
    if (currentPage === 'patient-detail' && selectedPatientId) {
      return (
        <PatientDetail
          patientId={selectedPatientId}
          onBack={handleBackToPatients}
          currentTab={detailOnglet}
        />
      );
    }

    if (currentPage === 'add-patient' && showAddPatient) {
      return (
        <AddPatientForm
          onBack={handleBackToPatients}
          onPatientAdded={handleBackToPatients}
          patientInfo={selectedPatient}
        />
      );
    }

    switch (currentPage) {
      case 'patients':
        return (
          <PatientList
            onPatientSelect={handlePatientSelect}
            onAddPatient={handleAddPatient}
            patientAppoint={handleCreateAppointWithPatient}
          />
        );
      case 'appointments':
        return <AppointmentManagement patientAppointment={patientAppointment} freePatientID={handleAppointmentPatientUsed} />;
      case 'medical-records':
        return <MedRecords onPatientSelect={handlePatientMedSelect} />
      case 'reports':
        return <ReportsManagement />;
      case 'gardes':
        return <GardeManagement />
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPageContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;