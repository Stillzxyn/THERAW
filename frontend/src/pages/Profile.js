import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ token, user, darkMode }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    label: 'other',
    isDefault: false
  });

  const colors = {
    bg: darkMode ? '#0f0f0f' : '#fff',
    text: darkMode ? '#fff' : '#000',
    textLight: darkMode ? '#999' : '#999',
    border: darkMode ? '#333' : '#f0f0f0',
    imageBg: darkMode ? '#1a1a1a' : '#f9f9f9',
    errorBg: darkMode ? '#331111' : '#ffebee',
    errorText: darkMode ? '#ff6b6b' : '#d32f2f',
    successBg: darkMode ? '#1a3a1a' : '#f0f0f0',
    successText: darkMode ? '#66bb6a' : '#000'
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch (err) {
      console.log('No addresses found');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await axios.put(`/api/addresses/${editingAddressId}`, addressFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Address updated successfully!');
      } else {
        await axios.post('/api/addresses', addressFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Address saved successfully!');
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        label: 'other',
        isDefault: false
      });
      await fetchAddresses();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/api/addresses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Address deleted successfully!');
        await fetchAddresses();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.patch(`/api/addresses/${id}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Default address updated!');
      await fetchAddresses();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to set default address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressFormData({
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      label: address.label,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  if (loading) return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, transition: 'background-color 0.3s ease, color 0.3s ease' }}>Loading profile...</div>;
  if (error && activeTab === 'profile') return <div style={{ padding: '60px 50px', textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif', color: colors.errorText, backgroundColor: colors.bg, transition: 'background-color 0.3s ease' }}>{error}</div>;

  const inputStyle = {
    width: '100%',
    padding: '12px 10px',
    border: `1px solid ${colors.border}`,
    fontSize: '13px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: colors.text,
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: colors.textLight,
    marginBottom: '8px'
  };

  return (
    <div style={{
      padding: '60px 50px',
      backgroundColor: colors.bg,
      fontFamily: 'Helvetica, Arial, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '300',
        letterSpacing: '1px',
        color: colors.text,
        margin: '0 0 40px 0',
        textTransform: 'uppercase'
      }}>
        MY ACCOUNT
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '40px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '15px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'profile' ? `2px solid ${colors.text}` : 'none',
            fontSize: '12px',
            fontWeight: '400',
            letterSpacing: '0.5px',
            color: activeTab === 'profile' ? colors.text : colors.textLight,
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.3s'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          style={{
            padding: '15px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'addresses' ? `2px solid ${colors.text}` : 'none',
            fontSize: '12px',
            fontWeight: '400',
            letterSpacing: '0.5px',
            color: activeTab === 'addresses' ? colors.text : colors.textLight,
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.3s'
          }}
        >
          Saved Addresses
        </button>
      </div>

      {success && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.successBg,
          color: colors.successText,
          fontSize: '12px',
          marginBottom: '30px',
          letterSpacing: '0.5px'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.errorBg,
          color: colors.errorText,
          fontSize: '12px',
          marginBottom: '30px',
          letterSpacing: '0.5px'
        }}>
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          {!isEditing ? (
            <div style={{ maxWidth: '500px' }}>
              <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textLight, margin: '0 0 8px 0' }}>NAME</p>
                <p style={{ fontSize: '13px', fontWeight: '300', color: colors.text, margin: '0' }}>
                  {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.name || 'Not provided'}
                </p>
              </div>

              <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textLight, margin: '0 0 8px 0' }}>EMAIL</p>
                <p style={{ fontSize: '13px', fontWeight: '300', color: colors.text, margin: '0' }}>{profile?.email}</p>
              </div>

              <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textLight, margin: '0 0 8px 0' }}>PHONE</p>
                <p style={{ fontSize: '13px', fontWeight: '300', color: colors.text, margin: '0' }}>{profile?.phone?.number || profile?.phone || 'Not provided'}</p>
              </div>

              <div style={{ paddingBottom: '20px', marginBottom: '30px', borderBottom: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: colors.textLight, margin: '0 0 8px 0' }}>ADDRESS</p>
                <p style={{ fontSize: '13px', fontWeight: '300', color: colors.text, margin: '0', lineHeight: '1.6' }}>{profile?.address || 'Not provided'}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                style={{ padding: '15px 40px', backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                EDIT PROFILE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>First Name</label>
                <input type="text" value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Last Name</label>
                <input type="text" value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={formData.email || ''} disabled style={{ ...inputStyle, backgroundColor: colors.imageBg, color: colors.textLight }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={formData.phone?.number || ''} onChange={(e) => setFormData({ ...formData, phone: { ...formData.phone, number: e.target.value } })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>Address</label>
                <textarea value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows="4" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" style={{ padding: '15px 40px', backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>SAVE CHANGES</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '15px 40px', backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.border = `1px solid ${colors.text}`} onMouseLeave={(e) => e.target.style.border = `1px solid ${colors.border}`}>CANCEL</button>
              </div>
            </form>
          )}
        </>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div>
          {!showAddressForm ? (
            <div>
              <button
                onClick={() => {
                  setShowAddressForm(true);
                  setEditingAddressId(null);
                  setAddressFormData({ fullName: '', email: '', phone: '', address: '', city: '', province: '', postalCode: '', label: 'other', isDefault: false });
                }}
                style={{ padding: '15px 40px', backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '30px', transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                + ADD NEW ADDRESS
              </button>

              {addresses.length === 0 ? (
                <p style={{ color: colors.textLight, fontSize: '13px' }}>No saved addresses yet. Add one to get started!</p>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {addresses.map(address => (
                    <div key={address._id} style={{ border: `1px solid ${colors.border}`, padding: '20px', backgroundColor: address.isDefault ? colors.imageBg : 'transparent' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <h4 style={{ margin: '0', fontSize: '13px', fontWeight: '500', color: colors.text, textTransform: 'uppercase' }}>{address.fullName}</h4>
                            <span style={{ fontSize: '11px', color: colors.textLight, textTransform: 'uppercase', padding: '2px 8px', backgroundColor: colors.imageBg, borderRadius: '3px' }}>{address.label}</span>
                            {address.isDefault && <span style={{ fontSize: '11px', color: '#4caf50', fontWeight: '500', textTransform: 'uppercase' }}>DEFAULT</span>}
                          </div>
                          <p style={{ margin: '0', fontSize: '12px', color: colors.textLight, lineHeight: '1.5' }}>
                            {address.address}<br/>{address.city}, {address.province} {address.postalCode}<br/>{address.email}<br/>{address.phone}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEditAddress(address)} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.borderColor = colors.text} onMouseLeave={(e) => e.target.style.borderColor = colors.border}>Edit</button>
                        <button onClick={() => handleDeleteAddress(address._id)} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: colors.errorText, border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.borderColor = colors.errorText} onMouseLeave={(e) => e.target.style.borderColor = colors.border}>Delete</button>
                        {!address.isDefault && <button onClick={() => handleSetDefault(address._id)} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.border}`, fontSize: '11px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.borderColor = colors.text} onMouseLeave={(e) => e.target.style.borderColor = colors.border}>Set as Default</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveAddress} style={{ maxWidth: '500px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '400', letterSpacing: '0.5px', color: colors.text, margin: '0 0 30px 0', textTransform: 'uppercase' }}>{editingAddressId ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" value={addressFormData.fullName} onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })} required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={addressFormData.email} onChange={(e) => setAddressFormData({ ...addressFormData, email: e.target.value })} required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Phone *</label>
                <input type="tel" value={addressFormData.phone} onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })} required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Address *</label>
                <textarea value={addressFormData.address} onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })} required rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>City *</label>
                <input type="text" value={addressFormData.city} onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })} required style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Province *</label>
                  <input type="text" value={addressFormData.province} onChange={(e) => setAddressFormData({ ...addressFormData, province: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Postal Code *</label>
                  <input type="text" value={addressFormData.postalCode} onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })} required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Label</label>
                <select value={addressFormData.label} onChange={(e) => setAddressFormData({ ...addressFormData, label: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: '400', letterSpacing: '0.5px', color: colors.text, cursor: 'pointer' }}>
                  <input type="checkbox" checked={addressFormData.isDefault} onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })} style={{ marginRight: '10px', cursor: 'pointer' }} />
                  Set as default address
                </label>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" style={{ padding: '15px 40px', backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>{editingAddressId ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</button>
                <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} style={{ padding: '15px 40px', backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.borderColor = colors.text} onMouseLeave={(e) => e.target.style.borderColor = colors.border}>CANCEL</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
