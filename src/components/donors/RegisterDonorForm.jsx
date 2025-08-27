import React, { useState, useEffect } from 'react'
import { SignUpButton, SignedOut, useUser } from '@clerk/clerk-react'

const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
// Indian States & Union Territories
const regions = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
]

export default function RegisterDonorForm() {
  const [form, setForm] = useState({
    bloodGroup: '',
    region: '',
    joinBridge: true,
    dob: '',
    phone: '',
    pincode: '',
    district: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [savedRemote, setSavedRemote] = useState(false)
  const { isSignedIn, user } = useUser()

  // Prefill if user already has donorProfile metadata (public or unsafe)
  useEffect(() => {
    const existing = user?.publicMetadata?.donorProfile || user?.unsafeMetadata?.donorProfile
    if (isSignedIn && existing && !submitted) {
      const dp = existing
      setForm(f => ({
        ...f,
        bloodGroup: dp.bloodGroup || '',
        region: dp.region || '',
        joinBridge: dp.joinBridge !== undefined ? dp.joinBridge : true,
        dob: dp.dob || '',
        phone: dp.phone || '',
        pincode: dp.pincode || '',
        district: dp.district || ''
      }))
    }
  }, [isSignedIn, user, submitted])

  // Minimal offline pincode map; extend or replace with API lookup later
  const PINCODE_MAP = {
    '560001': { district: 'Bengaluru Urban', state: 'Karnataka' },
    '110001': { district: 'New Delhi', state: 'Delhi' },
    '400001': { district: 'Mumbai', state: 'Maharashtra' },
    '600001': { district: 'Chennai', state: 'Tamil Nadu' },
    '700001': { district: 'Kolkata', state: 'West Bengal' }
  }

  function validate(f) {
    const e = {}
    if(!f.bloodGroup) e.bloodGroup = 'Required'
    if(!f.region) e.region = 'Required'
  if(!f.dob) e.dob = 'Required'
    else if(new Date(f.dob) > new Date()) e.dob = 'Date cannot be in future'
  if(!f.phone) e.phone = 'Required'
  else if(!/^\+?[0-9]{7,15}$/.test(f.phone)) e.phone = 'Invalid format'
  if(!f.pincode) e.pincode = 'Required'
  else if(!/^[1-9][0-9]{5}$/.test(f.pincode)) e.pincode = 'Invalid PIN (6 digits)'
    return e
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(prev => {
      const next = { ...prev, [name]: val }
      if (name === 'pincode') {
        if (/^[1-9][0-9]{5}$/.test(val)) {
          const hit = PINCODE_MAP[val]
            if (hit) {
              next.district = hit.district
              if (!next.region) next.region = hit.state
            }
        } else {
          // optional: clear district if pincode invalid
          // next.district = ''
        }
      }
      return next
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    const eMap = validate(form)
    setErrors(eMap)
    if(Object.keys(eMap).length) return
    const payload = { ...form, completedAt: new Date().toISOString() }
    if (!isSignedIn) {
      localStorage.setItem('pendingRegistration', JSON.stringify(payload))
      setSubmitted(true)
      return
    }
    try {
      setSaving(true)
      await user.update({ unsafeMetadata: { 
        ...user.unsafeMetadata, 
        donorProfile: payload,
        role: user.unsafeMetadata?.role || user.publicMetadata?.role || 'User'
      }})
      setSavedRemote(true)
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to save donor profile to Clerk', err)
      setErrors(prev => ({ ...prev, remote: 'Failed to save online. Please retry.' }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">Donor Registration</h1>
      <p className="text-sm text-rose-700/80 mb-8">Provide a few details so we can personalize your dashboard once you create an account.</p>
      {!submitted && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">Blood Group<span className="text-rose-500">*</span></label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={onChange} className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${errors.bloodGroup ? 'border-rose-400' : 'border-rose-200'}`}> 
                <option value="">Select</option>
                {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
              </select>
              {errors.bloodGroup && <p className="text-xs text-rose-500 mt-1">{errors.bloodGroup}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">Region<span className="text-rose-500">*</span></label>
              <select name="region" value={form.region} onChange={onChange} className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${errors.region ? 'border-rose-400' : 'border-rose-200'}`}>
                <option value="">Select</option>
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-xs text-rose-500 mt-1">{errors.region}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">Date of Birth<span className="text-rose-500">*</span></label>
              <input type="date" name="dob" value={form.dob} onChange={onChange} className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${errors.dob ? 'border-rose-400' : 'border-rose-200'}`} />
              {errors.dob && <p className="text-xs text-rose-500 mt-1">{errors.dob}</p>}
              {form.dob && !errors.dob && (() => { const age = Math.floor((Date.now() - new Date(form.dob)) / (365.25*24*3600*1000)); return <p className="text-xs text-rose-600 mt-1">Age: {age} yrs</p> })()}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">Phone Number<span className="text-rose-500">*</span></label>
              <input type="tel" name="phone" placeholder="e.g. +15551234567" value={form.phone} onChange={onChange} className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${errors.phone ? 'border-rose-400' : 'border-rose-200'}`} />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">Pincode<span className="text-rose-500">*</span></label>
              <input type="text" name="pincode" maxLength={6} value={form.pincode} onChange={onChange} placeholder="e.g. 560001" className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 ${errors.pincode ? 'border-rose-400' : 'border-rose-200'}`} />
              {errors.pincode && <p className="text-xs text-rose-500 mt-1">{errors.pincode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">District</label>
              <input type="text" name="district" value={form.district} onChange={onChange} placeholder="Auto / enter manually" className="w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 border-rose-200" />
              {form.pincode && !form.district && /^[1-9][0-9]{5}$/.test(form.pincode) && <p className="text-[10px] text-rose-500 mt-1">No offline match, please type district.</p>}
            </div>
            <div className="flex items-start gap-3 pt-6 sm:pt-0">
              <input id="joinBridge" type="checkbox" name="joinBridge" checked={form.joinBridge} onChange={onChange} className="mt-1 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
              <label htmlFor="joinBridge" className="text-sm text-rose-700/90 leading-snug">Interested to join rapid response bridge for urgent matching</label>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 shadow disabled:opacity-60 disabled:cursor-not-allowed">{saving ? 'Saving...' : (isSignedIn ? 'Save Profile' : 'Save & Continue')}</button>
            <button type="button" onClick={() => setForm({ bloodGroup:'', region:'', joinBridge:true, dob:'', phone:'', pincode:'', district:'' })} className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200">Reset</button>
          </div>
          {errors.remote && <p className="text-xs text-rose-500 mt-2">{errors.remote}</p>}
        </form>
      )}
      {submitted && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-rose-50 ring-1 ring-rose-100 text-sm text-rose-700/90">
            {!isSignedIn && <><p className="font-medium mb-1">Details saved</p><p>Next create your account so we can attach these to your profile.</p></>}
            {isSignedIn && savedRemote && <><p className="font-medium mb-1">Profile saved.</p><p>You can update these details anytime.</p></>}
            {isSignedIn && !savedRemote && <><p className="font-medium mb-1">Attempted to save.</p><p className="text-rose-500">Please verify connectivity and retry if needed.</p></>}
          </div>
          <SignedOut>
            <SignUpButton mode="modal" afterSignUpUrl="/" afterSignInUrl="/">
              <button className="px-6 py-3 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-500 shadow">Create Account</button>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </div>
  )
}
