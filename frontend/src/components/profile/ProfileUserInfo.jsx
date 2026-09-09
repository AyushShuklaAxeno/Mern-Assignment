import { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';

export const ProfileUserInfo = () => {
    const { user, updateProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    if (!user) return null;

    const handleStartEdit = () => {
        setName(user.name || '');
        setPhone(user.phone || '');
        setStatusMessage({ type: '', text: '' });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setName(user.name || '');
        setPhone(user.phone || '');
        setStatusMessage({ type: '', text: '' });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        const trimmedName = name.trim();
        if (trimmedName.length < 3 || trimmedName.length > 20) {
            setStatusMessage({ type: 'error', text: 'Name must be between 3 and 20 characters.' });
            return;
        }

        const trimmedPhone = phone.trim();
        if (trimmedPhone && !/^\+?[0-9]{7,15}$/.test(trimmedPhone)) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid phone number.' });
            return;
        }

        try {
            setSaving(true);
            await updateProfile({ name: trimmedName, phone: trimmedPhone });
            setStatusMessage({ type: 'success', text: 'Profile updated' });
            setIsEditing(false);
        } catch (err) {
            setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="profile-card">
            <div className="profile-card__header">
                <h2 className="profile-card__title">Personal Info</h2>
                {!isEditing && (
                    <button
                        type="button"
                        className="profile-btn-action"
                        onClick={handleStartEdit}
                    >
                        Edit
                    </button>
                )}
            </div>

            {statusMessage.text && (
                <div className={`profile-msg profile-msg--${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            {!isEditing ? (
                <div className="profile-info-list">
                    <div className="profile-info-item">
                        <span className="profile-info-item__label">Name</span>
                        <span className="profile-info-item__value">{user.name}</span>
                    </div>

                    <div className="profile-info-item">
                        <span className="profile-info-item__label">Email</span>
                        <span className="profile-info-item__value">{user.email}</span>
                    </div>

                    <div className="profile-info-item">
                        <span className="profile-info-item__label">Phone</span>
                        <span className="profile-info-item__value">
                            {user.phone || 'Not added'}
                        </span>
                    </div>
                </div>
            ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="profile-field">
                        <label htmlFor="profileName" className="profile-field__label">
                            Name
                        </label>
                        <input
                            id="profileName"
                            type="text"
                            className="profile-field__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    <div className="profile-field">
                        <label htmlFor="profilePhone" className="profile-field__label">
                            Phone
                        </label>
                        <input
                            id="profilePhone"
                            type="tel"
                            className="profile-field__input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                        />
                    </div>

                    <div className="profile-edit-form__actions">
                        <button
                            type="button"
                            className="profile-btn-outline"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="profile-btn-dark"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default ProfileUserInfo;
