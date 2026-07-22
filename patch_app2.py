import re

path = r'C:\Users\jifraf\Desktop\medikal\jifraf-medical-ui\src\JifrafMedicalApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'LearningReviewDashboard' not in content:
    content = content.replace(
        "import React, { useState, useEffect, useRef, useCallback } from 'react';",
        "import React, { useState, useEffect, useRef, useCallback } from 'react';\nimport { LearningReviewDashboard } from './learning/LearningReviewDashboard';"
    )

# Add tab button (must find exactly the end of the recentLogs button)
target_button_end = '''                  {modalTab === 'recentLogs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>}
                </button>'''

new_button = '''
                <button 
                  onClick={() => setModalTab('learningDashboard')}
                  className={pb-2.5 text-xs font-bold uppercase tracking-wider transition relative }
                >
                  Öğrenme Durum Paneli
                  {modalTab === 'learningDashboard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>}
                </button>'''

if 'learningDashboard' not in content.split(target_button_end)[1][:500]:
    content = content.replace(target_button_end, target_button_end + new_button)

# Add tab content
target_content_start = '''                {/* 3. LOGS AND RECENTLY UPLOADED LIST */}
                {modalTab === 'recentLogs' && ('''

new_content = '''                {/* 4. LEARNING DASHBOARD */}
                {modalTab === 'learningDashboard' && (
                  <LearningReviewDashboard />
                )}
                
'''

if 'LEARNING DASHBOARD' not in content:
    content = content.replace(target_content_start, new_content + target_content_start)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
