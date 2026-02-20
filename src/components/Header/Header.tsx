import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { login, register, getMe, logout } from '../../api/auth'
import type { AuthUser } from '../../api/auth'
import './Header.css'

interface HeaderProps {
  activeTab: 'home' | 'playlists' | 'favorites'
  searchQuery: string
  onSearchChange: (value: string) => void
  onGoHome: () => void
  onUserChange: (user: AuthUser | null) => void
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onGoHome,
  onUserChange,
}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const onUserChangeRef = useRef(onUserChange)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const isAuthorized = !!user
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    onUserChangeRef.current = onUserChange
  }, [onUserChange])

  // On mount, try to restore user from accessToken in localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return;
    
    (async () => {
      try {
        const me = await getMe(token)
        const restoredUser = {
          id: me.user.sub,
          email: me.user.email ?? '',
          username: me.user.username ?? '',
        }
        setUser(restoredUser)
        onUserChangeRef.current(restoredUser)
      } catch {
        // If getMe fails even after refresh attempt, user is not authenticated
        localStorage.removeItem('accessToken')
        setUser(null)
        onUserChangeRef.current(null)
      }
    })()
  }, [])

  const handleHomeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onGoHome()
  }

  const handleAuthClick = () => {
    
    if (!isAuthorized) {
      setAuthMode('login')
      setAuthError(null)
      setShowAuthModal(true)
      return
    }


    setShowProfileMenu((prev) => !prev)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error(e)
    } finally {
      setUser(null)
      onUserChange(null)
      localStorage.removeItem('accessToken')
      setShowProfileMenu(false)
      navigate('/')
    }
  }

  const handleProfileClick = () => {
    setShowProfileMenu(false)
    navigate('/profile')
  }

  const closeModal = () => {
    setEmail('')
    setPassword('')
    setUsername('')
    setAuthError(null)
    setShowAuthModal(false)
  }

  const handleSubmitAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter email and password')
      return
    }

    if (!emailRegex.test(email.trim())) {
      setAuthError('Please enter a valid email address')
      return
    }

    if (authMode === 'register' && !username.trim()) {
      setAuthError('Please enter username')
      return
    }

    try {
      setSubmitting(true)
      setAuthError(null)

      let data: { accessToken: string; user: AuthUser }
      if (authMode === 'login') {
        data = await login(email.trim(), password.trim())
      } else {
        data = await register(email.trim(), password.trim(), username.trim())
      }

      // Save accessToken to localStorage for future use
      console.log("Data:", data)
      localStorage.setItem('accessToken', data.accessToken)
      setUser(data.user)
      onUserChange(data.user)

      closeModal()
    } catch (e) {
      console.error(e)
      setAuthError(
        authMode === 'login'
          ? 'Failed to sign in. Please check your credentials.'
          : 'Failed to sign up. Please try a different email.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="main-header">
      <div className="main-header-left">
        <button
          type="button"
          className="home-button"
          onClick={handleHomeClick}
        >
          <span className="home-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Navigation / House_01">
                <path
                  d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        </button>

        
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="search-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 10.5C15 12.9853 12.9853 15 10.5 15C8.01472 15 6 12.9853 6 10.5C6 8.01472 8.01472 6 10.5 6C12.9853 6 15 8.01472 15 10.5ZM14.1793 15.2399C13.1632 16.0297 11.8865 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C13.8137 4.5 16.5 7.18629 16.5 10.5C16.5 11.8865 16.0297 13.1632 15.2399 14.1792L20.0304 18.9697L18.9697 20.0303L14.1793 15.2399Z"
                  fill="#ffffff"
                />
              </svg>
            </span>
          </div>
    
      </div>

      <div className="authorization-container">
        <button
          className="authorization-button"
          type="button"
          onClick={handleAuthClick}
        >
          <span className="authorization-icon">
          <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#1342]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]"> </path> </g> </g> </g> </g></svg>
          </span>
        </button>

        {isAuthorized && showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-menu-header">
              {user?.username || user?.email || 'Profile'}
            </div>
            <button
              type="button"
              className="profile-menu-item"
              onClick={handleProfileClick}
            >
              Profile
            </button>
            <button
              type="button"
              className="profile-menu-item logout"
              onClick={handleLogout}
              disabled={submitting}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {!isAuthorized && showAuthModal &&
        createPortal(
          <div className="auth-modal-backdrop" onClick={closeModal}>
            <div
              className="auth-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {isAuthorized ? (
                <>
                  <h2 className="auth-modal-title">Profile</h2>
                  <div className="auth-modal-buttons">
                    <button
                      type="button"
                      className="auth-modal-btn primary"
                      onClick={handleLogout}
                      disabled={submitting}
                    >
                      Log out
                    </button>
                    <button
                      type="button"
                      className="auth-modal-btn secondary"
                      onClick={closeModal}
                      disabled={submitting}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="auth-modal-title">Sign in or sign up</h2>
                  <p className="auth-modal-subtitle">
                    To continue, sign in to your account or create a new one.
                  </p>

                  <div className="auth-modal-fields">
                    {authMode === 'register' && (
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    )}
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      className="auth-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {authError && <div className="auth-error">{authError}</div>}

                  <div className="auth-modal-buttons">
                    <button
                      type="button"
                      className="auth-modal-btn primary"
                      onClick={handleSubmitAuth}
                      disabled={submitting}
                    >
                      {authMode === 'login' ? 'Sign in' : 'Sign up'}
                    </button>
                    <button
                      type="button"
                      className="auth-modal-btn secondary"
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'register' : 'login')
                        setAuthError(null)
                      }}
                      disabled={submitting}
                    >
                      {authMode === 'login' ? 'Create account' : 'I already have an account'}
                    </button>
                  </div>
                </>
              )}

              <button
                type="button"
                className="auth-modal-close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default Header
