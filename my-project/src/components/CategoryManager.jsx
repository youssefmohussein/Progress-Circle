import { useState } from 'react';
import { Pencil, Trash2, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { toast } from 'sonner';

const COLORS = [
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'
];

export function CategoryManager({ open, onClose }) {
    const { categories, addCategory, updateCategory, deleteCategory } = useData();
    const [editCat, setEditCat] = useState(null);
    const [form, setForm] = useState({ name: '', color: COLORS[0], icon: 'Tag' });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Name is required');
        setSaving(true);
        try {
            if (editCat) {
                await updateCategory(editCat.id, form);
                toast.success('Category updated');
            } else {
                await addCategory(form);
                toast.success('Category created');
            }
            setEditCat(null);
            setForm({ name: '', color: COLORS[0], icon: 'Tag' });
        } catch (error) {
            toast.error('Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (cat) => {
        setEditCat(cat);
        setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category? Tasks using it will lose their category.')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted');
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Manage Categories">
            <div className="space-y-6">
                {/* Form */}
                <div className="pc-card bg-muted/10 space-y-3 p-4">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">
                        {editCat ? 'Edit Category' : 'New Category'}
                    </p>
                    <div className="flex gap-2">
                        <input
                            className="pc-input flex-1"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="University, Gym, Projects..."
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setForm({ ...form, color: c })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${form.color === c ? 'scale-110 border-indigo-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button className="flex-1" size="sm" onClick={handleSave} loading={saving}>
                            {editCat ? 'Update' : 'Add Category'}
                        </Button>
                        {editCat && (
                            <Button variant="secondary" size="sm" onClick={() => { setEditCat(null); setForm({ name: '', color: COLORS[0], icon: 'Tag' }); }}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.length === 0 ? (
                        <div className="text-center py-8">
                            <Tag className="mx-auto text-muted mb-2 opacity-20" size={32} />
                            <p className="text-xs text-muted">No custom categories yet</p>
                        </div>
                    ) : (
                        categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/50 group hover:border-indigo-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                                    <span className="text-sm font-semibold">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-muted hover:text-indigo-500 transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
}
