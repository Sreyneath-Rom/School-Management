// ============================================================================
// TRANSLATION STRINGS — SINGLE SOURCE OF TRUTH WITH MULTIPLE LANGUAGES
//
// This file contains the comprehensive translation system with support for
// multiple languages. Each StringEntry now includes translations for various
// languages (en, es, fr, de, pt, it, ja, zh, ar, hi).
// ============================================================================

export interface StringEntry {
  key: string
  category: string
  en: string
  es?: string
  fr?: string
  de?: string
  pt?: string
  it?: string
  ja?: string
  zh?: string
  ar?: string
  hi?: string
  [key: string]: string | undefined
}

// `as const satisfies readonly StringEntry[]` instead of `: StringEntry[]`
// on purpose: a plain type annotation here widens every `key: '...'`
// literal to `string`, which silently turns `TranslationKey` below into
// just `string` — losing all compile-time checking that a translation key
// actually exists. `satisfies` checks the array against StringEntry
// without widening it.
export const STRINGS = [
  // --------------------------------------------------------------------------
  // Authentication
  // --------------------------------------------------------------------------
  { key: 'auth.login', category: 'Auth', en: 'Login', es: 'Iniciar sesión', fr: 'Connexion', de: 'Anmelden', pt: 'Login', it: 'Accedi', ja: 'ログイン', zh: '登录', ar: 'تسجيل الدخول', hi: 'लॉगिन' },
  { key: 'auth.logout', category: 'Auth', en: 'Logout', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden', pt: 'Sair', it: 'Esci', ja: 'ログアウト', zh: '登出', ar: 'تسجيل الخروج', hi: 'लॉगआउट' },
  { key: 'auth.email', category: 'Auth', en: 'Email', es: 'Correo electrónico', fr: 'E-mail', de: 'E-Mail', pt: 'E-mail', it: 'Email', ja: 'メール', zh: '电子邮件', ar: 'بريد إلكتروني', hi: 'ईमेल' },
  { key: 'auth.emailAddress', category: 'Auth', en: 'Email Address', es: 'Dirección de correo electrónico', fr: 'Adresse e-mail', de: 'E-Mail-Adresse', pt: 'Endereço de e-mail', it: 'Indirizzo email', ja: 'メールアドレス', zh: '电子邮件地址', ar: 'عنوان البريد الإلكتروني', hi: 'ईमेल पता' },
  { key: 'auth.password', category: 'Auth', en: 'Password', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', pt: 'Senha', it: 'Password', ja: 'パスワード', zh: '密码', ar: 'كلمة المرور', hi: 'पासवर्ड' },
  { key: 'auth.rememberMe', category: 'Auth', en: 'Remember me', es: 'Recuérdame', fr: 'Se souvenir de moi', de: 'Angemeldet bleiben', pt: 'Lembre-se de mim', it: 'Ricordami', ja: '私を覚えておいてください', zh: '记住我', ar: 'تذكرني', hi: 'मुझे याद रखें' },
  { key: 'auth.forgotPassword', category: 'Auth', en: 'Forgot password?', es: '¿Olvidó su contraseña?', fr: 'Mot de passe oublié?', de: 'Passwort vergessen?', pt: 'Esqueceu a senha?', it: 'Password dimenticata?', ja: 'パスワードをお忘れですか？', zh: '忘记密码？', ar: 'هل نسيت كلمة المرور؟', hi: 'पासवर्ड भूल गए?' },
  { key: 'auth.invalidCredentials', category: 'Auth', en: 'Invalid email or password', es: 'Correo electrónico o contraseña inválidos', fr: 'E-mail ou mot de passe invalide', de: 'Ungültige E-Mail oder Passwort', pt: 'E-mail ou senha inválidos', it: 'Email o password non validi', ja: '無効なメールまたはパスワード', zh: '无效的电子邮件或密码', ar: 'بريد إلكتروني أو كلمة مرور غير صحيحة', hi: 'अमान्य ईमेल या पासवर्ड' },
  { key: 'auth.sessionExpired', category: 'Auth', en: 'Session expired. Please login again.', es: 'La sesión expiró. Por favor inicie sesión de nuevo.', fr: 'La session a expiré. Veuillez vous reconnecter.', de: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.', pt: 'Sessão expirada. Por favor, faça login novamente.', it: 'Sessione scaduta. Effettua il login di nuovo.', ja: 'セッションが期限切れです。もう一度ログインしてください。', zh: '会话已过期。请重新登录。', ar: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.', hi: 'सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।' },
  { key: 'auth.loginToAccount', category: 'Auth', en: 'Login to your account', es: 'Inicia sesión en tu cuenta', fr: 'Connectez-vous à votre compte', de: 'Melden Sie sich in Ihrem Konto an', pt: 'Faça login em sua conta', it: 'Accedi al tuo account', ja: 'アカウントにログイン', zh: '登录您的账户', ar: 'تسجيل الدخول إلى حسابك', hi: 'अपने खाते में लॉगिन करें' },
  { key: 'auth.welcomeBack', category: 'Auth', en: 'Welcome back! Please enter your details.', es: '¡Bienvenido de nuevo! Por favor, ingresa tus datos.', fr: 'Bienvenue à nouveau! Veuillez entrer vos détails.', de: 'Willkommen zurück! Bitte geben Sie Ihre Daten ein.', pt: 'Bem-vindo de volta! Por favor, insira seus dados.', it: 'Bentornato! Per favore, inserisci i tuoi dettagli.', ja: 'おかえりなさい。詳細を入力してください。', zh: '欢迎回来！请输入您的详细信息。', ar: 'أهلا بعودتك! يرجى إدخال تفاصيلك.', hi: 'आपका स्वागत है! कृपया अपना विवरण दर्ज करें।' },
  { key: 'auth.emailRequired', category: 'Auth', en: 'Email is required', es: 'El correo electrónico es obligatorio', fr: 'L\'email est obligatoire', de: 'Email ist erforderlich', pt: 'Email é obrigatório', it: 'L\'email è obbligatorio', ja: 'メールは必須です', zh: '电子邮件是必需的', ar: 'البريد الإلكتروني مطلوب', hi: 'ईमेल आवश्यक है' },
  { key: 'auth.passwordRequired', category: 'Auth', en: 'Password is required', es: 'La contraseña es obligatoria', fr: 'Le mot de passe est obligatoire', de: 'Passwort ist erforderlich', pt: 'Senha é obrigatória', it: 'La password è obbligatoria', ja: 'パスワードは必須です', zh: '密码是必需的', ar: 'كلمة المرور مطلوبة', hi: 'पासवर्ड आवश्यक है' },
  { key: 'auth.invalidEmail', category: 'Auth', en: 'Invalid email address', es: 'Dirección de correo electrónico no válida', fr: 'Adresse email invalide', de: 'Ungültige E-Mail-Adresse', pt: 'Endereço de email inválido', it: 'Indirizzo email non valido', ja: '無効なメールアドレス', zh: '无效的电子邮件地址', ar: 'عنوان بريد إلكتروني غير صالح', hi: 'अमान्य ईमेल पता' },
  { key: 'auth.loginFailed', category: 'Auth', en: 'Login failed. Please try again.', es: 'Error al iniciar sesión. Por favor intenta de nuevo.', fr: 'Échec de la connexion. Veuillez réessayer.', de: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.', pt: 'Falha ao fazer login. Tente novamente.', it: 'Accesso non riuscito. Riprova.', ja: 'ログインに失敗しました。もう一度お試しください。', zh: '登录失败。请重试。', ar: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.', hi: 'लॉगिन विफल। कृपया पुनः प्रयास करें।' },
  { key: 'auth.notAdminAccount', category: 'Auth', en: 'This account is not an admin account', es: 'Esta cuenta no es una cuenta de administrador', fr: 'Ce compte n\'est pas un compte administrateur', de: 'Dieses Konto ist kein Administratorkonto', pt: 'Esta conta não é uma conta de administrador', it: 'Questo account non è un account amministratore', ja: 'このアカウントは管理者アカウントではありません', zh: '此账户不是管理员账户', ar: 'هذا الحساب ليس حساب إداري', hi: 'यह खाता प्रशासक खाता नहीं है' },

  // --------------------------------------------------------------------------
  // Header
  // --------------------------------------------------------------------------
  { key: 'header.searchPlaceholder', category: 'Header', en: 'Search students, staff, or records...', es: 'Buscar estudiantes, personal o registros...', fr: 'Rechercher des étudiants, du personnel ou des dossiers...', de: 'Schüler, Personal oder Datensätze durchsuchen...', pt: 'Pesquisar alunos, pessoal ou registros...', it: 'Cerca studenti, personale o record...', ja: '学生、スタッフ、または記録を検索...', zh: '搜索学生、员工或记录...', ar: 'ابحث عن الطلاب أو الموظفين أو السجلات...', hi: 'छात्र, कर्मचारी या रिकॉर्ड खोजें...' },
  { key: 'header.searching', category: 'Header', en: 'Searching...', es: 'Buscando...', fr: 'Recherche en cours...', de: 'Suche läuft...', pt: 'Pesquisando...', it: 'Ricerca in corso...', ja: '検索中...', zh: '搜索中...', ar: 'جاري البحث...', hi: 'खोज जारी है...' },
  { key: 'header.noResults', category: 'Header', en: 'No results found', es: 'No se encontraron resultados', fr: 'Aucun résultat trouvé', de: 'Keine Ergebnisse gefunden', pt: 'Nenhum resultado encontrado', it: 'Nessun risultato trovato', ja: '結果が見つかりません', zh: '没有找到结果', ar: 'لم يتم العثور على نتائج', hi: 'कोई परिणाम नहीं मिला' },
  { key: 'header.notifications', category: 'Header', en: 'Notifications', es: 'Notificaciones', fr: 'Notifications', de: 'Benachrichtigungen', pt: 'Notificações', it: 'Notifiche', ja: '通知', zh: '通知', ar: 'إخطارات', hi: 'सूचनाएँ' },
  { key: 'header.markAllRead', category: 'Header', en: 'Mark all read', es: 'Marcar todo como leído', fr: 'Marquer tout comme lu', de: 'Alle als gelesen markieren', pt: 'Marcar tudo como lido', it: 'Segna tutto come letto', ja: 'すべてを読み取り済みとしてマーク', zh: '全部标记为已读', ar: 'وضع علامة الكل كمقروء', hi: 'सभी को पढ़ा हुआ चिह्नित करें' },
  { key: 'header.allCaughtUp', category: 'Header', en: "You're all caught up.", es: 'Estás al día.', fr: 'Vous êtes à jour.', de: 'Du bist auf dem neuesten Stand.', pt: 'Você está em dia.', it: 'Sei aggiornato.', ja: 'あなたは最新です。', zh: '你已跟上了。', ar: 'أنت محدث تماما.', hi: 'आप सभी को पकड़ लिया है।' },
  { key: 'header.myProfile', category: 'Header', en: 'My Profile', es: 'Mi Perfil', fr: 'Mon Profil', de: 'Mein Profil', pt: 'Meu Perfil', it: 'Il mio profilo', ja: 'マイプロフィール', zh: '我的个人资料', ar: 'ملفي الشخصي', hi: 'मेरी प्रोफाइल' },
  { key: 'header.settings', category: 'Header', en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', pt: 'Configurações', it: 'Impostazioni', ja: '設定', zh: '设置', ar: 'إعدادات', hi: 'सेटिंग्स' },
  { key: 'header.logOut', category: 'Header', en: 'Log out', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden', pt: 'Sair', it: 'Esci', ja: 'ログアウト', zh: '登出', ar: 'تسجيل الخروج', hi: 'लॉगआउट' },
  { key: 'header.account', category: 'Header', en: 'Account', es: 'Cuenta', fr: 'Compte', de: 'Konto', pt: 'Conta', it: 'Account', ja: 'アカウント', zh: '账户', ar: 'الحساب', hi: 'खाता' },
  { key: 'header.changeLanguage', category: 'Header', en: 'Change language', es: 'Cambiar idioma', fr: 'Changer la langue', de: 'Sprache ändern', pt: 'Mudar idioma', it: 'Cambia lingua', ja: '言語を変更', zh: '更改语言', ar: 'تغيير اللغة', hi: 'भाषा बदलें' },

  // --------------------------------------------------------------------------
  // Sidebar
  // --------------------------------------------------------------------------
  { key: 'sidebar.dashboard', category: 'Sidebar', en: 'Dashboard', es: 'Panel de control', fr: 'Tableau de bord', de: 'Dashboard', pt: 'Painel', it: 'Dashboard', ja: 'ダッシュボード', zh: '仪表板', ar: 'لوحة القيادة', hi: 'डैशबोर्ड' },
  { key: 'sidebar.overview', category: 'Sidebar', en: 'Overview', es: 'Visión general', fr: 'Aperçu', de: 'Übersicht', pt: 'Visão geral', it: 'Panoramica', ja: '概要', zh: '概述', ar: 'نظرة عامة', hi: 'अवलोकन' },
  { key: 'sidebar.setup', category: 'Sidebar', en: 'Setup', es: 'Configuración', fr: 'Configuration', de: 'Einrichtung', pt: 'Configuração', it: 'Configurazione', ja: 'セットアップ', zh: '设置', ar: 'إعداد', hi: 'सेटअप' },
  { key: 'sidebar.schoolSetup', category: 'Sidebar', en: 'School Information', es: 'Información de la Escuela', fr: 'Informations sur l\'école', de: 'Schulinformationen', pt: 'Informações da Escola', it: 'Informazioni sulla Scuola', ja: '学校情報', zh: '学校信息', ar: 'معلومات المدرسة', hi: 'स्कूल की जानकारी' },
  { key: 'sidebar.academicYears', category: 'Sidebar', en: 'Academic Years', es: 'Años Académicos', fr: 'Années académiques', de: 'Schuljahre', pt: 'Anos Letivos', it: 'Anni Accademici', ja: '学年', zh: '学年', ar: 'السنوات الأكاديمية', hi: 'शैक्षणिक वर्ष' },
  { key: 'sidebar.gradeLevels', category: 'Sidebar', en: 'Grade / Levels', es: 'Niveles de Grado', fr: 'Niveaux scolaires', de: 'Klassenstufen', pt: 'Graus / Níveis', it: 'Livelli di Grado', ja: '学年・レベル', zh: '年级级别', ar: 'المراحل الدراسية', hi: 'कक्षा / स्तर' },
  { key: 'sidebar.terms', category: 'Sidebar', en: 'Terms', es: 'Periodos / Trimestres', fr: 'Trimestres / Semestres', de: 'Schulhalbjahre', pt: 'Períodos', it: 'Trimestri', ja: '学期', zh: '学期', ar: 'الفصول الدراسية', hi: 'सत्र / अवधि' },
  { key: 'sidebar.subjects', category: 'Sidebar', en: 'Subjects', es: 'Asignaturas', fr: 'Matières', de: 'Fächer', pt: 'Disciplinas', it: 'Materie', ja: '科目', zh: '科目', ar: 'المواد', hi: 'विषय' },
  { key: 'sidebar.rooms', category: 'Sidebar', en: 'Rooms', es: 'Aulas y Salas', fr: 'Salles', de: 'Räume', pt: 'Salas', it: 'Aule', ja: '教室・部屋', zh: '教室与场地', ar: 'القاعات والغرف', hi: 'कमरे / कक्ष' },
  { key: 'sidebar.rolesPermissions', category: 'Sidebar', en: 'Roles & Permissions', es: 'Roles y Permisos', fr: 'Rôles et permissions', de: 'Rollen & Berechtigungen', pt: 'Funções e Permissões', it: 'Ruoli e Autorizzazioni', ja: 'ロールと権限', zh: '角色和权限', ar: 'الأدوار والأذونات', hi: 'भूमिकाएं और अनुमतियां' },
  { key: 'sidebar.users', category: 'Sidebar', en: 'Users', es: 'Usuarios', fr: 'Utilisateurs', de: 'Benutzer', pt: 'Usuários', it: 'Utenti', ja: 'ユーザー', zh: '用户', ar: 'المستخدمون', hi: 'उपयोगकर्ता' },
  { key: 'sidebar.translations', category: 'Sidebar', en: 'Translations', es: 'Traducciones', fr: 'Traductions', de: 'Übersetzungen', pt: 'Traduções', it: 'Traduzioni', ja: '翻訳', zh: '翻译', ar: 'الترجمات', hi: 'अनुवाद' },
  { key: 'sidebar.academic', category: 'Sidebar', en: 'Academic', es: 'Académico', fr: 'Académique', de: 'Akademisch', pt: 'Acadêmico', it: 'Accademico', ja: '学術', zh: '学术', ar: 'أكاديمي', hi: 'शैक्षणिक' },
  { key: 'sidebar.classes', category: 'Sidebar', en: 'Classes', es: 'Clases', fr: 'Classes', de: 'Klassen', pt: 'Turmas', it: 'Classi', ja: 'クラス', zh: '班级', ar: 'الفئات', hi: 'कक्षाएं' },
  { key: 'sidebar.classSubjects', category: 'Sidebar', en: 'Class Subjects', es: 'Materias por Clase', fr: 'Matières par classe', de: 'Klassenfächer', pt: 'Disciplinas da Turma', it: 'Materie della Classe', ja: 'クラス科目', zh: '班级课程', ar: 'مواد الفصول', hi: 'कक्षा के विषय' },
  { key: 'sidebar.classSchedules', category: 'Sidebar', en: 'Class Schedules', es: 'Horarios de Clases', fr: 'Emplois du temps', de: 'Klassenstundenpläne', pt: 'Horários das Turmas', it: 'Orari delle Classi', ja: '時間割', zh: '班级课程表', ar: 'جداول الفصول', hi: 'कक्षा की समय सारिणी' },
  { key: 'sidebar.lessons', category: 'Sidebar', en: 'Lessons', es: 'Lecciones', fr: 'Leçons', de: 'Lektionen', pt: 'Aulas', it: 'Lezioni', ja: 'レッスン', zh: '课程', ar: 'الدروس', hi: 'पाठ' },
  { key: 'sidebar.homework', category: 'Sidebar', en: 'Homework', es: 'Tarea', fr: 'Devoirs', de: 'Hausaufgaben', pt: 'Lição de casa', it: 'Compiti', ja: '宿題', zh: '家庭作业', ar: 'الواجب المنزلي', hi: 'गृहकार्य' },
  { key: 'sidebar.quizTests', category: 'Sidebar', en: 'Quizzes', es: 'Pruebas y Cuestionarios', fr: 'Quiz', de: 'Quizze', pt: 'Quizzes', it: 'Quiz', ja: '小テスト', zh: '测验', ar: 'الاختبارات القصيرة', hi: 'प्रश्नोत्तरी' },
  { key: 'sidebar.grades', category: 'Sidebar', en: 'Grades', es: 'Calificaciones', fr: 'Notes', de: 'Noten', pt: 'Notas', it: 'Voti', ja: '成績', zh: '成绩', ar: 'الدرجات', hi: 'ग्रेड' },
  { key: 'sidebar.exams', category: 'Sidebar', en: 'Exams', es: 'Exámenes', fr: 'Examens', de: 'Prüfungen', pt: 'Exames', it: 'Esami', ja: '試験', zh: '考试', ar: 'الامتحانات', hi: 'परीक्षाएं' },
  { key: 'sidebar.examList', category: 'Sidebar', en: 'Exams', es: 'Exámenes', fr: 'Examens', de: 'Prüfungsliste', pt: 'Exames', it: 'Elenco Esami', ja: '試験', zh: '考试', ar: 'الامتحانات', hi: 'परीक्षाएं' },
  { key: 'sidebar.examSchedules', category: 'Sidebar', en: 'Exam Schedules', es: 'Horarios de Exámenes', fr: 'Calendrier des examens', de: 'Prüfungszeitpläne', pt: 'Horários de Exames', it: 'Orari degli Esami', ja: '試験日程', zh: '考试日程', ar: 'جداول الامتحانات', hi: 'परीक्षा समय सारिणी' },
  { key: 'sidebar.markEntry', category: 'Sidebar', en: 'Mark Entry', es: 'Ingreso de Notas', fr: 'Saisie des notes', de: 'Noteneingabe', pt: 'Lançamento de Notas', it: 'Inserimento Voti', ja: '採点入力', zh: '成绩录入', ar: 'إدخال الدرجات', hi: 'अंक प्रविष्टि' },
  { key: 'sidebar.reportCards', category: 'Sidebar', en: 'Report Cards', es: 'Boletines', fr: 'Bulletins scolaires', de: 'Zeugnisse', pt: 'Boletins', it: 'Pagelle', ja: '成績証明書', zh: '成绩单', ar: 'بطاقات التقرير', hi: 'रिपोर्ट कार्ड' },
  { key: 'sidebar.students', category: 'Sidebar', en: 'Students', es: 'Estudiantes', fr: 'Étudiants', de: 'Schüler', pt: 'Alunos', it: 'Studenti', ja: '学生', zh: '学生', ar: 'الطلاب', hi: 'छात्र' },
  { key: 'sidebar.studentList', category: 'Sidebar', en: 'Student List', es: 'Lista de Estudiantes', fr: 'Liste des étudiants', de: 'Schülerliste', pt: 'Lista de Alunos', it: 'Elenco Studenti', ja: '学生リスト', zh: '学生列表', ar: 'قائمة الطلاب', hi: 'छात्र सूची' },
  { key: 'sidebar.studentProfiles', category: 'Sidebar', en: 'Student Profiles', es: 'Perfiles de Estudiantes', fr: 'Profils d\'étudiants', de: 'Schülerprofile', pt: 'Perfis de Alunos', it: 'Profili Studenti', ja: '学生プロフィール', zh: '学生档案', ar: 'ملفات الطلاب', hi: 'छात्र प्रोफाइल' },
  { key: 'sidebar.attendance', category: 'Sidebar', en: 'Attendance', es: 'Asistencia', fr: 'Présence', de: 'Anwesenheit', pt: 'Presença', it: 'Frequenza', ja: '出席', zh: '考勤', ar: 'الحضور', hi: 'उपस्थिति' },
  { key: 'sidebar.leaveRequests', category: 'Sidebar', en: 'Leave Requests', es: 'Solicitudes de Licencia', fr: 'Demandes de congé', de: 'Urlaubsanträge', pt: 'Solicitações de Ausência', it: 'Richieste di Congedo', ja: '休暇申請', zh: '请假申请', ar: 'طلبات الإجازة', hi: 'छुट्टी के अनुरोध' },
  { key: 'sidebar.teachers', category: 'Sidebar', en: 'Teachers', es: 'Maestros', fr: 'Enseignants', de: 'Lehrer', pt: 'Professores', it: 'Insegnanti', ja: '教師', zh: '教师', ar: 'المعلمون', hi: 'शिक्षक' },
  { key: 'sidebar.teacherList', category: 'Sidebar', en: 'Teacher List', es: 'Lista de Maestros', fr: 'Liste des enseignants', de: 'Lehrerliste', pt: 'Lista de Professores', it: 'Elenco Insegnanti', ja: '教師リスト', zh: '教师列表', ar: 'قائمة المعلمين', hi: 'शिक्षक सूची' },
  { key: 'sidebar.teacherProfiles', category: 'Sidebar', en: 'Teacher Profiles', es: 'Perfiles de Maestros', fr: 'Profils d\'enseignants', de: 'Lehrerprofile', pt: 'Perfis de Professores', it: 'Profili Insegnanti', ja: '教師プロフィール', zh: '教师档案', ar: 'ملفات المعلمين', hi: 'शिक्षक प्रोफाइल' },
  { key: 'sidebar.teacherAssignments', category: 'Sidebar', en: 'Teacher Assignments', es: 'Asignaciones de Maestros', fr: 'Attributions des enseignants', de: 'Lehreraufträge', pt: 'Atribuições de Professores', it: 'Incarichi Insegnanti', ja: '教師割り当て', zh: '教师分配', ar: 'مهام المعلمين', hi: 'शिक्षक असाइनमेंट' },
  { key: 'sidebar.teacherAttendance', category: 'Sidebar', en: 'Teacher Attendance', es: 'Asistencia de Maestros', fr: 'Présence des enseignants', de: 'Lehreranwesenheit', pt: 'Presença dos Professores', it: 'Frequenza Insegnanti', ja: '教員出勤', zh: '教师考勤', ar: 'حضور المعلمين', hi: 'शिक्षक उपस्थिति' },
  { key: 'sidebar.finance', category: 'Sidebar', en: 'Finance', es: 'Finanzas', fr: 'Finances', de: 'Finanzen', pt: 'Finanças', it: 'Finanze', ja: '財務', zh: '财务', ar: 'المالية', hi: 'वित्त' },
  { key: 'sidebar.fees', category: 'Sidebar', en: 'Finance', es: 'Finanzas', fr: 'Finances', de: 'Finanzen', pt: 'Finanças', it: 'Finanze', ja: '財務', zh: '财务', ar: 'المالية', hi: 'वित्त' },
  { key: 'sidebar.feeStructures', category: 'Sidebar', en: 'Fee Structures', es: 'Estructura de Tarifas', fr: 'Structures tarifaires', de: 'Gebührenstrukturen', pt: 'Estrutura de Mensalidades', it: 'Strutture Tariffarie', ja: '料金体系', zh: '收费标准', ar: 'هياكل الرسوم', hi: 'शुल्क संरचनाएं' },
  { key: 'sidebar.invoices', category: 'Sidebar', en: 'Invoices', es: 'Facturas', fr: 'Factures', de: 'Rechnungen', pt: 'Faturas', it: 'Fatture', ja: '請求書', zh: '发票', ar: 'الفواتير', hi: 'चालान' },
  { key: 'sidebar.payments', category: 'Sidebar', en: 'Payments', es: 'Pagos', fr: 'Paiements', de: 'Zahlungen', pt: 'Pagamentos', it: 'Pagamenti', ja: '支払い', zh: '付款', ar: 'المدفوعات', hi: 'भुगतान' },
  { key: 'sidebar.paymentHistory', category: 'Sidebar', en: 'Payment History', es: 'Historial de Pagos', fr: 'Historique des paiements', de: 'Zahlungsverlauf', pt: 'Histórico de Pagamentos', it: 'Cronologia Pagamenti', ja: '支払履歴', zh: '付款历史', ar: 'سجل المدفوعات', hi: 'भुगतान इतिहास' },
  { key: 'sidebar.library', category: 'Sidebar', en: 'Library', es: 'Biblioteca', fr: 'Bibliothèque', de: 'Bibliothek', pt: 'Biblioteca', it: 'Biblioteca', ja: '図書館', zh: '图书馆', ar: 'المكتبة', hi: 'पुस्तकालय' },
  { key: 'sidebar.books', category: 'Sidebar', en: 'Books', es: 'Libros', fr: 'Livres', de: 'Bücher', pt: 'Livros', it: 'Libri', ja: '書籍', zh: '图书', ar: 'الكتب', hi: 'पुस्तकें' },
  { key: 'sidebar.libraryCategories', category: 'Sidebar', en: 'Categories', es: 'Categorías de Biblioteca', fr: 'Catégories', de: 'Kategorien', pt: 'Categorias', it: 'Categorie', ja: '図書分類', zh: '图书分类', ar: 'تصنيفات المكتبة', hi: 'श्रेणियां' },
  { key: 'sidebar.borrow', category: 'Sidebar', en: 'Borrowing', es: 'Préstamos', fr: 'Emprunts', de: 'Ausleihe', pt: 'Empréstimos', it: 'Prestiti', ja: '貸出管理', zh: '图书借阅', ar: 'استعارة الكتب', hi: 'उधार लेना' },
  { key: 'sidebar.returns', category: 'Sidebar', en: 'Returns', es: 'Devoluciones', fr: 'Retours', de: 'Rückgaben', pt: 'Devoluções', it: 'Restituzioni', ja: '返却管理', zh: '图书归还', ar: 'إرجاع الكتب', hi: 'वापसी' },
  { key: 'sidebar.overdueBooks', category: 'Sidebar', en: 'Overdue Books', es: 'Libros Vencidos', fr: 'Livres en retard', de: 'Überfällige Bücher', pt: 'Livros Atrasados', it: 'Libri in Ritardo', ja: '延滞図書', zh: '逾期未还', ar: 'الكتب المتأخرة', hi: 'अतिदेय पुस्तकें' },
  { key: 'sidebar.calendar', category: 'Sidebar', en: 'Calendar', es: 'Calendario', fr: 'Calendrier', de: 'Kalender', pt: 'Calendário', it: 'Calendario', ja: 'カレンダー', zh: '日历', ar: 'التقويم', hi: 'कैलेंडर' },
  { key: 'sidebar.calendarView', category: 'Sidebar', en: 'Calendar', es: 'Calendario', fr: 'Calendrier', de: 'Kalender', pt: 'Calendário', it: 'Calendario', ja: 'カレンダー', zh: '日历', ar: 'التقويم', hi: 'कैलेंडर' },
  { key: 'sidebar.calendarEvents', category: 'Sidebar', en: 'Events', es: 'Eventos', fr: 'Événements', de: 'Ereignisse', pt: 'Eventos', it: 'Eventi', ja: 'イベント', zh: '活动', ar: 'الفعاليات', hi: 'आयोजन / कार्यक्रम' },
  { key: 'sidebar.calendarHolidays', category: 'Sidebar', en: 'Holidays', es: 'Días Festivos', fr: 'Jours fériés', de: 'Feiertage', pt: 'Feriados', it: 'Festività', ja: '休日・祝日', zh: '假期', ar: 'العطلات الرسمية', hi: 'अवकाश / छुट्टियां' },
  { key: 'sidebar.communication', category: 'Sidebar', en: 'Communication', es: 'Comunicación', fr: 'Communication', de: 'Kommunikation', pt: 'Comunicação', it: 'Comunicazione', ja: 'コミュニケーション', zh: '沟通', ar: 'التواصل', hi: 'संचार' },
  { key: 'sidebar.announcements', category: 'Sidebar', en: 'Announcements', es: 'Anuncios', fr: 'Annonces', de: 'Ankündigungen', pt: 'Anúncios', it: 'Annunci', ja: 'お知らせ', zh: '公告', ar: 'الإعلانات', hi: 'घोषणाएं' },
  { key: 'sidebar.notifications', category: 'Sidebar', en: 'Notifications', es: 'Notificaciones', fr: 'Notifications', de: 'Benachrichtigungen', pt: 'Notificações', it: 'Notifiche', ja: '通知', zh: '通知', ar: 'الإشعارات', hi: 'सूचनाएं' },
  { key: 'sidebar.messages', category: 'Sidebar', en: 'Messages', es: 'Mensajes', fr: 'Messages', de: 'Nachrichten', pt: 'Mensagens', it: 'Messaggi', ja: 'メッセージ', zh: '消息', ar: 'الرسائل', hi: 'संदेश' },
  { key: 'sidebar.inbox', category: 'Sidebar', en: 'Messages', es: 'Mensajes', fr: 'Messages', de: 'Nachrichten', pt: 'Mensagens', it: 'Messaggi', ja: 'メッセージ', zh: '消息', ar: 'الرسائل', hi: 'संदेश' },
  { key: 'sidebar.reports', category: 'Sidebar', en: 'Reports', es: 'Informes', fr: 'Rapports', de: 'Berichte', pt: 'Relatórios', it: 'Relazioni', ja: 'レポート', zh: '报告', ar: 'التقارير', hi: 'रिपोर्ट' },
  { key: 'sidebar.attendanceReport', category: 'Sidebar', en: 'Attendance', es: 'Asistencia', fr: 'Présence', de: 'Anwesenheit', pt: 'Presença', it: 'Frequenza', ja: '出席レポート', zh: '考勤', ar: 'الحضور', hi: 'उपस्थिति' },
  { key: 'sidebar.academicPerformanceReport', category: 'Sidebar', en: 'Academic Performance', es: 'Rendimiento Académico', fr: 'Performance académique', de: 'Akademische Leistung', pt: 'Desempenho Acadêmico', it: 'Rendimento Accademico', ja: '学業成績', zh: '学业成绩表现', ar: 'الأداء الأكاديمي', hi: 'शैक्षणिक प्रदर्शन' },
  { key: 'sidebar.gradeReport', category: 'Sidebar', en: 'Academic Performance', es: 'Rendimiento Académico', fr: 'Performance académique', de: 'Akademische Leistung', pt: 'Desempenho Acadêmico', it: 'Rendimento Accademico', ja: '学業成績', zh: '学业成绩表现', ar: 'الأداء الأكاديمي', hi: 'शैक्षणिक प्रदर्शन' },
  { key: 'sidebar.studentReport', category: 'Sidebar', en: 'Students', es: 'Estudiantes', fr: 'Étudiants', de: 'Schüler', pt: 'Alunos', it: 'Studenti', ja: '学生レポート', zh: '学生', ar: 'الطلاب', hi: 'छात्र' },
  { key: 'sidebar.teacherReport', category: 'Sidebar', en: 'Teachers', es: 'Maestros', fr: 'Enseignants', de: 'Lehrer', pt: 'Professores', it: 'Insegnanti', ja: '教員レポート', zh: '教师', ar: 'المعلمون', hi: 'शिक्षक' },
  { key: 'sidebar.financeReport', category: 'Sidebar', en: 'Finance', es: 'Finanzas', fr: 'Finances', de: 'Finanzen', pt: 'Finanças', it: 'Finanze', ja: '財務レポート', zh: '财务', ar: 'المالية', hi: 'वित्त' },
  { key: 'sidebar.libraryReport', category: 'Sidebar', en: 'Library', es: 'Biblioteca', fr: 'Bibliothèque', de: 'Bibliothek', pt: 'Biblioteca', it: 'Biblioteca', ja: '図書館レポート', zh: '图书馆', ar: 'المكتبة', hi: 'पुस्तकालय' },
  { key: 'sidebar.children', category: 'Sidebar', en: 'Children', es: 'Hijos', fr: 'Enfants', de: 'Kinder', pt: 'Filhos', it: 'Figli', ja: '子ども', zh: '子女', ar: 'الأطفال', hi: 'बच्चे' },
  { key: 'sidebar.myChildren', category: 'Sidebar', en: 'My Children', es: 'Mis Hijos', fr: 'Mes Enfants', de: 'Meine Kinder', pt: 'Meus Filhos', it: 'I miei Figli', ja: '私の子ども', zh: '我的孩子', ar: 'أطفالي', hi: 'मेरे बच्चे' },
  { key: 'sidebar.system', category: 'Sidebar', en: 'System', es: 'Sistema', fr: 'Système', de: 'System', pt: 'Sistema', it: 'Sistema', ja: 'システム', zh: '系统', ar: 'النظام', hi: 'सिस्टम' },
  { key: 'sidebar.auditLogs', category: 'Sidebar', en: 'Audit Logs', es: 'Registros de Auditoría', fr: 'Journaux d\'audit', de: 'Audit-Protokolle', pt: 'Registros de Auditoria', it: 'Registri di Controllo', ja: '監査ログ', zh: '审计日志', ar: 'سجلات التدقيق', hi: 'ऑडिट लॉग' },
  { key: 'sidebar.activityLogs', category: 'Sidebar', en: 'Activity Logs', es: 'Registros de Actividad', fr: 'Journaux d\'activité', de: 'Aktivitätsprotokolle', pt: 'Registros de Atividade', it: 'Registri di Attività', ja: 'アクティビティログ', zh: '活动日志', ar: 'سجلات الأنشطة', hi: 'गतिविधि लॉग' },
  { key: 'sidebar.systemSettings', category: 'Sidebar', en: 'System Settings', es: 'Configuración del Sistema', fr: 'Paramètres système', de: 'Systemeinstellungen', pt: 'Configurações do Sistema', it: 'Impostazioni di Sistema', ja: 'システム設定', zh: '系统设置', ar: 'إعدادات النظام', hi: 'सिस्टम सेटिंग्स' },
  { key: 'sidebar.responsiveStudio', category: 'Sidebar', en: 'Responsive Screen Studio', es: 'Estudio de Pantallas Adaptables', fr: 'Studio d\'Écrans Réactifs', de: 'Responsive Screen Studio', pt: 'Estúdio de Telas Responsivas', it: 'Studio Schermi Reattivi', ja: 'レスポンシブ画面スタジオ', zh: '响应式屏幕工作室', ar: 'استوديو الشاشات المتجاوبة', hi: 'रिस्पॉन्सिव स्क्रीन स्टूडियो' },

  { key: 'sidebar.transport', category: 'Sidebar', en: 'Transport', es: 'Transporte', fr: 'Transport', de: 'Transport', pt: 'Transporte', it: 'Trasporti', ja: '交通・送迎', zh: '校车交通', ar: 'المواصلات', hi: 'परिवहन' },
  { key: 'sidebar.routes', category: 'Sidebar', en: 'Routes', es: 'Rutas', fr: 'Itinéraires', de: 'Routen', pt: 'Rotas', it: 'Percorsi', ja: '運行ルート', zh: '路线管理', ar: 'المسارات', hi: 'मार्ग' },
  { key: 'sidebar.vehicles', category: 'Sidebar', en: 'Vehicles', es: 'Vehículos', fr: 'Véhicules', de: 'Fahrzeuge', pt: 'Veículos', it: 'Veicoli', ja: '車両一覧', zh: '校车车辆', ar: 'المركبات', hi: 'वाहन' },
  { key: 'sidebar.drivers', category: 'Sidebar', en: 'Drivers', es: 'Conductores', fr: 'Chauffeurs', de: 'Fahrer', pt: 'Motoristas', it: 'Autisti', ja: '運転手', zh: '司机管理', ar: 'السائقون', hi: 'चालक' },
  { key: 'sidebar.transportAssignments', category: 'Sidebar', en: 'Assignments', es: 'Asignaciones', fr: 'Attributions', de: 'Zuweisungen', pt: 'Alocações', it: 'Assegnazioni', ja: '乗車割り当て', zh: '校车分配', ar: 'التعيينات', hi: 'आवंटन' },
  { key: 'sidebar.hostel', category: 'Sidebar', en: 'Hostel', es: 'Residencia', fr: 'Internat', de: 'Internat', pt: 'Alojamento', it: 'Convitto', ja: '学生寮', zh: '宿舍管理', ar: 'السكن الجامعي', hi: 'छात्रावास' },
  { key: 'sidebar.hostelRooms', category: 'Sidebar', en: 'Hostel Rooms', es: 'Habitaciones', fr: 'Chambres', de: 'Zimmer', pt: 'Quartos', it: 'Camere', ja: '部屋一覧', zh: '宿舍房间', ar: 'غرف السكن', hi: 'कमरे' },
  { key: 'sidebar.roomAllocation', category: 'Sidebar', en: 'Room Allocation', es: 'Asignación de Habitaciones', fr: 'Attribution des chambres', de: 'Zimmerbelegung', pt: 'Alocação de Quartos', it: 'Assegnazione Camere', ja: '部屋割り当て', zh: '宿舍分配', ar: 'توزيع الغرف', hi: 'कमरा आवंटन' },
  { key: 'sidebar.hostelFees', category: 'Sidebar', en: 'Hostel Fees', es: 'Tarifas de Residencia', fr: 'Frais d\'internat', de: 'Internatsgebühren', pt: 'Taxas de Alojamento', it: 'Rette Convitto', ja: '寮費', zh: '住宿费用', ar: 'رسوم السكن', hi: 'छात्रावास शुल्क' },
  { key: 'sidebar.inventory', category: 'Sidebar', en: 'Inventory', es: 'Inventario', fr: 'Inventaire', de: 'Inventar', pt: 'Inventário', it: 'Inventario', ja: '在庫・備品', zh: '物资库存', ar: 'المخزون', hi: 'इन्वेंटरी' },
  { key: 'sidebar.itemCategories', category: 'Sidebar', en: 'Categories', es: 'Categorías', fr: 'Catégories', de: 'Kategorien', pt: 'Categorias', it: 'Categorie', ja: '備品種別', zh: '物品分类', ar: 'الفئات', hi: 'श्रेणियां' },
  { key: 'sidebar.inventoryItems', category: 'Sidebar', en: 'Inventory Items', es: 'Artículos', fr: 'Articles', de: 'Inventargegenstände', pt: 'Itens de Inventário', it: 'Articoli', ja: '備品一覧', zh: '库存物品', ar: 'عناصر المخزون', hi: 'सामग्री' },
  { key: 'sidebar.itemIssuance', category: 'Sidebar', en: 'Item Issuance', es: 'Entrega de Artículos', fr: 'Distribution', de: 'Materialausgabe', pt: 'Distribuição de Itens', it: 'Emissione Articoli', ja: '貸出・出庫', zh: '物品领用', ar: 'صرف المواد', hi: 'सामग्री जारी करना' },
  { key: 'sidebar.suppliers', category: 'Sidebar', en: 'Suppliers', es: 'Proveedores', fr: 'Fournisseurs', de: 'Lieferanten', pt: 'Fornecedores', it: 'Fornitori', ja: '取引先・仕入先', zh: '供应商', ar: 'الموردون', hi: 'आपूर्तिकर्ता' },

  // --------------------------------------------------------------------------
  // Common Actions
  // --------------------------------------------------------------------------
  { key: 'common.save', category: 'Common', en: 'Save', es: 'Guardar', fr: 'Enregistrer', de: 'Speichern', pt: 'Salvar', it: 'Salva', ja: '保存', zh: '保存', ar: 'حفظ', hi: 'सहेजें' },
  { key: 'common.cancel', category: 'Common', en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', it: 'Annulla', ja: 'キャンセル', zh: '取消', ar: 'إلغاء', hi: 'रद्द करें' },
  { key: 'common.delete', category: 'Common', en: 'Delete', es: 'Eliminar', fr: 'Supprimer', de: 'Löschen', pt: 'Deletar', it: 'Elimina', ja: '削除', zh: '删除', ar: 'حذف', hi: 'हटाएं' },
  { key: 'common.edit', category: 'Common', en: 'Edit', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten', pt: 'Editar', it: 'Modifica', ja: '編集', zh: '编辑', ar: 'تعديل', hi: 'संपादित करें' },
  { key: 'common.discard', category: 'Common', en: 'Discard', es: 'Descartar', fr: 'Abandonner', de: 'Verwerfen', pt: 'Descartar', it: 'Scarta', ja: '破棄', zh: '放弃', ar: 'تجاهل', hi: 'छोड़ें' },
  { key: 'common.saving', category: 'Common', en: 'Saving...', es: 'Guardando...', fr: 'Enregistrement...', de: 'Wird gespeichert...', pt: 'Salvando...', it: 'Salvataggio in corso...', ja: '保存中...', zh: '保存中...', ar: 'جاري الحفظ...', hi: 'सहेजा जा रहा है...' },
  { key: 'common.loading', category: 'Common', en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', de: 'Wird geladen...', pt: 'Carregando...', it: 'Caricamento in corso...', ja: '読み込み中...', zh: '加载中...', ar: 'جاري التحميل...', hi: 'लोड हो रहा है...' },
  { key: 'common.yes', category: 'Common', en: 'Yes', es: 'Sí', fr: 'Oui', de: 'Ja', pt: 'Sim', it: 'Sì', ja: 'はい', zh: '是', ar: 'نعم', hi: 'हाँ' },
  { key: 'common.no', category: 'Common', en: 'No', es: 'No', fr: 'Non', de: 'Nein', pt: 'Não', it: 'No', ja: 'いいえ', zh: '否', ar: 'لا', hi: 'नहीं' },
  { key: 'common.close', category: 'Common', en: 'Close', es: 'Cerrar', fr: 'Fermer', de: 'Schließen', pt: 'Fechar', it: 'Chiudi', ja: '閉じる', zh: '关闭', ar: 'غلق', hi: 'बंद करें' },
  { key: 'common.confirm', category: 'Common', en: 'Confirm', es: 'Confirmar', fr: 'Confirmer', de: 'Bestätigen', pt: 'Confirmar', it: 'Conferma', ja: '確認', zh: '确认', ar: 'تأكيد', hi: 'पुष्टि करें' },
  { key: 'common.add', category: 'Common', en: 'Add', es: 'Agregar', fr: 'Ajouter', de: 'Hinzufügen', pt: 'Adicionar', it: 'Aggiungi', ja: '追加', zh: '添加', ar: 'إضافة', hi: 'जोड़ें' },
  { key: 'common.update', category: 'Common', en: 'Update', es: 'Actualizar', fr: 'Mettre à jour', de: 'Aktualisieren', pt: 'Atualizar', it: 'Aggiorna', ja: '更新', zh: '更新', ar: 'تحديث', hi: 'अपडेट करें' },
  { key: 'common.remove', category: 'Common', en: 'Remove', es: 'Quitar', fr: 'Supprimer', de: 'Entfernen', pt: 'Remover', it: 'Rimuovi', ja: '削除', zh: '移除', ar: 'إزالة', hi: 'हटाएं' },
  { key: 'common.search', category: 'Common', en: 'Search', es: 'Buscar', fr: 'Rechercher', de: 'Suchen', pt: 'Pesquisar', it: 'Ricerca', ja: '検索', zh: '搜索', ar: 'بحث', hi: 'खोज' },
  { key: 'common.filter', category: 'Common', en: 'Filter', es: 'Filtrar', fr: 'Filtrer', de: 'Filtern', pt: 'Filtro', it: 'Filtra', ja: 'フィルター', zh: '筛选', ar: 'تصفية', hi: 'फ़िल्टर' },
  { key: 'common.sort', category: 'Common', en: 'Sort', es: 'Ordenar', fr: 'Trier', de: 'Sortieren', pt: 'Ordenar', it: 'Ordina', ja: '並べ替え', zh: '排序', ar: 'فرز', hi: 'छांटना' },
  { key: 'common.export', category: 'Common', en: 'Export', es: 'Exportar', fr: 'Exporter', de: 'Exportieren', pt: 'Exportar', it: 'Esporta', ja: 'エクスポート', zh: '导出', ar: 'تصدير', hi: 'निर्यात' },
  { key: 'common.import', category: 'Common', en: 'Import', es: 'Importar', fr: 'Importer', de: 'Importieren', pt: 'Importar', it: 'Importa', ja: 'インポート', zh: '导入', ar: 'استيراد', hi: 'आयात' },
  { key: 'common.next', category: 'Common', en: 'Next', es: 'Siguiente', fr: 'Suivant', de: 'Nächstes', pt: 'Próximo', it: 'Avanti', ja: '次へ', zh: '下一步', ar: 'التالي', hi: 'अगला' },
  { key: 'common.previous', category: 'Common', en: 'Previous', es: 'Anterior', fr: 'Précédent', de: 'Zurück', pt: 'Anterior', it: 'Indietro', ja: '前へ', zh: '上一步', ar: 'السابق', hi: 'पिछला' },
  { key: 'common.view', category: 'Common', en: 'View', es: 'Ver', fr: 'Voir', de: 'Anzeigen', pt: 'Visualizar', it: 'Visualizza', ja: '表示', zh: '查看', ar: 'عرض', hi: 'देखें' },

  // --------------------------------------------------------------------------
  // Messages & Errors
  // --------------------------------------------------------------------------
  { key: 'error.required', category: 'Messages', en: 'This field is required', es: 'Este campo es requerido', fr: 'Ce champ est requis', de: 'Dieses Feld ist erforderlich', pt: 'Este campo é obrigatório', it: 'Questo campo è obbligatorio', ja: 'このフィールドは必須です', zh: '此字段为必填项', ar: 'هذا الحقل مطلوب', hi: 'यह फील्ड आवश्यक है' },
  { key: 'error.invalidEmail', category: 'Messages', en: 'Invalid email address', es: 'Dirección de correo electrónico no válida', fr: 'Adresse email invalide', de: 'Ungültige E-Mail-Adresse', pt: 'Endereço de email inválido', it: 'Indirizzo email non valido', ja: '無効なメールアドレス', zh: '无效的电子邮件地址', ar: 'عنوان بريد إلكتروني غير صالح', hi: 'अमान्य ईमेल पता' },
  { key: 'error.success', category: 'Messages', en: 'Operation successful', es: 'Operación exitosa', fr: 'Opération réussie', de: 'Operation erfolgreich', pt: 'Operação bem-sucedida', it: 'Operazione riuscita', ja: '操作が成功しました', zh: '操作成功', ar: 'تمت العملية بنجاح', hi: 'ऑपरेशन सफल' },
  { key: 'error.failed', category: 'Messages', en: 'Operation failed', es: 'Operación fallida', fr: 'L\'opération a échoué', de: 'Operation fehlgeschlagen', pt: 'Operação falhou', it: 'Operazione non riuscita', ja: '操作に失敗しました', zh: '操作失败', ar: 'فشلت العملية', hi: 'ऑपरेशन विफल' },
  { key: 'error.unauthorized', category: 'Messages', en: 'Unauthorized access', es: 'Acceso no autorizado', fr: 'Accès non autorisé', de: 'Unbefugter Zugriff', pt: 'Acesso não autorizado', it: 'Accesso non autorizzato', ja: '無許可のアクセス', zh: '未授权的访问', ar: 'وصول غير مصرح', hi: 'अनुमत नहीं पहुंच' },
  { key: 'error.notFound', category: 'Messages', en: 'Resource not found', es: 'Recurso no encontrado', fr: 'Ressource non trouvée', de: 'Ressource nicht gefunden', pt: 'Recurso não encontrado', it: 'Risorsa non trovata', ja: 'リソースが見つかりません', zh: '资源未找到', ar: 'لم يتم العثور على المورد', hi: 'संसाधन नहीं मिला' },
  { key: 'error.serverError', category: 'Messages', en: 'Server error. Please try again later.', es: 'Error del servidor. Intente de nuevo más tarde.', fr: 'Erreur serveur. Veuillez réessayer plus tard.', de: 'Serverfehler. Bitte versuchen Sie es später erneut.', pt: 'Erro de servidor. Tente novamente mais tarde.', it: 'Errore del server. Per favore riprova più tardi.', ja: 'サーバーエラー。後で試してください。', zh: '服务器错误。请稍后重试。', ar: 'خطأ في الخادم. يرجى المحاولة لاحقا.', hi: 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।' },
  { key: 'error.networkError', category: 'Messages', en: 'Network error. Check your connection.', es: 'Error de red. Comprueba tu conexión.', fr: 'Erreur réseau. Vérifiez votre connexion.', de: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.', pt: 'Erro de rede. Verifique sua conexão.', it: 'Errore di rete. Controlla la tua connessione.', ja: 'ネットワークエラー。接続を確認してください。', zh: '网络错误。检查您的连接。', ar: 'خطأ في الشبكة. تحقق من اتصالك.', hi: 'नेटवर्क त्रुटि। अपने कनेक्शन की जांच करें।' },

  // --------------------------------------------------------------------------
  // Student Features
  // --------------------------------------------------------------------------
  { key: 'student.myClasses', category: 'Student', en: 'My Classes', es: 'Mis Clases', fr: 'Mes Classes', de: 'Meine Klassen', pt: 'Minhas Turmas', it: 'Le mie classi', ja: '私のクラス', zh: '我的班级', ar: 'فئاتي', hi: 'मेरी कक्षाएं' },
  { key: 'student.myGrades', category: 'Student', en: 'My Grades', es: 'Mis Calificaciones', fr: 'Mes Notes', de: 'Meine Noten', pt: 'Minhas Notas', it: 'I miei voti', ja: '私の成績', zh: '我的成绩', ar: 'درجاتي', hi: 'मेरे ग्रेड' },
  { key: 'student.myAttendance', category: 'Student', en: 'My Attendance', es: 'Mi Asistencia', fr: 'Ma Présence', de: 'Meine Anwesenheit', pt: 'Minha Presença', it: 'La mia frequenza', ja: '私の出席', zh: '我的出席', ar: 'حضوري', hi: 'मेरी उपस्थिति' },
  { key: 'student.assignments', category: 'Student', en: 'Assignments', es: 'Asignaciones', fr: 'Missions', de: 'Aufgaben', pt: 'Atribuições', it: 'Compiti', ja: '課題', zh: '作业', ar: 'المهام', hi: 'असाइनमेंट' },

  // --------------------------------------------------------------------------
  // Teacher Features
  // --------------------------------------------------------------------------
  { key: 'teacher.myClasses', category: 'Teacher', en: 'My Classes', es: 'Mis Clases', fr: 'Mes Classes', de: 'Meine Klassen', pt: 'Minhas Turmas', it: 'Le mie classi', ja: '私のクラス', zh: '我的班级', ar: 'فئاتي', hi: 'मेरी कक्षाएं' },
  { key: 'teacher.attendance', category: 'Teacher', en: 'Mark Attendance', es: 'Marcar Asistencia', fr: 'Marquer la Présence', de: 'Anwesenheit markieren', pt: 'Marcar Presença', it: 'Segna Frequenza', ja: '出席をマーク', zh: '标记出席', ar: 'علامة الحضور', hi: 'उपस्थिति चिह्नित करें' },
  { key: 'teacher.grades', category: 'Teacher', en: 'Enter Grades', es: 'Ingresar Calificaciones', fr: 'Entrer les Notes', de: 'Noten eingeben', pt: 'Inserir Notas', it: 'Inserisci Voti', ja: '成績を入力', zh: '输入成绩', ar: 'إدخال الدرجات', hi: 'ग्रेड दर्ज करें' },
  { key: 'teacher.createAssignment', category: 'Teacher', en: 'Create Assignment', es: 'Crear Asignación', fr: 'Créer une Mission', de: 'Aufgabe erstellen', pt: 'Criar Atribuição', it: 'Crea Compito', ja: '課題を作成', zh: '创建作业', ar: 'إنشاء مهمة', hi: 'असाइनमेंट बनाएं' },

  // --------------------------------------------------------------------------
  // Breadcrumb
  // --------------------------------------------------------------------------
  { key: 'breadcrumb.home', category: 'Breadcrumb', en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite', pt: 'Início', it: 'Home', ja: 'ホーム', zh: '首页', ar: 'الرئيسية', hi: 'होम' },
  { key: 'breadcrumb.dashboard', category: 'Breadcrumb', en: 'Dashboard', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard', pt: 'Painel', it: 'Dashboard', ja: 'ダッシュボード', zh: '仪表板', ar: 'لوحة القيادة', hi: 'डैशबोर्ड' },
  { key: 'breadcrumb.back', category: 'Breadcrumb', en: 'Back', es: 'Atrás', fr: 'Retour', de: 'Zurück', pt: 'Voltar', it: 'Indietro', ja: '戻る', zh: '返回', ar: 'رجوع', hi: 'वापस' },
  { key: 'breadcrumb.copyLink', category: 'Breadcrumb', en: 'Copy page link', es: 'Copiar enlace', fr: 'Copier le lien', de: 'Link kopieren', pt: 'Copiar link', it: 'Copia link', ja: 'リンクをコピー', zh: '复制链接', ar: 'نسخ الرابط', hi: 'लिंक कॉपी करें' },
  { key: 'breadcrumb.linkCopied', category: 'Breadcrumb', en: 'Link copied to clipboard', es: 'Enlace copiado al portapapeles', fr: 'Lien copié', de: 'Link kopiert', pt: 'Link copiado', it: 'Link copiato', ja: 'リンクをコピーしました', zh: '链接已复制', ar: 'تم نسخ الرابط', hi: 'लिंक कॉपी हो गया' },
  { key: 'breadcrumb.createExam', category: 'Breadcrumb', en: 'Create Exam', es: 'Crear Examen', fr: 'Créer un examen', de: 'Prüfung erstellen', pt: 'Criar Exame', it: 'Crea Esame', ja: '試験の作成', zh: '创建考试', ar: 'إنشاء امتحان', hi: 'परीक्षा बनाएं' },
  { key: 'breadcrumb.editExam', category: 'Breadcrumb', en: 'Edit Exam', es: 'Editar Examen', fr: 'Modifier l\'examen', de: 'Prüfung bearbeiten', pt: 'Editar Exame', it: 'Modifica Esame', ja: '試験を編集', zh: '编辑考试', ar: 'تعديل الامتحان', hi: 'परीक्षा संपादित करें' },
  { key: 'breadcrumb.marksEntry', category: 'Breadcrumb', en: 'Mark Entry', es: 'Ingreso de Calificaciones', fr: 'Saisie des notes', de: 'Noteneingabe', pt: 'Lançamento de Notas', it: 'Inserimento Voti', ja: '成績入力', zh: '成绩录入', ar: 'إدخال الدرجات', hi: 'अंक प्रविष्टि' },
  { key: 'breadcrumb.createEvent', category: 'Breadcrumb', en: 'Create Event', es: 'Crear Evento', fr: 'Créer un événement', de: 'Ereignis erstellen', pt: 'Criar Evento', it: 'Crea Evento', ja: 'イベント作成', zh: '创建活动', ar: 'إنشاء حدث', hi: 'इवेंट बनाएं' },
  { key: 'breadcrumb.editEvent', category: 'Breadcrumb', en: 'Edit Event', es: 'Editar Evento', fr: 'Modifier l\'événement', de: 'Ereignis bearbeiten', pt: 'Editar Evento', it: 'Modifica Evento', ja: 'イベント編集', zh: '编辑活动', ar: 'تعديل الحدث', hi: 'इवेंट संपादित करें' },
  { key: 'breadcrumb.childDetails', category: 'Breadcrumb', en: 'Child Details', es: 'Detalles del Hijo', fr: 'Détails de l\'enfant', de: 'Kinddetails', pt: 'Detalhes do Filho', it: 'Dettagli Figlio', ja: '子どもの詳細', zh: '孩子详情', ar: 'تفاصيل الطفل', hi: 'बच्चे का विवरण' },
  { key: 'breadcrumb.conversation', category: 'Breadcrumb', en: 'Conversation', es: 'Conversación', fr: 'Conversation', de: 'Unterhaltung', pt: 'Conversa', it: 'Conversazione', ja: '会話', zh: '对话', ar: 'محادثة', hi: 'बातचीत' },

  // --------------------------------------------------------------------------
  // Footer
  // --------------------------------------------------------------------------
  { key: 'footer.rights', category: 'Footer', en: 'All rights reserved.', es: 'Todos los derechos reservados.', fr: 'Tous droits réservés.', de: 'Alle Rechte vorbehalten.', pt: 'Todos os direitos reservados.', it: 'Tutti i diritti riservati.', ja: '著作権所有。', zh: '版权所有。', ar: 'جميع الحقوق محفوظة.', hi: 'सर्वाधिकार सुरक्षित।' },
  { key: 'footer.systemName', category: 'Footer', en: 'School Management System', es: 'Sistema de Gestión Escolar', fr: 'Système de Gestion Scolaire', de: 'Schulverwaltungssystem', pt: 'Sistema de Gestão Escolar', it: 'Sistema di Gestione Scolastica', ja: '学校管理システム', zh: '学校管理系统', ar: 'نظام إدارة المدرسة', hi: 'स्कूल प्रबंधन प्रणाली' },
] as const satisfies readonly StringEntry[]

export const CATEGORIES = Array.from(new Set(STRINGS.map((item) => item.category)))

// Derived lookup map for English, e.g. { 'header.searchPlaceholder': 'Search students...' }
export const EN_TRANSLATIONS: Record<string, string> = Object.fromEntries(
  STRINGS.map((entry) => [entry.key, entry.en]),
)

export type TranslationKey = (typeof STRINGS)[number]['key']