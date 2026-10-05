import { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  X, 
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  EmailTemplate, 
  getEmailTemplates, 
  saveEmailTemplates, 
  resetEmailTemplates, 
  renderTemplateText,
  initialEmailTemplates
} from '../lib/emailService';

export const initialTemplates = initialEmailTemplates;

const SAMPLE_INVOICE_DATA = {
  customer: 'Suresh Kumar (Kumar Wedding Gala)',
  id: 'INV-2026-001',
  event: 'Grand Wedding & Reception',
  date: '2026-08-27',
  invoiceDate: '2026-08-15',
  dueDate: '2026-08-20',
  hall: 'Crystal Ballroom & Royal Lawns',
  property: 'Grand Royal Jubilee Hills (GR-HYD)',
  amount: '2,50,000',
  balanceDue: '50,000',
  advancePaid: '2,00,000',
  pax: 350,
  email: 'suresh.kumar@weddinggala.in',
  phone: '+91 98450 12345',
  status: 'PENDING'
};

const AVAILABLE_PLACEHOLDERS = [
  { tag: '{customer}', desc: 'Customer / organization name' },
  { tag: '{id}', desc: 'Invoice ID (e.g. INV-2026-001)' },
  { tag: '{event}', desc: 'Event or function type' },
  { tag: '{date}', desc: 'Event date (YYYY-MM-DD)' },
  { tag: '{dueDate}', desc: 'Payment due date' },
  { tag: '{hall}', desc: 'Venue hall name' },
  { tag: '{property}', desc: 'Property / facility name' },
  { tag: '{amount}', desc: 'Total gross amount (₹)' },
  { tag: '{balanceDue}', desc: 'Outstanding balance amount (₹)' },
  { tag: '{advancePaid}', desc: 'Advance payment received (₹)' },
  { tag: '{pax}', desc: 'Guest pax capacity' },
  { tag: '{email}', desc: 'Customer email address' },
  { tag: '{phone}', desc: 'Customer phone number' },
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => getEmailTemplates());
  const [activeTemplateId, setActiveTemplateId] = useState<string | number>(templates[0]?.id || 'tpl-invoice');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const [formData, setFormData] = useState<{
    id: string | number;
    name: string;
    subject: string;
    body: string;
    category: string;
  }>({
    id: '',
    name: '',
    subject: '',
    body: '',
    category: 'invoice'
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Listen for cross-component template updates
    const handleUpdate = () => {
      const updated = getEmailTemplates();
      setTemplates(updated);
    };
    window.addEventListener('email-templates-updated', handleUpdate);
    return () => window.removeEventListener('email-templates-updated', handleUpdate);
  }, []);

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  const handleStartEdit = (template: EmailTemplate) => {
    setFormData({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category || 'invoice'
    });
    setIsEditing(true);
    setIsCreatingNew(false);
  };

  const handleStartCreate = () => {
    setFormData({
      id: `tpl-custom-${Date.now()}`,
      name: 'New Custom Template',
      subject: 'Invoice & Event Update: {id} for {customer}',
      body: 'Dear {customer},\n\nPlease find details for your event at {hall} on {date}.\n\nTotal Amount: ₹{amount}\nBalance Due: ₹{balanceDue}\nDue Date: {dueDate}\n\nWarm regards,\nGrand Horizon Management',
      category: 'invoice'
    });
    setIsEditing(true);
    setIsCreatingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      showToast('Please fill in all template fields');
      return;
    }

    let updated: EmailTemplate[];
    if (isCreatingNew) {
      const newTpl: EmailTemplate = {
        id: formData.id,
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        category: formData.category
      };
      updated = [...templates, newTpl];
      setActiveTemplateId(newTpl.id);
      showToast(`Created new email template "${newTpl.name}"`);
    } else {
      updated = templates.map(t => 
        t.id === formData.id 
          ? { ...t, name: formData.name.trim(), subject: formData.subject.trim(), body: formData.body.trim(), category: formData.category } 
          : t
      );
      showToast(`Updated template "${formData.name}"`);
    }

    setTemplates(updated);
    saveEmailTemplates(updated);
    setIsEditing(false);
    setIsCreatingNew(false);
  };

  const handleDelete = (templateId: string | number, name: string) => {
    if (templates.length <= 1) {
      showToast('Cannot delete the last remaining template');
      return;
    }
    const updated = templates.filter(t => t.id !== templateId);
    setTemplates(updated);
    saveEmailTemplates(updated);
    if (activeTemplateId === templateId) {
      setActiveTemplateId(updated[0].id);
    }
    showToast(`Deleted template "${name}"`);
  };

  const handleResetDefaults = () => {
    const defaults = resetEmailTemplates();
    setTemplates(defaults);
    setActiveTemplateId(defaults[0].id);
    setIsEditing(false);
    showToast('Reset email templates to system defaults');
  };

  const insertPlaceholder = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      body: prev.body + ` ${tag} `
    }));
  };

  const insertSubjectPlaceholder = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      subject: prev.subject + ` ${tag}`
    }));
  };

  return (
    <div className="h-full w-full bg-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col font-sans overflow-hidden">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-200/90 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Email Dispatch Templates & Rules</h2>
            <p className="text-[11px] text-slate-500 font-medium">Configure automated PDF invoice email templates with dynamic customer merge fields</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Reset to default company templates"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border border-slate-700 cursor-pointer"
          >
            <Plus size={14} />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Template List & Right Detail / Editor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: Template Cards List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-slate-200/90 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <FileText size={13} className="text-amber-500" /> Configured Templates ({templates.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {templates.map(tpl => {
              const isSelected = tpl.id === activeTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setActiveTemplateId(tpl.id);
                    if (isEditing) setIsEditing(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-400 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{tpl.name}</h4>
                    </div>
                    <span className="text-[9.5px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                      {tpl.category || 'general'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono line-clamp-1 mb-1.5">
                    Subject: {tpl.subject}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10.5px]">
                    <span className="text-slate-400 font-medium">Attached: PDF Invoice</span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(tpl);
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Template"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tpl.id, tpl.name);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Template Preview or Active Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-slate-200/90 flex flex-col overflow-hidden">
          {isEditing ? (
            /* Editing / Creation Form */
            <form onSubmit={handleSaveForm} className="flex-1 flex flex-col p-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Edit2 size={14} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {isCreatingNew ? 'Create New Email Template' : `Edit Template: ${formData.name}`}
                    </h3>
                    <p className="text-[10.5px] text-slate-500">Define dynamic tokens that populate with customer & invoice data</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Official Tax Invoice Dispatch"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Template Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="invoice">Invoice Dispatch</option>
                      <option value="reminder">Payment Reminder</option>
                      <option value="receipt">Payment Receipt / Cleared</option>
                      <option value="booking">Booking Confirmation</option>
                      <option value="notification">Staff Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600">
                      Email Subject Line *
                    </label>
                    <span className="text-[10px] text-slate-400">Tokens supported (e.g. &#123;id&#125;, &#123;customer&#125;)</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Tax Invoice {id} for your event at {hall} - Grand Horizon"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Placeholders Quick Insertion Toolbar */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>Click to Insert Placeholders:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_PLACEHOLDERS.map(p => (
                      <button
                        type="button"
                        key={p.tag}
                        onClick={() => insertPlaceholder(p.tag)}
                        title={p.desc}
                        className="bg-white hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 text-[10px] font-mono font-bold transition-all shadow-2xs"
                      >
                        {p.tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Body Textarea */}
                <div className="flex-1 flex flex-col min-h-[160px]">
                  <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Email Body Content *
                  </label>
                  <textarea
                    required
                    value={formData.body}
                    onChange={e => setFormData({ ...formData, body: e.target.value })}
                    rows={9}
                    placeholder="Write email body with {placeholders}..."
                    className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-sans leading-relaxed focus:outline-none focus:border-amber-500 resize-none font-medium"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check size={14} />
                  <span>{isCreatingNew ? 'Create Template' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Live Template Inspector & Sample Resolution Preview */
            activeTemplate && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header info */}
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">{activeTemplate.name}</h3>
                      <span className="text-[9.5px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300/60">
                        {activeTemplate.category || 'invoice'}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                      Subject: {activeTemplate.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(activeTemplate)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-extrabold shadow-xs cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit Template</span>
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {/* Live Rendered Preview Banner */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-extrabold">
                        <Eye size={14} />
                        <span>Live Resolved Customer Preview (Using {SAMPLE_INVOICE_DATA.id})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        Recipient: {SAMPLE_INVOICE_DATA.email}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono text-[11px] block">Subject:</span>
                        <div className="text-amber-200 font-bold">
                          {renderTemplateText(activeTemplate.subject, SAMPLE_INVOICE_DATA)}
                        </div>
                      </div>

                      {/* PDF Attachment badge in preview */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                        <span className="text-slate-400 text-[10.5px]">Attachment:</span>
                        <div className="inline-flex items-center gap-1 bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg text-[10.5px] font-mono border border-slate-700">
                          <FileText size={12} />
                          <span>Invoice_{SAMPLE_INVOICE_DATA.id}_Suresh_Kumar.pdf (~18 KB)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resolved Body Text */}
                  <div>
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Resolved Message Body
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line font-medium shadow-inner">
                      {renderTemplateText(activeTemplate.body, SAMPLE_INVOICE_DATA)}
                    </div>
                  </div>

                  {/* Raw Template Source */}
                  <div>
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <HelpCircle size={12} />
                      <span>Raw Template Source Definition</span>
                    </h4>
                    <pre className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-[10.5px] text-slate-600 font-mono overflow-x-auto whitespace-pre-wrap">
                      {activeTemplate.body}
                    </pre>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
