import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Globe, CreditCard, FileText, MapPin, Image } from 'lucide-react';

const PersonalInfo = ({ data, updateData }) => {
  const [signaturePreview, setSignaturePreview] = useState(data.signature_image || null);

  useEffect(() => {
    if (data.signature_image && !signaturePreview) {
      setSignaturePreview(data.signature_image);
    }
  }, [data.signature_image, signaturePreview]);

  const handleChange = (field, value) => {
    updateData('personal', { [field]: value });
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSignaturePreview(base64String);
        updateData('personal', { signature_image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Father's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.father_name}
              onChange={(e) => handleChange('father_name', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter father's name"
              required
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={data.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={data.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter nationality"
              required
            />
          </div>
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Religion *
          </label>
          <input
            type="text"
            value={data.religion || ''}
            onChange={(e) => handleChange('religion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter religion"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* PAN Card */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Card Number *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.pan_card || ''}
              onChange={(e) => handleChange('pan_card', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter PAN card number"
              required
            />
          </div>
        </div>

        {/* Aadhar Card */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhar Card Number *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.aadhar_card || ''}
              onChange={(e) => handleChange('aadhar_card', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter Aadhar card number"
              required
            />
          </div>
        </div>

        {/* DIN (Director Identification Number) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DIN (Director Identification Number)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.din || ''}
              onChange={(e) => handleChange('din', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter DIN (if applicable)"
            />
          </div>
        </div>

        {/* Passport Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Number
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.passport_no || ''}
              onChange={(e) => handleChange('passport_no', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter passport number"
            />
          </div>
        </div>

        {/* Passport Issue Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Issue Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={data.passport_issue_date || ''}
              onChange={(e) => handleChange('passport_issue_date', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Passport Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Expiry Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={data.passport_expiry_date || ''}
              onChange={(e) => handleChange('passport_expiry_date', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Signature Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature Image
          </label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {signaturePreview && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Signature Preview:</p>
              <img 
                src={signaturePreview} 
                alt="Signature preview" 
                className="max-w-xs max-h-32 border border-gray-300 rounded"
              />
            </div>
          )}
          {data.signature_image && !signaturePreview && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Signature Preview:</p>
              <img 
                src={data.signature_image} 
                alt="Signature preview" 
                className="max-w-xs max-h-32 border border-gray-300 rounded"
              />
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Upload a clear image of your signature. This will be inserted wherever signature is required in the forms.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All personal details are required for form processing and background verification.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;