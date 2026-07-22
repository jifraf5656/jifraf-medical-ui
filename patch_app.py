import re

path = r'C:\Users\jifraf\Desktop\medikal\jifraf-medical-ui\src\JifrafMedicalApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'LearningReviewDashboard' not in content:
    content = content.replace(
        "import React, { useState, useEffect, useRef } from 'react';",
        "import React, { useState, useEffect, useRef } from 'react';\nimport { LearningReviewDashboard } from './learning/LearningReviewDashboard';"
    )

# Add tab button
tab_btn = '''                  <button 
                    onClick={() => setModalTab('learningDashboard')}
                    className={pb-2.5 text-xs font-bold uppercase tracking-wider transition relative }
                  >
                    Öğrenme Durum Paneli
                    {modalTab === 'learningDashboard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>}
                  </button>
'''
if 'setModalTab(\'learningDashboard\')' not in content:
    content = content.replace(
        "</button>\n                </div>",
        f"</button>\n{tab_btn}                </div>"
    )

# Add tab content
tab_content = '''
                  {/* 4. LEARNING DASHBOARD */}
                  {modalTab === 'learningDashboard' && (
                    <LearningReviewDashboard />
                  )}
'''
if 'modalTab === \'learningDashboard\'' not in content:
    content = content.replace(
        "{/* Tabs Content */}",
        f"{{/* Tabs Content */}}{tab_content}"
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
