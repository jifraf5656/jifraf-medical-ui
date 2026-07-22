import re

path = r'C:\Users\jifraf\Desktop\medikal\jifraf-medical-ui\src\JifrafMedicalApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad_line = "                  className={pb-2.5 text-xs font-bold uppercase tracking-wider transition relative }"
good_line = """                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition relative ${
                    modalTab === 'learningDashboard' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}"""

content = content.replace(bad_line, good_line)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
