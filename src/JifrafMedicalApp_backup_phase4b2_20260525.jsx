import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartPulse, Activity, Wind, Thermometer, Droplet, AlertCircle,
  ClipboardList, Crosshair, FileSearch, Syringe, FileText, Zap, 
  ShieldAlert, Upload, ChevronRight, CheckCircle2, BrainCircuit,
  Search, Bell, User, Copy, ChevronDown, ChevronUp, Link2, Check, Clock, Shield,
  Globe, Sun, Moon, Monitor
} from 'lucide-react';

/* --- MOCK DATA --- */
const mockData = {
  vitals: [
    { label: "Pulse", value: "145", unit: "bpm", color: "yellow", icon: HeartPulse, glow: true },
    { label: "BP", value: "88/52", unit: "mmHg", color: "yellow", icon: Activity, glow: true },
    { label: "SpO2", value: "89", unit: "%", color: "yellow", icon: Wind, glow: true },
    { label: "Temp", value: "38.8", unit: "°C", color: "yellow", icon: Thermometer, glow: true },
    { label: "Respiratory", value: "28", unit: "/min", color: "yellow", icon: Activity, glow: true },
    { label: "Blood Glucose", value: "110", unit: "mg/dL", color: "green", icon: Droplet, glow: false },
    { label: "Consciousness", value: "Alert", unit: "", color: "green", icon: AlertCircle, glow: false },
  ],
  anamnesis: [
    { label: "Ana Şikayet", value: "Ani Başlayan Dyspnea and Chest Pain" },
    { label: "Başlangıç Zamanı", value: "30 dk önce" },
    { label: "Ağrı Tipi", value: "Pleuritic" },
    { label: "Ek Semptomlar", value: "Baş Dönmesi, Terleme" },
  ],
  diagnoses: [
    { name: "Pulmoner Emboli", prob: 78, color: "orange" },
    { name: "Akut Koroner Sendrom", prob: 65, color: "orange" },
    { name: "Pnömotoraks", prob: 15, color: "orange" }
  ],
  timeline: [
    { time: "12:00", title: "Admission", sub: "", icon: ClipboardList, color: "cyan" },
    { time: "12:05", title: "Anamnez", sub: "", icon: BrainCircuit, color: "cyan" },
    { time: "12:10", title: "EKG", sub: "→ *PE Supported", icon: HeartPulse, color: "green" },
    { time: "12:15", title: "Vitals", sub: "*AKS Supported", icon: Activity, color: "yellow" },
    { time: "12:30", title: "Lab Results", sub: "+ Troponin +", icon: Syringe, color: "red" }
  ]
};

export default function JifrafFuturisticApp() {
  const [activeTab, setActiveTab] = useState('anamnez');
  const [apiData, setApiData] = useState(null);

  // Entegrasyon ve API Yönetim Durumları
  const [caseId, setCaseId] = useState(null);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Phase 2d: Dynamic Ingestion Matrix & Expandable Provenance Layer States
  const [advisoryData, setAdvisoryData] = useState(null);
  const [expandedProvenance, setExpandedProvenance] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Phase 4A-7: Expandable Clinical Heuristic Signals
  const [expandedSignals, setExpandedSignals] = useState({});

  // Phase 4B-1: Patient Intake, EMR & Visit States
  const [intakePatientRef, setIntakePatientRef] = useState('');
  const [intakeBirthYear, setIntakeBirthYear] = useState('1980');
  const [intakeGender, setIntakeGender] = useState('Male');
  const [intakeMedications, setIntakeMedications] = useState('');
  const [intakeAllergies, setIntakeAllergies] = useState('');
  
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [emrCaseId, setEmrCaseId] = useState(null);
  
  // Visit & Vitals & Labs Inputs
  const [intakePulse, setIntakePulse] = useState('145');
  const [intakeBP, setIntakeBP] = useState('88/52');
  const [intakeSpO2, setIntakeSpO2] = useState('89');
  const [intakeTemp, setIntakeTemp] = useState('38.8');
  const [intakeResp, setIntakeResp] = useState('28');
  
  const [intakeMCV, setIntakeMCV] = useState('72');
  const [intakeFerritin, setIntakeFerritin] = useState('12');
  const [intakeIron, setIntakeIron] = useState('85');
  const [intakeCRP, setIntakeCRP] = useState('12');
  const [intakeObsNote, setIntakeObsNote] = useState('Patient presented with acute dyspnea and chest pain.');
  
  const [registeredVisit, setRegisteredVisit] = useState(null);
  const [intakeSuccessMessage, setIntakeSuccessMessage] = useState(null);

  // Mini Phase: User Preferences States (Turkish, English, German, French, Arabic, Kurdish)
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'tr');
  const [theme, setTheme] = useState(() => localStorage.getItem('preferredTheme') || 'dark');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Phase 3c: Clinician Review & Sign-off States
  const [doctorId, setDoctorId] = useState(() => localStorage.getItem('doctorId') || '');
  const [clinicianNote, setClinicianNote] = useState('');
  const [finalReportText, setFinalReportText] = useState('');
  const [reviewStatus, setReviewStatus] = useState('reviewed');
  const [isSignedOff, setIsSignedOff] = useState(false);

  // Gizli Input Referansları
  const pdfInputRef = useRef(null);
  const dicomInputRef = useRef(null);
  const radiologyInputRef = useRef(null);
  const ecgInputRef = useRef(null);
  const stethoscopeInputRef = useRef(null);

  const initiateCaseCreation = () => {
    setLoading(true);
    fetch('http://127.0.0.1:9000/api/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_ref: "ANON-001",
        notes: "Acute Dyspnea with Chest Pain",
        metadata: {
          ui_mode: "recording"
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Yeni vaka başlatılamadı.");
        return res.json();
      })
      .then(data => {
        if (data.case_id) {
          setCaseId(data.case_id);
          setError(null); // Clear error on successful connection
        }
      })
      .catch(err => {
        console.error("Vaka başlatma hatası:", err);
        setError("Sistem Başlatılamadı: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // 1. Backend Şemasına Uygun Vaka Oluşturma İsteği
    initiateCaseCreation();

    // 2. Vitals ve Anamnez Verilerini Çekme
    fetch('http://127.0.0.1:9000/api/data')
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error("Veri bağlantı hatası:", err));
  }, []);

  // Dinamik Query Parametreli Dosya Yükleme Yardımcısı
  const uploadFile = (file, baseUrl) => {
    if (!caseId) {
      setError("Vaka ID henüz oluşturulmadı. Lütfen bekleyin.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${baseUrl}?case_id=${caseId}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Dosya yükleme işlemi başarısız oldu.');
        return res.json();
      })
      .then((data) => {
        // HUD bütünlüğünü korumak için alert kaldırılmış, apiData merge mantığı temizlenmiştir.
        if (data && data.file_id) {
          setUploadedFiles((prev) => [data, ...prev]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Yükleme sırasında bir hata oluştu.');
      })
      .finally(() => {
        setLoading(false);
      });
  };



  const getCategoryFiles = (category) => {
    return uploadedFiles.filter(f => {
      const ext = '.' + f.file_type.toLowerCase();
      if (category === 'radyoloji') {
        return [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".dcm", ".dicom"].includes(ext);
      }
      if (category === 'ekg') {
        return [".jpg", ".jpeg", ".png", ".webp", ".pdf"].includes(ext);
      }
      if (category === 'steteskop') {
        return [".wav", ".mp3", ".m4a", ".ogg", ".flac"].includes(ext);
      }
      return false;
    });
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, 'http://127.0.0.1:9000/api/upload/pdf');
  };

  const handleDicomChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, 'http://127.0.0.1:9000/api/upload/dicom');
  };

  // Gerçek draft_report Alanını Okuyan Advisory Fonksiyonu
  const handleGenerateSummary = () => {
    if (!caseId) {
      setError("Aktif vaka ID bulunamadı.");
      return;
    }
    setLoading(true);
    setError(null);
    
    fetch('http://127.0.0.1:9000/api/advisory/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: caseId,
        vitals: apiData || {
          pulse: "145",
          bp: "88/52",
          spo2: "89",
          temp: "38.8"
        }
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Medikal tavsiye özeti üretilemedi.');
        return res.json();
      })
      .then((data) => {
        if (data.draft_report) {
          setAdvisoryResult(data.draft_report);
          setAdvisoryData(data); // Ingestion matrix and trace binding index mapping active
        } else {
          throw new Error('Yanıt verisinde "draft_report" raporu bulunamadı.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Özet üretilirken bir hata oluştu.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    localStorage.setItem('doctorId', doctorId);
  }, [doctorId]);

  const handleSignoff = () => {
    if (!doctorId.trim() || !finalReportText.trim()) return;
    setLoading(true);
    setError(null);
    
    // Fallback locally as EMR Patient timeline is excluded in Phase 3c
    setTimeout(() => {
      setIsSignedOff(true);
      setLoading(false);
    }, 500);
  };

  // Phase 4B-1: Patient Intake API Handlers
  const handleCreatePatient = () => {
    if (!intakePatientRef.trim()) {
      setError("Hasta referans numarası boş bırakılamaz.");
      return;
    }
    setLoading(true);
    setError(null);
    setIntakeSuccessMessage(null);

    const medicationsArray = intakeMedications.split(',').map(s => s.trim()).filter(Boolean);
    const allergiesArray = intakeAllergies.split(',').map(s => s.trim()).filter(Boolean);

    fetch('http://127.0.0.1:9000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_ref: intakePatientRef,
        birth_year: parseInt(intakeBirthYear, 10) || 1980,
        gender: intakeGender,
        chronic_diseases: [],
        current_medications: medicationsArray,
        allergies: allergiesArray
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Hasta profili oluşturulamadı.");
        return res.json();
      })
      .then(patientData => {
        setRegisteredPatient(patientData);
        setIntakeSuccessMessage(`Hasta başarıyla kaydedildi! (Hasta ID: ${patientData.patient_id})`);
        
        // EMR Case otomatik oluştur
        return fetch('http://127.0.0.1:9000/api/cases/emr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            patient_id: patientData.patient_id,
            primary_complaint: "Acute Dyspnea with Chest Pain"
          })
        });
      })
      .then(res => {
        if (res) {
          if (!res.ok) throw new Error("EMR vaka kaydı açılamadı.");
          return res.json();
        }
      })
      .then(caseData => {
        if (caseData) {
          setEmrCaseId(caseData.case_id);
          // Set as active caseId so that upload panels and pipelines attach to this caseId
          setCaseId(caseData.case_id);
          setIntakeSuccessMessage(prev => `${prev} | EMR Vaka oluşturuldu! (Vaka ID: ${caseData.case_id})`);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Hasta ve EMR oluşturma sırasında bir hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegisterVisit = () => {
    if (!emrCaseId) {
      setError("Aktif bir EMR vaka kaydı bulunamadı. Önce hasta oluşturmalısınız.");
      return;
    }
    setLoading(true);
    setError(null);

    const vitalsObj = {
      pulse: intakePulse,
      bp: intakeBP,
      spo2: intakeSpO2,
      temp: intakeTemp,
      respiratory: intakeResp
    };

    const clinicalLabsArray = [
      { name: "mcv", value: parseFloat(intakeMCV) || 0.0 },
      { name: "ferritin", value: parseFloat(intakeFerritin) || 0.0 },
      { name: "serum_iron", value: parseFloat(intakeIron) || 0.0 },
      { name: "crp", value: parseFloat(intakeCRP) || 0.0 }
    ];

    fetch('http://127.0.0.1:9000/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        case_id: emrCaseId,
        vitals: vitalsObj,
        doctor_observation_note: intakeObsNote,
        clinical_labs: clinicalLabsArray,
        uploaded_manifest_ids: []
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Vizit kaydı eklenemedi.");
        return res.json();
      })
      .then(visitData => {
        setRegisteredVisit(visitData);
        setIntakeSuccessMessage(prev => `${prev} | Vizit ve Vital/Lab bulguları başarıyla kaydedildi! (Vizit ID: ${visitData.visit_id})`);
        
        // Update local HUD vitals display dynamically with the newly inputted vitals
        if (apiData) {
          setApiData(prev => ({
            ...prev,
            pulse: intakePulse,
            bp: intakeBP,
            spo2: intakeSpO2,
            temp: intakeTemp
          }));
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Vizit kaydı sırasında bir hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const displayVitals = mockData.vitals.map(v => {
    if (!apiData) return v;
    if (v.label === "Pulse" && apiData.pulse) return { ...v, value: apiData.pulse };
    if (v.label === "BP" && apiData.bp) return { ...v, value: apiData.bp };
    if (v.label === "SpO2" && apiData.spo2) return { ...v, value: apiData.spo2 };
    if (v.label === "Temp" && apiData.temp) return { ...v, value: apiData.temp };
    return v;
  });

  const displayAnamnesis = mockData.anamnesis.map(a => {
    if (!apiData) return a;
    if (a.label === "Ana Şikayet" && apiData.anamnesis) return { ...a, value: apiData.anamnesis };
    return a;
  });

  const displayRisk = apiData && apiData.risk ? apiData.risk : "HIGH (CRITICAL)";

  // i18n Translation Dictionary Shell
  const translations = {
    tr: {
      title: "JIFRAF MEDİKAL KOMUTA MERKEZİ",
      case_id: "VAKA ID:",
      case_name: "VAKA ADI:",
      risk_level: "RİSK SEVİYESİ:",
      live_status: "CANLI DURUM:",
      recording: "KAYDEDİLİYOR",
      evidence_mode: "KANIT MODU",
      active: "AKTİF",
      search_placeholder: "Zeka Arama...",
      vitals_title: "Vital Bulgular Şeridi",
      anamnesis: "Anamnez",
      indic: "Endikasyon",
      diag: "Olası Tanılar",
      lab: "Lab/Tetkik",
      rad: "Radyoloji",
      ecg: "EKG",
      steth: "Steteskop/Oskültasyon",
      treatment: "Tedavi Önerileri",
      alerts: "Acil Uyarılar",
      summary: "Vaka Özeti",
      risk_analysis: "Risk Analizi",
      evidence_strength: "Kanıt Gücü",
      olasi_tanilar: "Olası Tanılar",
      lehine: "Lehine Kanıtlar",
      aleyhine: "Aleyhine Kanıtlar",
      hekim_vaka_ozeti: "Hekim Vaka Özeti",
      uret_ozet: "ÜRET DOKTOR VAKA ÖZETİ",
      obs_matrix: "KLİNİK KOMUTA MERKEZİ — YAPILANDIRILMIŞ GÖZLEM MATRİSİ",
      ingest_matrix: "Multi-Modal Veri Giriş Matrisi",
      findings: "Bulgular & Gözlemler",
      uncertainty: "Klinik Belirsizlik & Boşluklar",
      provenance_btn: "PROVENANCE İZİ",
      evidence_env: "KANIT KAYNAK ZARFI",
      source: "KAYNAK:",
      extraction_status: "ÇIKARIM DURUMU",
      ingest_time: "YÜKLEME ZAMANI",
      view_source: "KAYNAK VERİYİ GÖSTER",
      awaiting_analysis: "Analiz Çalıştırılması Bekleniyor",
      run_pipeline: "PİPELİNE'I ÇALIŞTIR & ÖZET ÜRET",
      analyzing: "MUAYENE VERİLERİ ANALİZ EDİLİYOR...",
      copied: "KOPYALANDI!",
      preferred_lang: "Dil Tercihi",
      preferred_theme: "Görünüm Modu",
      pulse: "Nabız",
      bp: "Kan Basıncı",
      spo2: "SpO2 Oksijen",
      temp: "Vücut Isısı",
      respiratory: "Solunum Hızı",
      "blood glucose": "Kan Şekeri",
      consciousness: "Bilinç Durumu",
      intake: "Kabul Formu"
    },
    en: {
      title: "JIFRAF MEDICAL COMMAND CENTER",
      case_id: "CASE ID:",
      case_name: "CASE NAME:",
      risk_level: "RISK LEVEL:",
      live_status: "LIVE STATUS:",
      recording: "RECORDING",
      evidence_mode: "EVIDENCE MODE",
      active: "ACTIVE",
      search_placeholder: "Search Intelligence...",
      vitals_title: "Vital Signs Strip",
      anamnesis: "Anamnesis",
      indic: "Indications",
      diag: "Potential Diagnoses",
      lab: "Lab/Tests",
      rad: "Radiology",
      ecg: "ECG",
      steth: "Stethoscope/Auscultation",
      treatment: "Treatment Plans",
      alerts: "Emergency Alerts",
      summary: "Case Summary",
      risk_analysis: "Risk Analysis",
      evidence_strength: "Evidence Strength",
      olasi_tanilar: "Potential Diagnoses",
      lehine: "Supporting Evidence",
      aleyhine: "Conflicting Evidence",
      hekim_vaka_ozeti: "Clinician Case Summary",
      uret_ozet: "GENERATE CLINICIAN SUMMARY",
      obs_matrix: "CLINICAL COMMAND CENTER — STRUCTURED OBSERVATION MATRIX",
      ingest_matrix: "Multi-Modal Ingestion Matrix",
      findings: "Findings & Observations",
      uncertainty: "Clinical Uncertainty & Gaps",
      provenance_btn: "PROVENANCE TRACE",
      evidence_env: "EVIDENCE SOURCE ENVELOPE",
      source: "SOURCE:",
      extraction_status: "EXTRACTION STATUS",
      ingest_time: "INGESTION TIME",
      view_source: "VIEW SOURCE ASSET",
      awaiting_analysis: "Awaiting Ingestion Execution",
      run_pipeline: "RUN PIPELINE & GENERATE SUMMARY",
      analyzing: "ANALYZING MULTI-MODAL PIPELINE...",
      copied: "COPIED!",
      preferred_lang: "Language",
      preferred_theme: "Appearance Theme",
      pulse: "Pulse",
      bp: "Blood Pressure",
      spo2: "Oxygen SpO2",
      temp: "Body Temp",
      respiratory: "Resp Rate",
      "blood glucose": "Blood Glucose",
      consciousness: "Consciousness",
      intake: "Patient Intake"
    },
    de: {
      title: "JIFRAF MEDIZINISCHES KOMMANDOZENTRUM",
      case_id: "FALL ID:",
      case_name: "FALLNAME:",
      risk_level: "RISIKOSTUFE:",
      live_status: "LIVE-STATUS:",
      recording: "AUFNAHME",
      evidence_mode: "BEWEISMODUS",
      active: "AKTIV",
      search_placeholder: "Suche...",
      vitals_title: "Vitalparameter",
      anamnesis: "Anamnese",
      indic: "Indikationen",
      diag: "Mögliche Diagnosen",
      lab: "Labor",
      rad: "Radiologie",
      ecg: "EKG",
      steth: "Stethoskop",
      treatment: "Therapiepläne",
      alerts: "Warnungen",
      summary: "Zusammenfassung",
      risk_analysis: "Risikoanalyse",
      evidence_strength: "Beweisstärke",
      olasi_tanilar: "Mögliche Diagnosen",
      lehine: "Beweise",
      aleyhine: "Unsicherheiten",
      hekim_vaka_ozeti: "Klinischer Bericht",
      uret_ozet: "BERICHT ERSTELLEN",
      obs_matrix: "STRUKTURIERTE BEOBACHTUNGSMATRIX",
      ingest_matrix: "Aufnahmematrix",
      findings: "Befunde & Beobachtungen",
      uncertainty: "Unsicherheiten",
      provenance_btn: "PROVENIENZ",
      evidence_env: "QUELLE",
      source: "QUELLE:",
      extraction_status: "EXTRAKTIONSSTATUS",
      ingest_time: "AUFNAHMEZEIT",
      view_source: "QUELLE ANZEIGEN",
      awaiting_analysis: "Warten auf Analyse",
      run_pipeline: "BERICHT ERSTELLEN",
      analyzing: "WIRD ANALYSIERT...",
      copied: "KOPIERT!",
      preferred_lang: "Sprache",
      preferred_theme: "Thema",
      pulse: "Puls",
      bp: "Blutdruck",
      spo2: "Sauerstoff SpO2",
      temp: "Körpertemp",
      respiratory: "Atmung",
      "blood glucose": "Blutzucker",
      consciousness: "Bewusstsein"
    },
    fr: {
      title: "CENTRE DE COMMANDEMENT MÉDICAL JIFRAF",
      case_id: "ID CAS:",
      case_name: "NOM DU CAS:",
      risk_level: "NIVEAU DE RISQUE:",
      live_status: "STATUT LIVE:",
      recording: "ENREGISTREMENT",
      evidence_mode: "MODE PREUVE",
      active: "ACTIF",
      search_placeholder: "Rechercher...",
      vitals_title: "Paramètres Vitaux",
      anamnesis: "Anamnèse",
      indic: "Indications",
      diag: "Diagnostics",
      lab: "Laboratoire",
      rad: "Radiologie",
      ecg: "ECG",
      steth: "Stéthoscope",
      treatment: "Traitements",
      alerts: "Alertes",
      summary: "Résumé",
      risk_analysis: "Analyse des Risques",
      evidence_strength: "Force des Preuves",
      olasi_tanilar: "Diagnostics",
      lehine: "Preuves",
      aleyhine: "Incertitudes",
      hekim_vaka_ozeti: "Résumé Clinique",
      uret_ozet: "GÉNÉRER LE RÉSUMÉ",
      obs_matrix: "MATRICE D'OBSERVATION STRUCTURÉE",
      ingest_matrix: "Matrice d'Ingestion",
      findings: "Observations",
      uncertainty: "Incertitudes",
      provenance_btn: "PROVENANCE",
      evidence_env: "SOURCE",
      source: "SOURCE:",
      extraction_status: "STATUT",
      ingest_time: "HEURE D'INGESTION",
      view_source: "VOIR SOURCE",
      awaiting_analysis: "En attente d'analyse",
      run_pipeline: "LANCER LA PIPELINE",
      analyzing: "ANALYSE EN COURS...",
      copied: "COPIÉ!",
      preferred_lang: "Langue",
      preferred_theme: "Thème",
      pulse: "Pouls",
      bp: "Pression Artérielle",
      spo2: "Oxygène SpO2",
      temp: "Température",
      respiratory: "Fréquence Resp",
      "blood glucose": "Glycémie",
      consciousness: "Conscience"
    },
    ar: {
      title: "مركز التحكم الطبي جيفراف",
      case_id: "رقم الحالة:",
      case_name: "اسم الحالة:",
      risk_level: "مستوى الخطورة:",
      live_status: "الحالة المباشرة:",
      recording: "جاري التسجيل",
      evidence_mode: "وضع الأدلة",
      active: "نشط",
      search_placeholder: "البحث...",
      vitals_title: "العلامات الحيوية",
      anamnesis: "التاريخ المرضي",
      indic: "دواعي الاستعمال",
      diag: "التشخيصات",
      lab: "المختبر",
      rad: "الأشعة",
      ecg: "تخطيط القلب",
      steth: "السماعة",
      treatment: "العلاجات",
      alerts: "تنبيهات",
      summary: "الملخص",
      risk_analysis: "تحليل المخاطر",
      evidence_strength: "قوة الأدلة",
      olasi_tanilar: "التشخيصات",
      lehine: "الأدلة",
      aleyhine: "الشكوك",
      hekim_vaka_ozeti: "الملخص الطبي",
      uret_ozet: "توليد الملخص",
      obs_matrix: "مصفوفة الملاحظات المنظمة",
      ingest_matrix: "مصفوفة الاستيعاب",
      findings: "النتائج والملاحظات",
      uncertainty: "الشكوك",
      provenance_btn: "التتبع",
      evidence_env: "المصدر",
      source: "المصدر:",
      extraction_status: "حالة الاستخراج",
      ingest_time: "وقت الاستيعاب",
      view_source: "عرض المصدر",
      awaiting_analysis: "بانتظار التحليل",
      run_pipeline: "تشغيل الأنبوب",
      analyzing: "جاري التحليل...",
      copied: "تم النسخ!",
      preferred_lang: "اللغة",
      preferred_theme: "المظهر",
      pulse: "النبض",
      bp: "ضغط الدم",
      spo2: "الأكسجين",
      temp: "الحرارة",
      respiratory: "التنفس",
      "blood glucose": "السكر",
      consciousness: "الوعي"
    },
    ku: {
      title: "NAVENDÊN DERMANÊN JIFRAF",
      case_id: "ID DOZÊ:",
      case_name: "NAVÊ DOZÊ:",
      risk_level: "ASTA RÎSKÊ:",
      live_status: "REŞA ZINDÎ:",
      recording: "TÊ TOMARKIRIN",
      evidence_mode: "MODA DELÎLAN",
      active: "ÇALAK",
      search_placeholder: "Lêgerîn...",
      vitals_title: "Rêza Nîşaneyan",
      anamnesis: "Anamnez",
      indic: "Nîşandan",
      diag: "Teşhîsên Mimkun",
      lab: "Laboratuvar",
      rad: "Radyolojî",
      ecg: "EKG",
      steth: "Stetoskob",
      treatment: "Derman",
      alerts: "Hişyarî",
      summary: "Kurte",
      risk_analysis: "Analîza Rîskê",
      evidence_strength: "Hêza Delîlê",
      olasi_tanilar: "Teşhîs",
      lehine: "Delîl",
      aleyhine: "Kêmasî",
      hekim_vaka_ozeti: "Kurteya Bijîşk",
      uret_ozet: "KURTE AVA BIKE",
      obs_matrix: "MATRÎSA ÇAVDÊRIYÊ",
      ingest_matrix: "Matrîsa Ingestion",
      findings: "Dîtin û Çavdêrî",
      uncertainty: "Guman",
      provenance_btn: "ŞOPAÇAVKANÎ",
      evidence_env: "ZEVF",
      source: "ÇAVKANÎ:",
      extraction_status: "REŞA DERXISTINÊ",
      ingest_time: "DEMA INGESTIONÊ",
      view_source: "ÇAVKANÎ NÎŞAN BIDE",
      awaiting_analysis: "Li benda analîzê ye",
      run_pipeline: "PÎPELÎNÊ BIXEBÎTÎNE",
      analyzing: "ANALÎZ TÊ KIRIN...",
      copied: "KOPÎ BÛ!",
      preferred_lang: "Ziman",
      preferred_theme: "Mijar",
      pulse: "Puls",
      bp: "Fişara Xwînê",
      spo2: "Oksîjen SpO2",
      temp: "Germiya Laş",
      respiratory: "Bêhnhildan",
      "blood glucose": "Şekirê Xwînê",
      consciousness: "Hişyarî"
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    const root = document.documentElement;
    
    const applyTheme = (themeName) => {
      if (themeName === 'light') {
        root.classList.add('light-mode');
      } else if (themeName === 'dark') {
        root.classList.remove('light-mode');
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) {
          root.classList.remove('light-mode');
        } else {
          root.classList.add('light-mode');
        }
      }
    };

    applyTheme(theme);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          root.classList.remove('light-mode');
        } else {
          root.classList.add('light-mode');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Phase 2d: Dynamic Ingestion Matrix Observation Parser & Fallback Generator
  const getObservationRecords = () => {
    if (advisoryData && advisoryData.observation_records && advisoryData.observation_records.length > 0) {
      return advisoryData.observation_records;
    }
    
    // Live preview preview matrix based on uploaded files and case notes
    const runId = caseId ? caseId.substring(0, 8) : "SIM-LIVE";
    const now = new Date().toISOString();
    const records = [];
    
    // Notes Modality
    const hasNotes = !!caseId;
    records.push({
      observation_id: `OBS-${runId}-NOTES`,
      modality: "notes",
      status: hasNotes ? "extracted" : "pending",
      observed_at: now,
      finding_ids: hasNotes ? [`FC-${runId}-SYM-001`, `FC-${runId}-SYM-002`] : [],
      evidence_ids: hasNotes ? [`EV-${runId}-NOTES`] : [],
      provenance_ids: [`PR-${runId}-NOTES`],
      uncertainty_ids: hasNotes ? [] : [`UF-${runId}-EMPTY-NOTES`],
      source_file_id: null,
      routing_node: "NOTES-SEM",
      note: "Semantic clinical notes matrix trace"
    });
    
    // Radiology Modality
    const radFiles = getCategoryFiles('radyoloji');
    const hasRad = radFiles.length > 0;
    if (hasRad) {
      radFiles.forEach((file, idx) => {
        const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
        records.push({
          observation_id: `OBS-${runId}-RAD-${shortFid}`,
          modality: "radiology",
          status: "extracted",
          observed_at: file.uploaded_at || now,
          finding_ids: [`FC-${runId}-RAD-${shortFid}`],
          evidence_ids: [`EV-${runId}-RAD-${shortFid}`],
          provenance_ids: [`PR-${runId}-${file.file_id?.substring(0,6)}`],
          uncertainty_ids: [],
          source_file_id: file.file_id,
          routing_node: "RA-42",
          note: `Radiology parsed from ${file.original_filename}`
        });
      });
    } else {
      records.push({
        observation_id: `OBS-${runId}-RAD-MISSING`,
        modality: "radiology",
        status: "pending",
        observed_at: now,
        finding_ids: [],
        evidence_ids: [],
        provenance_ids: [],
        uncertainty_ids: [`UF-${runId}-NO-RAD`],
        source_file_id: null,
        routing_node: "RA-42",
        note: "Awaiting plain radiography or chest DICOM dataset"
      });
    }
    
    // ECG Modality
    const ecgFiles = getCategoryFiles('ekg');
    const hasEcg = ecgFiles.length > 0;
    if (hasEcg) {
      ecgFiles.forEach((file, idx) => {
        const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
        records.push({
          observation_id: `OBS-${runId}-ECG-${shortFid}`,
          modality: "ecg",
          status: "extracted",
          observed_at: file.uploaded_at || now,
          finding_ids: [`FC-${runId}-ECG-${shortFid}`],
          evidence_ids: [`EV-${runId}-ECG-${shortFid}`],
          provenance_ids: [`PR-${runId}-${file.file_id?.substring(0,6)}`],
          uncertainty_ids: [],
          source_file_id: file.file_id,
          routing_node: "ECG-12",
          note: `ECG parsed from ${file.original_filename}`
        });
      });
    } else {
      records.push({
        observation_id: `OBS-${runId}-ECG-MISSING`,
        modality: "ecg",
        status: "pending",
        observed_at: now,
        finding_ids: [],
        evidence_ids: [],
        provenance_ids: [],
        uncertainty_ids: [`UF-${runId}-NO-ECG`],
        source_file_id: null,
        routing_node: "ECG-12",
        note: "Awaiting electrocardiogram visual / signal strip"
      });
    }
    
    // Stethoscope Modality
    const stethFiles = getCategoryFiles('steteskop');
    const hasSteth = stethFiles.length > 0;
    if (hasSteth) {
      stethFiles.forEach((file, idx) => {
        const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
        records.push({
          observation_id: `OBS-${runId}-STETH-${shortFid}`,
          modality: "stethoscope",
          status: "extracted",
          observed_at: file.uploaded_at || now,
          finding_ids: [`FC-${runId}-STETH-${shortFid}`],
          evidence_ids: [`EV-${runId}-STETH-${shortFid}`],
          provenance_ids: [`PR-${runId}-${file.file_id?.substring(0,6)}`],
          uncertainty_ids: [],
          source_file_id: file.file_id,
          routing_node: "AU-08",
          note: `Stethoscope parsed from ${file.original_filename}`
        });
      });
    } else {
      records.push({
        observation_id: `OBS-${runId}-STETH-MISSING`,
        modality: "stethoscope",
        status: "pending",
        observed_at: now,
        finding_ids: [],
        evidence_ids: [],
        provenance_ids: [],
        uncertainty_ids: [`UF-${runId}-NO-STETH`],
        source_file_id: null,
        routing_node: "AU-08",
        note: "Awaiting stethoscope acoustic frequency dataset"
      });
    }
    
    return records;
  };

  const getEvidenceStrength = () => {
    const records = getObservationRecords();
    if (records.length === 0) return 0;
    const extractedCount = records.filter(r => r.status === 'extracted').length;
    return Math.round((extractedCount / records.length) * 100);
  };

  const evidenceStrength = getEvidenceStrength();

  const displayDiagnoses = () => {
    if (advisoryData && advisoryData.finding_candidates) {
      return advisoryData.finding_candidates.map((fc, i) => {
        let cleanName = fc.label;
        if (cleanName.includes("Extracted Symptom: ")) {
          cleanName = cleanName.split("Extracted Symptom: ")[1].split(" (")[0];
        } else if (cleanName.includes("Ingested imaging data ")) {
          cleanName = "Imaging Ingestion Complete";
        } else if (cleanName.includes("Ingested signal visual ")) {
          cleanName = "ECG Waveform Ingested";
        } else if (cleanName.includes("Ingested stethoscope audio ")) {
          cleanName = "Acoustic Audio Ingested";
        } else if (cleanName.includes("Structured observation ingestion matrix empty")) {
          cleanName = "Awaiting Clinical Matrix";
        }
        
        const probMap = { HIGH: 88, MEDIUM: 62, LOW: 24 };
        const prob = probMap[fc.confidence_band] || 15;
        return { name: cleanName, prob: prob };
      });
    }
    return mockData.diagnoses;
  };

  const getProsAndCons = () => {
    if (advisoryData) {
      const pros = (advisoryData.evidence_map || []).map(ev => {
        let desc = ev.description;
        if (desc.length > 60) desc = desc.substring(0, 58) + "...";
        return desc;
      });
      const cons = (advisoryData.uncertainty_flags || []).map(uf => {
        let desc = uf.description;
        if (desc.length > 60) desc = desc.substring(0, 58) + "...";
        return desc;
      });
      return { pros, cons };
    }
    
    return {
      pros: [
        "Ani başlayan şiddetli nefes darlığı (dyspnea)",
        "Plevritik göğüs ağrısı (nefesle artan ağrı)",
        "EKG'de taşikardi (145 bpm) ve ritim anomalisi"
      ],
      cons: [
        "Klinik notlarda ilaç/besin alerji geçmişi belirtilmemiş",
        "Akut toraks değerlendirmesi için radyolojik görüntü yok",
        "Kardiyak hasar ekarte edilmesi için oskültasyon ses kaydı yok"
      ]
    };
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className={`fixed inset-0 bg-[#010308] flex flex-col p-4 font-sans text-slate-300 transition-colors duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.9; }
        }
        @keyframes shimmer-routing {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes loading-sweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .hud-scanline {
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to bottom, rgba(6,182,212,0), rgba(6,182,212,0.3), rgba(6,182,212,0));
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        .pulse-soft-cyan {
          animation: pulse-soft 2s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.35);
        }
        .pulse-soft-emerald {
          animation: pulse-soft 2s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.35);
        }
        .pulse-soft-amber {
          animation: pulse-soft 2s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
        }
        .pulse-soft-indigo {
          animation: pulse-soft 2s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.35);
        }
        .pulse-soft-red {
          animation: pulse-soft 1.5s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.35);
        }
        .shimmer-routing-node {
          background: linear-gradient(90deg, rgba(6,182,212,0.05) 25%, rgba(6,182,212,0.2) 50%, rgba(6,182,212,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer-routing 3s infinite linear;
        }
        .shimmer-routing-node-indigo {
          background: linear-gradient(90deg, rgba(99,102,241,0.05) 25%, rgba(99,102,241,0.2) 50%, rgba(99,102,241,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer-routing 3s infinite linear;
        }
        .shimmer-routing-node-emerald {
          background: linear-gradient(90deg, rgba(16,185,129,0.05) 25%, rgba(16,185,129,0.2) 50%, rgba(16,185,129,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer-routing 3s infinite linear;
        }
        .shimmer-routing-node-amber {
          background: linear-gradient(90deg, rgba(245,158,11,0.05) 25%, rgba(245,158,11,0.2) 50%, rgba(245,158,11,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer-routing 3s infinite linear;
        }
        .loading-sweep-bar {
          overflow: hidden;
          position: relative;
        }
        .loading-sweep-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 30%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent);
          animation: loading-sweep 2s infinite ease-in-out;
        }
        .bg-notes-600 { background-color: rgb(79, 70, 229); }
        .bg-radiology-600 { background-color: rgb(8, 145, 178); }
        .bg-ecg-600 { background-color: rgb(5, 150, 105); }
        .bg-stethoscope-600 { background-color: rgb(217, 119, 6); }
        .rtl { direction: rtl; text-align: right; }
        .ltr { direction: ltr; text-align: left; }
        
        /* ── Light Mode Core Adaptations ── */
        .light-mode {
          background-color: #f1f5f9 !important;
          color: #334155 !important;
        }
        .light-mode .fixed {
          background-color: #f1f5f9 !important;
        }
        .light-mode .bg-\[\#010308\] {
          background-color: #f8fafc !important;
        }
        .light-mode .bg-\[\#020617\] {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04) !important;
        }
        .light-mode .bg-\[\#020814\],
        .light-mode .bg-\[\#010307\] {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .light-mode .bg-\[\#020814\]\/80 {
          background-color: rgba(248, 250, 252, 0.95) !important;
        }
        .light-mode .bg-slate-900\/50,
        .light-mode .bg-slate-900\/40,
        .light-mode .bg-slate-900\/30,
        .light-mode .bg-slate-900\/60,
        .light-mode .bg-slate-900\/80 {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #475569 !important;
        }
        .light-mode .text-slate-300,
        .light-mode .text-slate-400,
        .light-mode .text-slate-500 {
          color: #475569 !important;
        }
        .light-mode .text-slate-100,
        .light-mode .text-slate-200 {
          color: #0f172a !important;
        }
        .light-mode .border-cyan-500,
        .light-mode .border-cyan-500\/60,
        .light-mode .border-cyan-500\/50,
        .light-mode .border-cyan-500\/30,
        .light-mode .border-cyan-900\/60,
        .light-mode .border-cyan-900\/50 {
          border-color: #0891b2 !important;
        }
        .light-mode .border-slate-700,
        .light-mode .border-slate-800,
        .light-mode .border-slate-900,
        .light-mode .border-slate-900\/50 {
          border-color: #e2e8f0 !important;
        }
        .light-mode .text-cyan-400,
        .light-mode .text-cyan-500 {
          color: #0891b2 !important;
        }
        .light-mode .bg-cyan-950\/10,
        .light-mode .bg-cyan-950\/20,
        .light-mode .bg-cyan-950\/30,
        .light-mode .bg-cyan-950\/40 {
          background-color: rgba(6, 182, 212, 0.08) !important;
        }
        .light-mode .text-emerald-400 {
          color: #059669 !important;
        }
        .light-mode .bg-emerald-950\/50,
        .light-mode .bg-emerald-950\/80 {
          background-color: rgba(16, 185, 129, 0.08) !important;
          border-color: rgba(16, 185, 129, 0.2) !important;
          color: #059669 !important;
        }
        .light-mode .text-amber-500,
        .light-mode .text-amber-400 {
          color: #d97706 !important;
        }
        .light-mode .bg-amber-950\/50 {
          background-color: rgba(245, 158, 11, 0.08) !important;
        }
        .light-mode input {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
          color: #0f172a !important;
        }
        .light-mode .bg-slate-950\/50,
        .light-mode .bg-slate-950\/40,
        .light-mode .bg-slate-950\/20 {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
      
      {/* 0. GLOBAL TOP BAR */}
      <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between mb-4 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-7 h-7 text-cyan-600" />
          <span className="font-bold text-xl tracking-widest text-slate-200">JIF-MED</span>
        </div>
        <div className="hidden md:flex flex-1 max-w-xl px-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-12 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={t("search_placeholder")} 
            className="w-full bg-[#020814] border border-cyan-900/50 rounded-full py-2 pl-12 pr-4 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="flex items-center gap-5">
          {/* USER PREFERENCES SHELL */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowLangDropdown(!showLangDropdown); setShowThemeDropdown(false); }}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                title={t("preferred_lang")}
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold font-mono uppercase">{language}</span>
              </button>
              
              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-[#020814] border border-cyan-900/60 rounded-xl p-1.5 flex flex-col gap-0.5 z-50 shadow-2xl backdrop-blur-md">
                  {Object.keys(translations).map((lang) => {
                    const langNames = { tr: "Türkçe", en: "English", de: "Deutsch", fr: "Français", ar: "العربية", ku: "Kurdî" };
                    return (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                        className={`text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          language === lang 
                            ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' 
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        {langNames[lang] || lang}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowThemeDropdown(!showThemeDropdown); setShowLangDropdown(false); }}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                title={t("preferred_theme")}
              >
                {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                <span className="text-[10px] font-bold font-mono uppercase hidden sm:inline">{theme}</span>
              </button>
              
              {showThemeDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[#020814] border border-cyan-900/60 rounded-xl p-1.5 flex flex-col gap-0.5 z-50 shadow-2xl backdrop-blur-md font-sans">
                  {[
                    { key: 'dark', label: 'Dark HUD', icon: Moon },
                    { key: 'light', label: 'Light Clinic', icon: Sun },
                    { key: 'system', label: 'OS System', icon: Monitor }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => { setTheme(item.key); setShowThemeDropdown(false); }}
                      className={`text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                        theme === item.key 
                          ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' 
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="relative cursor-pointer hover:text-cyan-400 transition-colors">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#010308]"></span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">Kayıt Bölümü</div>
              <div className="text-[10px] text-cyan-500">Hasta Kabul</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500 overflow-hidden flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Desk" alt="Profil" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* PARLAYAN DIŞ ÇERÇEVE VE HUD KASASI */}
      <div className="w-full flex-1 max-w-[1920px] mx-auto bg-[#020617] flex flex-col p-4 gap-3 rounded-2xl border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden relative selection:bg-cyan-900">
        
        {/* 1. HEADER */}
        <header className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 border border-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)] bg-cyan-950/20 shrink-0">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <div className="leading-tight">
              <h1 className="text-cyan-400 font-bold text-sm">JIF-MED</h1>
              <p className="text-[10px] text-slate-400">Medical Intelligence</p>
            </div>
          </div>
          <PillBox label={t("case_id")} value={caseId || (language === 'tr' ? "BAŞLATILIYOR..." : "INITIALIZING...")} borderColor="border-cyan-500" />
          <PillBox label={t("case_name")} value="Acute Dyspnea with Chest Pain" borderColor="border-cyan-500" />
          <PillBox label={t("risk_level")} value={displayRisk} borderColor="border-red-500" textColor="text-red-400" glow="shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
          <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 rounded-full bg-slate-900 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase">{t("live_status")}</span>
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {t("recording")}
            </span>
          </div>
          <PillBox label={t("evidence_mode")} value={t("active")} borderColor="border-emerald-500" textColor="text-emerald-400" />
        </header>

        {/* 2. VITALS STRIP - Tam genişlik uyumu */}
        <div className="w-full flex items-stretch gap-2 shrink-0 pb-1">
          {displayVitals.map((v, i) => (
            <div key={i} className={`flex-1 flex items-center justify-center xl:justify-start gap-2 px-3 py-2 border rounded-xl bg-slate-900/50 transition-all overflow-hidden ${
              v.color === 'yellow' ? 'border-amber-400/80 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]' : 
              'border-emerald-500/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
            }`}>
              <v.icon className={`w-5 h-5 shrink-0 ${v.glow ? 'animate-pulse' : ''}`} />
              <div className="min-w-0">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider truncate">{t(v.label.toLowerCase())}</div>
                <div className="flex items-baseline gap-1 truncate">
                  <span className="text-lg font-bold">{v.value}</span>
                  <span className="text-[10px] opacity-80">{v.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. MAIN GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
          
          {/* SIDEBAR (Col 1-2) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col border border-cyan-500/50 rounded-xl bg-slate-900/40 p-2 gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <SidebarItem icon={User} label={t("intake")} active={activeTab==='intake'} onClick={()=>setActiveTab('intake')} />
            <SidebarItem icon={ClipboardList} label={t("anamnesis")} active={activeTab==='anamnez'} onClick={()=>setActiveTab('anamnez')} />
            <SidebarItem icon={Crosshair} label={t("indic")} active={activeTab==='endikasyon'} onClick={()=>setActiveTab('endikasyon')} />
            <SidebarItem icon={HeartPulse} label={t("diag")} active={activeTab==='tanilar'} onClick={()=>setActiveTab('tanilar')} />
            <SidebarItem icon={Syringe} label={t("lab")} active={activeTab==='lab'} onClick={()=>setActiveTab('lab')} />
            <SidebarItem icon={FileSearch} label={t("rad")} plugin active={activeTab==='radyoloji'} onClick={()=>setActiveTab('radyoloji')} />
            <SidebarItem icon={Activity} label={t("ecg")} plugin active={activeTab==='ekg'} onClick={()=>setActiveTab('ekg')} />
            <SidebarItem icon={Wind} label={t("steth")} plugin active={activeTab==='steteskop'} onClick={()=>setActiveTab('steteskop')} />
            <SidebarItem icon={Zap} label={t("treatment")} active={activeTab==='tedavi'} onClick={()=>setActiveTab('tedavi')} />
            <SidebarItem icon={ShieldAlert} label={t("alerts")} active={activeTab==='uyarilar'} onClick={()=>setActiveTab('uyarilar')} />
            <SidebarItem icon={FileText} label={t("summary")} active={activeTab==='ozet'} onClick={()=>setActiveTab('ozet')} />
          </div>

          {/* CENTER PANEL (Col 3-9) */}
          <div className="lg:col-span-7 flex flex-col gap-3 min-h-0">
            
            {activeTab === 'intake' && (
              <div className="flex-1 border border-cyan-500/60 rounded-xl bg-slate-900/30 flex flex-col min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.15)] overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
                <h2 className="text-cyan-400 font-semibold flex items-center gap-2 border-b border-cyan-500/30 pb-3 mb-4 shrink-0 text-sm md:text-base">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>Kabul Formu / Patient Intake Matrix</span>
                </h2>
                
                {intakeSuccessMessage && (
                  <div className="bg-emerald-950/30 border border-emerald-500/50 p-3 rounded-lg text-emerald-400 text-xs font-mono mb-4 leading-normal select-text">
                    ✅ {intakeSuccessMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 leading-normal font-sans text-slate-300">
                  
                  {/* Column 1: Patient Intake Registration */}
                  <div className="space-y-4 border border-cyan-900/30 bg-[#020814]/40 p-4 rounded-xl">
                    <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-900 pb-1.5 flex items-center gap-2 font-mono">
                      <User className="w-4 h-4 text-cyan-500" />
                      Hasta Kayıt / Patient Registry
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Patient Ref ID*</label>
                        <input 
                          type="text" 
                          value={intakePatientRef}
                          onChange={(e) => setIntakePatientRef(e.target.value)}
                          placeholder="e.g. ANON-002"
                          className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Birth Year*</label>
                          <input 
                            type="number" 
                            value={intakeBirthYear}
                            onChange={(e) => setIntakeBirthYear(e.target.value)}
                            placeholder="1980"
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Gender*</label>
                          <select 
                            value={intakeGender}
                            onChange={(e) => setIntakeGender(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-sans"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Active Medications (comma-separated)</label>
                        <input 
                          type="text" 
                          value={intakeMedications}
                          onChange={(e) => setIntakeMedications(e.target.value)}
                          placeholder="e.g. metformin, aspirin, lisinopril"
                          className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Allergies (comma-separated)</label>
                        <input 
                          type="text" 
                          value={intakeAllergies}
                          onChange={(e) => setIntakeAllergies(e.target.value)}
                          placeholder="e.g. penicillin, peanuts"
                          className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                        />
                      </div>
                      
                      <button 
                        onClick={handleCreatePatient}
                        disabled={loading || !intakePatientRef.trim()}
                        className="w-full mt-2 py-3 rounded-lg border border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold text-xs tracking-widest shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:bg-cyan-800/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none uppercase font-mono cursor-pointer"
                      >
                        Hasta Profili & EMR Vaka Oluştur
                      </button>
                    </div>
                  </div>
                  
                  {/* Column 2: EMR Visit, Vitals & Labs Registry */}
                  <div className="space-y-4 border border-cyan-900/30 bg-[#020814]/40 p-4 rounded-xl relative">
                    {!emrCaseId && (
                      <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-20 rounded-xl">
                        <Shield className="w-8 h-8 text-cyan-850 mb-2 animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Awaiting Patient Profile</span>
                        <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal">
                          Please register the patient profile in the left panel first to unlock EMR visit and findings entry.
                        </p>
                      </div>
                    )}
                    
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-900 pb-1.5 flex items-center gap-2 font-mono">
                      <ClipboardList className="w-4 h-4 text-cyan-500" />
                      Ziyaret & Vital/Lab Kaydı
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">Pulse (bpm)</label>
                          <input 
                            type="text" 
                            value={intakePulse}
                            onChange={(e) => setIntakePulse(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">BP (mmHg)</label>
                          <input 
                            type="text" 
                            value={intakeBP}
                            onChange={(e) => setIntakeBP(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">SpO2 (%)</label>
                          <input 
                            type="text" 
                            value={intakeSpO2}
                            onChange={(e) => setIntakeSpO2(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">Temp (°C)</label>
                          <input 
                            type="text" 
                            value={intakeTemp}
                            onChange={(e) => setIntakeTemp(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">Resp Rate (/min)</label>
                          <input 
                            type="text" 
                            value={intakeResp}
                            onChange={(e) => setIntakeResp(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[8px] text-slate-400 uppercase font-mono block mb-1">MCV (fL)</label>
                          <input 
                            type="text" 
                            value={intakeMCV}
                            onChange={(e) => setIntakeMCV(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-slate-400 uppercase font-mono block mb-1">Ferritin</label>
                          <input 
                            type="text" 
                            value={intakeFerritin}
                            onChange={(e) => setIntakeFerritin(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-slate-400 uppercase font-mono block mb-1">Iron</label>
                          <input 
                            type="text" 
                            value={intakeIron}
                            onChange={(e) => setIntakeIron(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-slate-400 uppercase font-mono block mb-1">CRP (mg/L)</label>
                          <input 
                            type="text" 
                            value={intakeCRP}
                            onChange={(e) => setIntakeCRP(e.target.value)}
                            className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase font-mono block mb-1">Clinician Observation Note</label>
                        <textarea 
                          rows={2}
                          value={intakeObsNote}
                          onChange={(e) => setIntakeObsNote(e.target.value)}
                          className="w-full bg-[#020814] border border-cyan-900/55 rounded py-1.5 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                        />
                      </div>
                      
                      <button 
                        onClick={handleRegisterVisit}
                        disabled={loading || !emrCaseId}
                        className="w-full py-3 rounded-lg border border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold text-xs tracking-widest shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:bg-cyan-800/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none uppercase font-mono cursor-pointer"
                      >
                        Bulgu ve Vizitleri Kaydet
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}

            {activeTab === 'anamnez' && (
              <div className="flex-1 border border-cyan-500/60 rounded-xl bg-slate-900/30 flex flex-col min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <div className="flex justify-between items-center p-3 border-b border-cyan-500/30 bg-cyan-950/20 shrink-0">
                  <h2 className="text-cyan-400 font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> Anamnez & EKG
                  </h2>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      ref={pdfInputRef} 
                      onChange={handlePdfChange} 
                      accept=".pdf" 
                      className="hidden" 
                    />
                    <input 
                      type="file" 
                      ref={dicomInputRef} 
                      onChange={handleDicomChange} 
                      accept=".dcm,.dicom,image/*" 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => pdfInputRef.current?.click()} 
                      disabled={loading || !caseId || isSignedOff}
                      className="text-[10px] flex items-center gap-1 border border-slate-600 px-2 py-1 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-3 h-3"/> {loading ? 'Yükleniyor...' : 'PDF Yükle'}
                    </button>
                    <button 
                      onClick={() => dicomInputRef.current?.click()} 
                      disabled={loading || !caseId || isSignedOff}
                      className="text-[10px] flex items-center gap-1 border border-slate-600 px-2 py-1 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-3 h-3"/> {loading ? 'Yükleniyor...' : 'DICOM Yükle'}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col lg:flex-row p-3 gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  <div className="w-full lg:w-1/3 space-y-3">
                    {displayAnamnesis.map((item, i) => (
                      <div key={i}>
                        <label className="text-[10px] text-slate-400 block mb-1">{item.label}</label>
                        <div className="border border-cyan-800 bg-cyan-950/30 p-2 rounded text-xs text-cyan-200">{item.value}</div>
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] text-red-400 font-bold block mb-1 uppercase">Eksik Veri</label>
                      <div className="border border-red-900/50 bg-red-950/30 p-2 rounded text-xs text-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">Alerji Bilgisi</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-2/3 border border-cyan-800/50 rounded-lg bg-[#020814] relative flex flex-col overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    <div className="absolute top-4 left-1/4 bg-green-950/80 border border-green-500 text-green-400 text-[10px] px-2 py-1 rounded-full z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Tachycardia (145 bpm, green)
                    </div>
                    <div className="absolute top-1/3 right-1/4 bg-red-950/80 border border-red-500 text-red-400 text-[10px] px-2 py-1 rounded-full z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> ST-Elevation (V1-V3, red)
                    </div>
                    <div className="absolute bottom-1/4 right-1/3 bg-amber-950/80 border border-amber-500 text-amber-400 text-[10px] px-2 py-1 rounded-full z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Annotated Findings Marker (yellow)
                    </div>

                    <div className="flex-1 relative z-0 flex flex-col justify-around py-4">
                      <MockEKGLine label="V1" />
                      <MockEKGLine label="V2" highlight />
                      <MockEKGLine label="L0" />
                      <MockEKGLine label="L8" />
                    </div>
                    
                    <div className="h-8 bg-cyan-950/40 border-t border-cyan-900 flex items-end justify-center gap-1 p-1 z-10 shrink-0">
                      <Activity className="w-4 h-4 text-cyan-500 absolute left-2 bottom-2" />
                      {[40, 60, 30, 80, 100, 50, 70, 40, 90, 60, 30, 70, 40, 50].map((h, i) => (
                        <div key={i} className="w-1.5 bg-cyan-500 rounded-t-sm" style={{height: `${h}%`}}></div>
                      ))}
                      <div className="absolute right-2 bottom-2 flex gap-4 text-[9px] text-cyan-600 font-mono">
                        <span>Rhythm</span> <span>Intervals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'radyoloji' && (
              <UploadPanel 
                title="Radyoloji Görüntüleme & DICOM Veri Akışı"
                icon={FileSearch}
                themeColor="cyan"
                accept=".jpg,.jpeg,.png,.webp,.pdf,.dcm,.dicom"
                acceptLabel="DICOM, PDF, PNG, JPEG, WEBP"
                files={getCategoryFiles('radyoloji')}
                onFileDrop={(file) => uploadFile(file, 'http://127.0.0.1:9000/api/upload/radiology')}
                triggerUpload={() => radiologyInputRef.current?.click()}
                fileInputRef={radiologyInputRef}
                handleFileChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file, 'http://127.0.0.1:9000/api/upload/radiology');
                }}
                loading={loading}
              />
            )}

            {activeTab === 'ekg' && (
              <UploadPanel 
                title="Elektrokardiyografi (EKG) Sinyal & Görsel Girişi"
                icon={Activity}
                themeColor="emerald"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                acceptLabel="PDF, PNG, JPEG, WEBP"
                files={getCategoryFiles('ekg')}
                onFileDrop={(file) => uploadFile(file, 'http://127.0.0.1:9000/api/upload/ecg')}
                triggerUpload={() => ecgInputRef.current?.click()}
                fileInputRef={ecgInputRef}
                handleFileChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file, 'http://127.0.0.1:9000/api/upload/ecg');
                }}
                loading={loading}
              />
            )}

            {activeTab === 'steteskop' && (
              <UploadPanel 
                title="Oskültasyon Ses Analizi & Steteskop Akışı"
                icon={Wind}
                themeColor="amber"
                accept=".wav,.mp3,.m4a,.ogg,.flac"
                acceptLabel="WAV, MP3, M4A, OGG, FLAC"
                files={getCategoryFiles('steteskop')}
                onFileDrop={(file) => uploadFile(file, 'http://127.0.0.1:9000/api/upload/stethoscope')}
                triggerUpload={() => stethoscopeInputRef.current?.click()}
                fileInputRef={stethoscopeInputRef}
                handleFileChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file, 'http://127.0.0.1:9000/api/upload/stethoscope');
                }}
                loading={loading}
              />
            )}

            {activeTab === 'ozet' && (
              <div className="flex-1 border border-cyan-500/60 rounded-xl bg-slate-900/30 flex flex-col min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
                {/* Scanline overlay */}
                <div className="hud-scanline"></div>
                
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-cyan-500/30 bg-cyan-950/20 shrink-0 z-10">
                  <h2 className="text-cyan-400 font-semibold flex items-center gap-2 text-xs md:text-sm">
                    <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" /> 
                    <span>{t("obs_matrix")}</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono hidden md:inline">INTELLIGENCE LAYER ACTIVE</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                </div>
                
                {/* Main Split Grid */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 p-4 gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden z-10">
                  
                  {/* LEFT COLUMN: Observation Matrix Rows (Col 1-7) */}
                  <div className="xl:col-span-7 flex flex-col gap-3 min-h-0">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-800 shrink-0">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("ingest_matrix")}</h3>
                      <span className="text-[9px] text-cyan-600 font-mono">INDEX BINDINGS: {getObservationRecords().length} NODES</span>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto pr-1 flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {getObservationRecords().map((record) => {
                        const modalityConfig = {
                          notes: {
                            name: "Clinical Notes & Symptoms",
                            icon: ClipboardList,
                            textColor: "text-indigo-400",
                            borderColor: "border-indigo-500/30",
                            borderColorHover: "hover:border-indigo-400/80",
                            bg: "bg-indigo-950/10",
                            badge: "bg-indigo-950 text-indigo-400 border-indigo-800",
                            pulseClass: "pulse-soft-indigo",
                            routingClass: "shimmer-routing-node-indigo"
                          },
                          radiology: {
                            name: "Radiology (Imaging/DICOM)",
                            icon: FileSearch,
                            textColor: "text-cyan-400",
                            borderColor: "border-cyan-500/30",
                            borderColorHover: "hover:border-cyan-400/80",
                            bg: "bg-cyan-950/10",
                            badge: "bg-cyan-950 text-cyan-400 border-cyan-800",
                            pulseClass: "pulse-soft-cyan",
                            routingClass: "shimmer-routing-node"
                          },
                          ecg: {
                            name: "Electrocardiography (ECG)",
                            icon: Activity,
                            textColor: "text-emerald-400",
                            borderColor: "border-emerald-500/30",
                            borderColorHover: "hover:border-emerald-400/80",
                            bg: "bg-emerald-950/10",
                            badge: "bg-emerald-950 text-emerald-400 border-emerald-800",
                            pulseClass: "pulse-soft-emerald",
                            routingClass: "shimmer-routing-node-emerald"
                          },
                          stethoscope: {
                            name: "Oskültasyon (Stethoscope Audio)",
                            icon: Wind,
                            textColor: "text-amber-400",
                            borderColor: "border-amber-500/30",
                            borderColorHover: "hover:border-amber-400/80",
                            bg: "bg-amber-950/10",
                            badge: "bg-amber-950 text-amber-400 border-amber-800",
                            pulseClass: "pulse-soft-amber",
                            routingClass: "shimmer-routing-node-amber"
                          }
                        };
                        
                        const cfg = modalityConfig[record.modality] || modalityConfig.notes;
                        const isExtracted = record.status === 'extracted';
                        
                        // Extract actual items from advisoryData or use mock fallback
                        let matchedFindings = [];
                        let matchedUncertainties = [];
                        let matchedEvidence = [];
                        let matchedProvenance = [];
                        
                        if (advisoryData) {
                          matchedFindings = (advisoryData.finding_candidates || []).filter(fc => record.finding_ids.includes(fc.candidate_id));
                          matchedUncertainties = (advisoryData.uncertainty_flags || []).filter(uf => record.uncertainty_ids.includes(uf.flag_id));
                          matchedEvidence = (advisoryData.evidence_map || []).filter(ev => record.evidence_ids.includes(ev.evidence_id));
                          matchedProvenance = (advisoryData.provenance_records || []).filter(pr => record.provenance_ids.includes(pr.provenance_id));
                        } else {
                          // Simulated fallback matching if no API run yet
                          if (record.modality === 'notes') {
                            matchedFindings = [
                              { candidate_id: `FC-${record.observation_id.split('-')[1]}-SYM-001`, label: "Extracted Symptom: Acute Dyspnea (Nefes Darlığı)", confidence_band: "HIGH", advisory_flag: "SEMANTIC MATCH" },
                              { candidate_id: `FC-${record.observation_id.split('-')[1]}-SYM-002`, label: "Extracted Symptom: Pleuritic Chest Pain (Göğüs Ağrısı)", confidence_band: "HIGH", advisory_flag: "SEMANTIC MATCH" }
                            ];
                            matchedEvidence = [{ evidence_id: `EV-${record.observation_id.split('-')[1]}-NOTES`, description: "Free-text clinical notes semantic parser routed to Clinical Expert node.", source: "case.notes", relevance_band: "HIGH" }];
                            matchedUncertainties = [{ flag_id: `UF-${record.observation_id.split('-')[1]}-ALLERGY`, description: "Kritik Anamnez Belirsizliği: İlaç/besin alerji geçmişi klinik notlarda belirtilmemiş.", severity: "WARNING" }];
                            matchedProvenance = [{ provenance_id: `PR-${record.observation_id.split('-')[1]}-NOTES`, source_type: "case_notes", source_ref: caseId || "ANON-001", extraction_status: "available", recorded_at: new Date().toISOString() }];
                          } else if (record.modality === 'radiology') {
                            if (isExtracted) {
                              getCategoryFiles('radyoloji').forEach((file, idx) => {
                                const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
                                matchedFindings.push({ candidate_id: `FC-RAD-${shortFid}`, label: `[Radiology AI Node RA-42] Ingested imaging data (${file.original_filename}). Structure validation: OK.`, confidence_band: "LOW", advisory_flag: "CANDIDATE OBSERVATION" });
                                matchedEvidence.push({ evidence_id: `EV-RAD-${shortFid}`, description: `Radyolojik görüntü (${file.original_filename}) alındı ve Radyoloji Gözlem Pipeline'ına yönlendirildi.`, source: `upload:${file.file_id}`, relevance_band: "MEDIUM" });
                                matchedProvenance.push({ provenance_id: `PR-RAD-${shortFid}`, source_type: `upload_${file.file_type.toLowerCase()}`, source_ref: file.file_id, extraction_status: "available", evidence_link: `uploads/${file.sanitized_filename}`, recorded_at: file.uploaded_at });
                              });
                            } else {
                              matchedUncertainties = [{ flag_id: `UF-NO-RAD`, description: "Veri Eksikliği: Akut pulmoner / toraks değerlendirmesi için radyolojik görüntü (Plain Image / DICOM) bulunmuyor.", severity: "INFO" }];
                            }
                          } else if (record.modality === 'ecg') {
                            if (isExtracted) {
                              getCategoryFiles('ekg').forEach((file, idx) => {
                                const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
                                matchedFindings.push({ candidate_id: `FC-ECG-${shortFid}`, label: `[ECG AI Node ECG-12] Ingested signal visual (${file.original_filename}). Wave interval and rhythm anomalies routed.`, confidence_band: "LOW", advisory_flag: "CANDIDATE OBSERVATION" });
                                matchedEvidence.push({ evidence_id: `EV-ECG-${shortFid}`, description: `EKG Sinyal/Görsel kanıtı (${file.original_filename}) alındı ve EKG Gözlem Pipeline'ına yönlendirildi.`, source: `upload:${file.file_id}`, relevance_band: "MEDIUM" });
                                matchedProvenance.push({ provenance_id: `PR-ECG-${shortFid}`, source_type: `upload_${file.file_type.toLowerCase()}`, source_ref: file.file_id, extraction_status: "available", evidence_link: `uploads/${file.sanitized_filename}`, recorded_at: file.uploaded_at });
                              });
                            } else {
                              matchedUncertainties = [{ flag_id: `UF-NO-ECG`, description: "Klinik Eksiklik: Ritim takibi ve kardiyak hasar ekarte edilmesi için EKG izlem kaydı yüklenmemiş.", severity: "WARNING" }];
                            }
                          } else if (record.modality === 'stethoscope') {
                            if (isExtracted) {
                              getCategoryFiles('steteskop').forEach((file, idx) => {
                                const shortFid = file.file_id ? file.file_id.substring(0, 4) : `F${idx}`;
                                matchedFindings.push({ candidate_id: `FC-STETH-${shortFid}`, label: `[Audio AI Node AU-08] Ingested stethoscope audio (${file.original_filename}). Acoustic frequency spectrum pending.`, confidence_band: "LOW", advisory_flag: "CANDIDATE OBSERVATION" });
                                matchedEvidence.push({ evidence_id: `EV-STETH-${shortFid}`, description: `Oskültasyon ses kanıtı (${file.original_filename}) alındı ve Akustik Analiz Pipeline'ına yönlendirildi.`, source: `upload:${file.file_id}`, relevance_band: "MEDIUM" });
                                matchedProvenance.push({ provenance_id: `PR-STETH-${shortFid}`, source_type: `upload_${file.file_type.toLowerCase()}`, source_ref: file.file_id, extraction_status: "available", evidence_link: `uploads/${file.sanitized_filename}`, recorded_at: file.uploaded_at });
                              });
                            } else {
                              matchedUncertainties = [{ flag_id: `UF-NO-STETH`, description: "Veri Eksikliği: Akustik kalp kapakçığı oskültasyon ses kaydı yüklenmemiş.", severity: "INFO" }];
                            }
                          }
                        }
                        
                        const isExpanded = expandedProvenance[record.observation_id];
                        
                        return (
                          <div 
                            key={record.observation_id} 
                            className={`border ${cfg.borderColor} ${cfg.borderColorHover} ${cfg.bg} p-4 rounded-xl transition-all duration-200 shadow-lg relative flex flex-col gap-3 group`}
                          >
                            {/* Modality strip glow indicator */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${isExtracted ? 'bg-notes-600' : 'bg-red-500'} ${isExtracted ? cfg.pulseClass : 'pulse-soft-red'}`}></div>
                            
                            {/* Row Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-slate-900 border ${cfg.borderColor} ${cfg.textColor}`}>
                                  <cfg.icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">{cfg.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono font-medium">OBS ID: {record.observation_id}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {/* Status Badge */}
                                <span className={`text-[9px] font-bold font-mono tracking-wider px-2 py-1 rounded-full border uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                                  isExtracted 
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' 
                                    : 'bg-red-950/80 text-red-400 border-red-900/80 animate-pulse'
                                }`}>
                                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isExtracted ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-ping'}`}></span>
                                  {isExtracted ? 'EXTRACTED / ACTIVE' : 'PENDING INPUT'}
                                </span>
                                
                                {/* Routing Node Badge */}
                                <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded border border-cyan-800 text-cyan-400 tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.15)] ${cfg.routingClass}`}>
                                  {record.routing_node}
                                </span>
                              </div>
                            </div>
                            
                            {/* Row Core: Findings & Uncertainties */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2 border-t border-slate-900 pt-3">
                              
                              {/* Findings */}
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t("findings")}
                                </h5>
                                <div className="space-y-1.5">
                                  {matchedFindings.length === 0 ? (
                                    <p className="text-[11px] text-slate-600 font-medium italic">No clinical findings extracted for this modality.</p>
                                  ) : (
                                    matchedFindings.map((fc, i) => (
                                      <div key={fc.candidate_id || i} className="bg-slate-950/40 border border-slate-900 p-2 rounded text-[11px] leading-relaxed flex items-start justify-between gap-3 shadow-inner hover:border-slate-800 transition-colors">
                                        <span className="text-slate-300 font-medium">{fc.label}</span>
                                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border tracking-wider shrink-0 select-none uppercase ${
                                          fc.confidence_band === 'HIGH' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                                          fc.confidence_band === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-900' :
                                          'bg-slate-900 text-slate-400 border-slate-800'
                                        }`} title="Ingestion Confidence Band">
                                          {fc.confidence_band}
                                        </span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                              
                              {/* Uncertainties */}
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <ShieldAlert className={`w-3 h-3 ${matchedUncertainties.length > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`} /> {t("uncertainty")}
                                </h5>
                                <div className="space-y-1.5">
                                  {matchedUncertainties.length === 0 ? (
                                    <div className="bg-emerald-950/10 border border-emerald-950/30 p-2 rounded text-[11px] text-emerald-500/80 font-medium italic flex items-center gap-1.5 shadow-inner">
                                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Zero structural uncertainties found.
                                    </div>
                                  ) : (
                                    matchedUncertainties.map((uf, i) => (
                                      <div key={uf.flag_id || i} className="bg-slate-950/40 border border-slate-900 p-2 rounded text-[11px] leading-relaxed flex items-start justify-between gap-3 shadow-inner hover:border-slate-800 transition-colors">
                                        <span className="text-slate-300 font-medium">{uf.description}</span>
                                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border tracking-wider shrink-0 select-none uppercase ${
                                          uf.severity === 'WARNING' ? 'bg-red-950 text-red-400 border-red-900 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'
                                        }`} title="Uncertainty Severity">
                                          {uf.severity || 'INFO'}
                                        </span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Provenance Trace (Expandable Layer Toggle) */}
                            <div className="pl-2 pt-1.5 flex items-center justify-between gap-4 border-t border-slate-900/50">
                              <span className="text-[9px] text-slate-600 font-mono">{t("evidence_env")}</span>
                              <button 
                                onClick={() => setExpandedProvenance(prev => ({ ...prev, [record.observation_id]: !prev[record.observation_id] }))}
                                className={`text-[10px] font-mono flex items-center gap-1.5 px-2 py-1 rounded border transition-colors hover:bg-slate-900 hover:text-cyan-400 border-slate-800 text-slate-500`}
                              >
                                <span>{t("provenance_btn")}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                            
                            {/* Provenance Trace Expandable Area */}
                            {isExpanded && (
                              <div className="pl-2 pr-1 pt-1 pb-2 transition-all duration-300">
                                {matchedProvenance.length === 0 ? (
                                  <div className="bg-[#020814]/80 border border-red-950/50 p-3 rounded-lg flex items-center justify-center flex-col text-slate-600 text-[11px] font-mono">
                                    <Clock className="w-5 h-5 mb-1.5 text-red-500/50 animate-pulse" />
                                    <span>NO EVIDENCE INGESTED YET</span>
                                    <span className="text-[9px] text-slate-700 mt-0.5">Please upload modality files to generate provenance records</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {matchedProvenance.map((pr, i) => (
                                      <div key={pr.provenance_id || i} className="bg-[#020814]/90 border border-cyan-900/30 rounded-lg p-3 flex flex-col gap-2 relative shadow-md overflow-hidden hover:border-cyan-500/30 transition-all select-text">
                                        {/* Corner decoration tag */}
                                        <div className="absolute top-0 right-0 bg-cyan-950 text-cyan-500 font-mono text-[8px] px-2 py-0.5 rounded-bl border-l border-b border-cyan-800/40 uppercase">
                                          {t("source")} {pr.source_type}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] font-mono">
                                          <div className="flex items-center justify-between py-0.5 border-b border-slate-900">
                                            <span className="text-slate-500">PROVENANCE ID</span>
                                            <span className="text-slate-300 font-bold">{pr.provenance_id}</span>
                                          </div>
                                          <div className="flex items-center justify-between py-0.5 border-b border-slate-900">
                                            <span className="text-slate-500">SOURCE REF</span>
                                            <span className="text-cyan-400 font-medium truncate max-w-[150px] overflow-hidden text-ellipsis" title={pr.source_ref}>{pr.source_ref}</span>
                                          </div>
                                          <div className="flex items-center justify-between py-0.5 border-b border-slate-900 sm:border-b-0">
                                            <span className="text-slate-500">{t("extraction_status")}</span>
                                            <span className="text-emerald-400 font-medium uppercase">{pr.extraction_status}</span>
                                          </div>
                                          <div className="flex items-center justify-between py-0.5 border-b border-slate-900 sm:border-b-0">
                                            <span className="text-slate-500">{t("ingest_time")}</span>
                                            <span className="text-slate-400">{new Date(pr.recorded_at).toLocaleTimeString() || "LIVE"}</span>
                                          </div>
                                        </div>
                                        
                                        {/* SHA256 Short Hash & Evidence Link */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-900/50 mt-1">
                                          {/* Hash */}
                                          {record.source_file_id || pr.source_type.includes('upload') ? (
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] text-slate-500 font-mono">SHA-256:</span>
                                              <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                  {uploadedFiles.find(uf => uf.file_id === record.source_file_id || uf.file_id === pr.source_ref)?.sha256?.substring(0, 12) || "f49bc332a901"}
                                                </span>
                                                <button 
                                                  onClick={() => copyToClipboard(uploadedFiles.find(uf => uf.file_id === record.source_file_id || uf.file_id === pr.source_ref)?.sha256 || "f49bc332a901f4882bd893321ad8f1e94472c918349", pr.provenance_id)}
                                                  className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                                  title="Copy SHA-256 Hash"
                                                >
                                                  {copiedId === pr.provenance_id ? (
                                                    <span className="text-[8px] text-emerald-400 font-bold">COPIED!</span>
                                                  ) : (
                                                    <Copy className="w-3.5 h-3.5" />
                                                  )}
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-[9px] text-slate-600 font-mono">NOTES SEMANTIC SYMPTOM DIGEST MAPPED SUCCESS</div>
                                          )}
                                          
                                          {/* Evidence Link */}
                                          {pr.evidence_link && (
                                            <a 
                                              href={`#${pr.evidence_link}`} 
                                              onClick={(e) => { e.preventDefault(); setActiveTab(record.modality); }}
                                              className="text-[9px] text-cyan-500 hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors border-b border-dashed border-cyan-800"
                                            >
                                              <Link2 className="w-3 h-3" /> {t("view_source")}
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* RIGHT COLUMN: Live Terminal & Hekim Advisory Report (Col 8-12) */}
                  <div className="xl:col-span-5 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-800 shrink-0">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {isSignedOff ? "Clinician Verified Report & Sign-off" : t("hekim_vaka_ozeti")}
                      </h3>
                      <span className="text-[9px] text-amber-500 font-mono">
                        {isSignedOff ? "VERIFIED & LOCKED" : "AI DRAFT SUPPORT"}
                      </span>
                    </div>

                    {!advisoryData ? (
                      /* Awaiting Pipeline Run */
                      <div className="flex-1 flex flex-col border border-slate-800 bg-[#020814]/80 rounded-xl p-4 gap-4 shadow-lg relative min-h-[300px]">
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-900 shrink-0">
                            <div className="flex items-center gap-2">
                              <BrainCircuit className="w-4 h-4 text-cyan-500 animate-pulse" />
                              <span className="text-xs font-bold text-slate-300 font-mono">ADVISORY TERMINAL</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">SYSTEM READY</span>
                          </div>
                          
                          <div className="flex-1 bg-[#010307] border border-cyan-950/60 p-4 rounded-lg text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap font-mono text-cyan-200/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center text-center text-slate-600">
                            <BrainCircuit className="w-12 h-12 text-slate-800 animate-pulse mb-3" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("awaiting_analysis")}</p>
                              <p className="text-[10px] text-slate-600 leading-normal max-w-xs">
                                Click "RUN PIPELINE" below to activate the clinical advisory pipeline and extract deep structured observation records.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleGenerateSummary}
                          disabled={loading || !caseId}
                          className={`w-full py-3.5 rounded-xl border border-cyan-400 bg-cyan-950/40 text-cyan-300 font-bold text-sm tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-800/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex flex-col items-center justify-center gap-1 select-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${loading ? 'loading-sweep-bar' : ''}`}
                        >
                          <span>{loading ? t("analyzing") : t("run_pipeline")}</span>
                          <span className="text-[9px] font-normal text-cyan-500 font-mono tracking-wider">SECURE MEDICAL INGESTION MATRIX GATEWAY</span>
                        </button>
                      </div>
                    ) : (
                      /* Advisory Run & Review Phase Active */
                      <div className="space-y-4">
                        {/* 1. ADVISORY TERMINAL (DRAFT REPORT) */}
                        <div className="border border-slate-800 bg-[#020814]/80 rounded-xl p-4 gap-3 shadow-lg flex flex-col">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-900 shrink-0">
                            <div className="flex items-center gap-2">
                              <BrainCircuit className="w-4 h-4 text-cyan-500 animate-pulse" />
                              <span className="text-xs font-bold text-slate-300 font-mono">ADVISORY DRAFT REPORT</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">GENERATED</span>
                          </div>
                          
                          <div className="bg-[#010307] border border-cyan-950/60 p-4 rounded-lg text-xs leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap font-mono text-cyan-200/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative group/draft">
                            {advisoryResult}
                            <button 
                              onClick={() => copyToClipboard(advisoryResult, 'advisory-draft')}
                              className="absolute right-2 top-2 p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-cyan-400 opacity-0 group-hover/draft:opacity-100 transition-opacity duration-150"
                              title="Copy advisory draft"
                            >
                              {copiedId === 'advisory-draft' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* 2. REFERENCE MATCH PANEL */}
                        {advisoryData.reference_cases && advisoryData.reference_cases.length > 0 && (
                          <div className="border border-cyan-500/30 bg-[#020814]/80 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
                            <div className="flex justify-between items-center pb-2 border-b border-cyan-950">
                              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                                clinical decision support matches
                              </h4>
                              <span className="text-[9px] text-slate-500 font-mono">TOP-3 MATCHES FOUND</span>
                            </div>
                            
                            <div className="space-y-4">
                              {advisoryData.reference_cases.slice(0, 3).map((match, idx) => {
                                const refCase = match.reference_case;
                                return (
                                  <div key={refCase.ref_case_id || idx} className="bg-[#010307] border border-slate-900 rounded-lg p-3 space-y-2.5">
                                    <div className="flex justify-between items-start gap-3">
                                      <div>
                                        <span className="text-xs font-bold text-slate-200">
                                          {refCase.clinical_pattern_label}
                                        </span>
                                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                                          ID: {refCase.ref_case_id} | License: {refCase.license_type}
                                        </div>
                                      </div>
                                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-cyan-800 bg-cyan-950/40 text-cyan-400 tracking-wider shrink-0">
                                        Score: {Math.round(match.match_score * 100)}%
                                      </span>
                                    </div>
                                    
                                    {/* Match Reasons */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {match.match_reasons.map((reason, i) => (
                                        <span key={i} className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border border-cyan-900 bg-cyan-950/20 text-cyan-400 uppercase tracking-wider">
                                          {reason}
                                        </span>
                                      ))}
                                    </div>
                                    
                                    {/* Structured Guidance Template */}
                                    <div className="space-y-1">
                                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">clinical impression draft template</span>
                                      <div className="bg-[#020814] border border-slate-900 p-2.5 rounded text-[10px] leading-relaxed text-slate-300 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap shadow-inner relative group/guidance">
                                        {refCase.structured_guidance_template}
                                        <button 
                                          onClick={() => copyToClipboard(refCase.structured_guidance_template, `guidance-${idx}`)}
                                          className="absolute right-2 top-2 p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-cyan-400 opacity-0 group-hover/guidance:opacity-100 transition-opacity duration-150"
                                          title="Copy guidance template"
                                        >
                                          {copiedId === `guidance-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Doctor Teaching Note */}
                                    {refCase.doctor_teaching_note && (
                                      <div className="text-[10px] bg-cyan-950/10 border border-cyan-900/30 p-2 rounded text-cyan-400 font-sans leading-normal">
                                        <span className="font-bold text-[9px] uppercase tracking-wider block mb-0.5">Teaching Note:</span>
                                        {refCase.doctor_teaching_note}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 3. CLINICIAN REVIEW PANEL */}
                        <div className="border border-cyan-500/30 bg-[#020814]/80 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
                          <div className="flex justify-between items-center pb-2 border-b border-cyan-950">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                              <ClipboardList className="w-4 h-4 text-cyan-400 animate-pulse" />
                              clinician review & decision support
                            </h4>
                            {isSignedOff ? (
                              <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-amber-500 bg-amber-950/40 text-amber-500 animate-pulse uppercase tracking-widest">
                                CASE LOCKED
                              </span>
                            ) : (
                              <span className="text-[9px] text-red-400 font-mono animate-pulse font-bold">SIGN-OFF REQUIRED</span>
                            )}
                          </div>
                          
                          <div className="space-y-3.5">
                            {/* Doctor ID */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Doctor ID (Clinician License)*</label>
                              <input 
                                type="text" 
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                                disabled={isSignedOff}
                                placeholder="e.g. DR-88219"
                                className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>
                            
                            {/* Status Selector */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Impression Verification Status*</label>
                              <select 
                                value={reviewStatus}
                                onChange={(e) => setReviewStatus(e.target.value)}
                                disabled={isSignedOff}
                                className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                <option value="reviewed">Clinician Reviewed & Verified</option>
                                <option value="needs_revision">Needs Revision / Additional Ingestion</option>
                                <option value="rejected">Rejected / Conflicting Primary Evidence</option>
                              </select>
                            </div>

                            {/* Clinician Note */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Clinician Observational Notes / Differential Considerations</label>
                              <textarea 
                                rows={3}
                                value={clinicianNote}
                                onChange={(e) => setClinicianNote(e.target.value)}
                                disabled={isSignedOff}
                                placeholder="Add differential considerations, clinical impression draft or notes regarding patient state..."
                                className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>

                            {/* Clinician Verified Report */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Clinician Verified Report*</label>
                                {advisoryData.reference_cases && advisoryData.reference_cases.length > 0 && !isSignedOff && (
                                  <button 
                                    onClick={() => {
                                      const bestGuidance = advisoryData.reference_cases[0].reference_case.structured_guidance_template;
                                      setFinalReportText(bestGuidance);
                                    }}
                                    className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1"
                                  >
                                    <Copy className="w-2.5 h-2.5" /> Auto-fill from Top Match
                                  </button>
                                )}
                              </div>
                              <textarea 
                                rows={6}
                                value={finalReportText}
                                onChange={(e) => setFinalReportText(e.target.value)}
                                disabled={isSignedOff}
                                placeholder="Review and finalize the clinician verified report text. You can copy the advisory draft or auto-fill from the top clinical pattern guidance."
                                className="w-full bg-[#020814] border border-cyan-900/55 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner resize-none font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>

                            {/* Sign-off Trigger Button */}
                            {!isSignedOff ? (
                              <button 
                                onClick={handleSignoff}
                                disabled={!doctorId.trim() || !finalReportText.trim() || loading}
                                className="w-full py-3.5 rounded-xl border border-cyan-400 bg-cyan-950/40 text-cyan-300 font-bold text-sm tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-800/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed select-none"
                              >
                                <span>SIGN-OFF & LOCK CASE</span>
                                <span className="text-[8px] font-normal text-cyan-500 font-mono tracking-wider">EXECUTE CLINICIAN VERIFIED REPORT SIGNATURE</span>
                              </button>
                            ) : (
                              <div className="w-full border border-amber-500/50 bg-amber-950/20 p-4 rounded-xl text-center space-y-2 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)] select-none">
                                <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
                                  <Shield className="w-4 h-4 animate-spin-slow" />
                                  VERIFIED CLINICIAN SIGNOFF — CASE LOCKED
                                </div>
                                <p className="text-[10px] text-slate-450 max-w-xs mx-auto leading-normal">
                                  This medical case and associated ingestion assets have been digitally locked under Doctor ID <span className="font-bold text-slate-200 font-mono">{doctorId}</span>. No further changes allowed.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            )}

            {activeTab !== 'anamnez' && activeTab !== 'radyoloji' && activeTab !== 'ekg' && activeTab !== 'steteskop' && activeTab !== 'ozet' && (
              <div className="flex-1 border border-cyan-500/60 rounded-xl bg-slate-900/30 flex items-center justify-center flex-col shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Crosshair className="w-12 h-12 text-cyan-800 mb-4 animate-pulse" />
                <h2 className="text-cyan-600 text-lg uppercase tracking-widest">{activeTab} Paneli</h2>
                <p className="text-slate-500 text-xs mt-2">Bu modül yapılandırılıyor...</p>
              </div>
            )}

            {/* Timeline Bottom Section - Scrollbar Fix */}
            <div className="h-32 border border-cyan-500/60 rounded-xl bg-slate-900/30 p-3 flex flex-col shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-900/50 [&::-webkit-scrollbar-thumb]:bg-cyan-700 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500 [&::-webkit-scrollbar-thumb]:rounded-full pb-1">
              <h3 className="text-xs font-semibold text-slate-300 mb-2 shrink-0">Kanıt Zinciri <span className="text-slate-500 font-normal">(Timeline)</span></h3>
              <div className="flex-1 flex items-center justify-between px-2 min-w-max gap-2 mb-1">
                {mockData.timeline.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 w-28 bg-slate-950/50 z-10 ${
                      step.color === 'cyan' ? 'border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' :
                      step.color === 'green' ? 'border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                      step.color === 'yellow' ? 'border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' :
                      'border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    }`}>
                      <div className="flex items-center gap-1 text-[10px] mb-1">
                        <step.icon className="w-3 h-3" /> {step.title}
                      </div>
                      <div className="text-xs font-bold">{step.time}</div>
                      {step.sub && <div className="text-[9px] mt-0.5 whitespace-nowrap">{step.sub}</div>}
                    </div>
                    {i < mockData.timeline.length - 1 && (
                      <div className="w-8 h-0.5 bg-slate-700 relative shrink-0">
                        <ChevronRight className="w-4 h-4 text-slate-500 absolute -right-2 -top-2" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL (Col 10-12) */}
          <div className="lg:col-span-3 border border-orange-500/40 rounded-xl bg-slate-900/40 p-4 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <h2 className="text-slate-100 font-bold text-lg shrink-0">Risk Analysis</h2>
            
            <div className="shrink-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Evidence Strength</span>
                <span className="text-emerald-400 font-bold">{evidenceStrength}%</span>
              </div>
              <div className="h-6 w-full bg-slate-800 rounded overflow-hidden relative border border-slate-700">
                <div className="absolute left-2 top-1 text-xs text-white font-medium z-10 text-shadow">
                  {evidenceStrength > 80 ? 'Strong Ingestion' : evidenceStrength > 50 ? 'Moderate Ingestion' : 'Weak Ingestion'}
                </div>
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500" style={{width: `${evidenceStrength}%`}}></div>
              </div>
            </div>

            <div className="space-y-3 shrink-0">
              <h3 className="text-xs text-slate-400 border-b border-slate-700 pb-1">Olası Tanılar</h3>
              {displayDiagnoses().map((diag, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-amber-500 truncate max-w-[170px]" title={diag.name}>{diag.name}</span>
                    <span className="text-amber-500">{diag.prob}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{width: `${diag.prob}%`}}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-xs text-emerald-400 mb-1 border-b border-slate-800 pb-1">Lehine Kanıtlar</h3>
                <ul className="text-[10px] text-slate-300 space-y-1">
                  {getProsAndCons().pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0"></span> <span className="leading-tight">{pro}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs text-red-400 mb-1 border-b border-slate-800 pb-1">Aleyhine Kanıtlar</h3>
                <ul className="text-[10px] text-slate-300 space-y-1">
                  {getProsAndCons().cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 shrink-0"></span> <span className="leading-tight">{con}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase 4A-7: Clinical Correlation Alerts */}
            {advisoryData?.correlation_signals && advisoryData.correlation_signals.length > 0 && (
              <div className="space-y-2 shrink-0 border-t border-cyan-950 pt-3">
                <h3 className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Clinical Correlation Alerts</span>
                </h3>
                <div className="text-[10px] text-slate-500 font-mono italic">
                  Clinical decision support • Clinician review required
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {advisoryData.correlation_signals.slice(0, 5).map((signal) => {
                    const isExpanded = !!expandedSignals[signal.correlation_id];
                    
                    const gradeColors = {
                      GUIDELINE: {
                        border: "border-orange-500/30",
                        text: "text-orange-400",
                        bg: "bg-orange-500/5"
                      },
                      LITERATURE: {
                        border: "border-amber-500/30",
                        text: "text-amber-400",
                        bg: "bg-amber-500/5"
                      },
                      HEURISTIC: {
                        border: "border-sky-500/30",
                        text: "text-sky-400",
                        bg: "bg-sky-500/5"
                      },
                      OBSERVATIONAL: {
                        border: "border-slate-700/50",
                        text: "text-slate-400",
                        bg: "bg-slate-700/5"
                      }
                    };
                    
                    const style = gradeColors[signal.evidence_grade] || gradeColors.OBSERVATIONAL;
                    
                    return (
                      <div 
                        key={signal.correlation_id}
                        className={`border rounded-xl p-3 flex flex-col gap-2 transition-all ${style.border} ${style.bg}`}
                      >
                        {/* Header */}
                        <div 
                          onClick={() => setExpandedSignals(prev => ({ ...prev, [signal.correlation_id]: !isExpanded }))}
                          className="cursor-pointer flex justify-between items-start gap-2 select-none"
                        >
                          <div className="min-w-0">
                            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase ${style.text}`}>
                              {signal.evidence_grade}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-0.5 leading-tight">{signal.rule_name}</h4>
                          </div>
                          <div className="shrink-0 pt-0.5">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                          </div>
                        </div>
                        
                        {/* Always Visible Explanation */}
                        <p className={`text-[10px] text-slate-300 leading-normal ${
                          ['HEURISTIC', 'OBSERVATIONAL'].includes(signal.evidence_grade) ? 'italic text-slate-450' : ''
                        }`}>
                          {signal.explanation}
                        </p>
                        
                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-900 flex flex-col gap-2.5 transition-all">
                            {/* Match Reasons */}
                            {signal.triggered_by && signal.triggered_by.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">Match Reasons</span>
                                <div className="flex flex-wrap gap-1">
                                  {signal.triggered_by.map((reason, idx) => (
                                    <span 
                                      key={idx}
                                      className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-400"
                                    >
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Confidence & Domain */}
                            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-y border-slate-900/50 py-1.5">
                              <div className="flex justify-between">
                                <span className="text-slate-500">CONFIDENCE:</span>
                                <span className={`font-bold ${
                                  signal.confidence_band === 'HIGH' ? 'text-emerald-400' :
                                  signal.confidence_band === 'MEDIUM' ? 'text-amber-400' :
                                  'text-slate-400'
                                }`}>{signal.confidence_band}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">DOMAIN:</span>
                                <span className="text-slate-400 uppercase">{signal.clinical_domain}</span>
                              </div>
                            </div>
                            
                            {/* Suggested Next Checks */}
                            {signal.suggested_next_check && signal.suggested_next_check.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">Suggested Next Checks</span>
                                <ul className="text-[10px] text-slate-350 space-y-1 font-sans">
                                  {signal.suggested_next_check.map((check, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 shrink-0"></span>
                                      <span className="leading-tight">{check}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Weakness notes if any */}
                            {signal.weakness_notes && signal.weakness_notes.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">Confounding / Limitations</span>
                                <ul className="text-[9px] text-slate-450 space-y-0.5 italic">
                                  {signal.weakness_notes.map((note, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span>•</span>
                                      <span className="leading-tight">{note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Advisory disclaimer */}
                            <div className="text-[9px] bg-slate-950/60 border border-slate-900/60 p-2 rounded text-slate-500 italic leading-normal text-center select-none">
                              {signal.advisory_note}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-900/50 p-2 rounded shrink-0 font-mono shadow-[inset_0_0_10px_rgba(239,68,68,0.1)] flex items-center justify-between gap-3 select-text">
                <div className="min-w-0 truncate">
                  ⚠️ Hata: {error}
                </div>
                {error.includes("Sistem Başlatılamadı") && (
                  <button 
                    onClick={initiateCaseCreation}
                    disabled={loading}
                    className="shrink-0 text-[9px] font-bold px-2 py-1 rounded border border-emerald-500 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-800/30 transition-colors select-none cursor-pointer"
                  >
                    {loading ? "Bağlanıyor..." : "Yeniden Bağlan / Retry"}
                  </button>
                )}
              </div>
            )}

            {advisoryResult && (
              <div className="space-y-2 shrink-0 border-t border-cyan-950 pt-3">
                <h3 className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-500 animate-pulse" /> Hekim Vaka Özeti
                </h3>
                <div className="bg-[#020814] border border-cyan-900/50 p-3 rounded-lg text-xs text-cyan-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-mono shadow-[inset_0_0_15px_rgba(6,182,212,0.05)]">
                  {advisoryResult}
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerateSummary}
              disabled={loading || !caseId || isSignedOff}
              className={`mt-auto shrink-0 w-full py-3 rounded-xl border border-cyan-400 bg-cyan-900/30 text-cyan-300 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-800/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'loading-sweep-bar' : ''}`}
            >
              <span>{loading ? 'HESAPLANIYOR...' : isSignedOff ? 'KİLİTLENDİ (SIGNED OFF)' : 'ÜRET DOKTOR VAKA ÖZETİ'}</span>
              <span className="text-[10px] font-normal text-cyan-500 mt-1 font-mono">ID: DR-7492</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* --- SUB COMPONENTS --- */

function PillBox({ label, value, borderColor, textColor="text-slate-200", glow="" }) {
  return (
    <div className={`flex flex-col justify-center px-3 py-1 border rounded-lg bg-slate-900/80 ${borderColor} ${glow}`}>
      <span className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-bold ${textColor} truncate`}>{value}</span>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, plugin, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all ${
        active 
          ? 'bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
        <span className="truncate text-left">{label}</span>
      </div>
      {plugin && <span className="text-[8px] text-amber-500/70 border border-amber-500/30 px-1 rounded ml-2">(PLUGIN)</span>}
    </button>
  );
}

function MockEKGLine({ label, highlight }) {
  return (
    <div className="w-full h-12 relative flex items-center group">
      <div className="absolute left-2 text-[10px] text-cyan-700 font-mono">{label}</div>
      <svg className="w-full h-full preserve-3d" viewBox="0 0 500 50" preserveAspectRatio="none">
        <path 
          d="M0,25 L50,25 L55,10 L65,40 L70,25 L150,25 L155,10 L165,40 L170,25 L250,25 L255,10 L265,40 L270,25 L350,25 L355,10 L365,40 L370,25 L450,25 L455,10 L465,40 L470,25 L500,25" 
          fill="none" 
          stroke={highlight ? "#ef4444" : "#06b6d4"} 
          strokeWidth="1.5"
          className="vector-effect-non-scaling-stroke drop-shadow-[0_0_3px_rgba(6,182,212,0.8)]"
        />
        {highlight && (
           <path d="M250,25 L255,5 L265,45 L280,10 L290,25 L350,25" fill="none" stroke="#ef4444" strokeWidth="2" className="drop-shadow-[0_0_5px_rgba(239,68,68,1)]" />
        )}
      </svg>
    </div>
  );
}

function UploadPanel({ 
  title, 
  icon: Icon, 
  themeColor, 
  accept, 
  acceptLabel, 
  files, 
  onFileDrop,
  triggerUpload, 
  fileInputRef, 
  handleFileChange,
  loading 
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  const themeClasses = {
    cyan: {
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      borderHover: "hover:border-cyan-400",
      bg: "bg-cyan-950/10",
      bgHover: "bg-cyan-950/20",
      badge: "bg-cyan-950 text-cyan-400 border-cyan-800",
      glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      dragBg: "bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      leftBorder: "bg-cyan-600",
    },
    emerald: {
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      borderHover: "hover:border-emerald-400",
      bg: "bg-emerald-950/10",
      bgHover: "bg-emerald-950/20",
      badge: "bg-emerald-950 text-emerald-400 border-emerald-800",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      dragBg: "bg-emerald-950/30 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      leftBorder: "bg-emerald-500",
    },
    amber: {
      text: "text-amber-400",
      border: "border-amber-500/30",
      borderHover: "hover:border-amber-400",
      bg: "bg-amber-950/10",
      bgHover: "bg-amber-950/20",
      badge: "bg-amber-950 text-amber-400 border-amber-800",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      dragBg: "bg-amber-950/30 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      leftBorder: "bg-amber-500",
    }
  };

  const style = themeClasses[themeColor] || themeClasses.cyan;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex-1 border ${style.border} rounded-xl bg-slate-900/30 flex flex-col min-h-0 ${style.glow}`}>
      
      <div className={`flex justify-between items-center p-3 border-b ${style.border} bg-slate-950/20 shrink-0`}>
        <h2 className={`font-semibold flex items-center gap-2 text-sm ${style.text}`}>
          <Icon className="w-4 h-4" /> {title}
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">STATUS: INGESTION MODULE READY</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        
        <div className="w-full lg:w-1/2 flex flex-col gap-3 min-h-[250px]">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept={accept} 
            className="hidden" 
          />
          
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerUpload}
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 select-none ${
              dragActive 
                ? style.dragBg 
                : `${style.border} ${style.bg} ${style.borderHover} ${style.bgHover}`
            }`}
          >
            <Upload className={`w-10 h-10 mb-3 transition-transform ${dragActive ? 'scale-110 ' + style.text : 'text-slate-500'}`} />
            
            <p className="text-xs text-slate-300 font-medium mb-1">
              {dragActive ? "Dosyayı buraya bırakın" : "Dosyayı buraya sürükleyin veya seçmek için tıklayın"}
            </p>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-3">
              LIMIT: 50MB per file
            </p>
            
            <div className={`text-[10px] font-mono py-1 px-2.5 rounded border ${style.badge}`}>
              Uyumlu: {acceptLabel}
            </div>
          </div>
          
          {loading && (
            <div className="h-10 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-center gap-2 px-3 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
              VERİ ANALİZİ YAPILIYOR / INGESTION IN PROGRESS...
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col min-h-[250px] border border-slate-800 bg-slate-950/40 rounded-xl p-3">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-850 shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yüklenen Dosya Kartları ({files.length})</h3>
            <span className="text-[9px] text-slate-600 font-mono">EVIDENCE MATRIX</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
            {files.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col text-slate-600 p-4">
                <AlertCircle className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs font-medium">Bu kategoride henüz veri kartı yüklenmemiş.</p>
                <p className="text-[10px] opacity-75 mt-1 font-mono">Klinik analiz için ilgili dosyaları sürükleyin.</p>
              </div>
            ) : (
              files.map((file, idx) => (
                <div 
                  key={file.file_id || idx} 
                  className="bg-[#020814]/80 border border-slate-800/80 hover:border-slate-700/80 p-3 rounded-lg flex flex-col gap-1.5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] relative overflow-hidden group select-text"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${style.leftBorder}`}></div>
                  
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-200 truncate pr-4" title={file.original_filename}>
                        {file.original_filename}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5 flex flex-wrap gap-2">
                        <span>ID: {file.file_id}</span>
                        <span>•</span>
                        <span>Size: {formatBytes(file.size_bytes)}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-900 bg-emerald-950/50 text-emerald-400 tracking-widest shrink-0 font-mono uppercase">
                      {file.upload_status || 'stored'}
                    </span>
                  </div>

                  <div className="text-[9px] bg-slate-900/50 p-1.5 rounded text-slate-400 font-mono break-all border border-slate-900 leading-tight">
                    <span className="text-slate-600 block text-[8px] uppercase tracking-wider mb-0.5">SHA-256 HASH VERIFICATION</span>
                    {file.sha256}
                  </div>
                  
                  <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono border-t border-slate-900 pt-1.5 mt-0.5 shrink-0">
                    <span>MIME: {file.mime_type}</span>
                    <span>{new Date(file.uploaded_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
