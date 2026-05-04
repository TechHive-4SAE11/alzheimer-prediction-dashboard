import React, { useState } from 'react';
import {
  Activity,
  Brain,
  ClipboardList,
  Upload,
  Search,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  User,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  ChevronRight,
  Info,
  Database,
  Dna,
  Eye,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = "https://nessim9898-alzheimer-api.hf.space";

const App = () => {
  const [activeTab, setActiveTab] = useState('mri');
  const [mriResult, setMriResult] = useState(null);
  const [clinicalResult, setClinicalResult] = useState(null);
  const [recoResult, setRecoResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mriFile, setMriFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const examples = [
    { name: 'Démence Légère', path: '/img/MildDemented.jpg' },
    { name: 'Démence Modérée', path: '/img/ModerateDemented.jpg' },
    { name: 'Non Dément', path: '/img/NonDemented.jpg' },
    { name: 'Démence Très Légère', path: '/img/VeryMildDemented.jpg' }
  ];

  const diagnosisMap = {
    'MildDemented': 'Démence Légère',
    'ModerateDemented': 'Démence Modérée',
    'NonDemented': 'Non Dément',
    'VeryMildDemented': 'Démence Très Légère',
    'Mild': 'Démence Légère',
    'Moderate': 'Démence Modérée',
    'Non': 'Non Dément',
    'Very Mild': 'Démence Très Légère'
  };

  const translateDiagnosis = (diag) => diagnosisMap[diag.replace(/\s+/g, '')] || diagnosisMap[diag] || diag;

  const [formData, setFormData] = useState({
    Age: 75,
    EducationLevel: 2,
    Smoking: 0,
    SleepQuality: 8.0,
    CardiovascularDisease: 0,
    HeadInjury: 0,
    Hypertension: 0,
    CholesterolLDL: 120,
    CholesterolHDL: 50,
    CholesterolTriglycerides: 150,
    MMSE: 24,
    FunctionalAssessment: 6.5,
    MemoryComplaints: 1,
    BehavioralProblems: 0,
    ADL: 2.0,
    Disorientation: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setMriFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExampleSelect = async (path) => {
    setLoading(true);
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const filename = path.split('/').pop();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      setMriFile(file);
      setPreview(path);
    } catch (err) {
      console.error("Error loading example:", err);
    }
    setLoading(false);
  };

  const onDragStart = (e, path) => {
    e.dataTransfer.setData("examplePath", path);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const path = e.dataTransfer.getData("examplePath");
    if (path) {
      handleExampleSelect(path);
    } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMriFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const runMriPrediction = async () => {
    if (!mriFile) return;
    setLoading(true);
    const body = new FormData();
    body.append('file', mriFile);
    try {
      const res = await axios.post(`${API_BASE}/predict-mri`, body);
      setMriResult(res.data);
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  const runClinicalPrediction = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/predict-clinical`, formData);
      setClinicalResult(res.data);
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  const runRecommendation = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/recommend-care`, formData);
      setRecoResult(res.data);
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#ffffff', padding: '0.5rem', border: '1px solid #ffffff' }}>
            <Brain size={32} color="#000000" />
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.2rem', color: '#ffffff' }}>ALZHEIMER ML HUB</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className={`nav-link ${activeTab === 'mri' ? 'active' : ''}`} onClick={() => setActiveTab('mri')}>
            <Search size={20} /> MRI Diagnosis
          </button>
          <button className={`nav-link ${activeTab === 'clinical' ? 'active' : ''}`} onClick={() => setActiveTab('clinical')}>
            <Activity size={20} /> Clinical Risk
          </button>
          <button className={`nav-link ${activeTab === 'care' ? 'active' : ''}`} onClick={() => setActiveTab('care')}>
            <ClipboardList size={20} /> Care Plan
          </button>
          <div style={{ margin: '1rem 0', height: '1px', background: '#ffffff' }}></div>
          <button className={`nav-link ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
            <Database size={20} /> About Data
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }} className="glass-panel card">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={16} color="#a1a1aa" />
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Secure Diagnostic Node</span>
          </div>
          <a href="https://github.com/TechHive-4SAE11/alzheimer-prediction-dashboard" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ border: '1px solid #ffffff', justifyContent: 'center', marginBottom: '1rem' }}>
            <Code size={18} /> Source Code
          </a>
          <p style={{ fontSize: '0.7rem', color: '#52525b', textAlign: 'center' }}>Medical Engine v1.2.0</p>
        </div>
      </aside>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'mri' && (
            <motion.div key="mri" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Analyse Structurelle IRM</h1>
              <div className="grid-2">
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Télécharger Scan</h3>
                  <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    style={{ 
                      border: isDragging ? '2px solid #ffffff' : '2px dashed #ffffff', 
                      borderRadius: '0', 
                      height: '300px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      position: 'relative', 
                      overflow: 'hidden',
                      background: isDragging ? 'rgba(255,255,255,0.1)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preview ? <img src={preview} alt="MRI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                      <><Upload size={48} color="#a1a1aa" style={{ marginBottom: '1rem' }} /><p style={{ color: '#a1a1aa' }}>Télécharger ou Glisser l'image IRM</p></>
                    )}
                    <input type="file" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                  
                  <div style={{ marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Exemples de Scans (Glisser-déposer ou cliquer)</p>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {examples.map((ex, i) => (
                        <div 
                          key={i}
                          draggable
                          onDragStart={(e) => onDragStart(e, ex.path)}
                          onClick={() => handleExampleSelect(ex.path)}
                          style={{ 
                            flex: '0 0 80px', 
                            height: '80px', 
                            border: '1px solid #333', 
                            cursor: 'grab',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={ex.path} 
                            alt={ex.name} 
                            className="example-item-img"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', fontSize: '0.5rem', textAlign: 'center', padding: '2px' }}>{ex.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={runMriPrediction} disabled={loading || !mriFile}>
                    {loading ? "Analyse en cours..." : "Démarrer le Diagnostic"}
                  </button>
                </div>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Résultat</h3>
                  {mriResult ? (
                    <div className="animate-fade-in">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', border: '1px solid #ffffff' }}><Brain size={40} color="#ffffff" /></div>
                        <div>
                          <p style={{ color: '#a1a1aa', fontSize: '0.75rem', letterSpacing: '0.1em' }}>DIAGNOSTIC</p>
                          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{translateDiagnosis(mriResult.diagnosis)}</h2>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span>Confiance</span>
                        <span className="badge badge-success">{(mriResult.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ background: '#333', height: '8px', marginTop: '1rem' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${mriResult.confidence * 100}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: '#ffffff' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#a1a1aa' }}>
                      <FileSearch size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p>En attente d'analyse</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'clinical' && (
            <motion.div key="clinical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Clinical Data Entry</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Patient Health Profile</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 3', borderBottom: '1px solid #ffffff', paddingBottom: '0.5rem' }}><span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Biomarkers & Vitals</span></div>
                    {Object.keys(formData).map(key => (
                      <div key={key}><label style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{key}</label><input name={key} type="number" className="input-field" value={formData[key]} onChange={handleInputChange} /></div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={runClinicalPrediction} disabled={loading}>{loading ? "Predicting..." : "Analyze Clinical Risk"}</button>
                </div>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Risk Score</h3>
                  {clinicalResult ? (
                    <div className="animate-fade-in" style={{ padding: '2rem', border: '2px solid #ffffff' }}>
                      <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 900 }}>{clinicalResult.diagnosis}</h4>
                      <p style={{ fontSize: '3rem', fontWeight: 900 }}>{(clinicalResult.probability * 100).toFixed(1)}%</p>
                    </div>
                  ) : <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem 0' }}>Enter data to assess risk</p>}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'care' && (
            <motion.div key="care" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Care Plan</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Cluster Matching</h3>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={runRecommendation} disabled={loading}>Generate Plan</button>
                </div>
                <div className="glass-panel card">
                  {recoResult ? (
                    <div className="animate-fade-in">
                      <div style={{ padding: '2rem', border: '1px solid #ffffff', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>{recoResult.recommended_focus}</h4>
                        <p style={{ lineHeight: '1.8' }}>{recoResult.actions}</p>
                      </div>
                    </div>
                  ) : <p style={{ color: '#a1a1aa', textAlign: 'center' }}>Awaiting data entry</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
