const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'tax-payment',
      'money-transfer',
      'government-schemes',
      'aadhaar-services',
      'voter-id',
      'ration-card',
      'form-filling',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed', 'cancelled'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  preferredDate: {
    type: Date
  }
}, { timestamps: true });

serviceRequestSchema.index({ status: 1, createdAt: -1 });
serviceRequestSchema.index({ phone: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
