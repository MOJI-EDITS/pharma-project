'use client';

import React, { useState } from 'react';
import { AlertCircle, X, CheckCircle2, MapPin } from 'lucide-react';

interface SymptomInputProps {
  onSubmit: (symptoms: string[], severity: 'mild' | 'moderate' | 'severe', duration: string, city?: string) => void;
  isLoading?: boolean;
}

const citiesWithDoctors = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
];

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Sore Throat',
  'Runny Nose',
  'Body Pain',
  'Fatigue',
  'Nausea',
  'Diarrhea',
  'Stomach Pain',
  'Skin Rash',
  'Itching',
  'Joint Pain',
  'Back Pain',
  'Allergy',
  'Sneezing',
  'Muscle Pain',
];

export default function SymptomInput({ onSubmit, isLoading }: SymptomInputProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [duration, setDuration] = useState('1-2 days');
  const [selectedCity, setSelectedCity] = useState<string>('Lahore');
  const [errors, setErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => {
      const isSelected = prev.includes(symptom);
      if (isSelected) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
    setErrors([]);
  };

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (!trimmed) return;
    
    if (selectedSymptoms.includes(trimmed)) {
      setErrors(['This symptom is already added']);
      return;
    }

    setSelectedSymptoms([...selectedSymptoms, trimmed]);
    setCustomSymptom('');
    setErrors([]);
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const validateAndSubmit = () => {
    const newErrors: string[] = [];

    if (selectedSymptoms.length === 0) {
      newErrors.push('Please select or enter at least one symptom');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    onSubmit(selectedSymptoms, severity, duration, selectedCity);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">📋 Describe Your Symptoms</h3>
        <p className="text-sm text-gray-600">
          Select your symptoms or type custom ones. Our AI will recommend appropriate medicines.
        </p>
      </div>

      {/* Common Symptoms Grid */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Common Symptoms</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonSymptoms.map(symptom => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {selectedSymptoms.includes(symptom) && <span className="mr-1">✓</span>}
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Symptom Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Add Custom Symptom</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSymptom}
            onChange={e => setCustomSymptom(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addCustomSymptom()}
            placeholder="e.g., Dizziness, Weakness..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomSymptom}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Selected Symptoms ({selectedSymptoms.length})</label>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptom => (
              <div
                key={symptom}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {symptom}
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Select Your City in Pakistan (For Doctor Recommendations)
        </label>
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          {citiesWithDoctors.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">We'll recommend doctors from your selected city in Pakistan</p>
      </div>

      {/* Severity Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Symptom Severity</label>
        <div className="grid grid-cols-3 gap-3">
          {(['mild', 'moderate', 'severe'] as const).map(level => (
            <button
              key={level}
              onClick={() => setSeverity(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                severity === level
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {level === 'mild' && '😊 Mild'}
              {level === 'moderate' && '😐 Moderate'}
              {level === 'severe' && '😟 Severe'}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">How Long Have You Had These Symptoms?</label>
        <div className="space-y-2">
          {[
            { value: 'Less than 24 hours', label: '< 24 hours' },
            { value: '1-2 days', label: '1-2 days' },
            { value: '3-7 days', label: '3-7 days' },
            { value: 'More than 7 days', label: '> 7 days' },
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="duration"
                value={option.value}
                checked={duration === option.value}
                onChange={e => setDuration(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {showValidation && errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((error, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Important Notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-800">
          <strong>⚠️ Disclaimer:</strong> This AI-powered recommendation system is not a substitute for professional medical advice. 
          Always consult a healthcare professional before taking any medication, especially if symptoms persist or worsen.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={validateAndSubmit}
        disabled={isLoading || selectedSymptoms.length === 0}
        className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all ${
          isLoading || selectedSymptoms.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Getting Recommendations...
          </div>
        ) : (
          '💊 Get AI Medicine Recommendations'
        )}
      </button>
    </div>
  );
}
