const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); navToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), {threshold: .12});
document.querySelectorAll('.reveal, .capability-card, .timeline-item, .project-card, .idea-card, .skill-block').forEach(el => {
  el.classList.add('reveal'); observer.observe(el);
});

const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
document.querySelectorAll('.read-more').forEach(button => button.addEventListener('click', () => {
  modalTitle.textContent = button.dataset.title;
  modalText.textContent = button.dataset.text;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}));
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// Local CV upload. The file stays in this browser and can be replaced at any time.
const cvUpload = document.getElementById('cvUpload');
const cvDownload = document.getElementById('cvDownload');
const cvContactLabel = document.getElementById('cvContactLabel');
let cvUrl = null;
cvUpload?.addEventListener('change', () => {
  const file = cvUpload.files?.[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { alert('Please upload your CV as a PDF.'); cvUpload.value = ''; return; }
  if (cvUrl) URL.revokeObjectURL(cvUrl);
  cvUrl = URL.createObjectURL(file);
  cvDownload.href = cvUrl; cvDownload.download = file.name; cvDownload.textContent = 'Download CV';
  cvContactLabel.textContent = `Download ${file.name} ↗`;
  cvDownload.dataset.ready = 'true';
});
cvDownload?.addEventListener('click', e => {
  if (!cvDownload.dataset.ready) { e.preventDefault(); document.getElementById('cvUpload')?.click(); }
});

// Add project information and a supporting file to the local portfolio library.
const projectForm = document.getElementById('projectForm');
const addedProjects = document.getElementById('addedProjects');
const clearProjects = document.getElementById('clearProjects');
const STORAGE_KEY = 'olubunmiPortfolioProjects';
let projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
function escapeHtml(value='') { return value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function renderProjects(){
  if (!projects.length) { addedProjects.innerHTML = '<p class="empty-state">No additional projects yet. Add your first one using the form.</p>'; return; }
  addedProjects.innerHTML = projects.map((p,i) => `<article class="added-project"><div><span>${escapeHtml(p.type || 'PROJECT')}</span><h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.description)}</p>${p.fileName ? `<small>Attachment: ${escapeHtml(p.fileName)}</small>` : ''}</div><button type="button" data-remove="${i}" aria-label="Remove project">×</button></article>`).join('');
  addedProjects.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => { projects.splice(Number(btn.dataset.remove),1); localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); renderProjects(); }));
}
projectForm?.addEventListener('submit', e => {
  e.preventDefault();
  const file = document.getElementById('projectFile').files?.[0];
  projects.unshift({title: document.getElementById('projectTitle').value.trim(), type: document.getElementById('projectType').value.trim(), description: document.getElementById('projectDescription').value.trim(), fileName: file?.name || ''});
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  projectForm.reset(); renderProjects();
});
clearProjects?.addEventListener('click', () => { if (projects.length && confirm('Clear all projects added in this browser?')) { projects=[]; localStorage.removeItem(STORAGE_KEY); renderProjects(); } });
renderProjects();
