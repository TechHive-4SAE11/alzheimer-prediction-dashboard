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
  Eye
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

  // Form states - All 16 features required by the Lasso-optimized model
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
    const file = e.target.files[0];
    if (file) {
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
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Brain size={32} color="white" />
          </div>
          <h2 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>ML ALZHEIMER Predictions</h2>
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
          <div style={{ margin: '1rem 0', height: '1px', background: 'var(--glass-border)' }}></div>
          <button className={`nav-link ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
            <Database size={20} /> About Data
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }} className="glass-panel card">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure Diagnostic Node</span>
          </div>
          
          <a 
            href="https://github.com/TechHive-4SAE11/alzheimer-prediction-dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link"
            style={{ border: '1px solid var(--glass-border)', justifyContent: 'center', marginBottom: '1rem' }}
          >
            <Github size={18} /> Source Code
          </a>
          
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center' }}>Medical Engine v1.2.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'mri' && (
            <motion.div key="mri" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MRI Structural Analysis</h1>
              <div className="grid-2">
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Upload Scan</h3>
                  <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '1rem', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {preview ? <img src={preview} alt="MRI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                      <>
                        <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Upload MRI image</p>
                      </>
                    )}
                    <input type="file" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={runMriPrediction} disabled={loading || !mriFile}>
                    {loading ? "Analyzing..." : "Start Diagnosis"}
                  </button>
                </div>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Result</h3>
                  {mriResult ? (
                    <div className="animate-fade-in">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem' }}>
                          <Brain size={40} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Primary Diagnosis</p>
                          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{mriResult.diagnosis}</h2>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span>Confidence</span>
                        <span className="badge badge-success">{(mriResult.confidence * 100).toFixed(1)}%</span>
                      </div>

                      <div style={{ background: 'var(--surface-light)', height: '8px', borderRadius: '4px', marginTop: '1rem' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mriResult.confidence * 100}%` }}
                          transition={{ duration: 1 }}
                          style={{ height: '100%', background: 'var(--primary)', borderRadius: '4px' }}
                        />
                      </div>

                      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Model Verification Breakdown</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {mriResult.details && Object.entries(mriResult.details).map(([model, pred]) => (
                            <div key={model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{model}</span>
                              <span style={{ fontWeight: 600 }}>{pred}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                      <FileSearch size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p>Awaiting scan analysis</p>
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
                    {/* Cognitive Section */}
                    <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Cognitive & Functional</span>
                    </div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MMSE</label><input name="MMSE" type="number" className="input-field" value={formData.MMSE} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Functional</label><input name="FunctionalAssessment" type="number" className="input-field" value={formData.FunctionalAssessment} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ADL</label><input name="ADL" type="number" className="input-field" value={formData.ADL} onChange={handleInputChange} /></div>

                    {/* Demographic & Vital */}
                    <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)' }}>Vital & Demographic</span>
                    </div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Age</label><input name="Age" type="number" className="input-field" value={formData.Age} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Education</label><input name="EducationLevel" type="number" className="input-field" value={formData.EducationLevel} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sleep Quality</label><input name="SleepQuality" type="number" className="input-field" value={formData.SleepQuality} onChange={handleInputChange} /></div>

                    {/* Lipid Profile */}
                    <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>Lipid Profile (mg/dL)</span>
                    </div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Chol. LDL</label><input name="CholesterolLDL" type="number" className="input-field" value={formData.CholesterolLDL} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Chol. HDL</label><input name="CholesterolHDL" type="number" className="input-field" value={formData.CholesterolHDL} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Triglycerides</label><input name="CholesterolTriglycerides" type="number" className="input-field" value={formData.CholesterolTriglycerides} onChange={handleInputChange} /></div>

                    {/* Risk Factors */}
                    <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)' }}>Risk Factors (0/1)</span>
                    </div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Smoking</label><input name="Smoking" type="number" className="input-field" value={formData.Smoking} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hypertension</label><input name="Hypertension" type="number" className="input-field" value={formData.Hypertension} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Head Injury</label><input name="HeadInjury" type="number" className="input-field" value={formData.HeadInjury} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Memory Comp.</label><input name="MemoryComplaints" type="number" className="input-field" value={formData.MemoryComplaints} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Behavioral Pr.</label><input name="BehavioralProblems" type="number" className="input-field" value={formData.BehavioralProblems} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Disorientation</label><input name="Disorientation" type="number" className="input-field" value={formData.Disorientation} onChange={handleInputChange} /></div>
                    <div><label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cardio Disease</label><input name="CardiovascularDisease" type="number" className="input-field" value={formData.CardiovascularDisease} onChange={handleInputChange} /></div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} onClick={runClinicalPrediction} disabled={loading}>{loading ? "Predicting..." : "Analyze Clinical Risk"}</button>
                </div>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Risk Score</h3>
                  {clinicalResult ? (
                    <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ color: clinicalResult.probability > 0.5 ? 'var(--danger)' : 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1rem' }}>{clinicalResult.diagnosis}</h4>
                      <p style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>{(clinicalResult.probability * 100).toFixed(1)}%</p>
                      <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.75rem', fontSize: '0.7rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Engine</p>
                        <p style={{ fontWeight: 500 }}>Lasso-Optimized SVM Pipeline</p>
                      </div>
                    </div>
                  ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Enter data to assess risk</p>}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'care' && (
            <motion.div key="care" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Personalized Care Plan</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Cluster Analysis</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Find your top 5 Clinical Twins from our database to generate a personalized intervention plan.</p>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={runRecommendation} disabled={loading}>
                    {loading ? "Matching Twins..." : "Generate Care Plan"}
                  </button>
                </div>
                <div className="glass-panel card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Personalized Suggestion</h3>
                  {recoResult ? (
                    <div className="animate-fade-in">
                      <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '1rem', border: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>{recoResult.recommended_focus}</h4>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{recoResult.actions}</p>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem', fontSize: '0.75rem' }}>
                        <p style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Methodology: Clinical Twin Matching</p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          Your plan is generated by identifying your <strong>K-Means Cohort</strong> and finding your top 5 <strong>Clinical Twins</strong> (patients with the most similar 16 biomarkers). The recommendations are based on peer-consensus for your specific profile.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                      <ClipboardList size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p>Generate a plan to see AI-matched suggestions</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div key="data" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Data Science Foundation</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}><Eye size={200} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem' }}><Eye size={32} color="var(--primary)" /></div>
                    <h3 style={{ fontSize: '1.5rem' }}>Structural Imaging (MRI)</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>Ensemble Analysis across Custom CNN and ResNet50.</p>
                </div>
                <div className="glass-panel card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}><Dna size={200} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '1rem' }}><Dna size={32} color="var(--secondary)" /></div>
                    <h3 style={{ fontSize: '1.5rem' }}>Clinical Biomarkers</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>Based on 16 Lasso-Selected features identifying the most predictive markers.</p>
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
