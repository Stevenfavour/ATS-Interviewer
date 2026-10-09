export default {
	candidateId() {
		return Number(appsmith.URL.queryParams.candidateId);
	},

	level() {
		return appsmith.URL.queryParams.level || 'L1';
	},

	candidate() {
		return getCandidate.data || {};
	},

	currentInterview() {
		const rows = getInterviewStageL1.data?.results || [];
		return rows[0] || null;
	},

	candidateName() {
		return this.candidate()['Full Name'] || '—';
	},

	role() {
		return this.candidate()['Role Applied']?.[0]?.value || '—';
	},

	skills() {
		return (this.candidate()['Skills'] || []).map(s => s.value).join(', ');
	},

	isOwner() {
		const iv = this.currentInterview();
		if (!iv || !iv.prepared_by) return true; // unclaimed, anyone can save
		return iv.prepared_by === appsmith.user.email;
	},

	canEdit() {
		return this.isOwner(); // extend later for admin override
	},

	recordingUrl() {
		return this.currentInterview()?.recording_url || '';
	},

	transcript() {
		return this.currentInterview()?.transcript_notes || '';
	},

	interviewerGrade() {
		return this.currentInterview()?.interviewer_grade_pct || '';
	},

	interviewerNotes() {
		return this.currentInterview()?.interviewer_notes || '';
	},

	aiGrade() {
		return this.currentInterview()?.ai_grade_pct || null;
	},

	aiStatus() {
		return this.currentInterview()?.ai_status?.value || 'not_graded';
	},

	decision() {
		return this.currentInterview()?.stage_action?.value || null;
	},

	stageLabel() {
		const d = this.decision();
		if (d === 'progress') return this.level() === 'L3' ? 'Cleared L3' : `Progressed to ${this.nextLevel()}`;
		if (d === 'reject') return `Rejected at ${this.level()}`;
		if (this.currentInterview()?.in_view_flag) return `${this.level()} · In view`;
		return `${this.level()} · In progress`;
	},

	nextLevel() {
		const levels = ['L1', 'L2', 'L3'];
		const i = levels.indexOf(this.level());
		return levels[i + 1] || 'L3';
	},

	hasDecision() {
		return !!this.decision();
	}
}