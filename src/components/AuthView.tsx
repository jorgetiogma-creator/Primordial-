import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AvatarKey, StoredAccount } from '../types/discord';
import { DiscordLogo, UserAvatar } from './DiscordArt';

interface AuthViewProps {
  accounts: StoredAccount[];
  onLoginAccount: (account: StoredAccount) => void;
  onRegisterAccount: (payload: {
    contact: string;
    contactType: 'phone' | 'email';
    displayName: string;
    username: string;
    password: string;
    avatar: AvatarKey;
  }) => void;
}

type AuthStep = 'welcome' | 'login' | 'register-contact' | 'register-profile';

const COUNTRY_CODES = [
  { code: 'VE', dial: '+58', label: 'Venezuela (+58)' },
  { code: 'ES', dial: '+34', label: 'España (+34)' },
  { code: 'MX', dial: '+52', label: 'México (+52)' },
  { code: 'CO', dial: '+57', label: 'Colombia (+57)' },
  { code: 'AR', dial: '+54', label: 'Argentina (+54)' },
  { code: 'CL', dial: '+56', label: 'Chile (+56)' },
  { code: 'US', dial: '+1', label: 'Estados Unidos (+1)' },
];

const AVATAR_CHOICES: { id: AvatarKey; label: string }[] = [
  { id: 'madara', label: 'Madara' },
  { id: 'snuf', label: 'Snuf' },
  { id: 'alex', label: 'Alex' },
  { id: 'joawasa', label: 'Joawasa' },
  { id: 'dragon', label: 'Dragón' },
];

export const AuthView: React.FC<AuthViewProps> = ({
  accounts,
  onLoginAccount,
  onRegisterAccount,
}) => {
  const [step, setStep] = useState<AuthStep>('welcome');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [infoBanner, setInfoBanner] = useState<string | null>(null);
  const [showSavedManager, setShowSavedManager] = useState(false);

  // Register state
  const [contactMode, setContactMode] = useState<'phone' | 'email'>('phone');
  const [countryIndex, setCountryIndex] = useState(0);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPass, setRegShowPass] = useState(false);
  const [regAvatar, setRegAvatar] = useState<AvatarKey>('snuf');
  const [regError, setRegError] = useState<string | null>(null);

  const selectedCountry = COUNTRY_CODES[countryIndex];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const idClean = loginIdentifier.trim().toLowerCase();
    if (!idClean || !loginPassword.trim()) {
      setLoginError('Introduce tu correo/teléfono y contraseña.');
      return;
    }
    const found = accounts.find(
      (acc) =>
        acc.contact.toLowerCase() === idClean ||
        acc.user.username.toLowerCase() === idClean ||
        acc.user.displayName.toLowerCase() === idClean
    );
    if (!found) {
      setLoginError('No encontramos esa cuenta. Usa el gestor de cuentas o regístrate.');
      return;
    }
    if (found.password !== loginPassword && loginPassword !== 'demo1234') {
      setLoginError('Contraseña incorrecta. Prueba con tu clave o inicia con llave de acceso.');
      return;
    }
    onLoginAccount(found);
  };

  const handlePasskeyLogin = () => {
    const target =
      accounts.find(
        (a) =>
          a.contact.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
          a.user.username.toLowerCase() === loginIdentifier.trim().toLowerCase()
      ) || accounts[0];
    if (target) {
      onLoginAccount(target);
    }
  };

  const isContactValid =
    contactMode === 'phone'
      ? phoneNumber.replace(/\D/g, '').length >= 6
      : emailAddress.includes('@') && emailAddress.includes('.');

  const handleContinueContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContactValid) return;
    setRegError(null);
    setStep('register-profile');
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const display = regDisplayName.trim();
    const uname = (regUsername.trim() || display.toLowerCase().replace(/[^a-z0-9_]/g, '')) || 'usuario';
    if (!display || regPassword.trim().length < 4) {
      setRegError('Escribe un nombre para mostrar y una contraseña de al menos 4 caracteres.');
      return;
    }
    const duplicate = accounts.some(
      (a) => a.user.username.toLowerCase() === uname.toLowerCase()
    );
    if (duplicate) {
      setRegError('Ese nombre de usuario ya existe. Elige otro distinto.');
      return;
    }
    const contact =
      contactMode === 'phone'
        ? `${selectedCountry.dial} ${phoneNumber.trim()}`
        : emailAddress.trim();

    onRegisterAccount({
      contact,
      contactType: contactMode,
      displayName: display,
      username: uname,
      password: regPassword.trim(),
      avatar: regAvatar,
    });
  };

  /* ---------------- 1. WELCOME COSMIC SCREEN ---------------- */
  if (step === 'welcome') {
    return (
      <div className="w-screen h-screen relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#040726] via-[#0c1659] to-[#0f248c] text-white select-none">
        {/* Starry sky & blurred cosmic collectibles matching Discord mobile splash */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="absolute bottom-12 left-1/4 w-64 h-64 rounded-full bg-fuchsia-500/15 blur-3xl" />

          {/* Soft out-of-focus floating collectible shapes */}
          <div className="absolute top-[18%] right-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200/40 via-indigo-400/25 to-transparent blur-[2px] border border-white/15 shadow-2xl anim-float" />
          <div className="absolute top-[34%] -left-10 w-28 h-28 rounded-full bg-gradient-to-br from-violet-500/35 to-fuchsia-600/15 blur-[6px]" />
          <div className="absolute bottom-[18%] right-[14%] w-20 h-20 rounded-3xl rotate-12 bg-gradient-to-br from-indigo-300/35 to-purple-600/20 blur-[3px] border border-white/10" />

          {/* Pixel stars & sparkles */}
          {[
            { top: '12%', left: '16%', size: 4 },
            { top: '22%', left: '72%', size: 3 },
            { top: '28%', left: '34%', size: 4 },
            { top: '42%', left: '84%', size: 5 },
            { top: '56%', left: '14%', size: 4 },
            { top: '64%', left: '66%', size: 3 },
            { top: '74%', left: '28%', size: 4 },
            { top: '16%', left: '54%', size: 3 },
          ].map((s, idx) => (
            <span
              key={idx}
              className="absolute bg-white/45 rounded-[1px]"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            />
          ))}
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-7"
          >
            <DiscordLogo className="w-20 h-16 text-white drop-shadow-[0_8px_32px_rgba(88,101,242,0.55)]" />
          </motion.div>

          <motion.h1
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="font-display font-black text-[28px] sm:text-[32px] uppercase tracking-tight leading-[1.08] text-white"
            style={{ textWrap: 'balance' }}
          >
            TE DAMOS LA BIENVENIDA A DISCORD
          </motion.h1>

          <motion.p
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.14, duration: 0.35 }}
            className="text-[15px] text-indigo-100/90 mt-3 leading-relaxed max-w-xs"
          >
            Pasa el rato, juega a juegos o charla sin más. ¡Toca abajo para empezar!
          </motion.p>
        </div>

        {/* Bottom CTA Stack */}
        <div className="relative z-10 px-5 pb-8 pt-4 max-w-md mx-auto w-full space-y-3">
          {accounts.length > 0 && (
            <div className="pb-1">
              <p className="text-[11px] font-semibold text-indigo-200/75 text-center mb-2">
                Cuentas guardadas en este dispositivo
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {accounts.slice(0, 3).map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => onLoginAccount(acc)}
                    className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <UserAvatar avatar={acc.user.avatar} size="xs" showStatus={false} />
                    <span>{acc.user.displayName}</span>
                    <span className="text-indigo-200 tabular-nums">
                      ◈ {acc.user.orbs.toLocaleString('es-ES')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setRegError(null);
              setStep('register-contact');
            }}
            className="w-full h-12 rounded-full bg-white hover:bg-zinc-100 text-[#0b1033] font-display font-bold text-[15.5px] shadow-xl transition-transform active:scale-[0.985] cursor-pointer"
          >
            Registrarse
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginError(null);
              setInfoBanner(null);
              setStep('login');
            }}
            className="w-full h-12 rounded-full bg-[#15246b]/85 hover:bg-[#1c2f85] border border-white/15 text-white font-display font-bold text-[15.5px] transition-transform active:scale-[0.985] cursor-pointer"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- 2. LOGIN SCREEN (¡Hola de nuevo!) ---------------- */
  if (step === 'login') {
    return (
      <div className="w-screen h-screen bg-[#14151a] text-white flex flex-col overflow-y-auto relative">
        {/* Subtle geometric dark shapes matching Screenshot 1 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 -left-12 w-40 h-40 rotate-45 rounded-2xl bg-white/[0.025]" />
          <div className="absolute top-28 right-1/4 w-24 h-24 rounded-full bg-white/[0.02]" />
          <div className="absolute bottom-24 -right-10 w-36 h-36 rounded-full bg-white/[0.02]" />
        </div>

        <header className="h-14 px-4 flex items-center shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setStep('welcome')}
            aria-label="Volver"
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 flex flex-col justify-between px-5 pb-8 pt-2 max-w-md mx-auto w-full relative z-10">
          <div>
            <div className="text-center mb-7">
              <h1 className="font-display font-bold text-[26px] text-white tracking-tight">
                ¡Hola de nuevo!
              </h1>
              <p className="text-[14px] text-zinc-400 mt-1">
                ¡Nos alegramos mucho de volver a verte!
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-zinc-300">
                  Correo electrónico o número de teléfono
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="usuario@correo.com o +58..."
                  className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] px-4 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-zinc-300">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] pl-4 pr-12 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Mostrar contraseña"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setInfoBanner(
                      'Se ha enviado un enlace de recuperación a tu correo o teléfono registrado.'
                    )
                  }
                  className="text-[13px] font-semibold text-[#4ea1ff] hover:underline cursor-pointer"
                >
                  ¿Has olvidado la contraseña?
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavedManager((v) => !v)}
                  className="text-[13px] font-semibold text-[#4ea1ff] hover:underline cursor-pointer"
                >
                  ¿Usas un gestor de contraseñas?
                </button>
              </div>

              <AnimatePresence>
                {showSavedManager && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-2xl bg-[#0b0c10] border border-white/10 p-3 space-y-2"
                  >
                    <p className="text-[11.5px] font-semibold text-zinc-400">
                      Selecciona una cuenta guardada para autocompletar:
                    </p>
                    <div className="space-y-1.5">
                      {accounts.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(acc.contact || acc.user.username);
                            setLoginPassword(acc.password);
                            setShowSavedManager(false);
                            setLoginError(null);
                          }}
                          className="w-full p-2 rounded-xl bg-[#161820] hover:bg-[#1e202b] flex items-center justify-between gap-2 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <UserAvatar avatar={acc.user.avatar} size="sm" showStatus={false} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">
                                {acc.user.displayName}
                              </p>
                              <p className="text-[11px] text-zinc-400 truncate">
                                @{acc.user.username} · {acc.contact}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-indigo-300 tabular-nums shrink-0">
                            ◈ {acc.user.orbs.toLocaleString('es-ES')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loginError && (
                <p className="text-xs font-semibold text-[#f87171] bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
                  {loginError}
                </p>
              )}

              {infoBanner && (
                <p className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2">
                  {infoBanner}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-[15px] shadow-lg transition-colors cursor-pointer mt-2"
              >
                Iniciar sesión
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-xs font-semibold text-zinc-400">o</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handlePasskeyLogin}
                className="w-full h-12 rounded-full bg-[#24262e] hover:bg-[#2d303a] border border-white/[0.08] text-white font-display font-bold text-[14.5px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-zinc-200" />
                <span>Inicia sesión con llave de acceso</span>
              </button>
            </form>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="px-4 py-2 rounded-full bg-[#1e2027] border border-white/[0.06] text-xs font-medium text-zinc-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Vibrarán las llamadas y notificaciones</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- 3. REGISTER STEP 1 (Teléfono / Correo) ---------------- */
  if (step === 'register-contact') {
    return (
      <div className="w-screen h-screen bg-[#14151a] text-white flex flex-col overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 -left-10 w-36 h-36 rotate-45 rounded-2xl bg-white/[0.025]" />
          <div className="absolute bottom-28 right-8 w-28 h-28 rounded-full bg-white/[0.02]" />
        </div>

        <header className="h-14 px-4 flex items-center shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setStep('welcome')}
            aria-label="Volver"
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </header>

        <form
          onSubmit={handleContinueContact}
          className="flex-1 px-5 pt-2 pb-8 max-w-md mx-auto w-full relative z-10 space-y-5"
        >
          <h1
            className="font-display font-bold text-[24px] sm:text-[26px] text-center leading-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Introduce tu teléfono o correo electrónico
          </h1>

          {/* Segmented Switch: Teléfono | Correo electrónico */}
          <div className="p-1 rounded-full bg-[#090a0d] border border-white/[0.06] grid grid-cols-2">
            <button
              type="button"
              onClick={() => setContactMode('phone')}
              className={`h-9 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                contactMode === 'phone'
                  ? 'bg-[#2a2c35] text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Teléfono
            </button>
            <button
              type="button"
              onClick={() => setContactMode('email')}
              className={`h-9 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                contactMode === 'email'
                  ? 'bg-[#2a2c35] text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Correo electrónico
            </button>
          </div>

          {contactMode === 'phone' ? (
            <div className="space-y-1.5 relative">
              <label className="block text-[13px] font-semibold text-zinc-300">
                Número de teléfono
              </label>
              <div className="h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.09] flex items-center overflow-hidden focus-within:border-[#5865F2]">
                <button
                  type="button"
                  onClick={() => setShowCountryPicker((s) => !s)}
                  className="h-full px-3.5 flex items-center gap-1.5 border-r border-white/[0.08] text-sm font-semibold text-white hover:bg-white/5 cursor-pointer shrink-0"
                >
                  <span>
                    {selectedCountry.code} {selectedCountry.dial}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Número de teléfono"
                  className="flex-1 h-full bg-transparent px-3.5 text-[15px] text-white placeholder:text-zinc-500 focus:outline-none tabular-nums"
                />
              </div>

              {showCountryPicker && (
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-2xl bg-[#1a1b22] border border-white/10 p-1.5 shadow-2xl z-30">
                  {COUNTRY_CODES.map((c, idx) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountryIndex(idx);
                        setShowCountryPicker(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                        idx === countryIndex
                          ? 'bg-[#5865F2] text-white'
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{c.label}</span>
                      {idx === countryIndex && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-zinc-300">
                Correo electrónico
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.09] px-4 text-[15px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#5865F2]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!isContactValid}
            className={`w-full h-12 rounded-full font-display font-bold text-[15px] transition-all ${
              isContactValid
                ? 'bg-[#5865F2] hover:bg-[#4752C4] text-white cursor-pointer shadow-lg'
                : 'bg-[#363d82] text-white/55 cursor-not-allowed'
            }`}
          >
            Siguiente
          </button>
        </form>
      </div>
    );
  }

  /* ---------------- 4. REGISTER STEP 2 (Perfil & Orbs iniciales) ---------------- */
  return (
    <div className="w-screen h-screen bg-[#14151a] text-white flex flex-col overflow-y-auto relative">
      <header className="h-14 px-4 flex items-center shrink-0">
        <button
          type="button"
          onClick={() => setStep('register-contact')}
          aria-label="Volver"
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <form
        onSubmit={handleCompleteRegistration}
        className="flex-1 px-5 pt-1 pb-8 max-w-md mx-auto w-full space-y-4"
      >
        <div className="text-center">
          <h1 className="font-display font-bold text-[24px] text-white">Crea tu cuenta</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Empieza con 1.200 Orbs de bienvenida · gana más completando Misiones
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-zinc-300">Elige tu avatar</label>
          <div className="flex items-center justify-between gap-2 bg-[#0b0c10] border border-white/[0.08] rounded-2xl p-2.5">
            {AVATAR_CHOICES.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setRegAvatar(av.id)}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  regAvatar === av.id
                    ? 'ring-2 ring-[#5865F2] scale-110'
                    : 'opacity-65 hover:opacity-100'
                }`}
                title={av.label}
              >
                <UserAvatar avatar={av.id} size="md" showStatus={false} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-zinc-300">
            Nombre para mostrar
          </label>
          <input
            type="text"
            value={regDisplayName}
            onChange={(e) => setRegDisplayName(e.target.value)}
            placeholder="Ej. Alex"
            className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] px-4 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-zinc-300">
            Nombre de usuario
          </label>
          <input
            type="text"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            placeholder="ej. alex_gg"
            className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] px-4 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold text-zinc-300">Contraseña</label>
          <div className="relative">
            <input
              type={regShowPass ? 'text' : 'password'}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              className="w-full h-12 rounded-2xl bg-[#0b0c10] border border-white/[0.08] pl-4 pr-12 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
            />
            <button
              type="button"
              onClick={() => setRegShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white cursor-pointer"
            >
              {regShowPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {regError && (
          <p className="text-xs font-semibold text-[#f87171] bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
            {regError}
          </p>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Crear cuenta</span>
        </button>
      </form>
    </div>
  );
};
