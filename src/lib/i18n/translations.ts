export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Header
  appName: string;
  appSubtitle: string;
  ministryName: string;
  offlineMode: string;
  onlineMode: string;
  reportsWaitingSync: string;
  syncNow: string;
  synced: string;
  syncing: string;
  offlineQueueNotice: string;

  // Navigation
  navDashboard: string;
  navMap: string;
  navRisk: string;
  navForecast: string;
  navReports: string;
  navAlerts: string;
  navResponse: string;
  navSettings: string;
  navFieldReport: string;

  // Risk Levels
  riskLow: string;
  riskModerate: string;
  riskHigh: string;
  riskCritical: string;

  // Trends
  trendRising: string;
  trendStable: string;
  trendFalling: string;

  // Field Report Form
  fieldReportTitle: string;
  fieldReportSubtitle: string;
  stepClassification: string;
  stepPhoto: string;
  stepLocation: string;
  stepObservations: string;
  reportTypeCrack: string;
  reportTypeSlump: string;
  reportTypeBlocked: string;
  reportTypeRockfall: string;
  reportTypeDebris: string;
  reportTypeErosion: string;
  reportTypeOther: string;
  useGpsBtn: string;
  gpsCaptured: string;
  photoUploadPrompt: string;
  tensionCracksCheck: string;
  roadBlockedCheck: string;
  notesLabel: string;
  submitReportBtn: string;
  saveOfflineBtn: string;
  submittingText: string;

  // Alerts & Directives
  activeAlertsTitle: string;
  acknowledgeBtn: string;
  resolveBtn: string;
  popAffectedLabel: string;
  threatenedRoadsLabel: string;
  directivesLabel: string;
  triggerScenarioBtn: string;

  // Weather & Telemetry
  weatherTelemetryTitle: string;
  rainIntensity1h: string;
  rainCumulative24h: string;
  soilMoistureLabel: string;
  antecedentRain72h: string;
  surfaceWindLabel: string;
  tempAndHumidityLabel: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: "BHUSHAKTI AI",
    appSubtitle: "AI Landslide Early Warning & Risk Intelligence",
    ministryName: "Ministry of Development of North Eastern Region (MDoNER)",
    offlineMode: "OFFLINE MODE",
    onlineMode: "ONLINE / SYNCED",
    reportsWaitingSync: "reports waiting to sync",
    syncNow: "Sync Now",
    synced: "SYNCED",
    syncing: "SYNCING...",
    offlineQueueNotice: "Operating offline. Submissions stored in local device cache and will auto-sync on reconnect.",

    navDashboard: "Command Center",
    navMap: "GIS Spatial Map",
    navRisk: "Risk Intelligence",
    navForecast: "24h Hazard Forecast",
    navReports: "Field Ground Truth",
    navAlerts: "Emergency Alerts",
    navResponse: "Response Dispatch",
    navSettings: "Settings & System",
    navFieldReport: "Submit Report",

    riskLow: "LOW",
    riskModerate: "MODERATE",
    riskHigh: "HIGH",
    riskCritical: "CRITICAL",

    trendRising: "RISING",
    trendStable: "STABLE",
    trendFalling: "FALLING",

    fieldReportTitle: "Field Incident Report & Vision Inspection",
    fieldReportSubtitle: "Submit geo-tagged ground photos, crack measurements, and road blockage reports to update the AI Hazard Index.",
    stepClassification: "1. Incident Classification",
    stepPhoto: "2. Ground Photo & AI Vision",
    stepLocation: "3. Geolocation & Landmark",
    stepObservations: "4. Ground Observations & Structural Details",
    reportTypeCrack: "Slope Crack",
    reportTypeSlump: "Ground Slump",
    reportTypeBlocked: "Road Blocked",
    reportTypeRockfall: "Rockfall",
    reportTypeDebris: "Debris Flow",
    reportTypeErosion: "Toe Erosion",
    reportTypeOther: "Other Hazard",
    useGpsBtn: "Use Device GPS",
    gpsCaptured: "GPS Captured!",
    photoUploadPrompt: "Tap to Open Camera or Choose Photo",
    tensionCracksCheck: "Visible Tension Cracks Observed",
    roadBlockedCheck: "Highway / Roadway Obstructed",
    notesLabel: "Notes & Field Description:",
    submitReportBtn: "Submit Field Report to Command Center",
    saveOfflineBtn: "Save to Offline Queue",
    submittingText: "Processing Through AI Pipeline...",

    activeAlertsTitle: "Emergency Landslide Alerts & Bulletins",
    acknowledgeBtn: "Acknowledge Alert",
    resolveBtn: "Mark as Resolved",
    popAffectedLabel: "Population at Risk",
    threatenedRoadsLabel: "Threatened Roads",
    directivesLabel: "Actionable Operational Directives",
    triggerScenarioBtn: "Trigger Critical Scenario",

    weatherTelemetryTitle: "Weather Telemetry & 24-Hour Landslide Forecast",
    rainIntensity1h: "1h Rain Intensity",
    rainCumulative24h: "24h Cumulative",
    soilMoistureLabel: "Soil Moisture",
    antecedentRain72h: "72h Antecedent",
    surfaceWindLabel: "Surface Wind",
    tempAndHumidityLabel: "Temp & Humidity",
  },
  hi: {
    appName: "भू-शक्ति AI",
    appSubtitle: "एआई-संचालित भूस्खलन पूर्व चेतावनी एवं जोखिम विश्लेषण",
    ministryName: "उत्तर पूर्वी क्षेत्र विकास मंत्रालय (MDoNER)",
    offlineMode: "ऑफ़लाइन मोड",
    onlineMode: "ऑनलाइन / सिंक सक्रिय",
    reportsWaitingSync: "रिपोर्ट सिंक के लिए प्रतीक्षारत",
    syncNow: "अभी सिंक करें",
    synced: "सिंक पूरा",
    syncing: "सिंक हो रहा है...",
    offlineQueueNotice: "ऑफ़लाइन मोड में कार्यशील। रिपोर्ट डिवाइस मेमोरी में सुरक्षित हैं और नेटवर्क आने पर स्वतः सिंक हो जाएंगी।",

    navDashboard: "आपदा नियंत्रण कक्ष",
    navMap: "जीआईएस मानचित्र",
    navRisk: "जोखिम विश्लेषण",
    navForecast: "24-घंटे पूर्वानुमान",
    navReports: "क्षेत्रीय रिपोर्ट",
    navAlerts: "आपातकालीन चेतावनी",
    navResponse: "प्रतिक्रिया केंद्र",
    navSettings: "सेटिंग्स एवं प्रणाली",
    navFieldReport: "रिपोर्ट दर्ज करें",

    riskLow: "निम्न",
    riskModerate: "मध्यम",
    riskHigh: "उच्च",
    riskCritical: "गंभीर",

    trendRising: "बढ़ रहा है",
    trendStable: "स्थिर",
    trendFalling: "घट रहा है",

    fieldReportTitle: "क्षेत्रीय घटना रिपोर्ट एवं दृष्टि निरीक्षण",
    fieldReportSubtitle: "एआई भूस्खलन सूचकांक को अद्यतन करने के लिए जियो-टैग्ड फ़ोटो, दरार माप और सड़क अवरोध रिपोर्ट दर्ज करें।",
    stepClassification: "1. घटना का प्रकार चुनें",
    stepPhoto: "2. फ़ोटो एवं एआई दृष्टि विश्लेषण",
    stepLocation: "3. जीपीएस स्थिति एवं स्थल",
    stepObservations: "4. स्थल निरीक्षण एवं संरचनात्मक विवरण",
    reportTypeCrack: "ढलान की दरार",
    reportTypeSlump: "भूमि फिसलन",
    reportTypeBlocked: "सड़क अवरुद्ध",
    reportTypeRockfall: "चट्टान गिरना",
    reportTypeDebris: "मलबा प्रवाह",
    reportTypeErosion: "मिट्टी का कटाव",
    reportTypeOther: "अन्य खतरा",
    useGpsBtn: "डिवाइस जीपीएस का उपयोग करें",
    gpsCaptured: "जीपीएस दर्ज हुआ!",
    photoUploadPrompt: "कैमरा खोलने या फ़ोटो चुनने के लिए टैप करें",
    tensionCracksCheck: "ढलान पर स्पष्ट दरारें देखी गईं",
    roadBlockedCheck: "राजमार्ग / सड़क मार्ग अवरुद्ध",
    notesLabel: "टिप्पणी एवं विस्तृत विवरण:",
    submitReportBtn: "नियंत्रण कक्ष को रिपोर्ट भेजें",
    saveOfflineBtn: "ऑफ़लाइन कतार में सहेजें",
    submittingText: "एआई पाइपलाइन द्वारा प्रसंस्करण जारी...",

    activeAlertsTitle: "सक्रिय भूस्खलन चेतावनी एवं बुलेटिन",
    acknowledgeBtn: "चेतावनी स्वीकार करें",
    resolveBtn: "समाधान पूर्ण करें",
    popAffectedLabel: "प्रभावित जनसंख्या",
    threatenedRoadsLabel: "प्रभावित राजमार्ग",
    directivesLabel: "त्वरित सुरक्षा निर्देश",
    triggerScenarioBtn: "गंभीर आपदा परिदृश्य सक्रिय करें",

    weatherTelemetryTitle: "मौसम टेलीमेट्री एवं 24-घंटे भूस्खलन पूर्वानुमान",
    rainIntensity1h: "1-घंटे वर्षा दर",
    rainCumulative24h: "24-घंटे संचयी वर्षा",
    soilMoistureLabel: "मृदा नमी",
    antecedentRain72h: "72-घंटे पूर्व वर्षा",
    surfaceWindLabel: "सतही हवा",
    tempAndHumidityLabel: "तापमान एवं आर्द्रता",
  },
};
