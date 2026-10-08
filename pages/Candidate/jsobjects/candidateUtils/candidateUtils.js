export default {
  // Returns all interview rows for a given candidate id and level
  interviewFor(candidateId, level) {
    const rows = getInterviewRows.data?.results || [];
    return rows.find(r =>
      r.interview_key === `${candidateId}-${level}`
    ) || null;
  },

  // Highest level reached by a candidate
  currentLevel(candidateId) {
    const levels = ['L1', 'L2', 'L3'];
    for (let i = levels.length - 1; i >= 0; i--) {
      const row = this.interviewFor(candidateId, levels[i]);
      if (row) return levels[i];
    }
    return 'L1';
  },

  // Badge label for the candidate list
  stageLabel(candidateId) {
    const rows = getInterviewRows.data?.results || [];
    const all = rows.filter(r =>
      r.interview_key?.startsWith(`${candidateId}-`)
    );
    if (!all.length) return 'L1 · Not started';
    const cleared = all.find(r => r.stage_action?.value === 'progress' && r.stage_code?.value === 'L3');
    if (cleared) return 'Cleared L3';
    const rejected = all.find(r => r.stage_action?.value === 'reject');
    if (rejected) return `Rejected at ${rejected.stage_code?.value}`;
    const inView = all.find(r => r.in_view_flag);
    if (inView) return `${inView.stage_code?.value} · In view`;
    const latest = all[all.length - 1];
    return `${latest.stage_code?.value} · In progress`;
  },

  // List formatted for the Table widget
  tableData() {
    const candidates = getShortlisted.data?.results || [];
    return candidates.map(c => ({
      id: c.id,
      name: c['Full Name'],
      role: c['Role Applied']?.[0]?.value || '—',
      email: c['Email'],
      skills: (c['Skills'] || []).map(s => s.value).join(', '),
      experience: c['Years of Experience'] + ' yrs',
      stage: this.stageLabel(c.id)
    }));
  }
}