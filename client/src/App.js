import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import AgentDashboard from './AgentDashboard';
import AdminPanel from './AdminPanel';

import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import NeuralValuationMatrix from './components/NeuralValuationMatrix';
import MortgageCalculator from './components/MortgageCalculator';
import FilterBar from './components/FilterBar';
import PropertyMap from './components/PropertyMap';
import PropertyGrid from './components/PropertyGrid';
import VirtualTourModal from './components/VirtualTourModal';
import ChatDrawer from './components/ChatDrawer';
import AddPropertyModal from './components/AddPropertyModal';


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const socket = io(API_URL);

function App() {
  // Authentication & View Modes
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '', role: 'buyer' });
  const [viewMode, setViewMode] = useState('buyer'); // 'buyer', 'agent', or 'admin'

  // Listings & Prediction Data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState({});

  // Add Property Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '',
    price: '',
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    latitude: 22.7196,
    longitude: 75.8577,
    agent_name: '',
    contact_phone: '',
    contact_email: ''
  });

  // Custom AI Valuation Form
  const [formData, setFormData] = useState({
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    age: 5,
  });
  const [customPrediction, setCustomPrediction] = useState(null);
  const [estimating, setEstimating] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('ALL');

  // Virtual Tour Modal
  const [activeTourUrl, setActiveTourUrl] = useState(null);

  // Mortgage Calculator
  const [homePrice, setHomePrice] = useState(8500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);

  // Real-time Chat
  const [chatProperty, setChatProperty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const calculatorRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL + '/api/properties');
      setProperties(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setViewMode(parsedUser.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setViewMode('buyer');
  };

  // Auth Handler
  const handleLoginSubmit = async (e, isSignUp) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return;

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const res = await axios.post(``$ {process.env.REACT_APP_API_URL || "API_URL"}${endpoint}`, {
      email: loginData.email,
      password: loginData.password,
      role: loginData.role
    });

    const { token, user: newUser } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser({
      name: newUser.email.split('@')[0].toUpperCase(),
      email: newUser.email,
      role: newUser.role,
      id: newUser.id
    });

    if (newUser.role === 'agent') {
      setViewMode('agent');
    } else {
      setViewMode('buyer');
    }
  };

  // Add Property Handler
  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL + '/api/properties', newProp);
      alert('Property listed successfully on Nexus Matrix!');
      setShowAddModal(false);
      setNewProp({
        title: '', price: '', address: '', bedrooms: 2, bathrooms: 2, sqft: 1200,
        latitude: 22.7196, longitude: 75.8577, agent_name: '', contact_phone: '', contact_email: ''
      });
      fetchProperties();
    } catch (err) {
      alert('Failed to submit listing. Make sure backend is running.');
    }
  };

  // Chat Open Handler
  const handleOpenChat = async (property) => {
    setChatProperty(property);
    socket.emit('join_property_chat', property.id);

    try {
      const res = await axios.get(``$ {process.env.REACT_APP_API_URL || "API_URL"}/api/messages/${property.id}`);
      if (res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          { sender: 'AI Support Bot', text: `Greetings ${user?.name || 'User'}. I am your neural assistant for ${property.title}. How may I assist your query?`, time: 'Just now' }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatProperty) return;

    const messageData = {
      propertyId: chatProperty.id,
      sender: user?.role === 'agent' ? 'Agent (Live)' : 'Buyer',
      text: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handlePredictPrice = async (property) => {
    try {
      const response = await axios.post(API_URL + '/api/predict', {
        bedrooms: property.bedrooms || 2,
        sqft: property.sqft || 1000,
      });

      if (response.data && response.data.success) {
        setPredictions((prev) => ({
          ...prev,
          [property.id]: response.data.predicted_price,
        }));
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  const handleCustomFormSubmit = async (e) => {
    e.preventDefault();
    setEstimating(true);
    try {
      const response = await axios.post(API_URL + '/api/predict', formData);
      if (response.data && response.data.success) {
        setCustomPrediction(response.data.predicted_price);
      }
    } catch (error) {
      console.error('Custom prediction failed:', error);
    } finally {
      setEstimating(false);
    }
  };

  const calculateMortgage = () => {
    const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
    const principal = homePrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    if (principal <= 0 || monthlyRate <= 0) return { emi: 0, totalInterest: 0, downPaymentAmount, principal: 0 };

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalPayment = emi * totalPayments;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      downPaymentAmount: Math.round(downPaymentAmount),
      principal: Math.round(principal)
    };
  };

  const mortgageResult = calculateMortgage();

  const filteredProperties = properties.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBhk = selectedBhk === 'ALL' || Number(item.bedrooms) === Number(selectedBhk);
    return matchesSearch && matchesBhk;
  });

  // 1. LOGIN SCREEN
  if (!user) {
    return (
      <LoginScreen
        loginData={loginData}
        setLoginData={setLoginData}
        handleLoginSubmit={handleLoginSubmit}
      />
    );
  }

  // 2. AGENT DASHBOARD VIEW
  if (viewMode === 'agent') {
    return (
      <div style={{ background: '#020617', minHeight: '100vh', color: '#f8fafc' }}>
        <AgentDashboard onBack={() => setViewMode('buyer')} />
      </div>
    );
  }

  // 3. ADMIN PANEL VIEW
  if (viewMode === 'admin') {
    return (
      <div style={{ background: '#020617', minHeight: '100vh', color: '#f8fafc' }}>
        <AdminPanel onBack={() => setViewMode('buyer')} />
      </div>
    );
  }

  // 4. MAIN BUYER PORTAL
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, #0f172a, #020617)',
      color: '#f8fafc',
      fontFamily: "'Rajdhani', sans-serif",
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Header
          user={user}
          onOpenAddModal={() => setShowAddModal(true)}
          setViewMode={setViewMode}
          onLogout={handleLogout}
        />

        <NeuralValuationMatrix
          formData={formData}
          setFormData={setFormData}
          handleCustomFormSubmit={handleCustomFormSubmit}
          estimating={estimating}
          customPrediction={customPrediction}
        />

        <MortgageCalculator
          homePrice={homePrice}
          setHomePrice={setHomePrice}
          downPaymentPercent={downPaymentPercent}
          setDownPaymentPercent={setDownPaymentPercent}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          loanTermYears={loanTermYears}
          setLoanTermYears={setLoanTermYears}
          mortgageResult={mortgageResult}
          calculatorRef={calculatorRef}
        />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBhk={selectedBhk}
          setSelectedBhk={setSelectedBhk}
        />

        <PropertyMap
          filteredProperties={filteredProperties}
        />

        <PropertyGrid
          loading={loading}
          filteredProperties={filteredProperties}
          predictions={predictions}
          onPredictPrice={handlePredictPrice}
          onOpenTour={(tourUrl) => setActiveTourUrl(tourUrl)}
          onOpenChat={handleOpenChat}
        />
      </div>

      <VirtualTourModal
        activeTourUrl={activeTourUrl}
        onClose={() => setActiveTourUrl(null)}
      />

      <ChatDrawer
        chatProperty={chatProperty}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        onClose={() => setChatProperty(null)}
        user={user}
        chatBottomRef={chatBottomRef}
      />

      <AddPropertyModal
        showAddModal={showAddModal}
        onClose={() => setShowAddModal(false)}
        newProp={newProp}
        setNewProp={setNewProp}
        handleAddPropertySubmit={handleAddPropertySubmit}
      />
    </div>
  );
}

export default App;
