import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './frontend/home';
import AccountType from './frontend/auth/signup/accountType';
import ClinicSignUp from './frontend/auth/signup/clinicSignUp';
import OwnerSignUp from './frontend/auth/signup/ownerSignUp';
import Login from './frontend/auth/login/login';
import Map from './frontend/navbar/map';
import AboutUs from './frontend/navbar/aboutUs';
import PetInfo from './frontend/navbar/petInfo';
import Dogs from './frontend/navbar/pets/dogs';
import Cats from './frontend/navbar/pets/cats';
import SmallPets from './frontend/navbar/pets/smallPets'
import Pharmacy from './frontend/navbar/pharmacy';
import PrivacyPolicy from './frontend/privacy/privacyPolicy';
import Accessibility from './frontend/privacy/accessibility';
import Terms from './frontend/privacy/terms';
import Formular from './frontend/clinics/clinicData/formular';
import ClinicDashboard from './frontend/clinics/clinicData/clinic';
import ClientPage from './frontend/client/clientPage';
import ClientClinicDetails from './frontend/client/clinicDetails';
import MyPets from './frontend/client/myPets';
import ClientProfile from './frontend/client/profile';
import ClinicPatients from './frontend/clinics/patients/patients';
import MyClinicPage from './frontend/client/myClinic/myClinic';
import MyClinicsPage from './frontend/client/myClinics';
import Navbar from './frontend/navbar';
import MedicalRecordsPage from './frontend/client/myClinic/medicalRecordsPage';
import AppointmentForm from './frontend/client/appointments/appointments';


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accountType" element={<AccountType />} />
        <Route path="/signupAsClinic" element={<ClinicSignUp />} />
        <Route path="/signupAsPetOwner" element={<OwnerSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/petInfo" element={<PetInfo />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/cats" element={<Cats />} />
        <Route path="/smallPets" element={<SmallPets />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
        <Route path="/accessibility" element={<Accessibility/>} />
        <Route path="/terms" element={<Terms/>} />
        <Route path="/form" element={<Formular/>} />
        <Route path="/clinic/profile" element={<ClinicDashboard/>} />
        <Route path="/client" element={<ClientPage/>} />
        <Route path="/client/clinic/:id" element={<ClientClinicDetails/>} />
        <Route path="/client/pets" element={<MyPets/>} />
        <Route path="/client/profile" element={<ClientProfile/>} />
        <Route path="/clinic/patients" element={<ClinicPatients/>} />
        <Route path="/client/my-clinics/:clinicId" element={<MyClinicPage/>} />
        <Route path="/client/clinics" element={<MyClinicsPage/>} />
        <Route path="/client/medical-records" element={<MedicalRecordsPage/>} />
         <Route path="/client/appointments" element={<AppointmentForm/>} />
      </Routes>
  );
}

export default App;