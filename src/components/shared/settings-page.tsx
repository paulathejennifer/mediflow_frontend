'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Lock, Eye, EyeOff, Save, Check } from 'lucide-react'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  facility?: string
  role: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    facility: 'Central Medical Center',
    role: 'Super Admin'
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleProfileSave = async () => {
    setProfileSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setProfileSaveStatus('saved')
      setIsEditing(false)
      
      // Reset status after 2 seconds
      setTimeout(() => setProfileSaveStatus('idle'), 2000)
    } catch (error) {
      setProfileSaveStatus('error')
      setTimeout(() => setProfileSaveStatus('idle'), 2000)
    }
  }

  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  const clearPasswordError = (field: keyof PasswordData) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      if (newErrors[field]) {
        newErrors[field] = ''
      }
      return newErrors
    })
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Current password validation
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    // New password validation
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    }
    
    // Confirm password validation
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required'
    }
    
    // Password match validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Password requirements validation
    if (passwordData.newPassword) {
      const requirements = getPasswordRequirements(passwordData.newPassword)
      if (!requirements.minLength) newErrors.newPassword = 'Password must be at least 8 characters'
      else if (!requirements.hasUpper) newErrors.newPassword = 'Password must contain at least one uppercase letter'
      else if (!requirements.hasLower) newErrors.newPassword = 'Password must contain at least one lowercase letter'
      else if (!requirements.hasNumber) newErrors.newPassword = 'Password must contain at least one number'
      else if (!requirements.hasSpecial) newErrors.newPassword = 'Password must contain at least one special character'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    setPasswordSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPasswordSaveStatus('saved')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      
      // Reset status after 2 seconds
      setTimeout(() => setPasswordSaveStatus('idle'), 2000)
    } catch (error) {
      setPasswordSaveStatus('error')
      setTimeout(() => setPasswordSaveStatus('idle'), 2000)
    }
  }

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    clearPasswordError(field)
  }

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile information and security settings
          </p>
        </div>
      </div>

      {/* Tabs Card */}
      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-0">
              <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-300">
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">First Name</label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Last Name</label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Phone</label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Facility</label>
                  <Input
                    value={profile.facility || ''}
                    onChange={(e) => handleProfileChange('facility', e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Role</label>
                  <Input
                    value={profile.role}
                    disabled
                    className="bg-gray-800 border-gray-700 opacity-50 rounded-lg text-white"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-300">
                    {profileSaveStatus === 'saved' && (
                      <span className="flex items-center text-green-500">
                        <Check className="h-4 w-4 mr-1" />
                        Profile updated successfully
                      </span>
                    )}
                    {profileSaveStatus === 'error' && (
                      <span className="text-red-500">Failed to update profile</span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleProfileSave}
                          disabled={profileSaveStatus === 'saving'}
                          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 rounded-lg"
                        >
                          {profileSaveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setProfileSaveStatus('idle')
                          }}
                          className="border-none bg-transparent text-gray-400 hover:bg-bg-transparent hover:text-white rounded-lg"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary/90 text-primary-foreground hover:bg-primary/80 rounded-lg"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                        className="bg-gray-800 border-gray-700 pr-10 rounded-lg text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 hover:bg-transparent"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        placeholder="Enter new password"
                        className="bg-gray-800 border-gray-700 pr-10 rounded-lg text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 hover:bg-transparent"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {/* Real-time password requirements */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        <span className={`mr-2 ${getPasswordRequirements(passwordData.newPassword).minLength ? 'text-primary' : 'text-gray-600'}`}>
                          {getPasswordRequirements(passwordData.newPassword).minLength ? '✓' : '○'}
                        </span>
                        <span className={`${getPasswordRequirements(passwordData.newPassword).minLength ? 'text-primary' : 'text-gray-400'}`}>At least 8 characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`mr-2 ${getPasswordRequirements(passwordData.newPassword).hasUpper ? 'text-primary' : 'text-gray-600'}`}>
                          {getPasswordRequirements(passwordData.newPassword).hasUpper ? '✓' : '○'}
                        </span>
                        <span className={`${getPasswordRequirements(passwordData.newPassword).hasUpper ? 'text-primary' : 'text-gray-400'}`}>One uppercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`mr-2 ${getPasswordRequirements(passwordData.newPassword).hasLower ? 'text-primary' : 'text-gray-600'}`}>
                          {getPasswordRequirements(passwordData.newPassword).hasLower ? '✓' : '○'}
                        </span>
                        <span className={`${getPasswordRequirements(passwordData.newPassword).hasLower ? 'text-primary' : 'text-gray-400'}`}>One lowercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`mr-2 ${getPasswordRequirements(passwordData.newPassword).hasNumber ? 'text-primary' : 'text-gray-600'}`}>
                          {getPasswordRequirements(passwordData.newPassword).hasNumber ? '✓' : '○'}
                        </span>
                        <span className={`${getPasswordRequirements(passwordData.newPassword).hasNumber ? 'text-primary' : 'text-gray-400'}`}>One number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`mr-2 ${getPasswordRequirements(passwordData.newPassword).hasSpecial ? 'text-primary' : 'text-gray-600'}`}>
                          {getPasswordRequirements(passwordData.newPassword).hasSpecial ? '✓' : '○'}
                        </span>
                        <span className={`${getPasswordRequirements(passwordData.newPassword).hasSpecial ? 'text-primary' : 'text-gray-400'}`}>One special character</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-gray-800 border-gray-700 pr-10 rounded-lg text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 hover:bg-transparent"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-300">
                    {passwordSaveStatus === 'saved' && (
                      <span className="flex items-center text-green-500">
                        <Check className="h-4 w-4 mr-1" />
                        Password updated successfully
                      </span>
                    )}
                    {passwordSaveStatus === 'error' && (
                      <span className="text-red-500">Failed to update password</span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={passwordSaveStatus === 'saving' || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="bg-primary/90 text-primary-foreground hover:bg-primary/80 rounded-lg"
                    >
                      {passwordSaveStatus === 'saving' ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
