import { useState } from 'react';
import { MapPin, Edit2, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';

export const ProfileAddress = () => {
    const { user, updateAddress } = useAuth();

    const savedAddress = user?.address;
    const hasAddress = Boolean(
        savedAddress?.street &&
        savedAddress?.city &&
        savedAddress?.state &&
        savedAddress?.country &&
        savedAddress?.zip
    );

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        street: savedAddress?.street || '',
        city: savedAddress?.city || '',
        state: savedAddress?.state || '',
        country: savedAddress?.country || 'India',
        zip: savedAddress?.zip || '',
    });
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const handleStartEdit = () => {
        setFormData({
            street: savedAddress?.street || '',
            city: savedAddress?.city || '',
            state: savedAddress?.state || '',
            country: savedAddress?.country || 'India',
            zip: savedAddress?.zip || '',
        });
        setStatusMessage({ type: '', text: '' });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            street: savedAddress?.street || '',
            city: savedAddress?.city || '',
            state: savedAddress?.state || '',
            country: savedAddress?.country || 'India',
            zip: savedAddress?.zip || '',
        });
        setStatusMessage({ type: '', text: '' });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        const { street, city, state, country, zip } = formData;
        if (!street.trim() || !city.trim() || !state.trim() || !country.trim() || !zip.trim()) {
            setStatusMessage({ type: 'error', text: 'All address fields are required.' });
            return;
        }

        try {
            setSaving(true);
            await updateAddress({
                street: street.trim(),
                city: city.trim(),
                state: state.trim(),
                country: country.trim(),
                zip: zip.trim(),
            });
            setStatusMessage({ type: 'success', text: 'Address saved' });
            setIsEditing(false);
        } catch (err) {
            setStatusMessage({ type: 'error', text: err.message || 'Failed to save address' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="profile-card">
            <div className="profile-card__header">
                <div className="profile-card__title-group">
                    <div className="profile-card__icon-wrap">
                        <MapPin size={18} />
                    </div>
                    <h2 className="profile-card__title">Delivery Address</h2>
                </div>
                {!isEditing && hasAddress && (
                    <button
                        type="button"
                        className="profile-btn-action"
                        onClick={handleStartEdit}
                    >
                        <Edit2 size={13} />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            {statusMessage.text && (
                <div className={`profile-msg profile-msg--${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            {!isEditing ? (
                hasAddress ? (
                    <div className="profile-address-box">
                        <p className="profile-address-box__street">{savedAddress.street}</p>
                        <p className="profile-address-box__city">
                            {savedAddress.city}, {savedAddress.state} {savedAddress.zip}
                        </p>
                        <p className="profile-address-box__country">{savedAddress.country}</p>
                    </div>
                ) : (
                    <div className="profile-address-empty">
                        <p>No address saved</p>
                        <button
                            type="button"
                            className="profile-btn-action"
                            onClick={handleStartEdit}
                        >
                            + Add Address
                        </button>
                    </div>
                )
            ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="profile-field">
                        <label htmlFor="addrStreet" className="profile-field__label">
                            Street Address
                        </label>
                        <input
                            id="addrStreet"
                            name="street"
                            type="text"
                            className="profile-field__input"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Street, apartment, suite"
                        />
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field">
                            <label htmlFor="addrCity" className="profile-field__label">
                                City
                            </label>
                            <input
                                id="addrCity"
                                name="city"
                                type="text"
                                className="profile-field__input"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="addrState" className="profile-field__label">
                                State
                            </label>
                            <input
                                id="addrState"
                                name="state"
                                type="text"
                                className="profile-field__input"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="profile-field-row">
                        <div className="profile-field">
                            <label htmlFor="addrZip" className="profile-field__label">
                                PIN Code
                            </label>
                            <input
                                id="addrZip"
                                name="zip"
                                type="text"
                                className="profile-field__input"
                                value={formData.zip}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="addrCountry" className="profile-field__label">
                                Country
                            </label>
                            <input
                                id="addrCountry"
                                name="country"
                                type="text"
                                className="profile-field__input"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
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

export default ProfileAddress;
