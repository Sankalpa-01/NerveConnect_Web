'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Calendar, User, Building, Phone, Mail, Clock, CheckCircle, Star } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  practiceSize: string;
  currentSystem: string;
  primaryGoal: string;
  preferredTime: string;
  timezone: string;
}

const DemoScheduler: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    practiceSize: '',
    currentSystem: '',
    primaryGoal: '',
    preferredTime: '',
    timezone: 'America/New_York'
  });

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Practice Details', icon: Building },
    { title: 'Schedule Preferences', icon: Calendar }
  ];

  const practiceRoles = [
    'Physician', 'Practice Manager', 'Administrator', 
    'IT Director', 'Nurse Practitioner', 'Other'
  ];

  const practiceSizes = [
    'Solo Practice (1 provider)', 
    'Small Practice (2-5 providers)', 
    'Medium Practice (6-15 providers)', 
    'Large Practice (16+ providers)',
    'Hospital/Health System'
  ];

  const currentSystems = [
    'Epic', 'Cerner', 'AllScripts', 'eClinicalWorks', 
    'NextGen', 'athenahealth', 'Paper-based', 'Other'
  ];

  const primaryGoals = [
    'Improve Patient Care Quality',
    'Reduce Administrative Burden',
    'Enhance Practice Efficiency',
    'Better Financial Management',
    'Streamline Workflows',
    'Improve Patient Experience'
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'
  ];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 1:
        return !!(formData.organization && formData.role && formData.practiceSize);
      case 2:
        return !!(formData.primaryGoal && formData.preferredTime);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitted(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get to know you</h2>
              <p className="text-gray-600">Tell us a bit about yourself to personalize your demo experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">About your practice</h2>
              <p className="text-gray-600">Help us understand your practice to tailor the perfect demo</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => updateFormData('organization', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Your practice or organization name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Role</label>
              <select
                value={formData.role}
                onChange={(e) => updateFormData('role', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select your role</option>
                {practiceRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Practice Size</label>
              <select
                value={formData.practiceSize}
                onChange={(e) => updateFormData('practiceSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select practice size</option>
                {practiceSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Current System (Optional)</label>
              <select
                value={formData.currentSystem}
                onChange={(e) => updateFormData('currentSystem', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select current system</option>
                {currentSystems.map(system => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule your demo</h2>
              <p className="text-gray-600">Choose your preferred time and let us know your main goal</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Primary Goal</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {primaryGoals.map(goal => (
                  <button
                    key={goal}
                    onClick={() => updateFormData('primaryGoal', goal)}
                    className={`p-3 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      formData.primaryGoal === goal
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Star className={`w-4 h-4 ${formData.primaryGoal === goal ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Preferred Time Slot</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => updateFormData('preferredTime', time)}
                    className={`p-3 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      formData.preferredTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${formData.preferredTime === time ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">Demo Duration: 30 minutes</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Our team will contact you within 24 hours to confirm the exact date and provide meeting details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-500">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Demo Scheduled!</h2>
            <p className="text-gray-600">
              Thank you, {formData.firstName}! We'll contact you within 24 hours to confirm your demo.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">What to expect:</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Personalized demo based on your practice needs</li>
              <li>• Q&A session with our product experts</li>
              <li>• Implementation timeline discussion</li>
              <li>• Custom pricing information</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                organization: '', role: '', practiceSize: '', currentSystem: '',
                primaryGoal: '', preferredTime: '', timezone: 'America/New_York'
              });
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
          >
            Schedule Another Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-16 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            disabled={!validateStep(currentStep)}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              validateStep(currentStep)
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === steps.length - 1 ? 'Schedule Demo' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoScheduler;